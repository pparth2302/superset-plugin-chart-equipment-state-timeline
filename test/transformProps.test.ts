import { ChartProps } from '@superset-ui/core';
import { mockTimelineRows } from '../src/mockData';
import transformProps from '../src/plugin/transformProps';

describe('transformProps', () => {
  it('sorts rows, applies colors, and builds tooltip rows', () => {
    const chartProps = new ChartProps({
      width: 900,
      height: 180,
      formData: {
        default_fallback_color: '#000000',
        end_time_column: 'event_end',
        good_count_column: 'good_count',
        productive_pct_column: 'productive_pct',
        reason_column: 'reason',
        start_time_column: 'event_start',
        state_color_mapping: '{"Running Normally":"#00ff00"}',
      },
      hooks: {
        setDataMask: jest.fn(),
      },
      queriesData: [
        {
          data: [mockTimelineRows[2], mockTimelineRows[0], mockTimelineRows[1]],
        },
      ],
      theme: {},
    } as any);

    const props = transformProps(chartProps);

    expect(props.segments).toHaveLength(3);
    expect(props.segments[0].reason).toBe('Running Normally');
    expect(props.segments[0].color).toBe('#00ff00');
    expect(props.segments[0].tooltipRows.map(row => row.label)).toEqual([
      'Reason',
      'Start Time',
      'End Time',
      'Duration',
      'Productive %',
      'Not Productive %',
      'Not Scheduled %',
      'In Count',
      'Good Count',
      'Reject Count',
      'Efficiency',
      'OEE',
      'OEE Loss',
      'Down',
      'Planned Stop',
      'Cycle Loss',
      'Small Stop Loss',
      'Startup Rejects',
      'Production Rejects',
    ]);
    expect(props.xDomain[0]).toBeLessThan(props.xDomain[1]);
  });

  it('throws when required fields are missing', () => {
    const chartProps = new ChartProps({
      width: 900,
      height: 180,
      formData: {},
      queriesData: [{ data: mockTimelineRows }],
      theme: {},
    });

    expect(() => transformProps(chartProps)).toThrow(
      'Equipment State Timeline requires start time, end time, and reason/state columns.',
    );
  });
});
