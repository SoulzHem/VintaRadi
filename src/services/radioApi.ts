import { RadioStation, FrequencyBand } from '../types';
import { CURATED_STATIONS } from '../data/curatedStations';
import { StorageService } from './storage';

// Radio-Browser API mirrors with automatic fallback
const API_MIRRORS = [
  'https://de1.api.radio-browser.info',
  'https://nl1.api.radio-browser.info',
  'https://at1.api.radio-browser.info',
];

let currentMirrorIndex = 0;

function getApiBase(): string {
  return API_MIRRORS[currentMirrorIndex];
}

function rotateMirror() {
  currentMirrorIndex = (currentMirrorIndex + 1) % API_MIRRORS.length;
}

// Country normalization map for cross-language matching (TR, Türkiye, Turkey, US, ABD, etc.)
const COUNTRY_NORMALIZE_MAP: Record<string, { code: string; names: string[] }> = {
  tr: { code: 'TR', names: ['türkiye', 'turkey', 'tr'] },
  turkey: { code: 'TR', names: ['türkiye', 'turkey', 'tr'] },
  türkiye: { code: 'TR', names: ['türkiye', 'turkey', 'tr'] },
  us: { code: 'US', names: ['abd', 'united states', 'usa', 'us', 'amerika'] },
  usa: { code: 'US', names: ['abd', 'united states', 'usa', 'us', 'amerika'] },
  'united states': { code: 'US', names: ['abd', 'united states', 'usa', 'us', 'amerika'] },
  gb: { code: 'GB', names: ['birleşik krallık', 'ingiltere', 'united kingdom', 'uk', 'gb', 'england'] },
  uk: { code: 'GB', names: ['birleşik krallık', 'ingiltere', 'united kingdom', 'uk', 'gb', 'england'] },
  'united kingdom': { code: 'GB', names: ['birleşik krallık', 'ingiltere', 'united kingdom', 'uk', 'gb', 'england'] },
  fr: { code: 'FR', names: ['fransa', 'france', 'fr'] },
  france: { code: 'FR', names: ['fransa', 'france', 'fr'] },
  de: { code: 'DE', names: ['almanya', 'germany', 'deutschland', 'de'] },
  germany: { code: 'DE', names: ['almanya', 'germany', 'deutschland', 'de'] },
  it: { code: 'IT', names: ['italya', 'italy', 'italia', 'it'] },
  italy: { code: 'IT', names: ['italya', 'italy', 'italia', 'it'] },
  es: { code: 'ES', names: ['ispanya', 'spain', 'espana', 'es'] },
  spain: { code: 'ES', names: ['ispanya', 'spain', 'espana', 'es'] },
  ch: { code: 'CH', names: ['isviçre', 'switzerland', 'schweiz', 'suisse', 'ch'] },
  switzerland: { code: 'CH', names: ['isviçre', 'switzerland', 'schweiz', 'suisse', 'ch'] },
  jp: { code: 'JP', names: ['japonya', 'japan', 'nippon', 'jp'] },
  japan: { code: 'JP', names: ['japonya', 'japan', 'nippon', 'jp'] },
  ca: { code: 'CA', names: ['kanada', 'canada', 'ca'] },
  canada: { code: 'CA', names: ['kanada', 'canada', 'ca'] },
  nl: { code: 'NL', names: ['hollanda', 'netherlands', 'nederland', 'nl'] },
  netherlands: { code: 'NL', names: ['hollanda', 'netherlands', 'nederland', 'nl'] },
  gr: { code: 'GR', names: ['yunanistan', 'greece', 'gr'] },
  greece: { code: 'GR', names: ['yunanistan', 'greece', 'gr'] },
  br: { code: 'BR', names: ['brezilya', 'brazil', 'brasil', 'br'] },
  brazil: { code: 'BR', names: ['brezilya', 'brazil', 'brasil', 'br'] },
};

