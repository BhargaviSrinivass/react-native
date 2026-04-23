import { router } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { modulesByRole } from '@/constants/modules';
import { useAuth } from '@/contexts/AuthContext';

const studentDashboardLayout = [
  ['profile', 'marks'],
  ['certificates', 'projects'],
  ['internships', 'leave'],
  ['feedback'],
];

export default function DashboardScreen() {
  const { user, logout } = useAuth();

  if (!user) {
    return (
      <View style={styles.centered}>
        <Text style={styles.centerText}>Session not found</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.replace('/login')}>
          <Text style={styles.backButtonText}>Go to Login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const modules = modulesByRole[user.role];
  const moduleBySlug = Object.fromEntries(modules.map((module) => [module.slug, module]));

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
      <Text style={styles.heading}>{user.role.toUpperCase()} DASHBOARD</Text>
      <Text style={styles.subheading}>
        User ID: {user.id}
        {user.role === 'student' ? '  |  Student workspace' : ''}
      </Text>

      {user.role === 'student' ? (
        <View style={styles.grid}>
          {studentDashboardLayout.map((row, rowIndex) => (
            <View key={`row-${rowIndex}`} style={styles.row}>
              {row.map((slug) => {
                const module = moduleBySlug[slug];
                if (!module) {
                  return null;
                }
                return (
                  <TouchableOpacity
                    key={module.slug}
                    style={[styles.card, row.length === 1 ? styles.fullWidthCard : styles.halfWidthCard]}
                    onPress={() => router.push(`/module/${module.slug}`)}>
                    <Text style={styles.cardTitle}>{module.label}</Text>
                    <Text style={styles.cardMeta}>{module.description}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          ))}
        </View>
      ) : (
        <View style={styles.grid}>
          {modules.map((module) => (
            <TouchableOpacity
              key={module.slug}
              style={styles.card}
              onPress={() => router.push(`/module/${module.slug}`)}>
              <Text style={styles.cardTitle}>{module.label}</Text>
              <Text style={styles.cardMeta}>{module.description}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={() => {
          logout();
          router.replace('/');
        }}>
        <Text style={styles.logoutText}>LOGOUT</Text>
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
    paddingHorizontal: 16,
    paddingTop: 48,
    paddingBottom: 30,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#030014',
  },
  centerText: {
    color: '#E2E8F0',
    marginBottom: 12,
  },
  backButton: {
    backgroundColor: '#22D3EE',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  backButtonText: {
    color: '#020617',
    fontWeight: '700',
  },
  heading: {
    color: '#22D3EE',
    fontSize: 28,
    fontWeight: '900',
  },
  subheading: {
    color: '#94A3B8',
    marginBottom: 14,
    marginTop: 5,
  },
  grid: {
    gap: 10,
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  card: {
    backgroundColor: '#0A0A12',
    borderColor: '#1E293B',
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
  },
  halfWidthCard: {
    flex: 1,
  },
  fullWidthCard: {
    width: '100%',
  },
  cardTitle: {
    color: '#F8FAFC',
    fontWeight: '700',
    fontSize: 16,
  },
  cardMeta: {
    color: '#94A3B8',
    marginTop: 4,
    fontSize: 12,
  },
  logoutButton: {
    marginTop: 8,
    backgroundColor: '#EF4444',
    borderRadius: 10,
    alignItems: 'center',
    paddingVertical: 12,
  },
  logoutText: {
    color: '#FFFFFF',
    fontWeight: '800',
    letterSpacing: 0.7,
  },
});
