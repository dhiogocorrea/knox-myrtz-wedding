import { Inter, Playfair_Display, Great_Vibes, Noto_Serif_JP, Shippori_Mincho_B1, Dancing_Script } from "next/font/google";
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

const notoSerifJP = Noto_Serif_JP({
  weight: ["400", "700", "900"],
  subsets: ["latin"],
  variable: "--font-manga",
  display: "swap",
});

const shipporiMincho = Shippori_Mincho_B1({
  weight: ["400", "700", "800"],
  subsets: ["latin"],
  variable: "--font-zen",
  display: "swap",
});

const dancingScript = Dancing_Script({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-brush",
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

  const fontClass = [
    inter?.variable,
    playfair?.variable,
    greatVibes?.variable,
    notoSerifJP?.variable,
    shipporiMincho?.variable,
    dancingScript?.variable,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <html lang={locale}>
      <body className={`${fontClass} antialiased`} style={{ fontFamily: "var(--font-inter), sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
