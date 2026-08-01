import { Star } from "lucide-react";

import { cn } from "@/lib/utils";

export function FavoriteIndicator({
  favorite,
  className,
}: {
  favorite: boolean;
  className?: string;
}) {
  if (!favorite) {
    return null;
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-xs font-medium text-amber-200",
        className,
      )}
    >
      <Star className="size-3.5 fill-current" />
      Favorito
    </span>
  );
}
