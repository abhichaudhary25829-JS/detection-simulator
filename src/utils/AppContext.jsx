import { createContext, useContext, useState } from 'react';

// Shared application state: the current matrices, and metadata about the
// last algorithm run, so the Dashboard can reflect real, live status.

const AppContext = createContext(null);

const defaultState = {
  numProcesses: 5,
  numResources: 3,
  allocation: [
    [0, 1, 0],
    [2, 0, 0],
    [3, 0, 2],
    [2, 1, 1],
    [0, 0, 2],
  ],
  maximum: [
    [7, 5, 3],
    [3, 2, 2],
    [9, 0, 2],
    [2, 2, 2],
    [4, 3, 3],
  ],
  available: [3, 3, 2],
};

export function AppProvider({ children }) {
  const [numProcesses, setNumProcesses] = useState(defaultState.numProcesses);
  const [numResources, setNumResources] = useState(defaultState.numResources);
  const [allocation, setAllocation] = useState(defaultState.allocation);
  const [maximum, setMaximum] = useState(defaultState.maximum);
  const [available, setAvailable] = useState(defaultState.available);

  const [lastAlgorithm, setLastAlgorithm] = useState(null); // "Banker's Algorithm" | "Deadlock Detection"
  const [lastStatus, setLastStatus] = useState(null); // "SAFE" | "UNSAFE" | "NO_DEADLOCK" | "DEADLOCK_DETECTED"
  const [lastResult, setLastResult] = useState(null); // full structured result object

  const recordRun = (algorithmName, status, result) => {
    setLastAlgorithm(algorithmName);
    setLastStatus(status);
    setLastResult(result);
  };

  const value = {
    numProcesses, setNumProcesses,
    numResources, setNumResources,
    allocation, setAllocation,
    maximum, setMaximum,
    available, setAvailable,
    lastAlgorithm, lastStatus, lastResult, recordRun,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppState() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppState must be used within an AppProvider');
  return ctx;
}
