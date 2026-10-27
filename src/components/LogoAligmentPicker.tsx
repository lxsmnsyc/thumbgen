import type { JSX } from 'solid-js';
import { For } from 'solid-js';
import { RadioGroup, RadioGroupLabel, RadioGroupOption } from 'terracotta';
import classNames from '../utils/classnames';

export type LogoAlignment = 'TL' | 'TR' | 'BL' | 'BR';

export interface LogoAlignmentPickerProps {
  value: LogoAlignment;
  onChange: (value: LogoAlignment) => void;
}

const LOGO_ALIGNMENT_STYLES: Record<LogoAlignment, string> = {
  BL: 'bottom-0 left-0',
  BR: 'bottom-0 right-0',
  TL: 'top-0 left-0',
  TR: 'top-0 right-0',
};

export function getLogoAlignmentStyle(alignment: LogoAlignment): string {
  return LOGO_ALIGNMENT_STYLES[alignment];
}

export const LOGO_ALIGNMENTS: readonly LogoAlignment[] = ['TL', 'TR', 'BL', 'BR'];

export default function LogoAlignmentPicker(props: LogoAlignmentPickerProps): JSX.Element {
  return (
    <RadioGroup
      value={props.value}
      class="flex flex-row justify-between items-center"
      onChange={(value) => {
        if (value) {
          props.onChange(value);
        }
      }}
    >
      {(ctx) => (
        <>
          <RadioGroupLabel class="">Logo</RadioGroupLabel>
          <div class="flex flex-row">
            <For each={LOGO_ALIGNMENTS}>
              {(item) => (
                <RadioGroupOption
                  value={item}
                  class={classNames(
                    'py-2 px-2 text-sm font-semibold sm:flex-1 cursor-pointer focus:outline-hidden',
                    ctx.isActive(item) && 'ring-2 ring-blue-600 ring-offset-2',
                    ctx.isSelected(item)
                      ? 'bg-blue-600 text-white hover:bg-blue-500'
                      : 'ring-1 ring-inset ring-gray-300 bg-white text-gray-900 hover:bg-gray-50',
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
