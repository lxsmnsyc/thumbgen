import type { JSX } from 'solid-js';
import SelectPicker from './SelectPicker';

export type FontWeight =
  | 'Thin'
  | 'Extra Light'
  | 'Light'
  | 'Normal'
  | 'Medium'
  | 'Semi Bold'
  | 'Bold'
  | 'Extra Bold'
  | 'Black';

const OPTIONS: readonly FontWeight[] = [
  'Thin',
  'Extra Light',
  'Light',
  'Normal',
  'Medium',
  'Semi Bold',
  'Bold',
  'Extra Bold',
  'Black',
];

export interface FontWeightPickerProps {
  label: string;
  value: FontWeight;
  onChange: (value: FontWeight) => void;
}

const FONT_WEIGHT_STYLES: Record<FontWeight, string> = {
  Black: 'font-black',
  Bold: 'font-bold',
  'Extra Bold': 'font-extrabold',
  'Extra Light': 'font-extralight',
  Light: 'font-light',
  Medium: 'font-medium',
  Normal: 'font-normal',
  'Semi Bold': 'font-semibold',
  Thin: 'font-thin',
};

export function getFontWeightStyle(font: FontWeight): string {
  return FONT_WEIGHT_STYLES[font];
}

export default function FontWeightPicker(props: FontWeightPickerProps): JSX.Element {
  return (
    <SelectPicker
      label={props.label}
      options={OPTIONS}
      value={props.value}
      onChange={(value) => {
        props.onChange(value);
      }}
    />
  );
}
