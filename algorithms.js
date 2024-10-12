const directions = [
  [0, 1],
  [1, 0],
  [0, -1],
  [-1, 0],
];

async function backtracePath(row, col) {
  while (parent[row][col] !== null) {
    drawBacktracePath(row, col);
    await new Promise((resolve) => setTimeout(resolve, parseInt(tickSpeedInput.value)));
    [row, col] = parent[row][col];
  }
}

async function bfs() {
  let queue = [[0, 0]];
  visited = Array(rows)
    .fill()
    .map(() => Array(cols).fill(false));
  parent = Array(rows)
    .fill()
    .map(() => Array(cols).fill(null));
  visited[0][0] = true;

  while (queue.length > 0) {
    let [currentRow, currentCol] = queue.shift();

    if (currentRow === rows - 1 && currentCol === cols - 1) {
      await backtracePath(currentRow, currentCol);
      return; // 도착
    }

    for (let [dRow, dCol] of directions) {
      const newRow = currentRow + dRow;
      const newCol = currentCol + dCol;

      if (
        newRow >= 0 &&
        newRow < rows &&
        newCol >= 0 &&
        newCol < cols &&
        !visited[newRow][newCol] &&
        maze[newRow][newCol] !== -1
      ) {
        visited[newRow][newCol] = true;
        parent[newRow][newCol] = [currentRow, currentCol];
        queue.push([newRow, newCol]);

        drawPath(newRow, newCol);
        await new Promise((resolve) => setTimeout(resolve, parseInt(tickSpeedInput.value)));
      }
    }
  }
}

async function dfs() {
  let stack = [[0, 0]];
  visited = Array(rows)
    .fill()
    .map(() => Array(cols).fill(false));
  parent = Array(rows)
    .fill()
    .map(() => Array(cols).fill(null));
  visited[0][0] = true;

  while (stack.length > 0) {
    let [currentRow, currentCol] = stack.pop();

    if (currentRow === rows - 1 && currentCol === cols - 1) {
      await backtracePath(currentRow, currentCol);
      return; // 도착
    }

    for (let [dRow, dCol] of directions) {
      const newRow = currentRow + dRow;
      const newCol = currentCol + dCol;

      if (
        newRow >= 0 &&
        newRow < rows &&
        newCol >= 0 &&
        newCol < cols &&
        !visited[newRow][newCol] &&
        maze[newRow][newCol] !== -1
      ) {
        visited[newRow][newCol] = true;
        parent[newRow][newCol] = [currentRow, currentCol];
        stack.push([newRow, newCol]);

        drawPath(newRow, newCol);
        await new Promise((resolve) => setTimeout(resolve, parseInt(tickSpeedInput.value)));
      }
    }
  }
}

async function aStar() {
  const directions = [
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0],
  ];
  let openList = [{ row: 0, col: 0, g: 0, h: heuristic(0, 0), f: 0 }];
  visited = Array(rows)
    .fill()
    .map(() => Array(cols).fill(false));
  parent = Array(rows)
    .fill()
    .map(() => Array(cols).fill(null));
  visited[0][0] = true;

  function heuristic(row, col) {
    return Math.abs(row - (rows - 1)) + Math.abs(col - (cols - 1));
  }

  while (openList.length > 0) {
    openList.sort((a, b) => a.f - b.f);
    let current = openList.shift();
    let { row, col, g } = current;

    if (row === rows - 1 && col === cols - 1) {
      await backtracePath(row, col);
      return; // 도착
    }

    for (let [dRow, dCol] of directions) {
      const newRow = row + dRow;
      const newCol = col + dCol;

      if (
        newRow >= 0 &&
        newRow < rows &&
        newCol >= 0 &&
        newCol < cols &&
        !visited[newRow][newCol] &&
        maze[newRow][newCol] !== -1
      ) {
        visited[newRow][newCol] = true;
        parent[newRow][newCol] = [row, col];
        const h = heuristic(newRow, newCol);
        const f = g + 1 + h;
        openList.push({ row: newRow, col: newCol, g: g + 1, h, f });

        drawPath(newRow, newCol);
        await new Promise((resolve) => setTimeout(resolve, parseInt(tickSpeedInput.value)));
      }
    }
  }
}

