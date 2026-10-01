import type { z } from 'zod';
import type { statsSchema, notifySchema } from './schemas';
export const attackIds = [
  'slap',
  'punch',
  'chappal',
  'bonk',
  'tomato',
  'roast',
  'thunder',
  'emotional',
] as const;
export type AttackId = (typeof attackIds)[number];
export type ZoneId = 'glasses' | 'nose' | 'forehead' | 'cheeks' | 'hair' | 'torso';
export type Scene =
  'gate' | 'intro' | 'anger' | 'lie' | 'compliment' | 'room' | 'verdict' | 'certificate';
export type Anger = 0 | 1 | 2 | 3;
export type Delivery = 'idle' | 'pending' | 'delivered' | 'dry-run' | 'failed' | 'offline';
export type ReportStats = z.infer<typeof statsSchema>;
export type NotifyEvent = z.infer<typeof notifySchema>;
export type GameEvent =
  | {
      type: 'attack';
      attack: AttackId;
      zone: ZoneId | null;
      damage: number;
      crit: boolean;
      hit: boolean;
      comboName: string | null;
      first: boolean;
      ko: boolean;
      roastText?: string;
      occurredAt: string;
    }
  | { type: 'compliment'; lines: string[] }
  | { type: 'final'; shared: boolean };
export const angerLabels = [
  'A little annoyed',
  'Pretty angry',
  'Extremely angry',
  'Beyond human limits',
] as const;
export const angerKeys = ['little', 'pretty', 'extremely', 'beyond'] as const;
