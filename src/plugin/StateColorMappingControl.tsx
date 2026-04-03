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

import React, { useEffect, useState } from 'react';
import type { ControlComponentProps } from '@superset-ui/chart-controls';
import { t } from '@superset-ui/core';
import { DEFAULT_REASON_COLORS, getColumnLabel, parseStateColorMapping } from '../utils';

type StateColorMappingValue = Record<string, string> | string | null;
type StateColorMappingInput = StateColorMappingValue | undefined;

interface MappingEntry {
  state: string;
  color: string;
}

function mappingToEntries(value: StateColorMappingInput): MappingEntry[] {
  return Object.entries(parseStateColorMapping(value)).map(([state, color]) => ({
    state,
    color,
  }));
}

function entriesToMapping(entries: MappingEntry[]): Record<string, string> {
  return entries.reduce<Record<string, string>>((accumulator, entry) => {
    const state = entry.state.trim();
    const color = entry.color.trim();
    if (state && color) {
      accumulator[state] = color;
    }

    return accumulator;
  }, {});
}

export default function StateColorMappingControl({
  formData,
  onChange,
  value,
}: ControlComponentProps<StateColorMappingValue>) {
  const [entries, setEntries] = useState<MappingEntry[]>(() => mappingToEntries(value));
  const [draftState, setDraftState] = useState('');
  const [draftColor, setDraftColor] = useState('#9ca3af');
  const reasonColumnLabel = getColumnLabel(formData?.reason_column) ?? 'Reason/State';

  useEffect(() => {
    setEntries(mappingToEntries(value));
  }, [value]);

  const commitEntries = (nextEntries: MappingEntry[]) => {
    setEntries(nextEntries);
    onChange?.(entriesToMapping(nextEntries));
  };

  const updateEntry = (
    index: number,
    field: keyof MappingEntry,
    fieldValue: string,
  ) => {
    const nextEntries = entries.map((entry, entryIndex) =>
      entryIndex === index ? { ...entry, [field]: fieldValue } : entry,
    );
    commitEntries(nextEntries);
  };

  const removeEntry = (index: number) => {
    commitEntries(entries.filter((_, entryIndex) => entryIndex !== index));
  };

  const addEntry = () => {
    const trimmedState = draftState.trim();
    if (!trimmedState) {
      return;
    }

    const nextEntries = [
      ...entries.filter(entry => entry.state.trim() !== trimmedState),
      { state: trimmedState, color: draftColor },
    ];
    commitEntries(nextEntries);
    setDraftState('');
    setDraftColor('#9ca3af');
  };

  const seedDefaultStates = () => {
    commitEntries([
      ...entries.filter(entry => !Object.prototype.hasOwnProperty.call(DEFAULT_REASON_COLORS, entry.state)),
      ...Object.entries(DEFAULT_REASON_COLORS).map(([state, color]) => ({
        state,
        color,
      })),
    ]);
  };

  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <div style={{ color: '#6b7280', fontSize: 12, lineHeight: 1.4 }}>
        {`${t('Map each')} ${reasonColumnLabel} ${t(
          'value to a color. Add rows manually or seed the default manufacturing states below.',
        )}`}
        <div style={{ marginTop: 4 }}>
          {t(
            'TODO: Prefill distinct reason values automatically when Superset exposes lightweight column-value metadata in Explore.',
          )}
        </div>
      </div>

      <div style={{ display: 'grid', gap: 8 }}>
        {entries.length ? (
          entries.map((entry, index) => (
            <div
              key={`${entry.state}-${index}`}
              style={{
                alignItems: 'center',
                display: 'grid',
                gap: 8,
                gridTemplateColumns: 'minmax(0, 1fr) 56px 96px auto',
              }}
            >
              <input
                type="text"
                value={entry.state}
                onChange={event => updateEntry(index, 'state', event.target.value)}
                placeholder={t('State value')}
                style={{
                  border: '1px solid #d1d5db',
                  borderRadius: 4,
                  padding: '6px 8px',
                  width: '100%',
                }}
              />
              <input
                type="color"
                value={entry.color}
                onChange={event => updateEntry(index, 'color', event.target.value)}
                style={{ background: 'transparent', border: 'none', height: 32, padding: 0, width: 56 }}
              />
              <input
                type="text"
                value={entry.color}
                onChange={event => updateEntry(index, 'color', event.target.value)}
                placeholder="#9ca3af"
                style={{
                  border: '1px solid #d1d5db',
                  borderRadius: 4,
                  padding: '6px 8px',
                  width: '100%',
                }}
              />
              <button
                type="button"
                onClick={() => removeEntry(index)}
                style={{
                  background: '#ffffff',
                  border: '1px solid #d1d5db',
                  borderRadius: 4,
                  cursor: 'pointer',
                  padding: '6px 10px',
                }}
              >
                {t('Remove')}
              </button>
            </div>
          ))
        ) : (
          <div style={{ color: '#6b7280', fontSize: 12 }}>
            {t('No state mappings defined yet.')}
          </div>
        )}
      </div>

      <div
        style={{
          alignItems: 'end',
          display: 'grid',
          gap: 8,
          gridTemplateColumns: 'minmax(0, 1fr) 56px 96px auto auto',
        }}
      >
        <input
          type="text"
          value={draftState}
          onChange={event => setDraftState(event.target.value)}
          placeholder={t('Add state value')}
          style={{
            border: '1px solid #d1d5db',
            borderRadius: 4,
            padding: '6px 8px',
            width: '100%',
          }}
        />
        <input
          type="color"
          value={draftColor}
          onChange={event => setDraftColor(event.target.value)}
          style={{ background: 'transparent', border: 'none', height: 32, padding: 0, width: 56 }}
        />
        <input
          type="text"
          value={draftColor}
          onChange={event => setDraftColor(event.target.value)}
          placeholder="#9ca3af"
          style={{
            border: '1px solid #d1d5db',
            borderRadius: 4,
            padding: '6px 8px',
            width: '100%',
          }}
        />
        <button
          type="button"
          onClick={addEntry}
          style={{
            background: '#ffffff',
            border: '1px solid #d1d5db',
            borderRadius: 4,
            cursor: 'pointer',
            padding: '6px 10px',
          }}
        >
          {t('Add state')}
        </button>
        <button
          type="button"
          onClick={seedDefaultStates}
          style={{
            background: '#ffffff',
            border: '1px solid #d1d5db',
            borderRadius: 4,
            cursor: 'pointer',
            padding: '6px 10px',
          }}
        >
          {t('Seed defaults')}
        </button>
      </div>
    </div>
  );
}
