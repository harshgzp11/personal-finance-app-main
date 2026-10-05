import React from 'react';

/**
 * Fix #4: Global Error Boundary — prevents a single component crash from
 * wiping out the entire app. Catches render-time errors in any child component.
 */
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, info) {
        console.error('ErrorBoundary caught an error:', error, info);
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null });
    };

    render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '60vh',
                    gap: '1rem',
                    padding: '2rem',
                    textAlign: 'center',
                    color: 'var(--text-primary)',
                }}>
                    <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    <h2 style={{ color: 'var(--danger)', margin: 0 }}>Something went wrong</h2>
                    <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', margin: 0 }}>
                        {this.state.error?.message || 'An unexpected error occurred in this section.'}
                    </p>
                    <button
                        onClick={this.handleReset}
                        style={{
                            padding: '0.6rem 1.5rem',
                            background: 'var(--accent-primary)',
                            color: '#fff',
                            border: 'none',
                            borderRadius: 'var(--radius)',
                            cursor: 'pointer',
                            fontWeight: 600,
                            fontSize: '0.95rem',
                        }}
                    >
                        Try Again
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
