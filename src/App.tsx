import type { JSX } from 'solid-js';
import { Show, createEffect, createMemo, createSignal, onCleanup } from 'solid-js';
import { createStore, produce } from 'solid-js/store';
import GradientPicker, { getGradient } from './components/GradientPicker';
import FontPicker, { getFontStyle } from './components/FontPicker';
import classNames from './utils/classnames';
import TextAlignmentPicker, {
  getTextAlignmentContentStyle,
  getTextAlignmentLayoutStyle,
} from './components/TextAligmentPicker';
import LogoAlignmentPicker, { getLogoAlignmentStyle } from './components/LogoAligmentPicker';
import BlendModePicker from './components/BlendModePicker';
import {
  EXPORT_FORMATS,
  EXPORT_SCALES,
  type ExportFormat,
  type ExportScale,
  copyImage,
  downloadImage,
} from './utils/export-image';
import SelectPicker from './components/SelectPicker';
import ColorPicker from './components/ColorPicker';
import { GithubIcon } from './components/icons';
import FontWeightPicker, { getFontWeightStyle } from './components/FontWeightPicker';
import { NumberField, TextField } from './components/Field';
import ImageField from './components/ImageField';
import createUpload from './utils/upload';
import SizePresetPicker from './components/SizePresetPicker';
import createElementSize from './utils/element-size';
import { DEFAULT_STATE, type PosterState, loadState, saveState } from './state';

const SAVE_DELAY = 300;
const COPIED_DURATION = 2000;
// Space kept between the preview and the edges of its pane, in pixels.
const PREVIEW_MARGIN = 32;

const SECONDARY_BUTTON_CLASS =
  'flex-1 rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-inset ring-gray-300 hover:bg-gray-50';

