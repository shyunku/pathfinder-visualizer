function interpolate(x0, y0, x1, y1) {
  let path = [];
  let dx = Math.abs(x1 - x0);
  let dy = Math.abs(y1 - y0);
  let sx = x0 < x1 ? 1 : -1;
  let sy = y0 < y1 ? 1 : -1;
  let err = dx - dy;

  while (x0 !== x1 || y0 !== y1) {
    let e2 = 2 * err;
    if (e2 > -dy) {
      err -= dy;
      x0 += sx;
    }
    if (e2 < dx) {
      err += dx;
      y0 += sy;
    }
    path.push([x0, y0]);
  }
  return path;
}

function manhattanPath(x0, y0, x1, y1) {
  let path = [];
  let x = x0;
  let y = y0;

  while (x !== x1 || y !== y1) {
    if (x < x1) {
      x++;
    } else if (x > x1) {
      x--;
    } else if (y < y1) {
      y++;
    } else if (y > y1) {
      y--;
    }
    path.push([x, y]);
  }
  return path;
}

function lineOfSight(sx, sy, ex, ey) {
  // Bresenham의 선 알고리즘 구현
  let x0 = sx;
  let y0 = sy;
  let x1 = ex;
  let y1 = ey;
  let dx = Math.abs(x1 - x0);
  let dy = Math.abs(y1 - y0);
  let sxStep = x0 < x1 ? 1 : -1;
  let syStep = y0 < y1 ? 1 : -1;
  let err = dx - dy;

  while (true) {
    if (maze[x0][y0] === -1) return false;
    if (x0 === x1 && y0 === y1) break;
    let e2 = 2 * err;
    if (e2 > -dy) {
      err -= dy;
      x0 += sxStep;
    }
    if (e2 < dx) {
      err += dx;
      y0 += syStep;
    }
  }
  return true;
}

function pickRandomElementWithWeight(arr) {
  const weightSum = arr.reduce((acc, cur) => acc + cur.weight, 0);
  if (weightSum === 0) return arr[Math.floor(Math.random() * arr.length)];
  const randomValue = Math.random() * weightSum;
  let sum = 0;
  for (let i = 0; i < arr.length; i++) {
    sum += arr[i].weight;
    if (randomValue < sum) return arr[i];
  }

  return arr[arr.length - 1];
}

function pickRandomWithWeights(arr, weights) {
  if (arr.length !== weights.length) throw new Error("arr and weights must have the same length");
  const weightSum = weights.reduce((acc, cur) => acc + cur, 0);
  if (weightSum === 0) return arr[Math.floor(Math.random() * arr.length)];
  const randomValue = Math.random() * weightSum;
  let sum = 0;
  for (let i = 0; i < arr.length; i++) {
    sum += weights[i];
    if (randomValue < sum) return arr[i];
  }

  return arr[arr.length - 1];
}

function pickRandom(raw) {
  let arr = raw;
  if (raw instanceof Set) {
    arr = Array.from(raw);
  }
  return arr[Math.floor(Math.random() * arr.length)];
}

function distance([x0, y0], [x1, y1]) {
  return Math.abs(x1 - x0) + Math.abs(y1 - y0);
}
