import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { LoginForm } from "../components/LoginForm";

/** Login route, full behaviour in LoginForm (specs/features/auth.spec.md). */
export function LoginPage() {
  useDocumentTitle("Log in");
  return <LoginForm />;
}
