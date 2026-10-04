import {
  DisclosureStateChild,
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
  Transition,
} from 'terracotta';
import type { JSX } from 'solid-js';
import { For, createUniqueId } from 'solid-js';
import { CheckIcon, SelectorIcon } from './icons';
import classNames from '../utils/classnames';

export interface SelectPickerProps<T extends string> {
  label: string;
  options: readonly T[];
  value: T;
  onChange: (value: T) => void;
  // Renders an option's text. Defaults to the option value.
  renderOption?: (option: T) => JSX.Element;
}

export default function SelectPicker<T extends string>(props: SelectPickerProps<T>): JSX.Element {
  const labelId = createUniqueId();

  const render = (option: T): JSX.Element => props.renderOption?.(option) ?? option;

  return (
    <div class="flex flex-col gap-2">
      <span id={labelId} class="block text-sm font-medium leading-6 text-gray-900">
        {props.label}
      </span>
      <Listbox
        class="w-full"
        defaultOpen={false}
        value={props.value}
        onSelectChange={(value) => {
          if (value) {
            props.onChange(value);
          }
        }}
      >
        <div class="relative">
          <ListboxButton
            aria-labelledby={labelId}
            class="relative w-full rounded-md border-0 py-2 pl-3 pr-10 text-left text-gray-900 shadow-xs ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
          >
            <span class="block truncate">{render(props.value)}</span>
            <span class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <SelectorIcon class="w-5 h-5 text-gray-400" aria-hidden="true" />
            </span>
          </ListboxButton>
          <DisclosureStateChild>
            {({ isOpen }) => (
              <Transition
                show={isOpen()}
                enter="transition ease-in duration-100"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition ease-out duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <ListboxOptions
                  unmount={false}
                  aria-labelledby={labelId}
                  class="absolute z-50 w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black/5 focus:outline-hidden sm:text-sm"
                >
                  <For each={props.options}>
                    {(option) => (
                      <ListboxOption class="focus:outline-hidden group" value={option}>
                        {({ isActive, isSelected }) => (
                          <div
                            class={classNames(
                              isActive() ? 'text-blue-900 bg-blue-100' : 'text-gray-900',
                              'group-hover:text-blue-900 group-hover:bg-blue-100',
                              'cursor-default select-none relative py-2 pl-10 pr-4',
                            )}
                          >
                            <span
                              class={classNames(
                                isSelected() ? 'font-medium' : 'font-normal',
                                'block truncate',
                              )}
                            >
                              {render(option)}
                            </span>
                            {isSelected() ? (
                              <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                                <CheckIcon class="w-5 h-5" aria-hidden="true" />
                              </span>
                            ) : null}
                          </div>
                        )}
                      </ListboxOption>
                    )}
                  </For>
                </ListboxOptions>
              </Transition>
            )}
          </DisclosureStateChild>
        </div>
      </Listbox>
    </div>
  );
}
