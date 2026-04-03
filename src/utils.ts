/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import type {
  ColumnLike,
  TimelineSegment,
  TooltipFieldDefinition,
  TooltipRow,
} from './types';

export const DEFAULT_REASON_COLORS: Record<string, string> = {
  'Running Normally': '#16a34a',
  Running: '#16a34a',
  'Down / Fault': '#dc2626',
  Down: '#dc2626',
  Fault: '#dc2626',
  'Planned Stop': '#f59e0b',
  Idle: '#6b7280',
  Waiting: '#6b7280',
  'Production Reject': '#7f1d1d',
};

export const TOOLTIP_FIELD_DEFINITIONS: TooltipFieldDefinition[] = [
  { controlKey: 'productive_pct_column', label: 'Productive %', valueType: 'percent' },
  {
    controlKey: 'not_productive_pct_column',
    label: 'Not Productive %',
    valueType: 'percent',
  },
  {
    controlKey: 'not_scheduled_pct_column',
    label: 'Not Scheduled %',
    valueType: 'percent',
  },
  { controlKey: 'in_count_column', label: 'In Count', valueType: 'number' },
  { controlKey: 'good_count_column', label: 'Good Count', valueType: 'number' },
  { controlKey: 'reject_count_column', label: 'Reject Count', valueType: 'number' },
  { controlKey: 'efficiency_column', label: 'Efficiency', valueType: 'percent' },
  { controlKey: 'oee_column', label: 'OEE', valueType: 'percent' },
  { controlKey: 'oee_loss_column', label: 'OEE Loss', valueType: 'percent' },
  { controlKey: 'down_duration_column', label: 'Down', valueType: 'duration' },
  {
    controlKey: 'planned_stop_duration_column',
    label: 'Planned Stop',
    valueType: 'duration',
  },
  { controlKey: 'cycle_loss_duration_column', label: 'Cycle Loss', valueType: 'duration' },
  {
    controlKey: 'small_stop_duration_column',
    label: 'Small Stop Loss',
    valueType: 'duration',
  },
  {
    controlKey: 'startup_rejects_column',
    label: 'Startup Rejects',
    valueType: 'number',
  },
  {
    controlKey: 'production_rejects_column',
    label: 'Production Rejects',
    valueType: 'number',
  },
];

export function getColumnLabel(column?: ColumnLike | null): string | undefined {
  if (!column) {
    return undefined;
  }

  if (typeof column === 'string') {
    return column;
  }

  return column.label ?? column.column_name ?? column.sqlExpression;
}

export function stringifyValue(value: unknown, fallback = 'Unknown'): string {
  if (value === null || typeof value === 'undefined' || value === '') {
    return fallback;
  }

  return String(value);
}

export function parseOptionalNumber(value: unknown, fallback?: number): number | null {
  if (value === null || typeof value === 'undefined' || value === '') {
    return typeof fallback === 'number' ? fallback : null;
  }

  const numeric = Number(value);
  if (!Number.isFinite(numeric)) {
    return typeof fallback === 'number' ? fallback : null;
  }

  return numeric;
}

export function parsePositiveInteger(
  value: unknown,
  fallback: number,
  bounds?: { min?: number; max?: number },
): number {
  const parsed = parseOptionalNumber(value, fallback) ?? fallback;
  const rounded = Math.round(parsed);
  const min = bounds?.min ?? 0;
  const max = bounds?.max;
  const clamped = Math.max(min, rounded);

  return typeof max === 'number' ? Math.min(max, clamped) : clamped;
}

export function parseTimestamp(value: unknown): number | null {
  if (value instanceof Date) {
    const timestamp = value.getTime();
    return Number.isFinite(timestamp) ? timestamp : null;
  }

  if (typeof value === 'number' && Number.isFinite(value)) {
    if (Math.abs(value) < 100000000000) {
      return value * 1000;
    }

    return value;
  }

  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) {
      return null;
    }

    if (/^\d+$/.test(trimmed)) {
      const numeric = Number(trimmed);
      return Math.abs(numeric) < 100000000000 ? numeric * 1000 : numeric;
    }

    const normalized =
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/.test(trimmed) ? `${trimmed}Z` : trimmed;
    const parsed = Date.parse(normalized);
    return Number.isNaN(parsed) ? null : parsed;
  }

  return null;
}

export function normalizeDurationValueToMs(value: unknown): number | null {
  if (typeof value === 'string' && /^\d{1,2}:\d{2}:\d{2}$/.test(value.trim())) {
    const [hours, minutes, seconds] = value.split(':').map(Number);
    return ((hours * 60 + minutes) * 60 + seconds) * 1000;
  }

  const numeric = parseOptionalNumber(value);
  if (numeric === null) {
    return null;
  }

  return Math.abs(numeric) < 1000000 ? numeric * 1000 : numeric;
}