export default function App(): JSX.Element {
  let image: HTMLDivElement | undefined;
  const [state, setState] = createStore<PosterState>(loadState());
  const [exportError, setExportError] = createSignal('');
  const [copied, setCopied] = createSignal<'link' | 'image'>();
  const [exportFormat, setExportFormat] = createSignal<ExportFormat>('PNG');
  const [exportScale, setExportScale] = createSignal<ExportScale>('1×');
  const [jpegQuality, setJpegQuality] = createSignal(92);
  const [paneSize, paneRef] = createElementSize();
  const [logoUpload, setLogoFile] = createUpload();
  const [backgroundUpload, setBackgroundFile] = createUpload();

  // Uploaded files take the place of the URLs from the state.
  const logo = (): string => logoUpload()?.url ?? state.logo;
  const background = (): string => backgroundUpload()?.url ?? state.background;

  // Fits the whole poster in the preview pane without enlarging it.
  const previewScale = createMemo(() => {
    const pane = paneSize();
    const scale = Math.min(
      (pane.width - PREVIEW_MARGIN * 2) / state.width,
      (pane.height - PREVIEW_MARGIN * 2) / state.height,
      1,
    );
    return Math.max(scale, 0.01);
  });

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
    const url = background();
    if (url) {
      return `${gradient}, url(${JSON.stringify(url)})`;
    }
    return gradient;
  };

  const setFormat = (value: ExportFormat): void => {
    setExportFormat(value);
  };
  const setScale = (value: ExportScale): void => {
    setExportScale(value);
  };
  const setQuality = (value: number): void => {
    setJpegQuality(value);
  };

  const showCopied = (target: 'link' | 'image'): void => {
    setCopied(target);
    setTimeout(() => {
      setCopied(undefined);
    }, COPIED_DURATION);
  };

  const exportFailed = (): void => {
    setExportError('Failed to export the poster. Remote images must allow cross-origin access.');
  };

  const copyLink = (): void => {
    setExportError('');
    saveState({ ...state });
    navigator.clipboard.writeText(window.location.href).then(
      () => {
        showCopied('link');
      },
      () => {
        setExportError('Failed to copy the link.');
      },
    );
  };

  const exportImage = (): void => {
    if (!image) {
      return;
    }
    setExportError('');
    downloadImage(image, state.title, {
      format: exportFormat(),
      scale: exportScale(),
      quality: jpegQuality() / 100,
    }).catch(exportFailed);
  };

  const copyImageToClipboard = (): void => {
    if (!image) {
      return;
    }
    setExportError('');
    copyImage(image, exportScale()).then(() => {
      showCopied('image');
    }, exportFailed);
  };

  return (
    <div class="flex flex-col-reverse lg:flex-row w-screen h-screen overflow-hidden">
      <div class="w-full min-h-0 flex-1 lg:flex-none lg:w-1/3 flex flex-col gap-4 p-8 overflow-y-auto">
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
          <ImageField
            label="Logo"
            url={state.logo}
            upload={logoUpload()}
            onUrlChange={update('logo')}
            onFileChange={setLogoFile}
          />
          <ImageField
            label="Background Image"
            url={state.background}
            upload={backgroundUpload()}
            onUrlChange={update('background')}
            onFileChange={setBackgroundFile}
          />
        </div>
        <div class="flex flex-col gap-3">
          <h2 class="text-xl">Appearance</h2>
          <div class="flex flex-col gap-2">
            <h3 class="text-lg">Sizes</h3>
            <SizePresetPicker
              width={state.width}
              height={state.height}
              onChange={(width, height) => {
                setState({ width, height });
              }}
            />
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
        <div class="flex flex-col gap-2">
          <h2 class="text-xl">Export</h2>
          <div class="flex flex-row gap-2">
            <div class="flex-1">
              <SelectPicker
                label="Format"
                options={EXPORT_FORMATS}
                value={exportFormat()}
                onChange={setFormat}
              />
            </div>
            <div class="flex-1">
              <SelectPicker
                label="Scale"
                options={EXPORT_SCALES}
                value={exportScale()}
                onChange={setScale}
              />
            </div>
          </div>
          <Show when={exportFormat() === 'JPEG'}>
            <NumberField
              inline
              label="Quality"
              min={1}
              max={100}
              step={1}
              value={jpegQuality()}
              onChange={setQuality}
            />
          </Show>
          <Show when={exportFormat() === 'SVG'}>
            <p class="text-sm text-gray-500">
              SVG keeps text as text but embeds HTML, so some apps cannot open it.
            </p>
          </Show>
          <div class="flex flex-row gap-2">
            <button
              type="button"
              class="flex-1 rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              onClick={exportImage}
            >
              Download
            </button>
            <button type="button" class={SECONDARY_BUTTON_CLASS} onClick={copyImageToClipboard}>
              {copied() === 'image' ? 'Copied!' : 'Copy image'}
            </button>
          </div>
        </div>
        <div class="flex flex-row gap-2">
          <button type="button" class={SECONDARY_BUTTON_CLASS} onClick={copyLink}>
            {copied() === 'link' ? 'Copied!' : 'Copy link'}
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
        <Show when={logoUpload() ?? backgroundUpload()}>
          <p class="text-sm text-gray-500">
            Uploaded images are not saved or included in the link.
          </p>
        </Show>
        <Show when={exportError()}>
          <p class="text-sm text-red-600" role="alert">
            {exportError()}
          </p>
        </Show>
      </div>
      <div
        ref={paneRef}
        class="relative w-full h-[35vh] shrink-0 lg:shrink lg:w-2/3 lg:h-screen flex items-center justify-center overflow-hidden bg-gray-100"
      >
        <div
          ref={(el) => {
            image = el;
          }}
          class={classNames('relative p-8 shrink-0', background() && 'bg-cover bg-center')}
          style={{
            width: `${state.width}px`,
            height: `${state.height}px`,
            'background-image': getBackground(),
            'background-blend-mode': state.blendMode,
            'aspect-ratio': `${state.width} / ${state.height}`,
            scale: String(previewScale()),
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
          <Show when={logo()}>
            <img
              class={classNames('absolute m-8', getLogoAlignmentStyle(state.logoAlignment))}
              src={logo()}
              style={{
                'aspect-ratio': '1 / 1',
                width: `${state.logoSize}rem`,
                height: `${state.logoSize}rem`,
              }}
            />
          </Show>
        </div>
        <p class="absolute bottom-2 right-3 text-xs text-gray-500" aria-live="polite">
          {state.width} × {state.height} · {Math.round(previewScale() * 100)}%
        </p>
      </div>
    </div>
  );
}
