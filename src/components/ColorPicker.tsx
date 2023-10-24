import { JSX } from "solid-js";
import { classNames } from "../utils/classnames";

const COLORS = [
  '#000',
  '#fff',
  '#64748b',
  '#6b7280',
  '#71717a',
  '#737373',
  '#78716c',
  '#ef4444',
  '#f97316',
  '#f59e0b',
  '#eab308',
  '#84cc16',
  '#22c55e',
  '#10b981',
  '#14b8a6',
  '#06b6d4',
  '#0ea5e9',
  '#3b82f6',
  '#6366f1',
  '#8b5cf6',
  '#a855f7',
  '#d946ef',
  '#ec4899',
  '#f43f5e',
];


interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void
}

export function ColorPicker(props: ColorPickerProps): JSX.Element {
  function onChange(color: string) {
    props.onChange(color);
  }

  const isSelected = $selector(props.value);
  return (
    <div class="flex flex-wrap gap-1">
      <For each={COLORS}>
        {(item) => (
          <button
            class={classNames(
              'w-8 h-8 rounded',
              isSelected(item) ? 'border-2 border-blue-500' : 'border border-blue-300'
            )}
            title={item}
            onClick={[onChange, item]}
            style={{'background-color': item}}
          />
        )}
      </For>
      <input
        class="flex-1 rounded w-full h-8 border-none"
        type="color"
        onChange={(e) => onChange(e.target.value)} value={props.value}
      />
    </div>
  );
}