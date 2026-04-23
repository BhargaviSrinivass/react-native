import { API_BASE_URL, SOOCHNA_ENDPOINT } from '@/constants/api';
import { CreateSoochnaPayload, SoochnaItem } from '@/types/soochna';

const buildUrl = () => `${API_BASE_URL}${SOOCHNA_ENDPOINT}`;

const normalizeSoochnaItem = (item: any): SoochnaItem => ({
  id: item.id ?? item._id ?? `${Date.now()}-${Math.random()}`,
  title: item.title ?? '',
  description: item.description ?? item.content ?? '',
  createdAt: item.createdAt ?? item.created_at,
});

export const fetchSoochna = async (): Promise<SoochnaItem[]> => {
  const response = await fetch(buildUrl());

  if (!response.ok) {
    throw new Error('Unable to fetch SOOCHNA updates.');
  }

  const data = await response.json();

  if (Array.isArray(data)) {
    return data.map(normalizeSoochnaItem);
  }

  if (Array.isArray(data?.data)) {
    return data.data.map(normalizeSoochnaItem);
  }

  return [];
};

export const createSoochna = async (payload: CreateSoochnaPayload): Promise<SoochnaItem> => {
  const response = await fetch(buildUrl(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error('Unable to create SOOCHNA update.');
  }

  const data = await response.json();
  return normalizeSoochnaItem(data?.data ?? data);
};
