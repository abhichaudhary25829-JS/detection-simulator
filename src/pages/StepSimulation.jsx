import { useState, useEffect, useRef } from 'react';
import { Info } from 'lucide-react';
import Header from '../components/Header';
import Card from '../components/Card';
import StepControls from '../components/StepControls';
import StatusBadge from '../components/StatusBadge';
import { useAppState } from '../utils/AppContext';
import { runBankersAlgorithm } from '../algorithms/bankersAlgorithm';
import { validateBankersInput, toNumericMatrix, toNumericVector } from '../algorithms/validation';

export default function StepSimulation() {
  const { numProcesses, numResources, allocation, maximum, available } = useAppState();

  const [steps, setSteps] = useState([]);
  const [finalResult, setFinalResult] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [errors, setErrors] = useState([]);
  const intervalRef = useRef(null);

  useEffect(() => {
    const validationErrors = validateBankersInput({
      numProcesses, numResources, allocation, maximum, available,
    });
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      setSteps([]);
      setFinalResult(null);
      return;
    }
    setErrors([]);
    const result = runBankersAlgorithm(
      toNumericMatrix(allocation),
      toNumericMatrix(maximum),
      toNumericVector(available)
    );
    setSteps(result.steps);
    setFinalResult(result);
    setCurrentStep(0);
  }, [numProcesses, numResources, allocation, maximum, available]);

  useEffect(() => {
    if (isPlaying && currentStep < steps.length - 1) {
      intervalRef.current = setTimeout(() => setCurrentStep((s) => s + 1), 1200);
    } else if (isPlaying && currentStep >= steps.length - 1) {
      setIsPlaying(false);
    }
    return () => clearTimeout(intervalRef.current);
  }, [isPlaying, currentStep, steps.length]);

  const handlePrevious = () => setCurrentStep((s) => Math.max(0, s - 1));
  const handleNext = () => setCurrentStep((s) => Math.min(steps.length - 1, s + 1));
  const handleReset = () => {
    setCurrentStep(0);
    setIsPlaying(false);
  };
  const handlePlayPause = () => setIsPlaying((p) => !p);

  const activeStep = steps[currentStep];

  return (
    <div>
      <Header
        title="Step-by-Step Simulation"
        subtitle="Walk through the Banker's Algorithm safety check one process decision at a time. Uses the data currently entered on the Banker's Algorithm page."
      />

      {errors.length > 0 && (
        <Card title="Cannot Simulate — Fix Input First" className="error-card">
          <ul className="error-list">
            {errors.map((err, i) => <li key={i}>{err}</li>)}
          </ul>
          <p className="muted">Go to the Banker's Algorithm page to enter or fix your matrices.</p>
        </Card>
      )}

      {steps.length > 0 && (
        <>
          <Card>
            <StepControls
              currentStep={currentStep}
              totalSteps={steps.length}
              onPrevious={handlePrevious}
              onNext={handleNext}
              onPlayPause={handlePlayPause}
              onReset={handleReset}
              isPlaying={isPlaying}
            />
          </Card>

          {activeStep && (
            <Card title={`Checking Process ${activeStep.process}`} icon={Info}>
              <div className="step-detail-grid">
                <div>
                  <h4>Current Process</h4>
                  <p className="stat-value-small">{activeStep.process}</p>
                </div>
                <div>
                  <h4>Current Work / Available Vector</h4>
                  <p>[{activeStep.work.join(', ')}]</p>
                </div>
                <div>
                  <h4>Current Need Vector</h4>
                  <p>[{activeStep.need.join(', ')}]</p>
                </div>
                <div>
                  <h4>Can Execute?</h4>
                  <StatusBadge
                    status={activeStep.canExecute ? 'COMPLETED' : 'WAITING'}
                    customLabel={activeStep.canExecute ? 'Yes — process finishes' : 'No — must wait'}
                  />
                </div>
              </div>
              <div className="explanation-box">
                <p>{activeStep.explanation}</p>
              </div>
            </Card>
          )}

          {finalResult && currentStep === steps.length - 1 && (
            <Card title="Final Result">
              <div className="result-summary">
                <StatusBadge status={finalResult.status} />
                {finalResult.status === 'SAFE' ? (
                  <p>Safe Sequence: <strong>{finalResult.safeSequence.join(' → ')}</strong></p>
                ) : (
                  <p>Processes unable to finish: <strong>{finalResult.deadlockedProcesses.join(', ')}</strong></p>
                )}
              </div>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
