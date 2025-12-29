// Wire Master - Random Level Generator (Backward Generation Algorithm)

import { GeneratorConfig, LevelData, Coordinate, WireColor } from '../types';
import {
  selectRandomColors,
  coordToKey,
  coordsEqual,
  randomInt,
  getAdjacentCoordinates,
  shuffleArray,
} from './generatorHelpers';

// ============================================
// SEEDED RANDOM NUMBER GENERATOR
// ============================================
class SeededRandom {
  private seed: number;

  constructor(seed: number) {
    this.seed = seed;
  }

  // Linear Congruential Generator (LCG)
  next(): number {
    this.seed = (this.seed * 1664525 + 1013904223) % 4294967296;
    return this.seed / 4294967296;
  }

  nextInt(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }

  shuffle<T>(array: T[]): T[] {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
      const j = this.nextInt(0, i);
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }
}

// Global seeded random instance
let seededRandom: SeededRandom | null = null;

// Seeded random helper functions
const seedRandom = (seed: number) => {
  seededRandom = new SeededRandom(seed);
};

const resetRandom = () => {
  seededRandom = null;
};

const getRandom = (): number => {
  return seededRandom ? seededRandom.next() : Math.random();
};

const getRandomInt = (min: number, max: number): number => {
  return seededRandom ? seededRandom.nextInt(min, max) : randomInt(min, max);
};

const getShuffled = <T>(array: T[]): T[] => {
  return seededRandom ? seededRandom.shuffle(array) : shuffleArray(array);
};

interface RegionCell {
  coord: Coordinate;
  wireId: number;
  color: WireColor;
  pathIndex: number; // Position in the wire's path (for proper ordering)
}

/**
 * Main entry point: Generate a random solvable level
 * Uses seeded random generation for consistent but varied levels
 */
export const generateLevel = (config: GeneratorConfig, levelNumber: number = 1): LevelData => {
  const { gridSize, wireCount, difficulty } = config;

  // All square grids now
  const rows = gridSize;
  const cols = gridSize;

  // Initialize seeded random for this level
  // Each level gets a unique seed based on level number
  // Use prime numbers and bit shifts for better distribution
  const baseSeed = (levelNumber * 48271) ^ ((levelNumber << 13) | (levelNumber >> 19)) ^ 0xDEADBEEF;
  seedRandom(baseSeed);

  let attempt = 0;
  const maxAttempts = 10; // Reduced from 30 for performance

  try {
    while (attempt < maxAttempts) {
      try {
        // Re-seed for each attempt to get different layouts
        // Use better distribution with XOR and bit operations
        const attemptSeed = baseSeed ^ (attempt * 2654435761) ^ ((attempt << 7) | (attempt >> 25));
        seedRandom(attemptSeed);

        // Step 1: Generate complete solution (use rows and cols for rectangular grids)
        const solution = generateCompleteSolution(rows, cols, wireCount);

        // Step 2: Extract wire endpoints
        const wires = extractWiresFromSolution(solution, rows, cols);

        // Step 3: NO OBSTACLES - They break 100% fill requirement!
        // Obstacles are DISABLED because they make it impossible to fill 100% of grid
        // The complete Hamiltonian path covers ALL cells, adding obstacles breaks this
        const obstacles: Coordinate[] = [];

        // DEBUG: Detailed generation logging
        const totalSolutionCells = wires.reduce((sum, w) => sum + (w.solutionPath?.length || 0), 0);
        const expectedCells = rows * cols;
        const cellCoverage = ((totalSolutionCells / expectedCells) * 100).toFixed(1);

        console.log(`\n[Level ${levelNumber}] Generation Complete:`);
        console.log(`  Grid: ${cols}x${rows} = ${expectedCells} cells`);
        console.log(`  Wires: ${wires.length}`);
        console.log(`  Total solution cells: ${totalSolutionCells}`);
        console.log(`  Coverage: ${cellCoverage}%`);

        if (totalSolutionCells !== expectedCells) {
          console.error(`  ❌ MISMATCH! Missing ${expectedCells - totalSolutionCells} cells!`);
        } else {
          console.log(`  ✅ Perfect coverage!`);
        }

        wires.forEach((w, i) => {
          console.log(`  Wire ${i} (${w.color}): ${w.solutionPath?.length || 0} cells from (${w.start.row},${w.start.col}) to (${w.end.row},${w.end.col})`);
        });

        // Step 4: Validate basic puzzle structure
        if (!validatePuzzle(wires, rows, cols)) {
          throw new Error('Basic validation failed');
        }

        // Step 5: DISABLED - Solver is too slow and causes freezing
        // We trust Hamiltonian path generation for now
        // TODO: Implement faster validation or async solver
        // if (!isPuzzleSolvable(wires, gridSize)) {
        //   if (attempt < 3) {
        //     console.log(`[Level ${levelNumber}] Attempt ${attempt + 1}: Puzzle not solvable, retrying...`);
        //   }
        //   throw new Error('Puzzle not solvable');
        // }

        // Success! Puzzle passes all validations
        console.log(`[Level ${levelNumber}] ✓ Solvable puzzle generated (attempt ${attempt + 1})`);

        // Extract solution paths from wires
        const solutionPaths: Coordinate[][] = wires.map(wire => wire.solutionPath || []);

        const levelData = {
          id: levelNumber, // Use level number as ID for consistency
          config: {
            size: gridSize,
            wireCount: wires.length,
            gridShape: 'square' as const,
            difficulty,
            optimalMoves: wires.length,
          },
          wires: wires.map(w => ({ color: w.color, start: w.start, end: w.end })), // Remove solutionPath from wires
          obstacles: obstacles.length > 0 ? obstacles : undefined,
          solution: solutionPaths, // Add complete solution for 100% fill validation
        };

        // Reset random for next generation
        resetRandom();
        return levelData;
      } catch (error) {
        // Only log first and last attempts to reduce noise
        if (attempt === 0 || attempt === maxAttempts - 1) {
          console.warn(`Generation attempt ${attempt + 1} failed:`, error);
        }
      }

      attempt++;
    }
  } finally {
    // Always reset random state
    resetRandom();
  }

  // Fallback: Simple level if generation fails
  return generateFallbackLevel(gridSize, wireCount, difficulty);
};

