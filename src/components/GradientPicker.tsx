import { JSX } from 'solid-js';
import { classNames } from '../utils/classnames';
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
  let item = data.gradient[0];
  let color = `${item.color} ${item.pos}%`;
  for (let i = 1, len = data.gradient.length, item: GradientStop; i < len; i++) {
    item = data.gradient[i];
    color += `, ${item.color} ${item.pos}%`;
  }
  const result = `linear-gradient(${data.deg}deg, ${color})`
  return result;
}

interface GradientPickerProps {
  value: number;
  onChange: (value: number) => void;
}

export function getGradient(value: number): string {
  return convertGradientData((gradients as GradientData[])[value]);
}

export default function GradientPicker(props: GradientPickerProps): JSX.Element {
  const isSelected = $selector(props.value)
  return (
    <div class="flex flex-row flex-wrap gap-1">
      {(gradients as GradientData[]).map((item, index) => (
        <button
          class={classNames(
            'w-8 h-8 rounded',
            isSelected(index) && 'border-2 border-blue-500'
          )}
          style={{
            "background-image": convertGradientData(item),
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