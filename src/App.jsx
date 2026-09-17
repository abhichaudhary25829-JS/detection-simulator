import { HashRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import BankersAlgorithm from './pages/BankersAlgorithm';
import DeadlockDetection from './pages/DeadlockDetection';
import StepSimulation from './pages/StepSimulation';
import ResourceGraph from './pages/ResourceGraph';
import { AppProvider } from './utils/AppContext';
import './App.css';

function App() {
  return (
    <AppProvider>
      <HashRouter>
        <div className="app-shell">
          <Sidebar />
          <main className="app-main">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/bankers-algorithm" element={<BankersAlgorithm />} />
              <Route path="/deadlock-detection" element={<DeadlockDetection />} />
              <Route path="/step-simulation" element={<StepSimulation />} />
              <Route path="/resource-graph" element={<ResourceGraph />} />
            </Routes>
          </main>
        </div>
      </HashRouter>
    </AppProvider>
  );
}

export default App;
