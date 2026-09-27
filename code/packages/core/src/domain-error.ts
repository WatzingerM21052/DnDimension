/** Expected domain failures (v0.2 spec §8.2); returned as values, never thrown. */
export const domainErrorCodes = [
  "validation_error",
  "lifecycle_error",
  "revision_conflict",
  "missing_reference",
  "ruleset_conflict",
  "visibility_violation",
  "unsupported_schema",
  "corrupted_data",
] as const;
export type DomainErrorCode = (typeof domainErrorCodes)[number];

export type DomainError = Readonly<{
  code: DomainErrorCode;
  message: string;
  /** Machine-readable details, e.g. invalid field names or the current revision. */
  details?: Readonly<Record<string, unknown>>;
}>;

export const domainError = (
  code: DomainErrorCode,
  message: string,
  details?: Readonly<Record<string, unknown>>,
): DomainError => ({ code, message, ...(details === undefined ? {} : { details }) });
