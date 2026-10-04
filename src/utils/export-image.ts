import * as htmlToImage from 'html-to-image';
import download from './download';

export type ExportFormat = 'PNG' | 'JPEG' | 'SVG';

export const EXPORT_FORMATS: readonly ExportFormat[] = ['PNG', 'JPEG', 'SVG'];

export type ExportScale = '1×' | '2×' | '3×';

export const EXPORT_SCALES: readonly ExportScale[] = ['1×', '2×', '3×'];

export interface ExportOptions {
  format: ExportFormat;
  scale: ExportScale;
  // JPEG quality from 0 to 1.
  quality: number;
}

const EXTENSIONS: Record<ExportFormat, string> = {
  PNG: 'png',
  JPEG: 'jpg',
  SVG: 'svg',
};

type RenderOptions = NonNullable<Parameters<typeof htmlToImage.toPng>[1]>;

function getRenderOptions(scale: ExportScale): RenderOptions {
  return {
    // Without this, html-to-image uses the screen's pixel ratio.
    pixelRatio: Number.parseInt(scale, 10),
    // The preview is scaled down with the `scale` property, so reset
    // it to export the poster at its real size.
    style: {
      scale: '1',
    },
  };
}

function getFileName(title: string, format: ExportFormat): string {
  const slug = title
    .toLowerCase()
    .replaceAll(/[^\da-z]+/g, '-')
    .replaceAll(/^-|-$/g, '');
  return `${slug || 'poster'}.${EXTENSIONS[format]}`;
}

async function render(node: HTMLElement, options: ExportOptions): Promise<string> {
  // Waits for web fonts so the image does not use a fallback font.
  await document.fonts.ready;
  const renderOptions = getRenderOptions(options.scale);
  switch (options.format) {
    case 'JPEG':
      return htmlToImage.toJpeg(node, { ...renderOptions, quality: options.quality });
    case 'SVG':
      return htmlToImage.toSvg(node, renderOptions);
    default:
      return htmlToImage.toPng(node, renderOptions);
  }
}

export async function downloadImage(
  node: HTMLElement,
  title: string,
  options: ExportOptions,
): Promise<void> {
  const url = await render(node, options);
  download(url, getFileName(title, options.format));
}

export async function copyImage(node: HTMLElement, scale: ExportScale): Promise<void> {
  // Passes the pending blob to ClipboardItem so Safari keeps the user gesture.
  const blob = document.fonts.ready
    .then(async () => htmlToImage.toBlob(node, getRenderOptions(scale)))
    .then((result) => {
      if (!result) {
        throw new Error('Failed to render the poster.');
      }
      return result;
    });
  await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
}
