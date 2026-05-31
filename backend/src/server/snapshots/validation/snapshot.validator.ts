import { prisma } from '../../../lib/prisma';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  anomalies: string[];
}

export class SnapshotValidator {
  /**
   * Validates raw snapshot data before inserting it into the database.
   * Performs basic data type and value range checks, checks for duplicates,
   * and runs checks to identify potential anomalies.
   */
  static async validate(
    creatorId: string,
    data: {
      subscribers: bigint | number;
      totalViews: bigint | number;
      totalVideos: number;
    }
  ): Promise<ValidationResult> {
    const errors: string[] = [];
    const anomalies: string[] = [];

    const subs = typeof data.subscribers === 'bigint' ? Number(data.subscribers) : data.subscribers;
    const views = typeof data.totalViews === 'bigint' ? Number(data.totalViews) : data.totalViews;
    const videos = data.totalVideos;

    // 1. Detect Null / Undefined / NaN values
    if (subs === null || subs === undefined || Number.isNaN(subs)) {
      errors.push('Subscriber count is null, undefined, or NaN.');
    }
    if (views === null || views === undefined || Number.isNaN(views)) {
      errors.push('View count is null, undefined, or NaN.');
    }
    if (videos === null || videos === undefined || Number.isNaN(videos)) {
      errors.push('Video count is null, undefined, or NaN.');
    }

    // 2. Detect Negative values
    if (subs !== null && subs !== undefined && subs < 0) {
      errors.push(`Subscriber count cannot be negative: ${subs}`);
    }
    if (views !== null && views !== undefined && views < 0) {
      errors.push(`View count cannot be negative: ${views}`);
    }
    if (videos !== null && videos !== undefined && videos < 0) {
      errors.push(`Video count cannot be negative: ${videos}`);
    }

    // Stop execution if basic validation fails
    if (errors.length > 0) {
      return { isValid: false, errors, anomalies };
    }

    // 3. Detect Duplicate snapshots (for same creator on same calendar day)
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const duplicate = await prisma.creatorSnapshot.findFirst({
        where: {
          creatorId,
          snapshotDate: {
            gte: today,
          },
        },
      });
      if (duplicate) {
        errors.push(`Duplicate snapshot detected for creator ID ${creatorId} today.`);
      }
    } catch (err) {
      anomalies.push(`Failed to perform duplicate snapshot check: ${(err as Error).message}`);
    }

    // 4. Detect Evident Anomalies (comparing with previous historical snapshot)
    try {
      const lastSnapshot = await prisma.creatorSnapshot.findFirst({
        where: { creatorId },
        orderBy: { snapshotDate: 'desc' },
      });

      if (lastSnapshot) {
        const lastSubs = Number(lastSnapshot.subscribers);
        const lastViews = Number(lastSnapshot.totalViews);
        const lastVideos = lastSnapshot.totalVideos;

        // View count drop (views should not drop unless videos were deleted)
        if (views < lastViews) {
          const dropPct = ((lastViews - views) / lastViews) * 100;
          if (dropPct > 5) {
            anomalies.push(`Evident view count drop: views dropped from ${lastViews} to ${views} (${dropPct.toFixed(2)}% reduction). Possible video deletion or data anomaly.`);
          }
        }

        // Severe subscriber drop (> 20% in 24 hours)
        if (subs < lastSubs) {
          const dropPct = ((lastSubs - subs) / lastSubs) * 100;
          if (dropPct > 20) {
            anomalies.push(`Severe subscriber drop: subscribers dropped from ${lastSubs} to ${subs} (${dropPct.toFixed(2)}% reduction) in 24 hours.`);
          }
        }

        // Unrealistic subscriber spike (> 100% in 24 hours, only evaluated if base is > 1000)
        if (subs > lastSubs && lastSubs > 1000) {
          const growthPct = ((subs - lastSubs) / lastSubs) * 100;
          if (growthPct > 100) {
            anomalies.push(`Unreasonable subscriber spike: subscribers grew from ${lastSubs} to ${subs} (${growthPct.toFixed(2)}% increase) in 24 hours.`);
          }
        }

        // Unrealistic views spike (> 200% in 24 hours, only evaluated if base is > 10000)
        if (views > lastViews && lastViews > 10000) {
          const growthPct = ((views - lastViews) / lastViews) * 100;
          if (growthPct > 200) {
            anomalies.push(`Unreasonable view count spike: views grew from ${lastViews} to ${views} (${growthPct.toFixed(2)}% increase) in 24 hours.`);
          }
        }
      }
    } catch (err) {
      anomalies.push(`Failed to perform historical anomaly comparison: ${(err as Error).message}`);
    }

    return {
      isValid: errors.length === 0,
      errors,
      anomalies,
    };
  }
}