export function resolveCountryInfo(input: string): { code?: string; aliases: string[] } {
  const clean = input.trim().toLowerCase();
  if (!clean) return { aliases: [] };
  if (COUNTRY_NORMALIZE_MAP[clean]) {
    return {
      code: COUNTRY_NORMALIZE_MAP[clean].code,
      aliases: COUNTRY_NORMALIZE_MAP[clean].names,
    };
  }
  return {
    code: clean.length === 2 ? clean.toUpperCase() : undefined,
    aliases: [clean],
  };
}

// Map any station into a realistic analog frequency
export function assignRealisticFrequency(id: string, name: string, preferredBand: FrequencyBand = 'FM'): { frequency: number; band: FrequencyBand } {
  let hash = 0;
  const str = id + name;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  const posHash = Math.abs(hash);

  if (preferredBand === 'FM') {
    // FM: 87.5 to 108.0 MHz (step 0.1)
    const range = 108.0 - 87.5;
    const raw = 87.5 + ((posHash % (range * 10)) / 10);
    return { frequency: Number(raw.toFixed(1)), band: 'FM' };
  } else if (preferredBand === 'AM') {
    // AM: 530 to 1700 kHz (step 10)
    const raw = 530 + ((posHash % 118) * 10);
    return { frequency: raw, band: 'AM' };
  } else {
    // SW: 3.2 to 22.0 MHz (step 0.05)
    const raw = 3.2 + ((posHash % 377) * 0.05);
    return { frequency: Number(raw.toFixed(2)), band: 'SW' };
  }
}

