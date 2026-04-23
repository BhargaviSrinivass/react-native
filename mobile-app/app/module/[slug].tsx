import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { API_BASE_URL } from '@/constants/api';
import { getModuleConfig, ModuleField } from '@/constants/modules';
import { useAuth } from '@/contexts/AuthContext';

const stringifyData = (data: unknown) => {
  try {
    return JSON.stringify(data, null, 2);
  } catch {
    return 'Unable to render data';
  }
};

export default function ModuleScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ slug: string }>();
  const { user, token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<unknown>(null);
  const [submitMessage, setSubmitMessage] = useState('');
  const [formState, setFormState] = useState<Record<string, string>>({});

  const slug = String(params.slug || '');
  const config = user ? getModuleConfig(user.role, slug) : undefined;

  const loadModuleData = async () => {
    if (!config?.fetch || !token) {
      setResult(null);
      return;
    }
    try {
      setLoading(true);
      setError('');
      const response = await fetch(`${API_BASE_URL}${config.fetch.path}`, {
        method: config.fetch.method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.message || 'Failed to load module data');
      }
      setResult(data);
    } catch (moduleError: any) {
      setError(moduleError?.message || 'Could not load data');
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initialState: Record<string, string> = {};
    config?.submit?.fields?.forEach((field) => {
      initialState[field.key] = '';
    });
    setFormState(initialState);
    setSubmitMessage('');
  }, [config?.slug]);

  useEffect(() => {
    loadModuleData();
  }, [config?.fetch?.path, token]);

  const buildPayload = () => {
    if (!config?.submit) {
      return {};
    }

    const rawPayload: Record<string, unknown> = {};
    config.submit.fields?.forEach((field) => {
      const value = formState[field.key]?.trim();
      if (!value) {
        return;
      }
      rawPayload[field.key] = field.isJson ? JSON.parse(value) : value;
    });

    if (config.submit.payloadBuilder === 'marks') {
      return {
        semester: Number(rawPayload.semester),
        academic_year: rawPayload.academic_year || undefined,
        exam_type: rawPayload.exam_type || undefined,
        exam_date: rawPayload.exam_date || undefined,
        subjects: rawPayload.subjects_json,
      };
    }

    if (config.submit.payloadBuilder === 'attendance') {
      return {
        course_id: Number(rawPayload.course_id),
        date: rawPayload.date || undefined,
        records: rawPayload.records_json,
      };
    }

    if (config.submit.payloadBuilder === 'approveMarks') {
      return {
        mark_id: Number(rawPayload.mark_id),
        action: rawPayload.action,
        remarks: rawPayload.remarks || undefined,
      };
    }

    return rawPayload;
  };

  const onSubmit = async () => {
    if (!config?.submit || !token) {
      return;
    }

    const missingRequired = config.submit.fields?.find(
      (field) => field.required && !formState[field.key]?.trim()
    );

    if (missingRequired) {
      setSubmitMessage(`${missingRequired.label} is required.`);
      return;
    }

    try {
      setSubmitLoading(true);
      setSubmitMessage('');
      const payload = buildPayload();

      const response = await fetch(`${API_BASE_URL}${config.submit.path}`, {
        method: config.submit.method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.message || data?.errors?.[0]?.msg || 'Failed to submit');
      }

      setSubmitMessage('Saved successfully.');
      setFormState((prev) =>
        Object.keys(prev).reduce((acc, key) => {
          acc[key] = '';
          return acc;
        }, {} as Record<string, string>)
      );
      if (config.fetch) {
        loadModuleData();
      } else {
        setResult(data);
      }
    } catch (submitError: any) {
      setSubmitMessage(submitError?.message || 'Submission failed');
    } finally {
      setSubmitLoading(false);
    }
  };

  if (!user) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>No active session</Text>
        <TouchableOpacity style={styles.button} onPress={() => router.replace('/login')}>
          <Text style={styles.buttonText}>Go to Login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!config) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Module not found</Text>
        <TouchableOpacity style={styles.button} onPress={() => router.back()}>
          <Text style={styles.buttonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
      <TouchableOpacity style={styles.backPill} onPress={() => router.back()}>
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>{config.label.toUpperCase()}</Text>
      <Text style={styles.meta}>Role: {user.role}</Text>
      <Text style={styles.meta}>{config.description}</Text>
      <Text style={styles.meta}>Fetch: {config.fetch?.path || 'Not configured'}</Text>
      <Text style={styles.meta}>Submit: {config.submit?.path || 'Not configured'}</Text>

      {config.fetch ? (
        <TouchableOpacity style={styles.refreshButton} onPress={loadModuleData} disabled={loading}>
          <Text style={styles.refreshText}>{loading ? 'Loading...' : 'Refresh Data'}</Text>
        </TouchableOpacity>
      ) : null}

      {loading ? <ActivityIndicator color="#22D3EE" style={{ marginTop: 16 }} /> : null}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      {config.submit?.fields?.length ? (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Submit Data</Text>
          {config.submit.fields.map((field: ModuleField) => (
            <View key={field.key} style={styles.fieldBlock}>
              <Text style={styles.label}>
                {field.label}
                {field.required ? ' *' : ''}
              </Text>
              <TextInput
                value={formState[field.key] || ''}
                onChangeText={(text) => setFormState((prev) => ({ ...prev, [field.key]: text }))}
                style={[styles.input, field.multiline ? styles.multilineInput : null]}
                multiline={field.multiline}
                textAlignVertical={field.multiline ? 'top' : 'center'}
                placeholder={field.isJson ? 'Enter valid JSON' : field.label}
                placeholderTextColor="#64748B"
              />
            </View>
          ))}
          {submitMessage ? (
            <Text style={submitMessage.includes('success') || submitMessage.includes('Saved') ? styles.successText : styles.errorText}>
              {submitMessage}
            </Text>
          ) : null}
          <TouchableOpacity style={styles.submitButton} onPress={onSubmit} disabled={submitLoading}>
            <Text style={styles.submitButtonText}>{submitLoading ? 'Submitting...' : 'Submit'}</Text>
          </TouchableOpacity>
        </View>
      ) : null}

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Module Data</Text>
        <Text style={styles.codeBlock}>
          {result ? stringifyData(result) : 'This module UI is ready. Connect endpoint response to custom cards/forms next.'}
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
    paddingTop: 50,
    paddingBottom: 28,
  },
  centered: {
    flex: 1,
    backgroundColor: '#030014',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  backPill: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
    marginBottom: 10,
  },
  backText: {
    color: '#CBD5E1',
    fontWeight: '700',
  },
  title: {
    color: '#22D3EE',
    fontSize: 28,
    fontWeight: '900',
  },
  meta: {
    color: '#94A3B8',
    marginTop: 6,
    fontSize: 12,
  },
  refreshButton: {
    marginTop: 14,
    backgroundColor: '#22D3EE',
    borderRadius: 10,
    alignItems: 'center',
    paddingVertical: 10,
  },
  refreshText: {
    color: '#020617',
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  card: {
    marginTop: 16,
    backgroundColor: '#0A0A12',
    borderWidth: 1,
    borderColor: '#1E293B',
    borderRadius: 12,
    padding: 12,
  },
  fieldBlock: {
    marginBottom: 12,
  },
  label: {
    color: '#22D3EE',
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#111827',
    borderColor: '#334155',
    borderWidth: 1,
    borderRadius: 8,
    color: '#F8FAFC',
    paddingHorizontal: 10,
    paddingVertical: 9,
    fontSize: 13,
  },
  multilineInput: {
    minHeight: 90,
  },
  submitButton: {
    backgroundColor: '#22D3EE',
    borderRadius: 10,
    paddingVertical: 11,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#020617',
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  cardTitle: {
    color: '#F8FAFC',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 10,
  },
  codeBlock: {
    color: '#CBD5E1',
    fontFamily: 'monospace',
    fontSize: 12,
    lineHeight: 18,
  },
  button: {
    marginTop: 12,
    backgroundColor: '#22D3EE',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  buttonText: {
    color: '#020617',
    fontWeight: '700',
  },
  errorText: {
    color: '#FCA5A5',
    marginTop: 12,
  },
  successText: {
    color: '#86EFAC',
    marginTop: 12,
  },
});
