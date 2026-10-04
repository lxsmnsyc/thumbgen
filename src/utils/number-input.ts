import type { JSX, Setter } from 'solid-js';

// Ignores input that does not parse to a finite number, so a cleared field
// keeps the last valid value instead of producing `NaN`.
export default function numberInput(
  setter: Setter<number>,
): JSX.EventHandler<HTMLInputElement, InputEvent> {
  return (e) => {
    const value = Number.parseFloat(e.currentTarget.value);
    if (Number.isFinite(value)) {
      setter(value);
    }
  };
}
