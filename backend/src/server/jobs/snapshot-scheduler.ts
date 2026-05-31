import cron from 'node-cron';
import { FastifyInstance } from 'fastify';
import { runDailySnapshots } from '../../modules/snapshots/run-daily-snapshots';

export interface SchedulerStatus {
  enabled: boolean;
  cronExpression: string;
  timezone: string;
  nextRun: string | null;
  lastRun: string | null;
  lastSuccess: boolean | null;
  snapshotsCreated: number;
}

export const schedulerStatus: SchedulerStatus = {
  enabled: true,
  cronExpression: '0 3 * * *',
  timezone: process.env.CRON_TIMEZONE || 'America/Santo_Domingo',
  nextRun: null,
  lastRun: null,
  lastSuccess: null,
  snapshotsCreated: 0,
};

/**
 * Calculates and updates the next scheduled run time.
 */
export function updateNextRun() {
  const now = new Date();
  const next = new Date(now);
  next.setHours(3, 0, 0, 0);
  if (next <= now) {
    next.setDate(next.getDate() + 1);
  }
  schedulerStatus.nextRun = next.toISOString();
}

/**
 * Initializes the automatic snapshot scheduler.
 * Runs once a day at 03:00 AM in the configured timezone.
 */
export function initSnapshotScheduler(fastify: FastifyInstance) {
  const timezone = schedulerStatus.timezone;
  const cronExpression = schedulerStatus.cronExpression;

  updateNextRun();

  fastify.log.info(`[Scheduler] Initializing Daily Snapshot Job. Scheduled at ${cronExpression} (Timezone: ${timezone})`);

  cron.schedule(
    cronExpression,
    async () => {
      fastify.log.info('[SnapshotJob] Running automatic daily snapshot engine...');
      schedulerStatus.lastRun = new Date().toISOString();
      try {
        const start = Date.now();
        const result = await runDailySnapshots();
        const duration = ((Date.now() - start) / 1000).toFixed(2);
        
        schedulerStatus.lastSuccess = true;
        schedulerStatus.snapshotsCreated += result.snapshotsCreated;
        updateNextRun();

        fastify.log.info(
          `[Success] Daily Snapshot Job completed successfully in ${duration}s. Details: Processed: ${result.totalProcessed}, Created: ${result.snapshotsCreated}, Skipped: ${result.skipped}, Failed: ${result.failed}`
        );
      } catch (error) {
        schedulerStatus.lastSuccess = false;
        updateNextRun();
        fastify.log.error(
          `[Error] Daily Snapshot Job encountered an error: ${error instanceof Error ? error.message : String(error)}`
        );
      }
    },
    {
      timezone: timezone,
    }
  );
}
