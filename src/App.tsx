import type { JSX } from 'solid-js';
import { Show, createEffect, createSignal, onCleanup } from 'solid-js';
import { createStore, produce } from 'solid-js/store';
import * as htmlToImage from 'html-to-image';
import GradientPicker, { getGradient } from './components/GradientPicker';
import FontPicker, { getFontStyle } from './components/FontPicker';
import classNames from './utils/classnames';
import TextAlignmentPicker, {
  getTextAlignmentContentStyle,
  getTextAlignmentLayoutStyle,
} from './components/TextAligmentPicker';
import LogoAlignmentPicker, { getLogoAlignmentStyle } from './components/LogoAligmentPicker';
import BlendModePicker from './components/BlendModePicker';
import download from './utils/download';
import ColorPicker from './components/ColorPicker';
import { GithubIcon } from './components/icons';
import FontWeightPicker, { getFontWeightStyle } from './components/FontWeightPicker';
import { NumberField, TextField } from './components/Field';
import { DEFAULT_STATE, type PosterState, loadState, saveState } from './state';

const SAVE_DELAY = 300;
const COPIED_DURATION = 2000;

const SECONDARY_BUTTON_CLASS =
  'flex-1 rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-inset ring-gray-300 hover:bg-gray-50';

export default function App(): JSX.Element {
  let image: HTMLDivElement | undefined;
  const [state, setState] = createStore<PosterState>(loadState());
  const [exportError, setExportError] = createSignal('');
  const [copied, setCopied] = createSignal(false);

  // Returns a change handler that writes one field of the state.
  const update =
    <K extends keyof PosterState>(key: K) =>
    (value: PosterState[K]): void => {
      setState(
        produce((draft) => {
          draft[key] = value;
        }),
      );
    };

  // Saves to the URL and local storage after edits settle.
  createEffect(() => {
    const snapshot = { ...state };
    const timeout = setTimeout(() => {
      saveState(snapshot);
    }, SAVE_DELAY);
    onCleanup(() => {
      clearTimeout(timeout);
    });
  });

  const getBackground = (): string => {
    const gradient = getGradient(state.gradientIndex);
    if (state.background) {
      return `${gradient}, url(${JSON.stringify(state.background)})`;
    }
    return gradient;
  };

  const copyLink = (): void => {
    saveState({ ...state });
    navigator.clipboard.writeText(window.location.href).then(
      () => {
        setCopied(true);
        setTimeout(() => {
          setCopied(false);
        }, COPIED_DURATION);
      },
      () => {
        setExportError('Failed to copy the link.');
      },
    );
  };

  const exportImage = (): void => {
    const node = image;
    if (!node) {
      return;
    }
    setExportError('');
    // The preview is scaled down with the `scale` property, so reset
    // it to export the poster at its real size.
    htmlToImage
      .toPng(node, {
        style: {
          scale: '1',
        },
      })
      .then(
        (url) => {
          download(url, 'my-poster.png');
        },
        () => {
          setExportError(
            'Failed to export the poster. Remote images must allow cross-origin access.',
          );
        },
      );
  };

  return (
    <div class="flex flex-col-reverse lg:flex-row w-screen h-screen overflow-hidden">
      <div class="w-full lg:w-1/3 flex flex-col gap-4 p-8 overflow-y-auto">
        <div class="flex flex-row gap-1 items-center justify-center">
          <h1 class="text-4xl">ThumbGen</h1>
          <a href="https://github.com/lxsmnsyc/thumbgen" aria-label="Source on GitHub">
            <GithubIcon class="w-8 h-8 text-black" />
          </a>
        </div>
        <div class="flex flex-col gap-2">
          <h2 class="text-xl">Details</h2>
          <TextField label="Title" value={state.title} onChange={update('title')} />
          <TextField
            label="Description"
            value={state.description}
            onChange={update('description')}
          />
          <TextField
            label="Logo"
            placeholder="https://"
            value={state.logo}
            onChange={update('logo')}
          />
          <TextField
            label="Background Image"
            placeholder="https://"
            value={state.background}
            onChange={update('background')}
          />
        </div>
        <div class="flex flex-col gap-3">
          <h2 class="text-xl">Appearance</h2>
          <div class="flex flex-col gap-2">
            <h3 class="text-lg">Sizes</h3>
            <div class="flex flex-row gap-2">
              <NumberField
                label="Width"
                min={1}
                max={8192}
                step={1}
                value={state.width}
                onChange={update('width')}
              />
              <NumberField
                label="Height"
                min={1}
                max={8192}
                step={1}
                value={state.height}
                onChange={update('height')}
              />
            </div>
            <NumberField
              inline
              label="Title"
              min={0}
              max={100}
              value={state.titleSize}
              onChange={update('titleSize')}
            />
            <NumberField
              inline
              label="Description"
              min={0}
              max={100}
              value={state.descriptionSize}
              onChange={update('descriptionSize')}
            />
            <NumberField
              inline
              label="Logo"
              min={0}
              max={100}
              value={state.logoSize}
              onChange={update('logoSize')}
            />
          </div>
          <div class="flex flex-col gap-2">
            <h3 class="text-lg">Fonts</h3>
            <FontPicker label="Title" value={state.titleFont} onChange={update('titleFont')} />
            <FontPicker
              label="Description"
              value={state.descriptionFont}
              onChange={update('descriptionFont')}
            />
          </div>
          <div class="flex flex-col gap-2">
            <h3 class="text-lg">Alignment</h3>
            <TextAlignmentPicker value={state.textAlignment} onChange={update('textAlignment')} />
            <LogoAlignmentPicker value={state.logoAlignment} onChange={update('logoAlignment')} />
          </div>
          <div class="flex flex-col gap-2">
            <h3 class="text-lg">Font Weight</h3>
            <FontWeightPicker
              label="Title"
              value={state.titleWeight}
              onChange={update('titleWeight')}
            />
            <FontWeightPicker
              label="Description"
              value={state.descriptionWeight}
              onChange={update('descriptionWeight')}
            />
          </div>
        </div>
        <div class="flex flex-col gap-2">
          <h2 class="text-xl">Colors</h2>
          <ColorPicker label="Text" value={state.color} onChange={update('color')} />
          <BlendModePicker
            label="Blend Mode"
            value={state.blendMode}
            onChange={update('blendMode')}
          />
          <GradientPicker
            label="Background"
            value={state.gradientIndex}
            onChange={update('gradientIndex')}
          />
        </div>
        <button
          type="button"
          class="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          onClick={exportImage}
        >
          Download
        </button>
        <div class="flex flex-row gap-2">
          <button type="button" class={SECONDARY_BUTTON_CLASS} onClick={copyLink}>
            {copied() ? 'Copied!' : 'Copy link'}
          </button>
          <button
            type="button"
            class={SECONDARY_BUTTON_CLASS}
            onClick={() => {
              setState({ ...DEFAULT_STATE });
            }}
          >
            Reset
          </button>
        </div>
        <Show when={exportError()}>
          <p class="text-sm text-red-600" role="alert">
            {exportError()}
          </p>
        </Show>
      </div>
      <div class="relative w-full h-[25vh] lg:w-2/3 lg:h-screen flex items-center justify-center">
        <div
          ref={(el) => {
            image = el;
          }}
          class={classNames(
            'relative p-8 scale-[0.25] lg:scale-50',
            state.background && 'bg-cover bg-center',
          )}
          style={{
            width: `${state.width}px`,
            height: `${state.height}px`,
            'background-image': getBackground(),
            'background-blend-mode': state.blendMode,
            'aspect-ratio': `${state.width} / ${state.height}`,
          }}
        >
          <div
            class={classNames(
              'flex flex-col gap-2 justify-center w-full h-full',
              getTextAlignmentLayoutStyle(state.textAlignment),
            )}
            style={{
              color: state.color,
            }}
          >
            <h1
              class={classNames(
                getFontStyle(state.titleFont),
                getTextAlignmentContentStyle(state.textAlignment),
                getFontWeightStyle(state.titleWeight),
              )}
              style={{
                'font-size': `${state.titleSize}rem`,
              }}
            >
              {state.title}
            </h1>
            <div
              class={classNames(
                getFontStyle(state.descriptionFont),
                getTextAlignmentContentStyle(state.textAlignment),
                getFontWeightStyle(state.descriptionWeight),
              )}
              style={{
                'font-size': `${state.descriptionSize}rem`,
              }}
            >
              {state.description}
            </div>
          </div>
          <Show when={state.logo}>
            <img
              class={classNames('absolute m-8', getLogoAlignmentStyle(state.logoAlignment))}
              src={state.logo}
              style={{
                'aspect-ratio': '1 / 1',
                width: `${state.logoSize}rem`,
                height: `${state.logoSize}rem`,
              }}
            />
          </Show>
        </div>
      </div>
    </div>
  );
}
