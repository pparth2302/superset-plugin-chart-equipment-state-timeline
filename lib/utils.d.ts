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
import type { ColumnLike, TimelineSegment, TooltipFieldDefinition, TooltipRow } from './types';
export declare const DEFAULT_REASON_COLORS: Record<string, string>;
export declare const TOOLTIP_FIELD_DEFINITIONS: TooltipFieldDefinition[];
export declare function getColumnLabel(column?: ColumnLike | null): string | undefined;
export declare function stringifyValue(value: unknown, fallback?: string): string;
export declare function parseOptionalNumber(value: unknown, fallback?: number): number | null;
export declare function parsePositiveInteger(value: unknown, fallback: number, bounds?: {
    min?: number;
    max?: number;
}): number;
export declare function parseTimestamp(value: unknown): number | null;
export declare function normalizeDurationValueToMs(value: unknown): number | null;
export declare function formatDuration(value: unknown): string;
export declare function formatNumber(value: unknown): string;
export declare function formatPercent(value: unknown): string;
export declare function formatTimestampValue(value: unknown, formatter: (value: number | Date) => string): string;
export declare function formatTooltipValue(tooltipRow: TooltipRow, formatter: (value: number | Date) => string): string;
export declare function parseStateColorMapping(input?: string | null): Record<string, string>;
export declare function resolveSegmentColor(reason: string, mapping: Record<string, string>, fallbackColor: string): string;
export declare function uniqueColumnLikes(columns: (ColumnLike | undefined)[]): ColumnLike[];
export declare function buildSegmentId(index: number, reason: string, start: number, end: number): string;
export declare function buildTooltipHtml(segment: TimelineSegment, formatter: (value: number | Date) => string): string;
//# sourceMappingURL=utils.d.ts.map