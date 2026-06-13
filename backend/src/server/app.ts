import Fastify, { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import fastifyJwt from '@fastify/jwt';
import { searchRoutes } from './routes/search.route';
import { channelRoutes } from './routes/channel.route';
import { adminRoutes } from './routes/admin.route';
import { rankingsRoutes } from './routes/rankings.route';
import { statsRoutes } from './routes/stats.route';
import { authRoutes } from './routes/auth.route';
import { projectionRoutes } from './routes/projection.route';
import { initSnapshotScheduler } from './jobs/snapshot-scheduler';

const fastify: FastifyInstance = Fastify({
  logger: true,
});

async function buildApp() {
  // Plugins
  // origin: true → Fastify refleja el Origin del request entrante.
  // Compatible con credentials, cualquier dominio de Vercel (preview/prod)
  // y Railway sin ninguna configuración adicional.
  await fastify.register(cors, {
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  await fastify.register(fastifyJwt, {
    secret: process.env.JWT_SECRET || 'viewlytics-jwt-secret-2026',
  });

  // Routes
  fastify.get('/', async () => {
    return { status: 'ok', service: 'Viewlytics Backend' };
  });

  fastify.register(searchRoutes, { prefix: '/api/search' });
  fastify.register(channelRoutes, { prefix: '/api/channel' });
  fastify.register(adminRoutes, { prefix: '/api/admin' });
  fastify.register(rankingsRoutes, { prefix: '/api/rankings' });
  fastify.register(statsRoutes, { prefix: '/api/stats' });
  fastify.register(authRoutes, { prefix: '/api/auth' });
  fastify.register(projectionRoutes, { prefix: '/api/projection' });

  // Initialize automatic snapshot scheduler
  initSnapshotScheduler(fastify);

  // Error Handler — añade cabeceras CORS manualmente para que los errores
  // 500 no sean bloqueados por el browser como CORS errors.
  fastify.setErrorHandler((error, request, reply) => {
    fastify.log.error(error);
    const err = error as Error;
    const origin = request.headers.origin;
    if (origin) {
      reply.header('Access-Control-Allow-Origin', origin);
      reply.header('Access-Control-Allow-Credentials', 'true');
    }
    reply.status(500).send({ error: 'Internal Server Error', message: err.message || 'Unknown Error' });
  });

  return fastify;
}

const start = async () => {
  try {
    const app = await buildApp();
    const port = parseInt(process.env.PORT || '4000', 10);
    await app.listen({ port, host: '0.0.0.0' });
    console.log(`Server listening on port ${port}`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

start();
