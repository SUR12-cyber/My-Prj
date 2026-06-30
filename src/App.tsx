import { useMemo, useState } from 'react';
import { TelemetryProvider } from './hooks/useSimulatedTelemetry';
import { BootScreen } from './components/BootScreen';
import { Layout } from './components/Layout';

import { Dashboard } from './pages/Dashboard';
import { Live } from './pages/Live';
import { Nowcasting } from './pages/Nowcasting';
import { Forecasting } from './pages/Forecasting';
import { Models } from './pages/Models';

type TabId = 'dashboard' | 'live' | 'nowcasting' | 'forecasting' | 'models' | 'satellite' | 'database' | 'settings';

function App() {
  const [activeTab, setActiveTab] = useState<TabId>('dashboard');
  const [bootComplete, setBootComplete] = useState(false);

  const page = useMemo(() => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'live':
        return <Live />;
      case 'nowcasting':
        return <Nowcasting />;
      case 'forecasting':
        return <Forecasting />;
      case 'models':
        return <Models />;
      // Tabs present in Layout but not implemented yet in src/pages:
      // satellite/database/settings
      default:
        return <Dashboard />;
    }
  }, [activeTab]);

  return (
    <TelemetryProvider>
      {!bootComplete && <BootScreen onBootComplete={() => setBootComplete(true)} />}

      {bootComplete && (
        <Layout
          activeTab={activeTab}
          setActiveTab={(tab) => setActiveTab(tab as TabId)}
        >
          {page}
        </Layout>
      )}
    </TelemetryProvider>
  );
}

export default App;
