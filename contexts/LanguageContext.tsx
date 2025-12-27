// Language Context - Turkish/English Translation Support

import React, { createContext, useContext, ReactNode } from 'react';
import { AppSettings } from '../types';

interface Translations {
  // Main Menu
  mainMenu: {
    title: string;
    play: string;
    continue: string;
    level: string;
    settings: string;
    stats: string;
  };

  // Class Selection
  classSelection: {
    choose: string;
    chapter: string;
    back: string;
    currentWorld: string;
    locked: string;
    unlock: string;
    selectClass: string;
    chapters: string;
    perfectAll: string;
    progress: string;
    completed: string;
  };

  // Game Screen
  game: {
    level: string;
    moves: string;
    filled: string;
    stars: string;
    pause: string;
    undo: string;
    clear: string;
    hint: string;
    coins: string;
  };

  // Win Modal
  win: {
    levelComplete: string;
    excellent: string;
    great: string;
    good: string;
    completed: string;
    time: string;
    moves: string;
    perfect: string;
    coins: string;
    nextLevel: string;
    retry: string;
    menu: string;
  };

  // Settings
  settings: {
    title: string;
    hapticFeedback: string;
    hapticDesc: string;
    soundEffects: string;
    soundDesc: string;
    autoAdvance: string;
    autoAdvanceDesc: string;
    theme: string;
    themeLight: string;
    themeDark: string;
    language: string;
    languageTurkish: string;
    languageEnglish: string;
    version: string;
  };

  // Profile
  profile: {
    username: string;
    level: string;
    coins: string;
    stars: string;
    playTime: string;
    edit: string;
    save: string;
    cancel: string;
  };

  // Classes
  classes: {
    basic: string;
    basicDesc: string;
    medium: string;
    mediumDesc: string;
    hard: string;
    hardDesc: string;
  };

  // Stats
  stats: {
    title: string;
    globalStats: string;
    levelsCompleted: string;
    totalTime: string;
    totalStars: string;
    perfectLevels: string;
    totalMoves: string;
    currentStreak: string;
    longestStreak: string;
    levelStats: string;
    noLevelsCompleted: string;
    level: string;
    bestTime: string;
    bestMoves: string;
    completions: string;
    days: string;
  };

  // Shop
  shop: {
    title: string;
    comingSoon: string;
    comingSoonDesc: string;
    previewItems: string;
    premiumThemes: string;
    premiumThemesDesc: string;
    avatarPack: string;
    avatarPackDesc: string;
    powerups: string;
    powerupsDesc: string;
  };

  // Messages
  messages: {
    title: string;
    noMessages: string;
    update: string;
    achievement: string;
    info: string;
  };

  // Common
  common: {
    close: string;
    confirm: string;
    cancel: string;
    yes: string;
    no: string;
    ok: string;
  };
}

