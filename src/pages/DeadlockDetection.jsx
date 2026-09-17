import { useState } from 'react';
import { PlayCircle, Grid3x3 } from 'lucide-react';
import Header from '../components/Header';
import Card from '../components/Card';
import MatrixInput from '../components/MatrixInput';
import VectorInput from '../components/VectorInput';
import SampleCaseSelector from '../components/SampleCaseSelector';
import StatusBadge from '../components/StatusBadge';
import ProcessStatusTable from '../components/ProcessStatusTable';
import { useAppState } from '../utils/AppContext';
import { runDeadlockDetection } from '../algorithms/deadlockDetection';
import { validateDeadlockInput, toNumericMatrix, toNumericVector } from '../algorithms/validation';
import { deadlockSampleCases } from '../data/sampleCases';

function buildEmptyMatrix(rows, cols) {
  return Array.from({ length: rows }, () => Array.from({ length: cols }, () => 0));
}
function buildEmptyVector(len) {
  return Array.from({ length: len }, () => 0);
}

export default function DeadlockDetection() {
  const [numProcesses, setNumProcesses] = useState(3);
  const [numResources, setNumResources] = useState(2);
  const [pendingProcesses, setPendingProcesses] = useState(3);
  const [pendingResources, setPendingResources] = useState(2);
  const [allocation, setAllocation] = useState(buildEmptyMatrix(3, 2));
  const [request, setRequest] = useState(buildEmptyMatrix(3, 2));
  const [available, setAvailable] = useState(buildEmptyVector(2));
  const [errors, setErrors] = useState([]);
  const [result, setResult] = useState(null);

  const { recordRun } = useAppState();

  const resourceLabels = Array.from({ length: numResources }, (_, j) => `R${j}`);

  const handleGenerateMatrices = () => {
    const genErrors = [];
    const p = Number(pendingProcesses);
    const r = Number(pendingResources);
    if (!Number.isInteger(p) || p <= 0 || p > 12) genErrors.push('Enter a valid number of processes (1-12).');
    if (!Number.isInteger(r) || r <= 0 || r > 8) genErrors.push('Enter a valid number of resource types (1-8).');
    if (genErrors.length > 0) {
      setErrors(genErrors);
      return;
    }
    setNumProcesses(p);
    setNumResources(r);
    setAllocation(buildEmptyMatrix(p, r));
    setRequest(buildEmptyMatrix(p, r));
    setAvailable(buildEmptyVector(r));
    setErrors([]);
    setResult(null);
  };

  const handleLoadSample = (sampleCase) => {
    setNumProcesses(sampleCase.numProcesses);
    setNumResources(sampleCase.numResources);
    setPendingProcesses(sampleCase.numProcesses);
    setPendingResources(sampleCase.numResources);
    setAllocation(sampleCase.allocation);
    setRequest(sampleCase.request);
    setAvailable(sampleCase.available);
    setErrors([]);
    setResult(null);
  };

  const handleRun = () => {
    const validationErrors = validateDeadlockInput({
      numProcesses, numResources, allocation, request, available,
    });
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      setResult(null);
      return;
    }
    setErrors([]);
    const runResult = runDeadlockDetection(
      toNumericMatrix(allocation),
      toNumericMatrix(request),
      toNumericVector(available)
    );
    setResult(runResult);
    recordRun('Deadlock Detection', runResult.status, runResult);
  };

  return (
    <div>
      <Header
        title="Deadlock Detection"
        subtitle="Enter Allocation, Request, and Available to detect deadlocked processes."
      />

      <Card title="1. Configure System Size" icon={Grid3x3}>
        <div className="inline-form">
          <label>
            Number of Processes
            <input
              type="number" min="1" max="12"
              value={pendingProcesses}
              onChange={(e) => setPendingProcesses(e.target.value)}
            />
          </label>
          <label>
            Number of Resource Types
            <input
              type="number" min="1" max="8"
              value={pendingResources}
              onChange={(e) => setPendingResources(e.target.value)}
            />
          </label>
          <button className="btn btn-primary" onClick={handleGenerateMatrices}>
            Generate Matrices
          </button>
          <SampleCaseSelector cases={deadlockSampleCases} onLoad={handleLoadSample} />
        </div>
      </Card>

      <Card title="2. Enter Matrices">
        <MatrixInput title="Allocation Matrix" matrix={allocation} onChange={setAllocation} resourceLabels={resourceLabels} />
        <MatrixInput title="Request Matrix" matrix={request} onChange={setRequest} resourceLabels={resourceLabels} />
        <VectorInput title="Available Vector" vector={available} onChange={setAvailable} resourceLabels={resourceLabels} />
        <button className="btn btn-primary btn-run" onClick={handleRun}>
          <PlayCircle size={18} /> Run Deadlock Detection
        </button>
      </Card>

      {errors.length > 0 && (
        <Card title="Validation Errors" className="error-card">
          <ul className="error-list">
            {errors.map((err, i) => <li key={i}>{err}</li>)}
          </ul>
        </Card>
      )}

      {result && (
        <>
          <Card title="Process Checks">
            <div className="table-scroll">
              <table className="matrix-table">
                <thead>
                  <tr>
                    <th>Process</th>
                    <th>Request</th>
                    <th>Work (before)</th>
                    <th>Can Complete?</th>
                    <th>Explanation</th>
                  </tr>
                </thead>
                <tbody>
                  {result.steps.map((step, i) => (
                    <tr key={i}>
                      <td className="process-label">{step.process}</td>
                      <td>[{step.request.join(', ')}]</td>
                      <td>[{step.work.join(', ')}]</td>
                      <td>
                        <StatusBadge
                          status={step.canComplete ? 'COMPLETED' : 'WAITING'}
                          customLabel={step.canComplete ? 'Yes' : 'No'}
                        />
                      </td>
                      <td className="explanation-cell">{step.explanation}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <Card title="Process Status">
            <ProcessStatusTable
              rows={result.processStatus}
              statusKey="completed"
              deadlocked={result.deadlockedProcesses}
            />
          </Card>

          <Card title="Result">
            <div className="result-summary">
              <StatusBadge status={result.status} />
              {result.status === 'DEADLOCK_DETECTED' ? (
                <p>
                  Deadlocked processes: <strong>{result.deadlockedProcesses.join(', ')}</strong>
                </p>
              ) : (
                <p>All processes can complete. No deadlock detected.</p>
              )}
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
