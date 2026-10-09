import { PlayHistoryItem, RadioStation, WeeklyRecommendation } from '../types';

export function generateWeeklyRecommendation(
  history: PlayHistoryItem[],
  allStations: RadioStation[]
): WeeklyRecommendation {
  const dateStr = new Date().toLocaleDateString('tr-TR', { month: 'long', day: 'numeric', year: 'numeric' });

  // Without listening history, use only stations from the current catalog.
  if (!history || history.length === 0) {
    return {
      id: 'rec_default_' + Date.now(),
      title: 'Altın Çağ Nostalji Seçkisi',
      description: 'Katalogdaki istasyonlardan oluşturulan haftalık seçki.',
      tagline: 'VINTAGE AIRWAVE SELECTION',
      coverStyle: 'amber',
      stations: allStations.slice(0, 6),
      generatedDate: dateStr,
    };
  }

  // Count genre frequencies in user history
  const genreCounts: Record<string, number> = {};
  history.forEach((h) => {
    const g = (h.genre || 'Müzik').toLowerCase();
    genreCounts[g] = (genreCounts[g] || 0) + 1;
  });

  const sortedGenres = Object.keys(genreCounts).sort((a, b) => genreCounts[b] - genreCounts[a]);
  const topGenre = sortedGenres[0] || 'caz';

  // Find stations matching top genres or nearby frequencies
  const recommended: RadioStation[] = [];
  const pool = allStations;

  for (const st of pool) {
    if (recommended.length >= 6) break;
    const stGenre = st.genre.toLowerCase();
    const matchesGenre = sortedGenres.some(g => stGenre.includes(g) || g.includes(stGenre));
    if (matchesGenre && !recommended.some(r => r.id === st.id)) {
      recommended.push(st);
    }
  }

  return {
    id: 'rec_weekly_' + Date.now(),
    title: `Sizin İçin Haftalık ${topGenre.toUpperCase()} & Nostalji Bandı`,
    description: `Son dinleme alışkanlıklarınıza ve en çok çevirdiğiniz analog frekanslara göre özel olarak derlendi.`,
    tagline: 'KİŞİSELLEŞTİRİLMİŞ ANALOG KEŞİF',
    coverStyle: 'gold',
    stations: recommended,
    generatedDate: dateStr,
  };
}
