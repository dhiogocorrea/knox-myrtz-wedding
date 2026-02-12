import fs from "fs";
import path from "path";
import yaml from "js-yaml";
import { SiteConfigSchema, type SiteConfig } from "./schema";

let cachedConfig: SiteConfig | null = null;

export function getSiteConfig(): SiteConfig {
  if (cachedConfig) return cachedConfig;

  const configPath = path.join(process.cwd(), "config", "site.yaml");
  const fileContents = fs.readFileSync(configPath, "utf8");
  const rawConfig = yaml.load(fileContents);

  const parsed = SiteConfigSchema.parse(rawConfig);
  cachedConfig = parsed;
  return parsed;
}