async function dijkstra() {
  let openList = [{ row: 0, col: 0, dist: 0 }];
  visited = Array(rows)
    .fill()
    .map(() => Array(cols).fill(false));
  parent = Array(rows)
    .fill()
    .map(() => Array(cols).fill(null));
  visited[0][0] = true;

  while (openList.length > 0) {
    openList.sort((a, b) => a.dist - b.dist);
    let current = openList.shift();
    let { row, col, dist } = current;

    if (row === rows - 1 && col === cols - 1) {
      await backtracePath(row, col);
      return; // 도착
    }

    for (let [dRow, dCol] of directions) {
      const newRow = row + dRow;
      const newCol = col + dCol;

      if (
        newRow >= 0 &&
        newRow < rows &&
        newCol >= 0 &&
        newCol < cols &&
        !visited[newRow][newCol] &&
        maze[newRow][newCol] !== -1
      ) {
        visited[newRow][newCol] = true;
        parent[newRow][newCol] = [row, col];
        openList.push({ row: newRow, col: newCol, dist: dist + 1 });

        drawPath(newRow, newCol);
        await new Promise((resolve) => setTimeout(resolve, parseInt(tickSpeedInput.value)));
      }
    }
  }
}

async function greedyBestFirstSearch() {
  let openList = [{ row: 0, col: 0, h: heuristic(0, 0) }];
  visited = Array(rows)
    .fill()
    .map(() => Array(cols).fill(false));
  parent = Array(rows)
    .fill()
    .map(() => Array(cols).fill(null));
  visited[0][0] = true;

  function heuristic(row, col) {
    return Math.abs(row - (rows - 1)) + Math.abs(col - (cols - 1));
  }

  while (openList.length > 0) {
    openList.sort((a, b) => a.h - b.h);
    let current = openList.shift();
    let { row, col } = current;

    if (row === rows - 1 && col === cols - 1) {
      await backtracePath(row, col);
      return; // 도착
    }

    for (let [dRow, dCol] of directions) {
      const newRow = row + dRow;
      const newCol = col + dCol;

      if (
        newRow >= 0 &&
        newRow < rows &&
        newCol >= 0 &&
        newCol < cols &&
        !visited[newRow][newCol] &&
        maze[newRow][newCol] !== -1
      ) {
        visited[newRow][newCol] = true;
        parent[newRow][newCol] = [row, col];
        openList.push({ row: newRow, col: newCol, h: heuristic(newRow, newCol) });

        drawPath(newRow, newCol);
        await new Promise((resolve) => setTimeout(resolve, parseInt(tickSpeedInput.value)));
      }
    }
  }
}

async function bidirectionalSearch() {
  let queueStart = [[0, 0]];
  let queueEnd = [[rows - 1, cols - 1]];

  visitedStart = Array(rows)
    .fill()
    .map(() => Array(cols).fill(false));
  visitedEnd = Array(rows)
    .fill()
    .map(() => Array(cols).fill(false));

  parentStart = Array(rows)
    .fill()
    .map(() => Array(cols).fill(null));
  parentEnd = Array(rows)
    .fill()
    .map(() => Array(cols).fill(null));

  visitedStart[0][0] = true;
  visitedEnd[rows - 1][cols - 1] = true;

  async function reconstructPath(meetingPoint) {
    let [row, col] = meetingPoint;
    while (parentStart[row][col] !== null) {
      drawBacktracePath(row, col);
      await new Promise((resolve) => setTimeout(resolve, parseInt(tickSpeedInput.value)));
      [row, col] = parentStart[row][col];
    }
    [row, col] = meetingPoint;
    while (parentEnd[row][col] !== null) {
      drawBacktracePath(row, col);
      await new Promise((resolve) => setTimeout(resolve, parseInt(tickSpeedInput.value)));
      [row, col] = parentEnd[row][col];
    }
  }

  while (queueStart.length > 0 && queueEnd.length > 0) {
    // 시작점에서 탐색
    let [currentRowStart, currentColStart] = queueStart.shift();
    if (visitedEnd[currentRowStart][currentColStart]) {
      await reconstructPath([currentRowStart, currentColStart]);
      return;
    }

    for (let [dRow, dCol] of directions) {
      const newRow = currentRowStart + dRow;
      const newCol = currentColStart + dCol;

      if (
        newRow >= 0 &&
        newRow < rows &&
        newCol >= 0 &&
        newCol < cols &&
        !visitedStart[newRow][newCol] &&
        maze[newRow][newCol] !== -1
      ) {
        visitedStart[newRow][newCol] = true;
        parentStart[newRow][newCol] = [currentRowStart, currentColStart];
        queueStart.push([newRow, newCol]);

        drawPath(newRow, newCol);
        await new Promise((resolve) => setTimeout(resolve, parseInt(tickSpeedInput.value)));
      }
    }

    // 목표점에서 탐색
    let [currentRowEnd, currentColEnd] = queueEnd.shift();
    if (visitedStart[currentRowEnd][currentColEnd]) {
      await reconstructPath([currentRowEnd, currentColEnd]);
      return;
    }

    for (let [dRow, dCol] of directions) {
      const newRow = currentRowEnd + dRow;
      const newCol = currentColEnd + dCol;

      if (
        newRow >= 0 &&
        newRow < rows &&
        newCol >= 0 &&
        newCol < cols &&
        !visitedEnd[newRow][newCol] &&
        maze[newRow][newCol] !== -1
      ) {
        visitedEnd[newRow][newCol] = true;
        parentEnd[newRow][newCol] = [currentRowEnd, currentColEnd];
        queueEnd.push([newRow, newCol]);

        drawPath(newRow, newCol);
        await new Promise((resolve) => setTimeout(resolve, parseInt(tickSpeedInput.value)));
      }
    }
  }
}

