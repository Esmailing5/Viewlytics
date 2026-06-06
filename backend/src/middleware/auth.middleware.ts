import { FastifyRequest, FastifyReply } from 'fastify';
import { AuthService } from '../services/auth.service';

declare module 'fastify' {
  interface FastifyRequest {
    user: {
      id: string;
      role: string;
    };
  }
}

export async function authenticate(request: FastifyRequest, reply: FastifyReply) {
  const authHeader = request.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return reply.status(401).send({ error: 'No autorizado' });
  }

  const token = authHeader.substring(7);
  try {
    const payload = AuthService.verifyToken(token);
    request.user = {
      id: payload.sub,
      role: payload.role,
    };
  } catch (error) {
    return reply.status(401).send({ error: 'No autorizado' });
  }
}

export async function requireAdmin(request: FastifyRequest, reply: FastifyReply) {
  await authenticate(request, reply);
  if (reply.sent) return;

  if (!request.user || request.user.role !== 'ADMIN') {
    return reply.status(403).send({ error: 'Acceso denegado' });
  }
}
