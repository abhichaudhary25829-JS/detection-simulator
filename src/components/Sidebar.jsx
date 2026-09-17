import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Landmark, ShieldAlert, ListOrdered, Network, Lock } from 'lucide-react';

const links = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/bankers-algorithm', label: "Banker's Algorithm", icon: Landmark },
  { to: '/deadlock-detection', label: 'Deadlock Detection', icon: ShieldAlert },
  { to: '/step-simulation', label: 'Step-by-Step Simulation', icon: ListOrdered },
  { to: '/resource-graph', label: 'Resource Allocation Graph', icon: Network },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <Lock size={22} />
        <span>OS Deadlock Lab</span>
      </div>
      <nav className="sidebar-nav">
        {links.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            <Icon size={18} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="sidebar-footer">
        <p>Operating Systems Project</p>
      </div>
    </aside>
  );
}
