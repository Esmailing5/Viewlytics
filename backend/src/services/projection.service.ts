import { prisma } from '../lib/prisma';

export interface ProjectionPoint {
  daysFromNow: number;
  date: string;        // ISO string
  subscribers: number;
  totalViews: number;
}

export interface ProjectionResult {
  creatorId: string;
  currentSubscribers: number;
  currentTotalViews: number;
  confidence: number;  // R² as a percentage (0-100)
  dataPoints: number;  // how many snapshots were used
  historical: ProjectionPoint[];  // actual points
  projected: ProjectionPoint[];   // projected points (30, 60, 90 days from now)
  subscribersGrowthRate: number;  // avg subscribers/day (slope)
  viewsGrowthRate: number;        // avg views/day (slope)
}

function linearRegression(points: { x: number; y: number }[]): { slope: number; intercept: number } {
  const n = points.length;
  const sumX = points.reduce((a, p) => a + p.x, 0);
  const sumY = points.reduce((a, p) => a + p.y, 0);
  const sumXY = points.reduce((a, p) => a + p.x * p.y, 0);
  const sumX2 = points.reduce((a, p) => a + p.x * p.x, 0);

  const denominator = n * sumX2 - sumX * sumX;
  if (denominator === 0) {
    return { slope: 0, intercept: sumY / n };
  }

  const slope = (n * sumXY - sumX * sumY) / denominator;
  const intercept = (sumY - slope * sumX) / n;
  return { slope, intercept };
}

function calculateR2(points: { x: number; y: number }[], slope: number, intercept: number): number {
  const n = points.length;
  if (n === 0) return 0;

  const sumY = points.reduce((a, p) => a + p.y, 0);
  const meanY = sumY / n;

  let ssRes = 0;
  let ssTot = 0;

  for (const p of points) {
    const fX = slope * p.x + intercept;
    ssRes += Math.pow(p.y - fX, 2);
    ssTot += Math.pow(p.y - meanY, 2);
  }

  if (ssTot === 0) {
    return 1;
  }

  return Math.max(0, Math.min(1, 1 - ssRes / ssTot));
}

export class ProjectionService {
  static async calculateProjection(creatorId: string): Promise<ProjectionResult> {
    const creator = await prisma.creator.findUnique({
      where: { id: creatorId },
    });

    if (!creator) {
      throw new Error('Creator not found');
    }

    const snapshots = await prisma.creatorSnapshot.findMany({
      where: { creatorId },
      orderBy: { snapshotDate: 'asc' },
    });

    if (snapshots.length < 3) {
      throw new Error('Historial insuficiente para proyectar');
    }

    const firstSnapshotDate = new Date(snapshots[0].snapshotDate);

    // Convert snaps to points for regression:
    // x = days since the first snapshot
    const subPoints = snapshots.map((s) => {
      const daysSinceFirst = (new Date(s.snapshotDate).getTime() - firstSnapshotDate.getTime()) / (1000 * 60 * 60 * 24);
      return { x: daysSinceFirst, y: Number(s.subscribers) };
    });

    const viewsPoints = snapshots.map((s) => {
      const daysSinceFirst = (new Date(s.snapshotDate).getTime() - firstSnapshotDate.getTime()) / (1000 * 60 * 60 * 24);
      return { x: daysSinceFirst, y: Number(s.totalViews) };
    });

    const regSub = linearRegression(subPoints);
    const regViews = linearRegression(viewsPoints);

    const r2Sub = calculateR2(subPoints, regSub.slope, regSub.intercept);
    const r2Views = calculateR2(viewsPoints, regViews.slope, regViews.intercept);

    const avgR2 = (r2Sub + r2Views) / 2;
    const confidence = Math.max(0, Math.min(100, avgR2 * 100));

    const today = new Date();
    const daysFromFirstToToday = (today.getTime() - firstSnapshotDate.getTime()) / (1000 * 60 * 60 * 24);

    const historical: ProjectionPoint[] = snapshots.map((s) => {
      const sDate = new Date(s.snapshotDate);
      const daysFromNow = (sDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
      return {
        daysFromNow,
        date: sDate.toISOString(),
        subscribers: Number(s.subscribers),
        totalViews: Number(s.totalViews),
      };
    });

    const projectionDays = [30, 60, 90];
    const projected: ProjectionPoint[] = projectionDays.map((days) => {
      const targetX = daysFromFirstToToday + days;
      const projSub = Math.max(0, regSub.slope * targetX + regSub.intercept);
      const projViews = Math.max(0, regViews.slope * targetX + regViews.intercept);
      const targetDate = new Date(today.getTime() + days * 24 * 60 * 60 * 1000);

      return {
        daysFromNow: days,
        date: targetDate.toISOString(),
        subscribers: Math.round(projSub),
        totalViews: Math.round(projViews),
      };
    });

    const latestSnapshot = snapshots[snapshots.length - 1];

    return {
      creatorId,
      currentSubscribers: Number(latestSnapshot.subscribers),
      currentTotalViews: Number(latestSnapshot.totalViews),
      confidence,
      dataPoints: snapshots.length,
      historical,
      projected,
      subscribersGrowthRate: regSub.slope,
      viewsGrowthRate: regViews.slope,
    };
  }
}
