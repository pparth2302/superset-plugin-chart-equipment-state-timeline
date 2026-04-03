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

import { t } from '@superset-ui/core';
import { sections, sharedControls } from '@superset-ui/chart-controls';
import type { ControlPanelConfig } from '@superset-ui/chart-controls';
import StateColorMappingControl from './StateColorMappingControl';
import { DEFAULT_REASON_COLORS } from '../utils';

const controlPanel: ControlPanelConfig = {
  controlPanelSections: [
    {
      label: t('Query'),
      expanded: true,
      tabOverride: 'data',
      controlSetRows: [
        [
          {
            name: 'start_time_column',
            config: {
              ...sharedControls.series,
              label: t('Start time column'),
              description: t('Required. Timestamp column used for the segment start.'),
            },
          },
          {
            name: 'end_time_column',
            config: {
              ...sharedControls.series,
              label: t('End time column'),
              description: t('Required. Timestamp column used for the segment end.'),
            },
          },
        ],
        [
          {
            name: 'reason_column',
            config: {
              ...sharedControls.series,
              label: t('Reason/state column'),
              description: t('Required. Categorical machine state or loss reason.'),
            },
          },
        ],
        [
          {
            name: 'granularity_sqla',
            config: {
              ...sharedControls.series,
              label: t('Dashboard time filter column'),
              clearable: true,
              description: t(
                'Optional temporal column used by Superset native time range filters. This usually matches the start time column.',
              ),
            },
          },
        ],
        [
          {
            name: 'state_color_mapping',
            config: {
              type: StateColorMappingControl,
              label: t('Reason/state colors'),
              default: DEFAULT_REASON_COLORS,
              renderTrigger: true,
              description: t(
                'Assign a color to each reason/state value without using raw JSON.',
              ),
            },
          },
        ],
        [
          {
            name: 'default_fallback_color',
            config: {
              type: 'TextControl',
              label: t('Fallback color'),
              default: '#9ca3af',
              renderTrigger: true,
              description: t('Color used when a state has no explicit mapping.'),
            },
          },
        ],
        ['adhoc_filters'],
        ['row_limit'],
      ],
    },
    {
      label: t('Tooltip Metrics'),
      expanded: true,
      tabOverride: 'data',
      controlSetRows: [
        [
          {
            name: 'detailed_reason_column',
            config: {
              ...sharedControls.series,
              label: t('Detailed Reason column'),
              clearable: true,
              default: null,
            },
          },
        ],
        [
          {
            name: 'productive_pct_column',
            config: {
              ...sharedControls.series,
              label: t('Productive %'),
              clearable: true,
              default: null,
            },
          },
          {
            name: 'not_productive_pct_column',
            config: {
              ...sharedControls.series,
              label: t('Not Productive %'),
              clearable: true,
              default: null,
            },
          },
        ],
        [
          {
            name: 'not_scheduled_pct_column',
            config: {
              ...sharedControls.series,
              label: t('Not Scheduled %'),
              clearable: true,
              default: null,
            },
          },
          {
            name: 'in_count_column',
            config: {
              ...sharedControls.series,
              label: t('In Count'),
              clearable: true,
              default: null,
            },
          },
        ],
        [
          {
            name: 'good_count_column',
            config: {
              ...sharedControls.series,
              label: t('Good Count'),
              clearable: true,
              default: null,
            },
          },
          {
            name: 'reject_count_column',
            config: {
              ...sharedControls.series,
              label: t('Reject Count'),
              clearable: true,
              default: null,
            },
          },
        ],
        [
          {
            name: 'efficiency_column',
            config: {
              ...sharedControls.series,
              label: t('Efficiency'),
              clearable: true,
              default: null,
            },
          },
          {
            name: 'oee_column',
            config: {
              ...sharedControls.series,
              label: t('OEE'),
              clearable: true,
              default: null,
            },
          },
        ],
        [
          {
            name: 'oee_loss_column',
            config: {
              ...sharedControls.series,
              label: t('OEE Loss'),
              clearable: true,
              default: null,
            },
          },
          {
            name: 'down_duration_column',
            config: {
              ...sharedControls.series,
              label: t('Down'),
              clearable: true,
              default: null,
            },
          },
        ],
        [
          {
            name: 'planned_stop_duration_column',
            config: {
              ...sharedControls.series,
              label: t('Planned Stop'),
              clearable: true,
              default: null,
            },
          },
          {
            name: 'cycle_loss_duration_column',
            config: {
              ...sharedControls.series,
              label: t('Cycle Loss'),
              clearable: true,
              default: null,
            },
          },
        ],
        [
          {
            name: 'small_stop_duration_column',
            config: {
              ...sharedControls.series,
              label: t('Small Stop Loss'),
              clearable: true,
              default: null,
            },
          },
          {
            name: 'startup_rejects_column',
            config: {
              ...sharedControls.series,
              label: t('Startup Rejects'),
              clearable: true,
              default: null,
            },
          },
        ],
        [
          {
            name: 'production_rejects_column',
            config: {
              ...sharedControls.series,
              label: t('Production Rejects'),
              clearable: true,
              default: null,
            },
          },
        ],
      ],
    },
    {
      label: t('Display'),
      expanded: true,
      tabOverride: 'customize',
      controlSetRows: [
        [
          {
            name: 'row_height',
            config: {
              type: 'TextControl',
              label: t('Row height'),
              default: 44,
              isInt: true,
              renderTrigger: true,
            },
          },
          {
            name: 'segment_border_radius',
            config: {
              type: 'TextControl',
              label: t('Segment border radius'),
              default: 4,
              isInt: true,
              renderTrigger: true,
            },
          },
        ],
        [
          {
            name: 'show_x_axis',
            config: {
              type: 'CheckboxControl',
              label: t('Show x-axis'),
              default: true,
              renderTrigger: true,
            },
          },
          {
            name: 'show_legend',
            config: {
              type: 'CheckboxControl',
              label: t('Show legend'),
              default: true,
              renderTrigger: true,
            },
          },
          {
            name: 'tooltip_enabled',
            config: {
              type: 'CheckboxControl',
              label: t('Tooltip enabled'),
              default: true,
              renderTrigger: true,
            },
          },
          {
            name: 'zoom_pan_enabled',
            config: {
              type: 'CheckboxControl',
              label: t('Zoom / pan enabled'),
              default: true,
              renderTrigger: true,
            },
          },
        ],
        [
          {
            name: 'time_label_format',
            config: {
              type: 'TextControl',
              label: t('Time label format'),
              default: '%m-%d %H:%M',
              renderTrigger: true,
              description: t('Superset-compatible time format used on the x-axis.'),
            },
          },
          {
            name: 'tooltip_time_format',
            config: {
              type: 'TextControl',
              label: t('Tooltip time format'),
              default: '%Y-%m-%d %H:%M:%S',
              renderTrigger: true,
            },
          },
        ],
        [
          {
            name: 'legend_position',
            config: {
              type: 'SelectControl',
              label: t('Legend Position'),
              default: 'bottom',
              clearable: false,
              renderTrigger: true,
              choices: [
                ['top', t('Top')],
                ['bottom', t('Bottom')],
              ],
            },
          },
        ],
        [
          {
            name: 'data_zoom_bottom_offset',
            config: {
              type: 'TextControl',
              label: t('Data zoom bottom offset'),
              default: 8,
              isInt: true,
              renderTrigger: true,
              description: t('Bottom offset in pixels for the slider zoom control.'),
            },
          },
          {
            name: 'data_zoom_height',
            config: {
              type: 'TextControl',
              label: t('Data zoom height'),
              default: 18,
              isInt: true,
              renderTrigger: true,
              description: t('Height in pixels for the slider zoom control.'),
            },
          },
        ],
        [
          {
            name: 'data_zoom_gap',
            config: {
              type: 'TextControl',
              label: t('Data zoom spacing'),
              default: 10,
              isInt: true,
              renderTrigger: true,
              description: t(
                'Spacing in pixels between the chart content, legend, and data zoom slider.',
              ),
            },
          },
        ],
        [
          {
            name: 'min_visible_time_range_ms',
            config: {
              type: 'TextControl',
              label: t('Minimum visible range (ms)'),
              default: '',
              renderTrigger: true,
              description: t(
                'Optional minimum zoom range in milliseconds to keep very dense timelines readable.',
              ),
            },
          },
        ],
      ],
    },
    {
      ...sections.annotationsAndLayersControls,
      tabOverride: 'data',
    },
    {
      ...sections.advancedAnalyticsControls,
      tabOverride: 'data',
    },
  ],
};

export default controlPanel;
