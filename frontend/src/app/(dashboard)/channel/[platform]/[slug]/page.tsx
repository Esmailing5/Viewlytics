import { CreatorAnalyticsPage } from '@/components/analytics/CreatorAnalyticsPage';

export default async function ChannelPage({
  params,
}: {
  params: Promise<{ platform: string; slug: string }>;
}) {
  const { platform, slug } = await params;

  return (
    <div className="max-w-[1600px] mx-auto">
      <CreatorAnalyticsPage platform={platform} channelId={slug} />
    </div>
  );
}
