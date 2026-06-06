import { FastifyInstance } from 'fastify';
import { AuthService } from '../../services/auth.service';
import { authenticate } from '../../middleware/auth.middleware';
import { prisma } from '../../lib/prisma';

export async function authRoutes(fastify: FastifyInstance) {
  // POST /api/auth/login
  fastify.post('/login', async (request, reply) => {
    try {
      const { email, password } = request.body as any;
      if (!email || !password) {
        return reply.status(401).send({ error: 'Credenciales inválidas' });
      }

      const result = await AuthService.login(email, password);
      return reply.status(200).send(result);
    } catch (error: any) {
      if (error.message === 'Credenciales inválidas') {
        return reply.status(401).send({ error: error.message });
      }
      throw error;
    }
  });

  // POST /api/auth/register
  fastify.post('/register', async (request, reply) => {
    try {
      const { email, password } = request.body as any;
      const result = await AuthService.register(email, password);
      return reply.status(201).send(result);
    } catch (error: any) {
      if (error.message === 'Email ya registrado') {
        return reply.status(400).send({ error: error.message });
      }
      if (error.message === 'Datos inválidos') {
        return reply.status(422).send({ error: error.message, details: error.details });
      }
      throw error;
    }
  });

  // GET /api/auth/me
  fastify.get('/me', { preHandler: authenticate }, async (request, reply) => {
    if (!request.user) {
      return reply.status(401).send({ error: 'No autorizado' });
    }

    const user = await prisma.user.findUnique({
      where: { id: request.user.id },
      select: {
        id: true,
        email: true,
        role: true,
      },
    });

    if (!user) {
      return reply.status(401).send({ error: 'No autorizado' });
    }

    return reply.status(200).send(user);
  });
}
