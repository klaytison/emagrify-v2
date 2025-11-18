import crypto from 'crypto';

export async function hashPassword(password: string): Promise<string> {
  // Gera um salt aleatório
  const salt = crypto.randomBytes(16).toString('hex');
  
  // Cria o hash usando pbkdf2
  return new Promise((resolve, reject) => {
    crypto.pbkdf2(password, salt, 10000, 64, 'sha512', (err, derivedKey) => {
      if (err) reject(err);
      resolve(salt + ':' + derivedKey.toString('hex'));
    });
  });
}

export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  const [salt, hash] = hashedPassword.split(':');
  
  return new Promise((resolve, reject) => {
    crypto.pbkdf2(password, salt, 10000, 64, 'sha512', (err, derivedKey) => {
      if (err) reject(err);
      resolve(hash === derivedKey.toString('hex'));
    });
  });
}
