import 'dotenv/config';

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

const channelsToSearch = [
  'Sin Filtro Radio',
  'Las Exclusivas de Jose Peguero',
  'Duck Tape',
  'Somos Pueblo Media',
  'Santiago Matias',
  'Carlos Duran'
];

async function run() {
  if (!YOUTUBE_API_KEY) throw new Error("No API key");
  
  for (const q of channelsToSearch) {
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&maxResults=2&q=${encodeURIComponent(q)}&key=${YOUTUBE_API_KEY}`;
    try {
      const res = await fetch(url);
      const data = await res.json();
      if (data.items && data.items.length > 0) {
        for (const item of data.items) {
          const id = item.snippet.channelId;
          const title = item.snippet.title;
          console.log(`{ displayName: '${q}', slug: '${q.toLowerCase().replace(/[^a-z0-9]+/g, '')}', channelId: '${id}' }, // Found: ${title}`);
        }
      } else {
        console.log(`// NOT FOUND: ${q}`);
      }
    } catch(err) {
      console.log(`// ERROR: ${q}`);
    }
  }
}

run();
