import { NextRequest, NextResponse } from 'next/server';
import { verifyPassword } from '@/lib/password';
import { createToken, setAuthCookie } from '@/lib/auth';
import { users } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Validações
    if (!email || !password) {
      return NextResponse.json(
        { error: 'E-mail e senha são obrigatórios' },
        { status: 400 }
      );
    }

    // Buscar usuário
    const user = users.find(u => u.email === email);
    if (!user) {
      return NextResponse.json(
        { error: 'E-mail ou senha incorretos' },
        { status: 401 }
      );
    }

    // Verificar senha
    const isValidPassword = await verifyPassword(password, user.password_hash);
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'E-mail ou senha incorretos' },
        { status: 401 }
      );
    }

    // Criar token
    const token = await createToken({
      id: user.id,
      email: user.email,
      name: user.name,
    });

    // Definir cookie
    await setAuthCookie(token);

    // Retornar sucesso
    const { password_hash, ...userWithoutPassword } = user;
    return NextResponse.json({
      message: 'Login realizado com sucesso',
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error('Erro no login:', error);
    return NextResponse.json(
      { error: 'Erro ao fazer login' },
      { status: 500 }
    );
  }
}
