import { useId, useRef, useState, type ChangeEvent } from "react";
import { Avatar } from "@/components/ui";

const MAX_BYTES = 2 * 1024 * 1024;
const ACCEPTED = ["image/png", "image/jpeg", "image/webp"];

interface AvatarUploadProps {
  name: string;
  src?: string;
  /** Called with an object URL when a valid image is chosen (frontend-only). */
  onChange?: (objectUrl: string) => void;
}

/** Frontend-only avatar upload with client-side validation (PROF-FR-07). */
export function AvatarUpload({ name, src, onChange }: AvatarUploadProps) {
  const inputId = useId();
  const [preview, setPreview] = useState<string | undefined>(src);
  const [error, setError] = useState<string | null>(null);
  const objectUrlRef = useRef<string | null>(null);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!ACCEPTED.includes(file.type)) {
      setError("Please choose an image file (PNG, JPG or WebP).");
      return;
    }
    if (file.size > MAX_BYTES) {
      setError("That image is too large — please choose one under 2MB.");
      return;
    }

    setError(null);
    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    const url = URL.createObjectURL(file);
    objectUrlRef.current = url;
    setPreview(url);
    onChange?.(url);
  };

  return (
    <div className="flex items-center gap-4">
      <Avatar name={name} src={preview} size="lg" />
      <div>
        <label
          htmlFor={inputId}
          className="inline-flex h-9 cursor-pointer items-center rounded-md border border-border bg-surface px-3 text-body-sm font-medium hover:bg-surface-muted focus-within:ring-2 focus-within:ring-ring"
        >
          Change photo
        </label>
        <input
          id={inputId}
          type="file"
          accept={ACCEPTED.join(",")}
          aria-label="Profile photo"
          onChange={handleChange}
          className="sr-only"
        />
        <p className="mt-1 text-caption text-foreground-muted">
          PNG, JPG or WebP, up to 2MB.
        </p>
        {error && (
          <p role="alert" className="mt-1 text-caption text-danger">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
