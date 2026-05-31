import { useState } from "react";
import { useAuth } from "@/app/providers/AuthProvider";
import { PageHeader } from "@/components/shared/PageHeader";
import {
  Card,
  CardContent,
  ErrorState,
  Skeleton,
  SkeletonRegion,
} from "@/components/ui";
import { useProfile } from "../hooks/useProfile";
import { ProfileView } from "../components/ProfileView";
import { ProfileForm } from "../components/ProfileForm";

export function ProfilePage() {
  const { data: profile, isPending, isError, refetch } = useProfile();
  const { user, setUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [justSaved, setJustSaved] = useState(false);

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title="Profile" subtitle="Manage your personal details." />

      {justSaved && !isEditing && (
        <div
          role="status"
          className="mb-4 rounded-md bg-success-subtle px-3 py-2 text-body-sm text-success"
        >
          Profile updated
        </div>
      )}

      {isPending ? (
        <SkeletonRegion label="Loading profile">
          <Card>
            <CardContent className="flex flex-col gap-4 pt-6">
              <Skeleton className="h-16 w-16 rounded-full" />
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-5 w-64" />
              <Skeleton className="h-5 w-40" />
            </CardContent>
          </Card>
        </SkeletonRegion>
      ) : isError ? (
        <Card>
          <ErrorState
            title="We couldn't load your profile"
            onRetry={() => refetch()}
          />
        </Card>
      ) : isEditing ? (
        <ProfileForm
          profile={profile}
          onCancel={() => setIsEditing(false)}
          onSaved={() => {
            setIsEditing(false);
            setJustSaved(true);
          }}
        />
      ) : (
        <ProfileView
          profile={profile}
          onEdit={() => {
            setJustSaved(false);
            setIsEditing(true);
          }}
          onAvatarChange={(url) =>
            user && setUser({ ...user, avatarUrl: url })
          }
        />
      )}
    </div>
  );
}
