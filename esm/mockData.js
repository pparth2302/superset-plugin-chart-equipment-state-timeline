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

export var mockTimelineRows = [{
  cycle_loss_duration: 90,
  down_duration: 0,
  efficiency: 0.93,
  event_end: '2026-04-02T08:45:00',
  event_start: '2026-04-02T08:00:00',
  good_count: 420,
  in_count: 425,
  not_productive_pct: 0.04,
  not_scheduled_pct: 0,
  oee: 0.88,
  oee_loss: 0.12,
  planned_stop_duration: 0,
  production_rejects: 3,
  productive_pct: 0.96,
  reason: 'Running Normally',
  reject_count: 5,
  small_stop_duration: 45,
  startup_rejects: 0
}, {
  cycle_loss_duration: 0,
  down_duration: 1200,
  efficiency: 0.21,
  event_end: '2026-04-02T09:05:00',
  event_start: '2026-04-02T08:45:00',
  good_count: 420,
  in_count: 425,
  not_productive_pct: 0.79,
  not_scheduled_pct: 0,
  oee: 0.41,
  oee_loss: 0.59,
  planned_stop_duration: 0,
  production_rejects: 3,
  productive_pct: 0.21,
  reason: 'Down / Fault',
  reject_count: 5,
  small_stop_duration: 0,
  startup_rejects: 0
}, {
  cycle_loss_duration: 0,
  down_duration: 0,
  efficiency: 0.15,
  event_end: '2026-04-02T09:20:00',
  event_start: '2026-04-02T09:05:00',
  good_count: 420,
  in_count: 425,
  not_productive_pct: 0.12,
  not_scheduled_pct: 0.73,
  oee: 0.35,
  oee_loss: 0.65,
  planned_stop_duration: 900,
  production_rejects: 3,
  productive_pct: 0.15,
  reason: 'Planned Stop',
  reject_count: 5,
  small_stop_duration: 0,
  startup_rejects: 0
}, {
  cycle_loss_duration: 0,
  down_duration: 0,
  efficiency: 0.48,
  event_end: '2026-04-02T09:35:00',
  event_start: '2026-04-02T09:20:00',
  good_count: 420,
  in_count: 430,
  not_productive_pct: 0.52,
  not_scheduled_pct: 0,
  oee: 0.46,
  oee_loss: 0.54,
  planned_stop_duration: 0,
  production_rejects: 8,
  productive_pct: 0.48,
  reason: 'Idle / Waiting',
  reject_count: 10,
  small_stop_duration: 180,
  startup_rejects: 1
}, {
  cycle_loss_duration: 300,
  down_duration: 0,
  efficiency: 0.67,
  event_end: '2026-04-02T10:00:00',
  event_start: '2026-04-02T09:35:00',
  good_count: 610,
  in_count: 640,
  not_productive_pct: 0.2,
  not_scheduled_pct: 0,
  oee: 0.69,
  oee_loss: 0.31,
  planned_stop_duration: 0,
  production_rejects: 18,
  productive_pct: 0.8,
  reason: 'Production Reject',
  reject_count: 30,
  small_stop_duration: 60,
  startup_rejects: 2
}];
export var mockQueryResponse = {
  data: mockTimelineRows
};