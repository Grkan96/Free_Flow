// Wire Master - Formatting Utilities

/**
 * Süre formatı (ms -> MM:SS)
 */
export const formatTime = (milliseconds: number): string => {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

/**
 * Uzun süre formatı (ms -> HH:MM:SS veya MM:SS)
 */
export const formatLongTime = (milliseconds: number): string => {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

/**
 * Tarih formatı (timestamp -> readable)
 */
export const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp);
  return date.toLocaleDateString('tr-TR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

/**
 * Streak hesaplama helper
 */
export const calculateStreak = (lastPlayDate: string, currentStreak: number): number => {
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

  if (lastPlayDate === today) {
    // Bugün zaten oynandı, streak aynı kalır
    return currentStreak;
  }

  const lastDate = new Date(lastPlayDate);
  const todayDate = new Date(today);

  const diffTime = todayDate.getTime() - lastDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 1) {
    // Dün oynandı, streak +1
    return currentStreak + 1;
  }

  // Streak kırıldı
  return 1; // Bugünden yeni streak başlat
};

/**
 * Bugünün tarihini YYYY-MM-DD formatında döndürür
 */
export const getTodayString = (): string => {
  return new Date().toISOString().split('T')[0];
};

/**
 * UUID v4 oluşturma (basit)
 */
export const generateUUID = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};
