import { Inter, Playfair_Display, Great_Vibes } from "next/font/google";
import { getSiteConfig } from "@/lib/config";
import { getDictionary } from "@/lib/i18n";
import type { Metadata } from "next";

const inter = Inter({
  subsets: ["latin", "greek"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const greatVibes = Great_Vibes({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-great-vibes",
  display: "swap",
});

export async function generateStaticParams() {
  const config = getSiteConfig();
  return config.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const config = getSiteConfig();
  const dict = getDictionary(locale);

  return {
    title: `${config.couple.partner1.shortName} & ${config.couple.partner2.shortName} – ${dict.meta.title}`,
    description: dict.meta.description,
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <html lang={locale}>
      <body
        className={`${inter.variable} ${playfair.variable} ${greatVibes.variable} antialiased`}
        style={{
          fontFamily: "var(--font-inter), sans-serif",
        }}
      >
        {children}
      </body>
    </html>
  );
}
