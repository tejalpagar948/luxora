import React, { useEffect, useState } from 'react';

interface HealthData {
  status: string;
  message: string;
  timestamp: string;
  uptime: number;
}

export const Dashboard: React.FC = () => {
  const [backendStatus, setBackendStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [healthInfo, setHealthInfo] = useState<HealthData | null>(null);
  const [errorDetails, setErrorDetails] = useState<string>('');

  useEffect(() => {
    const checkBackendHealth = async () => {
      try {
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

  const stats = [
    { name: 'Total Revenue', value: '$24,500.00', change: '+12% from last month' },
    { name: 'Total Orders', value: '48', change: '+8% from last month' },
    { name: 'Active Users', value: '1,250', change: '+22% from last week' },
  ];

  return (
    <div className="px-5 py-8 md:p-8 font-body bg-background min-h-screen">
      <div className="mb-8">
        <h1 className="font-display text-headline-md text-primary font-semibold">
          Sales Dashboard
        </h1>
        <p className="text-sm text-neutral-400 mt-1">
          Store overview and real-time business insights.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-background-alt border border-border-light rounded-lg p-6 shadow-sm">
            <h3 className="text-label-caps text-neutral-400 mb-2">{stat.name}</h3>
            <p className="text-[28px] font-semibold text-primary mb-1">{stat.value}</p>
            <span className="text-xs text-green-600 font-semibold">{stat.change}</span>
          </div>
        ))}
      </div>

      {/* Live System Integration Diagnostics */}
      <div className="bg-background border border-border-light rounded-lg p-6 shadow-sm mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 pb-4 border-b border-border-light gap-2">
          <h3 className="font-display text-[20px] text-primary font-semibold">
            Live System Integration
          </h3>

          <div className="flex items-center space-x-2">
            {backendStatus === 'checking' && (
              <span className="text-xs text-neutral-400 bg-neutral-100 px-3 py-1 rounded-full animate-pulse">
                Checking connection...
              </span>
            )}
            {backendStatus === 'online' && (
              <span className="flex items-center text-xs text-green-700 bg-green-50 border border-green-200 px-3 py-1 rounded-full">
                <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-ping"></span>
                API Online
              </span>
            )}
            {backendStatus === 'offline' && (
              <span className="flex items-center text-xs text-red-700 bg-red-50 border border-red-200 px-3 py-1 rounded-full">
                <span className="w-2 h-2 rounded-full bg-red-500 mr-2 animate-pulse"></span>
                API Offline
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-background-alt p-4 rounded-md">
            <span className="block text-xs text-neutral-400 uppercase tracking-wider mb-1">Backend API URL</span>
            <span className="text-sm font-semibold text-primary break-all">http://localhost:5000/api/v1/health</span>
          </div>
          <div className="bg-background-alt p-4 rounded-md">
            <span className="block text-xs text-neutral-400 uppercase tracking-wider mb-1">Database Status</span>
            <span className="text-sm font-semibold text-primary">
              {backendStatus === 'online' ? 'MongoDB Connected' : 'Offline / Unreachable'}
            </span>
          </div>
          {backendStatus === 'online' && healthInfo && (
            <>
              <div className="bg-background-alt p-4 rounded-md">
                <span className="block text-xs text-neutral-400 uppercase tracking-wider mb-1">Server Uptime</span>
                <span className="text-sm font-semibold text-primary">{formatUptime(healthInfo.uptime)}</span>
              </div>
              <div className="bg-background-alt p-4 rounded-md">
                <span className="block text-xs text-neutral-400 uppercase tracking-wider mb-1">Response Message</span>
                <span className="text-sm font-semibold text-primary">{healthInfo.message}</span>
              </div>
            </>
          )}
          {backendStatus === 'offline' && (
            <div className="bg-red-50/50 p-4 rounded-md border border-red-100 col-span-1 md:col-span-2">
              <span className="block text-xs text-red-700 uppercase tracking-wider mb-1">Diagnostics Error</span>
              <span className="text-sm font-semibold text-red-600">
                {errorDetails}. Start the backend server on port 5000 to verify connection.
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Orders List */}
      <div className="bg-background border border-border-light rounded-lg p-6 shadow-sm">
        <h3 className="font-display text-[20px] text-primary font-semibold mb-4">
          Recent Orders
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-neutral-500">
            <thead className="text-xs text-neutral-400 uppercase tracking-widest bg-background-alt border-b border-border-light">
              <tr>
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Product</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border-light hover:bg-background-alt/50 transition-colors">
                <td className="py-4 px-4 font-semibold text-primary">#1024</td>
                <td className="py-4 px-4">Alice Johnson</td>
                <td className="py-4 px-4">The Signature Tote</td>
                <td className="py-4 px-4">July 28, 2026</td>
                <td className="py-4 px-4 font-semibold text-primary">$850.00</td>
              </tr>
              <tr className="border-b border-border-light hover:bg-background-alt/50 transition-colors">
                <td className="py-4 px-4 font-semibold text-primary">#1023</td>
                <td className="py-4 px-4">Bob Smith</td>
                <td className="py-4 px-4">Heritage Crossbody</td>
                <td className="py-4 px-4">July 26, 2026</td>
                <td className="py-4 px-4 font-semibold text-primary">$490.00</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
