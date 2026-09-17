// deadlockDetection.js
// Implements the standard Deadlock Detection Algorithm.
//
// Unlike the Banker's Algorithm (which checks safety BEFORE granting a
// request, using Maximum need), Deadlock Detection works AFTER the fact:
// it uses each process's outstanding Request (or Need) to see which
// processes could still complete with resources currently Available.
// Any process that can never complete is part of a deadlock.

/**
 * Compares two vectors element-wise: a <= b
 */
function isLessOrEqual(a, b) {
  return a.every((val, idx) => val <= b[idx]);
}

/**
 * Runs the Deadlock Detection Algorithm.
 *
 * @param {number[][]} allocation - Allocation matrix [process][resource]
 * @param {number[][]} request - Outstanding Request matrix [process][resource]
 *   (what each process is currently asking for; conceptually equivalent to
 *    the Need matrix in this detection context)
 * @param {number[]} available - Available resource vector
 * @returns {object} structured result describing the run
 */
export function runDeadlockDetection(allocation, request, available) {
  const numProcesses = allocation.length;

  let work = [...available];
  const finish = allocation.map((row) => row.every((val) => val === 0)
    ? false // still tracked normally; a process with 0 allocation can still request
    : false
  );

  const steps = [];
  const workHistory = [[...work]];
  const completedOrder = [];

  let progressMadeInLastPass = true;
  let iterationGuard = 0;

  while (
    progressMadeInLastPass &&
    completedOrder.length < numProcesses &&
    iterationGuard < numProcesses * numProcesses + 5
  ) {
    progressMadeInLastPass = false;

    for (let i = 0; i < numProcesses; i++) {
      iterationGuard++;
      if (finish[i]) continue;

      const canComplete = isLessOrEqual(request[i], work);

      steps.push({
        process: `P${i}`,
        processIndex: i,
        request: [...request[i]],
        work: [...work],
        canComplete,
        explanation: canComplete
          ? `P${i}'s Request (${request[i].join(', ')}) <= Work (${work.join(', ')}). P${i} can obtain resources and finish, releasing its Allocation.`
          : `P${i}'s Request (${request[i].join(', ')}) > Work (${work.join(', ')}). P${i} remains blocked.`,
      });

      if (canComplete) {
        work = work.map((val, idx) => val + allocation[i][idx]);
        finish[i] = true;
        completedOrder.push(`P${i}`);
        workHistory.push([...work]);
        progressMadeInLastPass = true;
      }
    }
  }

  const processStatus = finish.map((f, i) => ({
    process: `P${i}`,
    completed: f,
  }));

  const deadlockedProcesses = processStatus
    .filter((p) => !p.completed)
    .map((p) => p.process);

  const status = deadlockedProcesses.length === 0 ? 'NO_DEADLOCK' : 'DEADLOCK_DETECTED';

  return {
    status,
    completedOrder,
    processStatus,
    deadlockedProcesses,
    steps,
    workHistory,
    finalWork: work,
  };
}
