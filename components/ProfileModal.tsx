// Wire Master - Profile Modal Component
// View and edit user profile

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  Alert,
} from 'react-native';
import { UserProfile } from '../types';
import { AVATARS } from '../constants';
import { useTheme } from '../contexts/ThemeContext';
import { useTranslation } from '../contexts/LanguageContext';

interface ProfileModalProps {
  visible: boolean;
  profile: UserProfile;
  onClose: () => void;
  onProfileUpdate: (profile: UserProfile) => void;
  onDeleteAccount: () => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({
  visible,
  profile,
  onClose,
  onProfileUpdate,
  onDeleteAccount,
}) => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [editedUsername, setEditedUsername] = useState(profile.username);
  const [editedAvatarId, setEditedAvatarId] = useState(profile.avatarId);
  const [usernameError, setUsernameError] = useState('');

  const validateUsername = (name: string): boolean => {
    if (name.length < 3) {
      setUsernameError(t.language === 'tr' ? 'En az 3 karakter olmalı' : 'At least 3 characters required');
      return false;
    }
    if (name.length > 20) {
      setUsernameError(t.language === 'tr' ? 'En fazla 20 karakter olabilir' : 'Maximum 20 characters allowed');
      return false;
    }
    if (!/^[a-zA-Z0-9_-]+$/.test(name)) {
      setUsernameError(t.language === 'tr' ? 'Sadece harf, rakam, _ ve - kullanın' : 'Only letters, numbers, _ and - allowed');
      return false;
    }
    setUsernameError('');
    return true;
  };

  const handleUsernameChange = (text: string) => {
    setEditedUsername(text);
    if (text.length > 0) {
      validateUsername(text);
    } else {
      setUsernameError('');
    }
  };