/**
 * Generate complete solution by filling grid with wire paths
 * CRITICAL: All cells MUST be covered - this is the core game mechanic
 */
const generateCompleteSolution = (
  rows: number,
  cols: number,
  wireCount: number
): RegionCell[] => {
  const totalCells = rows * cols;

  // Step 1: Generate a COMPLETE Hamiltonian path covering ALL cells
  const completePath = generateCompleteHamiltonianPath(rows, cols);

  // VALIDATION: Must cover entire grid
  if (completePath.length !== totalCells) {
    throw new Error(
      `Hamiltonian path incomplete: ${completePath.length}/${totalCells} cells`
    );
  }

  // Step 2: Partition the complete path into wireCount segments
  const pathSegments = partitionPathIntoSegments(completePath, wireCount);

  // VALIDATION: All segments combined must equal total cells
  const totalSegmentCells = pathSegments.reduce((sum, seg) => sum + seg.length, 0);
  if (totalSegmentCells !== totalCells) {
    throw new Error(
      `Path partition incomplete: ${totalSegmentCells}/${totalCells} cells`
    );
  }

  // Step 3: Select UNIQUE colors (no duplicates!)
  const colors = selectRandomColors(wireCount);

  if (colors.length !== wireCount) {
    throw new Error(`Color selection failed: expected ${wireCount}, got ${colors.length}`);
  }

  // VARIETY: Shuffle color assignment to wires
  // This creates visual variety even with same path structure
  const shuffledColors = getShuffled([...colors]);

  // Step 4: Build solution from segments
  const solution: RegionCell[] = [];

  // CRITICAL FIX: pathIndex must be GLOBAL, not per-segment
  // Otherwise cells will be out of order when reconstructing paths
  let globalPathIndex = 0;

  pathSegments.forEach((segment, wireId) => {
    segment.forEach((coord) => {
      solution.push({
        coord,
        wireId,
        color: shuffledColors[wireId], // Use shuffled colors for variety
        pathIndex: globalPathIndex++, // Global index across entire path
      });
    });
  });

  // FINAL VALIDATION
  if (solution.length !== totalCells) {
    throw new Error(`Solution incomplete: ${solution.length}/${totalCells} cells`);
  }

  return solution;
};

/**
 * Generate a complete Hamiltonian path that visits ALL cells in the grid
 * Uses MULTIPLE different algorithms for MAXIMUM variety
 * Supports both square and rectangular grids
 */
const generateCompleteHamiltonianPath = (rows: number, cols: number): Coordinate[] => {
  const totalCells = rows * cols;

  // Seçilebilecek farklı path generation stratejileri
  // CRITICAL: Only use predictable strategies that are easy for players to solve
  // RandomWalk creates deadlocks - DISABLED permanently
  // Diagonal creates partition errors (157/121, 259/121 etc.) - DISABLED
  // Using 3 proven strategies that NEVER fail (all work with rectangular grids)
  const strategies = ['zigzag', 'spiral', 'snake'];

  // Rastgele bir strateji seç
  const selectedStrategy = strategies[getRandomInt(0, strategies.length - 1)];

  // Stratejiye göre path oluştur
  let path: Coordinate[];

  switch (selectedStrategy) {
    case 'spiral':
      path = generateSpiralPath(rows, cols);
      break;
    case 'snake':
      path = generateSnakePath(rows, cols);
      break;
    case 'zigzag':
    default:
      path = generateRandomizedZigzag(rows, cols);
      break;
  }

  // CRITICAL VALIDATION: Path MUST cover ALL cells AND be unique
  // Remove duplicates if any algorithm generated them
  const uniquePath: Coordinate[] = [];
  const seen = new Set<string>();

  for (const coord of path) {
    const key = coordToKey(coord);
    if (!seen.has(key)) {
      seen.add(key);
      uniquePath.push(coord);
    }
  }

  if (uniquePath.length !== totalCells) {
    console.warn(`[${selectedStrategy}] Path incomplete or has duplicates: ${path.length} raw, ${uniquePath.length} unique, expected ${totalCells}. Falling back to zigzag.`);
    path = generateRandomizedZigzag(rows, cols);
  } else {
    path = uniquePath;
  }

  return path;
};

