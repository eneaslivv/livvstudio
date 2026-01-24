
import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Projects } from './pages/Projects';
import { Docs } from './pages/Docs';
import { Calendar } from './pages/Calendar';
import { Clients } from './pages/Clients';
import { Activity } from './pages/Activity';
import { Sales } from './pages/Sales';
import { Finance } from './pages/Finance';
import { Configuration } from './pages/Configuration';
import { PageView, AppMode, ActiveTimer } from './types';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<PageView>('home');
  const [appMode, setAppMode] = useState<AppMode>('os');
  
  // Timer State
  const [activeTimer, setActiveTimer] = useState<ActiveTimer | null>(null);

  const handleSwitchMode = (mode: AppMode) => {
    setAppMode(mode);
    if (mode === 'sales') {
        setCurrentPage('sales_dashboard');
    } else {
        setCurrentPage('home');
    }
  };

  const handleStartTimer = (id: string, title: string, type: 'project' | 'task') => {
      setActiveTimer({
          id,
          title,
          type,
          startTime: Date.now(),
          elapsedSeconds: 0,
          isRunning: true
      });
  };

  const renderPage = () => {
    switch(currentPage) {
      case 'home': return <Home onNavigate={setCurrentPage} onStartTimer={handleStartTimer} activeTimerId={activeTimer?.id} />;
      case 'projects': return <Projects onStartTimer={handleStartTimer} activeTimerId={activeTimer?.id} />;
      case 'clients': return <Clients />;
      case 'calendar': return <Calendar />;
      case 'docs': return <Docs initialFolderId="root" />;
      case 'activity': return <Activity onNavigate={setCurrentPage} />;
      case 'sales_dashboard': return <Sales view="crm" onNavigate={setCurrentPage} />;
      case 'sales_leads': return <Sales view="inbox" onNavigate={setCurrentPage} />;
      case 'sales_analytics': return <Sales view="analytics" onNavigate={setCurrentPage} />;
      case 'finance': return <Finance onNavigate={setCurrentPage} />;
      case 'configuration': return <Configuration />;
      default: return <Home onNavigate={setCurrentPage} onStartTimer={handleStartTimer} />;
    }
  };

  return (
    <Layout 
        currentPage={currentPage} 
        currentMode={appMode}
        onNavigate={setCurrentPage}
        onSwitchMode={handleSwitchMode}
        activeTimer={activeTimer}
        onUpdateTimer={setActiveTimer}
    >
      {renderPage()}
    </Layout>
  );
};

export default App;
