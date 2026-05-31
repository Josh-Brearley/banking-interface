import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/app/providers/AuthProvider";
import {
  IconBell,
  IconShieldCheck,
  IconTransfer,
  Spinner,
} from "@/components/atoms";
import { BrandLogo } from "@/components/molecules/BrandLogo";
import { CardGraphic } from "@/components/molecules/CardGraphic";

/** Selling points shown on the brand panel, honest, capability-level claims. */
const HIGHLIGHTS = [
  {
    icon: <IconShieldCheck />,
    title: "Bank-grade security",
    body: "256-bit encryption and session protection on every sign-in.",
  },
  {
    icon: <IconTransfer />,
    title: "Move money in seconds",
    body: "Transfer between accounts and track every payment, 24/7.",
  },
  {
    icon: <IconBell />,
    title: "Always in the know",
    body: "A clear view of your balance and recent activity at a glance.",
  },
];

/**
 * Public layout for /login and /register, AUTH-FR-09. A two-column banking
 * sign-in: an immersive brand panel (lg+) beside the auth form. Already-
 * authenticated users are redirected to the dashboard.
 */
export function AuthLayout() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner className="h-6 w-6 text-primary" />
      </div>
    );
  }

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  return (
    <div className="flex min-h-screen bg-background">
      {/* Brand panel, immersive marketing surface, lg and up. */}
      <aside className="bg-brand-gradient relative hidden w-[44%] max-w-2xl shrink-0 flex-col justify-between overflow-hidden p-12 text-primary-foreground lg:flex">
        <CardGraphic
          tone="secondary"
          className="left-0 right-auto top-0 h-72 w-[28rem] text-white/25"
        />
        <CardGraphic
          tone="secondary"
          className="bottom-0 right-0 top-auto h-72 w-[28rem] rotate-180 text-white/15"
        />

        {/* Monochrome white lockup so the brand reads on the dark panel. */}
        <BrandLogo
          variant="full"
          className="relative -ml-2 h-auto w-72 self-start brightness-0 invert"
        />

        <div className="relative max-w-md">
          <p className="text-display">Banking that keeps up with you.</p>
          <p className="mt-4 text-body text-white/80">
            Manage your accounts, move money and stay on top of every
            transaction, all in one secure place.
          </p>

          <ul className="mt-10 flex flex-col gap-6">
            {HIGHLIGHTS.map((item) => (
              <li key={item.title} className="flex items-start gap-4">
                <span
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-white/15 text-white ring-1 ring-inset ring-white/20"
                  aria-hidden="true"
                >
                  {item.icon}
                </span>
                <div>
                  <p className="text-body font-semibold">{item.title}</p>
                  <p className="mt-0.5 text-body-sm text-white/75">
                    {item.body}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-caption text-white/60">
          © {2026} Eagle Bank. Authorised &amp; regulated, demo environment.
        </p>
      </aside>

      {/* Auth form column. */}
      <main className="flex flex-1 flex-col px-4 py-8 sm:px-6">
        <div className="mb-8 lg:hidden">
          <BrandLogo variant="full" className="-ml-2 h-auto w-52" />
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-md">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
