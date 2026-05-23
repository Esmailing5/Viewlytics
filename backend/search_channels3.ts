import 'dotenv/config';

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

const channelsToSearch = [
  'Alofoke FM',
  'Santiago Matias personal',
  'DJ Nabil',
  'El Show de Carlos Duran',
];

async function run() {
  if (!YOUTUBE_API_KEY) throw new Error("No API key");
  
  for (const q of channelsToSearch) {
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&maxResults=1&q=${encodeURIComponent(q)}&key=${YOUTUBE_API_KEY}`;
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
