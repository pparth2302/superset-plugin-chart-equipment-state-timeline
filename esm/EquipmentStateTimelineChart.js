function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
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

import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import { buildTooltipHtml, formatTimestampValue } from './utils';
function buildDataMask(segment, reasonColumnLabel) {
  var _segment$reasonValue;
  return {
    extraFormData: {
      filters: [{
        col: reasonColumnLabel,
        op: 'IN',
        val: [(_segment$reasonValue = segment.reasonValue) != null ? _segment$reasonValue : segment.reason]
      }]
    },
    filterState: {
      label: segment.reason + " | " + new Date(segment.start).toISOString() + " - " + new Date(segment.end).toISOString(),
      selectedValues: [segment.reason],
      value: [segment.reason]
    },
    ownState: {
      selectedSegment: {
        end: segment.end,
        reason: segment.reason,
        start: segment.start
      }
    }
  };
}
export default function EquipmentStateTimelineChart(props) {
  var {
    width,
    height,
    segments,
    rowHeight,
    segmentBorderRadius,
    showXAxis,
    tooltipEnabled,
    zoomPanEnabled,
    reasonColumnLabel,
    xDomain,
    minVisibleTimeRangeMs,
    warnings,
    setDataMask,
    theme,
    timeFormatter,
    tooltipTimeFormatter
  } = props;
  var containerRef = useRef(null);
  var chartRef = useRef(null);
  useEffect(() => {
    if (!containerRef.current) {
      return undefined;
    }
    var chart = echarts.init(containerRef.current, undefined, {
      renderer: 'canvas'
    });
    chartRef.current = chart;
    var resizeObserver = new ResizeObserver(() => {
      chart.resize();
    });
    resizeObserver.observe(containerRef.current);
    return () => {
      resizeObserver.disconnect();
      chart.dispose();
      chartRef.current = null;
    };
  }, []);
  useEffect(() => {
    var _ref, _ref2, _theme$gridColor, _theme$colors, _theme$colors2, _ref3, _theme$colors$graysca, _theme$colors3, _theme$colors4;
    if (!chartRef.current) {
      return undefined;
    }
    var chart = chartRef.current;
    var eventData = segments.map((segment, index) => ({
      itemStyle: {
        color: segment.color
      },
      segmentIndex: index,
      value: [0, segment.start, segment.end, segment.durationMs]
    }));
    var gridColor = (_ref = (_ref2 = (_theme$gridColor = theme == null ? void 0 : theme.gridColor) != null ? _theme$gridColor : theme == null || (_theme$colors = theme.colors) == null || (_theme$colors = _theme$colors.grayscale) == null ? void 0 : _theme$colors.light2) != null ? _ref2 : theme == null || (_theme$colors2 = theme.colors) == null || (_theme$colors2 = _theme$colors2.grayscale) == null ? void 0 : _theme$colors2.light1) != null ? _ref : '#d1d5db';
    var axisTextColor = (_ref3 = (_theme$colors$graysca = theme == null || (_theme$colors3 = theme.colors) == null || (_theme$colors3 = _theme$colors3.grayscale) == null ? void 0 : _theme$colors3.base) != null ? _theme$colors$graysca : theme == null || (_theme$colors4 = theme.colors) == null || (_theme$colors4 = _theme$colors4.grayscale) == null ? void 0 : _theme$colors4.dark2) != null ? _ref3 : '#4b5563';
    var option = {
      animation: false,
      grid: {
        top: 8,
        right: 16,
        bottom: showXAxis || zoomPanEnabled ? 48 : 12,
        left: 16,
        containLabel: showXAxis
      },
      xAxis: {
        type: 'time',
        min: xDomain[0],
        max: xDomain[1],
        show: showXAxis,
        axisLine: {
          lineStyle: {
            color: gridColor
          }
        },
        axisTick: {
          show: showXAxis
        },
        axisLabel: {
          color: axisTextColor,
          formatter: value => formatTimestampValue(value, timeFormatter)
        },
        splitLine: {
          show: false
        }
      },
      yAxis: {
        type: 'value',
        min: 0,
        max: 1,
        show: false
      },
      tooltip: tooltipEnabled ? {
        trigger: 'item',
        appendToBody: true,
        backgroundColor: '#ffffff',
        borderColor: '#d1d5db',
        borderWidth: 1,
        className: 'equipment-state-timeline-tooltip',
        extraCssText: 'box-shadow: 0 10px 25px rgba(15, 23, 42, 0.15);',
        formatter: params => {
          var segment = segments[params.dataIndex];
          return segment ? buildTooltipHtml(segment, tooltipTimeFormatter) : '';
        }
      } : {
        show: false
      },
      dataZoom: zoomPanEnabled ? [{
        type: 'inside',
        xAxisIndex: 0,
        filterMode: 'none',
        minValueSpan: minVisibleTimeRangeMs != null ? minVisibleTimeRangeMs : undefined,
        moveOnMouseMove: true,
        moveOnMouseWheel: true,
        zoomOnMouseWheel: true
      }, {
        type: 'slider',
        xAxisIndex: 0,
        bottom: 8,
        height: 18,
        filterMode: 'none',
        minValueSpan: minVisibleTimeRangeMs != null ? minVisibleTimeRangeMs : undefined,
        showDataShadow: false,
        textStyle: {
          color: axisTextColor
        }
      }] : [],
      series: [{
        type: 'custom',
        coordinateSystem: 'cartesian2d',
        dimensions: ['lane', 'start', 'end', 'duration'],
        encode: {
          x: [1, 2],
          y: 0,
          tooltip: [1, 2, 3]
        },
        data: eventData,
        silent: false,
        renderItem: (params, api) => {
          var start = api.coord([api.value(1), 0]);
          var end = api.coord([api.value(2), 1]);
          var x = start[0];
          var y = end[1];
          var widthPx = Math.max(1, end[0] - start[0]);
          var heightPx = Math.max(1, start[1] - end[1]);
          var clippedShape = echarts.graphic.clipRectByRect({
            x,
            y,
            width: widthPx,
            height: heightPx
          }, {
            x: params.coordSys.x,
            y: params.coordSys.y,
            width: params.coordSys.width,
            height: params.coordSys.height
          });
          return clippedShape ? {
            type: 'rect',
            shape: _extends({}, clippedShape, {
              r: segmentBorderRadius
            }),
            style: api.style(),
            emphasis: {
              style: {
                lineWidth: 1,
                opacity: 0.9,
                stroke: '#111827'
              }
            }
          } : null;
        }
      }]
    };
    chart.setOption(option, true);
    chart.resize({
      height,
      width
    });
    var handleSeriesClick = params => {
      if (typeof params.dataIndex !== 'number' || !setDataMask) {
        return;
      }
      var segment = segments[params.dataIndex];
      if (!segment) {
        return;
      }

      // TODO: Expand this data mask to include event ids or a time-window filter
      // when the project has a stable event grain beyond the reason column.
      setDataMask(buildDataMask(segment, reasonColumnLabel));
    };
    var zr = chart.getZr();
    var handleBlankClick = event => {
      if (event.target || !setDataMask) {
        return;
      }
      setDataMask({
        extraFormData: {},
        filterState: {
          label: null,
          selectedValues: null,
          value: null
        }
      });
    };
    chart.off('click');
    chart.on('click', handleSeriesClick);
    zr.off('click');
    zr.on('click', handleBlankClick);
    return () => {
      chart.off('click', handleSeriesClick);
      zr.off('click', handleBlankClick);
    };
  }, [height, minVisibleTimeRangeMs, reasonColumnLabel, segmentBorderRadius, segments, setDataMask, showXAxis, theme, timeFormatter, tooltipEnabled, tooltipTimeFormatter, width, xDomain, zoomPanEnabled]);
  if (!segments.length) {
    var _warnings$;
    return /*#__PURE__*/React.createElement("div", {
      style: {
        alignItems: 'center',
        color: '#6b7280',
        display: 'flex',
        fontSize: 13,
        height,
        justifyContent: 'center',
        padding: 16,
        width
      }
    }, (_warnings$ = warnings[0]) != null ? _warnings$ : 'No valid events to display for the current selection.');
  }
  return /*#__PURE__*/React.createElement("div", {
    style: {
      height: Math.max(height, rowHeight + (showXAxis || zoomPanEnabled ? 52 : 16)),
      width
    }
  }, /*#__PURE__*/React.createElement("div", {
    ref: containerRef,
    style: {
      height: Math.max(rowHeight + (showXAxis || zoomPanEnabled ? 52 : 16), 80),
      width: '100%'
    }
  }));
}