/**
 * Generate a random Hamiltonian path using DFS with backtracking
 */
const generateRandomHamiltonianPath = (gridSize: number): Coordinate[] => {
  const totalCells = gridSize * gridSize;

  // Start from a random corner
  const corners: Coordinate[] = [
    { row: 0, col: 0 },
    { row: 0, col: gridSize - 1 },
    { row: gridSize - 1, col: 0 },
    { row: gridSize - 1, col: gridSize - 1 },
  ];

  const startCorner = corners[getRandomInt(0, corners.length - 1)];

  const visited = new Set<string>();
  const path: Coordinate[] = [];

  const dfs = (current: Coordinate): boolean => {
    const key = coordToKey(current);

    if (visited.has(key)) return false;

    visited.add(key);
    path.push(current);

    // Success: visited all cells
    if (path.length === totalCells) {
      return true;
    }

    // Get adjacent cells and shuffle for randomness
    const neighbors = getAdjacentCoordinates(current, gridSize);
    const shuffledNeighbors = getShuffled([...neighbors]);

    // Try each neighbor
    for (const neighbor of shuffledNeighbors) {
      if (dfs(neighbor)) {
        return true;
      }
    }

    // Backtrack
    visited.delete(key);
    path.pop();
    return false;
  };

  dfs(startCorner);
  return path;
};

/**
 * Generate a randomized zigzag path - fast and varied
 * Randomizes: starting corner, direction (horizontal/vertical), and zigzag orientation
 */
const generateRandomizedZigzag = (rows: number, cols: number): Coordinate[] => {
  const path: Coordinate[] = [];

  // Random choices for variety using seeded random
  const startFromTop = getRandom() < 0.5;
  const startFromLeft = getRandom() < 0.5;
  const horizontal = getRandom() < 0.5; // true = horizontal zigzag, false = vertical zigzag
  const reverseZigzag = getRandom() < 0.5; // Reverse the zigzag pattern

  if (horizontal) {
    // Horizontal zigzag (row by row)
    for (let row = 0; row < rows; row++) {
      const actualRow = startFromTop ? row : rows - 1 - row;
      const shouldReverse = reverseZigzag ? row % 2 === 1 : row % 2 === 0;
      const goingRight = startFromLeft ? !shouldReverse : shouldReverse;

      if (goingRight) {
        for (let col = 0; col < cols; col++) {
          path.push({ row: actualRow, col });
        }
      } else {
        for (let col = cols - 1; col >= 0; col--) {
          path.push({ row: actualRow, col });
        }
      }
    }
  } else {
    // Vertical zigzag (column by column)
    for (let col = 0; col < cols; col++) {
      const actualCol = startFromLeft ? col : cols - 1 - col;
      const shouldReverse = reverseZigzag ? col % 2 === 1 : col % 2 === 0;
      const goingDown = startFromTop ? !shouldReverse : shouldReverse;

      if (goingDown) {
        for (let row = 0; row < rows; row++) {
          path.push({ row, col: actualCol });
        }
      } else {
        for (let row = rows - 1; row >= 0; row--) {
          path.push({ row, col: actualCol });
        }
      }
    }
  }

  return path;
};

/**
 * Generate a deterministic zigzag path (guaranteed to work)
 */
const generateZigzagPath = (gridSize: number): Coordinate[] => {
  const path: Coordinate[] = [];

  for (let row = 0; row < gridSize; row++) {
    if (row % 2 === 0) {
      // Even rows: left to right
      for (let col = 0; col < gridSize; col++) {
        path.push({ row, col });
      }
    } else {
      // Odd rows: right to left
      for (let col = gridSize - 1; col >= 0; col--) {
        path.push({ row, col });
      }
    }
  }

  return path;
};

/**
 * Generate SPIRAL path - starts from outside/inside and spirals in/out
 * Çok farklı görsel pattern oluşturur!
 */
