import React from 'react';
import { FiAlertTriangle, FiRefreshCw, FiHome } from 'react-icons/fi';
import './ErrorBoundary.css';

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[ErrorBoundary]', error, info.componentStack);
  }

  private handleReload = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  private handleHome = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="error-boundary">
          <div className="error-boundary__card">
            <div className="error-boundary__icon-wrap">
              <FiAlertTriangle className="error-boundary__icon" />
            </div>
            <h1 className="error-boundary__title">Something went wrong</h1>
            <p className="error-boundary__desc">
              An unexpected error occurred. This has been logged. You can try reloading the page or go back to the home screen.
            </p>
            {this.state.error?.message && (
              <pre className="error-boundary__detail">{this.state.error.message}</pre>
            )}
            <div className="error-boundary__actions">
              <button className="error-boundary__btn error-boundary__btn--primary" onClick={this.handleReload}>
                <FiRefreshCw /> Reload page
              </button>
              <button className="error-boundary__btn error-boundary__btn--ghost" onClick={this.handleHome}>
                <FiHome /> Back to Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
