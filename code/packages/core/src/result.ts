export type Result<TValue, TError> =
  Readonly<{ ok: true; value: TValue }> | Readonly<{ ok: false; error: TError }>;

export const ok = <TValue>(value: TValue): Result<TValue, never> => ({
  ok: true,
  value,
});

export const err = <TError>(error: TError): Result<never, TError> => ({
  ok: false,
  error,
});