async function thetaStar() {
  let openList = [];
  let closedList = Array(rows)
    .fill()
    .map(() => Array(cols).fill(false));
  parent = Array(rows)
    .fill()
    .map(() => Array(cols).fill(null));
  let gScore = Array(rows)
    .fill()
    .map(() => Array(cols).fill(Infinity));

  function heuristic(row, col) {
    // 유클리드 거리 사용
    return Math.hypot(row - (rows - 1), col - (cols - 1));
  }

  gScore[0][0] = 0;
  openList.push({
    row: 0,
    col: 0,
    g: 0,
    h: heuristic(0, 0),
    f: heuristic(0, 0),
  });

  while (openList.length > 0) {
    openList.sort((a, b) => a.f - b.f || a.h - b.h);
    let current = openList.shift();
    let { row, col, g } = current;

    if (closedList[row][col]) {
      continue;
    }

    closedList[row][col] = true;

    if (row === rows - 1 && col === cols - 1) {
      await backtracePath(row, col);
      return;
    }

    for (let [dRow, dCol] of directions) {
      let newRow = row + dRow;
      let newCol = col + dCol;

      if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols && maze[newRow][newCol] !== -1) {
        let tentativeG = g + 1; // 상하좌우 이동 비용은 1
        if (tentativeG < gScore[newRow][newCol]) {
          gScore[newRow][newCol] = tentativeG;
          parent[newRow][newCol] = [row, col]; // 현재 노드를 부모로 설정
          let h = heuristic(newRow, newCol);
          let f = gScore[newRow][newCol] + h;
          openList.push({
            row: newRow,
            col: newCol,
            g: gScore[newRow][newCol],
            h,
            f,
          });

          drawPath(newRow, newCol);
          await new Promise((resolve) => setTimeout(resolve, parseInt(tickSpeedInput.value)));
        }
      }
    }
  }
}