  const handleSave = () => {
    if (!validateUsername(editedUsername)) {
      return;
    }

    const updatedProfile: UserProfile = {
      ...profile,
      username: editedUsername.trim(),
      avatarId: editedAvatarId,
    };

    onProfileUpdate(updatedProfile);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedUsername(profile.username);
    setEditedAvatarId(profile.avatarId);
    setUsernameError('');
    setIsEditing(false);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      t.language === 'tr' ? 'Hesabı Sil' : 'Delete Account',
      t.language === 'tr'
        ? 'Tüm verileriniz silinecek. Bu işlem geri alınamaz. Emin misiniz?'
        : 'All your data will be deleted. This action cannot be undone. Are you sure?',
      [
        {
          text: t.profile.cancel,
          style: 'cancel',
        },
        {
          text: t.language === 'tr' ? 'Sil' : 'Delete',
          style: 'destructive',
          onPress: () => {
            onDeleteAccount();
            onClose();
          },
        },
      ]
    );
  };

  const selectedAvatar = AVATARS.find((a) => a.id === editedAvatarId) || AVATARS[0];

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={[styles.overlay, { backgroundColor: colors.overlay }]}>
        <View style={[styles.modalContainer, { backgroundColor: colors.backgroundSecondary, borderColor: colors.border }]}>
          {/* Header */}
          <View style={[styles.header, { borderBottomColor: colors.border }]}>
            <Text style={[styles.title, { color: colors.text }]}>{t.language === 'tr' ? 'Profil' : 'Profile'}</Text>
            <TouchableOpacity
              style={[styles.closeButton, { backgroundColor: colors.backgroundTertiary }]}
              onPress={onClose}
              activeOpacity={0.7}
            >
              <Text style={[styles.closeButtonText, { color: colors.textSecondary }]}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Avatar Display */}
            <View style={styles.avatarSection}>
              <View
                style={[
                  styles.avatarCircle,
                  { borderColor: selectedAvatar.color, backgroundColor: colors.backgroundTertiary },
                ]}
              >
                <Text style={styles.avatarIcon}>{selectedAvatar.icon}</Text>
              </View>
              {!isEditing && (
                <Text style={[styles.username, { color: colors.text }]}>{profile.username}</Text>
              )}
            </View>

            {/* Edit Mode */}
            {isEditing ? (
              <>
                {/* Username Input */}
                <View style={styles.section}>
                  <Text style={[styles.label, { color: colors.text }]}>{t.profile.username}</Text>
                  <TextInput
                    style={[
                      styles.input,
                      { backgroundColor: colors.background, color: colors.text, borderColor: colors.border },
                      usernameError ? styles.inputError : null,
                    ]}
                    value={editedUsername}
                    onChangeText={handleUsernameChange}
                    placeholder={t.language === 'tr' ? 'Adınızı girin' : 'Enter your name'}
                    placeholderTextColor={colors.textTertiary}
                    maxLength={20}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                  {usernameError ? (
                    <Text style={styles.errorText}>{usernameError}</Text>
                  ) : null}
                </View>

                {/* Avatar Selection */}
                <View style={styles.section}>
                  <Text style={[styles.label, { color: colors.text }]}>
                    {t.language === 'tr' ? 'Avatar' : 'Avatar'}
                  </Text>
                  <View style={styles.avatarGrid}>
                    {AVATARS.map((avatar) => (
                      <TouchableOpacity
                        key={avatar.id}
                        style={[
                          styles.avatarButton,
                          { backgroundColor: colors.background },
                          editedAvatarId === avatar.id &&
                            [styles.avatarButtonSelected, { backgroundColor: colors.backgroundTertiary }],
                          { borderColor: avatar.color },
                        ]}
                        onPress={() => setEditedAvatarId(avatar.id)}
                        activeOpacity={0.7}
                      >
                        <Text style={styles.avatarButtonIcon}>
                          {avatar.icon}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                {/* Edit Actions */}
                <View style={styles.editActions}>
                  <TouchableOpacity
                    style={[styles.cancelButton, { backgroundColor: colors.backgroundTertiary }]}
                    onPress={handleCancel}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.cancelButtonText, { color: colors.textSecondary }]}>{t.profile.cancel}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.saveButton,
                      { backgroundColor: colors.primary },
                      (usernameError || !editedUsername) &&
                        [styles.saveButtonDisabled, { backgroundColor: colors.buttonDisabled }],
                    ]}
                    onPress={handleSave}
                    disabled={!!usernameError || !editedUsername}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.saveButtonText, { color: colors.buttonText }]}>{t.profile.save}</Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <>
                {/* Profile Info */}
                <View style={[styles.infoSection, { backgroundColor: colors.background }]}>
                  <View style={[styles.infoRow, { borderBottomColor: colors.border }]}>
                    <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
                      {t.language === 'tr' ? 'Kullanıcı ID' : 'User ID'}
                    </Text>
                    <Text style={[styles.infoValue, { color: colors.text }]} numberOfLines={1}>
                      {profile.userId.slice(0, 8)}...
                    </Text>
                  </View>
                  <View style={[styles.infoRow, { borderBottomColor: colors.border }]}>
                    <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
                      {t.language === 'tr' ? 'Oluşturulma' : 'Created'}
                    </Text>
                    <Text style={[styles.infoValue, { color: colors.text }]}>
                      {new Date(profile.createdAt).toLocaleDateString(t.language === 'tr' ? 'tr-TR' : 'en-US')}
                    </Text>
                  </View>
                  <View style={[styles.infoRow, { borderBottomColor: colors.border }]}>
                    <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
                      {t.language === 'tr' ? 'Son Oynanma' : 'Last Played'}
                    </Text>
                    <Text style={[styles.infoValue, { color: colors.text }]}>
                      {new Date(profile.lastPlayedAt).toLocaleDateString(t.language === 'tr' ? 'tr-TR' : 'en-US')}
                    </Text>
                  </View>
                  <View style={[styles.infoRow, { borderBottomColor: colors.border }]}>
                    <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
                      {t.language === 'tr' ? 'Mevcut Seviye' : 'Current Level'}
                    </Text>
                    <Text style={[styles.infoValue, { color: colors.text }]}>
                      {t.mainMenu.level} {profile.currentLevel}
                    </Text>
                  </View>
                </View>

                {/* Action Buttons */}
                <View style={styles.actions}>
                  <TouchableOpacity
                    style={[styles.editButton, { backgroundColor: colors.primary }]}
                    onPress={() => setIsEditing(true)}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.editButtonText, { color: colors.buttonText }]}>
                      {t.language === 'tr' ? 'Profili Düzenle' : 'Edit Profile'}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.deleteButton, { backgroundColor: colors.backgroundTertiary }]}
                    onPress={handleDeleteAccount}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.deleteButtonText}>
                      {t.language === 'tr' ? 'Hesabı Sil' : 'Delete Account'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    maxWidth: 400,
    maxHeight: '80%',
    backgroundColor: '#1a1a1a',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#2a2a2a',
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a2a',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#ffffff',
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#2a2a2a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 20,
    color: '#9ca3af',
    fontWeight: '600',
  },
  scrollContent: {
    padding: 20,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#2a2a2a',
    borderWidth: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarIcon: {
    fontSize: 48,
  },
  username: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#e5e7eb',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#0a0a0a',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: '#ffffff',
    borderWidth: 2,
    borderColor: '#2a2a2a',
  },
  inputError: {
    borderColor: '#ff1744',
  },
  errorText: {
    fontSize: 12,
    color: '#ff1744',
    marginTop: 6,
    marginLeft: 4,
  },
  avatarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'center',
  },
  avatarButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#0a0a0a',
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarButtonSelected: {
    backgroundColor: '#2a2a2a',
    borderWidth: 3,
  },
  avatarButtonIcon: {
    fontSize: 26,
  },
  infoSection: {
    backgroundColor: '#0a0a0a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a2a',
  },
  infoLabel: {
    fontSize: 14,
    color: '#9ca3af',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    color: '#e5e7eb',
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
    marginLeft: 12,
  },
  actions: {
    gap: 12,
  },
  editActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  editButton: {
    backgroundColor: '#00e5ff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  editButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0a0a0a',
  },
  deleteButton: {
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ff1744',
  },
  deleteButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ff1744',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#9ca3af',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#00e5ff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: '#2a2a2a',
    opacity: 0.5,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0a0a0a',
  },
});

export default ProfileModal;
