import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { z } from 'zod';
import { prisma } from '../../lib/prisma';
import { CreatorImpactRepository } from '../../repositories/creator-impact.repository';

const rankingQuerySchema = z.object({
  limit: z.coerce.number().min(1).max(100).default(20),
  page: z.coerce.number().min(1).default(1),
});

export const rankingsRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  fastify.get('/impact-total', async (request, reply) => {
    console.time('[Performance] GET /api/rankings/impact-total');
    
    try {
      const { limit, page } = rankingQuerySchema.parse(request.query);
      const offset = (page - 1) * limit;

      // 1. Obtener la fecha de snapshot más reciente
      const latestDate = await CreatorImpactRepository.getLatestSnapshotDate();

      if (!latestDate) {
        console.timeEnd('[Performance] GET /api/rankings/impact-total');
        return reply.send({
          snapshotDate: null,
          total: 0,
          page,
          limit,
          results: [],
        });
      }

      // 2. Contar el total de registros para esa fecha
      const totalCount = await prisma.creatorImpact.count({
        where: {
          snapshotDate: latestDate,
        },
      });

      // 3. Consultar los datos paginados
      const records = await prisma.creatorImpact.findMany({
        where: {
          snapshotDate: latestDate,
        },
        include: {
          creator: {
            select: {
              displayName: true,
              avatarUrl: true,
            },
          },
        },
        orderBy: [
          { impactTotal30d: 'desc' },
          { creator: { displayName: 'asc' } },
        ],
        skip: offset,
        take: limit,
      });

      const snapshotDateStr = latestDate.toISOString().split('T')[0];

      const results = records.map((rec, index) => ({
        position: offset + index + 1,
        creatorId: rec.creatorId,
        displayName: rec.creator.displayName,
        avatarUrl: rec.creator.avatarUrl,
        impactTotal30d: Number(rec.impactTotal30d),
        viewsVideos30d: Number(rec.viewsVideos30d),
        viewsShorts30d: Number(rec.viewsShorts30d),
      }));

      console.timeEnd('[Performance] GET /api/rankings/impact-total');

      return reply.send({
        snapshotDate: snapshotDateStr,
        total: totalCount,
        page,
        limit,
        results,
      });
    } catch (error) {
      console.timeEnd('[Performance] GET /api/rankings/impact-total');
      fastify.log.error(error);
      
      if (error instanceof z.ZodError) {
        return reply.status(400).send({
          success: false,
          error: 'Validation Error',
          details: error.issues,
        });
      }

      return reply.status(500).send({
        success: false,
        error: 'Failed to fetch rankings',
        details: error instanceof Error ? error.message : String(error),
      });
    }
  });

  // GET /api/rankings/videos-largos
  fastify.get('/videos-largos', async (request, reply) => {
    console.time('[Performance] GET /api/rankings/videos-largos');
    
    try {
      const { limit, page } = rankingQuerySchema.parse(request.query);
      const offset = (page - 1) * limit;

      const latestDate = await CreatorImpactRepository.getLatestSnapshotDate();

      if (!latestDate) {
        console.timeEnd('[Performance] GET /api/rankings/videos-largos');
        return reply.send({
          snapshotDate: null,
          total: 0,
          page,
          limit,
          results: [],
        });
      }

      const totalCount = await prisma.creatorImpact.count({
        where: {
          snapshotDate: latestDate,
        },
      });

      const records = await prisma.creatorImpact.findMany({
        where: {
          snapshotDate: latestDate,
        },
        include: {
          creator: {
            select: {
              displayName: true,
              avatarUrl: true,
            },
          },
        },
        orderBy: [
          { viewsVideos30d: 'desc' },
          { creator: { displayName: 'asc' } },
        ],
        skip: offset,
        take: limit,
      });

      const snapshotDateStr = latestDate.toISOString().split('T')[0];

      const results = records.map((rec, index) => ({
        position: offset + index + 1,
        creatorId: rec.creatorId,
        displayName: rec.creator.displayName,
        avatarUrl: rec.creator.avatarUrl,
        viewsVideos30d: Number(rec.viewsVideos30d),
        videos30d: rec.videos30d,
      }));

      console.timeEnd('[Performance] GET /api/rankings/videos-largos');

      return reply.send({
        snapshotDate: snapshotDateStr,
        total: totalCount,
        page,
        limit,
        results,
      });
    } catch (error) {
      console.timeEnd('[Performance] GET /api/rankings/videos-largos');
      fastify.log.error(error);
      
      if (error instanceof z.ZodError) {
        return reply.status(400).send({
          success: false,
          error: 'Validation Error',
          details: error.issues,
        });
      }

      return reply.status(500).send({
        success: false,
        error: 'Failed to fetch long videos rankings',
        details: error instanceof Error ? error.message : String(error),
      });
    }
  });

  // GET /api/rankings/shorts
  fastify.get('/shorts', async (request, reply) => {
    console.time('[Performance] GET /api/rankings/shorts');
    
    try {
      const { limit, page } = rankingQuerySchema.parse(request.query);
      const offset = (page - 1) * limit;

      const latestDate = await CreatorImpactRepository.getLatestSnapshotDate();

      if (!latestDate) {
        console.timeEnd('[Performance] GET /api/rankings/shorts');
        return reply.send({
          snapshotDate: null,
          total: 0,
          page,
          limit,
          results: [],
        });
      }

      const totalCount = await prisma.creatorImpact.count({
        where: {
          snapshotDate: latestDate,
          shorts30d: {
            gt: 0, // Excluir creadores sin shorts
          },
        },
      });

      const records = await prisma.creatorImpact.findMany({
        where: {
          snapshotDate: latestDate,
          shorts30d: {
            gt: 0, // Excluir creadores sin shorts
          },
        },
        include: {
          creator: {
            select: {
              displayName: true,
              avatarUrl: true,
            },
          },
        },
        orderBy: [
          { viewsShorts30d: 'desc' },
          { creator: { displayName: 'asc' } },
        ],
        skip: offset,
        take: limit,
      });

      const snapshotDateStr = latestDate.toISOString().split('T')[0];

      const results = records.map((rec, index) => ({
        position: offset + index + 1,
        creatorId: rec.creatorId,
        displayName: rec.creator.displayName,
        avatarUrl: rec.creator.avatarUrl,
        viewsShorts30d: Number(rec.viewsShorts30d),
        shorts30d: rec.shorts30d,
      }));

      console.timeEnd('[Performance] GET /api/rankings/shorts');

      return reply.send({
        snapshotDate: snapshotDateStr,
        total: totalCount,
        page,
        limit,
        results,
      });
    } catch (error) {
      console.timeEnd('[Performance] GET /api/rankings/shorts');
      fastify.log.error(error);
      
      if (error instanceof z.ZodError) {
        return reply.status(400).send({
          success: false,
          error: 'Validation Error',
          details: error.issues,
        });
      }

      return reply.status(500).send({
        success: false,
        error: 'Failed to fetch shorts rankings',
        details: error instanceof Error ? error.message : String(error),
      });
    }
  });
};
