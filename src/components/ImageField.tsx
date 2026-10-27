import type { JSX } from 'solid-js';
import { Show, createSignal, createUniqueId } from 'solid-js';
import classNames from '../utils/classnames';
import type { Upload } from '../utils/upload';

const INPUT_CLASS =
  'block w-full min-w-0 rounded-md border-0 py-1.5 text-gray-900 shadow-xs ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6';

const BUTTON_CLASS =
  'shrink-0 rounded-md bg-white px-3 py-1.5 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-inset ring-gray-300 hover:bg-gray-50';

export interface ImageFieldProps {
  label: string;
  url: string;
  upload: Upload | undefined;
  onUrlChange: (url: string) => void;
  onFileChange: (file: File | undefined) => void;
}

function getImageFile(files: FileList | null | undefined): File | undefined {
  const file = files?.[0];
  return file?.type.startsWith('image/') ? file : undefined;
}

// A text field for an image URL that also accepts an uploaded or dropped file.
// An uploaded file takes the place of the URL until it is removed.
export default function ImageField(props: ImageFieldProps): JSX.Element {
  const id = createUniqueId();
  const [dragging, setDragging] = createSignal(false);
  let fileInput: HTMLInputElement | undefined;

  return (
    <div
      class={classNames(
        'flex flex-col gap-2 rounded-md',
        dragging() && 'outline-2 outline-dashed outline-offset-4 outline-blue-500',
      )}
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => {
        setDragging(false);
      }}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        const file = getImageFile(e.dataTransfer?.files);
        if (file) {
          props.onFileChange(file);
        }
      }}
    >
      <label for={id} class="block text-sm font-medium leading-6 text-gray-900">
        {props.label}
      </label>
      <div class="flex flex-row gap-2">
        <Show
          when={props.upload}
          fallback={
            <>
              <input
                type="text"
                id={id}
                class={INPUT_CLASS}
                placeholder="https:// or drop an image"
                value={props.url}
                onInput={(e) => {
                  props.onUrlChange(e.currentTarget.value);
                }}
              />
              <button
                type="button"
                class={BUTTON_CLASS}
                onClick={() => {
                  fileInput?.click();
                }}
              >
                Upload
              </button>
            </>
          }
        >
          {(upload) => (
            <>
              <input
                type="text"
                id={id}
                class={classNames(INPUT_CLASS, 'bg-gray-50')}
                value={upload().name}
                readOnly
              />
              <button
                type="button"
                class={BUTTON_CLASS}
                onClick={() => {
                  props.onFileChange(undefined);
                }}
              >
                Remove
              </button>
            </>
          )}
        </Show>
        <input
          ref={(el) => {
            fileInput = el;
          }}
          type="file"
          accept="image/*"
          class="hidden"
          onChange={(e) => {
            const file = getImageFile(e.currentTarget.files);
            if (file) {
              props.onFileChange(file);
            }
            // Clears the input so picking the same file again still fires.
            e.currentTarget.value = '';
          }}
        />
      </div>
    </div>
  );
}
