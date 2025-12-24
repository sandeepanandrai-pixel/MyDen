import React, { Component } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null
        };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({
            error,
            errorInfo
        });

        // Log to error tracking service (Sentry, etc.)
        console.error('Error caught by boundary:', error, errorInfo);

        // In production, send to error tracking
        if (process.env.NODE_ENV === 'production') {
            // Example: Sentry.captureException(error);
        }
    }

    handleReset = () => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null
        });
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
                    <div className="max-w-md w-full bg-slate-800 rounded-2xl border border-slate-700 p-8 text-center">
                        <div className="w-16 h-16 bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <AlertTriangle className="text-red-500" size={32} />
                        </div>

                        <h2 className="text-2xl font-bold text-white mb-2">
                            Oops! Something went wrong
                        </h2>

                        <p className="text-slate-400 mb-6">
                            We encountered an unexpected error. Don't worry, your data is safe.
                        </p>

                        {process.env.NODE_ENV === 'development' && this.state.error && (
                            <details className="mb-6 text-left bg-slate-900 rounded-lg p-4">
                                <summary className="text-red-400 font-mono text-sm cursor-pointer mb-2">
                                    Error Details (Dev Only)
                                </summary>
                                <pre className="text-xs text-slate-300 overflow-auto">
                                    {this.state.error.toString()}
                                    {this.state.errorInfo && this.state.errorInfo.componentStack}
                                </pre>
                            </details>
                        )}

                        <div className="flex space-x-3">
                            <button
                                onClick={this.handleReset}
                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
                            >
                                <RefreshCw size={18} />
                                <span>Try Again</span>
                            </button>
                            <button
                                onClick={() => window.location.href = '/'}
                                className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200"
                            >
                                Go Home
                            </button>
                        </div>

                        <p className="text-xs text-slate-500 mt-4">
                            If this issue persists, please contact support
                        </p>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
