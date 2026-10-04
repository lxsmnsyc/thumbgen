import type { JSX } from 'solid-js';
import SelectPicker from './SelectPicker';

export type BlendMode =
  | 'normal'
  | 'multiply'
  | 'screen'
  | 'overlay'
  | 'darken'
  | 'lighten'
  | 'color-dodge'
  | 'color-burn'
  | 'hard-light'
  | 'soft-light'
  | 'difference'
  | 'exclusion'
  | 'hue'
  | 'saturation'
  | 'color'
  | 'luminosity';

export const BLEND_MODES: readonly BlendMode[] = [
  'normal',
  'multiply',
  'screen',
  'overlay',
  'darken',
  'lighten',
  'color-dodge',
  'color-burn',
  'hard-light',
  'soft-light',
  'difference',
  'exclusion',
  'hue',
  'saturation',
  'color',
  'luminosity',
];

export interface BlendModePickerProps {
  label: string;
  value: BlendMode;
  onChange: (value: BlendMode) => void;
}

export default function BlendModePicker(props: BlendModePickerProps): JSX.Element {
  return (
    <SelectPicker
      label={props.label}
      options={BLEND_MODES}
      value={props.value}
      onChange={(value) => {
        props.onChange(value);
      }}
    />
  );
}
