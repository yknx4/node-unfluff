declare function csLegacyGuard<T = unknown, R = unknown>(value: T | null | undefined, transform: (input: T) => R): R | undefined;
declare function csLegacyGuard<T = unknown, R = unknown>(value: T, transform: (input: T) => R): R;
declare function csLegacyGuard<T = unknown, R = unknown>(value: undefined, transform: (input: T) => R): undefined;
export { csLegacyGuard };
//# sourceMappingURL=__guard__.d.ts.map