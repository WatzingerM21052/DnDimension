import { err, ok, type Result } from "./result";

export type BuildInfo = Readonly<{
  version: string;
  commit: string;
}>;

export type BuildInfoError = Readonly<{
  code: "invalid_build_info";
  fields: readonly string[];
}>;

export const parseBuildInfo = (raw: unknown): Result<BuildInfo, BuildInfoError> => {
  if (typeof raw !== "object" || raw === null) {
    return err({ code: "invalid_build_info", fields: ["root"] });
  }

  const input = raw as Record<string, unknown>;
  const fields = [
    typeof input.version === "string" && input.version.trim().length > 0 ? null : "version",
    typeof input.commit === "string" && input.commit.trim().length > 0 ? null : "commit",
  ].filter((field): field is string => field !== null);

  return fields.length > 0
    ? err({ code: "invalid_build_info", fields })
    : ok({ version: input.version as string, commit: input.commit as string });
};
