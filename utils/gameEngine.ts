
import { Grid, CellData, Direction, PlaneType } from '../types';
import { DIRECTIONS, DELTA_MAP } from '../constants';

// Helper to create a deep copy of the grid
const cloneGrid = (grid: Grid): Grid => {
  return grid.map(row => row.map(cell => (cell ? { ...cell } : null)));
};

// Check if a specific cell can exit the board freely
export const checkPath = (grid: Grid, cell: CellData): { canExit: boolean; blockingCell?: CellData } => {
  if (cell.isObstacle) return { canExit: false }; // Obstacles can't move

  const size = grid.length;
  const [dRow, dCol] = DELTA_MAP[cell.direction];
  
  let currRow = cell.row + dRow;
  let currCol = cell.col + dCol;

  while (currRow >= 0 && currRow < size && currCol >= 0 && currCol < size) {
    const obstacle = grid[currRow][currCol];
    if (obstacle) {
      return { canExit: false, blockingCell: obstacle };
    }
    currRow += dRow;
    currCol += dCol;
  }

  return { canExit: true };
};

// Calculate the full path of coordinates a plane will travel
export const calculateExitPath = (grid: Grid, cell: CellData): string[] => {
  if (cell.isObstacle) return [];
  
  const path: string[] = [];
  const size = grid.length;
  const [dRow, dCol] = DELTA_MAP[cell.direction];
  let r = cell.row + dRow;
  let c = cell.col + dCol;

  while (r >= 0 && r < size && c >= 0 && c < size) {
    path.push(`${r}-${c}`);
    r += dRow;
    c += dCol;
  }
  return path;
};

// Find the first plane that can successfully exit
export const findNextSolvablePlane = (grid: Grid): CellData | null => {
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[r].length; c++) {
      const cell = grid[r][c];
      if (cell && !cell.isObstacle && !cell.isExiting && !cell.isError) {
        if (checkPath(grid, cell).canExit) {
          return cell;
        }
      }
    }
  }
  return null;
};

// Algorithm to check if the entire board is solvable (deadlock detection)
const isSolvable = (grid: Grid, totalPlanes: number): boolean => {
  const tempGrid = cloneGrid(grid);
  let planesRemaining = totalPlanes;
  let moveMade = true;

  while (moveMade && planesRemaining > 0) {
    moveMade = false;
    // Scan full grid for any movable plane
    for (let r = 0; r < tempGrid.length; r++) {
      for (let c = 0; c < tempGrid.length; c++) {
        const cell = tempGrid[r][c];
        // Only check planes, skip obstacles
        if (cell && !cell.isObstacle) {
          const { canExit } = checkPath(tempGrid, cell);
          if (canExit) {
            // Remove it virtually
            tempGrid[r][c] = null;
            planesRemaining--;
            moveMade = true;
          }
        }
      }
    }
  }

  return planesRemaining === 0;
};

// Generate a valid, solvable level
export const generateLevel = (level: number): { grid: Grid; size: number } => {
  // Determine difficulty
  let size = 3;
  if (level > 2) size = 4;
  if (level > 6) size = 5;
  if (level > 12) size = 6; // Hard!

  // Density increases slightly with levels
  const baseDensity = 0.5;
  const density = Math.min(0.85, baseDensity + (level * 0.02));
  
  let attempts = 0;
  const MAX_ATTEMPTS = 500;

  while (attempts < MAX_ATTEMPTS) {
    attempts++;
    const newGrid: Grid = Array(size).fill(null).map(() => Array(size).fill(null));
    let planeCount = 0;

    // 1. Place items
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (Math.random() < density) {
          
          // Determine if Obstacle (Level > 2, 10% chance)
          // But ensure we don't block everything. 
          const isObstacle = level > 2 && Math.random() < 0.10;

          if (isObstacle) {
            newGrid[r][c] = {
              id: `OBS-${r}-${c}`,
              row: r,
              col: c,
              direction: Direction.UP, // Direction doesn't matter for obstacle
              type: PlaneType.COMMERCIAL, // Type placeholder
              isExiting: false,
              isError: false,
              isObstacle: true
            };
            // Do not increment planeCount
          } else {
            // It's a Plane
            const randomDir = DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)];
            
            // Determine Plane Type
            const randType = Math.random();
            let pType = PlaneType.COMMERCIAL;
            if (randType > 0.85) pType = PlaneType.HEAVY;
            else if (randType > 0.60) pType = PlaneType.LIGHT;

            // Determine Emergency / Fuel Status
            let fuel: number | undefined = undefined;
            if (level > 2 && Math.random() < 0.20) {
               fuel = Math.floor(15 + Math.random() * 15);
            }

            newGrid[r][c] = {
              id: `${r}-${c}-${Date.now()}`,
              row: r,
              col: c,
              direction: randomDir,
              type: pType,
              isExiting: false,
              isError: false,
              fuel: fuel,
              initialFuel: fuel,
              isObstacle: false
            };
            planeCount++;
          }
        }
      }
    }

    if (planeCount === 0) continue; // Retry if no planes

    // 2. Check Solvability
    // We pass only the count of moveable planes. Obstacles remain in grid and block paths.
    if (isSolvable(newGrid, planeCount)) {
      return { grid: newGrid, size };
    }
  }

  // Fallback
  return { grid: Array(3).fill(null).map(() => Array(3).fill(null)), size: 3 };
};
