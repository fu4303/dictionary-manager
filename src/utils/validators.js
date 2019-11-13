function validateDuplicates(
  { outerDomain, outerRange },
  { innerDomain, innerRange },
) {
  const { errors } = this

  // Check if domain + range already exist
  if (outerDomain === innerDomain && outerRange === innerRange) {
    errors.duplicate = true
  }
}

function validateForks({ outerDomain }, { innerDomain }) {
  const { errors } = this

  // Check if domain already exists
  if (outerDomain === innerDomain) {
    errors.fork = true
  }
}

function validateCycles(
  { outerDomain, outerRange },
  { innerDomain, innerRange },
) {
  const { errors } = this

  // Check if current domain is equal to last table item range and vice-versa
  if (outerDomain === innerRange && outerRange === innerDomain) {
    errors.cycle = true
  }
}

function validateChains(
  { outerDomain, outerRange },
  { innerDomain, innerRange },
) {
  const { errors } = this

  // Check if current domain is equal to last table item range or vice-versa
  if (outerDomain === innerRange || outerRange === innerDomain) {
    errors.chain = true
  }
}

export default function validateDictionary(outerRow, table, outerIndex) {
  const errors = {
    duplicate: false,
    fork: false,
    cycle: false,
    chain: false,
  }

  // Compare row passed as parameter to all other rows, except itself
  table.forEach((innerRow, innerIndex) => {
    // Skip if it's comparing the same row
    if (outerIndex === innerIndex) return

    const { domain: outerDomain, range: outerRange } = outerRow
    const { domain: innerDomain, range: innerRange } = innerRow

    // Skip if any of the values is empty, so validation
    // only occurs when both fields have values
    if (!outerDomain || !outerRange || !innerDomain || !innerRange) return

    validateDuplicates.call(
      { errors },
      { outerDomain, outerRange },
      { innerDomain, innerRange },
    )
    validateForks.call(
      { errors },
      { outerDomain, outerRange },
      { innerDomain, innerRange },
    )
    validateCycles.call(
      { errors },
      { outerDomain, outerRange },
      { innerDomain, innerRange },
    )
    validateChains.call(
      { errors },
      { outerDomain, outerRange },
      { innerDomain, innerRange },
    )
  })

  // Check if any error key has a truthy value
  const hasError = Object.values(errors).some(error => error)

  return hasError && errors
}