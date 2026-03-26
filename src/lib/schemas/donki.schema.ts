import { z } from 'zod/v4';

export const NasaDonkiFLRItemSchema = z.object({
  flrID: z.string(),
  beginTime: z.string(),
  peakTime: z.string().nullable().optional(),
  endTime: z.string().nullable().optional(),
  classType: z.string().nullable().optional(),
  sourceLocation: z.string().nullable().optional(),
  activeRegionNum: z.number().nullable().optional(),
  linkedEvents: z.array(z.object({
    activityID: z.string().optional(),
  }).passthrough()).nullable().optional(),
  link: z.string().optional(),
}).passthrough();

export const NasaDonkiFLRSchema = z.array(NasaDonkiFLRItemSchema);
export type NasaDonkiFLRItem = z.infer<typeof NasaDonkiFLRItemSchema>;

export const NasaDonkiCMEItemSchema = z.object({
  activityID: z.string(),
  startTime: z.string(),
  sourceLocation: z.string().nullable().optional(),
  activeRegionNum: z.number().nullable().optional(),
  note: z.string().nullable().optional(),
  link: z.string().optional(),
  cmeAnalyses: z.array(z.object({
    speed: z.number().nullable().optional(),
    type: z.string().nullable().optional(),
    halfAngle: z.number().nullable().optional(),
  }).passthrough()).nullable().optional(),
}).passthrough();

export const NasaDonkiCMESchema = z.array(NasaDonkiCMEItemSchema);
export type NasaDonkiCMEItem = z.infer<typeof NasaDonkiCMEItemSchema>;

export const NasaDonkiGSTItemSchema = z.object({
  gstID: z.string(),
  startTime: z.string(),
  allKpIndex: z.array(z.object({
    observedTime: z.string(),
    kpIndex: z.number(),
    source: z.string().optional(),
  }).passthrough()).nullable().optional(),
  link: z.string().optional(),
}).passthrough();

export const NasaDonkiGSTSchema = z.array(NasaDonkiGSTItemSchema);
export type NasaDonkiGSTItem = z.infer<typeof NasaDonkiGSTItemSchema>;

export const NasaDonkiNotificationItemSchema = z.object({
  messageID: z.string(),
  messageType: z.string(),
  messageURL: z.string().optional(),
  messageIssueTime: z.string(),
  messageBody: z.string(),
}).passthrough();

export const NasaDonkiNotificationsSchema = z.array(NasaDonkiNotificationItemSchema);
export type NasaDonkiNotificationItem = z.infer<typeof NasaDonkiNotificationItemSchema>;
