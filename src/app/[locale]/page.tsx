import { getSiteConfig } from "@/lib/config";
import { getDictionary } from "@/lib/i18n";
import { LoginGate } from "@/components/LoginGate";

export default async function LocalePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const config = getSiteConfig();
  const dict = getDictionary(locale);

  return (
    <LoginGate
      locale={locale}
      config={JSON.parse(JSON.stringify(config))}
      dict={dict}
    />
  );
}
