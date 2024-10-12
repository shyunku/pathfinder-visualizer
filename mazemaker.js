function generateMaze() {
  // 미로 초기화: 모든 셀을 길(0)로 설정
  maze = Array(rows)
    .fill()
    .map(() => Array(cols).fill(0));

  // 재귀적 분할 시작
  divide(0, 0, cols - 1, rows - 1);

  // 시작점과 끝점 설정
  maze[0][0] = 1; // 시작점
  maze[rows - 1][cols - 1] = 2; // 종료점

  // 미로 그리기
  drawMaze();
}

function generateEmptyMaze() {
  maze = Array(rows)
    .fill()
    .map(() => Array(cols).fill(0));

  maze[0][0] = 1;
  maze[rows - 1][cols - 1] = 2;

  drawMaze();
}

function divide(x1, y1, x2, y2, parentHoles = []) {
  const holes = [...parentHoles];

  const width = x2 - x1 + 1;
  const height = y2 - y1 + 1;

  // console.log(`==== (${x1}, ${y1}) to (${x2}, ${y2}) ====`);

  if (width <= 1 || height <= 1) return;

  let horizontal = width < height;
  if (width === height) {
    horizontal = Math.random() < 0.5;
  }

  // if (horizontal && height <= 5) return;
  // if (!horizontal && width <= 5) return;

  const xCandidates = Array(width)
    .fill()
    .map((_, i) => x1 + i);
  const yCandidates = Array(height)
    .fill()
    .map((_, i) => y1 + i);

  if (horizontal) {
    // horizontal
    const nonHoleYCandidates = yCandidates.filter(
      (y) =>
        y !== y1 &&
        y !== y2 &&
        !holes.some(
          (hole) => !hole.horizontal && hole.y === y && (Math.abs(hole.x - x1) <= 1 || Math.abs(hole.x - x2) <= 1)
        )
    );
    if (nonHoleYCandidates.length === 0) return;
    const divY = nonHoleYCandidates[Math.floor(Math.random() * nonHoleYCandidates.length)];
    const holeX = xCandidates[Math.floor(Math.random() * xCandidates.length)];
    // console.log(`Dividing horizontally at ${divY}, hole at ${holeX}`);

    for (let x = x1; x <= x2; x++) {
      if (x !== holeX) {
        maze[divY][x] = -1;
      } else {
        holes.push({ horizontal: true, x, y: divY });
        // maze[divY][x] = -2;
      }
    }

    divide(x1, y1, x2, divY - 1, holes);
    divide(x1, divY + 1, x2, y2, holes);
  } else {
    // vertical
    const nonHoleXCandidates = xCandidates.filter(
      (x) =>
        x !== x1 &&
        x !== x2 &&
        !holes.some(
          (hole) => hole.horizontal && hole.x === x && (Math.abs(hole.y - y1) <= 1 || Math.abs(hole.y - y2) <= 1)
        )
    );
    if (nonHoleXCandidates.length === 0) return;
    const divX = nonHoleXCandidates[Math.floor(Math.random() * nonHoleXCandidates.length)];
    const holeY = yCandidates[Math.floor(Math.random() * yCandidates.length)];
    // console.log(`Dividing vertically at ${divX}, hole at ${holeY}`);

    for (let y = y1; y <= y2; y++) {
      if (y !== holeY) {
        maze[y][divX] = -1;
      } else {
        holes.push({ horizontal: false, x: divX, y });
        // maze[y][divX] = -3;
      }
    }

    divide(x1, y1, divX - 1, y2, holes);
    divide(divX + 1, y1, x2, y2, holes);
  }
}

// 미로 그리기 함수
function drawMaze() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      let skip = false;
      switch (maze[row][col]) {
        case 1:
          ctx.fillStyle = "blue"; // 시작점
          break;
        case 2:
          ctx.fillStyle = "red"; // 종료점
          break;
        case 3:
          ctx.fillStyle = "#FFD894"; // finding
          break;
        case 4:
          ctx.fillStyle = "#1CE55F"; // backtrace
          break;
        case -1:
          ctx.fillStyle = "#555"; // 벽
          break;
        case -2:
          ctx.fillStyle = "green"; // test
          break;
        case -3:
          ctx.fillStyle = "purple"; // test
          break;
        default:
          skip = true;
          ctx.fillStyle = "white"; // 통로
      }
      if (skip) continue;
      ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
      // ctx.strokeRect(col * cellSize, row * cellSize, cellSize, cellSize);
    }
  }
}

function clearPaths() {
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (maze[row][col] === 3 || maze[row][col] === 4) {
        maze[row][col] = 0;
      }
    }
  }
  maze[0][0] = 1;
  maze[rows - 1][cols - 1] = 2;
  parent = Array(rows)
    .fill()
    .map(() => Array(cols).fill(null));
  drawMaze();
}

function drawBacktracePath(row, col) {
  if (maze[row][col] === 1 || maze[row][col] === 2 || maze[row][col] === -1) return;
  maze[row][col] = 4;
  drawMaze();
}

function drawPath(row, col) {
  if (maze[row][col] === 1 || maze[row][col] === 2 || maze[row][col] === -1) return;
  maze[row][col] = 3;
  drawMaze();
}
