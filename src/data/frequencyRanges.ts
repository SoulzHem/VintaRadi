import { FrequencyBand } from '../types';

export const FREQUENCY_RANGES: Record<FrequencyBand, { min: number; max: number; step: number }> = {
  FM: { min: 87.5, max: 108, step: 0.1 },
  AM: { min: 530, max: 1700, step: 10 },
  SW: { min: 3.2, max: 22, step: 0.05 },
};
