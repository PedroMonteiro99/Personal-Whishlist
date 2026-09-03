import Link from "next/link";

import { ArrowUpRight } from "lucide-react";

import { Button } from "@/components/ui/button";

export function StoreLink({ href, label }: { href: string; label: string }) {
  return (
    <Button asChild>
      <Link href={href} target="_blank" rel="noreferrer">
        {label}
        <ArrowUpRight className="size-4" />
        <span className="sr-only">(abre num separador novo)</span>
      </Link>
    </Button>
  );
}
