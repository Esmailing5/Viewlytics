import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { ProjectionService } from '../../services/projection.service';
import { prisma } from '../../lib/prisma';
import { z } from 'zod';

const projectionParamsSchema = z.object({
  creatorId: z.string(),
});

const slugParamsSchema = z.object({
  platform: z.string(),
  slug: z.string(),
});

export const projectionRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  // GET /api/projection/:creatorId
  fastify.get('/:creatorId', async (request, reply) => {
    try {
      const { creatorId } = projectionParamsSchema.parse(request.params);
      
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(creatorId);
      let creator = null;

      if (isUuid) {
        creator = await prisma.creator.findUnique({
          where: { id: creatorId },
        });
      }

      if (!creator) {
        creator = await prisma.creator.findUnique({
          where: { channelId: creatorId },
        });
      }

      if (!creator) {
        return reply.status(404).send({ error: 'NotFound', message: 'Creator not found' });
      }

      const result = await ProjectionService.calculateProjection(creator.id);
      return reply.send(result);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({ error: 'Validation Error', details: (error as any).errors });
      }

      if (error instanceof Error) {
        if (error.message === 'Creator not found') {
          return reply.status(404).send({ error: 'NotFound', message: error.message });
        }
        if (error.message === 'Historial insuficiente para proyectar') {
          return reply.status(400).send({ error: 'BadRequest', message: error.message });
        }
      }
      
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Internal Server Error' });
    }
  });

  // GET /api/projection/by-slug/:platform/:slug
  fastify.get('/by-slug/:platform/:slug', async (request, reply) => {
    try {
      const { platform, slug } = slugParamsSchema.parse(request.params);
      
      const creator = await prisma.creator.findFirst({
        where: {
          platform,
          slug,
        },
      });

      if (!creator) {
        return reply.status(404).send({ error: 'NotFound', message: 'Creator not found' });
      }

      const result = await ProjectionService.calculateProjection(creator.id);
      return reply.send(result);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({ error: 'Validation Error', details: (error as any).errors });
      }

      if (error instanceof Error) {
        if (error.message === 'Historial insuficiente para proyectar') {
          return reply.status(400).send({ error: 'BadRequest', message: error.message });
        }
      }

      fastify.log.error(error);
      return reply.status(500).send({ error: 'Internal Server Error' });
    }
  });
};
