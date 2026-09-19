export const mergeClassNames = (...values: unknown[]): string =>
  values
    .filter((value): value is string => typeof value === "string" && value.length > 0)
    .join(" ");
