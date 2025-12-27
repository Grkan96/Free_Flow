// Wire Master - Profile Setup Component
// Initial profile creation screen

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { UserProfile } from '../types';
import { AVATARS } from '../constants';

interface ProfileSetupProps {
  onProfileCreated: (profile: UserProfile) => void;
}

const ProfileSetup: React.FC<ProfileSetupProps> = ({ onProfileCreated }) => {
  const [username, setUsername] = useState('');
  const [selectedAvatarId, setSelectedAvatarId] = useState(0);
  const [usernameError, setUsernameError] = useState('');

  const validateUsername = (name: string): boolean => {
    if (name.length < 3) {
      setUsernameError('En az 3 karakter olmalı');
      return false;
    }
    if (name.length > 20) {
      setUsernameError('En fazla 20 karakter olabilir');
      return false;
    }
    if (!/^[a-zA-Z0-9_-]+$/.test(name)) {
      setUsernameError('Sadece harf, rakam, _ ve - kullanın');
      return false;
    }
    setUsernameError('');
    return true;
  };

  const handleUsernameChange = (text: string) => {
    setUsername(text);
    if (text.length > 0) {
      validateUsername(text);
    } else {
      setUsernameError('');
    }
  };

  const handleStart = () => {
    if (!validateUsername(username)) {
      return;
    }

    // Call parent callback with selected avatar
    onProfileCreated({ username, avatarId: selectedAvatarId });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Hoş Geldiniz!</Text>
          <Text style={styles.subtitle}>Profil Oluşturun</Text>
        </View>

        {/* Username Input */}
        <View style={styles.section}>
          <Text style={styles.label}>Kullanıcı Adı</Text>
          <TextInput
            style={[styles.input, usernameError ? styles.inputError : null]}
            value={username}
            onChangeText={handleUsernameChange}
            placeholder="Adınızı girin (3-20 karakter)"
            placeholderTextColor="#6b7280"
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
          <Text style={styles.label}>Avatar Seçin</Text>
          <View style={styles.avatarGrid}>
            {AVATARS.map((avatar) => (
              <TouchableOpacity
                key={avatar.id}
                style={[
                  styles.avatarButton,
                  selectedAvatarId === avatar.id && styles.avatarButtonSelected,
                  { borderColor: avatar.color },
                ]}
                onPress={() => setSelectedAvatarId(avatar.id)}
                activeOpacity={0.7}
              >
                <Text style={styles.avatarIcon}>{avatar.icon}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Start Button */}
        <TouchableOpacity
          style={[
            styles.startButton,
            (!username || usernameError) && styles.startButtonDisabled,
          ]}
          onPress={handleStart}
          disabled={!username || !!usernameError}
          activeOpacity={0.8}
        >
          <Text style={styles.startButtonText}>Başla</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#9ca3af',
    fontWeight: '500',
  },
  section: {
    marginBottom: 32,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#e5e7eb',
    marginBottom: 12,
  },
  input: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
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
    marginTop: 8,
    marginLeft: 4,
  },
  avatarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center',
  },
  avatarButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#1a1a1a',
    borderWidth: 3,
    borderColor: '#2a2a2a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarButtonSelected: {
    backgroundColor: '#2a2a2a',
    borderWidth: 3,
    // borderColor set dynamically
  },
  avatarIcon: {
    fontSize: 32,
  },
  startButton: {
    backgroundColor: '#00e5ff',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    marginTop: 16,
  },
  startButtonDisabled: {
    backgroundColor: '#2a2a2a',
    opacity: 0.5,
  },
  startButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0a0a0a',
  },
});

export default ProfileSetup;
