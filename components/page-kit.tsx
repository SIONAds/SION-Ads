import Link from "next/link";
import type { ReactNode } from "react";

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold sm:text-4xl">{title}</h1>
        {description && <p className="mt-2 max-w-2xl text-muted">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function EmptyState({
  title,
  text,
  href,
  cta,
}: {
  title: string;
  text: string;
  href?: string;
  cta?: string;
}) {
  return (
    <div className="card flex flex-col items-center px-6 py-14 text-center">
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className="mt-2 max-w-md text-muted">{text}</p>
      {href && cta && (
        <Link href={href} className="btn btn-primary mt-6">
          {cta}
        </Link>
      )}
    </div>
  );
}

export function Stat({ label, value, hint }: { label: string; value: ReactNode; hint?: string }) {
  return (
    <div className="card p-5">
      <p className="text-sm text-muted">{label}</p>
      <p className="num mt-2 text-2xl font-semibold">{value}</p>
      {hint && <p className="mt-1 text-xs text-faint">{hint}</p>}
    </div>
  );
}

const STATUS: Record<string, { label: string; cls: string }> = {
  DRAFT: { label: "Brouillon", cls: "" },
  PAUSED: { label: "En pause", cls: "badge-sun" },
  ACTIVE: { label: "Active", cls: "badge-ok" },
  ARCHIVED: { label: "Archivée", cls: "" },
  draft: { label: "Brouillon", cls: "" },
  analyzed: { label: "Analysée", cls: "badge-info" },
  creatives_ready: { label: "Créatifs prêts", cls: "badge-sun" },
  live: { label: "En ligne", cls: "badge-ok" },
};

export function StatusBadge({ status }: { status: string }) {
  const s = STATUS[status] ?? { label: status, cls: "" };
  return <span className={`badge ${s.cls}`}>{s.label}</span>;
}
