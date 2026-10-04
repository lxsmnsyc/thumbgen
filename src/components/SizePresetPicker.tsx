import type { JSX } from 'solid-js';
import SelectPicker from './SelectPicker';

interface SizePreset {
  name: string;
  width: number;
  height: number;
}

const PRESETS: readonly SizePreset[] = [
  { name: 'GitHub social preview', width: 1280, height: 640 },
  { name: 'Open Graph', width: 1200, height: 630 },
  { name: 'Twitter / X', width: 1600, height: 900 },
  { name: 'YouTube thumbnail', width: 1280, height: 720 },
  { name: 'Square', width: 1080, height: 1080 },
  { name: 'Story', width: 1080, height: 1920 },
];

const CUSTOM = 'Custom';

const OPTIONS: readonly string[] = [...PRESETS.map((preset) => preset.name), CUSTOM];

export interface SizePresetPickerProps {
  width: number;
  height: number;
  onChange: (width: number, height: number) => void;
}

export default function SizePresetPicker(props: SizePresetPickerProps): JSX.Element {
  // The selected preset is the one that matches the current size.
  const current = (): string =>
    PRESETS.find((preset) => preset.width === props.width && preset.height === props.height)
      ?.name ?? CUSTOM;

  return (
    <SelectPicker
      label="Preset"
      options={OPTIONS}
      value={current()}
      renderOption={(name) => {
        const preset = PRESETS.find((item) => item.name === name);
        return preset ? `${name} (${preset.width} × ${preset.height})` : name;
      }}
      onChange={(name) => {
        const preset = PRESETS.find((item) => item.name === name);
        if (preset) {
          props.onChange(preset.width, preset.height);
        }
      }}
    />
  );
}
