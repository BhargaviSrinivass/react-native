import { API_BASE_URL } from '@/constants/api';
import { UserRole } from '@/contexts/AuthContext';

type LoginPayload = {
  username: string;
  password: string;
  role: UserRole;
};

type SignupPayload = {
  name: string;
  email: string;
  password: string;
  usn?: string;
  role: UserRole;
};

export const loginApi = async (payload: LoginPayload) => {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.message || 'Login failed');
  }

  return data as {
    token: string;
    user: { id: number; role: UserRole };
  };
};

export const signupApi = async (payload: SignupPayload) => {
  const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.message || data?.errors?.[0]?.msg || 'Registration failed');
  }

  return data;
};
