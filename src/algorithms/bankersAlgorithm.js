// bankersAlgorithm.js
// Implements the Banker's Algorithm (Safety Algorithm) used by the OS
// to decide whether the system is in a SAFE or UNSAFE state.
//
// Core idea: Given Allocation, Maximum and Available, compute the Need
// matrix (Need = Maximum - Allocation) and try to find an order
// (safe sequence) in which every process can obtain its remaining need,
// finish, and release its resources back to the pool.

/**
 * Computes the Need matrix: Need[i][j] = Maximum[i][j] - Allocation[i][j]
 */
export function calculateNeedMatrix(allocation, maximum) {
  return maximum.map((row, i) =>
    row.map((max, j) => max - allocation[i][j])
  );
}

/**
 * Compares two vectors element-wise: returns true if every element of `a`
 * is less than or equal to the corresponding element of `b` (a <= b).
 */
function isLessOrEqual(a, b) {
  return a.every((val, idx) => val <= b[idx]);
}

/**
 * Runs the Banker's Safety Algorithm.
 *
 * @param {number[][]} allocation - Allocation matrix [process][resource]
 * @param {number[][]} maximum - Maximum demand matrix [process][resource]
 * @param {number[]} available - Available resource vector
 * @returns {object} structured result describing the run
 */
export function runBankersAlgorithm(allocation, maximum, available) {
  const numProcesses = allocation.length;
  const numResources = available.length;

  const needMatrix = calculateNeedMatrix(allocation, maximum);

  // Work vector starts as a copy of Available.
  let work = [...available];
  const finish = new Array(numProcesses).fill(false);

  const safeSequence = [];
  const steps = [];
  const workHistory = [[...work]];

  let progressMadeInLastPass = true;
  let iterationGuard = 0;

  // Keep scanning for an eligible process until either all processes
  // finish, or a full pass finds no eligible process (=> unsafe).
  while (
    safeSequence.length < numProcesses &&
    progressMadeInLastPass &&
    iterationGuard < numProcesses * numProcesses + 5
  ) {
    progressMadeInLastPass = false;

    for (let i = 0; i < numProcesses; i++) {
      iterationGuard++;
      if (finish[i]) continue;

      const canExecute = isLessOrEqual(needMatrix[i], work);

      steps.push({
        process: `P${i}`,
        processIndex: i,
        need: [...needMatrix[i]],
        work: [...work],
        canExecute,
        explanation: canExecute
          ? `P${i}'s Need (${needMatrix[i].join(', ')}) <= Work (${work.join(', ')}). P${i} can finish. Work is updated by adding P${i}'s Allocation.`
          : `P${i}'s Need (${needMatrix[i].join(', ')}) > Work (${work.join(', ')}). P${i} must wait.`,
      });

      if (canExecute) {
        // Process i can finish: release its allocation back into Work.
        work = work.map((val, idx) => val + allocation[i][idx]);
        finish[i] = true;
        safeSequence.push(`P${i}`);
        workHistory.push([...work]);
        progressMadeInLastPass = true;
      }
    }
  }

  const allFinished = finish.every((f) => f === true);
  const status = allFinished ? 'SAFE' : 'UNSAFE';

  const processStatus = finish.map((f, i) => ({
    process: `P${i}`,
    finished: f,
  }));

  return {
    status,
    safeSequence: allFinished ? safeSequence : [],
    needMatrix,
    steps,
    workHistory,
    processStatus,
    finalWork: work,
    deadlockedProcesses: allFinished
      ? []
      : processStatus.filter((p) => !p.finished).map((p) => p.process),
  };
}