const turkishTranslations: Translations = {
  mainMenu: {
    title: 'WIRE MASTER',
    play: 'OYNA',
    continue: 'Devam Et',
    level: 'Seviye',
    settings: 'AYARLAR',
    stats: 'İSTATİSTİKLER',
  },

  classSelection: {
    choose: 'SEÇ',
    chapter: 'BÖLÜM',
    back: 'GERİ',
    currentWorld: 'MEVCUT DÜNYA',
    locked: 'Kilitli',
    unlock: 'Aç',
    selectClass: 'Sınıf Seç',
    chapters: 'Bölüm',
    perfectAll: 'Tüm bölümleri 5⭐ ile tamamla',
    progress: 'İLERLEME',
    completed: 'TAMAMLANDI',
  },

  game: {
    level: 'SEVİYE',
    moves: 'HAMLE',
    filled: 'DOLU',
    stars: 'YILDIZ',
    pause: 'DURAKLAT',
    undo: 'GERİ AL',
    clear: 'TEMİZLE',
    hint: 'İPUCU',
    coins: 'COİN',
  },

  win: {
    levelComplete: 'SEVİYE TAMAMLANDI!',
    excellent: 'Mükemmel!',
    great: 'Harika!',
    good: 'İyi!',
    completed: 'Tamamlandı!',
    time: 'Süre',
    moves: 'Hamle',
    perfect: 'Mükemmel Çözüm!',
    coins: 'Kazanılan Coin',
    nextLevel: 'SONRAKİ SEVİYE',
    retry: 'YENİDEN DENE',
    menu: 'MENÜ',
  },

  settings: {
    title: 'Ayarlar',
    hapticFeedback: 'Titreşim',
    hapticDesc: 'Dokunmalarda titreşim',
    soundEffects: 'Ses Efektleri',
    soundDesc: 'Ses geri bildirimi (yakında)',
    autoAdvance: 'Otomatik İlerleme',
    autoAdvanceDesc: 'Tamamlandıktan sonra sonraki seviye',
    theme: 'Tema',
    themeLight: 'Açık Mod',
    themeDark: 'Koyu Mod',
    language: 'Dil',
    languageTurkish: 'Türkçe',
    languageEnglish: 'İngilizce',
    version: 'Wire Master v',
  },

  profile: {
    username: 'Kullanıcı Adı',
    level: 'Seviye',
    coins: 'Coin',
    stars: 'Yıldız',
    playTime: 'Oyun Süresi',
    edit: 'DÜZENLE',
    save: 'KAYDET',
    cancel: 'İPTAL',
  },

  classes: {
    basic: 'Başlangıç',
    basicDesc: 'Temel bulmacalar ile başla',
    medium: 'Orta',
    mediumDesc: 'Daha zorlayıcı bulmacalar',
    hard: 'Zor',
    hardDesc: 'Uzman seviye bulmacalar',
  },

  stats: {
    title: 'İstatistikler',
    globalStats: 'Genel İstatistikler',
    levelsCompleted: 'Tamamlanan Level',
    totalTime: 'Toplam Süre',
    totalStars: 'Toplam Yıldız',
    perfectLevels: 'Perfect (5⭐)',
    totalMoves: 'Toplam Hamle',
    currentStreak: 'Güncel Seri',
    longestStreak: 'En Uzun Seri',
    levelStats: 'Level İstatistikleri',
    noLevelsCompleted: 'Henüz level tamamlanmamış',
    level: 'Level',
    bestTime: 'En İyi Süre',
    bestMoves: 'En Az Hamle',
    completions: 'Tamamlama',
    days: 'gün',
  },

  shop: {
    title: 'Mağaza',
    comingSoon: 'Yakında!',
    comingSoonDesc: 'Premium temalar, avatarlar ve güçlendirmeleri satın alın.',
    previewItems: 'Önizleme Öğeleri',
    premiumThemes: 'Premium Temalar',
    premiumThemesDesc: 'Koyu mod, neon ve retro temaların kilidini açın',
    avatarPack: 'Avatar Paketi',
    avatarPackDesc: '20 özel animasyonlu avatar',
    powerups: 'Güçlendirme Paketi',
    powerupsDesc: '1 ay için sınırsız ipucu ve geri alma',
  },

  messages: {
    title: 'Mesajlar',
    noMessages: 'Henüz mesaj yok',
    update: 'GÜNCELLEME',
    achievement: 'BAŞARI',
    info: 'BİLGİ',
  },

  common: {
    close: 'Kapat',
    confirm: 'Onayla',
    cancel: 'İptal',
    yes: 'Evet',
    no: 'Hayır',
    ok: 'Tamam',
  },
};

