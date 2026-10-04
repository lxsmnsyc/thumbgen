import type { JSX } from 'solid-js';
import SelectPicker from './SelectPicker';

export type Font = 'Mono' | 'Serif' | 'Sans';

export const FONTS: readonly Font[] = ['Mono', 'Serif', 'Sans'];

export interface FontPickerProps {
  label: string;
  value: Font;
  onChange: (value: Font) => void;
}

const FONT_STYLES: Record<Font, string> = {
  Mono: 'font-mono',
  Sans: 'font-sans',
  Serif: 'font-serif',
};

export function getFontStyle(font: Font): string {
  return FONT_STYLES[font];
}

export default function FontPicker(props: FontPickerProps): JSX.Element {
  return (
    <SelectPicker
      label={props.label}
      options={FONTS}
      value={props.value}
      onChange={(value) => {
        props.onChange(value);
      }}
    />
  );
}
