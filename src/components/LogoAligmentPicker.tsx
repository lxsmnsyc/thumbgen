import { JSX } from "solid-js";
import { RadioGroup, RadioGroupLabel, RadioGroupOption } from "terracotta";
import { classNames } from "../utils/classnames";

export type LogoAlignment = 'TL' | 'TR' | 'BL' | 'BR';

export interface LogoAlignmentPickerProps {
  value: LogoAlignment;
  onChange: (value?: LogoAlignment) => void;
}

export function getLogoAlignmentStyle(alignment: LogoAlignment): string {
  switch (alignment) {
    case 'BL':
      return 'bottom-0 left-0';
    case 'BR':
      return 'bottom-0 right-0';
    case 'TL':
      return 'top-0 left-0';
    case 'TR':
      return 'top-0 right-0';
  }
}

const alignments: LogoAlignment[] = [
  'TL',
  'TR',
  'BL',
  'BR',
];

export default function LogoAlignmentPicker(props: LogoAlignmentPickerProps): JSX.Element {
  return (
    <RadioGroup value={props.value} class="flex flex-row justify-between items-center" onChange={props.onChange}>
      {(ctx) => (
        <>
          <RadioGroupLabel class="">
            Logo
          </RadioGroupLabel>
          <div class="flex flex-row">
            <For each={alignments}>
              {(item) => (
                <RadioGroupOption
                  value={item}
                  class={classNames(
                    'py-2 px-2 text-sm font-semibold sm:flex-1 cursor-pointer focus:outline-none',
                    ctx.isActive(item) && 'ring-2 ring-blue-600 ring-offset-2',
                    ctx.isSelected(item) ? 'bg-blue-600 text-white hover:bg-blue-500' : 'ring-1 ring-inset ring-gray-300 bg-white text-gray-900 hover:bg-gray-50',
                  )}
                >
                  {item}
                </RadioGroupOption>
              )}
            </For>
          </div>
        </>
      )}
    </RadioGroup>
  );
}