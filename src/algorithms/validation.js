

export function validateCounts(numProcesses, numResources) {
  const errors = [];
  const p = Number(numProcesses);
  const r = Number(numResources);

  if (numProcesses === '' || numProcesses === null || Number.isNaN(p)) {
    errors.push('Number of processes must be a valid number.');
  } else if (!Number.isInteger(p) || p <= 0) {
    errors.push('Number of processes must be a positive integer.');
  } else if (p > 12) {
    errors.push('Number of processes must be 12 or fewer for a readable simulation.');
  }

  if (numResources === '' || numResources === null || Number.isNaN(r)) {
    errors.push('Number of resource types must be a valid number.');
  } else if (!Number.isInteger(r) || r <= 0) {
    errors.push('Number of resource types must be a positive integer.');
  } else if (r > 8) {
    errors.push('Number of resource types must be 8 or fewer for a readable simulation.');
  }

  return errors;
}

function validateMatrixShape(matrix, rows, cols, label) {
  const errors = [];
  if (!Array.isArray(matrix) || matrix.length !== rows) {
    errors.push(`${label} matrix must have exactly ${rows} row(s).`);
    return errors;
  }
  matrix.forEach((row, i) => {
    if (!Array.isArray(row) || row.length !== cols) {
      errors.push(`${label} matrix row ${i} must have exactly ${cols} value(s).`);
    }
  });
  return errors;
}

function validateNonNegativeNumbers(matrixOrVector, label) {
  const errors = [];
  const flat = Array.isArray(matrixOrVector[0]) ? matrixOrVector.flat() : matrixOrVector;
  flat.forEach((val) => {
    if (val === '' || val === null || val === undefined) {
      errors.push(`${label} contains an empty value.`);
    } else if (Number.isNaN(Number(val))) {
      errors.push(`${label} contains a non-numeric value: "${val}".`);
    } else if (Number(val) < 0) {
      errors.push(`${label} contains a negative value: ${val}.`);
    }
  });
  return [...new Set(errors)];
}

/**
 * Full validation for the Banker's Algorithm inputs.
 */
export function validateBankersInput({ numProcesses, numResources, allocation, maximum, available }) {
  let errors = [];

  errors = errors.concat(validateCounts(numProcesses, numResources));
  if (errors.length > 0) return errors;

  errors = errors.concat(validateMatrixShape(allocation, numProcesses, numResources, 'Allocation'));
  errors = errors.concat(validateMatrixShape(maximum, numProcesses, numResources, 'Maximum'));
  if (!Array.isArray(available) || available.length !== numResources) {
    errors.push(`Available vector must have exactly ${numResources} value(s).`);
  }
  if (errors.length > 0) return errors;

  errors = errors.concat(validateNonNegativeNumbers(allocation, 'Allocation matrix'));
  errors = errors.concat(validateNonNegativeNumbers(maximum, 'Maximum matrix'));
  errors = errors.concat(validateNonNegativeNumbers(available, 'Available vector'));
  if (errors.length > 0) return errors;

  // Allocation must never exceed Maximum for any process/resource pair.
  for (let i = 0; i < numProcesses; i++) {
    for (let j = 0; j < numResources; j++) {
      if (Number(allocation[i][j]) > Number(maximum[i][j])) {
        errors.push(`Allocation[P${i}][R${j}] (${allocation[i][j]}) exceeds Maximum[P${i}][R${j}] (${maximum[i][j]}).`);
      }
    }
  }

  return errors;
}

/**
 * Full validation for Deadlock Detection inputs.
 */
export function validateDeadlockInput({ numProcesses, numResources, allocation, request, available }) {
  let errors = [];

  errors = errors.concat(validateCounts(numProcesses, numResources));
  if (errors.length > 0) return errors;

  errors = errors.concat(validateMatrixShape(allocation, numProcesses, numResources, 'Allocation'));
  errors = errors.concat(validateMatrixShape(request, numProcesses, numResources, 'Request'));
  if (!Array.isArray(available) || available.length !== numResources) {
    errors.push(`Available vector must have exactly ${numResources} value(s).`);
  }
  if (errors.length > 0) return errors;

  errors = errors.concat(validateNonNegativeNumbers(allocation, 'Allocation matrix'));
  errors = errors.concat(validateNonNegativeNumbers(request, 'Request matrix'));
  errors = errors.concat(validateNonNegativeNumbers(available, 'Available vector'));

  return errors;
}

export function toNumericMatrix(matrix) {
  return matrix.map((row) => row.map((val) => Number(val)));
}

export function toNumericVector(vector) {
  return vector.map((val) => Number(val));
}
