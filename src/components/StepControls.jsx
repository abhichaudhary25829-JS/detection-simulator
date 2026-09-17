import { SkipBack, ChevronLeft, ChevronRight, Play, Pause, RotateCcw } from 'lucide-react';

export default function StepControls({
  currentStep,
  totalSteps,
  onPrevious,
  onNext,
  onPlayPause,
  onReset,
  isPlaying,
}) {
  return (
    <div className="step-controls">
      <button className="btn btn-secondary" onClick={onReset} title="Reset to first step">
        <RotateCcw size={16} /> Reset
      </button>
      <button
        className="btn btn-secondary"
        onClick={onPrevious}
        disabled={currentStep === 0}
        title="Previous step"
      >
        <ChevronLeft size={16} /> Previous
      </button>
      <button className="btn btn-primary" onClick={onPlayPause} title="Play / Pause">
        {isPlaying ? <Pause size={16} /> : <Play size={16} />}
        {isPlaying ? 'Pause' : 'Play'}
      </button>
      <button
        className="btn btn-secondary"
        onClick={onNext}
        disabled={currentStep >= totalSteps - 1}
        title="Next step"
      >
        Next <ChevronRight size={16} />
      </button>
      <span className="step-counter">
        <SkipBack size={14} /> Step {totalSteps === 0 ? 0 : currentStep + 1} of {totalSteps}
      </span>
    </div>
  );
}
