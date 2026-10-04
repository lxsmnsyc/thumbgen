import type { Accessor } from 'solid-js';
import { createSignal, onCleanup } from 'solid-js';

export interface Upload {
  name: string;
  url: string;
}

// Holds an uploaded file as an object URL.
// The previous URL is revoked when the file is replaced, removed or unmounted.
export default function createUpload(): [
  upload: Accessor<Upload | undefined>,
  setFile: (file: File | undefined) => void,
] {
  const [upload, setUpload] = createSignal<Upload>();

  const revoke = (): void => {
    const current = upload();
    if (current) {
      URL.revokeObjectURL(current.url);
    }
  };

  onCleanup(revoke);

  return [
    upload,
    (file) => {
      revoke();
      setUpload(file ? { name: file.name, url: URL.createObjectURL(file) } : undefined);
    },
  ];
}
