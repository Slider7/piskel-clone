/* eslint-disable import/prefer-default-export */
export function fixDPI(canvas) { // убирает блюрррр
  const dpi = window.devicePixelRatio;
  const style = {
    height() {
      return +getComputedStyle(canvas).getPropertyValue('height').slice(0, -2);
    },
    width() {
      return +getComputedStyle(canvas).getPropertyValue('width').slice(0, -2);
    },
  };
  canvas.setAttribute('width', style.width() * dpi);
  canvas.setAttribute('height', style.height() * dpi);
}

export function handleContextMenu(event) {
  event.preventDefault();
  return false;
}

export const drawGrid = (ctx, N, cellW) => {
  if (N > 32) return;
  ctx.strokeStyle = '#ddd';
  for (let i = 0.5; i < (N * cellW) + 1; i += cellW) {
    ctx.moveTo(i, 0);
    ctx.lineTo(i, N * cellW);
    ctx.stroke();
    ctx.moveTo(0, i);
    ctx.lineTo(N * cellW, i);
    ctx.stroke();
  }
};

export const drawPoints = (ctx, points, size) => {
  points.forEach((point) => {
    if (point.color !== 'transparent') {
      ctx.fillStyle = point.color;
      ctx.fillRect(point.x * size, point.y * size, size, size);
    } else {
      ctx.clearRect(point.x * size, point.y * size, size, size);
    }
  });
};

export const drawCanvas = (isMainCanvas, ctx, points, size) => {
  const N = points[0].length;
  for (let i = 0; i < N; i += 1) {
    for (let j = 0; j < N; j += 1) {
      ctx.fillStyle = points[i][j];
      ctx.fillRect(i * size, j * size, size, size);
    }
  }
  // if (isMainCanvas) drawGrid(ctx, N, size);
};

export function getNearestSquare(x, y, size) {
  if (x < 0 || y < 0) return null;
  return { x: (Math.trunc(x / size) * size) + 0.5, y: (Math.trunc(y / size) * size) + 0.5 };
}

export function getSquareIndex(x, y, size) {
  if (x < 0 || y < 0) return null;
  return { row: Math.trunc((x + 0.5) / size), col: Math.trunc((y + 0.5) / size) };
}

export function addPixelBySize(pixArr, x, y, penSize, size, color) {
  pixArr.push({ x, y, color });
  for (let i = 0; i < penSize; i += 1) {
    for (let j = 0; j < penSize; j += 1) {
      if (x + i < size && y + j < size) {
        pixArr.push({ x: x + i, y: y + j, color });
      }
    }
  }
}

/* Алгоритм, взятый с http://www.javascriptteacher.com/, добавил размер пикселя и цвет */
export const drawLine = (x1, y1, x2, y2, color, penSize, sideSize) => {
  let x; let y;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const dx1 = Math.abs(dx);
  const dy1 = Math.abs(dy);
  let px; let py; let xe; let ye; let i;
  const points = [];
  // интервалы ошибок
  px = 2 * dy1 - dx1;
  py = 2 * dx1 - dy1;
  // линия сильнее наклонена по Х
  if (dy1 <= dx1) {
    // left to right
    if (dx >= 0) {
      x = x1; y = y1; xe = x2;
    } else { // right to left (перестановка концов)
      x = x2; y = y2; xe = x1;
    }
    addPixelBySize(points, x, y, penSize, sideSize, color);
    // points.push({ x, y, color });
    // Растеризация
    for (i = 0; x < xe; i += 1) {
      x += 1;
      // Октанты
      if (px < 0) {
        px += 2 * dy1;
      } else {
        if ((dx < 0 && dy < 0) || (dx > 0 && dy > 0)) {
          y += 1;
        } else {
          y -= 1;
        }
        px += 2 * (dy1 - dx1);
      }

      // points.push({ x, y, color });
      addPixelBySize(points, x, y, penSize, sideSize, color);
    }
  } else { // линия сильнее наклонена по Y
    // Снизу вверх
    if (dy >= 0) {
      x = x1; y = y1; ye = y2;
    } else { // Сверху вниз, обмен концами.
      x = x2; y = y2; ye = y1;
    }
    // points.push({ x, y, color });
    addPixelBySize(points, x, y, penSize, sideSize, color);
    for (i = 0; y < ye; i += 1) {
      y += 1;
      // Октанты
      if (py <= 0) {
        py += 2 * dx1;
      } else {
        if ((dx < 0 && dy < 0) || (dx > 0 && dy > 0)) {
          x += 1;
        } else {
          x -= 1;
        }
        py += 2 * (dx1 - dy1);
      }
      addPixelBySize(points, x, y, penSize, sideSize, color);
      // points.push({ x, y, color });
    }
  }
  return points;
};

