// Wire Master - Main App Component

import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { View, StyleSheet, Dimensions, Text, TouchableOpacity, PanResponder, Animated } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as Haptics from 'expo-haptics';
import { GameState, Coordinate, AppSettings, DEFAULT_SETTINGS, UserProfile, GlobalStats, LevelStats } from './types';
import { calculateCellSize, TOTAL_LEVELS, levelToClassChapter, calculateCoinReward } from './constants';
import {
  loadLevel,
  calculateGridFilled,
  checkWinCondition,
  isValidMove,
  setWirePath,
  clearWirePath,
  getCell,
  findNextSolvableWire,
  findPathBFS,
} from './utils/wireEngine';
import { levelCache } from './utils/levelCache';
import { loadSettings, saveSettings } from './utils/settingsStorage';
import { loadUserProfile, saveUserProfile, createNewProfile, updateProfile, unlockClass, deleteProfile } from './utils/userProfileStorage';
import { loadLevelStats, saveLevelStats, loadAllLevelStats } from './utils/levelStatsStorage';
import { loadGlobalStats, saveGlobalStats, incrementStats, updateStreak, createDefaultGlobalStats } from './utils/globalStatsStorage';
import WireCell from './components/WireCell';
import GameHeader from './components/GameHeader';
import Overlay from './components/Overlay';
import MainMenu from './components/MainMenu';
import SettingsModal from './components/SettingsModal';
import ProfileSetup from './components/ProfileSetup';
import ProfileModal from './components/ProfileModal';
import StatsModal from './components/StatsModal';
import ShopModal from './components/ShopModal';
import MessagesModal from './components/MessagesModal';
import PauseMenu from './components/PauseMenu';
// Class selection removed - using progressive difficulty
import LevelCompleteModal from './components/LevelCompleteModal';
import { AdBanner } from './components/AdBanner';
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider, useTranslation } from './contexts/LanguageContext';

