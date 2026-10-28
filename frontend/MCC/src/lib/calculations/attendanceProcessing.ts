/**
 * Biometric Attendance & Punctuality Telemetry Processing Engine
 * Directorate General of Information & Public Relations (DGIPR), Maharashtra
 */

export interface AttendanceRecord {
  sanctionedStrength: number;
  presentCount: number;
  onTimeCount?: number;
}

/**
 * Calculates Biometric Attendance Percentage.
 * Formula: clamp((presentCount / sanctionedStrength) * 100, 0, 100)
 */
export function calculateAttendancePercent(record: AttendanceRecord): number {
  if (!record || record.sanctionedStrength <= 0) return 0;
  const pct = (record.presentCount / record.sanctionedStrength) * 100;
  return Number(Math.min(100, Math.max(0, pct)).toFixed(1));
}

/**
 * Calculates Staff Punctuality Score.
 * Formula: clamp((onTimeCount / presentCount) * 100, 0, 100)
 */
export function calculatePunctualityScore(record: AttendanceRecord): number {
  if (!record || record.presentCount <= 0) return 0;
  const onTime = record.onTimeCount ?? Math.round(record.presentCount * 0.9);
  const pct = (onTime / record.presentCount) * 100;
  return Number(Math.min(100, Math.max(0, pct)).toFixed(1));
}

/**
 * Calculates aggregated attendance telemetry across all offices.
 */
export function calculateAttendanceSummary(offices: Array<{ sanctionedStrength: number; presentCount: number }>): {
  totalSanctioned: number;
  totalPresent: number;
  overallPercent: number;
} {
  const totalSanctioned = offices.reduce((acc, o) => acc + o.sanctionedStrength, 0);
  const totalPresent = offices.reduce((acc, o) => acc + o.presentCount, 0);
  const overallPercent = totalSanctioned > 0 ? Number(((totalPresent / totalSanctioned) * 100).toFixed(1)) : 0;

  return {
    totalSanctioned,
    totalPresent,
    overallPercent,
  };
}
