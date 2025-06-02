
import React, { Component, ErrorInfo, ReactNode } from "react";
import { Button } from "@/components/ui/button";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    console.error("🚨 ErrorBoundary: Error caught:", error);
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("🚨 ErrorBoundary: Component stack trace:", {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack
    });

    this.setState({ errorInfo });
    
    // Call optional error handler
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  public resetError = () => {
    console.log("🔄 ErrorBoundary: Resetting error state");
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
          <div className="w-full max-w-md space-y-6 text-center">
            <h1 className="text-3xl font-bold text-glee-purple">Something went wrong</h1>
            <div className="p-4 bg-destructive/10 text-destructive rounded-md">
              <p className="font-semibold mb-2">Error Details:</p>
              <p className="font-mono text-sm text-left mb-2">
                {this.state.error?.message || "Unknown error occurred"}
              </p>
              {this.state.errorInfo && (
                <details className="text-xs">
                  <summary className="cursor-pointer">Component Stack</summary>
                  <pre className="mt-2 whitespace-pre-wrap">
                    {this.state.errorInfo.componentStack}
                  </pre>
                </details>
              )}
            </div>
            <div className="space-y-4">
              <p className="text-muted-foreground">
                We're sorry for the inconvenience. Please try refreshing the page or return to home.
              </p>
              <div className="flex gap-3 justify-center">
                <Button variant="outline" onClick={() => window.location.reload()}>
                  Refresh Page
                </Button>
                <Button onClick={this.resetError}>
                  Go to Home Page
                </Button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
