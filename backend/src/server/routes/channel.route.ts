import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { YouTubeChannelAdapter } from '../../adapters/youtube/youtube.channel.adapter';

const channelParamsSchema = z.object({
  platform: z.enum(['youtube', 'twitch', 'kick']),
  slug: z.string(),
});

export async function channelRoutes(fastify: FastifyInstance) {
  fastify.get('/:platform/:slug', async (request, reply) => {
    try {
      const { platform, slug } = channelParamsSchema.parse(request.params);
      
      let data;
      if (platform === 'youtube') {
        const youtubeChannelAdapter = new YouTubeChannelAdapter();
        data = await youtubeChannelAdapter.getFullAnalytics(slug);
      } else {
        throw new Error(`Platform ${platform} not supported yet`);
      }
      
      return {
        platform,
        ...data
      };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({ error: 'Validation Error', details: (error as any).errors });
      }
      throw error;
    }
  });
}
