import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/app/providers/AuthProvider";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { PageHeader } from "@/components/molecules/PageHeader";
import {
  Button,
  Card,
  CardContent,
  ErrorState,
  Skeleton,
  SkeletonRegion,
  IconLogout,
} from "@/components/atoms";
import { useProfile } from "../hooks/useProfile";
import { ProfileView } from "../components/ProfileView";
import { ProfileForm } from "../components/ProfileForm";

export function ProfilePage() {
  useDocumentTitle("Profile");
  const { data: profile, isPending, isError, refetch } = useProfile();
  // Logout comes from the shared auth context (cross-feature comms go via
  // context, not another feature's internals — specs/01-architecture.md §3).
  const { user, setUser, logout } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [justSaved, setJustSaved] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await logout();
    navigate("/login", { replace: true });
  };

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
          onAvatarChange={(url) => user && setUser({ ...user, avatarUrl: url })}
        />
      )}

      {/* Logout lives here (moved off the side nav) — AUTH-FR-10. */}
      {!isEditing && (
        <Card className="mt-6">
          <CardContent className="flex flex-wrap items-center justify-between gap-4 py-4">
            <div>
              <p className="text-body font-medium">Sign out</p>
              <p className="text-body-sm text-foreground-muted">
                End your session on this device.
              </p>
            </div>
            <Button
              variant="outline"
              onClick={handleLogout}
              isLoading={isLoggingOut}
              leftIcon={<IconLogout className="h-4 w-4" />}
            >
              Log out
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