const generateSpiralPath = (rows: number, cols: number): Coordinate[] => {
  const path: Coordinate[] = [];
  const spiralInward = getRandom() < 0.5; // true = dıştan içe, false = içten dışa

  if (spiralInward) {
    // Dıştan içe spiral
    let top = 0, bottom = rows - 1, left = 0, right = cols - 1;

    while (top <= bottom && left <= right) {
      // Sağa git (top row)
      for (let col = left; col <= right; col++) {
        path.push({ row: top, col });
      }
      top++;

      // Aşağı git (right column)
      for (let row = top; row <= bottom; row++) {
        path.push({ row, col: right });
      }
      right--;

      // Sola git (bottom row) - sadece hala satır varsa
      if (top <= bottom) {
        for (let col = right; col >= left; col--) {
          path.push({ row: bottom, col });
        }
        bottom--;
      }

      // Yukarı git (left column) - sadece hala sütun varsa
      if (left <= right) {
        for (let row = bottom; row >= top; row--) {
          path.push({ row, col: left });
        }
        left++;
      }
    }
  } else {
    // İçten dışa spiral - basitçe inward spiral'in tersini döndür
    // Ama burada sonsuz loop olmaması için direk return edelim
    path.reverse(); // Boş array olduğu için bir şey yapmaz

    // Tekrar hesapla ama reverse order'da
    let top = 0, bottom = rows - 1, left = 0, right = cols - 1;
    const tempPath: Coordinate[] = [];

    while (top <= bottom && left <= right) {
      for (let col = left; col <= right; col++) {
        tempPath.push({ row: top, col });
      }
      top++;

      for (let row = top; row <= bottom; row++) {
        tempPath.push({ row, col: right });
      }
      right--;

      if (top <= bottom) {
        for (let col = right; col >= left; col--) {
          tempPath.push({ row: bottom, col });
        }
        bottom--;
      }

      if (left <= right) {
        for (let row = bottom; row >= top; row--) {
          tempPath.push({ row, col: left });
        }
        left++;
      }
    }

    return tempPath.reverse();
  }

  return path;
};

/**
 * Generate SNAKE path - farklı yönlerde kıvrımlı yılan gibi
 * Supports rectangular grids
 */
const generateSnakePath = (rows: number, cols: number): Coordinate[] => {
  const path: Coordinate[] = [];
  const segmentSize = getRandomInt(2, Math.max(2, Math.floor(rows / 2)));
  const horizontal = getRandom() < 0.5;

  if (horizontal) {
    // Yatay snake
    let currentRow = 0;
    let goingRight = true;

    while (currentRow < rows) {
      const endRow = Math.min(currentRow + segmentSize, rows);

      for (let row = currentRow; row < endRow; row++) {
        if (goingRight) {
          for (let col = 0; col < cols; col++) {
            path.push({ row, col });
          }
        } else {
          for (let col = cols - 1; col >= 0; col--) {
            path.push({ row, col });
          }
        }
        goingRight = !goingRight;
      }

      currentRow = endRow;
    }
  } else {
    // Dikey snake
    let currentCol = 0;
    let goingDown = true;

    while (currentCol < cols) {
      const endCol = Math.min(currentCol + segmentSize, cols);

      for (let col = currentCol; col < endCol; col++) {
        if (goingDown) {
          for (let row = 0; row < rows; row++) {
            path.push({ row, col });
          }
        } else {
          for (let row = rows - 1; row >= 0; row--) {
            path.push({ row, col });
          }
        }
        goingDown = !goingDown;
      }

      currentCol = endCol;
    }
  }

  return path;
};

/**
 * Generate DIAGONAL path - çapraz sweeps
 */
const generateDiagonalPath = (gridSize: number): Coordinate[] => {
  const path: Coordinate[] = [];
  const topLeftToBottomRight = getRandom() < 0.5;

  if (topLeftToBottomRight) {
    // Sol üstten sağ alta diagonal sweeps
    for (let diag = 0; diag < gridSize * 2 - 1; diag++) {
      const cells: Coordinate[] = [];

      for (let row = 0; row < gridSize; row++) {
        const col = diag - row;
        if (col >= 0 && col < gridSize) {
          cells.push({ row, col });
        }
      }

      // Her diagonal'i alternatif yönden tara
      if (diag % 2 === 0) {
        path.push(...cells);
      } else {
        // CRITICAL FIX: reverse() array'i mutate eder, önce kopyala
        path.push(...[...cells].reverse());
      }
    }
  } else {
    // Sağ üstten sol alta diagonal sweeps
    for (let diag = 0; diag < gridSize * 2 - 1; diag++) {
      const cells: Coordinate[] = [];

      for (let row = 0; row < gridSize; row++) {
        const col = gridSize - 1 - (diag - row);
        if (col >= 0 && col < gridSize) {
          cells.push({ row, col });
        }
      }

      if (diag % 2 === 0) {
        path.push(...cells);
      } else {
        // CRITICAL FIX: reverse() array'i mutate eder, önce kopyala
        path.push(...[...cells].reverse());
      }
    }
  }

  return path;
};

/**
 * Generate RECURSIVE path - grid'i recursive olarak böl
 */
const generateRecursivePath = (gridSize: number): Coordinate[] => {
  const path: Coordinate[] = [];

  const fillRecursive = (startRow: number, startCol: number, size: number) => {
    if (size === 1) {
      path.push({ row: startRow, col: startCol });
      return;
    }

    if (size === 2) {
      // 2x2 için spiral
      path.push({ row: startRow, col: startCol });
      path.push({ row: startRow, col: startCol + 1 });
      path.push({ row: startRow + 1, col: startCol + 1 });
      path.push({ row: startRow + 1, col: startCol });
      return;
    }

    const half = Math.floor(size / 2);
    const hasRemainder = size % 2 === 1;

    // Rastgele order'da quadrantları ziyaret et
    // CRITICAL: Tek sayıda grid için remainder'i SADECE bottom-right'a ekle
    const quadrants = [
      { row: startRow, col: startCol, size: half }, // Top-left
      { row: startRow, col: startCol + half, size: half }, // Top-right
      { row: startRow + half, col: startCol, size: half }, // Bottom-left
      { row: startRow + half, col: startCol + half, size: half + (hasRemainder ? 1 : 0) }, // Bottom-right - takes the remainder
    ];

    const shuffled = getShuffled(quadrants);

    for (const quad of shuffled) {
      if (quad.size > 0) {
        fillRecursive(quad.row, quad.col, quad.size);
      }
    }
  };

  fillRecursive(0, 0, gridSize);
  return path;
};

