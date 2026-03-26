import { z } from 'zod/v4';

export const NasaApodRawSchema = z.object({
  title: z.string(),
  date: z.string(),
  explanation: z.string(),
  media_type: z.string(),
  url: z.string(),
  hdurl: z.string().optional(),
  thumbnail_url: z.string().optional(),
  copyright: z.string().optional(),
  service_version: z.string().optional(),
});

export type NasaApodRaw = z.infer<typeof NasaApodRawSchema>;
