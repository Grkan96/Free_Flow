// Wire Master - Settings Modal Component

import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Switch,
  StyleSheet,
} from 'react-native';
import { AppSettings } from '../types';
import { Zap, Volume2, FastForward, X } from './Icons';
import { useTheme } from '../contexts/ThemeContext';
import { useTranslation } from '../contexts/LanguageContext';

interface SettingsModalProps {
  visible: boolean;
  settings: AppSettings;
  onClose: () => void;
  onSettingsChange: (settings: AppSettings) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({
  visible,
  settings,
  onClose,
  onSettingsChange,
}) => {
  const { colors } = useTheme();
  const { t } = useTranslation();

  const handleToggle = (key: keyof AppSettings, value: boolean) => {
    const updated = { ...settings, [key]: value };
    onSettingsChange(updated);
  };

  const handleThemeChange = (theme: 'dark' | 'light') => {
    const updated = { ...settings, theme };
    onSettingsChange(updated);
  };

  const handleLanguageChange = (language: 'en' | 'tr') => {
    const updated = { ...settings, language };
    onSettingsChange(updated);
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.container, { backgroundColor: colors.backgroundSecondary, borderColor: colors.border }]}>
          {/* Header */}
          <View style={[styles.header, { borderBottomColor: colors.border }]}>
            <Text style={[styles.title, { color: colors.text }]}>{t.settings.title}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton} activeOpacity={0.7}>
              <X size={24} color={colors.textTertiary} strokeWidth={2} />
            </TouchableOpacity>
          </View>

          {/* Settings List */}
          <View style={styles.settingsList}>
            {/* Haptic Feedback */}
            <View style={[styles.settingRow, { borderBottomColor: colors.border }]}>
              <View style={styles.settingLeft}>
                <View style={[styles.iconContainer, { backgroundColor: colors.background }]}>
                  <Zap size={20} color={colors.primary} strokeWidth={2} />
                </View>
                <View style={styles.settingText}>
                  <Text style={[styles.settingTitle, { color: colors.text }]}>{t.settings.hapticFeedback}</Text>
                  <Text style={[styles.settingSubtitle, { color: colors.textSecondary }]}>
                    {t.settings.hapticDesc}
                  </Text>
                </View>
              </View>
              <Switch
                value={settings.hapticFeedback}
                onValueChange={(value) => handleToggle('hapticFeedback', value)}
                trackColor={{ false: colors.buttonDisabled, true: colors.primary }}
                thumbColor={settings.hapticFeedback ? '#fff' : '#e0e0e0'}
                ios_backgroundColor={colors.buttonDisabled}
              />
            </View>

            {/* Sound Effects */}
            <View style={[styles.settingRow, { borderBottomColor: colors.border }]}>
              <View style={styles.settingLeft}>
                <View style={[styles.iconContainer, { backgroundColor: colors.background }]}>
                  <Volume2 size={20} color={colors.primary} strokeWidth={2} />
                </View>
                <View style={styles.settingText}>
                  <Text style={[styles.settingTitle, { color: colors.text }]}>{t.settings.soundEffects}</Text>
                  <Text style={[styles.settingSubtitle, { color: colors.textSecondary }]}>
                    {t.settings.soundDesc}
                  </Text>
                </View>
              </View>
              <Switch
                value={settings.soundEffects}
                onValueChange={(value) => handleToggle('soundEffects', value)}
                trackColor={{ false: colors.buttonDisabled, true: colors.primary }}
                thumbColor={settings.soundEffects ? '#fff' : '#e0e0e0'}
                ios_backgroundColor={colors.buttonDisabled}
              />
            </View>

            {/* Auto-advance */}
            <View style={[styles.settingRow, { borderBottomColor: colors.border }]}>
              <View style={styles.settingLeft}>
                <View style={[styles.iconContainer, { backgroundColor: colors.background }]}>
                  <FastForward size={20} color={colors.primary} strokeWidth={2} />
                </View>
                <View style={styles.settingText}>
                  <Text style={[styles.settingTitle, { color: colors.text }]}>{t.settings.autoAdvance}</Text>
                  <Text style={[styles.settingSubtitle, { color: colors.textSecondary }]}>
                    {t.settings.autoAdvanceDesc}
                  </Text>
                </View>
              </View>
              <Switch
                value={settings.autoAdvance}
                onValueChange={(value) => handleToggle('autoAdvance', value)}
                trackColor={{ false: colors.buttonDisabled, true: colors.primary }}
                thumbColor={settings.autoAdvance ? '#fff' : '#e0e0e0'}
                ios_backgroundColor={colors.buttonDisabled}
              />
            </View>

            {/* Theme */}
            <View style={[styles.settingRow, { borderBottomColor: colors.border }]}>
              <View style={styles.settingLeft}>
                <View style={[styles.iconContainer, { backgroundColor: colors.background }]}>
                  <Text style={styles.iconEmoji}>{settings.theme === 'dark' ? '🌙' : '☀️'}</Text>
                </View>
                <View style={styles.settingText}>
                  <Text style={[styles.settingTitle, { color: colors.text }]}>{t.settings.theme}</Text>
                  <Text style={[styles.settingSubtitle, { color: colors.textSecondary }]}>
                    {settings.theme === 'dark' ? t.settings.themeDark : t.settings.themeLight}
                  </Text>
                </View>
              </View>
              <View style={styles.themeButtons}>
                <TouchableOpacity
                  style={[
                    styles.themeButton,
                    { backgroundColor: colors.background, borderColor: colors.border },
                    settings.theme === 'dark' && { borderColor: colors.primary, backgroundColor: colors.primary + '20' }
                  ]}
                  onPress={() => handleThemeChange('dark')}
                  activeOpacity={0.7}
                >
                  <Text style={styles.themeButtonText}>🌙</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.themeButton,
                    { backgroundColor: colors.background, borderColor: colors.border },
                    settings.theme === 'light' && { borderColor: colors.primary, backgroundColor: colors.primary + '20' }
                  ]}
                  onPress={() => handleThemeChange('light')}
                  activeOpacity={0.7}
                >
                  <Text style={styles.themeButtonText}>☀️</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Language */}
            <View style={[styles.settingRow, { borderBottomColor: colors.border }]}>
              <View style={styles.settingLeft}>
                <View style={[styles.iconContainer, { backgroundColor: colors.background }]}>
                  <Text style={styles.iconEmoji}>🌐</Text>
                </View>
                <View style={styles.settingText}>
                  <Text style={[styles.settingTitle, { color: colors.text }]}>{t.settings.language}</Text>
                  <Text style={[styles.settingSubtitle, { color: colors.textSecondary }]}>
                    {settings.language === 'tr' ? t.settings.languageTurkish : t.settings.languageEnglish}
                  </Text>
                </View>
              </View>
              <View style={styles.languageButtons}>
                <TouchableOpacity
                  style={[
                    styles.languageButton,
                    { backgroundColor: colors.background, borderColor: colors.border },
                    settings.language === 'tr' && { borderColor: colors.primary, backgroundColor: colors.primary + '20' }
                  ]}
                  onPress={() => handleLanguageChange('tr')}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.languageButtonText, { color: colors.text }]}>TR</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.languageButton,
                    { backgroundColor: colors.background, borderColor: colors.border },
                    settings.language === 'en' && { borderColor: colors.primary, backgroundColor: colors.primary + '20' }
                  ]}
                  onPress={() => handleLanguageChange('en')}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.languageButtonText, { color: colors.text }]}>EN</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Footer */}
          <View style={[styles.footer, { borderTopColor: colors.border }]}>
            <Text style={[styles.footerText, { color: colors.textTertiary }]}>
              {t.settings.version}{settings.version}
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.92)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  container: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 4,
  },
  settingsList: {
    padding: 24,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 16,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  settingSubtitle: {
    fontSize: 13,
  },
  footer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderTopWidth: 1,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
  },
  iconEmoji: {
    fontSize: 20,
  },
  themeButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  themeButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  themeButtonText: {
    fontSize: 20,
  },
  languageButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  languageButton: {
    width: 50,
    height: 44,
    borderRadius: 12,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  languageButtonText: {
    fontSize: 14,
    fontWeight: '700',
  },
});

export default SettingsModal;
