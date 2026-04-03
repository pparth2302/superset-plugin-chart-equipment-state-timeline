import buildQuery from '../src/plugin/buildQuery';

describe('buildQuery', () => {
  it('includes required and optional tooltip columns', () => {
    const context = buildQuery({
      end_time_column: 'event_end',
      good_count_column: 'good_count',
      productive_pct_column: 'productive_pct',
      reason_column: 'reason',
      row_limit: 5000,
      start_time_column: 'event_start',
    } as any);

    expect(context.queries).toHaveLength(1);
    expect(context.queries[0].columns).toEqual([
      'event_start',
      'event_end',
      'reason',
      'productive_pct',
      'good_count',
    ]);
    expect(context.queries[0].orderby).toEqual([
      ['event_start', true],
      ['event_end', true],
    ]);
    expect(context.queries[0].row_limit).toBe(5000);
  });
});
