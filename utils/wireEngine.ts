// Wire Master - Core Game Engine

import { Grid, CellData, Wire, CellState, Coordinate, WireColor } from '../types';
import { getDifficultyForLevel, getGeneratorConfig } from '../constants';
import { levelCache } from './levelCache';

/**
 * Initialize an empty grid
 */
export const createEmptyGrid = (rows: number, cols?: number): Grid => {
  const numCols = cols || rows; // If cols not provided, create square grid
  const grid: Grid = [];
  for (let row = 0; row < rows; row++) {
    const gridRow: (CellData | null)[] = [];
    for (let col = 0; col < numCols; col++) {
      gridRow.push({
        row,
        col,
        state: CellState.EMPTY,
        color: null,
        wireId: null,
        isPort: false,
      });
    }
    grid.push(gridRow);
  }
  return grid;
};

/**
 * Load level - NOW GENERATES DYNAMICALLY
 */
export const loadLevel = async (levelId: number): Promise<{ grid: Grid; wires: Wire[]; solution?: Coordinate[][] }> => {
  // Get difficulty for this level
  const difficulty = getDifficultyForLevel(levelId);

  // Get level from cache (or generate new one)
  const levelData = await levelCache.getLevel(difficulty, levelId);

  // Support both square and rectangular grids
  const rows = levelData.config.rows || levelData.config.size;
  const cols = levelData.config.cols || levelData.config.size;
  const grid = createEmptyGrid(rows, cols);
  const wires: Wire[] = [];

  // Place obstacles (if any)
  if (levelData.obstacles) {
    levelData.obstacles.forEach(obstacle => {
      const cell = grid[obstacle.row][obstacle.col];
      if (cell) {
        cell.state = CellState.OBSTACLE;
        cell.isObstacle = true;
        cell.color = null;
        cell.wireId = null;
        cell.isPort = false;
      }
    });
  }

  // FREEDOM: Player can use any cell - no restrictions
  // We trust the Hamiltonian path generation to create solvable puzzles
  // Player has full freedom to find their own solution
  const totalCells = rows * cols;
  console.log(`[LoadLevel ${levelId}] Grid=${cols}x${rows} (${totalCells} cells), Wires=${levelData.wires.length}, Freedom=FULL`);

  // Place ports (endpoints) on grid
  levelData.wires.forEach((wireData, index) => {
    const wireId = `wire-${index}`;

    // Start port
    const startCell = grid[wireData.start.row][wireData.start.col];
    if (startCell) {
      startCell.state = CellState.ENDPOINT;
      startCell.color = wireData.color;
      startCell.wireId = wireId;
      startCell.isPort = true;
    }

    // End port
    const endCell = grid[wireData.end.row][wireData.end.col];
    if (endCell) {
      endCell.state = CellState.ENDPOINT;
      endCell.color = wireData.color;
      endCell.wireId = wireId;
      endCell.isPort = true;
    }

    // Create wire object with required path length from solution
    const requiredPathLength = levelData.solution && levelData.solution[index]
      ? levelData.solution[index].length
      : undefined;

    wires.push({
      id: wireId,
      color: wireData.color,
      start: wireData.start,
      end: wireData.end,
      path: [],
      isComplete: false,
      requiredPathLength, // Set required path length for 100% fill validation
    });
  });

  return {
    grid,
    wires,
    solution: levelData.solution // Pass solution for hints
  };
};

/**
 * Check if two coordinates are adjacent (up, down, left, right)
 */
export const areAdjacent = (a: Coordinate, b: Coordinate): boolean => {
  const rowDiff = Math.abs(a.row - b.row);
  const colDiff = Math.abs(a.col - b.col);
  return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1);
};

/**
 * Check if coordinate is valid for given grid
 */
export const isValidCoordinate = (coord: Coordinate, gridSize: number): boolean => {
  return coord.row >= 0 && coord.row < gridSize && coord.col >= 0 && coord.col < gridSize;
};