export function formatDuration(value: unknown): string {
  const durationMs = typeof value === 'number' ? value : normalizeDurationValueToMs(value);
  if (durationMs === null) {
    return 'N/A';
  }

  const totalSeconds = Math.max(0, Math.round(durationMs / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return [hours, minutes, seconds].map(part => String(part).padStart(2, '0')).join(':');
}

export function formatNumber(value: unknown): string {
  const numeric = parseOptionalNumber(value);
  if (numeric === null) {
    return 'N/A';
  }

  return numeric.toLocaleString(undefined, { maximumFractionDigits: 2 });
}

export function formatPercent(value: unknown): string {
  const numeric = parseOptionalNumber(value);
  if (numeric === null) {
    return 'N/A';
  }

  const percentValue = Math.abs(numeric) <= 1 ? numeric * 100 : numeric;
  return `${percentValue.toLocaleString(undefined, {
    maximumFractionDigits: 2,
  })}%`;
}

export function formatTimestampValue(
  value: unknown,
  formatter: (value: number | Date) => string,
): string {
  const timestamp = parseTimestamp(value);
  if (timestamp === null) {
    return 'N/A';
  }

  return formatter(timestamp);
}

export function formatTooltipValue(
  tooltipRow: TooltipRow,
  formatter: (value: number | Date) => string,
): string {
  switch (tooltipRow.valueType) {
    case 'timestamp':
      return formatTimestampValue(tooltipRow.value, formatter);
    case 'duration':
      return formatDuration(tooltipRow.value);
    case 'number':
      return formatNumber(tooltipRow.value);
    case 'percent':
      return formatPercent(tooltipRow.value);
    default:
      return stringifyValue(tooltipRow.value, 'N/A');
  }
}

export function parseStateColorMapping(input?: string | null): Record<string, string> {
  if (!input?.trim()) {
    return {};
  }

  try {
    const parsed = JSON.parse(input);
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      return Object.entries(parsed).reduce<Record<string, string>>((accumulator, entry) => {
        const [key, value] = entry;
        if (typeof value === 'string' && key.trim()) {
          accumulator[key.trim()] = value.trim();
        }

        return accumulator;
      }, {});
    }
  } catch (error) {
    // Fall through to line-based parsing below.
  }

  return input.split(/\r?\n/).reduce<Record<string, string>>((accumulator, line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) {
      return accumulator;
    }

    const [rawKey, rawValue] = trimmed.split(/\s*[:=]\s*/, 2);
    if (rawKey && rawValue) {
      accumulator[rawKey.trim()] = rawValue.trim();
    }

    return accumulator;
  }, {});
}

export function resolveSegmentColor(
  reason: string,
  mapping: Record<string, string>,
  fallbackColor: string,
): string {
  return mapping[reason] ?? DEFAULT_REASON_COLORS[reason] ?? fallbackColor;
}

export function uniqueColumnLikes(columns: (ColumnLike | undefined)[]): ColumnLike[] {
  const seen = new Set<string>();

  return columns.reduce<ColumnLike[]>((accumulator, column) => {
    const label = getColumnLabel(column);
    if (!label || seen.has(label)) {
      return accumulator;
    }

    seen.add(label);
    accumulator.push(column as ColumnLike);
    return accumulator;
  }, []);
}

export function buildSegmentId(index: number, reason: string, start: number, end: number): string {
  return `${index}:${reason}:${start}:${end}`;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function buildTooltipHtml(
  segment: TimelineSegment,
  formatter: (value: number | Date) => string,
): string {
  const rows = segment.tooltipRows
    .map(tooltipRow => {
      const label = escapeHtml(tooltipRow.label);
      const value = escapeHtml(formatTooltipValue(tooltipRow, formatter));
      return `<tr><td style="padding:2px 12px 2px 0;color:#6b7280;">${label}</td><td style="padding:2px 0;text-align:right;color:#111827;font-weight:600;">${value}</td></tr>`;
    })
    .join('');

  return [
    '<div style="min-width:240px;">',
    `<div style="font-weight:700;font-size:13px;margin-bottom:6px;color:#111827;">${escapeHtml(
      segment.reason,
    )}</div>`,
    '<table style="border-collapse:collapse;width:100%;font-size:12px;line-height:1.35;">',
    rows,
    '</table>',
    '</div>',
  ].join('');
}
