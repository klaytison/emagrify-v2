// Simulação de banco de dados em memória
// Em produção, substituir por banco de dados real (Supabase, PostgreSQL, etc.)

export interface User {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  created_at: string;
}

// Array compartilhado entre todas as rotas
export const users: User[] = [];
