import type { JSX } from 'solid-js';
import { createUniqueId } from 'solid-js';
import classNames from '../utils/classnames';

const LABEL_CLASS = 'block text-sm font-medium leading-6 text-gray-900';

const INPUT_CLASS =
  'block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-xs ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6';

export interface TextFieldProps {
  label: string;
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
}

export function TextField(props: TextFieldProps): JSX.Element {
  const id = createUniqueId();
  return (
    <div class="flex flex-col gap-2">
      <label for={id} class={LABEL_CLASS}>
        {props.label}
      </label>
      <input
        type="text"
        id={id}
        class={INPUT_CLASS}
        placeholder={props.placeholder}
        value={props.value}
        onInput={(e) => {
          props.onChange(e.currentTarget.value);
        }}
      />
    </div>
  );
}

export interface NumberFieldProps {
  label: string;
  value: number;
  min?: number;
  max?: number;
  step?: number;
  // Places the label beside the input instead of above it.
  inline?: boolean;
  onChange: (value: number) => void;
}

export function NumberField(props: NumberFieldProps): JSX.Element {
  const id = createUniqueId();
  return (
    <div
      class={classNames(
        'flex flex-1',
        props.inline ? 'flex-row items-center justify-between gap-2' : 'flex-col gap-2',
      )}
    >
      <label for={id} class={LABEL_CLASS}>
        {props.label}
      </label>
      <input
        type="number"
        id={id}
        class={classNames(INPUT_CLASS, props.inline && 'max-w-40')}
        min={props.min}
        max={props.max}
        step={props.step ?? 'any'}
        value={props.value}
        onInput={(e) => {
          // A cleared, partial or out of range input keeps the last valid value.
          const value = Number.parseFloat(e.currentTarget.value);
          if (
            Number.isFinite(value) &&
            value >= (props.min ?? -Infinity) &&
            value <= (props.max ?? Infinity)
          ) {
            props.onChange(value);
          }
        }}
      />
    </div>
  );
}
