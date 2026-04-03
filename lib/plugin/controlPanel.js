"use strict";

exports.__esModule = true;
exports.default = void 0;
var _core = require("@superset-ui/core");
var _chartControls = require("@superset-ui/chart-controls");
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
var controlPanel = {
  controlPanelSections: [{
    label: (0, _core.t)('Query'),
    expanded: true,
    tabOverride: 'data',
    controlSetRows: [[{
      name: 'start_time_column',
      config: _extends({}, _chartControls.sharedControls.series, {
        label: (0, _core.t)('Start time column'),
        description: (0, _core.t)('Required. Timestamp column used for the segment start.')
      })
    }, {
      name: 'end_time_column',
      config: _extends({}, _chartControls.sharedControls.series, {
        label: (0, _core.t)('End time column'),
        description: (0, _core.t)('Required. Timestamp column used for the segment end.')
      })
    }], [{
      name: 'reason_column',
      config: _extends({}, _chartControls.sharedControls.series, {
        label: (0, _core.t)('Reason/state column'),
        description: (0, _core.t)('Required. Categorical machine state or loss reason.')
      })
    }, {
      name: 'granularity_sqla',
      config: _extends({}, _chartControls.sharedControls.series, {
        label: (0, _core.t)('Dashboard time filter column'),
        clearable: true,
        description: (0, _core.t)('Optional temporal column used by Superset native time range filters. This usually matches the start time column.')
      })
    }], ['time_range'], ['adhoc_filters'], ['row_limit']]
  }, {
    label: (0, _core.t)('Tooltip Metrics'),
    expanded: true,
    tabOverride: 'data',
    controlSetRows: [[{
      name: 'productive_pct_column',
      config: _extends({}, _chartControls.sharedControls.series, {
        label: (0, _core.t)('Productive %'),
        clearable: true,
        default: null
      })
    }, {
      name: 'not_productive_pct_column',
      config: _extends({}, _chartControls.sharedControls.series, {
        label: (0, _core.t)('Not Productive %'),
        clearable: true,
        default: null
      })
    }], [{
      name: 'not_scheduled_pct_column',
      config: _extends({}, _chartControls.sharedControls.series, {
        label: (0, _core.t)('Not Scheduled %'),
        clearable: true,
        default: null
      })
    }, {
      name: 'in_count_column',
      config: _extends({}, _chartControls.sharedControls.series, {
        label: (0, _core.t)('In Count'),
        clearable: true,
        default: null
      })
    }], [{
      name: 'good_count_column',
      config: _extends({}, _chartControls.sharedControls.series, {
        label: (0, _core.t)('Good Count'),
        clearable: true,
        default: null
      })
    }, {
      name: 'reject_count_column',
      config: _extends({}, _chartControls.sharedControls.series, {
        label: (0, _core.t)('Reject Count'),
        clearable: true,
        default: null
      })
    }], [{
      name: 'efficiency_column',
      config: _extends({}, _chartControls.sharedControls.series, {
        label: (0, _core.t)('Efficiency'),
        clearable: true,
        default: null
      })
    }, {
      name: 'oee_column',
      config: _extends({}, _chartControls.sharedControls.series, {
        label: (0, _core.t)('OEE'),
        clearable: true,
        default: null
      })
    }], [{
      name: 'oee_loss_column',
      config: _extends({}, _chartControls.sharedControls.series, {
        label: (0, _core.t)('OEE Loss'),
        clearable: true,
        default: null
      })
    }, {
      name: 'down_duration_column',
      config: _extends({}, _chartControls.sharedControls.series, {
        label: (0, _core.t)('Down'),
        clearable: true,
        default: null
      })
    }], [{
      name: 'planned_stop_duration_column',
      config: _extends({}, _chartControls.sharedControls.series, {
        label: (0, _core.t)('Planned Stop'),
        clearable: true,
        default: null
      })
    }, {
      name: 'cycle_loss_duration_column',
      config: _extends({}, _chartControls.sharedControls.series, {
        label: (0, _core.t)('Cycle Loss'),
        clearable: true,
        default: null
      })
    }], [{
      name: 'small_stop_duration_column',
      config: _extends({}, _chartControls.sharedControls.series, {
        label: (0, _core.t)('Small Stop Loss'),
        clearable: true,
        default: null
      })
    }, {
      name: 'startup_rejects_column',
      config: _extends({}, _chartControls.sharedControls.series, {
        label: (0, _core.t)('Startup Rejects'),
        clearable: true,
        default: null
      })
    }], [{
      name: 'production_rejects_column',
      config: _extends({}, _chartControls.sharedControls.series, {
        label: (0, _core.t)('Production Rejects'),
        clearable: true,
        default: null
      })
    }]]
  }, {
    label: (0, _core.t)('Display'),
    expanded: true,
    tabOverride: 'customize',
    controlSetRows: [[{
      name: 'row_height',
      config: {
        type: 'TextControl',
        label: (0, _core.t)('Row height'),
        default: 44,
        isInt: true,
        renderTrigger: true
      }
    }, {
      name: 'segment_border_radius',
      config: {
        type: 'TextControl',
        label: (0, _core.t)('Segment border radius'),
        default: 4,
        isInt: true,
        renderTrigger: true
      }
    }], [{
      name: 'show_x_axis',
      config: {
        type: 'CheckboxControl',
        label: (0, _core.t)('Show x-axis'),
        default: true,
        renderTrigger: true
      }
    }, {
      name: 'tooltip_enabled',
      config: {
        type: 'CheckboxControl',
        label: (0, _core.t)('Tooltip enabled'),
        default: true,
        renderTrigger: true
      }
    }, {
      name: 'zoom_pan_enabled',
      config: {
        type: 'CheckboxControl',
        label: (0, _core.t)('Zoom / pan enabled'),
        default: true,
        renderTrigger: true
      }
    }], [{
      name: 'time_label_format',
      config: {
        type: 'TextControl',
        label: (0, _core.t)('Time label format'),
        default: '%m-%d %H:%M',
        renderTrigger: true,
        description: (0, _core.t)('Superset-compatible time format used on the x-axis.')
      }
    }, {
      name: 'tooltip_time_format',
      config: {
        type: 'TextControl',
        label: (0, _core.t)('Tooltip time format'),
        default: '%Y-%m-%d %H:%M:%S',
        renderTrigger: true
      }
    }], [{
      name: 'default_fallback_color',
      config: {
        type: 'TextControl',
        label: (0, _core.t)('Default fallback color'),
        default: '#9ca3af',
        renderTrigger: true
      }
    }, {
      name: 'min_visible_time_range_ms',
      config: {
        type: 'TextControl',
        label: (0, _core.t)('Minimum visible range (ms)'),
        default: '',
        renderTrigger: true,
        description: (0, _core.t)('Optional minimum zoom range in milliseconds to keep very dense timelines readable.')
      }
    }], [{
      name: 'state_color_mapping',
      config: {
        type: 'TextAreaControl',
        label: (0, _core.t)('Color mapping by state'),
        default: '{\n  "Running Normally": "#16a34a",\n  "Down / Fault": "#dc2626",\n  "Planned Stop": "#f59e0b",\n  "Idle / Waiting": "#6b7280",\n  "Production Reject": "#7f1d1d"\n}',
        renderTrigger: true,
        description: (0, _core.t)('Use JSON or one mapping per line, for example Running Normally = #16a34a.')
      }
    }]]
  }, _extends({}, _chartControls.sections.annotationsAndLayersControls, {
    tabOverride: 'data'
  }), _extends({}, _chartControls.sections.advancedAnalyticsControls, {
    tabOverride: 'data'
  })]
};
var _default = exports.default = controlPanel;