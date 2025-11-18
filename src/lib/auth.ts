import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key-change-in-production';

// Função simples para criar um token (sem criptografia complexa para desenvolvimento)
export async function createToken(userData: any): Promise<string> {
  const payload = {
    ...userData,
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 dias
  };
  
  // Em produção, use uma biblioteca adequada como jose
  return Buffer.from(JSON.stringify(payload)).toString('base64');
}

// Função simples para verificar token
export async function verifyToken(token: string): Promise<any | null> {
  try {
    const payload = JSON.parse(Buffer.from(token, 'base64').toString());
    
    if (payload.exp < Date.now()) {
      return null; // Token expirado
    }
    
    return payload;
  } catch {
    return null;
  }
}

// Função para definir cookie de autenticação
export async function setAuthCookie(token: string) {
  const cookieStore = await cookies();
  
  cookieStore.set('auth-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 // 7 dias
  });
}

// Função para obter o usuário atual
export async function getCurrentUser() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;
    
    if (!token) {
      return null;
    }
    
    const payload = await verifyToken(token);
    return payload;
  } catch (error) {
    console.error('Erro ao obter usuário:', error);
    return null;
  }
}

// Função para fazer login
export async function login(userData: any) {
  try {
    const token = await createToken(userData);
    await setAuthCookie(token);
    
    return { success: true };
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    return { success: false, error: 'Erro ao fazer login' };
  }
}

// Função para fazer logout
export async function logout() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete('auth-token');
    return { success: true };
  } catch (error) {
    console.error('Erro ao fazer logout:', error);
    return { success: false, error: 'Erro ao fazer logout' };
  }
}
