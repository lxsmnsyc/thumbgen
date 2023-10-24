import { JSX } from "solid-js";
import { RadioGroup, RadioGroupLabel, RadioGroupOption } from "terracotta";
import { classNames } from "../utils/classnames";

export type TextAlignment = 'left' | 'right' | 'middle';

export interface TextAlignmentPickerProps {
  value: TextAlignment;
  onChange: (value?: TextAlignment) => void;
}

export function getTextAlignmentStyle(alignment: TextAlignment): string {
  switch (alignment) {
    case 'left':
      return 'items-start';
    case 'middle':
      return 'items-center';
    case 'right':
      return 'items-end';
  }
}

const alignments: TextAlignment[] = [
  'left',
  'middle',
  'right',
];

const titles: Record<TextAlignment, string> = {
  left: 'Left',
  middle: 'Middle',
  right: 'Right',
};

export default function TextAlignmentPicker(props: TextAlignmentPickerProps): JSX.Element {
  return (
    <RadioGroup value={props.value} class="flex flex-row justify-between items-center" onChange={props.onChange}>
      {(ctx) => (
        <>
          <RadioGroupLabel class="">
            Text
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
                    item === 'left' && 'rounded-l-md',
                    item === 'right' && 'rounded-r-md',
                  )}
                >
                  {titles[item]}
                </RadioGroupOption>
              )}
            </For>
          </div>
        </>
      )}
    </RadioGroup>
  );
}