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

import React, { useEffect, useMemo, useRef } from 'react';
import * as echarts from 'echarts';
import type {
  EquipmentStateTimelineChartProps,
  LegendPosition,
  TimelineSegment,
} from './types';
import { buildTooltipHtml, formatTimestampValue } from './utils';

function buildDataMask(segment: TimelineSegment, reasonColumnLabel: string) {
  return {
    extraFormData: {
      filters: [
        {
          col: reasonColumnLabel,
          op: 'IN',
          val: [segment.reasonValue ?? segment.reason],
        },
      ],
    },
    filterState: {
      label: `${segment.reason} | ${new Date(segment.start).toISOString()} - ${new Date(
        segment.end,
      ).toISOString()}`,
      selectedValues: [segment.reason],
      value: [segment.reason],
    },
    ownState: {
      selectedSegment: {
        end: segment.end,
        reason: segment.reason,
        start: segment.start,
      },
    },
  };
}

function getChartLayout({
  dataZoomBottomOffset,
  dataZoomGap,
  dataZoomHeight,
  legendItemsCount,
  legendPosition,
  showLegend,
  showXAxis,
  zoomPanEnabled,
}: {
  dataZoomBottomOffset: number;
  dataZoomGap: number;
  dataZoomHeight: number;
  legendItemsCount: number;
  legendPosition: LegendPosition;
  showLegend: boolean;
  showXAxis: boolean;
  zoomPanEnabled: boolean;
}) {
  const legendVisible = showLegend && legendItemsCount > 0;
  const legendHeight = legendVisible ? 36 : 0;
  const axisHeight = showXAxis ? 24 : 0;
  const sliderHeight = zoomPanEnabled ? dataZoomHeight : 0;
  const topPadding = 8;
  const bottomPadding = dataZoomBottomOffset;

  const legendTop =
    legendVisible && legendPosition === 'top' ? 0 : undefined;
  const legendBottom =
    legendVisible && legendPosition === 'bottom'
      ? bottomPadding + (zoomPanEnabled ? sliderHeight + dataZoomGap : 0)
      : undefined;
  const gridTop =
    topPadding + (legendVisible && legendPosition === 'top' ? legendHeight + dataZoomGap : 0);
  const gridBottom =
    bottomPadding +
    (zoomPanEnabled ? sliderHeight + dataZoomGap : 0) +
    axisHeight +
    (legendVisible && legendPosition === 'bottom' ? legendHeight + dataZoomGap : 0);

  return {
    chartHeight: Math.max(80, gridTop + gridBottom),
    dataZoomBottom: bottomPadding,
    gridBottom,
    gridTop,
    legendBottom,
    legendTop,
  };
}

