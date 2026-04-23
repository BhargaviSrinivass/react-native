import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const backendCandidates = [
  'https://college-chatbot-management.onrender.com',
  'http://localhost:4000',
];
export default function SoochnaScreen() {
  const [activeBackend, setActiveBackend] = useState('');
  const [loading, setLoading] = useState(false);
  const [backendStatus, setBackendStatus] = useState('Checking backend...');

  const checkBackendHealth = async () => {
    setLoading(true);
    setBackendStatus('Checking backend...');

    for (const url of backendCandidates) {
      try {
        const response = await fetch(`${url}/health`);
        if (response.ok) {
          setActiveBackend(url);
          setBackendStatus('System online');
          setLoading(false);
          return;
        }
      } catch (error) {
        console.log(error);
      }
    }

    setActiveBackend('');
    setBackendStatus('Backend unavailable');
    setLoading(false);
  };

  useEffect(() => {
    checkBackendHealth();
  }, []);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
      <View style={styles.navbar}>
        <View style={styles.logoGroup}>
          <View style={styles.logoBox}>
            <View style={styles.logoDiamond} />
          </View>
          <Text style={styles.logoText}>SOOCHNA</Text>
        </View>
        <View style={styles.navButtons}>
          <TouchableOpacity style={styles.loginButton} onPress={() => router.push('/login')}>
            <Text style={styles.loginButtonText}>LOGIN</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.joinButton} onPress={() => router.push('/signup')}>
            <Text style={styles.joinButtonText}>JOIN SYSTEM</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.heroSection}>
        <View style={styles.statusChip}>
          {loading ? <ActivityIndicator size="small" color="#22D3EE" /> : <View style={styles.onlineDot} />}
          <Text style={styles.statusChipText}>{backendStatus.toUpperCase()}</Text>
        </View>
        <Text style={styles.heroMainText}>CAMPUS</Text>
        <Text style={styles.heroAccentText}>INTELLIGENCE</Text>
        <Text style={styles.heroDescription}>
          Orchestrate your entire academic ecosystem. Real-time analytics, automated workflows, and
          seamless communication in one unified interface.
        </Text>
        <View style={styles.heroActions}>
          <TouchableOpacity style={styles.primaryAction} onPress={() => router.push('/signup')}>
            <Text style={styles.primaryActionText}>INITIALIZE ACCESS</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryAction} onPress={() => router.push('/login')}>
            <Text style={styles.secondaryActionText}>LIVE DEMO</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.statsStrip}>
        {[
          { label: 'Active Users', value: '2,500+' },
          { label: 'Daily Events', value: '150+' },
          { label: 'Uptime', value: '99.9%' },
        ].map((stat) => (
          <View key={stat.label} style={styles.statItem}>
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>

      <View style={styles.modulesSection}>
        <Text style={styles.modulesTitle}>SYSTEM MODULES</Text>
        {[
          {
            title: 'Student Portal',
            description: 'Access marks, attendance, and projects in a unified dashboard.',
            border: '#06B6D4',
          },
          {
            title: 'Faculty Hub',
            description: 'Manage courses, approve requests, and track student progress.',
            border: '#A855F7',
          },
          {
            title: 'Admin Console',
            description: 'Full system control, fee structures, and global analytics.',
            border: '#3B82F6',
          },
        ].map((module) => (
          <View key={module.title} style={[styles.moduleCard, { borderColor: module.border }]}>
            <Text style={styles.moduleTitle}>{module.title}</Text>
            <Text style={styles.moduleDescription}>{module.description}</Text>
            <Text style={styles.moduleAction}>EXPLORE MODULE</Text>
          </View>
        ))}
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerBrand}>SOOCHNA</Text>
        <Text style={styles.footerText}>
          Advanced campus management solution designed for the future of education technology.
        </Text>
        <Text style={styles.footerStatus}>
          {activeBackend ? `CONNECTED TO ${activeBackend}` : 'NO BACKEND CONNECTION'}
        </Text>
      </View>
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
    paddingTop: 26,
    paddingBottom: 40,
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 28,
  },
  logoGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoBox: {
    width: 36,
    height: 36,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#06B6D4',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(6, 182, 212, 0.12)',
  },
  logoDiamond: {
    width: 13,
    height: 13,
    backgroundColor: '#22D3EE',
    transform: [{ rotate: '45deg' }],
  },
  logoText: {
    color: '#FFFFFF',
    fontWeight: '700',
    letterSpacing: 2,
    fontSize: 18,
  },
  navButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  loginButton: {
    borderWidth: 1,
    borderColor: 'rgba(34, 211, 238, 0.4)',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 6,
    justifyContent: 'center',
  },
  loginButtonText: {
    color: '#22D3EE',
    fontSize: 11,
    fontWeight: '700',
  },
  joinButton: {
    backgroundColor: '#22D3EE',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 6,
    justifyContent: 'center',
  },
  joinButtonText: {
    color: '#030014',
    fontSize: 11,
    fontWeight: '700',
  },
  heroSection: {
    marginBottom: 24,
  },
  statusChip: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(34, 211, 238, 0.4)',
    backgroundColor: 'rgba(8, 47, 73, 0.4)',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 16,
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 999,
    backgroundColor: '#22C55E',
  },
  statusChipText: {
    color: '#22D3EE',
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1,
  },
  heroMainText: {
    fontSize: 44,
    fontWeight: '900',
    color: '#FFFFFF',
    lineHeight: 50,
  },
  heroAccentText: {
    fontSize: 44,
    fontWeight: '900',
    lineHeight: 50,
    color: '#22D3EE',
  },
  heroDescription: {
    marginTop: 12,
    color: '#94A3B8',
    fontSize: 15,
    lineHeight: 23,
  },
  heroActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
  },
  primaryAction: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  primaryActionText: {
    color: '#030014',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  secondaryAction: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  secondaryActionText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  statsStrip: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 26,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '900',
  },
  statLabel: {
    color: '#22D3EE',
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginTop: 4,
  },
  modulesSection: {
    marginBottom: 26,
    gap: 12,
  },
  modulesTitle: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '800',
    marginBottom: 4,
  },
  moduleCard: {
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: '#0A0A12',
    padding: 14,
  },
  moduleTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
  },
  moduleDescription: {
    color: '#94A3B8',
    lineHeight: 20,
    marginBottom: 10,
  },
  moduleAction: {
    color: '#E2E8F0',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
    paddingTop: 16,
  },
  footerBrand: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: 2,
  },
  footerText: {
    color: '#94A3B8',
    marginTop: 8,
    lineHeight: 20,
  },
  footerStatus: {
    marginTop: 10,
    color: '#22D3EE',
    fontSize: 11,
    fontWeight: '600',
  },
});
