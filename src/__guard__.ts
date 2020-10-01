function csLegacyGuard<T = unknown, R = unknown>(value: T | null | undefined, transform: (input: T) => R): R | undefined
function csLegacyGuard<T = unknown, R = unknown>(value: T, transform: (input: T) => R): R
function csLegacyGuard<T = unknown, R = unknown>(value: undefined, transform: (input: T) => R): undefined
function csLegacyGuard<T = unknown, R = unknown>(value: T | undefined, transform: (input: T) => R) {
  return typeof value !== 'undefined' && value !== null ? transform(value) : undefined
}

export { csLegacyGuard }
