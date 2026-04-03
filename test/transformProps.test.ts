import { ChartProps } from '@superset-ui/core';
import { mockTimelineRows } from '../src/mockData';
import transformProps from '../src/plugin/transformProps';

describe('transformProps', () => {
  it('sorts rows, applies colors, and builds tooltip rows', () => {
    const enrichedRows = [
      { ...mockTimelineRows[2], detailed_reason: 'Planned sanitation window' },
      { ...mockTimelineRows[0], detailed_reason: 'Nominal production' },
      {
        ...mockTimelineRows[1],
        detailed_reason: '',
        down_duration: null,
        good_count: null,
        productive_pct: null,
      },
    ];
    const chartProps = new ChartProps({
      width: 900,
      height: 180,
      formData: {
        default_fallback_color: '#000000',
        detailed_reason_column: 'detailed_reason',
        end_time_column: 'event_end',
        good_count_column: 'good_count',
        productive_pct_column: 'productive_pct',
        reason_column: 'reason',
        start_time_column: 'event_start',
        state_color_mapping: { 'Running Normally': '#00ff00' },
      },
      hooks: {
        setDataMask: jest.fn(),
      },
      queriesData: [
        {
          data: enrichedRows,
        },
      ],
      theme: {},
    } as any);

    const props = transformProps(chartProps);

    expect(props.segments).toHaveLength(3);
    expect(props.segments[0].reason).toBe('Running Normally');
    expect(props.segments[0].color).toBe('#00ff00');
    expect(props.showLegend).toBe(true);
    expect(props.legendItems.find(item => item.name === 'Running Normally')?.color).toBe(
      '#00ff00',
    );
    expect(props.segments[0].tooltipTitle).toBe('Nominal production');
    expect(props.segments[1].tooltipTitle).toBeUndefined();
    expect(props.segments[0].tooltipRows.map(row => row.label)).toEqual([
      'Start Time',
      'End Time',
      'Duration',
      'Productive %',
      'Good Count',
    ]);
    expect(props.segments[1].tooltipRows.map(row => row.label)).toEqual([
      'Start Time',
      'End Time',
      'Duration',
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
