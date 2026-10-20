import { NextRequest, NextResponse } from "next/server";
import { publishToFacebookPage } from "@/lib/meta";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { pageId, accessToken, message, mediaUrl, isReel } = body;

    const token = accessToken || process.env.META_ACCESS_TOKEN_LONG_LIVED;
    const fbPageId = pageId || process.env.META_PAGE_ID;

    if (!message) {
      return NextResponse.json(
        { error: "Le texte ou message de publication est requis." },
        { status: 400 }
      );
    }

    let publishResultId = `post_sim_${Date.now()}`;

    // Si les clés réelles sont présentes, on effectue la publication réelle
    if (token && fbPageId) {
      const result = await publishToFacebookPage({
        pageId: fbPageId,
        accessToken: token,
        message,
        mediaUrl,
        isReel,
      });
      publishResultId = result.id || result.post_id;
    }

    return NextResponse.json({
      success: true,
      postId: publishResultId,
      isSimulated: !token || !fbPageId,
      message: token && fbPageId
        ? "Contenu publié avec succès sur votre page Meta !"
        : "Contenu validé et prêt à être diffusé (connectez vos clés Meta dans .env.local pour poster en réel).",
    });
  } catch (error: any) {
    console.error("Erreur API Publication Meta :", error);
    return NextResponse.json(
      { error: error?.message || "Échec de la publication." },
      { status: 500 }
    );
  }
}
