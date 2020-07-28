import { Chart } from '@sgratzl/chartjs-esm-facade';
const { toMatchImageSnapshot } = require('jest-image-snapshot');

expect.extend({ toMatchImageSnapshot });

/**
 *
 * @param {HTMLCanvasElement} canvas
 */
function toBuffer(canvas) {
  return new Promise((resolve) => {
    canvas.toBlob((b) => {
      const file = new FileReader();
      file.onload = () => resolve(Buffer.from(file.result));
      file.readAsArrayBuffer(b);
    });
  });
}

export async function expectMatchSnapshot(canvas) {
  const image = await toBuffer(canvas);
  expect(image).toMatchImageSnapshot();
}

export default async function matchChart(config, width = 300, height = 300) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  config.options = Object.assign(
    {
      responsive: false,
      animation: false,
      fontFamily: "'Arial', sans-serif",
      legend: false,
      scales: {
        x: {
          display: false,
        },
        y: {
          display: false,
        },
      },
    },
    config.options || {}
  );
  const ctx = canvas.getContext('2d');

  const t = new Chart(ctx, config);

  await new Promise((resolve) => setTimeout(resolve, 100));

  const image = await toBuffer(canvas);
  expect(image).toMatchImageSnapshot();
}