import StatusBadge from './StatusBadge';

// Renders a table of per-process status. `statusKey` is the field name in
// each row that holds a boolean (e.g. "finished" or "completed"), and
// `deadlocked` is an optional array of process names to flag as deadlocked.
export default function ProcessStatusTable({ rows, statusKey, deadlocked = [] }) {
  return (
    <div className="table-scroll">
      <table className="matrix-table">
        <thead>
          <tr>
            <th>Process</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const isDeadlocked = deadlocked.includes(row.process);
            const finished = row[statusKey];
            let status = finished ? 'COMPLETED' : isDeadlocked ? 'ERROR' : 'WAITING';
            return (
              <tr key={row.process}>
                <td className="process-label">{row.process}</td>
                <td>
                  <StatusBadge
                    status={status}
                    customLabel={
                      finished ? 'Finished' : isDeadlocked ? 'Deadlocked' : 'Waiting'
                    }
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
