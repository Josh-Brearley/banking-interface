# Feature Spec — Authentication

> Status: Approved · Feature ID: `AUTH` · Owner: Auth squad
> Inherits: [00](../00-product-constitution.md) · [01](../01-architecture.md) · [03](../03-api-and-data.md) · [05](../05-cross-cutting.md)

## 1. Overview

Mocked authentication: register, log in, persist a session in LocalStorage, guard protected
routes, and log out. No real backend — `auth.service.ts` simulates the endpoints in
[03 §4.1](../03-api-and-data.md#41-auth--authservicets).

## 2. User stories

- As a new user, I can **register** with my name, email, and password so I can access the app.
- As a returning user, I can **log in** and stay logged in across refreshes.
- As any user, I am **kept out of** protected pages until authenticated, and sent back to
  where I was trying to go after logging in.
- As a user, I can **log out** and have my session cleared.

## 3. Functional requirements

| ID | Requirement |
|----|-------------|
| `AUTH-FR-01` | **Login page** (`/login`) with Email + Password fields. |
| `AUTH-FR-02` | **Register page** (`/register`) with Full Name, Email, Password, Confirm Password. |
| `AUTH-FR-03` | Forms validate with **Zod + React Hook Form**; inline, accessible errors. |
| `AUTH-FR-04` | Submit shows a **loading state**; form is locked during the request. |
| `AUTH-FR-05` | Service/API errors render an **accessible error state** (`role="alert"`). |
| `AUTH-FR-06` | On success, persist `Session` (token + user) to **LocalStorage** and hydrate `AuthProvider`. |
| `AUTH-FR-07` | **Protected routes**: unauthenticated access redirects to `/login?from=<path>`. |
| `AUTH-FR-08` | After login, redirect to `from` (if present) else `/dashboard`. |
| `AUTH-FR-09` | Authenticated users visiting `/login`/`/register` are redirected to `/dashboard`. |
| `AUTH-FR-10` | **Logout** clears session + React Query cache and returns to `/login`. |
| `AUTH-FR-11` | On app load, session is **rehydrated** from storage and validated via `GET /auth/me`; a 401 clears it (`NFR-ERR-05`). |
| `AUTH-FR-12` | Password input has a **show/hide toggle** (`aria-pressed`). |

## 4. Design

### 4.1 Routes & layout
- `/login`, `/register` render inside **`AuthLayout`** (centered card, brand, no app nav).
- `AuthLayout` performs the `AUTH-FR-09` redirect.
- `ProtectedRoute` wraps `AppShell` (`AUTH-FR-07`).

### 4.2 Components (`features/auth/`)
- `pages/LoginPage`, `pages/RegisterPage`
- `components/LoginForm`, `components/RegisterForm` (RHF + zodResolver)
- `hooks/useLogin`, `useRegister`, `useLogout`, `useSession` (React Query mutations/queries)
- `schemas/auth.schema.ts`

### 4.3 Auth context (`lib/auth` + `app/providers/AuthProvider`)
- Exposes `{ user, isAuthenticated, isLoading, login, logout }` via `useAuth()`.
- Token + user persisted under a single namespaced key, e.g. `eaglebank.session`.
- `me` query gates initial render with a splash/skeleton (not a flash of `/login`).

### 4.4 Validation schemas (Zod)

```ts
const email = z.string().min(1,"Email is required").email("Enter a valid email");
const password = z.string()
  .min(8,"At least 8 characters")
  .regex(/[A-Z]/,"One uppercase letter")
  .regex(/[a-z]/,"One lowercase letter")
  .regex(/[0-9]/,"One number");

export const loginSchema = z.object({ email, password: z.string().min(1,"Password is required") });

export const registerSchema = z.object({
  fullName: z.string().min(2,"Enter your full name"),
  email,
  password,
  confirmPassword: z.string(),
}).refine(d => d.password === d.confirmPassword, {
  path: ["confirmPassword"], message: "Passwords do not match",
});
```
> Login uses the relaxed `password` (presence only) so legacy/short passwords can still sign
> in; registration enforces the strength rules.

### 4.5 API usage
`login`, `register`, `logout`, `me` per [03 §4.1](../03-api-and-data.md#41-auth--authservicets).
On success → write session, `queryClient.setQueryData(queryKeys.auth.me(), user)`. On 401
anywhere → `logout()` + redirect.

## 5. Acceptance criteria (Gherkin)

```gherkin
# AUTH-AC-01  Login required fields
Given I am on /login
When I submit with empty email and password
Then I see "Email is required" and "Password is required"
And no network request is made

# AUTH-AC-02  Login invalid email
Given I am on /login
When I enter "not-an-email" and submit
Then I see "Enter a valid email"

# AUTH-AC-03  Login submit locked while pending
Given valid credentials are entered
When I submit
Then the submit button shows a loading state and is disabled until the request resolves

# AUTH-AC-04  Login rejected credentials
Given the service responds 401 INVALID_CREDENTIALS
When I submit valid-format credentials
Then I see an accessible error "Email or password is incorrect." in a role="alert"
And I remain on /login

# AUTH-AC-05  Register required + email
Given I am on /register
When I submit empty
Then I see required errors for full name, email, and password

# AUTH-AC-06  Register password strength
Given I am on /register
When I enter password "weak"
Then I see the unmet strength rule messages

# AUTH-AC-07  Register password confirmation
Given password "Password123!" and confirm "Password124!"
When I submit
Then I see "Passwords do not match" on the confirm field

# AUTH-AC-08  Register success
Given valid registration data and a successful service response
When I submit
Then a session is stored and I land on /dashboard

# AUTH-AC-09  Protected route redirect
Given I am not authenticated
When I navigate to /accounts
Then I am redirected to /login with from=/accounts preserved

# AUTH-AC-10  Post-login redirect to intended
Given I was redirected to /login from /accounts
When I log in successfully
Then I land on /accounts

# AUTH-AC-11  Already-authed avoids auth pages
Given I am authenticated
When I navigate to /login
Then I am redirected to /dashboard

# AUTH-AC-12  Logout clears session
Given I am authenticated
When I log out
Then the session is removed from storage, the query cache is cleared, and I am on /login

# AUTH-AC-13  Session rehydration
Given a valid session exists in LocalStorage
When I reload the app
Then I remain authenticated without re-entering credentials

# AUTH-AC-14  Password visibility toggle
Given the password field is masked
When I activate the show/hide toggle
Then the value becomes visible and aria-pressed reflects the state
```

## 6. Edge cases
- Storage unavailable/corrupt JSON → treat as logged out, clear key, no crash.
- `me` 401 on boot → silent logout to `/login`.
- Double submit prevented by pending lock (`AUTH-FR-04`).
- Trimming: email trimmed/lowercased before submit.

## 7. Tasks
- [ ] `auth.schema.ts` (login/register) + tests.
- [ ] `auth.service.ts` (login/register/logout/me) with latency + error simulation.
- [ ] `AuthProvider` + `useAuth` + LocalStorage persistence (`lib/auth`).
- [ ] `LoginForm`, `RegisterForm` (RHF + zodResolver, loading, error alert, password toggle).
- [ ] `LoginPage`, `RegisterPage`, `AuthLayout`.
- [ ] `ProtectedRoute` + `from` preservation + post-login redirect.
- [ ] Cache reset on login/logout; 401 interceptor.
- [ ] Tests for `AUTH-AC-01..14` (focus: validation, error state, protected routes).

## 8. Test plan (maps to [04 §3](../04-testing-strategy.md#3-required-coverage-assessment-minimum))
Login validation (`AC-01..03`), login error (`AC-04`), register validation incl. confirm
match (`AC-05..07`), protected-route redirect + intended-path (`AC-09..10`), logout
(`AC-12`). RTL + user-event + MSW override for the 401 case.
