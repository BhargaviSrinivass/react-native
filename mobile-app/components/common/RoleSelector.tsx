import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { UserRole } from '@/contexts/AuthContext';

const roles: UserRole[] = ['student', 'faculty', 'department', 'admin'];

type RoleSelectorProps = {
  selectedRole: UserRole;
  onSelectRole: (role: UserRole) => void;
};

export const RoleSelector = ({ selectedRole, onSelectRole }: RoleSelectorProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>CLEARANCE LEVEL</Text>
      <View style={styles.row}>
        {roles.map((role) => {
          const selected = role === selectedRole;
          return (
            <TouchableOpacity
              key={role}
              style={[styles.chip, selected ? styles.selectedChip : null]}
              onPress={() => onSelectRole(role)}>
              <Text style={[styles.chipText, selected ? styles.selectedChipText : null]}>{role}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  label: {
    fontSize: 12,
    color: '#22D3EE',
    fontWeight: '700',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: '#0B1220',
  },
  selectedChip: {
    borderColor: '#22D3EE',
    backgroundColor: 'rgba(34, 211, 238, 0.2)',
  },
  chipText: {
    color: '#CBD5E1',
    fontSize: 12,
    textTransform: 'uppercase',
    fontWeight: '700',
  },
  selectedChipText: {
    color: '#22D3EE',
  },
});
