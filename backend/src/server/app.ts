import Fastify, { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import { searchRoutes } from './routes/search.route';
import { channelRoutes } from './routes/channel.route';
import { adminRoutes } from './routes/admin.route';
import { rankingsRoutes } from './routes/rankings.route';
import { initSnapshotScheduler } from './jobs/snapshot-scheduler';

const fastify: FastifyInstance = Fastify({
  logger: true,
});

async function buildApp() {
  // Plugins
  await fastify.register(cors, {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  });

  // Routes
  fastify.get('/', async () => {
    return { status: 'ok', service: 'Viewlytics Backend' };
  });

  fastify.register(searchRoutes, { prefix: '/api/search' });
  fastify.register(channelRoutes, { prefix: '/api/channel' });
  fastify.register(adminRoutes, { prefix: '/api/admin' });
  fastify.register(rankingsRoutes, { prefix: '/api/rankings' });

  // Initialize automatic snapshot scheduler
  initSnapshotScheduler(fastify);

  // Error Handler
  fastify.setErrorHandler((error, request, reply) => {
    fastify.log.error(error);
    const err = error as Error;
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