// 경로 찾기 문제 있음
async function bidirectionalThetaStar() {
  // 시작 지점에서의 탐색 초기화
  let openListStart = [];
  let closedListStart = Array.from({ length: rows }, () => Array(cols).fill(false));
  let gScoreStart = Array.from({ length: rows }, () => Array(cols).fill(Infinity));
  let pathStart = Array.from({ length: rows }, () => Array(cols).fill(null));

  // 목표 지점에서의 탐색 초기화
  let openListGoal = [];
  let closedListGoal = Array.from({ length: rows }, () => Array(cols).fill(false));
  let gScoreGoal = Array.from({ length: rows }, () => Array(cols).fill(Infinity));
  let pathGoal = Array.from({ length: rows }, () => Array(cols).fill(null));

  const parentStart = Array(rows)
    .fill()
    .map(() => Array(cols).fill(null));
  const parentGoal = Array(rows)
    .fill()
    .map(() => Array(cols).fill(null));

  function heuristic(row, col, goalRow, goalCol) {
    // 유클리드 거리 사용
    return Math.hypot(row - goalRow, col - goalCol);
  }

  // 시작 노드 설정
  gScoreStart[0][0] = 0;
  pathStart[0][0] = [[0, 0]]; // 시작 지점부터의 경로
  openListStart.push({
    row: 0,
    col: 0,
    g: 0,
    h: heuristic(0, 0, rows - 1, cols - 1),
    f: heuristic(0, 0, rows - 1, cols - 1),
  });

  // 목표 노드 설정
  gScoreGoal[rows - 1][cols - 1] = 0;
  pathGoal[rows - 1][cols - 1] = [[rows - 1, cols - 1]]; // 목표 지점부터의 경로
  openListGoal.push({
    row: rows - 1,
    col: cols - 1,
    g: 0,
    h: heuristic(rows - 1, cols - 1, 0, 0),
    f: heuristic(rows - 1, cols - 1, 0, 0),
  });

  let meetingPoint = null;

  while (openListStart.length > 0 && openListGoal.length > 0) {
    // 시작 지점에서의 탐색
    openListStart.sort((a, b) => a.f - b.f || a.h - b.h);
    let currentStart = openListStart.shift();
    let { row: rowS, col: colS, g: gS } = currentStart;

    if (closedListStart[rowS][colS]) {
      continue;
    }

    closedListStart[rowS][colS] = true;
    drawPath(rowS, colS); // 시각화
    await new Promise((resolve) => setTimeout(resolve, parseInt(tickSpeedInput.value)));

    // 목표 지점에서 이미 방문한 노드인지 확인
    if (closedListGoal[rowS][colS]) {
      meetingPoint = [rowS, colS];
      break;
    }

    let currentPath = pathStart[rowS][colS]; // 현재 노드까지의 경로
    let parentRowS = currentPath.length > 1 ? currentPath[currentPath.length - 2][0] : rowS;
    let parentColS = currentPath.length > 1 ? currentPath[currentPath.length - 2][1] : colS;

    for (let [dRow, dCol] of directions) {
      let newRow = rowS + dRow;
      let newCol = colS + dCol;

      if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols && maze[newRow][newCol] !== -1) {
        let tentativeG;
        let newPath;

        if (lineOfSight(parentRowS, parentColS, newRow, newCol)) {
          let distanceToParent = Math.hypot(newRow - parentRowS, newCol - parentColS);
          tentativeG = gScoreStart[parentRowS][parentColS] + distanceToParent;
          if (tentativeG < gScoreStart[newRow][newCol]) {
            gScoreStart[newRow][newCol] = tentativeG;
            parentStart[newRow][newCol] = [parentRowS, parentColS];
            newPath = currentPath.slice(0, -1).concat([[newRow, newCol]]);
            let h = heuristic(newRow, newCol, rows - 1, cols - 1);
            let f = gScoreStart[newRow][newCol] + h;
            openListStart.push({
              row: newRow,
              col: newCol,
              g: gScoreStart[newRow][newCol],
              h,
              f,
            });
            pathStart[newRow][newCol] = newPath; // 경로 저장
          }
        } else {
          tentativeG = gS + 1; // 상하좌우 이동 비용은 1
          if (tentativeG < gScoreStart[newRow][newCol]) {
            gScoreStart[newRow][newCol] = tentativeG;
            parentStart[newRow][newCol] = [rowS, colS];
            newPath = currentPath.concat([[newRow, newCol]]);
            let h = heuristic(newRow, newCol, rows - 1, cols - 1);
            let f = gScoreStart[newRow][newCol] + h;
            openListStart.push({
              row: newRow,
              col: newCol,
              g: gScoreStart[newRow][newCol],
              h,
              f,
            });
            pathStart[newRow][newCol] = newPath; // 경로 저장
          }
        }
      }
    }

    // 목표 지점에서의 탐색
    openListGoal.sort((a, b) => a.f - b.f || a.h - b.h);
    let currentGoal = openListGoal.shift();
    let { row: rowG, col: colG, g: gG } = currentGoal;

    if (closedListGoal[rowG][colG]) {
      continue;
    }

    closedListGoal[rowG][colG] = true;
    drawPath(rowG, colG); // 시각화
    await new Promise((resolve) => setTimeout(resolve, parseInt(tickSpeedInput.value)));

    // 시작 지점에서 이미 방문한 노드인지 확인
    if (closedListStart[rowG][colG]) {
      meetingPoint = [rowG, colG];
      break;
    }

    let currentPathG = pathGoal[rowG][colG]; // 현재 노드까지의 경로
    let parentRowG = currentPathG.length > 1 ? currentPathG[currentPathG.length - 2][0] : rowG;
    let parentColG = currentPathG.length > 1 ? currentPathG[currentPathG.length - 2][1] : colG;

    for (let [dRow, dCol] of directions) {
      let newRow = rowG + dRow;
      let newCol = colG + dCol;

      if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols && maze[newRow][newCol] !== -1) {
        let tentativeG;
        let newPathG;

        if (lineOfSight(parentRowG, parentColG, newRow, newCol)) {
          let distanceToParent = Math.hypot(newRow - parentRowG, newCol - parentColG);
          tentativeG = gScoreGoal[parentRowG][parentColG] + distanceToParent;
          if (tentativeG < gScoreGoal[newRow][newCol]) {
            gScoreGoal[newRow][newCol] = tentativeG;
            parentGoal[newRow][newCol] = [parentRowG, parentColG];
            newPathG = currentPathG.slice(0, -1).concat([[newRow, newCol]]);
            let h = heuristic(newRow, newCol, 0, 0);
            let f = gScoreGoal[newRow][newCol] + h;
            openListGoal.push({
              row: newRow,
              col: newCol,
              g: gScoreGoal[newRow][newCol],
              h,
              f,
            });
            pathGoal[newRow][newCol] = newPathG; // 경로 저장
          }
        } else {
          tentativeG = gG + 1; // 상하좌우 이동 비용은 1
          if (tentativeG < gScoreGoal[newRow][newCol]) {
            gScoreGoal[newRow][newCol] = tentativeG;
            parentGoal[newRow][newCol] = [rowG, colG];
            newPathG = currentPathG.concat([[newRow, newCol]]);
            let h = heuristic(newRow, newCol, 0, 0);
            let f = gScoreGoal[newRow][newCol] + h;
            openListGoal.push({
              row: newRow,
              col: newCol,
              g: gScoreGoal[newRow][newCol],
              h,
              f,
            });
            pathGoal[newRow][newCol] = newPathG; // 경로 저장
          }
        }
      }
    }
  }

  async function reconstructPath(meetingPoint) {
    let [row, col] = meetingPoint;
    let path = pathStart[row][col].concat(pathGoal[row][col].slice(1).reverse());
    console.log(path);
    for (let [row, col] of path) {
      drawBacktracePath(row, col);
      await new Promise((resolve) => setTimeout(resolve, parseInt(tickSpeedInput.value)));
    }
  }

  if (meetingPoint) {
    await reconstructPath(meetingPoint);
  } else {
    console.log("경로를 찾을 수 없습니다.");
  }
}

