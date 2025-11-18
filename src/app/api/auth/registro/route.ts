import { NextRequest, NextResponse } from 'next/server';
import { hashPassword } from '@/lib/password';
import { users } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json();

    // Validações
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Todos os campos são obrigatórios' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'A senha deve ter pelo menos 6 caracteres' },
        { status: 400 }
      );
    }

    // Verificar se e-mail já existe
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return NextResponse.json(
        { error: 'E-mail já cadastrado' },
        { status: 400 }
      );
    }

    // Criar usuário
    const hashedPassword = await hashPassword(password);
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password_hash: hashedPassword,
      created_at: new Date().toISOString(),
    };

    users.push(newUser);

    // Retornar sucesso (sem senha)
    const { password_hash, ...userWithoutPassword } = newUser;
    return NextResponse.json(
      { 
        message: 'Conta criada com sucesso',
        user: userWithoutPassword 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Erro no registro:', error);
    return NextResponse.json(
      { error: 'Erro ao criar conta' },
      { status: 500 }
    );
  }
}
