import { Gift } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

/**
 * Substitui a ação de oferecer quando o presente já foi recebido. A página
 * continua a existir — o slug pode ter sido partilhado (SEO-005) — mas deixa
 * de convidar a agir.
 */
export function ReceivedNotice({ occasionName }: { occasionName: string }) {
  return (
    <Card className="border-border/70 bg-card/60">
      <CardContent className="flex items-center gap-3 p-5 text-sm text-muted-foreground">
        <Gift aria-hidden className="size-4 shrink-0" />
        <span>
          Já recebi este presente no{" "}
          <span className="font-medium text-foreground">{occasionName}</span>.
        </span>
      </CardContent>
    </Card>
  );
}
