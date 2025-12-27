import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Plane, Lock, ChevronRight, Fingerprint, Loader2 } from './Icons';

interface LoginScreenProps {
  onLogin: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [loading, setLoading] = useState(false);
  const [operatorId, setOperatorId] = useState('');

  const handleLogin = () => {
    setLoading(true);
    setTimeout(() => {
      onLogin();
    }, 1500);
  };

  return (
    <View style={styles.container}>
      {/* Security Header */}
      <View style={styles.securityHeader}>
        <Text style={styles.securityText}>SECURE CONNECTION</Text>
        <Lock size={12} color="#94a3b8" />
      </View>

      {/* Main Logo */}
      <View style={styles.logoSection}>
        <View style={styles.logoBox}>
          <View style={styles.logoGradient} />
          <Plane size={42} color="#cbd5e1" />
        </View>
        <Text style={styles.logoTitle}>Tower Control</Text>
        <Text style={styles.logoSubtitle}>Authorized Personnel Only</Text>
      </View>

      {/* Login Form */}
      <View style={styles.formContainer}>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Operator ID</Text>
          <View style={styles.inputContainer}>
            <TextInput
              value={operatorId}
              onChangeText={setOperatorId}
              placeholder="ENTER ID..."
              placeholderTextColor="#334155"
              style={styles.input}
              autoFocus
            />
            <View style={styles.inputIndicator} />
          </View>
        </View>

        <View style={[styles.inputGroup, styles.disabledGroup]}>
          <Text style={[styles.inputLabel, styles.disabledLabel]}>Access Key</Text>
          <View style={styles.disabledInput}>
            <Text style={styles.disabledText}>••••••••••••</Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={handleLogin}
          disabled={loading}
          style={[styles.loginButton, loading && styles.loginButtonDisabled]}
          activeOpacity={0.8}
        >
          {loading ? (
            <>
              <Loader2 size={16} color="#000" />
              <Text style={styles.loginButtonText}>Authenticating...</Text>
            </>
          ) : (
            <>
              <Fingerprint size={16} color="#000" />
              <Text style={styles.loginButtonText}>Biometric Login</Text>
              <ChevronRight size={16} color="#000" />
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* Footer warning */}
      <View style={styles.warning}>
        <Text style={styles.warningText}>
          WARNING: UNAUTHORIZED ACCESS TO AIR TRAFFIC CONTROL SYSTEMS IS A FEDERAL OFFENSE.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 50,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  securityHeader: {
    width: '100%',
    maxWidth: 320,
    marginBottom: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    opacity: 0.5,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
    paddingBottom: 8,
  },
  securityText: {
    fontSize: 10,
    color: '#94a3b8',
    fontFamily: 'monospace',
    letterSpacing: 2,
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoBox: {
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155',
    padding: 24,
    borderRadius: 40,
    marginBottom: 16,
    position: 'relative',
    overflow: 'hidden',
  },
  logoGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(251, 191, 36, 0.1)',
  },
  logoTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  logoSubtitle: {
    color: '#64748b',
    fontSize: 12,
    fontFamily: 'monospace',
    marginTop: 4,
  },
  formContainer: {
    width: '100%',
    maxWidth: 320,
    gap: 24,
  },
  inputGroup: {
    gap: 4,
  },
  inputLabel: {
    fontSize: 10,
    color: '#fbbf24',
    fontWeight: '700',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginLeft: 4,
  },
  inputContainer: {
    position: 'relative',
  },
  input: {
    width: '100%',
    backgroundColor: 'rgba(30, 41, 59, 0.5)',
    borderWidth: 1,
    borderColor: '#334155',
    color: '#fff',
    fontFamily: 'monospace',
    fontSize: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  inputIndicator: {
    position: 'absolute',
    right: 12,
    top: '50%',
    transform: [{ translateY: -4 }],
    width: 8,
    height: 8,
    backgroundColor: '#10b981',
    borderRadius: 4,
  },
  disabledGroup: {
    opacity: 0.5,
  },
  disabledLabel: {
    color: '#64748b',
  },
  disabledInput: {
    backgroundColor: 'rgba(30, 41, 59, 0.3)',
    borderWidth: 1,
    borderColor: '#1e293b',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  disabledText: {
    color: '#475569',
    fontFamily: 'monospace',
    fontSize: 12,
  },
  loginButton: {
    width: '100%',
    backgroundColor: '#fbbf24',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  loginButtonText: {
    color: '#000',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 2,
    fontSize: 12,
  },
  warning: {
    marginTop: 48,
    maxWidth: 200,
  },
  warningText: {
    fontSize: 9,
    color: 'rgba(239, 68, 68, 0.6)',
    fontFamily: 'monospace',
    lineHeight: 14,
    textAlign: 'center',
  },
});

export default LoginScreen;
