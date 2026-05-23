import { prisma } from '../../lib/prisma';
import { TrackingStatus, Region } from '@prisma/client';
import { verifiedRDCreators } from './verified-rd-creators';

export async function seedRDCreators() {
  console.log('Starting Verified Dominican Creators seed process...');
  let inserted = 0;
  let updated = 0;
  let skipped = 0;
  let invalid = 0;

  for (const creator of verifiedRDCreators) {
    // Validación estricta: NO permitir creators sin channelId válido o slug
    if (!creator.channelId || !creator.channelId.startsWith('UC') || !creator.slug) {
      console.error(`[Invalid channelId] Creator missing valid YouTube ID or slug: ${creator.displayName}`);
      invalid++;
      continue;
    }

    // Buscamos por slug, ya que es el identificador único canónico en nuestra DB
    const existing = await prisma.creator.findFirst({
      where: {
        slug: creator.slug
      }
    });

    if (existing) {
      // Reemplazamos channelIds inválidos/placeholders o actualizamos la info
      if (existing.channelId !== creator.channelId) {
        await prisma.creator.update({
          where: { id: existing.id },
          data: {
            channelId: creator.channelId,
            displayName: creator.displayName,
            category: creator.category,
            trackingStatus: TrackingStatus.tracked,
            platform: 'youtube',
          }
        });
        console.log(`[Updated Creator] Replaced invalid channelId for: ${creator.displayName} -> [YouTube Verified] ${creator.channelId}`);
        updated++;
      } else {
        console.log(`[Skipped] Creator already exists and verified: ${creator.displayName}`);
        skipped++;
      }
    } else {
      // Insertar nuevos creators que no estaban en la DB
      await prisma.creator.create({
        data: {
          displayName: creator.displayName,
          slug: creator.slug,
          channelId: creator.channelId,
          category: creator.category,
          platform: 'youtube',
          trackingStatus: TrackingStatus.tracked,
          region: Region.dominican_republic,
          verified: true,
          description: `Canal oficial de ${creator.displayName}`,
        }
      });
      console.log(`[Inserted Creator] New [YouTube Verified] channel: ${creator.displayName}`);
      inserted++;
    }
  }

  console.log(`Seed process finished. Inserted: ${inserted}, Updated: ${updated}, Skipped: ${skipped}, Invalid: ${invalid}`);
  return { inserted, updated, skipped, invalid };
}
