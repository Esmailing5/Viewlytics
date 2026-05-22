import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { YouTubeAdapter } from '../../adapters/youtube/youtube.adapter';

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
      
      return {
        query: q,
        results
      };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({ error: 'Validation Error', details: (error as z.ZodError).errors });
      }
      throw error;
    }
  });
}
