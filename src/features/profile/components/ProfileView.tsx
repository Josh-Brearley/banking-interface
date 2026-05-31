import { Button, Card, CardContent } from "@/components/atoms";
import type { User } from "@/types";
import { AvatarUpload } from "./AvatarUpload";

function Field({ label, value }: { label: string; value?: string }) {
  return (
    <div className="py-3">
      <dt className="text-caption text-foreground-muted">{label}</dt>
      <dd className="mt-0.5 text-body">{value || "—"}</dd>
    </div>
  );
}

export function ProfileView({
  profile,
  onEdit,
  onAvatarChange,
}: {
  profile: User;
  onEdit: () => void;
  onAvatarChange?: (url: string) => void;
}) {
  const address = profile.address;
  const addressLine = address
    ? [
        address.line1,
        address.line2,
        address.city,
        address.postcode,
        address.country,
      ]
        .filter(Boolean)
        .join(", ")
    : undefined;

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="mb-6">
          <AvatarUpload
            name={profile.fullName}
            src={profile.avatarUrl}
            onChange={onAvatarChange}
          />
        </div>

        <dl className="divide-y divide-border">
          <Field label="Full name" value={profile.fullName} />
          <Field label="Email" value={profile.email} />
          <Field label="Phone number" value={profile.phoneNumber} />
          <Field label="Address" value={addressLine} />
        </dl>

        <div className="mt-6">
          <Button onClick={onEdit}>Edit profile</Button>
        </div>
      </CardContent>
    </Card>
  );
}