async function virusSearch() {
  const pathCandidateCells = [];
  for (let row = 0; row < maze.length; row++) {
    for (let col = 0; col < maze[row].length; col++) {
      if (maze[row][col] === 0) {
        const weight = 1 / Math.max(Math.abs(rows * col - cols * row) / (rows ** 2 + cols ** 2), 0.01);
        pathCandidateCells.push({
          row,
          col,
          weight,
        });
      }
    }
  }

  const totalCells = rows * cols;
  const wallCells = totalCells - pathCandidateCells.length;
  const pickNum = Math.floor(wallCells / 24);
  const cellpaths = {};

  function addCellPath(row, col) {
    const id = `${row},${col}`;
    const cellPath = {
      id,
      row,
      col,
      meetedPathIds: new Set(),
    };
    cellpaths[id] = cellPath;
    return cellPath;
  }

  function checkAllConnected() {
    const cellPathIds = Object.keys(cellpaths);
    if (cellPathIds.length === 0) return true;

    const startPath = cellpaths[cellPathIds[0]];
    const stack = [startPath];
    const visited = new Set([startPath.id]);

    while (stack.length > 0) {
      const curPath = stack.pop();
      for (const pathId of curPath.meetedPathIds) {
        if (!visited.has(pathId)) {
          visited.add(pathId);
          stack.push(cellpaths[pathId]);
        }
      }
    }

    return visited.size === cellPathIds.length;
  }

  for (let i = 0; i < pickNum; i++) {
    const pickedCell = pickRandomElementWithWeight(pathCandidateCells);
    const index = pathCandidateCells.findIndex((cell) => cell.row === pickedCell.row && cell.col === pickedCell.col);
    pathCandidateCells.splice(index, 1);

    const { row, col } = pickedCell;
    addCellPath(row, col);
  }

  const startPath = addCellPath(0, 0);
  const endPath = addCellPath(rows - 1, cols - 1);

  const visitedCell = Array.from({ length: rows }, () => Array(cols).fill(null));
  const parents = Array.from({ length: rows }, () => Array.from({ length: cols }, () => new Set()));

  for (const cellpath of Object.values(cellpaths)) {
    visitedCell[cellpath.row][cellpath.col] = cellpath;
  }

  const cellList = Object.values(cellpaths).map(({ row, col }) => [row, col]);
  while (cellList.length > 0) {
    const cell = cellList.shift();
    const [row, col] = cell;

    const cellPath = visitedCell[row][col];
    if (!cellPath) {
      console.error(`cellpath isn't allocated at ${row}, ${col}`);
      return;
    }
    const pathId = cellPath.id;

    drawPath(row, col);
    await new Promise((resolve) => setTimeout(resolve, parseInt(tickSpeedInput.value)));

    let meetedPathId = null;
    for (const [dRow, dCol] of directions) {
      const newRow = row + dRow;
      const newCol = col + dCol;
      if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols && maze[newRow][newCol] !== -1) {
        if (!visitedCell[newRow][newCol]) {
          cellList.push([newRow, newCol]);
          visitedCell[newRow][newCol] = cellPath;
          parents[newRow][newCol].add(`${row},${col}`);
          // memo[newRow][newCol] = `${pathId}\n(${Array.from(parents[newRow][newCol]).join(", ")})`;
        } else if (
          visitedCell[newRow][newCol] !== cellPath &&
          !cellPath.meetedPathIds.has(visitedCell[newRow][newCol].id)
        ) {
          meetedPathId = visitedCell[newRow][newCol].id;

          // console.log(`meet (${row}, ${col}) -> (${newRow}, ${newCol}), ${meetedPathId}`);
          cellPath.meetedPathIds.add(meetedPathId);
          parents[newRow][newCol].add(`${row},${col}`);
          visitedCell[newRow][newCol].meetedPathIds.add(pathId);

          drawPath(newRow, newCol);
          await new Promise((resolve) => setTimeout(resolve, parseInt(tickSpeedInput.value)));
        }
      }
    }

    if (meetedPathId && checkAllConnected()) {
      console.log(`Found early exit at ${row}, ${col}`);
      break;
    }
  }

  if (!checkAllConnected()) {
    console.log("No path found");
    return;
  }

  const bidirectionalParents = Array.from({ length: rows }, () => Array.from({ length: cols }, () => new Set()));

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const pSet = parents[row][col];
      if (pSet.size === 0) continue;
      for (const p of pSet) {
        const [parentRow, parentCol] = p.split(",").map(Number);
        bidirectionalParents[row][col].add(`${parentRow},${parentCol}`);
        bidirectionalParents[parentRow][parentCol].add(`${row},${col}`);
      }
    }
  }

  const cellQueue = [[rows - 1, cols - 1]];
  const visited2 = Array.from({ length: rows }, () => Array(cols).fill(false));
  const parent2 = Array.from({ length: rows }, () => Array(cols).fill(null));

  while (cellQueue.length > 0) {
    const [row, col] = cellQueue.shift();
    if (visited2[row][col]) continue;
    visited2[row][col] = true;
    for (const p of bidirectionalParents[row][col]) {
      const [parentRow, parentCol] = p.split(",").map(Number);
      if (visited2[parentRow][parentCol]) continue;
      parent2[parentRow][parentCol] = [row, col];
      cellQueue.push([parentRow, parentCol]);
    }
  }

  let [row, col] = [0, 0];
  while (parent2[row][col]) {
    drawBacktracePath(row, col);
    await new Promise((resolve) => setTimeout(resolve, parseInt(tickSpeedInput.value)));
    [row, col] = parent2[row][col];
  }
}
