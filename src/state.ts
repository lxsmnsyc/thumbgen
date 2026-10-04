import { BLEND_MODES, type BlendMode } from './components/BlendModePicker';
import { FONTS, type Font } from './components/FontPicker';
import { FONT_WEIGHTS, type FontWeight } from './components/FontWeightPicker';
import { GRADIENT_COUNT } from './components/GradientPicker';
import { LOGO_ALIGNMENTS, type LogoAlignment } from './components/LogoAligmentPicker';
import { TEXT_ALIGNMENTS, type TextAlignment } from './components/TextAligmentPicker';

export interface PosterState {
  title: string;
  description: string;
  logo: string;
  background: string;
  width: number;
  height: number;
  gradientIndex: number;
  titleSize: number;
  descriptionSize: number;
  logoSize: number;
  titleFont: Font;
  descriptionFont: Font;
  textAlignment: TextAlignment;
  logoAlignment: LogoAlignment;
  color: string;
  blendMode: BlendMode;
  titleWeight: FontWeight;
  descriptionWeight: FontWeight;
}

export const DEFAULT_STATE: Readonly<PosterState> = {
  title: 'My title',
  description: 'My description',
  logo: '',
  background: '',
  width: 1280,
  height: 640,
  gradientIndex: 0,
  titleSize: 6,
  descriptionSize: 4,
  logoSize: 8,
  titleFont: 'Mono',
  descriptionFont: 'Mono',
  textAlignment: 'left',
  logoAlignment: 'TL',
  color: '#000',
  blendMode: 'hue',
  titleWeight: 'Bold',
  descriptionWeight: 'Normal',
};

const STORAGE_KEY = 'thumbgen:state';

// Each parser accepts a stored value or a URL string.
// It returns undefined when the value is invalid.
type Parser<T> = (raw: unknown) => T | undefined;

function text(raw: unknown): string | undefined {
  return typeof raw === 'string' ? raw : undefined;
}

function number(min: number, max: number, integer = false): Parser<number> {
  return (raw) => {
    if (typeof raw !== 'string' && typeof raw !== 'number') {
      return undefined;
    }
    const value = Number(raw);
    if (!Number.isFinite(value) || value < min || value > max) {
      return undefined;
    }
    if (integer && !Number.isInteger(value)) {
      return undefined;
    }
    return value;
  };
}

function oneOf<T extends string>(options: readonly T[]): Parser<T> {
  return (raw) => options.find((option) => option === raw);
}

function color(raw: unknown): string | undefined {
  return typeof raw === 'string' && /^#(?:[\da-f]{3,4}|[\da-f]{6}|[\da-f]{8})$/i.test(raw)
    ? raw
    : undefined;
}

const PARSERS: { [K in keyof PosterState]: Parser<PosterState[K]> } = {
  title: text,
  description: text,
  logo: text,
  background: text,
  width: number(1, 8192, true),
  height: number(1, 8192, true),
  gradientIndex: number(0, GRADIENT_COUNT - 1, true),
  titleSize: number(0, 100),
  descriptionSize: number(0, 100),
  logoSize: number(0, 100),
  titleFont: oneOf(FONTS),
  descriptionFont: oneOf(FONTS),
  textAlignment: oneOf(TEXT_ALIGNMENTS),
  logoAlignment: oneOf(LOGO_ALIGNMENTS),
  color,
  blendMode: oneOf(BLEND_MODES),
  titleWeight: oneOf(FONT_WEIGHTS),
  descriptionWeight: oneOf(FONT_WEIGHTS),
};

const KEYS: readonly (keyof PosterState)[] = [
  'title',
  'description',
  'logo',
  'background',
  'width',
  'height',
  'gradientIndex',
  'titleSize',
  'descriptionSize',
  'logoSize',
  'titleFont',
  'descriptionFont',
  'textAlignment',
  'logoAlignment',
  'color',
  'blendMode',
  'titleWeight',
  'descriptionWeight',
];

function setField<K extends keyof PosterState>(
  state: PosterState,
  key: K,
  value: PosterState[K] | undefined,
): void {
  if (value !== undefined) {
    state[key] = value;
  }
}

// Builds a full state from untrusted input. Invalid fields keep their defaults.
function parseState(read: (key: keyof PosterState) => unknown): PosterState {
  const state = { ...DEFAULT_STATE };
  for (const key of KEYS) {
    setField(state, key, PARSERS[key](read(key)));
  }
  return state;
}

// Encodes the fields that differ from the defaults as URL parameters.
export function stateToHash(state: PosterState): string {
  const params = new URLSearchParams();
  for (const key of KEYS) {
    if (state[key] !== DEFAULT_STATE[key]) {
      params.set(key, String(state[key]));
    }
  }
  return params.toString();
}

function readHash(): PosterState | undefined {
  const hash = window.location.hash.slice(1);
  if (!hash) {
    return undefined;
  }
  const params = new URLSearchParams(hash);
  return parseState((key) => params.get(key) ?? undefined);
}

function readStorage(): PosterState | undefined {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return undefined;
    }
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== 'object' || parsed === null) {
      return undefined;
    }
    const record = new Map<string, unknown>(Object.entries(parsed));
    return parseState((key) => record.get(key));
  } catch {
    return undefined;
  }
}

// A shared link wins over the saved state, so opening a link shows that poster.
export function loadState(): PosterState {
  return readHash() ?? readStorage() ?? { ...DEFAULT_STATE };
}

export function saveState(state: PosterState): void {
  const hash = stateToHash(state);
  const url = `${window.location.pathname}${window.location.search}${hash ? `#${hash}` : ''}`;
  window.history.replaceState(null, '', url);
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Storage can be full or blocked. The URL still holds the state.
  }
}