/**
 * Generate RANDOM WALK path - DFS with heavy randomization
 */
const generateRandomWalkPath = (gridSize: number): Coordinate[] => {
  const totalCells = gridSize * gridSize;
  const visited = new Set<string>();
  const path: Coordinate[] = [];

  // Rastgele bir başlangıç noktası
  const startRow = getRandomInt(0, gridSize - 1);
  const startCol = getRandomInt(0, gridSize - 1);

  const dfs = (current: Coordinate): boolean => {
    const key = coordToKey(current);

    if (visited.has(key)) return false;
    if (current.row < 0 || current.row >= gridSize) return false;
    if (current.col < 0 || current.col >= gridSize) return false;

    visited.add(key);
    path.push(current);

    if (path.length === totalCells) {
      return true;
    }

    // Komşuları al ve karıştır
    const neighbors = getAdjacentCoordinates(current, gridSize);
    const shuffled = getShuffled([...neighbors]);

    for (const neighbor of shuffled) {
      if (dfs(neighbor)) {
        return true;
      }
    }

    // Backtrack
    visited.delete(key);
    path.pop();
    return false;
  };

  dfs({ row: startRow, col: startCol });
  return path;
};

/**
 * Partition a complete path into N segments of roughly equal size
 * Each segment becomes one wire's path
 * Uses random split points with minimum size constraints
 */
const partitionPathIntoSegments = (
  path: Coordinate[],
  segmentCount: number
): Coordinate[][] => {
  const segments: Coordinate[][] = [];
  const totalCells = path.length;

  // CRITICAL: Dynamic minimum size based on wire count
  // More wires = need smaller segments, but never too small
  const avgSize = Math.floor(totalCells / segmentCount);
  const absoluteMinSize = Math.max(4, Math.floor(avgSize * 0.5));

  // Check if we can even partition with minimum size
  if (totalCells < segmentCount * absoluteMinSize) {
    throw new Error(`Cannot partition ${totalCells} cells into ${segmentCount} segments with min size ${absoluteMinSize}`);
  }

  // Calculate target size per segment with variation to prevent patterns
  const minSegmentSize = absoluteMinSize;
  const maxSegmentSize = Math.floor(avgSize * 1.8);

  let startIdx = 0;

  for (let i = 0; i < segmentCount; i++) {
    const remainingCells = totalCells - startIdx;
    const remainingSegments = segmentCount - i;

    if (i === segmentCount - 1) {
      // Last segment: take all remaining cells
      const lastSegment = path.slice(startIdx);
      // Ensure last segment meets minimum size
      if (lastSegment.length < absoluteMinSize) {
        throw new Error(`Last segment too small: ${lastSegment.length} < ${absoluteMinSize}`);
      }
      segments.push(lastSegment);
    } else {
      // Calculate segment size ensuring all remaining segments can meet minimum
      const minPossible = absoluteMinSize;
      const maxPossible = remainingCells - (remainingSegments - 1) * absoluteMinSize;

      // Ensure valid range
      if (maxPossible < minPossible) {
        throw new Error(`Invalid segment range: max ${maxPossible} < min ${minPossible}`);
      }

      // Random size within safe range
      const minSize = Math.max(minPossible, minSegmentSize);
      const maxSize = Math.min(maxPossible, maxSegmentSize);

      const segmentSize = minSize === maxSize ? minSize : getRandomInt(minSize, maxSize);
      const endIdx = startIdx + segmentSize;

      segments.push(path.slice(startIdx, endIdx));
      startIdx = endIdx;
    }
  }

  return segments;
};

/**
 * Extract wire endpoints from complete solution
 */
