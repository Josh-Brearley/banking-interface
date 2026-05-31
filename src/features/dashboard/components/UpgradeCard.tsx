import { useState } from "react";
import { Card, Modal, Button, IconBriefcase } from "@/components/atoms";
import { CardGraphic } from "@/components/molecules/CardGraphic";

/**
 * Promotional "switch to business" card for the dashboard rail. It's a demo
 * upsell, the CTA opens a coming-soon modal rather than changing any data.
 */
export function UpgradeCard() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Card className="bg-brand-gradient relative overflow-hidden p-6 text-primary-foreground">
        <CardGraphic tone="secondary" className="text-white/25" />

        <span
          className="relative flex h-11 w-11 items-center justify-center rounded-full bg-white/15"
          aria-hidden="true"
        >
          <IconBriefcase className="h-6 w-6" />
        </span>

        <h3 className="relative mt-4 text-h3 text-primary-foreground">
          Switch to business
        </h3>
        <p className="relative mt-1 text-body-sm text-primary-foreground/85">
          Unlock multi-user access, expense cards and richer reporting for your
          company.
        </p>

        <Button
          variant="secondary"
          size="sm"
          className="relative mt-4 border-transparent bg-surface text-primary hover:bg-surface/90"
          onClick={() => setOpen(true)}
        >
          Try now
        </Button>
      </Card>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Switch to business"
        description="Upgrade your personal account to a business account."
      >
        <p className="text-body text-foreground-muted">
          Business accounts are coming soon. This is a demo environment, so your
          account is unchanged.
        </p>
      </Modal>
    </>
  );
}
