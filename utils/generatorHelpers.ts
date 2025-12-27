// Wire Master - Level Generator Helper Functions

import { Coordinate, WireColor } from '../types';

/**
 * Get adjacent coordinates (4-directional: up, down, left, right)
 */
export const getAdjacentCoordinates = (
  coord: Coordinate,
  gridSize: number
): Coordinate[] => {
  const directions = [
    { row: -1, col: 0 }, // up
    { row: 1, col: 0 },  // down
    { row: 0, col: -1 }, // left
    { row: 0, col: 1 },  // right
  ];

  const adjacent: Coordinate[] = [];

  for (const dir of directions) {
    const newCoord: Coordinate = {
      row: coord.row + dir.row,
      col: coord.col + dir.col,
    };

    // Check bounds
    if (
      newCoord.row >= 0 &&
      newCoord.row < gridSize &&
      newCoord.col >= 0 &&
      newCoord.col < gridSize
    ) {
      adjacent.push(newCoord);
    }
  }

  return adjacent;
};

/**
 * Check if coordinate is valid within grid bounds
 */
export const isValidCoordinate = (coord: Coordinate, gridSize: number): boolean => {
  return (
    coord.row >= 0 &&
    coord.row < gridSize &&
    coord.col >= 0 &&
    coord.col < gridSize
  );
};

/**
 * Calculate distance between two coordinates (Manhattan distance)
 */
export const manhattanDistance = (a: Coordinate, b: Coordinate): number => {
  return Math.abs(a.row - b.row) + Math.abs(a.col - b.col);
};

/**
 * Select well-distributed seed points for region growing
 * Ensures minimum distance between seeds
 */
export const selectWellDistributedSeeds = (
  gridSize: number,
  count: number
): Coordinate[] => {
  const seeds: Coordinate[] = [];
  const minDistance = Math.max(2, Math.floor(gridSize / Math.sqrt(count * 1.5)));
  const maxAttempts = 100;

  for (let i = 0; i < count; i++) {
    let attempts = 0;
    let seed: Coordinate;

    do {
      seed = {
        row: Math.floor(Math.random() * gridSize),
        col: Math.floor(Math.random() * gridSize),
      };
      attempts++;

      // Check distance from existing seeds
      const tooClose = seeds.some(
        existingSeed => manhattanDistance(seed, existingSeed) < minDistance
      );

      if (!tooClose || attempts >= maxAttempts) {
        break;
      }
    } while (attempts < maxAttempts);

    seeds.push(seed);
  }

  return seeds;
};

/**
 * Shuffle array in place (Fisher-Yates algorithm)
 */
export const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

/**
 * Select random wire colors (no duplicates - GUARANTEED!)
 */
export const selectRandomColors = (count: number): WireColor[] => {
  const allColors: WireColor[] = [
    'red', 'blue', 'green', 'yellow', 'orange', 'purple',
    'pink', 'cyan', 'lime', 'brown', 'magenta', 'teal',
    'indigo', 'violet', 'coral', 'turquoise', 'gold', 'crimson',
    'navy', 'salmon'
  ];

  // Validate input
  if (count > allColors.length) {
    throw new Error(`Cannot select ${count} unique colors, only ${allColors.length} available!`);
  }

  if (count <= 0) {
    throw new Error(`Invalid color count: ${count}`);
  }

  // Shuffle and take first 'count' colors
  const selected = shuffleArray(allColors).slice(0, count);

  // Double-check uniqueness
  const uniqueColors = new Set(selected);
  if (uniqueColors.size !== count) {
    throw new Error(`Color selection produced duplicates! Expected ${count}, got ${uniqueColors.size}`);
  }

  return selected;
};

/**
 * Coordinate to string key for Set/Map usage
 */
export const coordToKey = (coord: Coordinate): string => {
  return `${coord.row}-${coord.col}`;
};

/**
 * String key to Coordinate
 */
export const keyToCoord = (key: string): Coordinate => {
  const [row, col] = key.split('-').map(Number);
  return { row, col };
};

/**
 * Check if two coordinates are equal
 */
export const coordsEqual = (a: Coordinate, b: Coordinate): boolean => {
  return a.row === b.row && a.col === b.col;
};

/**
 * Find coordinate in array
 */
export const findCoordIndex = (
  coords: Coordinate[],
  target: Coordinate
): number => {
  return coords.findIndex(c => coordsEqual(c, target));
};

/**
 * Random integer between min and max (inclusive)
 */
export const randomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Random element from array
 */
export const randomElement = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};
