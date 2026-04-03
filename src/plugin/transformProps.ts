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

import { ChartProps, getTimeFormatter } from '@superset-ui/core';
import type { QueryFormData, TimeseriesDataRecord } from '@superset-ui/core';
import type {
  EquipmentStateTimelineChartFormData,
  EquipmentStateTimelineChartProps,
  TimelineSegment,
} from '../types';
import {
  TOOLTIP_FIELD_DEFINITIONS,
  buildSegmentId,
  getColumnLabel,
  parseOptionalNumber,
  parsePositiveInteger,
  parseStateColorMapping,
  parseTimestamp,
  resolveSegmentColor,
  stringifyValue,
} from '../utils';

function getRuntimeHooks(chartProps: ChartProps) {
  return (chartProps as unknown as {
    hooks?: {
      setDataMask?: (dataMask: Record<string, unknown>) => void;
    };
  }).hooks;
}

function buildTooltipRows(
  row: TimeseriesDataRecord,
  formData: EquipmentStateTimelineChartFormData,
  reasonColumnLabel: string,
  start: number,
  end: number,
  durationMs: number,
): TimelineSegment['tooltipRows'] {
  const tooltipRows: TimelineSegment['tooltipRows'] = [
    { label: 'Reason', value: row[reasonColumnLabel], valueType: 'string' },
    { label: 'Start Time', value: start, valueType: 'timestamp' },
    { label: 'End Time', value: end, valueType: 'timestamp' },
    { label: 'Duration', value: durationMs, valueType: 'duration' },
  ];

  TOOLTIP_FIELD_DEFINITIONS.forEach(definition => {
    const columnLabel = getColumnLabel(formData[definition.controlKey]);
    tooltipRows.push({
      label: definition.label,
      value: columnLabel ? row[columnLabel] : null,
      valueType: definition.valueType,
    });
  });

  return tooltipRows;
}

export default function transformProps(
  chartProps: ChartProps,
): EquipmentStateTimelineChartProps {
  const { width, height, queriesData, formData, theme } = chartProps;
  const rawFormData =
    ((chartProps as unknown as { rawFormData?: QueryFormData }).rawFormData as
      | EquipmentStateTimelineChartFormData
      | undefined) || (formData as EquipmentStateTimelineChartFormData);
  const data = (queriesData[0]?.data || []) as TimeseriesDataRecord[];
  const startColumnLabel = getColumnLabel(rawFormData.start_time_column);
  const endColumnLabel = getColumnLabel(rawFormData.end_time_column);
  const reasonColumnLabel = getColumnLabel(rawFormData.reason_column);

  if (!startColumnLabel || !endColumnLabel || !reasonColumnLabel) {
    throw new Error(
      'Equipment State Timeline requires start time, end time, and reason/state columns.',
    );
  }

  const rowHeight = parsePositiveInteger(rawFormData.row_height, 44, { min: 16 });
  const segmentBorderRadius = parsePositiveInteger(rawFormData.segment_border_radius, 4, {
    min: 0,
    max: Math.floor(rowHeight / 2),
  });
  const showXAxis = rawFormData.show_x_axis ?? true;
  const tooltipEnabled = rawFormData.tooltip_enabled ?? true;
  const zoomPanEnabled = rawFormData.zoom_pan_enabled ?? true;
  const timeLabelFormat = rawFormData.time_label_format ?? '%m-%d %H:%M';
  const tooltipTimeFormat = rawFormData.tooltip_time_format ?? '%Y-%m-%d %H:%M:%S';
  const fallbackColor = rawFormData.default_fallback_color?.trim() || '#9ca3af';
  const minVisibleTimeRangeMs = parseOptionalNumber(rawFormData.min_visible_time_range_ms);
  const colorMapping = {
    ...parseStateColorMapping(rawFormData.state_color_mapping),
  };
  const warnings: string[] = [];
  let invalidRows = 0;

  const segments = data
    .slice()
    .sort((left, right) => {
      const leftStart = parseTimestamp(left[startColumnLabel]) ?? 0;
      const rightStart = parseTimestamp(right[startColumnLabel]) ?? 0;
      return leftStart - rightStart;
    })
    .reduce<TimelineSegment[]>((accumulator, row, index) => {
      const start = parseTimestamp(row[startColumnLabel]);
      const parsedEnd = parseTimestamp(row[endColumnLabel]);
      const end =
        parsedEnd && start !== null && parsedEnd > start
          ? parsedEnd
          : start !== null && minVisibleTimeRangeMs && minVisibleTimeRangeMs > 0
            ? start + minVisibleTimeRangeMs
            : null;

      if (start === null || end === null || end <= start) {
        invalidRows += 1;
        return accumulator;
      }

      const reasonValue = row[reasonColumnLabel];
      const reason = stringifyValue(reasonValue, 'Unknown');
      const durationMs = end - start;

      accumulator.push({
        id: buildSegmentId(index, reason, start, end),
        reason,
        reasonValue,
        start,
        end,
        durationMs,
        color: resolveSegmentColor(reason, colorMapping, fallbackColor),
        row,
        tooltipRows: buildTooltipRows(
          row,
          rawFormData,
          reasonColumnLabel,
          start,
          end,
          durationMs,
        ),
      });
      return accumulator;
    }, []);

  if (invalidRows > 0) {
    warnings.push(
      `${invalidRows} row(s) were skipped because start or end timestamps were invalid.`,
    );
  }

  const minStart = segments.length
    ? Math.min(...segments.map(segment => segment.start))
    : Date.now();
  const maxEnd = segments.length
    ? Math.max(...segments.map(segment => segment.end))
    : minStart + 3600000;

  return {
    width,
    height,
    segments,
    startColumnLabel,
    endColumnLabel,
    reasonColumnLabel,
    rowHeight,
    segmentBorderRadius,
    showXAxis,
    tooltipEnabled,
    zoomPanEnabled,
    timeLabelFormat,
    tooltipTimeFormat,
    fallbackColor,
    colorMapping,
    xDomain: [minStart, maxEnd],
    minVisibleTimeRangeMs,
    warnings,
    setDataMask: getRuntimeHooks(chartProps)?.setDataMask,
    theme,
    timeFormatter: getTimeFormatter(timeLabelFormat),
    tooltipTimeFormatter: getTimeFormatter(tooltipTimeFormat),
  };
}
