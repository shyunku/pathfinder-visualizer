async function test() {
  const pathCandidateCells = new Set();
  for (let row in maze) {
    const cols = maze[row];
    for (let col in cols) {
      if (maze[row][col] === 0) {
        pathCandidateCells.add([parseInt(row), parseInt(col)]);
      }
    }
  }

  const pickNum = Math.floor((rows * cols - pathCandidateCells.size) / 20);
  const cellpaths = {};

  function addCellPath(row, col) {
    const id = `${row}-${col}`;
    const cellPath = {
      id,
      row,
      col,
      meetedPathIds: new Set(),
      closed: false,
      parent: null,
    };
    cellpaths[id] = cellPath;
    return cellPath;
  }

  function checkAllConnected() {
    const curPath = cellpaths[Object.keys(cellpaths)[0]];
    const stack = [curPath];
    const visited = new Set();
    const parent0 = {};
    visited.add(curPath.id);

    while (stack.length > 0) {
      const curPath = stack.pop();
      for (const pathId of curPath.meetedPathIds.values()) {
        if (!visited.has(pathId)) {
          visited.add(pathId);
          stack.push(cellpaths[pathId]);
          parent0[pathId] = curPath.id;
        }
      }
    }

    return visited.size === Object.keys(cellpaths).length;
  }

  for (let i = 0; i < pickNum; i++) {
    const [row, col] = pickRandom(pathCandidateCells);
    pathCandidateCells.delete([row, col]);
    addCellPath(row, col);
  }

  const startPath = addCellPath(0, 0);
  const endPath = addCellPath(rows - 1, cols - 1);

  const visitedCell = Array(rows)
    .fill()
    .map(() => Array(cols).fill(null));
  const parents = Array(rows)
    .fill()
    .map(() =>
      Array(cols)
        .fill(null)
        .map(() => new Set())
    );

  for (let cellpath of Object.values(cellpaths)) {
    visitedCell[cellpath.row][cellpath.col] = cellpath;
  }

  const cellPathList = Object.values(cellpaths);
  const initialCellList = cellPathList.slice().map((cellPath) => [cellPath.row, cellPath.col]);
  while (initialCellList.length > 0) {
    const cell = initialCellList.shift();
    const [row, col] = cell;
    const cellPath = visitedCell[row][col];
    if (cellPath === null) {
      console.error(`cellpath isn't allocated at ${row}, ${col}`);
      return;
    }
    const pathId = visitedCell[row][col].id;

    drawPath(row, col);
    await new Promise((resolve) => setTimeout(resolve, parseInt(tickSpeedInput.value)));

    let foundPath = false;
    let meetedPathId = null;
    for (const [dRow, dCol] of directions) {
      const newRow = row + dRow;
      const newCol = col + dCol;
      if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols && maze[newRow][newCol] !== -1) {
        if (visitedCell[newRow][newCol] === null) {
          initialCellList.push([newRow, newCol]);
          visitedCell[newRow][newCol] = cellPath;
          parents[newRow][newCol].add(JSON.stringify([row, col]));
          // memo[newRow][newCol] = pathId;
          foundPath = true;
        } else if (
          visitedCell[newRow][newCol] !== cellPath &&
          !cellPath.meetedPathIds.has(visitedCell[newRow][newCol].id)
        ) {
          meetedPathId = visitedCell[newRow][newCol].id;

          // console.log(`meet (${row}, ${col}) -> (${newRow}, ${newCol}), ${meetedPathId}`);
          cellPath.meetedPathIds.add(meetedPathId);
          parents[newRow][newCol].add(JSON.stringify([row, col]));
          visitedCell[newRow][newCol].meetedPathIds.add(pathId);

          drawPath(newRow, newCol);
          await new Promise((resolve) => setTimeout(resolve, parseInt(tickSpeedInput.value)));
        }
      }
    }

    // if (!foundPath) {
    //   cellPath.closed = true;
    //   cellPathList.splice(cellPathList.indexOf(cellPath), 1);
    // } else {
    //   drawPath(cellPath.row, cellPath.col);
    //   await new Promise((resolve) => setTimeout(resolve, parseInt(tickSpeedInput.value)));
    // }

    // check if all cell path connected
    if (meetedPathId !== null && checkAllConnected()) {
      console.log(`Found early exit at ${row}, ${col}`);
      break;
    }
  }

  if (!checkAllConnected()) {
    console.log("No path found");
    return;
  }

  // set parent trace
  const curPath = startPath;
  const bidirectionalParents = Array(rows)
    .fill()
    .map(() =>
      Array(cols)
        .fill()
        .map(() => new Set())
    );

  // console.log("parents", parents);

  for (let row in parents) {
    for (let col in parents[row]) {
      const pSet = parents[row][col];
      if (pSet.size === 0) continue;
      for (const p of Array.from(pSet)) {
        const [parentRow, parentCol] = JSON.parse(p);
        row = parseInt(row);
        col = parseInt(col);
        bidirectionalParents[row][col].add(JSON.stringify([parentRow, parentCol]));
        bidirectionalParents[parentRow][parentCol].add(JSON.stringify([row, col]));
      }
    }
  }

  // console.log("bidirectionalParents", bidirectionalParents);

  const traceCell = [rows - 1, cols - 1];
  const cellQueue = [traceCell];
  const visited2 = Array(rows)
    .fill()
    .map(() => Array(cols).fill(false));
  const parent2 = Array(rows)
    .fill()
    .map(() => Array(cols).fill(null));

  // visited2[rows - 1][cols - 1] = true;

  while (cellQueue.length > 0) {
    const [row, col] = cellQueue.shift();
    if (visited2[row][col]) {
      continue;
    }
    visited2[row][col] = true;
    for (const json of bidirectionalParents[row][col].values()) {
      const [parentRow, parentCol] = JSON.parse(json);
      if (visited2[parentRow][parentCol]) continue;
      parent2[parentRow][parentCol] = [row, col];
      // console.log(`[${row}, ${col}] -> [${parentRow}, ${parentCol}]`);
      cellQueue.push([parentRow, parentCol]);
    }
  }

  // console.log("visited2", visited2);
  // console.log("parent2", parent2);

  // backtrace
  let [row, col] = [0, 0];
  while (parent2[row][col] !== null) {
    drawBacktracePath(row, col);
    await new Promise((resolve) => setTimeout(resolve, parseInt(tickSpeedInput.value)));
    [row, col] = parent2[row][col];
  }
}
