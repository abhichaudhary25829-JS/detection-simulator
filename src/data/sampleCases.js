// sampleCases.js
// Ready-made test cases so the app can be demonstrated instantly
// without manual data entry.

export const sampleCases = [
  {
    id: 'safe-case',
    name: 'Classic Safe Case (5 processes, 3 resources)',
    description: 'The textbook example where a safe sequence exists.',
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
  },
  {
    id: 'unsafe-case',
    name: 'Unsafe Case (4 processes, 3 resources)',
    description: 'No process can ever satisfy its need — the system is unsafe.',
    numProcesses: 4,
    numResources: 3,
    allocation: [
      [1, 0, 0],
      [2, 1, 1],
      [1, 2, 1],
      [1, 0, 3],
    ],
    maximum: [
      [8, 5, 6],
      [4, 3, 2],
      [5, 4, 4],
      [2, 1, 4],
    ],
    available: [0, 0, 0],
  },
  {
    id: 'general-case',
    name: 'General/Custom Case (3 processes, 2 resources)',
    description: 'A smaller custom scenario for quick demonstration.',
    numProcesses: 3,
    numResources: 2,
    allocation: [
      [1, 2],
      [2, 1],
      [1, 0],
    ],
    maximum: [
      [3, 3],
      [3, 2],
      [2, 2],
    ],
    available: [2, 1],
  },
];

// Sample data specifically shaped for the Deadlock Detection page
// (uses "request" instead of "maximum").
export const deadlockSampleCases = [
  {
    id: 'no-deadlock',
    name: 'No Deadlock (all processes can complete)',
    numProcesses: 3,
    numResources: 2,
    allocation: [
      [1, 0],
      [0, 1],
      [1, 1],
    ],
    request: [
      [0, 1],
      [1, 0],
      [0, 0],
    ],
    available: [1, 0],
  },
  {
    id: 'deadlock-present',
    name: 'Deadlock Present (circular wait)',
    numProcesses: 3,
    numResources: 2,
    allocation: [
      [1, 0],
      [0, 1],
      [0, 0],
    ],
    request: [
      [0, 1],
      [1, 0],
      [1, 1],
    ],
    available: [0, 0],
  },
];
