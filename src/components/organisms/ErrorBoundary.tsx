import { Component, type ErrorInfo, type ReactNode } from "react";
import { Button } from "@/components/atoms";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}
interface State {
  hasError: boolean;
}

/**
 * App-level error boundary, NFR-ERR-01. Renders a friendly fallback instead of
 * a white screen and lets the user recover.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    // In production this would go to a monitoring service (Sentry etc.).
    console.error("Unhandled error boundary:", error, info);
  }

  handleReset = (): void => {
    this.setState({ hasError: false });
    window.location.assign("/");
  };

  render(): ReactNode {
    if (!this.state.hasError) return this.props.children;
    if (this.props.fallback) return this.props.fallback;

    return (
      <div
        role="alert"
        className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center"
      >
        <h1 className="text-h1">Something went wrong</h1>
        <p className="max-w-md text-foreground-muted">
          We hit an unexpected problem. Your money is safe, please try
          reloading the page.
        </p>
        <Button onClick={this.handleReset}>Reload Eagle Bank</Button>
      </div>
    );
  }
}
