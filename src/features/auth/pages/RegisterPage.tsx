import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { RegisterForm } from "../components/RegisterForm";

/** Register route, full behaviour in RegisterForm (specs/features/auth.spec.md). */
export function RegisterPage() {
  useDocumentTitle("Create account");
  return <RegisterForm />;
}
