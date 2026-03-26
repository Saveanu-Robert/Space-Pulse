import { z } from 'zod/v4';

const EONETGeometrySchema = z.object({
  magnitudeValue: z.number().nullable().optional(),
  magnitudeUnit: z.string().nullable().optional(),
  date: z.string(),
  type: z.string(),
  coordinates: z.union([z.array(z.number()), z.array(z.any())]),
});

const EONETCategorySchema = z.object({
  id: z.string(),
  title: z.string(),
});

const EONETSourceSchema = z.object({
  id: z.string(),
  url: z.string(),
});

export const NasaEONETEventSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().nullable().optional(),
  link: z.string(),
  closed: z.string().nullable().optional(),
  categories: z.array(EONETCategorySchema),
  sources: z.array(EONETSourceSchema),
  geometry: z.array(EONETGeometrySchema),
});

export const NasaEONETResponseSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  link: z.string().optional(),
  events: z.array(NasaEONETEventSchema),
});

export type NasaEONETResponse = z.infer<typeof NasaEONETResponseSchema>;
export type NasaEONETEvent = z.infer<typeof NasaEONETEventSchema>;
