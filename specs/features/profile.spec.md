# Feature Spec — Profile

> Status: Approved · Feature ID: `PROF` · Owner: Identity squad
> Inherits: [00](../00-product-constitution.md) · [02](../02-design-system.md) · [03](../03-api-and-data.md) · [05](../05-cross-cutting.md)

## 1. Overview

`/profile` lets a user **view and edit** their details (name, email, phone, address) and set
an **avatar (frontend-only)**. Validation via React Hook Form + Zod. Backed by
`GET/PATCH /api/profile` ([03 §4.5](../03-api-and-data.md#45-profile--profileservicets)).

## 2. User stories
- As a user, I can **view** my current profile details.
- I can **edit and save** them with clear validation.
- I can **set a profile picture** locally.

## 3. Functional requirements

| ID | Requirement |
|----|-------------|
| `PROF-FR-01` | **View** mode showing Full Name, Email, Phone Number, Address, and Avatar. |
| `PROF-FR-02` | **Edit** form for Full Name, Email, Phone Number, Address (line1/line2/city/postcode/country). |
| `PROF-FR-03` | Validation via **RHF + Zod**: required name, valid email, valid UK-style phone, address fields. |
| `PROF-FR-04` | **Save** calls `PATCH /api/profile`; shows loading; on success shows confirmation and reflects new values. |
| `PROF-FR-05` | On success, **invalidate** `profile.me()` and `auth.me()` so the rest of the app (e.g. dashboard greeting) updates (`03 §6`). |
| `PROF-FR-06` | **422 field errors** map back onto the corresponding inputs (`NFR-ERR-04`). |
| `PROF-FR-07` | **Avatar upload** (frontend only): file picker, client-side type/size validation, preview via object/data URL; not persisted to a server. |
| `PROF-FR-08` | **Dirty/Cancel**: editing can be cancelled, reverting to the last saved values; save disabled until the form is dirty & valid. |
| `PROF-FR-09` | Loading (initial fetch) → skeleton; Error → ErrorState + retry. |
| `PROF-FR-10` | Fully accessible form (labels, `aria-invalid`, `aria-describedby`, focus to first error on submit). |

## 4. Design

### 4.1 Components (`features/profile/`)
- `pages/ProfilePage`
- `components/ProfileView` (read mode) / `ProfileForm` (edit mode)
- `components/AvatarUpload`
- `hooks/useProfile` (`useQuery`), `useUpdateProfile` (`useMutation`)
- `schemas/profile.schema.ts`

### 4.2 Validation schema (Zod)

```ts
export const profileSchema = z.object({
  fullName: z.string().min(2, "Enter your full name"),
  email: z.string().min(1,"Email is required").email("Enter a valid email"),
  phoneNumber: z.string()
    .regex(/^(\+?44|0)\d{9,10}$/, "Enter a valid UK phone number")
    .optional().or(z.literal("")),
  address: z.object({
    line1: z.string().min(1,"Address line 1 is required"),
    line2: z.string().optional(),
    city: z.string().min(1,"City is required"),
    postcode: z.string().regex(/^[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2}$/i, "Enter a valid UK postcode"),
    country: z.string().min(1).default("GB"),
  }),
});
export type ProfileFormValues = z.infer<typeof profileSchema>;
```

### 4.3 Avatar rules
- Accept `image/png, image/jpeg, image/webp`; max ~2MB (client-validated).
- Preview immediately via `URL.createObjectURL`/data URL; store on the user object in cache.
- Invalid type/size → inline error, no upload. Avatar is decorative-with-name → `alt` = user name.

### 4.4 Mutation flow
`useUpdateProfile` → `updateProfile(values)`; on success `setQueryData`/`invalidateQueries`
for `profile.me()` + `auth.me()`, show success toast/inline confirmation, return to view mode.
On `ApiError(422)` map `fieldErrors` via `setError`.

## 5. Acceptance criteria

```gherkin
# PROF-AC-01  View profile
Given I am authenticated
When /profile loads
Then my current full name, email, phone, address and avatar are displayed

# PROF-AC-02  Required + email validation
Given I am editing my profile
When I clear the full name and enter an invalid email and submit
Then I see "Enter your full name" and "Enter a valid email"
And the profile is not saved
And focus moves to the first invalid field

# PROF-AC-03  Phone / postcode validation
When I enter an invalid phone or postcode
Then I see the corresponding validation messages

# PROF-AC-04  Successful update
Given valid edits and a successful service response
When I save
Then the update request is sent, a success confirmation is shown,
And the view reflects the new values

# PROF-AC-05  Cross-app sync
Given I change my full name and save
Then the dashboard greeting reflects the new name (auth.me invalidated)

# PROF-AC-06  Server field errors
Given the service responds 422 with a field error on email
When I save
Then the email field shows that server error

# PROF-AC-07  Avatar upload (frontend only)
When I select a valid image under the size limit
Then a preview is shown immediately
When I select an oversized or non-image file
Then I see a validation error and no preview change

# PROF-AC-08  Cancel reverts
Given I edited fields without saving
When I cancel
Then the form reverts to the last saved values

# PROF-AC-09  Save gating
Then Save is disabled until the form is both dirty and valid

# PROF-AC-10  Loading / Error
Given the profile request is pending
Then a skeleton is shown
Given it fails
Then an ErrorState with Retry is shown
```

## 6. Edge cases
- Optional phone: empty is valid; present must match pattern.
- Postcode normalised/uppercased on submit.
- Object URL revoked on unmount/replacement to avoid leaks.
- Concurrent edits: mutation `onError` restores previous cache (optimistic update optional).

## 7. Tasks
- [ ] `profile.schema.ts` + tests.
- [ ] `useProfile`, `useUpdateProfile` (+ invalidation of `profile.me`/`auth.me`).
- [ ] `ProfileView`, `ProfileForm` (RHF + zodResolver, dirty/valid gating, focus-to-error).
- [ ] `AvatarUpload` (type/size validation, preview, cleanup).
- [ ] 422 field-error mapping; success confirmation.
- [ ] Loading skeleton + error/retry.
- [ ] Tests `PROF-AC-02..05` (validation + successful update are required coverage), avatar + cancel.

## 8. Test plan (validation & successful update are [04 §3](../04-testing-strategy.md#3-required-coverage-assessment-minimum) minimums)
Integration: render `ProfilePage` (MSW); assert view values; enter invalid data → messages +
no save + focus to first error; valid edit → PATCH sent, confirmation shown, values updated;
name change invalidates auth so greeting updates; 422 handler → field error mapped; avatar
valid/invalid file handling; cancel reverts.
