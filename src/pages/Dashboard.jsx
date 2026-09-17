import { Link } from 'react-router-dom';
import { Landmark, ShieldAlert, ListOrdered, Network, Cpu, Database, Activity, History } from 'lucide-react';
import Header from '../components/Header';
import Card from '../components/Card';
import StatusBadge from '../components/StatusBadge';
import { useAppState } from '../utils/AppContext';

export default function Dashboard() {
  const { numProcesses, numResources, lastAlgorithm, lastStatus } = useAppState();

  const navCards = [
    {
      to: '/bankers-algorithm',
      title: "Banker's Algorithm",
      desc: 'Check if the system is in a safe state and find a safe sequence.',
      icon: Landmark,
    },
    {
      to: '/deadlock-detection',
      title: 'Deadlock Detection',
      desc: 'Detect deadlocked processes from current allocation and requests.',
      icon: ShieldAlert,
    },
    {
      to: '/step-simulation',
      title: 'Step-by-Step Simulation',
      desc: 'Walk through the algorithm execution one decision at a time.',
      icon: ListOrdered,
    },
    {
      to: '/resource-graph',
      title: 'Resource Allocation Graph',
      desc: 'Visualize processes, resources, and allocation/request edges.',
      icon: Network,
    },
  ];

  return (
    <div>
      <Header
        title="Deadlock Detection & Banker's Algorithm Simulator"
        subtitle="An interactive Operating Systems teaching tool for resource allocation, safety analysis, and deadlock detection."
      />

      <div className="stats-grid">
        <Card title="Processes" icon={Cpu}>
          <p className="stat-value">{numProcesses}</p>
        </Card>
        <Card title="Resource Types" icon={Database}>
          <p className="stat-value">{numResources}</p>
        </Card>
        <Card title="System Status" icon={Activity}>
          {lastStatus ? <StatusBadge status={lastStatus} /> : <span className="muted">Not yet evaluated</span>}
        </Card>
        <Card title="Last Algorithm Executed" icon={History}>
          <p className="stat-value-small">{lastAlgorithm || 'None yet'}</p>
        </Card>
      </div>

      <h2 className="section-heading">Quick Navigation</h2>
      <div className="nav-cards-grid">
        {navCards.map(({ to, title, desc, icon: Icon }) => (
          <Link to={to} key={to} className="nav-card">
            <Icon size={24} />
            <h3>{title}</h3>
            <p>{desc}</p>
          </Link>
        ))}
      </div>

      <Card title="About this Project" className="about-card">
        <p>
          This simulator demonstrates two classic Operating Systems concepts for deadlock
          avoidance and detection: the <strong>Banker's Algorithm</strong>, which proactively
          checks whether granting resources keeps the system in a safe state, and{' '}
          <strong>Deadlock Detection</strong>, which examines a system after resources have
          already been allocated to identify processes stuck in a circular wait. All
          calculations are performed dynamically in your browser based on the matrices you
          enter — nothing is hard-coded.
        </p>
      </Card>
    </div>
  );
}
