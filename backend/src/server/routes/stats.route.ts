import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { prisma } from '../../lib/prisma';
import { CreatorImpactRepository } from '../../repositories/creator-impact.repository';

export const statsRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  fastify.get('/global', async (request, reply) => {
    try {
      const totalCreators = await prisma.creator.count({
        where: {
          trackingStatus: 'tracked',
        },
      });

      const latestImpactDate = await CreatorImpactRepository.getLatestSnapshotDate();

      let trackedCreators = 0;
      let totalViews30d = 0;

      if (latestImpactDate) {
        trackedCreators = await prisma.creatorImpact.count({
          where: {
            snapshotDate: latestImpactDate,
          },
        });

        const viewsSum = await prisma.creatorImpact.aggregate({
          where: {
            snapshotDate: latestImpactDate,
          },
          _sum: {
            impactTotal30d: true,
          },
        });

        totalViews30d = Number(viewsSum._sum.impactTotal30d || 0);
      }

      const activeCreators = await prisma.creator.findMany({
        where: {
          trackingStatus: 'tracked',
        },
        select: {
          id: true,
          snapshots: {
            orderBy: {
              snapshotDate: 'desc',
            },
            take: 1,
            select: {
              subscribers: true,
            },
          },
        },
      });

      const totalSubscribers = activeCreators.reduce((acc, creator) => {
        const latestSnapshot = creator.snapshots[0];
        if (latestSnapshot) {
          return acc + Number(latestSnapshot.subscribers);
        }
        return acc;
      }, 0);

      const updatedAt = latestImpactDate
        ? latestImpactDate.toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0];

      return reply.send({
        totalCreators,
        trackedCreators,
        totalSubscribers,
        totalViews30d,
        updatedAt,
      });
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({
        success: false,
        error: 'Failed to fetch global stats',
        details: error instanceof Error ? error.message : String(error),
      });
    }
  });

  fastify.get('/trending', async (request, reply) => {
    try {
      const dates = await prisma.creatorSnapshot.findMany({
        select: {
          snapshotDate: true,
        },
        distinct: ['snapshotDate'],
        orderBy: {
          snapshotDate: 'desc',
        },
        take: 2,
      });

      if (dates.length < 2) {
        return reply.send({
          updatedAt: new Date().toISOString().split('T')[0],
          results: [],
        });
      }

      const recentDate = dates[0].snapshotDate;
      const olderDate = dates[1].snapshotDate;

      const recentSnapshots = await prisma.creatorSnapshot.findMany({
        where: {
          snapshotDate: recentDate,
        },
        include: {
          creator: {
            select: {
              displayName: true,
              avatarUrl: true,
              platform: true,
              slug: true,
            },
          },
        },
      });

      const olderSnapshots = await prisma.creatorSnapshot.findMany({
        where: {
          snapshotDate: olderDate,
        },
      });

      const olderMap = new Map<string, number>();
      for (const snap of olderSnapshots) {
        olderMap.set(snap.creatorId, Number(snap.totalViews));
      }

      const list = [];
      for (const snap of recentSnapshots) {
        const recentViews = Number(snap.totalViews);
        const olderViews = olderMap.get(snap.creatorId);
        if (olderViews !== undefined) {
          const deltaViews = recentViews - olderViews;
          const growthPct = olderViews > 0 ? (deltaViews / olderViews) * 100 : 0;
          list.push({
            creatorId: snap.creatorId,
            displayName: snap.creator.displayName,
            avatarUrl: snap.creator.avatarUrl,
            slug: snap.creator.slug,
            deltaViews,
            growthPct,
            platform: snap.creator.platform,
          });
        }
      }

      list.sort((a, b) => b.deltaViews - a.deltaViews);
      const top6 = list.slice(0, 6);

      const updatedAt = recentDate.toISOString().split('T')[0];

      return reply.send({
        updatedAt,
        results: top6,
      });
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({
        success: false,
        error: 'Failed to fetch trending stats',
        details: error instanceof Error ? error.message : String(error),
      });
    }
  });
};
