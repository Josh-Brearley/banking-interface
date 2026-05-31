import { Suspense } from "react";
import { RouterProvider } from "react-router-dom";
import { AppProviders } from "@/app/providers/AppProviders";
import { Spinner } from "@/components/ui";
import { router } from "@/app/router/router";

export function App() {
  return (
    <AppProviders>
      <Suspense
        fallback={
          <div className="flex min-h-screen items-center justify-center">
            <Spinner className="h-6 w-6 text-primary" label="Loading Eagle Bank" />
          </div>
        }
      >
        <RouterProvider router={router} />
      </Suspense>
    </AppProviders>
  );
}
