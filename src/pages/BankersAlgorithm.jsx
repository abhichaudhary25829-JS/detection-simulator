import { useState } from 'react';
import { PlayCircle, Grid3x3 } from 'lucide-react';
import Header from '../components/Header';
import Card from '../components/Card';
import MatrixInput from '../components/MatrixInput';
import VectorInput from '../components/VectorInput';
import SampleCaseSelector from '../components/SampleCaseSelector';
import StatusBadge from '../components/StatusBadge';
import { useAppState } from '../utils/AppContext';
import { runBankersAlgorithm } from '../algorithms/bankersAlgorithm';
import { validateBankersInput, toNumericMatrix, toNumericVector } from '../algorithms/validation';
import { sampleCases } from '../data/sampleCases';

function buildEmptyMatrix(rows, cols) {
  return Array.from({ length: rows }, () => Array.from({ length: cols }, () => 0));
}

function buildEmptyVector(len) {
  return Array.from({ length: len }, () => 0);
}

export default function BankersAlgorithm() {
  const {
    numProcesses, setNumProcesses,
    numResources, setNumResources,
    allocation, setAllocation,
    maximum, setMaximum,
    available, setAvailable,
    recordRun,
  } = useAppState();

  const [pendingProcesses, setPendingProcesses] = useState(numProcesses);
  const [pendingResources, setPendingResources] = useState(numResources);
  const [errors, setErrors] = useState([]);
  const [result, setResult] = useState(null);

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
    setMaximum(buildEmptyMatrix(p, r));
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
    setMaximum(sampleCase.maximum);
    setAvailable(sampleCase.available);
    setErrors([]);
    setResult(null);
  };

  const handleRun = () => {
    const validationErrors = validateBankersInput({
      numProcesses, numResources, allocation, maximum, available,
    });
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      setResult(null);
      return;
    }
    setErrors([]);
    const numericAllocation = toNumericMatrix(allocation);
    const numericMaximum = toNumericMatrix(maximum);
    const numericAvailable = toNumericVector(available);
    const runResult = runBankersAlgorithm(numericAllocation, numericMaximum, numericAvailable);
    setResult(runResult);
    recordRun("Banker's Algorithm", runResult.status, runResult);
  };

  return (
    <div>
      <Header
        title="Banker's Algorithm"
        subtitle="Enter Allocation, Maximum, and Available to check for a safe state and safe sequence."
      />

      <Card title="1. Configure System Size" icon={Grid3x3}>
        <div className="inline-form">
          <label>
            Number of Processes
            <input
              type="number"
              min="1"
              max="12"
              value={pendingProcesses}
              onChange={(e) => setPendingProcesses(e.target.value)}
            />
          </label>
          <label>
            Number of Resource Types
            <input
              type="number"
              min="1"
              max="8"
              value={pendingResources}
              onChange={(e) => setPendingResources(e.target.value)}
            />
          </label>
          <button className="btn btn-primary" onClick={handleGenerateMatrices}>
            Generate Matrices
          </button>
          <SampleCaseSelector cases={sampleCases} onLoad={handleLoadSample} />
        </div>
      </Card>

      <Card title="2. Enter Matrices">
        <MatrixInput
          title="Allocation Matrix"
          matrix={allocation}
          onChange={setAllocation}
          resourceLabels={resourceLabels}
        />
        <MatrixInput
          title="Maximum Matrix"
          matrix={maximum}
          onChange={setMaximum}
          resourceLabels={resourceLabels}
        />
        <VectorInput
          title="Available Vector"
          vector={available}
          onChange={setAvailable}
          resourceLabels={resourceLabels}
        />
        <button className="btn btn-primary btn-run" onClick={handleRun}>
          <PlayCircle size={18} /> Run Banker's Algorithm
        </button>
      </Card>

      {errors.length > 0 && (
        <Card title="Validation Errors" className="error-card">
          <ul className="error-list">
            {errors.map((err, i) => (
              <li key={i}>{err}</li>
            ))}
          </ul>
        </Card>
      )}

      {result && (
        <>
          <Card title="Need Matrix (Maximum - Allocation)">
            <MatrixInput
              matrix={result.needMatrix}
              onChange={() => {}}
              resourceLabels={resourceLabels}
              readOnly
            />
          </Card>

          <Card title="Process Checks">
            <div className="table-scroll">
              <table className="matrix-table">
                <thead>
                  <tr>
                    <th>Process</th>
                    <th>Need</th>
                    <th>Work (before)</th>
                    <th>Can Execute?</th>
                    <th>Explanation</th>
                  </tr>
                </thead>
                <tbody>
                  {result.steps.map((step, i) => (
                    <tr key={i}>
                      <td className="process-label">{step.process}</td>
                      <td>[{step.need.join(', ')}]</td>
                      <td>[{step.work.join(', ')}]</td>
                      <td>
                        <StatusBadge
                          status={step.canExecute ? 'COMPLETED' : 'WAITING'}
                          customLabel={step.canExecute ? 'Yes' : 'No'}
                        />
                      </td>
                      <td className="explanation-cell">{step.explanation}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <Card title="Result">
            <div className="result-summary">
              <StatusBadge status={result.status} />
              {result.status === 'SAFE' ? (
                <p>
                  Safe Sequence: <strong>{result.safeSequence.join(' → ')}</strong>
                </p>
              ) : (
                <p>
                  No safe sequence exists. Processes unable to finish:{' '}
                  <strong>{result.deadlockedProcesses.join(', ')}</strong>
                </p>
              )}
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