const extractWiresFromSolution = (
  solution: RegionCell[],
  rows?: number,
  cols?: number
): Array<{ color: WireColor; start: Coordinate; end: Coordinate; solutionPath?: Coordinate[] }> => {
  // Group cells by wireId
  const wireMap = new Map<number, RegionCell[]>();

  solution.forEach(cell => {
    if (!wireMap.has(cell.wireId)) {
      wireMap.set(cell.wireId, []);
    }
    wireMap.get(cell.wireId)!.push(cell);
  });

  // Build ordered paths for all wires
  const orderedPaths: Array<{ wireId: number; color: WireColor; path: Coordinate[] }> = [];

  wireMap.forEach((cells, wireId) => {
    // CRITICAL: Every wire MUST have at least 2 cells
    if (cells.length < 2) {
      throw new Error(`Wire ${wireId} (color: ${cells[0]?.color}) has only ${cells.length} cells! All wires must have at least 2 cells.`);
    }

    // CRITICAL FIX: Use pathIndex to maintain correct order
    // Sort cells by their pathIndex to preserve the original Hamiltonian path order
    const sortedCells = [...cells].sort((a, b) => a.pathIndex - b.pathIndex);
    const orderedPath = sortedCells.map(cell => cell.coord);

    // CRITICAL: Path must have at least 2 coordinates for valid start/end
    if (orderedPath.length < 2) {
      throw new Error(`Wire ${wireId} (color: ${cells[0]?.color}) ordered path has only ${orderedPath.length} cells! Path reconstruction failed.`);
    }

    orderedPaths.push({
      wireId,
      color: cells[0].color,
      path: orderedPath,
    });
  });

  // FINAL VALIDATION: Must have exactly the same number of wires as we started with
  if (orderedPaths.length !== wireMap.size) {
    throw new Error(`Wire count mismatch! Started with ${wireMap.size} wires, ended with ${orderedPaths.length}`);
  }

  // KRİTİK: Port'lar her zaman path'in BAŞI ve SONU olmalı
  // Çünkü oyuncu sadece komşu hücrelere hareket edebilir
  // Path'in ortasından başlarsak, oyuncu tüm path'e ulaşamaz!
  //
  // Rastgelelik zaten şu şekilde sağlanıyor:
  // 1. Hamiltonian path rastgele oluşturuluyor (zigzag, DFS, vb.)
  // 2. Path'ler rastgele boyutlarda bölünüyor
  // 3. Port'lar %50 şansla ters çevriliyor
  const wires: Array<{ color: WireColor; start: Coordinate; end: Coordinate; solutionPath?: Coordinate[] }> = [];

  for (const { color, path } of orderedPaths) {
    if (path.length < 2) {
      throw new Error(`Path for color ${color} has only ${path.length} cells!`);
    }

    // GARANTI EDİLMİŞ ÇÖZÜLEBILIRLIK: Her zaman path'in başı ve sonu
    const start = path[0];
    const end = path[path.length - 1];

    // CRITICAL: Flip'i azalt - sadece %25 şansla
    // Çünkü flip edince portlar oyuncu için mantıksız yerlere gelir
    const shouldFlip = getRandom() < 0.25;

    wires.push({
      color,
      start: shouldFlip ? end : start,
      end: shouldFlip ? start : end,
      solutionPath: shouldFlip ? [...path].reverse() : path, // Solution path de flip et
    });
  }

  // VALIDATION: Renklerin unique olduğunu kontrol et
  const colorSet = new Set(wires.map(w => w.color));
  if (colorSet.size !== wires.length) {
    const colorCounts = new Map<WireColor, number>();
    wires.forEach(w => colorCounts.set(w.color, (colorCounts.get(w.color) || 0) + 1));
    const duplicates = Array.from(colorCounts.entries()).filter(([_, count]) => count > 1);
    throw new Error(`Duplicate colors detected! ${duplicates.map(([color, count]) => `${color}: ${count}x`).join(', ')}`);
  }

  // VALIDATION: Wire sayısının doğru olduğunu kontrol et
  if (wires.length !== orderedPaths.length) {
    throw new Error(`Wire count mismatch! Expected ${orderedPaths.length}, got ${wires.length}`);
  }

  // CRITICAL VALIDATION: Solution paths must cover ALL cells exactly once
  if (rows && cols) {
    const allSolutionCells = new Set<string>();
    wires.forEach(wire => {
      wire.solutionPath?.forEach(coord => {
        const key = `${coord.row},${coord.col}`;
        if (allSolutionCells.has(key)) {
          throw new Error(`Cell ${key} appears in multiple wire solution paths!`);
        }
        allSolutionCells.add(key);
      });
    });

    // Total solution cells must equal grid dimensions (rows * cols for rectangular grids)
    const expectedCells = rows * cols;
    if (allSolutionCells.size !== expectedCells) {
      throw new Error(`Solution paths don't cover all cells: ${allSolutionCells.size}/${expectedCells} cells`);
    }
  }

  // VALIDATION: Her wire'ın geçerli start ve end'i olduğunu kontrol et
  wires.forEach((wire, idx) => {
    if (!wire.start || !wire.end) {
      throw new Error(`Wire ${idx} (${wire.color}) missing start or end!`);
    }
    if (wire.start.row === wire.end.row && wire.start.col === wire.end.col) {
      throw new Error(`Wire ${idx} (${wire.color}) has same start and end position!`);
    }
  });

  // CRITICAL VALIDATION: Portlar farklı hücrelerde olmalı (overlap yok)
  // Hamiltonian path garantisi zaten var, sadece temel kontrolü yapalım
  const portPositions = new Set<string>();

  for (const wire of wires) {
    const startKey = `${wire.start.row},${wire.start.col}`;
    const endKey = `${wire.end.row},${wire.end.col}`;

    if (portPositions.has(startKey)) {
      throw new Error(`Duplicate port position: ${startKey}`);
    }
    if (portPositions.has(endKey)) {
      throw new Error(`Duplicate port position: ${endKey}`);
    }

    portPositions.add(startKey);
    portPositions.add(endKey);
  }

  return wires;
};

