/**
 * Convert empty strings to null for database insertion.
 * PostgreSQL DATE/TIMESTAMPTZ columns reject empty strings.
 */
export function sanitizeForDb(
  data: Record<string, unknown>
): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const [key, val] of Object.entries(data)) {
    result[key] = val === "" ? null : val;
  }
  return result;
}