const englishTranslations: Translations = {
  mainMenu: {
    title: 'WIRE MASTER',
    play: 'PLAY',
    continue: 'Continue',
    level: 'Level',
    settings: 'SETTINGS',
    stats: 'STATISTICS',
  },

  classSelection: {
    choose: 'CHOOSE',
    chapter: 'CHAPTER',
    back: 'BACK',
    currentWorld: 'CURRENT WORLD',
    locked: 'Locked',
    unlock: 'Unlock',
    selectClass: 'Select Class',
    chapters: 'Chapters',
    perfectAll: 'Perfect (5⭐) all',
    progress: 'PROGRESS',
    completed: 'COMPLETED',
  },

  game: {
    level: 'LEVEL',
    moves: 'MOVES',
    filled: 'FILLED',
    stars: 'STARS',
    pause: 'PAUSE',
    undo: 'UNDO',
    clear: 'CLEAR',
    hint: 'HINT',
    coins: 'COINS',
  },

  win: {
    levelComplete: 'LEVEL COMPLETE!',
    excellent: 'Excellent!',
    great: 'Great!',
    good: 'Good!',
    completed: 'Completed!',
    time: 'Time',
    moves: 'Moves',
    perfect: 'Perfect Solution!',
    coins: 'Coins Earned',
    nextLevel: 'NEXT LEVEL',
    retry: 'RETRY',
    menu: 'MENU',
  },

  settings: {
    title: 'Settings',
    hapticFeedback: 'Haptic Feedback',
    hapticDesc: 'Vibration on interactions',
    soundEffects: 'Sound Effects',
    soundDesc: 'Audio feedback (coming soon)',
    autoAdvance: 'Auto-advance',
    autoAdvanceDesc: 'Next level after completion',
    theme: 'Theme',
    themeLight: 'Light Mode',
    themeDark: 'Dark Mode',
    language: 'Language',
    languageTurkish: 'Turkish',
    languageEnglish: 'English',
    version: 'Wire Master v',
  },

  profile: {
    username: 'Username',
    level: 'Level',
    coins: 'Coins',
    stars: 'Stars',
    playTime: 'Play Time',
    edit: 'EDIT',
    save: 'SAVE',
    cancel: 'CANCEL',
  },

  classes: {
    basic: 'Basic',
    basicDesc: 'Start with basic puzzles',
    medium: 'Medium',
    mediumDesc: 'More challenging puzzles',
    hard: 'Hard',
    hardDesc: 'Expert level puzzles',
  },

  stats: {
    title: 'Statistics',
    globalStats: 'Global Statistics',
    levelsCompleted: 'Levels Completed',
    totalTime: 'Total Time',
    totalStars: 'Total Stars',
    perfectLevels: 'Perfect (5⭐)',
    totalMoves: 'Total Moves',
    currentStreak: 'Current Streak',
    longestStreak: 'Longest Streak',
    levelStats: 'Level Statistics',
    noLevelsCompleted: 'No levels completed yet',
    level: 'Level',
    bestTime: 'Best Time',
    bestMoves: 'Best Moves',
    completions: 'Completions',
    days: 'days',
  },

  shop: {
    title: 'Shop',
    comingSoon: 'Coming Soon!',
    comingSoonDesc: 'Purchase premium themes, avatars, and power-ups.',
    previewItems: 'Preview Items',
    premiumThemes: 'Premium Themes',
    premiumThemesDesc: 'Unlock dark mode, neon, and retro themes',
    avatarPack: 'Avatar Pack',
    avatarPackDesc: '20 exclusive animated avatars',
    powerups: 'Power-ups Bundle',
    powerupsDesc: 'Unlimited hints and undo for 1 month',
  },

  messages: {
    title: 'Messages',
    noMessages: 'No messages yet',
    update: 'UPDATE',
    achievement: 'ACHIEVEMENT',
    info: 'INFO',
  },

  common: {
    close: 'Close',
    confirm: 'Confirm',
    cancel: 'Cancel',
    yes: 'Yes',
    no: 'No',
    ok: 'OK',
  },
};

interface LanguageContextType {
  t: Translations;
  language: 'tr' | 'en';
}

const LanguageContext = createContext<LanguageContextType>({
  t: turkishTranslations,
  language: 'tr',
});

interface LanguageProviderProps {
  children: ReactNode;
  settings: AppSettings;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children, settings }) => {
  const translations = settings.language === 'tr' ? turkishTranslations : englishTranslations;

  return (
    <LanguageContext.Provider value={{ t: translations, language: settings.language }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = () => useContext(LanguageContext);
