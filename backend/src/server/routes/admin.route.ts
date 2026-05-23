import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { seedRDCreators } from '../../modules/seed/seed-rd-creators';
import { runDailySnapshots } from '../../modules/snapshots/run-daily-snapshots';

export const adminRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  fastify.post('/seed-rd-creators', async (request, reply) => {
    try {
      const result = await seedRDCreators();
      return reply.send({
        success: true,
        message: 'Seed process executed successfully',
        data: result
      });
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({
        success: false,
        error: 'Failed to seed RD creators',
        details: error instanceof Error ? error.message : String(error)
      });
    }
  });

  fastify.post('/run-daily-snapshots', async (request, reply) => {
    try {
      const result = await runDailySnapshots();
      // Ensure BigInt values (if any returned natively) are serialized correctly, 
      // but the result object returns primitive numbers, so it's safe to send.
      return reply.send({
        success: true,
        message: 'Daily Snapshot Engine finished successfully',
        data: result
      });
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({
        success: false,
        error: 'Failed to run Daily Snapshot Engine',
        details: error instanceof Error ? error.message : String(error)
      });
    }
  });
};
