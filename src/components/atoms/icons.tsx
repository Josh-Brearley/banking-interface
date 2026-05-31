import type { SVGProps } from "react";
import { cn } from "@/lib/utils";

/**
 * Lightweight inline icon set (stroke = currentColor) so the dashboard chrome
 * needs no icon dependency. Icons are decorative by default (aria-hidden);
 * pass `title` only where the icon carries standalone meaning.
 */
type IconProps = SVGProps<SVGSVGElement> & { title?: string };

function Icon({ title, className, children, ...rest }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={title ? undefined : true}
      role={title ? "img" : undefined}
      className={cn("h-5 w-5 shrink-0", className)}
      {...rest}
    >
      {title ? <title>{title}</title> : null}
      {children}
    </svg>
  );
}

export function IconDashboard(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M3 10.5 12 4l9 6.5" />
      <path d="M5 9.5V20h14V9.5" />
      <path d="M9.5 20v-5h5v5" />
    </Icon>
  );
}

export function IconAccounts(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M5 20V11M10 20v-9M14 20v-9M19 20v-9" />
      <path d="M3 9.5 12 4l9 5.5" />
      <path d="M3.5 20h17" />
    </Icon>
  );
}

export function IconTransactions(props: IconProps) {
  return (
    <Icon {...props}>
      <rect x="3" y="5.5" width="18" height="13" rx="2.5" />
      <path d="M3 9.5h18" />
      <path d="M7 14.5h4" />
    </Icon>
  );
}

export function IconProfile(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="8.5" r="3.5" />
      <path d="M5 19.5a7 7 0 0 1 14 0" />
    </Icon>
  );
}

export function IconLogout(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M15 4h2.5A1.5 1.5 0 0 1 19 5.5v13a1.5 1.5 0 0 1-1.5 1.5H15" />
      <path d="M10 12h9" />
      <path d="m16 9 3 3-3 3" />
    </Icon>
  );
}

export function IconTransfer(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M5 9h12" />
      <path d="m13 5 4 4-4 4" />
      <path d="M19 15H7" />
      <path d="m11 19-4-4 4-4" />
    </Icon>
  );
}

export function IconRequest(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M12 5v9" />
      <path d="m8 10 4 4 4-4" />
      <path d="M5 19h14" />
    </Icon>
  );
}

export function IconHistory(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M3.5 12a8.5 8.5 0 1 1 2.6 6.1" />
      <path d="M3.5 19v-4h4" />
      <path d="M12 8v4l2.5 1.5" />
    </Icon>
  );
}

export function IconArrowUpRight(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M7 17 17 7" />
      <path d="M9 7h8v8" />
    </Icon>
  );
}

export function IconArrowDownRight(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M7 7 17 17" />
      <path d="M17 9v8H9" />
    </Icon>
  );
}

export function IconPlus(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </Icon>
  );
}

export function IconBriefcase(props: IconProps) {
  return (
    <Icon {...props}>
      <rect x="3" y="7.5" width="18" height="12" rx="2.5" />
      <path d="M8.5 7.5V6a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v1.5" />
      <path d="M3 12.5h18" />
    </Icon>
  );
}

export function IconSearch(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m20 20-3.5-3.5" />
    </Icon>
  );
}

export function IconBell(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6" />
      <path d="M10.5 19a1.5 1.5 0 0 0 3 0" />
    </Icon>
  );
}

export function IconMail(props: IconProps) {
  return (
    <Icon {...props}>
      <rect x="3" y="5" width="18" height="14" rx="2.5" />
      <path d="m3.5 7 8.5 6 8.5-6" />
    </Icon>
  );
}

export function IconLock(props: IconProps) {
  return (
    <Icon {...props}>
      <rect x="4.5" y="10.5" width="15" height="9.5" rx="2.5" />
      <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" />
      <path d="M12 14.5v2" />
    </Icon>
  );
}

export function IconShieldCheck(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M12 3.5 5 6.2v5.1c0 4.3 2.9 7.4 7 8.7 4.1-1.3 7-4.4 7-8.7V6.2L12 3.5Z" />
      <path d="m9 12 2 2 4-4" />
    </Icon>
  );
}

export function IconEye(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" />
      <circle cx="12" cy="12" r="3" />
    </Icon>
  );
}

export function IconEyeOff(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M9.9 5.7A9.8 9.8 0 0 1 12 5.5c6 0 9.5 6.5 9.5 6.5a16.4 16.4 0 0 1-3 3.6" />
      <path d="M6.3 7.3A16.4 16.4 0 0 0 2.5 12S6 18.5 12 18.5a9.6 9.6 0 0 0 4-.85" />
      <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
      <path d="m4 4 16 16" />
    </Icon>
  );
}