const { width, height } = Dimensions.get('window');

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    level: 1,
    grid: [],
    gridSize: 5,
    gridShape: 'square',
    wires: [],
    status: 'menu',
    moves: 0,
    gridFilled: 0,
    isPerfect: false,
    hintsUsed: 0,
    elapsedTime: 0,
    isPaused: false,
  });

  // Drawing state
  const [currentPath, setCurrentPath] = useState<Coordinate[]>([]);
  const [drawingWireId, setDrawingWireId] = useState<string | null>(null);
  const [hintWireId, setHintWireId] = useState<string | null>(null);

  // Move history for undo (stores grid snapshots and wire states)
  const [moveHistory, setMoveHistory] = useState<Array<{
    grid: GameState['grid'];
    wires: GameState['wires'];
    moves: number;
    gridFilled: number;
  }>>([]);

  // Store the initial level state for restart
  const [initialLevelState, setInitialLevelState] = useState<{
    grid: GameState['grid'];
    wires: GameState['wires'];
    level: number;
  } | null>(null);

  // Settings state
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [settingsLoaded, setSettingsLoaded] = useState(false);
  const [isSettingsVisible, setIsSettingsVisible] = useState(false);

  // Profile & Stats state
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [globalStats, setGlobalStats] = useState<GlobalStats | null>(null);
  const [levelStatsMap, setLevelStatsMap] = useState<Map<number, LevelStats>>(new Map());
  const [isProfileSetupVisible, setIsProfileSetupVisible] = useState(false);
  const [isProfileVisible, setIsProfileVisible] = useState(false);
  const [isStatsVisible, setIsStatsVisible] = useState(false);
  const [isShopVisible, setIsShopVisible] = useState(false);
  const [isMessagesVisible, setIsMessagesVisible] = useState(false);
  const [isPauseMenuVisible, setIsPauseMenuVisible] = useState(false);
  const [isLevelCompleteVisible, setIsLevelCompleteVisible] = useState(false);
  const [levelCompleteData, setLevelCompleteData] = useState<{
    level: number;
    stars: number;
    moves: number;
    time: number;
    coinsEarned: number;
    isFirstCompletion: boolean;
  } | null>(null);

  // Refs for touch tracking
  const isDrawingRef = useRef(false);
  const lastCellRef = useRef<Coordinate | null>(null);
  const gridLayoutRef = useRef({ x: 0, y: 0, width: 0, height: 0 });
  const gridRef = useRef<View>(null);

  // Animation values
  const winAnimScale = useRef(new Animated.Value(1)).current;
  const winAnimOpacity = useRef(new Animated.Value(0)).current;

  // Initialize level cache on mount
  useEffect(() => {
    levelCache.warmup();
  }, []);

  // Load settings on mount
  useEffect(() => {
    loadSettings().then(loadedSettings => {
      setSettings(loadedSettings);
      setSettingsLoaded(true);
    });
  }, []);

  // Load profile on mount
  useEffect(() => {
    const initProfile = async () => {
      const profile = await loadUserProfile();
      if (profile) {
        setUserProfile(profile);
        // Load global stats
        const stats = await loadGlobalStats();
        setGlobalStats(stats);
        // Update streak
        await updateStreak();
      } else {
        // First time - show profile setup
        setIsProfileSetupVisible(true);
      }
    };
    initProfile();
  }, []);

  // Timer interval (1 second)
  useEffect(() => {
    if (gameState.status === 'playing' && !gameState.isPaused) {
      const interval = setInterval(() => {
        setGameState(prev => ({
          ...prev,
          elapsedTime: prev.elapsedTime + 1000,
        }));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [gameState.status, gameState.isPaused]);

  // Start level (async for level generation)
  const startLevel = useCallback(async (levelNum: number) => {
    setGameState(prev => ({ ...prev, status: 'generating' }));
    setCurrentPath([]);
    setDrawingWireId(null);
    setHintWireId(null);
    setMoveHistory([]); // Clear move history when starting new level

    try {
      const levelData = await loadLevel(levelNum);

      // Store initial level state for restart
      setInitialLevelState({
        grid: JSON.parse(JSON.stringify(levelData.grid)), // Deep clone
        wires: JSON.parse(JSON.stringify(levelData.wires)), // Deep clone
        level: levelNum,
      });

      // Get grid size (all square grids)
      const gridSize = levelData.grid.length;

      setGameState({
        level: levelNum,
        grid: levelData.grid,
        gridSize,
        gridShape: 'square',
        wires: levelData.wires,
        status: 'playing',
        moves: 0,
        gridFilled: calculateGridFilled(levelData.grid),
        isPerfect: false,
        hintsUsed: 0,
        solution: levelData.solution, // Store solution for hints
        elapsedTime: 0,
        isPaused: false,
        levelStartTime: Date.now(),
      });
    } catch (error) {
      console.error('Failed to load level:', error);
      // Fallback to level 1
      try {
        const fallback = await loadLevel(1);

        // Store initial level state for restart
        setInitialLevelState({
          grid: JSON.parse(JSON.stringify(fallback.grid)),
          wires: JSON.parse(JSON.stringify(fallback.wires)),
          level: 1,
        });

        // Get grid size (all square grids)
        const gridSize = fallback.grid.length;

        setGameState({
          level: 1,
          grid: fallback.grid,
          gridSize,
          gridShape: 'square',
          wires: fallback.wires,
          status: 'playing',
          moves: 0,
          gridFilled: calculateGridFilled(fallback.grid),
          isPerfect: false,
          hintsUsed: 0,
          elapsedTime: 0,
          isPaused: false,
          levelStartTime: Date.now(),
        });
      } catch (fallbackError) {
        console.error('Failed to load fallback level:', fallbackError);
      }
    }
  }, []);

  const handleStartGame = () => {
    // Start from user's current level
    const levelToStart = userProfile?.currentLevel || 1;
    startLevel(levelToStart);
  };

  const handleNextLevel = () => {
    const nextLevel = gameState.level + 1;
    if (nextLevel <= TOTAL_LEVELS) {
      startLevel(nextLevel);
    } else {
      // Completed all levels!
      startLevel(1);
    }
  };

  const handleRestart = () => {
    // Use stored initial level state to restart with the exact same puzzle
    if (initialLevelState) {
      setCurrentPath([]);
      setDrawingWireId(null);
      setHintWireId(null);
      setMoveHistory([]);

      setGameState({
        level: initialLevelState.level,
        grid: JSON.parse(JSON.stringify(initialLevelState.grid)), // Deep clone
        gridSize: initialLevelState.grid.length,
        gridShape: 'square',
        wires: JSON.parse(JSON.stringify(initialLevelState.wires)), // Deep clone
        status: 'playing',
        moves: 0,
        gridFilled: calculateGridFilled(initialLevelState.grid),
        isPerfect: false,
        hintsUsed: 0,
        elapsedTime: 0,
        isPaused: false,
        levelStartTime: Date.now(),
      });
    } else {
      // Fallback: load a new level if no initial state is stored
      startLevel(gameState.level);
    }
  };

  // Conditional haptic feedback helper
  const triggerHaptic = useCallback((style: Haptics.ImpactFeedbackStyle | 'success') => {
    if (!settings.hapticFeedback) return;

    if (style === 'success') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      Haptics.impactAsync(style);
    }
  }, [settings.hapticFeedback]);

  // Settings handlers
  const handleOpenSettings = useCallback(() => {
    setIsSettingsVisible(true);
  }, []);

  const handleCloseSettings = useCallback(() => {
    setIsSettingsVisible(false);
  }, []);

  const handleSettingsChange = useCallback(async (newSettings: AppSettings) => {
    setSettings(newSettings);
    try {
      await saveSettings(newSettings);
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  }, []);

  // Profile handlers
  const handleProfileCreated = useCallback(async (profile: { username: string; avatarId: number }) => {
    try {
      const newProfile = await createNewProfile(profile.username, profile.avatarId);
      setUserProfile(newProfile);

      // Create initial global stats
      const initialStats = createDefaultGlobalStats();
      await saveGlobalStats(initialStats);
      setGlobalStats(initialStats);

      setIsProfileSetupVisible(false);
    } catch (error) {
      console.error('Failed to create profile:', error);
    }
  }, []);

  const handleShowProfile = useCallback(() => {
    setIsProfileVisible(true);
  }, []);

  const handleCloseProfile = useCallback(() => {
    setIsProfileVisible(false);
  }, []);

  const handleProfileUpdate = useCallback(async (updatedProfile: UserProfile) => {
    try {
      await saveUserProfile(updatedProfile);
      setUserProfile(updatedProfile);
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  }, []);

  const handleDeleteAccount = useCallback(async () => {
    try {
      await deleteProfile();
      setUserProfile(null);
      setGlobalStats(null);
      setLevelStatsMap(new Map());
      setIsProfileSetupVisible(true);
    } catch (error) {
      console.error('Failed to delete account:', error);
    }
  }, []);

  // Stats handlers
  const handleShowStats = useCallback(async () => {
    try {
      const stats = await loadGlobalStats();
      const allLevelStats = await loadAllLevelStats();
      setGlobalStats(stats);
      setLevelStatsMap(allLevelStats);
      setIsStatsVisible(true);
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  }, []);

  const handleCloseStats = useCallback(() => {
    setIsStatsVisible(false);
  }, []);

  // Shop handlers
  const handleShowShop = useCallback(() => {
    setIsShopVisible(true);
  }, []);

  const handleCloseShop = useCallback(() => {
    setIsShopVisible(false);
  }, []);

  // Messages handlers
  const handleShowMessages = useCallback(() => {
    setIsMessagesVisible(true);
  }, []);

  const handleCloseMessages = useCallback(() => {
    setIsMessagesVisible(false);
  }, []);

  // Class selection handlers
  // Class selection removed - using progressive difficulty

  const handleSelectLevel = useCallback(async (level: number) => {
    // Close modal and start the level
    // NOTE: We don't update currentLevel here - only when completing levels
    // This allows users to replay previous levels without losing progress
    setIsClassSelectionVisible(false);
    await startLevel(level);
  }, [startLevel]);

  const handleUnlockClass = useCallback(async (classId: string) => {
    const result = await unlockClass(classId);

    if (result.success) {
      // Refresh profile to show unlocked class
      const updatedProfile = await loadUserProfile();
      if (updatedProfile) {
        setUserProfile(updatedProfile);
      }
      // Show success message (you can add a toast/notification here)
      console.log(result.message);
    } else {
      // Show error message
      console.warn(result.message);
    }
  }, []);

  // Level complete handlers
  const handleLevelContinue = useCallback(() => {
    setIsLevelCompleteVisible(false);
    setLevelCompleteData(null);

    // Go to next level
    const nextLevel = gameState.level + 1;
    if (nextLevel <= TOTAL_LEVELS) {
      startLevel(nextLevel);
    } else {
      // All levels completed, go to menu
      setGameState(prev => ({ ...prev, status: 'menu' }));
    }
  }, [gameState.level, startLevel]);

  const handleLevelReplay = useCallback(() => {
    setIsLevelCompleteVisible(false);
    setLevelCompleteData(null);
    startLevel(gameState.level);
  }, [gameState.level, startLevel]);

  const handleLevelMainMenu = useCallback(() => {
    setIsLevelCompleteVisible(false);
    setLevelCompleteData(null);
    setGameState(prev => ({ ...prev, status: 'menu' }));
  }, []);

  // Timer handlers
  const handlePause = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      isPaused: true,
      levelPausedAt: Date.now(),
    }));
    setIsPauseMenuVisible(true);
  }, []);

  const handleResume = useCallback(() => {
    setGameState(prev => {
      const pauseDuration = Date.now() - (prev.levelPausedAt || 0);
      return {
        ...prev,
        isPaused: false,
        levelStartTime: (prev.levelStartTime || 0) + pauseDuration,
        levelPausedAt: undefined,
      };
    });
    setIsPauseMenuVisible(false);
  }, []);

  // Pause menu handlers
  const handlePauseMenuSettings = useCallback(() => {
    setIsPauseMenuVisible(false);
    setIsSettingsVisible(true);
  }, []);

  const handlePauseMenuMainMenu = useCallback(() => {
    setIsPauseMenuVisible(false);
    setGameState(prev => ({ ...prev, status: 'menu', isPaused: false }));
  }, []);

  // Save level completion stats
  const saveLevelCompletion = useCallback(async (level: number, completionTime: number, moves: number, stars: number, hintsUsed: number): Promise<{ coinsEarned: number; isFirstCompletion: boolean }> => {
    try {
      // Update level stats
      const currentLevelStats = await loadLevelStats(level);
      const isFirstCompletion = currentLevelStats.completions === 0;

      const updatedLevelStats: LevelStats = {
        levelNumber: level,
        attempts: currentLevelStats.attempts + 1,
        completions: currentLevelStats.completions + 1,
        bestTime: currentLevelStats.bestTime
          ? Math.min(currentLevelStats.bestTime, completionTime)
          : completionTime,
        bestMoves: currentLevelStats.bestMoves
          ? Math.min(currentLevelStats.bestMoves, moves)
          : moves,
        bestStars: Math.max(currentLevelStats.bestStars, stars),
        lastPlayedAt: Date.now(),
        firstCompletedAt: currentLevelStats.firstCompletedAt || Date.now(),
      };
      await saveLevelStats(level, updatedLevelStats);

      // Calculate coin reward
      const coinReward = calculateCoinReward(stars, isFirstCompletion);

      // Update global stats
      await incrementStats({
        totalLevelsCompleted: 1,
        totalPlayTime: completionTime,
        totalMoves: moves,
        totalHintsUsed: hintsUsed,
        totalStars: stars,
        perfectLevels: stars === 5 ? 1 : 0,
      });

      // Update user profile
      if (userProfile) {
        const nextLevel = level + 1;

        // Only update currentLevel if this is a new record (progressing forward)
        const newCurrentLevel = Math.max(userProfile.currentLevel, nextLevel);
        const { class: newClass, chapter: newChapter } = levelToClassChapter(newCurrentLevel);

        await updateProfile({
          currentLevel: newCurrentLevel,
          currentClass: newClass,
          currentChapter: newChapter,
          lastPlayedAt: Date.now(),
          totalPlayTime: userProfile.totalPlayTime + completionTime,
          coins: userProfile.coins + coinReward, // Add coin reward
        });

        // Refresh profile state
        const updatedProfile = await loadUserProfile();
        if (updatedProfile) {
          setUserProfile(updatedProfile);
        }
      }

      return { coinsEarned: coinReward, isFirstCompletion };
    } catch (error) {
      console.error('Failed to save level completion:', error);
      return { coinsEarned: 0, isFirstCompletion: false };
    }
  }, [userProfile]);

  // Handle cell press (start drawing)
  const handleCellPressIn = useCallback(
    (row: number, col: number) => {
      if (gameState.status !== 'playing') {
        return;
      }

      const cell = getCell(gameState.grid, { row, col });

      if (!cell || !cell.isPort) {
        return; // Can only start from port
      }

      // INTERACTION BLOCKING: If already drawing another wire, ignore touches on other wires
      if (drawingWireId && cell.wireId !== drawingWireId) {
        return;
      }

      triggerHaptic(Haptics.ImpactFeedbackStyle.Light);

      // Find the wire for this port
      const wire = gameState.wires.find(w => w.id === cell.wireId);

      if (!wire) {
        return;
      }

      // Clear existing path for this wire
      let newGrid = clearWirePath(gameState.grid, wire);

      // Start drawing
      isDrawingRef.current = true;
      lastCellRef.current = { row, col };
      setDrawingWireId(wire.id);
      setCurrentPath([{ row, col }]);
      setHintWireId(null); // Clear hint when starting to draw

      setGameState(prev => ({
        ...prev,
        grid: newGrid,
        wires: prev.wires.map(w => (w.id === wire.id ? { ...w, path: [], isComplete: false } : w)),
        gridFilled: calculateGridFilled(newGrid),
      }));
    },
    [gameState.grid, gameState.wires, gameState.status, drawingWireId]
  );

  // Handle cell move (continue drawing)
  const handleCellMove = useCallback(
    (row: number, col: number) => {
      if (!isDrawingRef.current || !drawingWireId) return;
      if (gameState.status !== 'playing') return;

      const lastCell = lastCellRef.current;
      if (!lastCell) return;

      // Skip if same cell
      if (lastCell.row === row && lastCell.col === col) return;

      // IMPORTANT: Check if wire is already complete - if so, stop accepting moves
      const currentWire = gameState.wires.find(w => w.id === drawingWireId);
      if (currentWire?.isComplete) {
        return; // Wire is complete, don't allow further movement
      }

      const newCoord = { row, col };

      // Check if backtracking (going back on path)
      const existingIndex = currentPath.findIndex(c => c.row === row && c.col === col);
      if (existingIndex !== -1) {
        // Backtrack: remove everything after this point
        const newPath = currentPath.slice(0, existingIndex + 1);
        lastCellRef.current = newCoord;
        setCurrentPath(newPath);

        // Update grid visually - FIRST clear old path, THEN set new path
        const wire = gameState.wires.find(w => w.id === drawingWireId);
        if (wire) {
          // Clear the entire current path from grid
          let clearedGrid = clearWirePath(gameState.grid, wire);

          // Now set the new (shorter) path
          const result = setWirePath(clearedGrid, wire, newPath);
          const updatedWires = gameState.wires.map(w => (w.id === drawingWireId ? result.wire : w));
          setGameState(prev => ({
            ...prev,
            grid: result.grid,
            wires: updatedWires,
            gridFilled: calculateGridFilled(result.grid),
          }));
        }
        return;
      }

      // Check if valid move (must be adjacent to last cell)
      if (!isValidMove(gameState.grid, lastCell, { row, col }, drawingWireId)) return;

      // Add new cell to path
      const newPath = [...currentPath, newCoord];
      lastCellRef.current = newCoord;
      setCurrentPath(newPath);

      // Update grid visually in real-time during drawing
      const wire = gameState.wires.find(w => w.id === drawingWireId);
      if (wire) {
        const result = setWirePath(gameState.grid, wire, newPath);
        const updatedWires = gameState.wires.map(w => (w.id === drawingWireId ? result.wire : w));
        const newGridFilled = calculateGridFilled(result.grid);

        setGameState(prev => {
          const newMoves = result.wire.isComplete && !wire.isComplete ? prev.moves + 1 : prev.moves;

          // Save to history when a wire is completed
          if (result.wire.isComplete && !wire.isComplete) {
            setMoveHistory(history => [...history, {
              grid: prev.grid,
              wires: prev.wires,
              moves: prev.moves,
              gridFilled: prev.gridFilled,
            }]);
          }

          return {
            ...prev,
            grid: result.grid,
            wires: updatedWires,
            gridFilled: newGridFilled,
            moves: newMoves,
          };
        });

        // IMPORTANT: If wire just became complete, stop accepting further moves
        if (result.wire.isComplete) {
          // Trigger haptic feedback
          triggerHaptic('success');
          // Stop drawing
          isDrawingRef.current = false;
          setDrawingWireId(null);
          setCurrentPath([]);
          lastCellRef.current = null;

          // Check win condition
          const hasWon = checkWinCondition(result.grid, updatedWires);

          if (hasWon) {
            triggerHaptic('success');

            // Calculate stars based on grid fill percentage
            let stars = 5;
            if (newGridFilled < 100) {
              if (newGridFilled >= 95) {
                stars = 4;
              } else if (newGridFilled >= 85) {
                stars = 3;
              } else if (newGridFilled >= 70) {
                stars = 2;
              } else {
                stars = 1;
              }
            }

            // Update state with stars
            setGameState(prev => ({
              ...prev,
              stars,
            }));

            // Quick visual feedback (subtle scale animation)
            Animated.sequence([
              Animated.timing(winAnimScale, {
                toValue: 1.03,
                duration: 150,
                useNativeDriver: true,
              }),
              Animated.timing(winAnimScale, {
                toValue: 1,
                duration: 150,
                useNativeDriver: true,
              }),
            ]).start();

            // Save level completion stats and show modal
            saveLevelCompletion(
              gameState.level,
              gameState.elapsedTime,
              gameState.moves + 1,
              stars,
              gameState.hintsUsed
            ).then((result) => {
              // Show level complete modal after short delay
              setTimeout(() => {
                setLevelCompleteData({
                  level: gameState.level,
                  stars,
                  moves: gameState.moves + 1,
                  time: gameState.elapsedTime,
                  coinsEarned: result.coinsEarned,
                  isFirstCompletion: result.isFirstCompletion,
                });
                setIsLevelCompleteVisible(true);
              }, 800);
            });
          }
        }
      }
    },
    [currentPath, drawingWireId, gameState.grid, gameState.wires, gameState.status, gameState.level, gameState.elapsedTime, gameState.moves, gameState.hintsUsed, startLevel, winAnimScale, winAnimOpacity, triggerHaptic, settings.autoAdvance, saveLevelCompletion]
  );

  // Handle cell press out (finish drawing)
  const handleCellPressOut = useCallback(() => {
    if (!isDrawingRef.current || !drawingWireId) return;

    isDrawingRef.current = false;
    lastCellRef.current = null;

    const wire = gameState.wires.find(w => w.id === drawingWireId);
    if (!wire || currentPath.length === 0) {
      setDrawingWireId(null);
      setCurrentPath([]);
      return;
    }

    // Check if the path would complete the wire
    const result = setWirePath(gameState.grid, wire, currentPath);

    // IMPORTANT: If wire is NOT complete, discard the path (don't save it)
    if (!result.wire.isComplete) {
      // Clear any partial path from the grid
      const clearedGrid = clearWirePath(gameState.grid, wire);
      setGameState(prev => ({
        ...prev,
        grid: clearedGrid,
      }));
      setDrawingWireId(null);
      setCurrentPath([]);
      return;
    }

    // Wire is complete - save it
    const newGrid = result.grid;
    const updatedWire = result.wire;

    // Update state
    const newWires = gameState.wires.map(w => (w.id === wire.id ? updatedWire : w));
    const newGridFilled = calculateGridFilled(newGrid);
    const newMoves = gameState.moves + 1;

    // Haptic feedback when wire is completed
    triggerHaptic('success');

    // Save to history
    setMoveHistory(history => [...history, {
      grid: gameState.grid,
      wires: gameState.wires,
      moves: gameState.moves,
      gridFilled: gameState.gridFilled,
    }]);

    setGameState(prev => ({
      ...prev,
      grid: newGrid,
      wires: newWires,
      gridFilled: newGridFilled,
      moves: newMoves,
    }));

    // Check win condition
    const hasWon = checkWinCondition(newGrid, newWires);

    if (hasWon) {
      triggerHaptic('success');

      // Calculate stars based on grid fill percentage (1-5 stars)
      // 100% = 5 stars, less than 100% = fewer stars based on how much is filled
      let stars = 5;
      if (newGridFilled < 100) {
        if (newGridFilled >= 95) {
          stars = 4;
        } else if (newGridFilled >= 85) {
          stars = 3;
        } else if (newGridFilled >= 70) {
          stars = 2;
        } else {
          stars = 1;
        }
      }

      // Update state with stars
      setGameState(prev => ({
        ...prev,
        stars,
      }));

      // Quick visual feedback (subtle scale animation)
      Animated.sequence([
        Animated.timing(winAnimScale, {
          toValue: 1.03,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(winAnimScale, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();

      // Save level completion stats and show modal
      saveLevelCompletion(
        gameState.level,
        gameState.elapsedTime,
        newMoves,
        stars,
        gameState.hintsUsed
      ).then((result) => {
        // Show level complete modal after short delay
        setTimeout(() => {
          setLevelCompleteData({
            level: gameState.level,
            stars,
            moves: newMoves,
            time: gameState.elapsedTime,
            coinsEarned: result.coinsEarned,
            isFirstCompletion: result.isFirstCompletion,
          });
          setIsLevelCompleteVisible(true);
        }, 800);
      });
    }

    setDrawingWireId(null);
    setCurrentPath([]);
  }, [currentPath, drawingWireId, gameState.wires, gameState.grid, gameState.moves, gameState.level, gameState.elapsedTime, gameState.hintsUsed, startLevel, triggerHaptic, settings.autoAdvance, winAnimScale, winAnimOpacity, saveLevelCompletion]);

  // Undo last completed wire (clears the entire color path if connected)
  const handleUndo = useCallback(() => {
    if (gameState.status !== 'playing') return;

    // Find the last completed wire
    const lastCompletedWire = [...gameState.wires].reverse().find(w => w.isComplete);
    if (!lastCompletedWire) return; // No completed wires to undo

    triggerHaptic(Haptics.ImpactFeedbackStyle.Medium);

    // Clear the path of this wire
    const clearedGrid = clearWirePath(gameState.grid, lastCompletedWire);
    const updatedWires = gameState.wires.map(w =>
      w.id === lastCompletedWire.id
        ? { ...w, path: [], isComplete: false }
        : w
    );

    // Recalculate grid filled percentage
    const newGridFilled = calculateGridFilled(clearedGrid);

    // Update game state
    setGameState(prev => ({
      ...prev,
      grid: clearedGrid,
      wires: updatedWires,
      gridFilled: newGridFilled,
      moves: prev.moves + 1, // Undo counts as a move
    }));

    // Clear hint if it was showing
    setHintWireId(null);
  }, [gameState.wires, gameState.grid, gameState.status, triggerHaptic]);

  // Clear all paths (reset the level)
  const handleClearAll = useCallback(() => {
    if (gameState.status !== 'playing') return;

    // Check if there are any completed wires to clear
    const hasCompletedWires = gameState.wires.some(w => w.isComplete);
    if (!hasCompletedWires) return; // Nothing to clear

    triggerHaptic(Haptics.ImpactFeedbackStyle.Heavy);

    // Clear all wire paths from the grid
    let newGrid = gameState.grid;
    gameState.wires.forEach(wire => {
      newGrid = clearWirePath(newGrid, wire);
    });

    setGameState(prev => ({
      ...prev,
      grid: newGrid,
      wires: prev.wires.map(w => ({ ...w, path: [], isComplete: false })),
      gridFilled: calculateGridFilled(newGrid),
      moves: 0, // Reset moves to 0
    }));

    // Clear move history
    setMoveHistory([]);

    // Clear hint if it was showing
    setHintWireId(null);
  }, [gameState.wires, gameState.grid, gameState.status, triggerHaptic]);

  // Auto-solve hint (costs 10 coins, automatically connects next solvable wire)
  const handleHint = useCallback(async () => {
    if (gameState.status !== 'playing') return;
    if (!userProfile) return;

    // Check if user has enough coins
    const HINT_COST = 10;
    if (userProfile.coins < HINT_COST) {
      // Not enough coins - show message (you can add a toast here)
      console.warn('Not enough coins for hint! Need 10 coins.');
      triggerHaptic(Haptics.ImpactFeedbackStyle.Heavy);
      return;
    }

    // Check if solution is available
    if (!gameState.solution || gameState.solution.length === 0) {
      console.warn('[Hint] No solution available - cannot solve automatically');
      triggerHaptic(Haptics.ImpactFeedbackStyle.Heavy);
      return;
    }

    triggerHaptic(Haptics.ImpactFeedbackStyle.Medium);

    // Deduct coins
    try {
      await updateProfile({
        coins: userProfile.coins - HINT_COST,
      });

      // Refresh profile
      const updatedProfile = await loadUserProfile();
      if (updatedProfile) {
        setUserProfile(updatedProfile);
      }

      // Save current state to history
      setMoveHistory(history => [...history, {
        grid: gameState.grid,
        wires: gameState.wires,
        moves: gameState.moves,
        gridFilled: gameState.gridFilled,
      }]);

      let currentGrid = gameState.grid;
      const updatedWires = [...gameState.wires];

      // Check if any wire has a path (user has connected some ports)
      const hasAnyConnection = updatedWires.some(wire => wire.path.length > 0);

      if (hasAnyConnection) {
        // User has made some connections - check for incorrect ones
        console.log('[Hint] User has connections - checking for incorrect paths');

        for (let i = 0; i < updatedWires.length; i++) {
          const wire = updatedWires[i];
          const solutionPath = gameState.solution[i];

          // Skip if wire has no path
          if (wire.path.length === 0) continue;

          // Check if current path matches solution
          const isPathCorrect = wire.path.length === solutionPath.length &&
            wire.path.every((coord, idx) =>
              coord.row === solutionPath[idx].row &&
              coord.col === solutionPath[idx].col
            );

          if (!isPathCorrect) {
            // Path is incorrect - clear it
            console.log(`[Hint] Clearing incorrect path for wire ${i}`);
            currentGrid = clearWirePath(currentGrid, wire);
            updatedWires[i] = {
              ...wire,
              path: [],
              isComplete: false,
            };
          }
        }
      }

      // Find the first incomplete wire to solve
      let nextIncompleteIndex = -1;
      for (let i = 0; i < updatedWires.length; i++) {
        if (!updatedWires[i].isComplete) {
          nextIncompleteIndex = i;
          break;
        }
      }

      // If no incomplete wire found, do nothing
      if (nextIncompleteIndex === -1) {
        console.log('[Hint] All wires already complete');
        setGameState(prev => ({
          ...prev,
          grid: currentGrid,
          wires: updatedWires,
          gridFilled: calculateGridFilled(currentGrid),
        }));
        return;
      }

      // Apply only this wire's solution path
      const solutionPath = gameState.solution[nextIncompleteIndex];
      const wire = updatedWires[nextIncompleteIndex];

      if (solutionPath && wire) {
        const result = setWirePath(currentGrid, wire, solutionPath);
        currentGrid = result.grid;
        updatedWires[nextIncompleteIndex] = result.wire;
        console.log(`[Hint] Applied solution path ${nextIncompleteIndex}: ${solutionPath.length} cells, complete=${result.wire.isComplete}`);
      }

      setGameState(prev => ({
        ...prev,
        grid: currentGrid,
        wires: updatedWires,
        gridFilled: calculateGridFilled(currentGrid),
        moves: prev.moves + 1,
        hintsUsed: prev.hintsUsed + 1,
      }));

      // Trigger success haptic for wire completion
      triggerHaptic('success');

      // Check win condition
      const hasWon = checkWinCondition(currentGrid, updatedWires);
      if (hasWon) {
        // Handle win (same as in handleCellMove)
        const newGridFilled = calculateGridFilled(currentGrid);
        let stars = 5;
        if (newGridFilled < 100) {
          if (newGridFilled >= 95) stars = 4;
          else if (newGridFilled >= 85) stars = 3;
          else if (newGridFilled >= 70) stars = 2;
          else stars = 1;
        }

        setGameState(prev => ({ ...prev, status: 'won', stars }));

        saveLevelCompletion(
          gameState.level,
          gameState.elapsedTime,
          gameState.moves + 1,
          stars,
          gameState.hintsUsed + 1
        ).then((result) => {
          setTimeout(() => {
            setLevelCompleteData({
              level: gameState.level,
              stars,
              moves: gameState.moves + 1,
              time: gameState.elapsedTime,
              coinsEarned: result.coinsEarned,
              isFirstCompletion: result.isFirstCompletion,
            });
            setIsLevelCompleteVisible(true);
          }, 800);
        });
      }

      // Clear hint highlight
      setHintWireId(null);
    } catch (error) {
      console.error('Failed to use hint:', error);
    }
  }, [gameState.grid, gameState.wires, gameState.status, gameState.moves, gameState.gridFilled, gameState.level, gameState.elapsedTime, gameState.hintsUsed, userProfile, triggerHaptic, saveLevelCompletion]);

  const gridSize = Math.min(width - 64, height * 0.55);
  const cellSize = calculateCellSize(gameState.gridSize);

  // Grid dimensions (all square grids now)
  const gridRows = gameState.gridSize;
  const gridCols = gameState.gridSize;

  // Helper: Convert touch coordinates to grid cell position
  const getCellFromTouch = useCallback((evt: any) => {
    // Get absolute touch coordinates on screen
    const { pageX, pageY } = evt.nativeEvent.touches?.[0] || evt.nativeEvent;

    // Get grid layout
    const layout = gridLayoutRef.current;
    if (layout.width === 0 || layout.height === 0) {
      return null;
    }

    // Calculate touch position relative to grid
    const touchX = pageX - layout.x;
    const touchY = pageY - layout.y;

    // Calculate actual cell size from layout (all square grids)
    const actualCellWidth = layout.width / gameState.gridSize;
    const actualCellHeight = layout.height / gameState.gridSize;

    const col = Math.floor(touchX / actualCellWidth);
    const row = Math.floor(touchY / actualCellHeight);

    if (row >= 0 && row < gameState.gridSize && col >= 0 && col < gameState.gridSize) {
      return { row, col };
    }
    return null;
  }, [gameState.gridSize]);

  // PanResponder for drag handling
  const panResponder = useMemo(
    () => PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,

      onPanResponderGrant: (evt) => {
        const cellPos = getCellFromTouch(evt);
        if (cellPos) {
          handleCellPressIn(cellPos.row, cellPos.col);
        }
      },

      onPanResponderMove: (evt) => {
        if (isDrawingRef.current) {
          const cellPos = getCellFromTouch(evt);
          if (cellPos) {
            handleCellMove(cellPos.row, cellPos.col);
          }
        }
      },

      onPanResponderRelease: () => {
        handleCellPressOut();
      },

      onPanResponderTerminate: () => {
        handleCellPressOut();
      },
    }),
    [handleCellPressIn, handleCellMove, handleCellPressOut, getCellFromTouch]
  );

  // Show loading screen until settings are loaded
  if (!settingsLoaded) {
    return (
      <View style={[styles.container, { backgroundColor: '#0a0a0a', justifyContent: 'center', alignItems: 'center' }]}>
        <StatusBar style="light" />
        <Text style={{ color: '#ffffff', fontSize: 18 }}>Yükleniyor...</Text>
      </View>
    );
  }

  return (
    <ThemeProvider settings={settings}>
      <LanguageProvider settings={settings}>
        <View style={styles.container}>
          <StatusBar style={settings.theme === 'dark' ? 'light' : 'dark'} />

      {/* SCREEN: PROFILE SETUP (First Time) - Block everything until profile is created */}
      {isProfileSetupVisible ? (
        <ProfileSetup onProfileCreated={handleProfileCreated} />
      ) : (
        <>
          {/* SCREEN: MAIN MENU */}
          {gameState.status === 'menu' && (
            <MainMenu
              onStart={handleStartGame}
              onSettings={handleOpenSettings}
              userProfile={userProfile}
              currentLevel={userProfile?.currentLevel || 1}
              onShowProfile={handleShowProfile}
              onShowStats={handleShowStats}
              onShowShop={handleShowShop}
              onShowMessages={handleShowMessages}
            />
          )}

      {/* SCREEN: GAME */}
      {(gameState.status === 'playing' || gameState.status === 'won' || gameState.status === 'generating') && (
        <>
          <GameHeader
            level={gameState.level}
            moves={gameState.moves}
            flowPercentage={gameState.gridFilled}
            elapsedTime={gameState.elapsedTime}
            isPaused={gameState.isPaused}
            onPause={handlePause}
            coins={userProfile?.coins || 0}
          />

          {/* Game Board */}
          <View
            style={styles.gameBoardArea}
          >
            <Animated.View
              ref={gridRef}
              {...panResponder.panHandlers}
              style={[
                styles.gameBoardContainer,
                { width: gridSize, height: gridSize },
                { transform: [{ scale: winAnimScale }] }
              ]}
              onLayout={() => {
                // Measure grid position on screen
                if (gridRef.current) {
                  gridRef.current.measure((_x, _y, width, height, pageX, pageY) => {
                    gridLayoutRef.current = { x: pageX, y: pageY, width, height };
                  });
                }
              }}
            >
              {gameState.grid.map((row, rIndex) => (
                <View key={`row-${rIndex}`} style={styles.gridRow}>
                  {row.map((cell, cIndex) => {
                    const isInCurrentPath = currentPath.some(
                      c => c.row === rIndex && c.col === cIndex
                    );
                    const isHint =
                      hintWireId !== null && cell?.wireId === hintWireId && cell?.isPort;

                    // Calculate wire connections for this cell
                    // Use drawingWireId when actively drawing, otherwise use cell's wireId
                    const wireId = isInCurrentPath ? drawingWireId : cell?.wireId;

                    // IMPORTANT: Show wire segments for:
                    // 1. The wire being drawn (current wire)
                    // 2. ALL completed wires (so player can see where they already drew)
                    // This helps player avoid conflicts and plan their path
                    const wire = gameState.wires.find(w => w.id === wireId);
                    const isWireComplete = wire?.isComplete || false;
                    const shouldShowWireSegments = !drawingWireId || wireId === drawingWireId || isWireComplete;

                    // Check all 4 neighbors for wire connections
                    // CRITICAL: Always follow the path sequence, never just check grid neighbors
                    let hasTopCheck = false, hasBottomCheck = false, hasLeftCheck = false, hasRightCheck = false;

                    if (shouldShowWireSegments && cell && wireId && (cell.state === 'path' || cell.isPort || isInCurrentPath)) {
                      // Determine which path to use
                      let pathToUse: Coordinate[] | null = null;

                      if (isInCurrentPath) {
                        // Currently drawing - use currentPath
                        pathToUse = currentPath;
                      } else {
                        // Completed wire - find the wire and use its path
                        const wire = gameState.wires.find(w => w.id === wireId);
                        if (wire && wire.path && wire.path.length > 0) {
                          pathToUse = wire.path;
                        }
                      }

                      // If we have a path, use it to determine connections
                      if (pathToUse) {
                        const pathIndex = pathToUse.findIndex(c => c.row === rIndex && c.col === cIndex);
                        if (pathIndex !== -1) {
                          // Connect to previous cell in path
                          if (pathIndex > 0) {
                            const prev = pathToUse[pathIndex - 1];
                            if (prev.row === rIndex - 1 && prev.col === cIndex) hasTopCheck = true;
                            if (prev.row === rIndex + 1 && prev.col === cIndex) hasBottomCheck = true;
                            if (prev.row === rIndex && prev.col === cIndex - 1) hasLeftCheck = true;
                            if (prev.row === rIndex && prev.col === cIndex + 1) hasRightCheck = true;
                          }
                          // Connect to next cell in path
                          if (pathIndex < pathToUse.length - 1) {
                            const next = pathToUse[pathIndex + 1];
                            if (next.row === rIndex - 1 && next.col === cIndex) hasTopCheck = true;
                            if (next.row === rIndex + 1 && next.col === cIndex) hasBottomCheck = true;
                            if (next.row === rIndex && next.col === cIndex - 1) hasLeftCheck = true;
                            if (next.row === rIndex && next.col === cIndex + 1) hasRightCheck = true;
                          }
                        }
                      }
                    }

                    // Use the calculated connections directly
                    // Since we're following the path sequence, each cell will have at most 2 connections
                    const hasTop = hasTopCheck;
                    const hasBottom = hasBottomCheck;
                    const hasLeft = hasLeftCheck;
                    const hasRight = hasRightCheck;

                    return (
                      <View
                        key={`${rIndex}-${cIndex}`}
                        style={[styles.gridCell, { width: cellSize, height: cellSize }]}
                      >
                        <WireCell
                          data={cell}
                          size={gameState.gridSize}
                          isDrawing={isInCurrentPath}
                          isHint={isHint}
                          hasTop={hasTop}
                          hasBottom={hasBottom}
                          hasLeft={hasLeft}
                          hasRight={hasRight}
                        />
                      </View>
                    );
                  })}
                </View>
              ))}
            </Animated.View>

            {/* Control Buttons */}
            <View style={styles.controlsContainer}>
              <TouchableOpacity
                onPress={handleUndo}
                style={[
                  styles.controlButton,
                  moveHistory.length === 0 && styles.controlButtonDisabled
                ]}
                disabled={moveHistory.length === 0}
              >
                <Text style={[
                  styles.controlButtonText,
                  moveHistory.length === 0 && styles.controlButtonTextDisabled
                ]}>
                  ↶ {settings.language === 'tr' ? 'Geri Al' : 'Undo'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleClearAll}
                style={[
                  styles.controlButton,
                  !gameState.wires.some(w => w.isComplete) && styles.controlButtonDisabled
                ]}
                disabled={!gameState.wires.some(w => w.isComplete)}
              >
                <Text style={[
                  styles.controlButtonText,
                  !gameState.wires.some(w => w.isComplete) ? styles.controlButtonTextDisabled : undefined
                ]}>
                  ⊗ {settings.language === 'tr' ? 'Temizle' : 'Clear'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleHint}
                style={[
                  styles.controlButton,
                  userProfile && userProfile.coins < 10 && styles.controlButtonDisabled
                ]}
                disabled={!!(userProfile && userProfile.coins < 10)}
              >
                <Text style={[
                  styles.controlButtonText,
                  userProfile && userProfile.coins < 10 && styles.controlButtonTextDisabled
                ]}>
                  💡 {settings.language === 'tr' ? 'İpucu (10🪙)' : 'Hint (10🪙)'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Footer - Show stars after completion */}
          <View style={styles.footer}>
            <View style={styles.footerContent}>
              <Text style={styles.footerText}>
                {settings.language === 'tr' ? 'Seviye' : 'Level'} {gameState.level}
              </Text>
              {gameState.stars && gameState.stars > 0 && (
                <Text style={styles.footerStars}>
                  {'⭐'.repeat(gameState.stars)}
                </Text>
              )}
            </View>
            {/* AdMob Banner */}
            <AdBanner position="bottom" />
          </View>
        </>
      )}

          {/* Overlays */}
          {gameState.status === 'generating' && (
            <Overlay
              type={gameState.status}
              level={gameState.level}
              moves={gameState.moves}
              isPerfect={gameState.isPerfect}
              onRestart={handleRestart}
              onNextLevel={handleNextLevel}
            />
          )}

          {/* Settings Modal */}
          <SettingsModal
            visible={isSettingsVisible}
            settings={settings}
            onClose={handleCloseSettings}
            onSettingsChange={handleSettingsChange}
          />

          {/* Profile Modal */}
          {userProfile && (
            <ProfileModal
              visible={isProfileVisible}
              profile={userProfile}
              onClose={handleCloseProfile}
              onProfileUpdate={handleProfileUpdate}
              onDeleteAccount={handleDeleteAccount}
            />
          )}

          {/* Stats Modal */}
          {globalStats && (
            <StatsModal
              visible={isStatsVisible}
              globalStats={globalStats}
              levelStatsMap={levelStatsMap}
              onClose={handleCloseStats}
            />
          )}

          {/* Shop Modal */}
          <ShopModal
            visible={isShopVisible}
            onClose={handleCloseShop}
          />

          {/* Messages Modal */}
          <MessagesModal
            visible={isMessagesVisible}
            onClose={handleCloseMessages}
          />

          {/* Pause Menu */}
          <PauseMenu
            visible={isPauseMenuVisible}
            level={gameState.level}
            onResume={handleResume}
            onRestart={handleRestart}
            onSettings={handlePauseMenuSettings}
            onMainMenu={handlePauseMenuMainMenu}
          />

          {/* Class Selection Modal - REMOVED: Using progressive difficulty */}

          {/* Level Complete Modal */}
          {levelCompleteData && (
            <LevelCompleteModal
              visible={isLevelCompleteVisible}
              level={levelCompleteData.level}
              stars={levelCompleteData.stars}
              moves={levelCompleteData.moves}
              time={levelCompleteData.time}
              coinsEarned={levelCompleteData.coinsEarned}
              isFirstCompletion={levelCompleteData.isFirstCompletion}
              onContinue={handleLevelContinue}
              onReplay={handleLevelReplay}
              onMainMenu={handleLevelMainMenu}
            />
          )}
        </>
      )}
        </View>
      </LanguageProvider>
    </ThemeProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  gameBoardArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  gameBoardContainer: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 2,
    borderColor: '#2a2a2a',
    alignSelf: 'center',
  },
  gridRow: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'center',
  },
  gridCell: {
    position: 'relative',
  },
  controlsContainer: {
    flexDirection: 'row',
    marginTop: 24,
    gap: 12,
  },
  controlButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#3a3a3a',
    minWidth: 90,
    alignItems: 'center',
  },
  controlButtonActive: {
    backgroundColor: '#00ff41',
    borderColor: '#00ff41',
  },
  controlButtonDisabled: {
    backgroundColor: '#1a1a1a',
    borderColor: '#2a2a2a',
    opacity: 0.4,
  },
  controlButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#e0e0e0',
  },
  controlButtonTextActive: {
    color: '#000000',
  },
  controlButtonTextDisabled: {
    color: '#6b7280',
  },
  footer: {
    padding: 16,
    alignItems: 'center',
  },
  footerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  footerText: {
    color: '#9ca3af',
    fontSize: 13,
    fontWeight: '600',
  },
  footerStars: {
    fontSize: 16,
    letterSpacing: 2,
  },
  successOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  successText: {
    fontSize: 48,
    fontWeight: '800',
    color: '#10b981',
    textShadowColor: 'rgba(16, 185, 129, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
    letterSpacing: 2,
  },
  starsText: {
    fontSize: 36,
    marginTop: 16,
    letterSpacing: 4,
  },
});

export default App;
