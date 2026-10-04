import type { JSX } from 'solid-js';
import SelectPicker from './SelectPicker';

export type Font =
  | 'Sans'
  | 'Serif'
  | 'Mono'
  | 'Inter'
  | 'Space Grotesk'
  | 'Playfair Display'
  | 'Roboto Slab'
  | 'JetBrains Mono'
  | 'Bebas Neue'
  | 'Lobster';

interface FontData {
  family: string;
  // Google Fonts axis spec for fonts loaded from the web.
  // System fonts have none.
  google?: string;
}

const FONT_DATA: Record<Font, FontData> = {
  Sans: { family: 'ui-sans-serif, system-ui, sans-serif' },
  Serif: { family: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif' },
  Mono: { family: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace' },
  Inter: { family: '"Inter", sans-serif', google: 'Inter:wght@100..900' },
  'Space Grotesk': {
    family: '"Space Grotesk", sans-serif',
    google: 'Space+Grotesk:wght@300..700',
  },
  'Playfair Display': {
    family: '"Playfair Display", serif',
    google: 'Playfair+Display:wght@400..900',
  },
  'Roboto Slab': { family: '"Roboto Slab", serif', google: 'Roboto+Slab:wght@100..900' },
  'JetBrains Mono': {
    family: '"JetBrains Mono", monospace',
    google: 'JetBrains+Mono:wght@100..800',
  },
  'Bebas Neue': { family: '"Bebas Neue", sans-serif', google: 'Bebas+Neue' },
  Lobster: { family: '"Lobster", cursive', google: 'Lobster' },
};

export const FONTS: readonly Font[] = [
  'Sans',
  'Serif',
  'Mono',
  'Inter',
  'Space Grotesk',
  'Playfair Display',
  'Roboto Slab',
  'JetBrains Mono',
  'Bebas Neue',
  'Lobster',
];

export function getFontFamily(font: Font): string {
  return FONT_DATA[font].family;
}

const loaded = new Set<Font>();

// Adds the Google Fonts stylesheet for a web font once.
export function loadFont(font: Font): void {
  const { google } = FONT_DATA[font];
  if (!google || loaded.has(font)) {
    return;
  }
  loaded.add(font);
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  // Lets html-to-image read the stylesheet to embed the font on export.
  link.crossOrigin = 'anonymous';
  link.href = `https://fonts.googleapis.com/css2?family=${google}&display=swap`;
  document.head.append(link);
}

export interface FontPickerProps {
  label: string;
  value: Font;
  onChange: (value: Font) => void;
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
