"use client";

import { useTransition } from "react";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { FilterChip } from "@/features/filters/components/FilterChip";
import {
  CATEGORY_PARAM,
  PRICE_PARAM,
  PRIORITY_PARAM,
  SORT_PARAM,
  STORE_PARAM,
  countActiveFilters,
  priceBuckets,
  priorityOptions,
  sortOptions,
  type ProductFilters,
} from "@/features/filters/lib/product-filters";

type NamedEntry = { slug: string; name: string };

export function Filters({
  filters,
  stores,
  categories,
}: {
  filters: ProductFilters;
  stores: NamedEntry[];
  categories: NamedEntry[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const activeCount = countActiveFilters(filters);

  const navigate = (params: URLSearchParams) => {
    const search = params.toString();

    startTransition(() => {
      router.replace(search ? `${pathname}?${search}` : pathname, {
        scroll: false,
      });
    });
  };

  const setParam = (key: string, value?: string) => {
    // Partir sempre da URL atual: cada filtro só é dono do seu parâmetro.
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    navigate(params);
  };

  const clearAll = () => {
    const params = new URLSearchParams();
    const query = searchParams.get("q");

    if (query) {
      params.set("q", query);
    }

    navigate(params);
  };

  return (
    <div className="flex flex-wrap items-center gap-2" aria-busy={isPending}>
      <FilterChip
        label="Loja"
        placeholder="Loja"
        value={filters.store}
        options={stores.map((store) => ({
          value: store.slug,
          label: store.name,
        }))}
        onChange={(value) => setParam(STORE_PARAM, value)}
      />

      <FilterChip
        label="Categoria"
        placeholder="Categoria"
        value={filters.category}
        options={categories.map((category) => ({
          value: category.slug,
          label: category.name,
        }))}
        onChange={(value) => setParam(CATEGORY_PARAM, value)}
      />

      <FilterChip
        label="Orçamento"
        placeholder="Orçamento"
        value={filters.price}
        options={priceBuckets.map((bucket) => ({
          value: bucket.value,
          label: bucket.label,
        }))}
        onChange={(value) => setParam(PRICE_PARAM, value)}
      />

      <FilterChip
        label="Prioridade"
        placeholder="Prioridade"
        value={filters.priority}
        options={priorityOptions}
        onChange={(value) => setParam(PRIORITY_PARAM, value)}
      />

      <FilterChip
        label="Ordenar"
        value={filters.sort}
        isActive={filters.sort !== "destaque"}
        options={sortOptions}
        onChange={(value) =>
          setParam(SORT_PARAM, value === "destaque" ? undefined : value)
        }
      />

      {activeCount > 0 || filters.sort !== "destaque" ? (
        <button
          type="button"
          onClick={clearAll}
          className="ml-1 h-9 rounded-full px-3 text-sm font-medium text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
        >
          Limpar filtros
        </button>
      ) : null}
    </div>
  );
}
