/* eslint-disable no-param-reassign */
/* eslint-disable import/prefer-default-export */

const copyArray = (sourceArray) => {
  const newArray = sourceArray.map(arr => arr.slice());
  return newArray;
};

export const createImageData = () => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const result = ctx.createImageData(96, 96);
  return result;
};

export const getIndexById = (id, frames) => {
  const frId = parseInt(id, 10);
  const lookFrame = frames.filter(frame => frame.id === frId);
  return frames.indexOf(lookFrame[0]);
};

export const resetFramesId = (frames) => {
  for (let i = 0; i < frames.length; i += 1) {
    // eslint-disable-next-line no-param-reassign
    frames[i].id = i;
  }
};

export const moveFrame = (upDown, frames, pixels, idx) => {
  if (upDown === 'up' && idx > 0) {
    const prevFrame = frames[idx - 1];
    frames[idx - 1] = frames[idx];
    frames[idx] = prevFrame;

    const pxPrev = copyArray(pixels[idx - 1]);
    pixels[idx - 1] = copyArray(pixels[idx]);
    pixels[idx] = copyArray(pxPrev);
    idx -= 1;
  } else if (idx < frames.length - 1 && upDown === 'down') {
    const nextFrame = frames[idx + 1];
    frames[idx + 1] = frames[idx];
    frames[idx] = nextFrame;

    const pxNext = copyArray(pixels[idx + 1]);
    pixels[idx + 1] = copyArray(pixels[idx]);
    pixels[idx] = copyArray(pxNext);
    idx += 1;
  }
  return idx;
};

export const createPixelsArray = (size) => {
  const pixels = Array.from(Array(size), () => new Array(size));
  for (let i = 0; i < size; i += 1) {
    for (let j = 0; j < size; j += 1) {
      pixels[i][j] = 'transparent';
    }
  }
  return pixels;
};

export function getSettings() {
  if (typeof localStorage.piskelSettings !== 'undefined') {
    return JSON.parse(localStorage.piskelSettings);
  }
  return null;
}

export function download(filename, data) {
  const jsonData = JSON.stringify(data);
  const element = document.createElement('a');
  element.setAttribute('href', `data:text/plain;charset=utf-8, ${encodeURIComponent(jsonData)}`);
  element.setAttribute('download', filename);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}


export function downloadAll(filename, data) {
  const element = document.createElement('a');
  data.forEach((item) => {
    element.setAttribute('href', item.imgURL);
    element.setAttribute('download', `${filename + item.id}.png`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
  });
  document.body.removeChild(element);
}

export function saveSettings(state) {
  localStorage.setItem('piskelSettings', JSON.stringify(state));
}
