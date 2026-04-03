# Superset Equipment State Timeline

`@pparth2302/superset-plugin-chart-equipment-state-timeline` is a custom Apache Superset v6 chart plugin that renders a single-band equipment-state timeline similar to the lower Vorne XL event strip.

## Features

- Single horizontal event timeline rendered with Apache ECharts custom series
- Time-based x-axis with data zoom support
- Color-coded contiguous state segments
- Structured production and OEE tooltip
- Optional click-to-filter integration via Superset data mask hooks
- Configurable row height, corner radius, fallback color, and time formatting
- Structured reason-to-color mapping editor in the Data tab
- Optional scrollable legend for visible state colors

## Install

1. Install dependencies:

```bash
npm install
```

2. Build the plugin:

```bash
npm run build
```

3. Link or publish the package into your Superset frontend workspace, then register it in your Superset preset map:

```ts
import { SupersetPluginChartEquipmentStateTimeline } from '@pparth2302/superset-plugin-chart-equipment-state-timeline';

new SupersetPluginChartEquipmentStateTimeline().configure({
  key: 'equipment-state-timeline',
});
```

4. Rebuild Superset frontend assets.

## Explore Configuration

- Set `Start time column`, `End time column`, and `Reason/state column`.
- Set `Dashboard time filter column` to the temporal field Superset should use for native dashboard time filters. In most cases this should match `Start time column`.
- Add any optional tooltip metric columns you want surfaced in the hover card, including `Detailed Reason column` if you want a richer tooltip description.
- Configure state colors with the structured `Reason/state colors` editor in the Data tab and use `Fallback color` for anything unmapped.
- Optional tooltip rows are shown only when a source column is mapped and the event row contains a value.

## Mock Data

Sample rows for local testing are exported from [src/mockData.ts](/c:/Users/ppatel2/Desktop/projects/superset-plugins/superset-plugin-chart-equipment-state-timeline/src/mockData.ts) and mirrored in [examples/mock-query-response.json](/c:/Users/ppatel2/Desktop/projects/superset-plugins/superset-plugin-chart-equipment-state-timeline/examples/mock-query-response.json).

## Notes

- The plugin intentionally renders only the lower machine-state timeline band, not a shift summary panel.
- The plugin intentionally relies on Superset's native/dashboard time filter state rather than a duplicate plugin-specific time-range control.
- Click-to-filter is implemented conservatively using the reason/state value. There are `TODO` comments where project-specific filtering logic can be expanded to include event-level identifiers or time-window filters.
