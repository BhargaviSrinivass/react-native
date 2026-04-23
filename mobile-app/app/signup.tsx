import { router } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { AppInput } from '@/components/common/AppInput';
import { RoleSelector } from '@/components/common/RoleSelector';
import { UserRole } from '@/contexts/AuthContext';
import { signupApi } from '@/services/authApi';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;

export default function SignupScreen() {
  const [role, setRole] = useState<UserRole>('student');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [usn, setUsn] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [fieldErrors, setFieldErrors] = useState<{
    name?: string;
    email?: string;
    usn?: string;
    password?: string;
  }>({});

  const validate = () => {
    const nextErrors: { name?: string; email?: string; usn?: string; password?: string } = {};
    if (!name.trim()) {
      nextErrors.name = 'Name is required';
    }
    if (!emailRegex.test(email.trim())) {
      nextErrors.email = 'Enter a valid email';
    }
    if (role === 'student' && !usn.trim()) {
      nextErrors.usn = 'USN is required for student role';
    }
    if (!strongPasswordRegex.test(password)) {
      nextErrors.password = 'Password must include upper, lower, number and symbol';
    }
    setFieldErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const onSignup = async () => {
    if (!validate()) {
      return;
    }

    try {
      setLoading(true);
      setError('');
      await signupApi({
        name: name.trim(),
        email: email.trim(),
        password,
        usn: role === 'student' ? usn.trim() : undefined,
        role,
      });
      router.replace('/login');
    } catch (signupError: any) {
      setError(signupError?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
      <Text style={styles.heading}>REGISTRATION</Text>
      <Text style={styles.subheading}>Create new identity</Text>

      <View style={styles.card}>
        <RoleSelector selectedRole={role} onSelectRole={setRole} />
        <AppInput label="FULL NAME" value={name} onChangeText={setName} placeholder="Enter your full name" error={fieldErrors.name} />
        <AppInput label="EMAIL" value={email} onChangeText={setEmail} placeholder="Enter email address" error={fieldErrors.email} />
        {role === 'student' ? (
          <AppInput label="USN" value={usn} onChangeText={setUsn} placeholder="Enter student USN" error={fieldErrors.usn} />
        ) : null}
        <AppInput
          label="PASSWORD"
          value={password}
          onChangeText={setPassword}
          placeholder="Enter strong password"
          secureTextEntry
          error={fieldErrors.password}
        />

        {error ? <Text style={styles.errorBanner}>{error}</Text> : null}

        <TouchableOpacity style={styles.actionButton} onPress={onSignup} disabled={loading}>
          {loading ? <ActivityIndicator color="#020617" /> : <Text style={styles.actionText}>REGISTER ACCOUNT</Text>}
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={() => router.replace('/login')}>
        <Text style={styles.linkText}>Already have an account? Access Portal</Text>
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
