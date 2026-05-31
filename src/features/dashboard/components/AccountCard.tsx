import { useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import {
  Button,
  Card,
  Modal,
  IconTransfer,
  IconRequest,
  IconHistory,
  IconPlus,
} from "@/components/atoms";
import { MoneyAmount } from "@/components/molecules/MoneyAmount";
import { CardGraphic } from "@/components/molecules/CardGraphic";

/**
 * Dashboard hero, the "My Card" panel: brand debit card visual alongside the
 * total balance and the most common money actions. Total balance is the only
 * figure here and comes straight from the summary (no fabricated values).
 */
export function AccountCard({
  totalBalanceMinor,
  accountsCount,
}: {
  totalBalanceMinor: number;
  accountsCount: number;
}) {
  const [transferOpen, setTransferOpen] = useState(false);
  const [requestOpen, setRequestOpen] = useState(false);
  const [newCardOpen, setNewCardOpen] = useState(false);

  return (
    <Card className="bg-surface-tinted relative overflow-hidden p-5 sm:p-6">
      <CardGraphic tone="secondary" className="opacity-60" />

      <div className="relative flex items-center justify-between gap-3">
        <h2 className="text-h3 text-foreground">My card</h2>
        <Button
          variant="outline"
          size="sm"
          rightIcon={<IconPlus className="h-4 w-4" />}
          onClick={() => setNewCardOpen(true)}
        >
          New card
        </Button>
      </div>

      <div className="relative mt-4 flex flex-col gap-6 lg:flex-row lg:items-center">
        <img
          src="/images/debit-card.png"
          alt="Eagle Bank Visa debit card"
          className="w-full max-w-[340px] self-center rounded-[14px] shadow-md lg:w-[44%] lg:self-auto"
          loading="eager"
          decoding="async"
        />

        <div className="flex-1">
          <p className="text-body-sm font-medium text-foreground-muted">
            Total balance
          </p>
          <MoneyAmount
            amountMinor={totalBalanceMinor}
            className="mt-1 block text-display tabular-nums"
          />
          <p className="mt-1 text-caption text-foreground-muted">
            Across {accountsCount} account{accountsCount === 1 ? "" : "s"}
          </p>

          <div className="mt-5 flex gap-2">
            <CardAction
              icon={<IconTransfer />}
              label="Transfer"
              onClick={() => setTransferOpen(true)}
            />
            <CardAction
              icon={<IconRequest />}
              label="Request"
              onClick={() => setRequestOpen(true)}
            />
            <CardAction
              icon={<IconHistory />}
              label="History"
              to="/transactions"
            />
          </div>
        </div>
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

      <Modal
        open={requestOpen}
        onClose={() => setRequestOpen(false)}
        title="Request money"
        description="Ask someone to send you money."
      >
        <p className="text-body text-foreground-muted">
          Payment requests are coming soon. This is a demo environment.
        </p>
      </Modal>

      <Modal
        open={newCardOpen}
        onClose={() => setNewCardOpen(false)}
        title="Order a new card"
        description="Add a new debit or credit card to your account."
      >
        <p className="text-body text-foreground-muted">
          New card ordering is coming soon. This is a demo environment, so no
          card is issued.
        </p>
      </Modal>
    </Card>
  );
}

interface CardActionProps {
  icon: ReactNode;
  label: string;
  to?: string;
  onClick?: () => void;
}

const actionClass =
  "flex flex-1 flex-col items-center gap-1.5 rounded-lg border border-border bg-surface px-2 py-3 text-caption font-medium text-foreground transition-all hover:-translate-y-0.5 hover:border-secondary hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

function CardAction({ icon, label, to, onClick }: CardActionProps) {
  const inner = (
    <>
      <span
        className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary-subtle text-primary"
        aria-hidden="true"
      >
        {icon}
      </span>
      {label}
    </>
  );

  return to ? (
    <Link to={to} className={actionClass}>
      {inner}
    </Link>
  ) : (
    <button type="button" onClick={onClick} className={actionClass}>
      {inner}
    </button>
  );
}
