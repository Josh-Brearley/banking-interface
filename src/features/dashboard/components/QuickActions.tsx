import { useState } from "react";
import { Link } from "react-router-dom";
import { Modal } from "@/components/ui";
import { cn } from "@/lib/utils";

interface ActionTile {
  label: string;
  to?: string;
  onClick?: () => void;
}

/** Common tasks — responsive grid: 2-up on mobile, 4-up from md. */
export function QuickActions() {
  const [transferOpen, setTransferOpen] = useState(false);

  const tiles: ActionTile[] = [
    { label: "Transfer money", onClick: () => setTransferOpen(true) },
    { label: "View accounts", to: "/accounts" },
    { label: "View transactions", to: "/transactions" },
    { label: "Manage profile", to: "/profile" },
  ];

  const tileClass =
    "flex min-h-[88px] flex-col justify-end rounded-lg border border-border bg-surface p-4 text-body font-medium shadow-xs transition-all hover:-translate-y-0.5 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

  return (
    <section aria-label="Quick actions">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {tiles.map((tile) =>
          tile.to ? (
            <Link key={tile.label} to={tile.to} className={tileClass}>
              {tile.label}
            </Link>
          ) : (
            <button
              key={tile.label}
              type="button"
              onClick={tile.onClick}
              className={cn(tileClass, "text-left")}
            >
              {tile.label}
            </button>
          ),
        )}
      </div>

      <Modal
        open={transferOpen}
        onClose={() => setTransferOpen(false)}
        title="Transfer money"
        description="Move money between your accounts."
      >
        <p className="text-body text-foreground-muted">
          Transfers are coming soon. This is a demo environment, so no money is
          moved.
        </p>
      </Modal>
    </section>
  );
}
