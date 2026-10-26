import Link from "next/link";

export function LogoMark({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <rect width="32" height="32" rx="9" fill="#ffb547" />
      <path
        d="M21.5 11.2c-1.2-1.6-3-2.4-5.3-2.4-3 0-5 1.5-5 3.8 0 2.3 1.8 3.2 4.6 3.9 2.2.5 3 .9 3 1.8 0 .9-.9 1.4-2.3 1.4-1.6 0-2.9-.7-3.9-2l-2.4 2.2c1.4 1.9 3.6 2.9 6.2 2.9 3.2 0 5.3-1.6 5.3-4.1 0-2.5-1.9-3.4-4.7-4-2-.5-2.8-.8-2.8-1.6 0-.7.7-1.2 1.9-1.2 1.2 0 2.1.5 2.9 1.5l2.5-2.2z"
        fill="#1c1203"
      />
    </svg>
  );
}

export function Logo({ href = "/" }: { href?: string }) {
  return (
    <Link href={href} className="inline-flex items-center gap-2.5 font-display text-[1.05rem] font-bold tracking-tight">
      <LogoMark />
      <span>
        SION <span className="text-sun">Ads</span>
      </span>
    </Link>
  );
}
