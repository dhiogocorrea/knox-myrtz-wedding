import type { LucideProps } from "lucide-react";
import {
  Wine,
  Sun,
  Church,
  Martini,
  UtensilsCrossed,
  Music,
  Plane,
  Hotel,
  Landmark,
  Soup,
} from "lucide-react";
import { type ComponentType } from "react";

const iconMap: Record<string, ComponentType<LucideProps>> = {
  wine: Wine,
  sun: Sun,
  church: Church,
  martini: Martini,
  utensils: UtensilsCrossed,
  music: Music,
  plane: Plane,
  hotel: Hotel,
  landmark: Landmark,
  soup: Soup,
};

interface ScheduleIconProps extends LucideProps {
  name: string;
}

export function ScheduleIcon({ name, ...props }: ScheduleIconProps) {
  const Icon = iconMap[name];
  if (!Icon) return null;
  return <Icon {...props} />;
}