/**
 * Get cell at coordinate
 */
export const getCell = (grid: Grid, coord: Coordinate): CellData | null => {
  if (!isValidCoordinate(coord, grid.length)) return null;
  return grid[coord.row][coord.col];
};

/**
 * Check if a move is valid when drawing a path
 */
export const isValidMove = (
  grid: Grid,
  from: Coordinate,
  to: Coordinate,
  wireId: string
): boolean => {
  // Must be adjacent
  if (!areAdjacent(from, to)) return false;

  const toCell = getCell(grid, to);
  if (!toCell) return false;

  // Cannot move to obstacles
  if (toCell.state === CellState.OBSTACLE || toCell.isObstacle) {
    return false;
  }

  // FREEDOM: No cell restrictions - player can use any empty cell
  // This gives player full freedom to find creative solutions

  // Can move to:
  // 1. Empty cell (that is allowed)
  // 2. Port of the same wire
  // 3. Path cell of the same wire (for backtracking)

  if (toCell.state === CellState.EMPTY) {
    return true;
  }

  if (toCell.wireId === wireId) {
    return true;
  }

  return false;
};

/**
 * Calculate grid filled percentage (how much of grid is filled)
 * Excludes obstacles from calculation
 */
export const calculateGridFilled = (grid: Grid): number => {
  let totalCells = 0;
  let filledCells = 0;

  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; col++) {
      const cell = grid[row][col];
      if (cell) {
        // Skip obstacles - they don't count towards total or filled
        if (cell.state === CellState.OBSTACLE || cell.isObstacle) {
          continue;
        }

        totalCells++;
        if (cell.state !== CellState.EMPTY) {
          filledCells++;
        }
      }
    }
  }

  return totalCells > 0 ? Math.round((filledCells / totalCells) * 100) : 0;
};

/**
 * Check if all wires are complete
 */
export const areAllWiresComplete = (wires: Wire[]): boolean => {
  return wires.every(wire => wire.isComplete);
};

/**
 * Check win condition: all wires complete AND entire grid must be filled
 * CRITICAL REQUIREMENT: Player must fill 100% of the grid to complete level
 */
export const checkWinCondition = (grid: Grid, wires: Wire[]): boolean => {
  // First check: all wires must be complete
  if (!areAllWiresComplete(wires)) {
    return false;
  }

  // Second check: ENTIRE grid must be filled (100%)
  // This is the ONLY requirement - player must fill all cells
  const gridFilled = calculateGridFilled(grid);
  return gridFilled === 100;
};

/**
 * Clear a wire's path from the grid
 */
export const clearWirePath = (grid: Grid, wire: Wire): Grid => {
  const newGrid = grid.map(row => row.map(cell => (cell ? { ...cell } : null)));

  // Keep ports, clear path cells
  for (let row = 0; row < newGrid.length; row++) {
    for (let col = 0; col < newGrid[row].length; col++) {
      const cell = newGrid[row][col];
      if (cell && cell.wireId === wire.id && !cell.isPort) {
        cell.state = CellState.EMPTY;
        cell.color = null;
        cell.wireId = null;
        cell.connectedTo = undefined;
      }
    }
  }

  return newGrid;
};

/**
 * Set a path on the grid
 */
