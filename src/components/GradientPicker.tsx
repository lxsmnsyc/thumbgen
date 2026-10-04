import type { JSX } from 'solid-js';
import { createSelector, createUniqueId } from 'solid-js';
import classNames from '../utils/classnames';
// https://github.com/itmeo/webgradients
import gradients from '../gradients.json';

interface GradientStop {
  color: string;
  pos: number;
}

interface GradientData {
  name: string;
  deg: number;
  gradient: GradientStop[];
}

function convertGradientData(data: GradientData): string {
  const stops = data.gradient.map((stop) => `${stop.color} ${stop.pos}%`).join(', ');
  return `linear-gradient(${data.deg}deg, ${stops})`;
}

interface GradientPickerProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
}

export function getGradient(value: number): string {
  return convertGradientData((gradients as GradientData[])[value]);
}

export default function GradientPicker(props: GradientPickerProps): JSX.Element {
  const labelId = createUniqueId();
  const isSelected = createSelector(() => props.value);
  return (
    <div class="flex flex-col gap-2">
      <span id={labelId} class="block text-sm font-medium leading-6 text-gray-900">
        {props.label}
      </span>
      <div role="group" aria-labelledby={labelId} class="flex flex-row flex-wrap gap-1">
        {(gradients as GradientData[]).map((item, index) => (
          <button
            type="button"
            aria-pressed={isSelected(index)}
            class={classNames(
              'w-8 h-8 rounded-sm',
              isSelected(index) && 'border-2 border-blue-500',
            )}
            style={{
              'background-image': convertGradientData(item),
            }}
            title={item.name}
            onClick={() => {
              props.onChange(index);
            }}
          >
            <span class="sr-only">{item.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
