"use strict";

exports.__esModule = true;
exports.default = transformProps;
var _core = require("@superset-ui/core");
var _utils = require("../utils");
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); } /**
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
function getRuntimeHooks(chartProps) {
  return chartProps.hooks;
}
function buildTooltipRows(row, formData, reasonColumnLabel, start, end, durationMs) {
  var tooltipRows = [{
    label: 'Reason',
    value: row[reasonColumnLabel],
    valueType: 'string'
  }, {
    label: 'Start Time',
    value: start,
    valueType: 'timestamp'
  }, {
    label: 'End Time',
    value: end,
    valueType: 'timestamp'
  }, {
    label: 'Duration',
    value: durationMs,
    valueType: 'duration'
  }];
  _utils.TOOLTIP_FIELD_DEFINITIONS.forEach(definition => {
    var columnLabel = (0, _utils.getColumnLabel)(formData[definition.controlKey]);
    tooltipRows.push({
      label: definition.label,
      value: columnLabel ? row[columnLabel] : null,
      valueType: definition.valueType
    });
  });
  return tooltipRows;
}
function transformProps(chartProps) {
  var _queriesData$, _rawFormData$show_x_a, _rawFormData$tooltip_, _rawFormData$zoom_pan, _rawFormData$time_lab, _rawFormData$tooltip_2, _rawFormData$default_, _getRuntimeHooks;
  var {
    width,
    height,
    queriesData,
    formData,
    theme
  } = chartProps;
  var rawFormData = chartProps.rawFormData || formData;
  var data = ((_queriesData$ = queriesData[0]) == null ? void 0 : _queriesData$.data) || [];
  var startColumnLabel = (0, _utils.getColumnLabel)(rawFormData.start_time_column);
  var endColumnLabel = (0, _utils.getColumnLabel)(rawFormData.end_time_column);
  var reasonColumnLabel = (0, _utils.getColumnLabel)(rawFormData.reason_column);
  if (!startColumnLabel || !endColumnLabel || !reasonColumnLabel) {
    throw new Error('Equipment State Timeline requires start time, end time, and reason/state columns.');
  }
  var rowHeight = (0, _utils.parsePositiveInteger)(rawFormData.row_height, 44, {
    min: 16
  });
  var segmentBorderRadius = (0, _utils.parsePositiveInteger)(rawFormData.segment_border_radius, 4, {
    min: 0,
    max: Math.floor(rowHeight / 2)
  });
  var showXAxis = (_rawFormData$show_x_a = rawFormData.show_x_axis) != null ? _rawFormData$show_x_a : true;
  var tooltipEnabled = (_rawFormData$tooltip_ = rawFormData.tooltip_enabled) != null ? _rawFormData$tooltip_ : true;
  var zoomPanEnabled = (_rawFormData$zoom_pan = rawFormData.zoom_pan_enabled) != null ? _rawFormData$zoom_pan : true;
  var timeLabelFormat = (_rawFormData$time_lab = rawFormData.time_label_format) != null ? _rawFormData$time_lab : '%m-%d %H:%M';
  var tooltipTimeFormat = (_rawFormData$tooltip_2 = rawFormData.tooltip_time_format) != null ? _rawFormData$tooltip_2 : '%Y-%m-%d %H:%M:%S';
  var fallbackColor = ((_rawFormData$default_ = rawFormData.default_fallback_color) == null ? void 0 : _rawFormData$default_.trim()) || '#9ca3af';
  var minVisibleTimeRangeMs = (0, _utils.parseOptionalNumber)(rawFormData.min_visible_time_range_ms);
  var colorMapping = _extends({}, (0, _utils.parseStateColorMapping)(rawFormData.state_color_mapping));
  var warnings = [];
  var invalidRows = 0;
  var segments = data.slice().sort((left, right) => {
    var _parseTimestamp, _parseTimestamp2;
    var leftStart = (_parseTimestamp = (0, _utils.parseTimestamp)(left[startColumnLabel])) != null ? _parseTimestamp : 0;
    var rightStart = (_parseTimestamp2 = (0, _utils.parseTimestamp)(right[startColumnLabel])) != null ? _parseTimestamp2 : 0;
    return leftStart - rightStart;
  }).reduce((accumulator, row, index) => {
    var start = (0, _utils.parseTimestamp)(row[startColumnLabel]);
    var parsedEnd = (0, _utils.parseTimestamp)(row[endColumnLabel]);
    var end = parsedEnd && start !== null && parsedEnd > start ? parsedEnd : start !== null && minVisibleTimeRangeMs && minVisibleTimeRangeMs > 0 ? start + minVisibleTimeRangeMs : null;
    if (start === null || end === null || end <= start) {
      invalidRows += 1;
      return accumulator;
    }
    var reasonValue = row[reasonColumnLabel];
    var reason = (0, _utils.stringifyValue)(reasonValue, 'Unknown');
    var durationMs = end - start;
    accumulator.push({
      id: (0, _utils.buildSegmentId)(index, reason, start, end),
      reason,
      reasonValue,
      start,
      end,
      durationMs,
      color: (0, _utils.resolveSegmentColor)(reason, colorMapping, fallbackColor),
      row,
      tooltipRows: buildTooltipRows(row, rawFormData, reasonColumnLabel, start, end, durationMs)
    });
    return accumulator;
  }, []);
  if (invalidRows > 0) {
    warnings.push(invalidRows + " row(s) were skipped because start or end timestamps were invalid.");
  }
  var minStart = segments.length ? Math.min(...segments.map(segment => segment.start)) : Date.now();
  var maxEnd = segments.length ? Math.max(...segments.map(segment => segment.end)) : minStart + 3600000;
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
    setDataMask: (_getRuntimeHooks = getRuntimeHooks(chartProps)) == null ? void 0 : _getRuntimeHooks.setDataMask,
    theme,
    timeFormatter: (0, _core.getTimeFormatter)(timeLabelFormat),
    tooltipTimeFormatter: (0, _core.getTimeFormatter)(tooltipTimeFormat)
  };
}