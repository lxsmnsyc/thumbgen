import type { Accessor } from 'solid-js';
import { createSignal, onCleanup } from 'solid-js';

export interface ElementSize {
  width: number;
  height: number;
}

// Tracks the content box size of an element.
// Call the returned ref function with the element once it is mounted.
export default function createElementSize(): [
  size: Accessor<ElementSize>,
  ref: (element: HTMLElement) => void,
] {
  const [size, setSize] = createSignal<ElementSize>({ width: 0, height: 0 });
  const observer = new ResizeObserver((entries) => {
    for (const entry of entries) {
      setSize({ width: entry.contentRect.width, height: entry.contentRect.height });
    }
  });
  onCleanup(() => {
    observer.disconnect();
  });
  return [
    size,
    (element) => {
      observer.observe(element);
    },
  ];
}
