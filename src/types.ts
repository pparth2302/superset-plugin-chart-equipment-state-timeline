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

import type { QueryFormData, TimeseriesDataRecord } from '@superset-ui/core';

export type ColumnLike =
  | string
  | {
      label?: string;
      column_name?: string;
      sqlExpression?: string;
      expressionType?: string;
    };

export type TooltipValueType =
  | 'string'
  | 'timestamp'
  | 'duration'
  | 'number'
  | 'percent';

export type TooltipControlKey =
  | 'productive_pct_column'
  | 'not_productive_pct_column'
  | 'not_scheduled_pct_column'
  | 'in_count_column'
  | 'good_count_column'
  | 'reject_count_column'
  | 'efficiency_column'
  | 'oee_column'
  | 'oee_loss_column'
  | 'down_duration_column'
  | 'planned_stop_duration_column'
  | 'cycle_loss_duration_column'
  | 'small_stop_duration_column'
  | 'startup_rejects_column'
  | 'production_rejects_column';

export interface TooltipFieldDefinition {
  controlKey: TooltipControlKey;
  label: string;
  valueType: TooltipValueType;
}

export interface TooltipRow {
  label: string;
  value: unknown;
  valueType: TooltipValueType;
}

export interface TimelineSegment {
  id: string;
  reason: string;
  reasonValue: unknown;
  start: number;
  end: number;
  durationMs: number;
  color: string;
  row: TimeseriesDataRecord;
  tooltipRows: TooltipRow[];
}

export interface EquipmentStateTimelineChartFormData extends QueryFormData {
  start_time_column?: ColumnLike;
  end_time_column?: ColumnLike;
  reason_column?: ColumnLike;
  granularity_sqla?: string;
  productive_pct_column?: ColumnLike;
  not_productive_pct_column?: ColumnLike;
  not_scheduled_pct_column?: ColumnLike;
  in_count_column?: ColumnLike;
  good_count_column?: ColumnLike;
  reject_count_column?: ColumnLike;
  efficiency_column?: ColumnLike;
  oee_column?: ColumnLike;
  oee_loss_column?: ColumnLike;
  down_duration_column?: ColumnLike;
  planned_stop_duration_column?: ColumnLike;
  cycle_loss_duration_column?: ColumnLike;
  small_stop_duration_column?: ColumnLike;
  startup_rejects_column?: ColumnLike;
  production_rejects_column?: ColumnLike;
  row_height?: number | string;
  segment_border_radius?: number | string;
  show_x_axis?: boolean;
  time_label_format?: string;
  tooltip_time_format?: string;
  state_color_mapping?: string;
  default_fallback_color?: string;
  tooltip_enabled?: boolean;
  zoom_pan_enabled?: boolean;
  min_visible_time_range_ms?: number | string | null;
  row_limit?: number | string;
}

export interface EquipmentStateTimelineChartProps {
  width: number;
  height: number;
  segments: TimelineSegment[];
  startColumnLabel: string;
  endColumnLabel: string;
  reasonColumnLabel: string;
  rowHeight: number;
  segmentBorderRadius: number;
  showXAxis: boolean;
  tooltipEnabled: boolean;
  zoomPanEnabled: boolean;
  timeLabelFormat: string;
  tooltipTimeFormat: string;
  fallbackColor: string;
  colorMapping: Record<string, string>;
  xDomain: [number, number];
  minVisibleTimeRangeMs: number | null;
  warnings: string[];
  setDataMask?: (dataMask: Record<string, unknown>) => void;
  theme?: Record<string, any>;
  timeFormatter: (value: number | Date) => string;
  tooltipTimeFormatter: (value: number | Date) => string;
}