/**
 * Reconstruct path order from unordered cells
 * (Find start, then follow adjacent cells)
 */
const reconstructPathOrder = (cells: RegionCell[]): Coordinate[] => {
  if (cells.length === 0) return [];
  if (cells.length === 1) return [cells[0].coord];

  // Build adjacency map
  const cellSet = new Set(cells.map(c => coordToKey(c.coord)));

  // Find a cell with only 1 adjacent (endpoint)
  let start: Coordinate | null = null;

  for (const cell of cells) {
    const coord = cell.coord;
    const adjacentInPath = getAdjacentCoordinates(coord, 100).filter(adj =>
      cellSet.has(coordToKey(adj))
    );

    if (adjacentInPath.length === 1) {
      start = coord;
      break;
    }
  }

  // If no endpoint found (circular path), start anywhere
  if (!start) {
    start = cells[0].coord;
  }

  // Traverse path
  const ordered: Coordinate[] = [start];
  const visited = new Set<string>([coordToKey(start)]);
  let current = start;

  while (ordered.length < cells.length) {
    const neighbors = getAdjacentCoordinates(current, 100).filter(
      n => cellSet.has(coordToKey(n)) && !visited.has(coordToKey(n))
    );

    if (neighbors.length === 0) break;

    const next = neighbors[0];
    ordered.push(next);
    visited.add(coordToKey(next));
    current = next;
  }

  return ordered;
};

/**
 * Generate obstacles for level (level 15+)
 * Places obstacles that don't block the solution
 */
const generateObstacles = (
  wires: Array<{ color: WireColor; start: Coordinate; end: Coordinate; solutionPath?: Coordinate[] }>,
  gridSize: number,
  levelNumber: number,
  solution: RegionCell[]
): Coordinate[] => {
  const obstacles: Coordinate[] = [];

  // Calculate obstacle count based on level
  // Level 15-20: 1-2 obstacles
  // Level 21-25: 2-3 obstacles
  // Level 26-30: 3-4 obstacles
  // Level 31+: 4-6 obstacles
  let obstacleCount = 1;
  if (levelNumber >= 31) {
    obstacleCount = getRandomInt(4, 6);
  } else if (levelNumber >= 26) {
    obstacleCount = getRandomInt(3, 4);
  } else if (levelNumber >= 21) {
    obstacleCount = getRandomInt(2, 3);
  } else if (levelNumber >= 15) {
    obstacleCount = getRandomInt(1, 2);
  }

  // Collect all port positions to avoid placing obstacles on them
  const portPositions = new Set<string>();
  wires.forEach(wire => {
    portPositions.add(coordToKey(wire.start));
    portPositions.add(coordToKey(wire.end));
  });

  // CRITICAL: Collect all solution path cells
  // Obstacles must NOT be placed on solution paths to ensure solvability
  const solutionCells = new Set<string>();
  solution.forEach(cell => {
    solutionCells.add(coordToKey(cell.coord));
  });

  // Try to place obstacles randomly
  const maxAttempts = 100;
  let attempts = 0;

  while (obstacles.length < obstacleCount && attempts < maxAttempts) {
    const obstacle: Coordinate = {
      row: getRandomInt(0, gridSize - 1),
      col: getRandomInt(0, gridSize - 1),
    };

    const key = coordToKey(obstacle);

    // Check if position is valid:
    // - NOT on a port
    // - NOT already an obstacle
    // - NOT on the solution path (CRITICAL for solvability!)
    if (!portPositions.has(key) &&
        !obstacles.some(o => coordsEqual(o, obstacle)) &&
        !solutionCells.has(key)) {
      obstacles.push(obstacle);
    }

    attempts++;
  }

  return obstacles;
};

/**
 * Validate generated puzzle
 */
const validatePuzzle = (
  wires: Array<{ color: WireColor; start: Coordinate; end: Coordinate; solutionPath?: Coordinate[] }>,
  rows: number,
  cols: number
): boolean => {
  // Check 1: All wires have valid endpoints
  for (const wire of wires) {
    if (
      wire.start.row < 0 || wire.start.row >= rows ||
      wire.start.col < 0 || wire.start.col >= cols ||
      wire.end.row < 0 || wire.end.row >= rows ||
      wire.end.col < 0 || wire.end.col >= cols
    ) {
      return false;
    }
  }

  // Check 2: No overlapping endpoints
  const endpointSet = new Set<string>();

  for (const wire of wires) {
    const startKey = coordToKey(wire.start);
    const endKey = coordToKey(wire.end);

    if (endpointSet.has(startKey) || endpointSet.has(endKey)) {
      return false;
    }

    endpointSet.add(startKey);
    endpointSet.add(endKey);
  }

  // Check 3: At least 1 wire
  if (wires.length < 1) {
    return false;
  }

  return true;
};

/**
 * CRITICAL: Test if a puzzle is actually solvable with 100% grid fill
 * Uses a simple backtracking solver to verify the puzzle can be completed
 */
