import { CheckCircle2, AlertTriangle, Clock, XCircle, HelpCircle } from 'lucide-react';

// Maps a status keyword to a color, icon and label. Text + icon are always
// shown alongside color so meaning isn't conveyed by color alone.
const STATUS_MAP = {
  SAFE: { icon: CheckCircle2, className: 'badge-safe', label: 'SAFE STATE' },
  NO_DEADLOCK: { icon: CheckCircle2, className: 'badge-safe', label: 'NO DEADLOCK' },
  UNSAFE: { icon: AlertTriangle, className: 'badge-unsafe', label: 'UNSAFE STATE' },
  DEADLOCK_DETECTED: { icon: XCircle, className: 'badge-unsafe', label: 'DEADLOCK DETECTED' },
  WAITING: { icon: Clock, className: 'badge-waiting', label: 'WAITING' },
  COMPLETED: { icon: CheckCircle2, className: 'badge-completed', label: 'COMPLETED' },
  ERROR: { icon: XCircle, className: 'badge-error', label: 'ERROR' },
};

export default function StatusBadge({ status, customLabel }) {
  const entry = STATUS_MAP[status] || { icon: HelpCircle, className: 'badge-neutral', label: status || 'UNKNOWN' };
  const Icon = entry.icon;
  return (
    <span className={`status-badge ${entry.className}`}>
      <Icon size={16} />
      {customLabel || entry.label}
    </span>
  );
}
