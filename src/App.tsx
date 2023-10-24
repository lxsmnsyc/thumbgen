import type { JSX } from 'solid-js';
import * as htmlToImage from 'html-to-image';
import GradientPicker, { getGradient } from './components/GradientPicker';
import FontPicker, { Font, getFontStyle } from './components/FontPicker';
import { classNames } from './utils/classnames';
import TextAlignmentPicker, { TextAlignment, getTextAlignmentStyle } from './components/TextAligmentPicker';
import LogoAlignmentPicker, { LogoAlignment, getLogoAlignmentStyle } from './components/LogoAligmentPicker';
import BlendModePicker, { BlendMode } from './components/BlendModePicker';
import download from './utils/download';

export default function App(): JSX.Element {
  let image = $signal<HTMLElement>();
  let title = $signal('My title');
  let description = $signal('My description');
  let logo = $signal('');
  let background = $signal('');
  let width = $signal(1280);
  let height = $signal(640);
  let gradientIndex = $signal(0);
  let titleSize = $signal(6);
  let descriptionSize = $signal(4);
  let logoSize = $signal(8);
  let titleFont = $signal<Font>('Mono');
  let descriptionFont = $signal<Font>('Mono');
  let textAlignment = $signal<TextAlignment>('left');
  let logoAlignment = $signal<LogoAlignment>('TL');
  let color = $signal('#000');
  let blendMode = $signal<BlendMode>('normal')

  const getBackground = () => {
    const gradient = getGradient(gradientIndex);
    if (background) {
      return `${gradient}, url(${background})`;
    }
    return gradient;
  };

  return (
    <div class="flex flex-row w-screen h-screen overflow-hidden">
      <div class="w-1/3 flex flex-col gap-4 p-8 overflow-y-auto">
        <h1 class="text-4xl">ThumbGen</h1>
        <div class="flex flex-col gap-2">
          <h2 class="text-xl">Details</h2>
          <div class="flex flex-col gap-2">
            <label
              for="title"
              class="block text-sm font-medium leading-6 text-gray-900"
            >
              Title
            </label>
            <div>
              <input
                type="text"
                name="title"
                class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                value={title}
                onInput={(e) => {
                  title = e.target.value;
                }}
              />
            </div>
          </div>
          <div class="flex flex-col gap-2">
            <label
              for="description"
              class="block text-sm font-medium leading-6 text-gray-900"
            >
              Description
            </label>
            <div class="">
              <input
                type="text"
                name="description"
                class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                value={description}
                onInput={(e) => {
                  description = e.target.value;
                }}
              />
            </div>
          </div>
          <div class="flex flex-col gap-2">
            <label
              for="logo"
              class="block text-sm font-medium leading-6 text-gray-900"
            >
              Logo
            </label>
            <div class="">
              <input
                type="text"
                name="logo"
                class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                value={logo}
                onInput={(e) => {
                  logo = e.target.value;
                }}
              />
            </div>
          </div>
          <div class="flex flex-col gap-2">
            <label
              for="background-image"
              class="block text-sm font-medium leading-6 text-gray-900"
            >
              Background Image
            </label>
            <div class="">
              <input
                type="text"
                name="background-image"
                class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                value={background}
                onInput={(e) => {
                  background = e.target.value;
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
                <label
                  for="width"
                  class="block text-sm font-medium leading-6 text-gray-900"
                >
                  Width
                </label>
                <div class="">
                  <input
                    type="number"
                    name="width"
                    class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                    value={width}
                    onInput={(e) => {
                      width = Number.parseInt(e.target.value);
                    }}
                  />
                </div>
              </div>
              <div class="flex-1">
                <label
                  for="height"
                  class="block text-sm font-medium leading-6 text-gray-900"
                >
                  Height
                </label>
                <div class="">
                  <input
                    type="number"
                    name="height"
                    class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                    value={height}
                    onInput={(e) => {
                      height = Number.parseInt(e.target.value);
                    }}
                  />
                </div>
              </div>
            </div>
            <div class="flex flex-row items-center justify-between">
              <label
                for="title-size"
                class="block text-sm font-medium leading-6 text-gray-900"
              >
                Title
              </label>
              <div class="">
                <input
                  type="number"
                  name="title-size"
                  class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                  value={titleSize}
                  onInput={(e) => {
                    titleSize = Number.parseInt(e.target.value);
                  }}
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
                  name="description-size"
                  class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                  value={descriptionSize}
                  onInput={(e) => {
                    descriptionSize = Number.parseInt(e.target.value);
                  }}
                />
              </div>
            </div>
            <div class="flex flex-row items-center justify-between">
              <label
                for="logo-size"
                class="block text-sm font-medium leading-6 text-gray-900"
              >
                Logo
              </label>
              <div class="">
                <input
                  type="number"
                  name="logo-size"
                  class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                  value={logoSize}
                  onInput={(e) => {
                    logoSize = Number.parseInt(e.target.value);
                  }}
                />
              </div>
            </div>
          </div>
          <div class="flex flex-col gap-2">
            <h3 class="text-lg">Fonts</h3>
            <div class="flex flex-col gap-2">
              <label
                for="title-font"
                class="block text-sm font-medium leading-6 text-gray-900"
              >
                Title
              </label>
              <FontPicker value={titleFont} onChange={$set(titleFont)} />
            </div>
            <div class="flex flex-col gap-2">
              <label
                for="description-font"
                class="block text-sm font-medium leading-6 text-gray-900"
              >
                Description
              </label>
              <FontPicker value={descriptionFont} onChange={$set(descriptionFont)} />
            </div>
          </div>
          <div class="flex flex-col gap-2">
            <h3 class="text-lg">Alignment</h3>
            <TextAlignmentPicker value={textAlignment} onChange={$set(textAlignment)} />
            <LogoAlignmentPicker value={logoAlignment} onChange={$set(logoAlignment)} />
          </div>
        </div>
        <div class="flex flex-col gap-2">
          <h2 class="text-xl">Colors</h2>
          <div class="flex flex-col gap-2">
            <label
              for="color"
              class="block text-sm font-medium leading-6 text-gray-900"
            >
              Text
            </label>
            <div class="flex flex-row gap-1 items-center justify-center">
              <input
                type="text"
                name="text-color"
                class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                value={color}
                onInput={(e) => {
                  color = e.target.value;
                }}
              />
              <div class="w-8 h-8 block border" style={{'background-color': color}} />
            </div>
          </div>
          <div>
            <label
              for="blend-mode"
              class="block text-sm font-medium leading-6 text-gray-900"
            >
              Blend Mode
            </label>
            <BlendModePicker value={blendMode} onChange={$set(blendMode)} />
          </div>
          <div>
            <label
              class="block text-sm font-medium leading-6 text-gray-900"
            >
              Background
            </label>
            <GradientPicker
              value={gradientIndex}
              onChange={(value) => {
                gradientIndex = value;
              }}
            />
          </div>
        </div>
        <button
          type="button"
          class="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          onClick={() => {
            if (image) {
              htmlToImage.toPng(image, {
                style: {
                  transform: 'scale(1)',
                },
              }).then((url) => {
                download(url, 'my-poster.png');
              });
            }
          }}
        >
          Download
        </button>
      </div>
      <div class="relative w-2/3 h-screen flex items-center justify-center">
        <div
          ref={$set(image)}
          class={classNames(
            'p-8',
            background && 'bg-cover bg-center',
          )}
          style={{
            width: `${width}px`,
            height: `${height}px`,
            'background-image': getBackground(),
            'background-blend-mode': blendMode,
            'aspect-ratio': `${width} / ${height}`,
            transform: `scale(0.5)`
          }}
        >
          <div
            class={classNames(
              'flex flex-col gap-2 justify-center w-full h-full',
              getTextAlignmentStyle(textAlignment),
            )}
            style={{
              color: color,
            }}
          >
            <h1
              class={classNames(
                getFontStyle(titleFont)
              )}
              style={{
                'font-size': `${titleSize}rem`,
              }}
            >
              {title}
            </h1>
            <div
              class={classNames(
                getFontStyle(descriptionFont)
              )}
              style={{
                'font-size': `${descriptionSize}rem`,
              }}
            >
              {description}
            </div>
          </div>
          <Show when={logo}>
            <img
              class={classNames(
                'absolute m-8',
                getLogoAlignmentStyle(logoAlignment),
              )}
              src={logo}
              style={{
                'aspect-ratio': '1 / 1',
                width: `${logoSize}rem`,
                height: `${logoSize}rem`,
              }}
            />
          </Show>
        </div>
      </div>
    </div>
  );
}
