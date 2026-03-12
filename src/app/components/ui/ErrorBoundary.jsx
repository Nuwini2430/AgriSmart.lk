"use client";
import { Component } from "react";
import Button from "../common/Button";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    
    // Log error to service (optional)
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[400px] flex items-center justify-center p-4">
          <div className="text-center max-w-md">
            {/* Error Icon */}
            <div className="w-20 h-20 bg-[#FEE2E2] rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-[#EF4444]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>

            <h3 className="text-xl font-bold text-[#1E293B] mb-2">
              {this.props.title || "Oops! Something went wrong"}
            </h3>
            
            <p className="text-[#64748B] mb-6">
              {this.props.message || "We're having trouble loading this content. Please try again."}
            </p>

            <div className="flex gap-3 justify-center">
              <Button
                variant="primary"
                onClick={() => window.location.reload()}
              >
                Refresh Page
              </Button>
              
              <Button
                variant="secondary"
                onClick={() => window.location.href = '/'}
              >
                Go Home
              </Button>
            </div>

            {/* Error Details (in development) */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="mt-6 p-4 bg-[#F1F5F9] rounded-lg text-left">
                <p className="text-sm font-mono text-[#EF4444] break-words">
                  {this.state.error.toString()}
                </p>
                {this.state.errorInfo && (
                  <p className="text-xs text-[#64748B] mt-2 break-words">
                    {this.state.errorInfo.componentStack}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Error Alert Component
export function ErrorAlert({ message, onRetry }) {
  return (
    <div className="bg-[#FEE2E2] border border-[#EF4444] rounded-lg p-4">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <svg className="w-5 h-5 text-[#EF4444]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        
        <div className="flex-1">
          <p className="text-sm text-[#EF4444]">{message}</p>
        </div>
        
        {onRetry && (
          <button
            onClick={onRetry}
            className="text-sm text-[#EF4444] hover:text-[#DC2626] font-medium"
          >
            Retry
          </button>
        )}
      </div>
    </div>
  );
}

// 404 Not Found Component
export function NotFound({ resource = "page" }) {
  return (
    <div className="min-h-[400px] flex items-center justify-center p-4">
      <div className="text-center">
        <div className="text-6xl mb-4">🌾</div>
        <h3 className="text-xl font-bold text-[#1E293B] mb-2">
          {resource === "page" ? "Page Not Found" : `${resource} Not Found`}
        </h3>
        <p className="text-[#64748B] mb-6">
          {resource === "page" 
            ? "The page you're looking for doesn't exist or has been moved."
            : `The ${resource} you're looking for doesn't exist.`}
        </p>
        <Button
          variant="primary"
          onClick={() => window.location.href = '/'}
        >
          Go Home
        </Button>
      </div>
    </div>
  );
}