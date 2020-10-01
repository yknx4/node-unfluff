function __guard__<T = unknown, R = unknown>(value: T, transform: (input: T) => R) {
  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
}