export default function EquipmentStateTimelineChart(
  props: EquipmentStateTimelineChartProps,
) {
  const {
    width,
    height,
    segments,
    rowHeight,
    segmentBorderRadius,
    showXAxis,
    showLegend,
    legendPosition,
    tooltipEnabled,
    zoomPanEnabled,
    dataZoomBottomOffset,
    dataZoomHeight,
    dataZoomGap,
    reasonColumnLabel,
    legendItems,
    xDomain,
    minVisibleTimeRangeMs,
    warnings,
    setDataMask,
    theme,
    timeFormatter,
    tooltipTimeFormatter,
  } = props;
  const containerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<echarts.EChartsType | null>(null);
  const layout = useMemo(
    () =>
      getChartLayout({
        dataZoomBottomOffset,
        dataZoomGap,
        dataZoomHeight,
        legendItemsCount: legendItems.length,
        legendPosition,
        showLegend,
        showXAxis,
        zoomPanEnabled,
      }),
    [
      dataZoomBottomOffset,
      dataZoomGap,
      dataZoomHeight,
      legendItems.length,
      legendPosition,
      showLegend,
      showXAxis,
      zoomPanEnabled,
    ],
  );

  useEffect(() => {
    if (!containerRef.current) {
      return undefined;
    }

    const chart = echarts.init(containerRef.current, undefined, {
      renderer: 'canvas',
    });
    chartRef.current = chart;

    const resizeObserver = new ResizeObserver(() => {
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
    if (!chartRef.current) {
      return undefined;
    }

    const chart = chartRef.current;
    const eventData = segments.map((segment, index) => ({
      itemStyle: { color: segment.color },
      segmentIndex: index,
      value: [0, segment.start, segment.end, segment.durationMs],
    }));
    const gridColor =
      theme?.gridColor ??
      theme?.colors?.grayscale?.light2 ??
      theme?.colors?.grayscale?.light1 ??
      '#d1d5db';
    const axisTextColor =
      theme?.colors?.grayscale?.base ?? theme?.colors?.grayscale?.dark2 ?? '#4b5563';
    const option: echarts.EChartsCoreOption = {
      animation: false,
      grid: {
        top: layout.gridTop,
        right: 16,
        bottom: layout.gridBottom,
        left: 16,
        containLabel: showXAxis,
      },
      legend:
        showLegend && legendItems.length
          ? {
              type: legendItems.length > 6 ? 'scroll' : 'plain',
              left: 16,
              right: 16,
              top: layout.legendTop,
              bottom: layout.legendBottom,
              itemGap: 12,
              icon: 'roundRect',
              selectedMode: false,
              textStyle: {
                color: axisTextColor,
              },
              data: legendItems.map(item => item.name),
            }
          : undefined,
      xAxis: {
        type: 'time',
        min: xDomain[0],
        max: xDomain[1],
        show: showXAxis,
        axisLine: {
          lineStyle: {
            color: gridColor,
          },
        },
        axisTick: {
          show: showXAxis,
        },
        axisLabel: {
          color: axisTextColor,
          formatter: (value: number) => formatTimestampValue(value, timeFormatter),
        },
        splitLine: {
          show: false,
        },
      },
      yAxis: {
        type: 'value',
        min: 0,
        max: 1,
        show: false,
      },
      tooltip: tooltipEnabled
        ? {
            trigger: 'item',
            appendToBody: true,
            backgroundColor: '#ffffff',
            borderColor: '#d1d5db',
            borderWidth: 1,
            className: 'equipment-state-timeline-tooltip',
            extraCssText: 'box-shadow: 0 10px 25px rgba(15, 23, 42, 0.15);',
            formatter: (params: any) => {
              const segment = segments[params.dataIndex as number];
              return segment ? buildTooltipHtml(segment, tooltipTimeFormatter) : '';
            },
          }
        : { show: false },
      dataZoom: zoomPanEnabled
        ? [
            {
              type: 'slider',
              xAxisIndex: 0,
              bottom: layout.dataZoomBottom,
              height: dataZoomHeight,
              filterMode: 'none',
              minValueSpan: minVisibleTimeRangeMs ?? undefined,
              showDataShadow: false,
              brushSelect: false,
              moveHandleSize: 8,
              textStyle: {
                color: axisTextColor,
              },
            },
          ]
        : [],
      series: [
        ...legendItems.map(item => ({
          type: 'scatter' as const,
          name: item.name,
          data: [],
          symbol: 'roundRect',
          itemStyle: {
            color: item.color,
          },
          silent: true,
          tooltip: {
            show: false,
          },
        })),
        {
          type: 'custom',
          name: 'Equipment timeline',
          coordinateSystem: 'cartesian2d',
          dimensions: ['lane', 'start', 'end', 'duration'],
          encode: {
            x: [1, 2],
            y: 0,
            tooltip: [1, 2, 3],
          },
          data: eventData,
          silent: false,
          renderItem: (params: any, api: any) => {
            const start = api.coord([api.value(1), 0]);
            const end = api.coord([api.value(2), 1]);
            const x = start[0];
            const y = end[1];
            const widthPx = Math.max(1, end[0] - start[0]);
            const heightPx = Math.max(1, start[1] - end[1]);
            const clippedShape = echarts.graphic.clipRectByRect(
              {
                x,
                y,
                width: widthPx,
                height: heightPx,
              },
              {
                x: params.coordSys.x,
                y: params.coordSys.y,
                width: params.coordSys.width,
                height: params.coordSys.height,
              },
            );

            return clippedShape
              ? {
                  type: 'rect',
                  shape: {
                    ...clippedShape,
                    r: segmentBorderRadius,
                  },
                  style: api.style(),
                  emphasis: {
                    style: {
                      lineWidth: 1,
                      opacity: 0.9,
                      stroke: '#111827',
                    },
                  },
                }
              : null;
          },
        },
      ],
    };

    chart.setOption(option, true);
    chart.resize({ height, width });

    const handleSeriesClick = (params: Record<string, unknown>) => {
      if (typeof params.dataIndex !== 'number' || !setDataMask) {
        return;
      }

      const segment = segments[params.dataIndex];
      if (!segment) {
        return;
      }

      // TODO: Expand this data mask to include event ids or a time-window filter
      // when the project has a stable event grain beyond the reason column.
      setDataMask(buildDataMask(segment, reasonColumnLabel));
    };
    const zr = chart.getZr();
    const handleBlankClick = (event: { target?: unknown }) => {
      if (event.target || !setDataMask) {
        return;
      }

      setDataMask({
        extraFormData: {},
        filterState: {
          label: null,
          selectedValues: null,
          value: null,
        },
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
  }, [
    dataZoomHeight,
    height,
    layout,
    legendItems,
    minVisibleTimeRangeMs,
    reasonColumnLabel,
    segmentBorderRadius,
    segments,
    setDataMask,
    showLegend,
    showXAxis,
    theme,
    timeFormatter,
    tooltipEnabled,
    tooltipTimeFormatter,
    width,
    xDomain,
    zoomPanEnabled,
  ]);

  if (!segments.length) {
    return (
      <div
        style={{
          alignItems: 'center',
          color: '#6b7280',
          display: 'flex',
          fontSize: 13,
          height,
          justifyContent: 'center',
          padding: 16,
          width,
        }}
      >
        {warnings[0] ?? 'No valid events to display for the current selection.'}
      </div>
    );
  }

  return (
    <div
      style={{
        height: Math.max(height, rowHeight + layout.chartHeight),
        width,
      }}
    >
      <div
        ref={containerRef}
        style={{
          height: Math.max(rowHeight + layout.chartHeight, 80),
          width: '100%',
        }}
      />
    </div>
  );
}
