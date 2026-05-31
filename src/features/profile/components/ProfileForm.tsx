import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Card, CardContent, Input } from "@/components/ui";
import { ApiError } from "@/lib/api/client";
import type { User } from "@/types";
import {
  profileSchema,
  type ProfileFormValues,
} from "../schemas/profile.schema";
import { useUpdateProfile } from "../hooks/useProfile";

function toFormValues(profile: User): ProfileFormValues {
  return {
    fullName: profile.fullName,
    email: profile.email,
    phoneNumber: profile.phoneNumber ?? "",
    address: {
      line1: profile.address?.line1 ?? "",
      line2: profile.address?.line2 ?? "",
      city: profile.address?.city ?? "",
      postcode: profile.address?.postcode ?? "",
      country: profile.address?.country ?? "GB",
    },
  };
}

export function ProfileForm({
  profile,
  onCancel,
  onSaved,
}: {
  profile: User;
  onCancel: () => void;
  onSaved: () => void;
}) {
  const update = useUpdateProfile();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isDirty },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    mode: "onChange",
    defaultValues: toFormValues(profile),
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      await update.mutateAsync(values);
      onSaved();
    } catch (err) {
      if (err instanceof ApiError && err.fieldErrors) {
        for (const [field, message] of Object.entries(err.fieldErrors)) {
          setError(field as keyof ProfileFormValues, { message });
        }
      }
    }
  });

  return (
    <Card>
      <CardContent className="pt-6">
        <form className="flex flex-col gap-4" onSubmit={onSubmit} noValidate>
          <Input
            label="Full name"
            autoComplete="name"
            error={errors.fullName?.message}
            {...register("fullName")}
          />
          <Input
            label="Email"
            type="email"
            autoComplete="email"
            error={errors.email?.message}
            {...register("email")}
          />
          <Input
            label="Phone number"
            type="tel"
            autoComplete="tel"
            error={errors.phoneNumber?.message}
            {...register("phoneNumber")}
          />

          <fieldset className="flex flex-col gap-4 rounded-lg border border-border p-4">
            <legend className="px-1 text-body-sm font-medium">Address</legend>
            <Input
              label="Address line 1"
              error={errors.address?.line1?.message}
              {...register("address.line1")}
            />
            <Input
              label="Address line 2"
              error={errors.address?.line2?.message}
              {...register("address.line2")}
            />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input
                label="City"
                error={errors.address?.city?.message}
                {...register("address.city")}
              />
              <Input
                label="Postcode"
                error={errors.address?.postcode?.message}
                {...register("address.postcode")}
              />
            </div>
            <Input
              label="Country"
              error={errors.address?.country?.message}
              {...register("address.country")}
            />
          </fieldset>

          <div className="flex items-center gap-3">
            <Button type="submit" isLoading={update.isPending} disabled={!isDirty}>
              Save changes
            </Button>
            <Button type="button" variant="ghost" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
