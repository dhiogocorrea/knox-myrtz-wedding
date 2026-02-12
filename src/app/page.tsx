import { redirect } from "next/navigation";
import { getSiteConfig } from "@/lib/config";

export default function RootPage() {
  const config = getSiteConfig();
  redirect(`/${config.defaultLocale}`);
}