const isPuzzleSolvable = (
  wires: Array<{ color: WireColor; start: Coordinate; end: Coordinate; solutionPath?: Coordinate[] }>,
  gridSize: number
): boolean => {
  const totalCells = gridSize * gridSize;

  // State: which cells are filled and by which wire
  const grid: (number | null)[][] = Array(gridSize).fill(null).map(() => Array(gridSize).fill(null));

  // Mark all endpoints
  wires.forEach((wire, wireIdx) => {
    grid[wire.start.row][wire.start.col] = wireIdx;
    grid[wire.end.row][wire.end.col] = wireIdx;
  });

  // Track current path for each wire
  const wirePaths: Coordinate[][] = wires.map(wire => [wire.start]);
  const wireCompleted: boolean[] = Array(wires.length).fill(false);

  // Helper: Check if coordinate is valid and empty
  const isValidMove = (coord: Coordinate, wireIdx: number): boolean => {
    if (coord.row < 0 || coord.row >= gridSize || coord.col < 0 || coord.col >= gridSize) {
      return false;
    }
    const cell = grid[coord.row][coord.col];
    // Cell must be empty OR be the target endpoint for this wire
    return cell === null ||
           (coordsEqual(coord, wires[wireIdx].end) && !wireCompleted[wireIdx]);
  };

  // Helper: Get valid next moves for a wire
  const getValidMoves = (wireIdx: number): Coordinate[] => {
    const path = wirePaths[wireIdx];
    const lastCell = path[path.length - 1];
    const moves: Coordinate[] = [];

    // Try all 4 directions
    const directions = [
      { row: -1, col: 0 }, // up
      { row: 1, col: 0 },  // down
      { row: 0, col: -1 }, // left
      { row: 0, col: 1 },  // right
    ];

    for (const dir of directions) {
      const next = { row: lastCell.row + dir.row, col: lastCell.col + dir.col };
      if (isValidMove(next, wireIdx)) {
        moves.push(next);
      }
    }

    return moves;
  };

  // Backtracking solver
  const solve = (depth: number): boolean => {
    // Prevent infinite loops
    if (depth > totalCells * 2) return false;

    // Count filled cells
    let filledCount = 0;
    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        if (grid[r][c] !== null) filledCount++;
      }
    }

    // Success: all cells filled
    if (filledCount === totalCells) {
      // Verify all wires are completed
      return wireCompleted.every(c => c);
    }

    // Try extending each incomplete wire
    for (let wireIdx = 0; wireIdx < wires.length; wireIdx++) {
      if (wireCompleted[wireIdx]) continue;

      const validMoves = getValidMoves(wireIdx);

      // If wire has no valid moves but isn't complete, puzzle might be unsolvable
      // However, we should try other wires first
      if (validMoves.length === 0) continue;

      // Try each possible move
      for (const move of validMoves) {
        const isEndpoint = coordsEqual(move, wires[wireIdx].end);

        // Make move
        if (!isEndpoint) {
          grid[move.row][move.col] = wireIdx;
        }
        wirePaths[wireIdx].push(move);
        if (isEndpoint) {
          wireCompleted[wireIdx] = true;
        }

        // Recurse
        if (solve(depth + 1)) {
          return true;
        }

        // Backtrack
        wirePaths[wireIdx].pop();
        if (isEndpoint) {
          wireCompleted[wireIdx] = false;
        } else {
          grid[move.row][move.col] = null;
        }
      }
    }

    return false;
  };

  // CRITICAL: Actually RUN the backtracking solver to verify 100% fill is possible
  // Hamiltonian path generation does NOT guarantee player can solve it!
  // We MUST test with the actual solver

  try {
    // Sanity checks first
    for (const wire of wires) {
      if (coordsEqual(wire.start, wire.end)) {
        return false;
      }
    }

    const portPositions = new Set<string>();
    for (const wire of wires) {
      const startKey = `${wire.start.row},${wire.start.col}`;
      const endKey = `${wire.end.row},${wire.end.col}`;

      if (portPositions.has(startKey) || portPositions.has(endKey)) {
        return false;
      }

      portPositions.add(startKey);
      portPositions.add(endKey);
    }

    // RUN THE ACTUAL SOLVER - this is the ONLY way to verify 100% fill
    // Start from depth 0 and let it search
    const solvable = solve(0);

    return solvable;

  } catch (e) {
    console.error('Solver error:', e);
    return false;
  }
};

/**
 * Fallback: Generate simple level if generation fails
 */
const generateFallbackLevel = (
  gridSize: number,
  wireCount: number,
  difficulty: string
): LevelData => {
  // Simple horizontal wires
  const wires: Array<{ color: WireColor; start: Coordinate; end: Coordinate; solutionPath?: Coordinate[] }> = [];
  const colors = selectRandomColors(wireCount);

  for (let i = 0; i < Math.min(wireCount, gridSize); i++) {
    wires.push({
      color: colors[i],
      start: { row: i, col: 0 },
      end: { row: i, col: gridSize - 1 },
    });
  }

  return {
    id: Date.now(),
    config: {
      size: gridSize,
      wireCount: wires.length,
      gridShape: 'square',
      difficulty: difficulty as any,
      optimalMoves: wires.length,
    },
    wires,
  };
};
