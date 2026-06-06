import { prisma } from '../lib/prisma';
import * as bcrypt from 'bcryptjs';
import { z } from 'zod';
import * as jwt from 'jsonwebtoken';

const registerSchema = z.object({
  email: z.string().email({ message: 'Email con formato inválido' }),
  password: z.string().min(8, { message: 'La contraseña debe tener mínimo 8 caracteres' }),
});

const JWT_SECRET = process.env.JWT_SECRET || 'viewlytics-jwt-secret-2026';

export class AuthService {
  static async login(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new Error('Credenciales inválidas');
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      throw new Error('Credenciales inválidas');
    }

    const token = jwt.sign(
      { sub: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      token,
    };
  }

  static async register(email: string, password: string) {
    const validated = registerSchema.safeParse({ email, password });
    if (!validated.success) {
      const err: any = new Error('Datos inválidos');
      err.details = validated.error.issues;
      throw err;
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      throw new Error('Email ya registrado');
    }

    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        role: 'USER',
      },
    });

    const token = jwt.sign(
      { sub: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      token,
    };
  }

  static verifyToken(token: string) {
    try {
      return jwt.verify(token, JWT_SECRET) as { sub: string; role: string };
    } catch (error) {
      throw new Error('Token inválido o expirado');
    }
  }
}
