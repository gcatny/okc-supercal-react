import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('OKC Super Calendar Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '40px', maxWidth: '600px', margin: '0 auto', fontFamily: "'DM Sans', sans-serif" }}>
          <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '28px', color: '#1a6fbf' }}>
            OKC Super Calendar
          </h1>
          <p style={{ color: '#666', lineHeight: '1.6' }}>
            Something went wrong loading the calendar. Try refreshing the page.
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '10px 20px', background: '#1a6fbf', color: '#fff',
              border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '14px'
            }}
          >
            Refresh Page
          </button>
          <details style={{ marginTop: '20px', fontSize: '12px', color: '#999' }}>
            <summary>Error details</summary>
            <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
              {this.state.error?.toString()}
            </pre>
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}
