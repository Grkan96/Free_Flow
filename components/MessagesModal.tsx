// Wire Master - Messages/Notifications Modal Component

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useTranslation } from '../contexts/LanguageContext';

interface Message {
  id: string;
  title: string;
  body: string;
  date: string;
  isRead: boolean;
  type: 'update' | 'achievement' | 'info';
}

interface MessagesModalProps {
  visible: boolean;
  onClose: () => void;
}

const SAMPLE_MESSAGES: Message[] = [
  {
    id: '1',
    title: 'Welcome to Wire Master! 🎉',
    body: 'Thanks for playing! Complete your first level to earn a special reward.',
    date: '2025-01-15',
    isRead: false,
    type: 'info',
  },
  {
    id: '2',
    title: 'New Feature: Daily Challenges',
    body: 'Complete 3 complex grids daily to earn bonus stars and climb the leaderboard!',
    date: '2025-01-14',
    isRead: true,
    type: 'update',
  },
  {
    id: '3',
    title: 'Achievement Unlocked! ⭐',
    body: 'You completed 10 levels! Keep up the great work.',
    date: '2025-01-13',
    isRead: true,
    type: 'achievement',
  },
];

const MessagesModal: React.FC<MessagesModalProps> = ({
  visible,
  onClose,
}) => {
  const { colors } = useTheme();
  const { t } = useTranslation();

  const getMessageIcon = (type: Message['type']) => {
    switch (type) {
      case 'update':
        return '🔔';
      case 'achievement':
        return '🏆';
      case 'info':
        return 'ℹ️';
      default:
        return '📬';
    }
  };

  const getMessageColor = (type: Message['type']) => {
    switch (type) {
      case 'update':
        return colors.primary;
      case 'achievement':
        return '#ffea00';
      case 'info':
        return colors.primary;
      default:
        return colors.textSecondary;
    }
  };

  const getMessageTypeText = (type: Message['type']) => {
    switch (type) {
      case 'update':
        return t.messages.update;
      case 'achievement':
        return t.messages.achievement;
      case 'info':
        return t.messages.info;
      default:
        return type.toUpperCase();
    }
  };

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
            <Text style={[styles.title, { color: colors.text }]}>{t.messages.title}</Text>
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
            {SAMPLE_MESSAGES.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyIcon}>📭</Text>
                <Text style={[styles.emptyText, { color: colors.textTertiary }]}>{t.messages.noMessages}</Text>
              </View>
            ) : (
              <View style={styles.messagesList}>
                {SAMPLE_MESSAGES.map((message) => (
                  <TouchableOpacity
                    key={message.id}
                    style={[
                      styles.messageCard,
                      { backgroundColor: colors.background, borderColor: colors.border },
                      !message.isRead && [styles.messageCardUnread, { borderColor: colors.primary }],
                    ]}
                    activeOpacity={0.7}
                  >
                    <View style={styles.messageHeader}>
                      <View style={[styles.messageIconContainer, { backgroundColor: colors.backgroundTertiary }]}>
                        <Text style={styles.messageIcon}>
                          {getMessageIcon(message.type)}
                        </Text>
                      </View>
                      <View style={styles.messageTitleContainer}>
                        <Text style={[styles.messageTitle, { color: colors.text }]}>{message.title}</Text>
                        <Text style={[styles.messageDate, { color: colors.textTertiary }]}>{message.date}</Text>
                      </View>
                      {!message.isRead && (
                        <View style={[styles.unreadBadge, { backgroundColor: colors.primary }]} />
                      )}
                    </View>
                    <Text style={[styles.messageBody, { color: colors.textSecondary }]}>{message.body}</Text>
                    <View
                      style={[
                        styles.messageTypeBadge,
                        { backgroundColor: getMessageColor(message.type) + '20' },
                      ]}
                    >
                      <Text
                        style={[
                          styles.messageTypeBadgeText,
                          { color: getMessageColor(message.type) },
                        ]}
                      >
                        {getMessageTypeText(message.type)}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
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
    maxWidth: 500,
    maxHeight: '85%',
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
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    color: '#6b7280',
  },
  messagesList: {
    gap: 12,
  },
  messageCard: {
    backgroundColor: '#0a0a0a',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  messageCardUnread: {
    borderColor: '#8b9bff',
    borderWidth: 2,
  },
  messageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  messageIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2a2a2a',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  messageIcon: {
    fontSize: 20,
  },
  messageTitleContainer: {
    flex: 1,
  },
  messageTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 2,
  },
  messageDate: {
    fontSize: 11,
    color: '#6b7280',
  },
  unreadBadge: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#8b9bff',
  },
  messageBody: {
    fontSize: 14,
    color: '#9ca3af',
    lineHeight: 20,
    marginBottom: 12,
  },
  messageTypeBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  messageTypeBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});

export default MessagesModal;
