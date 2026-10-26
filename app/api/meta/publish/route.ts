import { NextResponse, type NextRequest } from "next/server";
import { getApiUser } from "@/lib/auth";
import { metaPageConfigured, publishToPage } from "@/lib/meta";
import { publishInputSchema } from "@/lib/schemas";
import { badRequest, serverError, unauthorized } from "@/lib/api";

export async function POST(req: NextRequest) {
  const auth = await getApiUser();
  if (!auth) return unauthorized();

  const parsed = publishInputSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return badRequest(parsed.error);

  if (!metaPageConfigured()) {
    return NextResponse.json(
      { error: "Page Facebook non connectée : renseignez META_ACCESS_TOKEN_LONG_LIVED et META_PAGE_ID." },
      { status: 400 },
    );
  }

  try {
    const result = await publishToPage(parsed.data);
    return NextResponse.json({ postId: result.post_id ?? result.id ?? null });
  } catch (error) {
    return serverError(error, "Échec de la publication.");
  }
}
