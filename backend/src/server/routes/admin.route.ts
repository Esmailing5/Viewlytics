import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { seedRDCreators } from '../../modules/seed/seed-rd-creators';
import { runDailySnapshots } from '../../modules/snapshots/run-daily-snapshots';
import { schedulerStatus } from '../jobs/snapshot-scheduler';
import { prisma } from '../../lib/prisma';
import { TrackingStatus } from '@prisma/client';
import { YouTubeChannelAdapter } from '../../adapters/youtube/youtube.channel.adapter';

export const adminRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  // Archivar automáticamente los 4 registros seed detectados al registrar las rutas de admin
  const seedsToArchive = ['UC_Gallimbo_Seed', 'UC_ShowCarlosDuran_Seed', 'UC_ElMananero_Seed', 'UC_DuckTape_Seed'];
  prisma.creator.updateMany({
    where: {
      channelId: { in: seedsToArchive },
      trackingStatus: { not: TrackingStatus.archived }
    },
    data: {
      trackingStatus: TrackingStatus.archived
    }
  }).then((res) => {
    if (res.count > 0) {
      fastify.log.info(`[Admin Route] Auto-archived ${res.count} seed channel(s).`);
    }
  }).catch((err) => {
    fastify.log.error(`[Admin Route] Failed to auto-archive seeds: ${err}`);
  });

  fastify.get('/scheduler-status', async (request, reply) => {
    return reply.send(schedulerStatus);
  });

  // GET all channels for administration
  fastify.get('/channels', async (request, reply) => {
    fastify.log.info('[Admin Debug] Starting prisma.creator.findMany query...');
    try {
      const creators = await prisma.creator.findMany({
        orderBy: {
          displayName: 'asc'
        },
        include: {
          _count: {
            select: { snapshots: true }
          }
        }
      });
      fastify.log.info(`[Admin Debug] Successfully retrieved ${creators.length} creators.`);
      return reply.send(creators);
    } catch (error: any) {
      fastify.log.error(`[Admin Debug Exception] Error in prisma.creator.findMany:`);
      fastify.log.error(`Query context: findMany with orderBy displayName: asc and include _count snapshots`);
      fastify.log.error(`error.message: ${error?.message}`);
      fastify.log.error(`error.stack: ${error?.stack}`);
      
      return reply.status(500).send({
        success: false,
        error: 'Failed to fetch channels',
        details: error instanceof Error ? error.message : String(error),
        debugMessage: error?.message,
        debugStack: error?.stack,
        failedQuery: 'prisma.creator.findMany({ orderBy: { displayName: asc }, include: { _count: { select: { snapshots: true } } } })'
      });
    }
  });

  // PATCH channel tracking status
  fastify.patch<{ Params: { id: string }; Body: { status: 'searched' | 'tracked' | 'archived' } }>(
    '/channels/:id/status',
    async (request, reply) => {
      const { id } = request.params;
      const { status } = request.body;

      if (!status || !['searched', 'tracked', 'archived'].includes(status)) {
        return reply.status(400).send({
          success: false,
          error: 'Invalid tracking status value'
        });
      }

      try {
        const updated = await prisma.creator.update({
          where: { id },
          data: {
            trackingStatus: status as TrackingStatus
          }
        });

        return reply.send({
          success: true,
          message: `Channel status updated to ${status}`,
          data: updated
        });
      } catch (error) {
        fastify.log.error(error);
        return reply.status(500).send({
          success: false,
          error: 'Failed to update channel status',
          details: error instanceof Error ? error.message : String(error)
        });
      }
    }
  );

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

  // POST import channel
  fastify.post<{ Body: { channelId: string; platform: string } }>(
    '/channels/import',
    async (request, reply) => {
      const { channelId, platform } = request.body;

      if (!channelId || platform !== 'youtube') {
        return reply.status(400).send({
          success: false,
          error: 'Invalid request body. platform must be "youtube" and channelId is required.'
        });
      }

      try {
        const existing = await prisma.creator.findUnique({
          where: { channelId }
        });

        if (existing) {
          return reply.send({
            success: true,
            alreadyExists: true
          });
        }

        const adapter = new YouTubeChannelAdapter();
        const analytics = await adapter.getFullAnalytics(channelId);
        const { profile } = analytics;

        await prisma.creator.create({
          data: {
            platform: 'youtube',
            channelId: profile.channel_id,
            slug: profile.slug,
            displayName: profile.display_name,
            description: profile.description || null,
            avatarUrl: profile.avatar_url || null,
            bannerUrl: profile.banner_url || null,
            verified: profile.verified || false,
            country: profile.country || null,
            category: null,
            trackingStatus: TrackingStatus.searched,
            isFeatured: false
          }
        });

        return reply.send({
          success: true,
          created: true
        });
      } catch (error) {
        fastify.log.error(error);
        return reply.status(500).send({
          success: false,
          error: 'Failed to import channel',
          details: error instanceof Error ? error.message : String(error)
        });
      }
    }
  );

  // GET creator impact audit records
  // TODO: proteger con API key
  fastify.get<{ Querystring: { date?: string; creatorId?: string } }>(
    '/creator-impact',
    async (request, reply) => {
      const { date, creatorId } = request.query;

      let targetDate: Date;
      if (date) {
        // Validar formato YYYY-MM-DD
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(date)) {
          return reply.status(400).send({
            success: false,
            error: 'Formato de fecha inválido. Se esperaba YYYY-MM-DD.'
          });
        }
        targetDate = new Date(date + 'T00:00:00Z');
        if (isNaN(targetDate.getTime())) {
          return reply.status(400).send({
            success: false,
            error: 'Valor de fecha inválido.'
          });
        }
      } else {
        const now = new Date();
        targetDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
      }

      try {
        const whereClause: any = {
          snapshotDate: targetDate
        };

        if (creatorId) {
          whereClause.creatorId = creatorId;
        }

        const impacts = await prisma.creatorImpact.findMany({
          where: whereClause,
          include: {
            creator: {
              select: {
                displayName: true
              }
            }
          },
          orderBy: {
            impactTotal30d: 'desc'
          }
        });

        const dateStr = targetDate.toISOString().split('T')[0];

        const results = impacts.map((imp) => ({
          creatorId: imp.creatorId,
          displayName: imp.creator.displayName,
          viewsVideos30d: Number(imp.viewsVideos30d),
          viewsShorts30d: Number(imp.viewsShorts30d),
          impactTotal30d: Number(imp.impactTotal30d),
          videos30d: imp.videos30d,
          shorts30d: imp.shorts30d,
          snapshotDate: imp.snapshotDate.toISOString().split('T')[0]
        }));

        return reply.send({
          date: dateStr,
          total: results.length,
          results
        });
      } catch (error) {
        fastify.log.error(error);
        return reply.status(500).send({
          success: false,
          error: 'Error al obtener registros de auditoría de impacto',
          details: error instanceof Error ? error.message : String(error)
        });
      }
    }
  );
};
