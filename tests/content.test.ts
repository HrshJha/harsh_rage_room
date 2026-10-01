import { it, expect } from 'vitest';
import { z } from 'zod';
import content from '../web/src/content/dialogue.json';
it('validates every content deck and the promised roast/compliment counts', () => {
  const schema = z.record(z.string(), z.array(z.string().min(1).max(150)).min(3));
  expect(schema.safeParse(content).success).toBe(true);
  expect(content.roasts).toHaveLength(30);
  expect(content.compliments).toHaveLength(8);
  for (const deck of Object.values(content)) expect(new Set(deck).size).toBe(deck.length);
});
