import { Badge } from "@/components/ui/badge";

import type { CatalogProduct } from "@/lib/catalog";

const priorityLabels: Record<CatalogProduct["priority"], string> = {
  low: "Prioridade baixa",
  medium: "Prioridade média",
  high: "Prioridade alta",
};

const priorityVariants: Record<
  CatalogProduct["priority"],
  "outline" | "secondary" | "default"
> = {
  low: "outline",
  medium: "secondary",
  high: "default",
};

export function PriorityBadge({
  priority,
}: {
  priority: CatalogProduct["priority"];
}) {
  return (
    <Badge variant={priorityVariants[priority]}>
      {priorityLabels[priority]}
    </Badge>
  );
}