export const setWirePath = (
  grid: Grid,
  wire: Wire,
  path: Coordinate[]
): { grid: Grid; wire: Wire } => {
  const newGrid = grid.map(row => row.map(cell => (cell ? { ...cell } : null)));

  // Set path cells
  path.forEach((coord, index) => {
    const cell = newGrid[coord.row][coord.col];
    if (!cell) return;

    // Skip if it's a port (already set)
    if (cell.isPort) return;

    // CRITICAL: Check if cell is already occupied by another wire
    // This should NEVER happen with Hamiltonian path, but validate just in case
    if (cell.state === CellState.PATH && cell.wireId !== wire.id) {
      console.error(`[setWirePath] CONFLICT: Cell (${coord.row},${coord.col}) already occupied by ${cell.wireId}, trying to set ${wire.id}`);
      // Don't overwrite! This indicates a bug in level generation
      return;
    }

    cell.state = CellState.PATH;
    cell.color = wire.color;
    cell.wireId = wire.id;

    // Set connection to next cell
    if (index < path.length - 1) {
      cell.connectedTo = path[index + 1];
    }
  });

  // Check if wire is complete (path connects start to end)
  const startsAtStart = path.length > 0 && path[0].row === wire.start.row && path[0].col === wire.start.col;
  const endsAtEnd = path.length > 0 && path[path.length - 1].row === wire.end.row && path[path.length - 1].col === wire.end.col;
  const startsAtEnd = path.length > 0 && path[0].row === wire.end.row && path[0].col === wire.end.col;
  const endsAtStart = path.length > 0 && path[path.length - 1].row === wire.start.row && path[path.length - 1].col === wire.start.col;

  const isComplete = (startsAtStart && endsAtEnd) || (startsAtEnd && endsAtStart);

  const newWire: Wire = {
    ...wire,
    path,
    isComplete,
  };

  return { grid: newGrid, wire: newWire };
};

/**
 * Find path between two ports using BFS (for hints)
 */
export const findPathBFS = (
  grid: Grid,
  start: Coordinate,
  end: Coordinate,
  wireId: string
): Coordinate[] | null => {
  const queue: { coord: Coordinate; path: Coordinate[] }[] = [
    { coord: start, path: [start] },
  ];
  const visited = new Set<string>();
  visited.add(`${start.row}-${start.col}`);

  const directions = [
    { row: -1, col: 0 }, // up
    { row: 1, col: 0 },  // down
    { row: 0, col: -1 }, // left
    { row: 0, col: 1 },  // right
  ];

  while (queue.length > 0) {
    const current = queue.shift();
    if (!current) continue;

    // Found the end
    if (current.coord.row === end.row && current.coord.col === end.col) {
      return current.path;
    }

    // Try all directions
    for (const dir of directions) {
      const nextCoord: Coordinate = {
        row: current.coord.row + dir.row,
        col: current.coord.col + dir.col,
      };

      const key = `${nextCoord.row}-${nextCoord.col}`;
      if (visited.has(key)) continue;

      const cell = getCell(grid, nextCoord);
      if (!cell) continue;

      // Cannot move through obstacles
      if (cell.state === CellState.OBSTACLE || cell.isObstacle) {
        continue;
      }

      // Can move if empty or it's the target port
      const canMove =
        cell.state === CellState.EMPTY ||
        (cell.wireId === wireId && cell.isPort);

      if (canMove) {
        visited.add(key);
        queue.push({
          coord: nextCoord,
          path: [...current.path, nextCoord],
        });
      }
    }
  }

  return null; // No path found
};

/**
 * Get adjacent cells
 */
export const getAdjacentCells = (grid: Grid, coord: Coordinate): CellData[] => {
  const directions = [
    { row: -1, col: 0 }, // up
    { row: 1, col: 0 },  // down
    { row: 0, col: -1 }, // left
    { row: 0, col: 1 },  // right
  ];

  const adjacent: CellData[] = [];

  for (const dir of directions) {
    const nextCoord: Coordinate = {
      row: coord.row + dir.row,
      col: coord.col + dir.col,
    };

    const cell = getCell(grid, nextCoord);
    if (cell) {
      adjacent.push(cell);
    }
  }

  return adjacent;
};

/**
 * Find next solvable wire (for hints)
 */
export const findNextSolvableWire = (grid: Grid, wires: Wire[]): Wire | null => {
  for (const wire of wires) {
    if (wire.isComplete) continue;

    // Try to find a path for this wire
    const path = findPathBFS(grid, wire.start, wire.end, wire.id);
    if (path) {
      return wire;
    }
  }

  return null;
};
