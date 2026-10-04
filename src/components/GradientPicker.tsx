import type { JSX } from 'solid-js';
import { createSelector } from 'solid-js';
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
  value: number;
  onChange: (value: number) => void;
}

export function getGradient(value: number): string {
  return convertGradientData((gradients as GradientData[])[value]);
}

export default function GradientPicker(props: GradientPickerProps): JSX.Element {
  const isSelected = createSelector(() => props.value);
  return (
    <div class="flex flex-row flex-wrap gap-1">
      {(gradients as GradientData[]).map((item, index) => (
        <button
          class={classNames('w-8 h-8 rounded-sm', isSelected(index) && 'border-2 border-blue-500')}
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
  );
}