export const RadioApiService = {
  async searchStations(params: {
    query?: string;
    country?: string;
    countryCode?: string;
    tag?: string;
    limit?: number;
    band?: FrequencyBand | 'ALL';
  }): Promise<RadioStation[]> {
    const { query = '', country = '', countryCode = '', tag = '', limit = 50, band } = params;

    const countryInfo = resolveCountryInfo(countryCode || country);
    const targetCode = countryInfo.code || (countryCode ? countryCode.toUpperCase() : undefined);
    const countryAliases = countryInfo.aliases;

    const tagTokens = tag
      .toLowerCase()
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    // Filter local curated stations with intelligent country & tag matching
    const curatedMatches = CURATED_STATIONS.filter(st => {
      // Band filter
      if (band && band !== 'ALL' && st.band !== band) return false;

      // Query filter (name, genre, description, country)
      if (query.trim()) {
        const q = query.toLowerCase();
        const matchesQuery =
          st.name.toLowerCase().includes(q) ||
          st.genre.toLowerCase().includes(q) ||
          (st.description && st.description.toLowerCase().includes(q)) ||
          st.country.toLowerCase().includes(q) ||
          st.tags?.some(t => t.toLowerCase().includes(q));
        if (!matchesQuery) return false;
      }

      // Country filter
      if (countryAliases.length > 0 || targetCode) {
        const stCountry = st.country.toLowerCase();
        const stCode = (st.countryCode || '').toUpperCase();
        const matchesCode = targetCode ? stCode === targetCode : false;
        const matchesAlias = countryAliases.some(alias => stCountry.includes(alias) || alias.includes(stCountry));
        if (!matchesCode && !matchesAlias) return false;
      }

      // Tag filter
      if (tagTokens.length > 0) {
        const matchesTag = tagTokens.some(tok =>
          st.genre.toLowerCase().includes(tok) ||
          (st.tags && st.tags.some(t => t.toLowerCase().includes(tok)))
        );
        if (!matchesTag) return false;
      }

      return true;
    });

    try {
      const queryParts: string[] = [];
      if (query.trim()) {
        queryParts.push(`name=${encodeURIComponent(query.trim())}`);
      }

      // If country code is known (e.g. TR for Turkey), use countrycode for 100% accurate Radio-Browser search
      if (targetCode) {
        queryParts.push(`countrycode=${encodeURIComponent(targetCode)}`);
      } else if (country.trim()) {
        queryParts.push(`country=${encodeURIComponent(country.trim())}`);
      }

      // Tag filter for API
      if (tagTokens.length > 0) {
        queryParts.push(`tag=${encodeURIComponent(tagTokens[0])}`);
      }

      queryParts.push(`limit=${limit}`);
      queryParts.push('hidebroken=true');
      queryParts.push('order=clickcount');
      queryParts.push('reverse=true');

      const url = `${getApiBase()}/json/stations/search?${queryParts.join('&')}`;

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (!response.ok) {
        rotateMirror();
        throw new Error(`API HTTP error: ${response.status}`);
      }

      const data = await response.json();
      if (!Array.isArray(data)) return curatedMatches;

      // Map API stations to our typed schema
      interface RadioBrowserItem {
        stationuuid: string;
        name: string;
        url_resolved?: string;
        url?: string;
        favicon?: string;
        country?: string;
        countrycode?: string;
        tags?: string;
        bitrate?: number;
        codec?: string;
        clickcount?: number;
        votes?: number;
      }

      const preferredBand: FrequencyBand = band && band !== 'ALL' ? band : 'FM';

      const mappedStations: RadioStation[] = (data as RadioBrowserItem[])
        .filter((item) => item.url_resolved || item.url)
        .map((item) => {
          const { frequency, band: assignedBand } = assignRealisticFrequency(item.stationuuid, item.name, preferredBand);
          const rawTags = (item.tags || '').split(',').map(t => t.trim()).filter(Boolean);
          const rawCountry = item.country || (item.countrycode === 'TR' ? 'Türkiye' : 'Uluslararası');

          return {
            id: `rb_${item.stationuuid}`,
            name: item.name.replace(/[^\w\s\u00C0-\u024F\u1E00-\u1EFF\u0400-\u04FF\u0600-\u06FF\.\-\&\'\/]/gi, '').trim() || item.name,
            url: item.url_resolved || item.url || '',
            favicon: item.favicon || undefined,
            country: rawCountry,
            countryCode: (item.countrycode || 'WW').toUpperCase(),
            genre: rawTags[0] ? rawTags[0].toUpperCase() : 'CANLI RADYO',
            frequency,
            band: assignedBand,
            bitrate: item.bitrate || 128,
            codec: item.codec || 'MP3',
            description: `${rawCountry} — ${rawTags.slice(0, 3).join(', ') || 'Canlı Yayın'}`,
            tags: rawTags,
            clicks: item.clickcount,
            votes: item.votes,
          };
        });

      // Filter mapped stations by band if a specific band is selected
      const filteredApiStations = (band && band !== 'ALL')
        ? mappedStations.filter(st => st.band === band)
        : mappedStations;

      // Merge curated matches on top (curated first, then API stations, avoid duplicate IDs/URLs)
      const allResults = [...curatedMatches];
      for (const st of filteredApiStations) {
        if (!allResults.some(r => r.id === st.id || r.url === st.url || (r.name.toLowerCase() === st.name.toLowerCase() && r.countryCode === st.countryCode))) {
          allResults.push(st);
        }
      }

      // Cache results in background for offline speed
      StorageService.saveCachedStations(allResults);

      return allResults;
    } catch (err) {
      console.warn('Radio API search fallback to cache & curated:', err);
      const cached = StorageService.getCachedStations();
      
      // Filter cached items
      const cachedMatches = cached.filter(st => {
        if (band && band !== 'ALL' && st.band !== band) return false;
        if (countryAliases.length > 0 || targetCode) {
          const stCountry = (st.country || '').toLowerCase();
          const stCode = (st.countryCode || '').toUpperCase();
          const matchesCode = targetCode ? stCode === targetCode : false;
          const matchesAlias = countryAliases.some(alias => stCountry.includes(alias) || alias.includes(stCountry));
          if (!matchesCode && !matchesAlias) return false;
        }
        return true;
      });

      const combined = [...curatedMatches, ...cachedMatches];
      return combined.filter((item, index, self) => index === self.findIndex(t => t.id === item.id));
    }
  },

  async getTopGlobalStations(band: FrequencyBand = 'FM'): Promise<RadioStation[]> {
    return this.searchStations({ limit: 40, band });
  }
};

