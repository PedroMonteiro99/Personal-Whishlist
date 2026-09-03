"use client";

import { useId } from "react";

import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

export type FilterOption = { value: string; label: string };

/**
 * Um filtro individual (COMP-001 — `FilterChip`). Usa `select` nativo de
 * propósito: no telemóvel abre o picker do sistema, que é mais rápido e mais
 * acessível do que um menu desenhado — e não traz JavaScript de biblioteca.
 */
export function FilterChip({
  label,
  placeholder,
  options,
  value,
  isActive,
  onChange,
}: {
  label: string;
  placeholder?: string;
  options: FilterOption[];
  value?: string;
  isActive?: boolean;
  onChange: (value?: string) => void;
}) {
  const id = useId();
  const active = isActive ?? (Boolean(placeholder) && Boolean(value));

  return (
    <div
      className={cn(
        "relative inline-flex items-center rounded-full border text-sm transition-colors",
        active
          ? "border-primary/40 bg-primary/10 text-foreground"
          : "border-input bg-background text-muted-foreground hover:text-foreground",
      )}
    >
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <select
        id={id}
        value={value ?? ""}
        onChange={(event) => onChange(event.target.value || undefined)}
        className="h-9 cursor-pointer appearance-none rounded-full bg-transparent pl-4 pr-9 font-medium focus-visible:outline-none"
      >
        {placeholder ? <option value="">{placeholder}</option> : null}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown
        aria-hidden
        className="pointer-events-none absolute right-3 size-3.5 opacity-70"
      />
    </div>
  );
}
