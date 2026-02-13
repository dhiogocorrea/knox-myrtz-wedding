import { z } from "zod";

const LocalizedStringSchema = z.object({
  en: z.string(),
  pt: z.string(),
  el: z.string(),
});

const ScheduleItemSchema = z.object({
  time: z.string(),
  title: LocalizedStringSchema,
  description: LocalizedStringSchema,
  icon: z.string(),
  visibleTo: z.array(z.enum(["friends", "family"])).optional(),
});

const TouristicInfoSchema = z.object({
  title: LocalizedStringSchema,
  content: LocalizedStringSchema,
  icon: z.string(),
});

const WeddingInfoSchema = z.object({
  dressCode: LocalizedStringSchema,
  gifts: LocalizedStringSchema,
  accommodation: LocalizedStringSchema,
});

export const SiteConfigSchema = z.object({
  couple: z.object({
    partner1: z.object({ name: z.string(), shortName: z.string() }),
    partner2: z.object({ name: z.string(), shortName: z.string() }),
  }),
  wedding: z.object({
    date: z.string(),
    time: z.string(),
    venue: z.object({
      name: z.string(),
      address: z.string(),
      mapUrl: z.string(),
      coordinates: z.object({ lat: z.number(), lng: z.number() }),
    }),
    hashtag: z.string(),
  }),
  schedule: z.array(ScheduleItemSchema),
  rsvp: z.object({
    deadline: z.string(),
  }),
  defaultLocale: z.string(),
  locales: z.array(z.string()),
  touristicInfo: z.array(TouristicInfoSchema),
  weddingInfo: WeddingInfoSchema,
});

export type SiteConfig = z.infer<typeof SiteConfigSchema>;
export type LocalizedString = z.infer<typeof LocalizedStringSchema>;
export type Locale = "en" | "pt" | "el";
export type GuestGroup = "friends" | "family" | "admin" | null;
