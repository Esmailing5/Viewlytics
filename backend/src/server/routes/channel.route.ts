import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { YouTubeAdapter } from '../../adapters/youtube/youtube.adapter';

const channelParamsSchema = z.object({
  platform: z.enum(['youtube', 'twitch', 'kick']),
  slug: z.string(),
});

export async function channelRoutes(fastify: FastifyInstance) {
  fastify.get('/:platform/:slug', async (request, reply) => {
    try {
      const { platform, slug } = channelParamsSchema.parse(request.params);
      
      const youtubeAdapter = new YouTubeAdapter();
      
      let data;
      if (platform === 'youtube') {
        data = await youtubeAdapter.getCreatorAnalytics(slug); // slug is the channel_id now
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
