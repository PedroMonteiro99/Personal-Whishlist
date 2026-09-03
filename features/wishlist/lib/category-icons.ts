import {
  Blocks,
  Car,
  Coffee,
  Footprints,
  Gamepad2,
  House,
  Monitor,
  Package,
  SprayCan,
  Watch,
  type LucideIcon,
} from "lucide-react";

/**
 * Mapa estático dos ícones permitidos no frontmatter das categorias
 * (`icon`). Estático de propósito: um import dinâmico traria toda a
 * biblioteca para o bundle.
 */
const categoryIcons: Record<string, LucideIcon> = {
  blocks: Blocks,
  car: Car,
  coffee: Coffee,
  footprints: Footprints,
  "gamepad-2": Gamepad2,
  house: House,
  monitor: Monitor,
  "spray-can": SprayCan,
  watch: Watch,
};

export function resolveCategoryIcon(icon?: string): LucideIcon {
  return (icon && categoryIcons[icon]) || Package;
}
