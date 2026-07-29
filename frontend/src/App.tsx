import { useEffect, useState } from 'react';
import './App.css';

interface HealthData {
  status: string;
  message: string;
  timestamp: string;
  uptime: number;
}

function App() {
  const [backendStatus, setBackendStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [healthInfo, setHealthInfo] = useState<HealthData | null>(null);
  const [errorDetails, setErrorDetails] = useState<string>('');

  useEffect(() => {
    const checkBackendHealth = async () => {
      try {
        // Query the Node.js Express backend health endpoint
        const response = await fetch('http://localhost:5000/api/v1/health');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: HealthData = await response.json();
        setHealthInfo(data);
        setBackendStatus('online');
      } catch (err: any) {
        setBackendStatus('offline');
        setErrorDetails(err.message || 'Could not connect to localhost:5000');
      }
    };

    checkBackendHealth();
    
    // Set up polling interval to check server status every 10 seconds
    const interval = setInterval(checkBackendHealth, 10000);
    return () => clearInterval(interval);
  }, []);

  const formatUptime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    
    const parts = [];
    if (h > 0) parts.push(`${h}h`);
    if (m > 0) parts.push(`${m}m`);
    parts.push(`${s}s`);
    
    return parts.join(' ');
  };

  return (
    <div className="container">
      {/* Header */}
      <header className="header">
        <div className="logo">Luxora</div>
        <div className="badge-dev">MERN Workspace v1.0</div>
      </header>

      {/* Hero Section */}
      <main>
        <section className="hero">
          <div className="hero-subtitle">Premium E-Commerce Architecture</div>
          <h1 className="hero-title">Elevate Your Business. Discover Curated Luxury.</h1>
          <p className="hero-desc">
            Luxora is a production-ready, highly modular MERN stack architecture. The backend is 
            structured for speed and scalability with isolated router, controller, service, and data layers, 
            while the React frontend is fully detached for high-performance single-page experiences.
          </p>
        </section>

        {/* Live Backend Connection Status */}
        <section className="status-panel">
          <div className="status-header">
            <div className="status-title">
              <span>Live System Integration</span>
            </div>
            
            {backendStatus === 'checking' && (
              <div className="indicator checking">
                <span className="status-value">Checking connection...</span>
              </div>
            )}

            {backendStatus === 'online' && (
              <div className="indicator online">
                <span className="pulse-dot"></span>
                <span>API Online</span>
              </div>
            )}

            {backendStatus === 'offline' && (
              <div className="indicator offline">
                <span className="pulse-dot"></span>
                <span>API Offline</span>
              </div>
            )}
          </div>

          <div className="status-detail-grid">
            <div className="status-item">
              <span className="status-label">Backend API URL</span>
              <span className="status-value">http://localhost:5000/api/v1/health</span>
            </div>
            
            <div className="status-item">
              <span className="status-label">Database Status</span>
              <span className="status-value">
                {backendStatus === 'online' ? 'MongoDB Connected' : 'Offline / Unreachable'}
              </span>
            </div>

            {backendStatus === 'online' && healthInfo && (
              <>
                <div className="status-item">
                  <span className="status-label">Server Uptime</span>
                  <span className="status-value">{formatUptime(healthInfo.uptime)}</span>
                </div>
                <div className="status-item">
                  <span className="status-label">Response Message</span>
                  <span className="status-value">{healthInfo.message}</span>
                </div>
              </>
            )}

            {backendStatus === 'offline' && (
              <div className="status-item" style={{ gridColumn: 'span 2' }}>
                <span className="status-label">Connection Error Diagnostics</span>
                <span className="status-value" style={{ color: 'var(--error-color)' }}>
                  {errorDetails}. Start the backend server on port 5000 to verify connection.
                </span>
              </div>
            )}
          </div>
        </section>

        {/* Features Showcase */}
        <section className="features-grid">
          <div className="feature-card">
            <div className="feature-icon-wrapper">📦</div>
            <h3 className="feature-title">Modular REST API</h3>
            <p className="feature-desc">
              Clean separation of routes, validations, controllers, models, and services inside the Express core.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrapper">🔒</div>
            <h3 className="feature-title">Production Security</h3>
            <p className="feature-desc">
              Out of the box cookie parsing, password hashing, environment checks, and global error middleware.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrapper">⚡</div>
            <h3 className="feature-title">Vite + React (TS)</h3>
            <p className="feature-desc">
              Ultra-fast HMR, modular TypeScript component compilation, and modern UI capabilities.
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div>Luxora E-Commerce Stack © {new Date().getFullYear()}</div>
        <div className="tech-stack">
          <span className="tech-tag">React</span>
          <span className="tech-tag">Vite</span>
          <span className="tech-tag">Node.js</span>
          <span className="tech-tag">Express</span>
          <span className="tech-tag">MongoDB</span>
        </div>
      </footer>
    </div>
  );
}

export default App;
