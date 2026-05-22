import { CreatorAnalyticsPage } from '@/components/analytics/CreatorAnalyticsPage';

export default async function ChannelPage({
  params,
}: {
  params: Promise<{ platform: string; slug: string }>;
}) {
  const { platform, slug } = await params;

  return (
    <div className="max-w-[1600px] mx-auto">
      {/* Channel Header Placeholder */}
      <div className="mb-8 p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-color)] flex items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] capitalize">
            Analytics
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1 capitalize">
            {platform} Creator
          </p>
        </div>
      </div>

      <CreatorAnalyticsPage platform={platform} channelId={slug} />
    </div>
  );
}
