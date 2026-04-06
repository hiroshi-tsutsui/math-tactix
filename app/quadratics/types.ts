export interface Problem {
  id: string;
  type: string;
  question: string;
  equation?: string;
  equations?: string[];
  params?: Record<string, unknown>;
  explanation?: string | string[];
  answer?: string;
  title?: string;
  options?: string[];
  difficulty?: number;
  level?: number;
}