export const drawRect = (x1, y1, x2, y2, color, penSize, sideSize) => {
  const points = [];
  const startX = (x1 < x2) ? x1 : x2;
  const startY = (y1 < y2) ? y1 : y2;
  const endX = (x1 > x2) ? x1 : x2;
  const endY = (y1 > y2) ? y1 : y2;

  for (let i = startX; i <= endX; i += 1) {
    addPixelBySize(points, i, startY, penSize, sideSize, color);
    addPixelBySize(points, i, endY, penSize, sideSize, color);
  }
  for (let i = startY; i <= endY; i += 1) {
    addPixelBySize(points, startX, i, penSize, sideSize, color);
    addPixelBySize(points, endX, i, penSize, sideSize, color);
  }
  return points;
};

/* Алгоритм http://http://members.chello.at/easyfilter/bresenham.html, переписал с C++ на JS и добавил размер пикселя
  рисует отлично для мелкой сетки, на сетке большим шагом есть неточности, поэтому пока не включено в набор */
/*
export const drawEllipse = (x0, y0, x1, y1, color, size) => {
  const points = [];
  let a = Math.abs(x1 - x0);
  const b = Math.abs(y1 - y0);
  let b1 = b % 2;
  let dx = 4 * (1 - a) * b * b;
  let dy = 4 * (b1 + 1) * a * a;
  let err = dx + dy + b1 * a * a;
  let e2;

  if (x0 > x1) { x0 = x1; x1 += a; }
  if (y0 > y1) y0 = y1;
  y0 += (b + 1) / 2;
  y1 = y0 - b1;
  a *= 8 * a;
  b1 = 8 * b * b;

  do {
    points.push({ x: x1, y: y0, color });
    points.push({ x: x0, y: y0, color });
    points.push({ x: x0, y: y1, color });
    points.push({ x: x1, y: y1, color });
    e2 = 2 * err;
    if (e2 <= dy) { y0 += size; y1 -= size; dy += a; err += dy; }
    if (e2 >= dx || 2 * err > dy) { x0 += size; x1 -= size; dx += b1; err += dx; }
  } while (x0 <= x1);

  while (y0 - y1 < b) {
    points.push({ x: x0 - size, y: y0, color });
    points.push({ x: x1 + size, y: y0 += size, color });
    points.push({ x: x0 - size, y: y1, color });
    points.push({ x: x1 + size, y: y1 -= size, color });
  }
  return points;
};
*/

export const drawCircle = (x0, y0, radius, color, penSize, sideSize) => {
  const points = [];
  let x = radius;
  let y = 0;
  let radiusError = 1 - x;
  while (x >= y) {
    addPixelBySize(points, x + x0, y + y0, penSize, sideSize, color);
    addPixelBySize(points, y + x0, x + y0, penSize, sideSize, color);
    addPixelBySize(points, -x + x0, y + y0, penSize, sideSize, color);
    addPixelBySize(points, -y + x0, x + y0, penSize, sideSize, color);
    addPixelBySize(points, -x + x0, -y + y0, penSize, sideSize, color);
    addPixelBySize(points, -y + x0, -x + y0, penSize, sideSize, color);
    addPixelBySize(points, x + x0, -y + y0, penSize, sideSize, color);
    addPixelBySize(points, y + x0, -x + y0, penSize, sideSize, color);
    y += 1;

    if (radiusError < 0) {
      radiusError += 2 * y + 1;
    } else {
      x -= 1;
      radiusError += 2 * (y - x + 1);
    }
  }
  return points;
};

const around = [
  { dx: -1, dy: 0 },
  { dx: 1, dy: 0 },
  { dx: 0, dy: -1 },
  { dx: 0, dy: 1 },
];

/* Алгоритм из книги https://eloquentjavascript.net/19_paint.html, просто добавил пересчет координат */
export function fillArea({ x, y }, color, size, pixels) {
  const { row, col } = getSquareIndex(x, y, size);
  const drawn = [{ x: row, y: col, color }];
  const targetColor = pixels[row][col];
  const sideLength = pixels[0].length;

  for (let i = 0; i < drawn.length; i += 1) {
    // eslint-disable-next-line no-restricted-syntax
    for (const { dx, dy } of around) {
      const x1 = drawn[i].x + dx;
      const y1 = drawn[i].y + dy;
      if (x1 >= 0 && x1 < sideLength && y1 >= 0 && y1 < sideLength
            && !drawn.some(p => p.x === x1 && p.y === y1)
            && pixels[x1][y1] === targetColor) {
        drawn.push({ x: x1, y: y1, color });
      }
    }
  }
  return drawn;
}

export function getMousePos(mouseEvent) {
  const boundingRect = mouseEvent.target.getBoundingClientRect();
  return {
    x: mouseEvent.clientX - boundingRect.left,
    y: mouseEvent.clientY - boundingRect.top,
  };
}
