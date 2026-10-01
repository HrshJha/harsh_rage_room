import { z } from 'zod';
/* eslint no-control-regex: "off" -- Reject invisible controls in exact roast text. */
import { attackIds } from './contracts';
export const statsSchema = z.object({
  attacks: z.number().int().min(0).max(10000),
  ultimates: z.number().int().min(0).max(10000),
  crits: z.number().int().min(0).max(10000),
  maxCombo: z.number().int().min(0).max(10000),
  accuracy: z.number().min(0).max(1),
  score: z.number().min(0).max(1000000),
  durationMs: z.number().min(0).max(86400000),
  round: z.number().int().min(1).max(1000),
  visitN: z.number().int().min(1).max(1000000),
  ttfhMs: z.number().min(0).max(86400000),
  weaponFavourite: z.enum(attackIds),
  shared: z.boolean(),
});
export const notifySchema = z
  .object({
    eventId: z.uuid(),
    kind: z.enum(['attack', 'first_blood', 'combo', 'ultimate', 'ko', 'final', 'compliment']),
    attack: z.enum(attackIds).optional(),
    hit: z.boolean().optional(),
    occurredAt: z.iso.datetime().optional(),
    roastText: z.string().max(280).optional(),
    anger: z.enum(['little', 'pretty', 'extremely', 'beyond']).optional(),
    reason: z.string().max(80).optional(),
    name: z.string().max(20).optional(),
    freeText: z.string().max(80).optional(),
    combo: z
      .object({ name: z.string().max(40), length: z.number().int().min(1).max(10000) })
      .optional(),
    sentence: z.string().max(150).optional(),
    compliments: z.array(z.string().max(100)).max(3).optional(),
    stats: statsSchema.optional(),
    device: z.enum(['touch', 'pointer']).optional(),
  })
  .strict()
  .superRefine((event, ctx) => {
    if (event.kind === 'attack') {
      if (!event.attack || event.hit === undefined || !event.occurredAt)
        ctx.addIssue({ code: 'custom', message: 'Incomplete attack event' });
      if (event.attack === 'roast') {
        if (!event.roastText?.trim())
          ctx.addIssue({ code: 'custom', path: ['roastText'], message: 'Roast text is required' });
        else if (
          /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f-\u009f\u202a-\u202e\u2066-\u2069]/.test(
            event.roastText,
          )
        )
          ctx.addIssue({
            code: 'custom',
            path: ['roastText'],
            message: 'Roast contains control characters',
          });
      } else if (event.roastText !== undefined)
        ctx.addIssue({
          code: 'custom',
          path: ['roastText'],
          message: 'Roast text on non-roast attack',
        });
    } else if (event.roastText !== undefined)
      ctx.addIssue({
        code: 'custom',
        path: ['roastText'],
        message: 'Roast text on non-attack event',
      });
  });
