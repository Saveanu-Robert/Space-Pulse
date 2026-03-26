import { z } from 'zod/v4';

const NeoCloseApproachSchema = z.object({
  close_approach_date: z.string(),
  close_approach_date_full: z.string().optional(),
  epoch_date_close_approach: z.number().optional(),
  relative_velocity: z.object({
    kilometers_per_second: z.string().optional(),
    kilometers_per_hour: z.string(),
    miles_per_hour: z.string().optional(),
  }),
  miss_distance: z.object({
    astronomical: z.string().optional(),
    lunar: z.string(),
    kilometers: z.string(),
    miles: z.string().optional(),
  }),
  orbiting_body: z.string().optional(),
});

const NeoObjectSchema = z.object({
  id: z.string(),
  neo_reference_id: z.string().optional(),
  name: z.string(),
  nasa_jpl_url: z.string(),
  absolute_magnitude_h: z.number().optional(),
  estimated_diameter: z.object({
    meters: z.object({
      estimated_diameter_min: z.number(),
      estimated_diameter_max: z.number(),
    }),
    kilometers: z.object({
      estimated_diameter_min: z.number(),
      estimated_diameter_max: z.number(),
    }).optional(),
  }),
  is_potentially_hazardous_asteroid: z.boolean(),
  close_approach_data: z.array(NeoCloseApproachSchema),
  is_sentry_object: z.boolean().optional(),
}).passthrough();

export const NasaNeoWsFeedSchema = z.object({
  element_count: z.number(),
  near_earth_objects: z.record(z.string(), z.array(NeoObjectSchema)),
}).passthrough();

export type NasaNeoWsFeed = z.infer<typeof NasaNeoWsFeedSchema>;
