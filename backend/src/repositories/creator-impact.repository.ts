import { prisma } from '../lib/prisma';
import { ImpactResult } from '../services/impactCalculator';

export class CreatorImpactRepository {
  /**
   * Upserts the creator impact record for a specific creator and snapshot date.
   */
  static async upsertImpact(creatorId: string, snapshotDate: Date, impact: ImpactResult) {
    return await prisma.creatorImpact.upsert({
      where: {
        creatorId_snapshotDate: {
          creatorId,
          snapshotDate,
        },
      },
      update: {
        viewsVideos30d: impact.viewsVideos30d,
        viewsShorts30d: impact.viewsShorts30d,
        impactTotal30d: impact.impactTotal30d,
        videos30d: impact.videos30d,
        shorts30d: impact.shorts30d,
      },
      create: {
        creatorId,
        snapshotDate,
        viewsVideos30d: impact.viewsVideos30d,
        viewsShorts30d: impact.viewsShorts30d,
        impactTotal30d: impact.impactTotal30d,
        videos30d: impact.videos30d,
        shorts30d: impact.shorts30d,
      },
    });
  }

  /**
   * Retrieves the most recent CreatorImpact record for a specific creator.
   */
  static async getLatestByCreator(creatorId: string) {
    return await prisma.creatorImpact.findFirst({
      where: { creatorId },
      orderBy: { snapshotDate: 'desc' },
    });
  }

  /**
   * Gets the most recent snapshotDate available in the CreatorImpact table.
   */
  static async getLatestSnapshotDate(): Promise<Date | null> {
    const result = await prisma.creatorImpact.aggregate({
      _max: {
        snapshotDate: true,
      },
    });
    return result._max.snapshotDate;
  }
}
