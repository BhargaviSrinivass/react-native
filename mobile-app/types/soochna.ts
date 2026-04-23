export type SoochnaItem = {
  id: number | string;
  title: string;
  description: string;
  createdAt?: string;
};

export type CreateSoochnaPayload = {
  title: string;
  description: string;
};
