import { router } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { AppInput } from '@/components/common/AppInput';
import { RoleSelector } from '@/components/common/RoleSelector';
import { UserRole, useAuth } from '@/contexts/AuthContext';
import { loginApi } from '@/services/authApi';

export default function LoginScreen() {
  const { setAuthSession } = useAuth();
  const [role, setRole] = useState<UserRole>('student');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [fieldErrors, setFieldErrors] = useState<{ username?: string; password?: string }>({});

  const validate = () => {
    const nextErrors: { username?: string; password?: string } = {};
    if (!username.trim()) {
      nextErrors.username = 'Username or email is required';
    }
    if (!password.trim()) {
      nextErrors.password = 'Password is required';
    }
    setFieldErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const onLogin = async () => {
    if (!validate()) {
      return;
    }

    try {
      setLoading(true);
      setError('');
      const data = await loginApi({
        username: username.trim(),
        password,
        role,
      });
      setAuthSession(data.token, data.user);
      router.replace('/dashboard');
    } catch (loginError: any) {
      setError(loginError?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
      <Text style={styles.heading}>ACCESS PORTAL</Text>
      <Text style={styles.subheading}>Authenticate your identity</Text>

      <View style={styles.card}>
        <RoleSelector selectedRole={role} onSelectRole={setRole} />
        <AppInput
          label="USERNAME OR EMAIL"
          value={username}
          onChangeText={setUsername}
          placeholder="Enter email / username / USN"
          error={fieldErrors.username}
        />
        <AppInput
          label="PASSWORD"
          value={password}
          onChangeText={setPassword}
          placeholder="Enter password"
          secureTextEntry
          error={fieldErrors.password}
        />

        {error ? <Text style={styles.errorBanner}>{error}</Text> : null}

        <TouchableOpacity style={styles.actionButton} onPress={onLogin} disabled={loading}>
          {loading ? <ActivityIndicator color="#020617" /> : <Text style={styles.actionText}>INITIATE SESSION</Text>}
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={() => router.push('/signup')}>
        <Text style={styles.linkText}>New user? Initialize Registration</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#030014',
  },
  container: {
    padding: 16,
    paddingTop: 48,
    paddingBottom: 28,
  },
  heading: {
    color: '#22D3EE',
    fontSize: 34,
    fontWeight: '900',
  },
  subheading: {
    color: '#94A3B8',
    marginTop: 6,
    marginBottom: 18,
  },
  card: {
    backgroundColor: '#0A0A12',
    borderWidth: 1,
    borderColor: '#1E293B',
    borderRadius: 14,
    padding: 14,
    marginBottom: 18,
  },
  errorBanner: {
    color: '#FCA5A5',
    backgroundColor: 'rgba(127, 29, 29, 0.5)',
    borderWidth: 1,
    borderColor: '#7F1D1D',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 12,
  },
  actionButton: {
    backgroundColor: '#22D3EE',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  actionText: {
    color: '#020617',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.7,
  },
  linkText: {
    color: '#22D3EE',
    textAlign: 'center',
    fontSize: 13,
  },
});
