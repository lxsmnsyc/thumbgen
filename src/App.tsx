import type { JSX } from 'solid-js';
import { Show, createSignal } from 'solid-js';
import * as htmlToImage from 'html-to-image';
import GradientPicker, { getGradient } from './components/GradientPicker';
import FontPicker, { type Font, getFontStyle } from './components/FontPicker';
import classNames from './utils/classnames';
import TextAlignmentPicker, {
  type TextAlignment,
  getTextAlignmentContentStyle,
  getTextAlignmentLayoutStyle,
} from './components/TextAligmentPicker';
import LogoAlignmentPicker, {
  type LogoAlignment,
  getLogoAlignmentStyle,
} from './components/LogoAligmentPicker';
import BlendModePicker, { type BlendMode } from './components/BlendModePicker';
import download from './utils/download';
import numberInput from './utils/number-input';
import ColorPicker from './components/ColorPicker';
import { GithubIcon } from './components/icons';
import FontWeightPicker, {
  type FontWeight,
  getFontWeightStyle,
} from './components/FontWeightPicker';

export default function App(): JSX.Element {
  let image: HTMLDivElement | undefined;
  const [title, setTitle] = createSignal('My title');
  const [description, setDescription] = createSignal('My description');
  const [logo, setLogo] = createSignal('');
  const [background, setBackground] = createSignal('');
  const [width, setWidth] = createSignal(1280);
  const [height, setHeight] = createSignal(640);
  const [gradientIndex, setGradientIndex] = createSignal(0);
  const [titleSize, setTitleSize] = createSignal(6);
  const [descriptionSize, setDescriptionSize] = createSignal(4);
  const [logoSize, setLogoSize] = createSignal(8);
  const [titleFont, setTitleFont] = createSignal<Font>('Mono');
  const [descriptionFont, setDescriptionFont] = createSignal<Font>('Mono');
  const [textAlignment, setTextAlignment] = createSignal<TextAlignment>('left');
  const [logoAlignment, setLogoAlignment] = createSignal<LogoAlignment>('TL');
  const [color, setColor] = createSignal('#000');
  const [blendMode, setBlendMode] = createSignal<BlendMode>('hue');
  const [titleWeight, setTitleWeight] = createSignal<FontWeight>('Bold');
  const [descriptionWeight, setDescriptionWeight] = createSignal<FontWeight>('Normal');
  const [exportError, setExportError] = createSignal('');

  const getBackground = (): string => {
    const gradient = getGradient(gradientIndex());
    if (background()) {
      return `${gradient}, url(${background()})`;
    }
    return gradient;
  };

  return (
    <div class="flex flex-col-reverse lg:flex-row w-screen h-screen overflow-hidden">
      <div class="w-full lg:w-1/3 flex flex-col gap-4 p-8 overflow-y-auto">
        <div class="flex flex-row gap-1 items-center justify-center">
          <h1 class="text-4xl">ThumbGen</h1>
          <a href="https://github.com/lxsmnsyc/thumbgen">
            <GithubIcon class="w-8 h-8 text-black" />
          </a>
        </div>
        <div class="flex flex-col gap-2">
          <h2 class="text-xl">Details</h2>
          <div class="flex flex-col gap-2">
            <label for="title" class="block text-sm font-medium leading-6 text-gray-900">
              Title
            </label>
            <div>
              <input
                type="text"
                id="title"
                name="title"
                class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-xs ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                value={title()}
                onInput={(e) => {
                  setTitle(e.target.value);
                }}
              />
            </div>
          </div>
          <div class="flex flex-col gap-2">
            <label for="description" class="block text-sm font-medium leading-6 text-gray-900">
              Description
            </label>
            <div class="">
              <input
                type="text"
                id="description"
                name="description"
                class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-xs ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                value={description()}
                onInput={(e) => {
                  setDescription(e.target.value);
                }}
              />
            </div>
          </div>
          <div class="flex flex-col gap-2">
            <label for="logo" class="block text-sm font-medium leading-6 text-gray-900">
              Logo
            </label>
            <div class="">
              <input
                type="text"
                id="logo"
                name="logo"
                class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-xs ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                value={logo()}
                onInput={(e) => {
                  setLogo(e.target.value);
                }}
              />
            </div>
          </div>
          <div class="flex flex-col gap-2">
            <label for="background-image" class="block text-sm font-medium leading-6 text-gray-900">
              Background Image
            </label>
            <div class="">
              <input
                type="text"
                id="background-image"
                name="background-image"
                class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-xs ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                value={background()}
                onInput={(e) => {
                  setBackground(e.target.value);
                }}
              />
            </div>
          </div>
        </div>
        <div class="flex flex-col gap-3">
          <h2 class="text-xl">Appearance</h2>
          <div class="flex flex-col gap-2">
            <h3 class="text-lg">Sizes</h3>
            <div class="flex flex-row gap-2">
              <div class="flex-1">
                <label for="width" class="block text-sm font-medium leading-6 text-gray-900">
                  Width
                </label>
                <div class="">
                  <input
                    type="number"
                    id="width"
                    name="width"
                    class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-xs ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                    value={width()}
                    onInput={numberInput(setWidth)}
                  />
                </div>
              </div>
              <div class="flex-1">
                <label for="height" class="block text-sm font-medium leading-6 text-gray-900">
                  Height
                </label>
                <div class="">
                  <input
                    type="number"
                    id="height"
                    name="height"
                    class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-xs ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                    value={height()}
                    onInput={numberInput(setHeight)}
                  />
                </div>
              </div>
            </div>
            <div class="flex flex-row items-center justify-between">
              <label for="title-size" class="block text-sm font-medium leading-6 text-gray-900">
                Title
              </label>
              <div class="">
                <input
                  type="number"
                  id="title-size"
                  name="title-size"
                  class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-xs ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                  value={titleSize()}
                  onInput={numberInput(setTitleSize)}
                />
              </div>
            </div>
            <div class="flex flex-row items-center justify-between">
              <label
                for="description-size"
                class="block text-sm font-medium leading-6 text-gray-900"
              >
                Description
              </label>
              <div class="">
                <input
                  type="number"
                  id="description-size"
                  name="description-size"
                  class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-xs ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                  value={descriptionSize()}
                  onInput={numberInput(setDescriptionSize)}
                />
              </div>
            </div>
            <div class="flex flex-row items-center justify-between">
              <label for="logo-size" class="block text-sm font-medium leading-6 text-gray-900">
                Logo
              </label>
              <div class="">
                <input
                  type="number"
                  id="logo-size"
                  name="logo-size"
                  class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-xs ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                  value={logoSize()}
                  onInput={numberInput(setLogoSize)}
                />
              </div>
            </div>
          </div>
          <div class="flex flex-col gap-2">
            <h3 class="text-lg">Fonts</h3>
            <FontPicker
              label="Title"
              value={titleFont()}
              onChange={(value) => {
                setTitleFont(value);
              }}
            />
            <FontPicker
              label="Description"
              value={descriptionFont()}
              onChange={(value) => {
                setDescriptionFont(value);
              }}
            />
          </div>
          <div class="flex flex-col gap-2">
            <h3 class="text-lg">Alignment</h3>
            <TextAlignmentPicker
              value={textAlignment()}
              onChange={(value) => {
                setTextAlignment(value);
              }}
            />
            <LogoAlignmentPicker
              value={logoAlignment()}
              onChange={(value) => {
                setLogoAlignment(value);
              }}
            />
          </div>
          <div class="flex flex-col gap-2">
            <h3 class="text-lg">Font Weight</h3>
            <FontWeightPicker
              label="Title"
              value={titleWeight()}
              onChange={(value) => {
                setTitleWeight(value);
              }}
            />
            <FontWeightPicker
              label="Description"
              value={descriptionWeight()}
              onChange={(value) => {
                setDescriptionWeight(value);
              }}
            />
          </div>
        </div>
        <div class="flex flex-col gap-2">
          <h2 class="text-xl">Colors</h2>
          <ColorPicker
            label="Text"
            value={color()}
            onChange={(value) => {
              setColor(value);
            }}
          />
          <BlendModePicker
            label="Blend Mode"
            value={blendMode()}
            onChange={(value) => {
              setBlendMode(value);
            }}
          />
          <GradientPicker
            label="Background"
            value={gradientIndex()}
            onChange={(value) => {
              setGradientIndex(value);
            }}
          />
        </div>
        <button
          type="button"
          class="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          onClick={() => {
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
          }}
        >
          Download
        </button>
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
            background() && 'bg-cover bg-center',
          )}
          style={{
            width: `${width()}px`,
            height: `${height()}px`,
            'background-image': getBackground(),
            'background-blend-mode': blendMode(),
            'aspect-ratio': `${width()} / ${height()}`,
          }}
        >
          <div
            class={classNames(
              'flex flex-col gap-2 justify-center w-full h-full',
              getTextAlignmentLayoutStyle(textAlignment()),
            )}
            style={{
              color: color(),
            }}
          >
            <h1
              class={classNames(
                getFontStyle(titleFont()),
                getTextAlignmentContentStyle(textAlignment()),
                getFontWeightStyle(titleWeight()),
              )}
              style={{
                'font-size': `${titleSize()}rem`,
              }}
            >
              {title()}
            </h1>
            <div
              class={classNames(
                getFontStyle(descriptionFont()),
                getTextAlignmentContentStyle(textAlignment()),
                getFontWeightStyle(descriptionWeight()),
              )}
              style={{
                'font-size': `${descriptionSize()}rem`,
              }}
            >
              {description()}
            </div>
          </div>
          <Show when={logo()}>
            <img
              class={classNames('absolute m-8', getLogoAlignmentStyle(logoAlignment()))}
              src={logo()}
              style={{
                'aspect-ratio': '1 / 1',
                width: `${logoSize()}rem`,
                height: `${logoSize()}rem`,
              }}
            />
          </Show>
        </div>
      </div>
    </div>
  );
}
