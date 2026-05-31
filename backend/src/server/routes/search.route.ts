import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { YouTubeAdapter } from '../../adapters/youtube/youtube.adapter';
import { prisma } from '../../lib/prisma';

const searchSchema = z.object({
  q: z.string().min(1, 'Query is required'),
});

const youtubeAdapter = new YouTubeAdapter();

export async function searchRoutes(fastify: FastifyInstance) {
  fastify.get('/', async (request, reply) => {
    try {
      const { q } = searchSchema.parse(request.query);
      
      // TODO: Wrap this in a SearchModule that handles caching and multiple platforms
      const results = await youtubeAdapter.searchChannels(q);

      // Check which channel IDs exist in the database
      const channelIds = results.map(r => r.channel_id);
      const existingCreators = await prisma.creator.findMany({
        where: {
          channelId: { in: channelIds }
        },
        select: {
          channelId: true
        }
      });
      const existingIds = new Set(existingCreators.map(c => c.channelId));

      const resultsWithStatus = results.map(r => ({
        ...r,
        alreadyExists: existingIds.has(r.channel_id)
      }));
      
      return {
        query: q,
        results: resultsWithStatus
      };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({ error: 'Validation Error', details: (error as any).errors });
      }
      throw error;
    }
  });
}
