import { PlayHistoryItem, RadioStation, WeeklyRecommendation } from '../types';
import { CURATED_STATIONS } from '../data/curatedStations';

export function generateWeeklyRecommendation(
  history: PlayHistoryItem[],
  allStations: RadioStation[]
): WeeklyRecommendation {
  const dateStr = new Date().toLocaleDateString('tr-TR', { month: 'long', day: 'numeric', year: 'numeric' });

  // If no history yet, pick a balanced eclectic vintage mix
  if (!history || history.length === 0) {
    return {
      id: 'rec_default_' + Date.now(),
      title: 'Altın Çağ Nostalji Seçkisi',
      description: 'Klasik caz, 1950ler gramofon taş plakları ve gece ambient frekanslarından oluşan özel hafta kaseti.',
      tagline: 'VINTAGE AIRWAVE SELECTION',
      coverStyle: 'amber',
      stations: [
        CURATED_STATIONS.find(s => s.id === 'fm-jazz24-seattle') || CURATED_STATIONS[0],
        CURATED_STATIONS.find(s => s.id === 'am-gramophone-classics') || CURATED_STATIONS[1],
        CURATED_STATIONS.find(s => s.id === 'fm-somafm-groove') || CURATED_STATIONS[2],
        CURATED_STATIONS.find(s => s.id === 'fm-fip-paris') || CURATED_STATIONS[3],
        CURATED_STATIONS.find(s => s.id === 'am-grand-ole-opry') || CURATED_STATIONS[4],
        CURATED_STATIONS.find(s => s.id === 'sw-synthwave-deepspace') || CURATED_STATIONS[5],
      ],
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
  const pool = [...allStations, ...CURATED_STATIONS];

  for (const st of pool) {
    if (recommended.length >= 6) break;
    const stGenre = st.genre.toLowerCase();
    const matchesGenre = sortedGenres.some(g => stGenre.includes(g) || g.includes(stGenre));
    if (matchesGenre && !recommended.some(r => r.id === st.id)) {
      recommended.push(st);
    }
  }

  // Fill up to 6 with diverse top curated
  for (const st of CURATED_STATIONS) {
    if (recommended.length >= 6) break;
    if (!recommended.some(r => r.id === st.id)) {
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
