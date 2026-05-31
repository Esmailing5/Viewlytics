import { prisma } from '../../lib/prisma';

export interface GrowthMetrics {
  currentValue: number;
  previousValue: number;
  absoluteChange: number;
  percentageChange: number;
}

export interface HistoricalDataPoint {
  date: string;
  subscribers: number;
  views: number;
  videos: number;
  avgViews: number | null;
  engagementRate: number | null;
}

export class HistoricalAnalyticsService {
  /**
   * Helper to retrieve snapshots for a given creator in a specific range of days.
   */
  private static async getSnapshotsInRange(creatorId: string, days: number) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    return await prisma.creatorSnapshot.findMany({
      where: {
        creatorId,
        snapshotDate: {
          gte: startDate,
        },
      },
      orderBy: {
        snapshotDate: 'asc',
      },
    });
  }

  /**
   * Computes subscriber growth metrics (absolute and percentage change) over the last X days.
   */
  static async getSubscriberGrowth(creatorId: string, days: number = 30): Promise<GrowthMetrics> {
    const snapshots = await this.getSnapshotsInRange(creatorId, days);

    if (snapshots.length < 2) {
      return { currentValue: 0, previousValue: 0, absoluteChange: 0, percentageChange: 0 };
    }

    const first = Number(snapshots[0].subscribers);
    const last = Number(snapshots[snapshots.length - 1].subscribers);
    const absoluteChange = last - first;
    const percentageChange = first > 0 ? (absoluteChange / first) * 100 : 0;

    return {
      currentValue: last,
      previousValue: first,
      absoluteChange,
      percentageChange,
    };
  }

  /**
   * Computes view growth metrics (absolute and percentage change) over the last X days.
   */
  static async getViewGrowth(creatorId: string, days: number = 30): Promise<GrowthMetrics> {
    const snapshots = await this.getSnapshotsInRange(creatorId, days);

    if (snapshots.length < 2) {
      return { currentValue: 0, previousValue: 0, absoluteChange: 0, percentageChange: 0 };
    }

    const first = Number(snapshots[0].totalViews);
    const last = Number(snapshots[snapshots.length - 1].totalViews);
    const absoluteChange = last - first;
    const percentageChange = first > 0 ? (absoluteChange / first) * 100 : 0;

    return {
      currentValue: last,
      previousValue: first,
      absoluteChange,
      percentageChange,
    };
  }

  /**
   * Computes average views for a creator over the last X days.
   */
  static async getAverageViews(creatorId: string, days: number = 30): Promise<number> {
    const snapshots = await this.getSnapshotsInRange(creatorId, days);

    if (snapshots.length === 0) return 0;

    const validViews = snapshots
      .map((s) => s.avgViews)
      .filter((v): v is number => v !== null && v !== undefined);

    if (validViews.length === 0) return 0;

    const sum = validViews.reduce((acc, curr) => acc + curr, 0);
    return sum / validViews.length;
  }

  /**
   * Retrieves daily historical metrics series over the last X days.
   */
  static async getHistoricalSeries(creatorId: string, days: number = 30): Promise<HistoricalDataPoint[]> {
    const snapshots = await this.getSnapshotsInRange(creatorId, days);

    return snapshots.map((s) => ({
      date: s.snapshotDate.toISOString(),
      subscribers: Number(s.subscribers),
      views: Number(s.totalViews),
      videos: s.totalVideos,
      avgViews: s.avgViews,
      engagementRate: s.engagementRate,
    }));
  }
}
