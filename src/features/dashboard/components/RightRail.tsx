import { type ReactNode } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/app/providers/AuthProvider";
import {
  Avatar,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  IconAccounts,
  IconTransactions,
  IconProfile,
} from "@/components/atoms";
import { CardGraphic } from "@/components/molecules/CardGraphic";
import { UpgradeCard } from "./UpgradeCard";

interface RailLink {
  to: string;
  label: string;
  icon: ReactNode;
}

const LINKS: RailLink[] = [
  { to: "/accounts", label: "View accounts", icon: <IconAccounts /> },
  { to: "/transactions", label: "View transactions", icon: <IconTransactions /> },
  { to: "/profile", label: "Manage profile", icon: <IconProfile /> },
];

/** Dashboard side rail: who's signed in plus shortcuts into the rest of the app. */
export function RightRail({ accountsCount }: { accountsCount: number }) {
  const { user } = useAuth();
  const name = user?.fullName ?? "Your account";

  return (
    <aside aria-label="Account summary" className="flex flex-col gap-4">
      <Card className="relative overflow-hidden text-center">
        <div className="relative h-20 bg-secondary-subtle/50">
          <CardGraphic tone="secondary" className="opacity-40" />
        </div>
        <div className="px-6 pb-6">
          <Avatar
            name={name}
            src={user?.avatarUrl}
            size="lg"
            className="relative mx-auto -mt-9 ring-4 ring-surface"
          />
          <p className="mt-3 text-h3 text-foreground">{name}</p>
          <p className="text-body-sm text-foreground-muted">Personal account</p>
          <p className="mt-4 inline-block rounded-full bg-secondary-subtle px-3 py-1 text-caption font-medium text-primary">
            {accountsCount} account{accountsCount === 1 ? "" : "s"}
          </p>
        </div>
      </Card>

      <Card className="relative overflow-hidden">
        <CardGraphic tone="secondary" className="opacity-50" />
        <CardHeader className="relative">
          <CardTitle>Quick links</CardTitle>
        </CardHeader>
        <CardContent className="relative">
          <ul className="flex flex-col gap-1">
            {LINKS.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-body font-medium text-foreground-muted transition-colors hover:bg-surface-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <span
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary-subtle text-primary"
                    aria-hidden="true"
                  >
                    {link.icon}
                  </span>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <UpgradeCard />
    </aside>
  );
}
