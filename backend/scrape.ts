async function run() {
  for (const q of ['Santiago Matias channel', 'Sin Filtro Radio Show channel']) {
    const res = await fetch(`https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`);
    const html = await res.text();
    const match = html.match(/"channelId":"(UC[^"]+)"/);
    console.log(q, match?.[1]);
  }
}
run();
