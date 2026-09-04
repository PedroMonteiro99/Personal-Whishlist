-- 0002_multi_store_products.sql
-- Um produto pode existir em várias lojas, cada uma com o seu preço.
-- Ver PROJECT_BLUEPRINT.md — DB-001 e DB-004.

-- A loja e o preço passam a viver na relação produto↔loja.
alter table product_links
  add column if not exists store_id uuid references stores(id) on delete cascade,
  add column if not exists price numeric(10, 2);

-- O nome mostrado vem de `stores.name`; `label` só sobrepõe quando existe.
alter table product_links alter column label drop not null;

-- Um produto tem no máximo uma entrada por loja.
create unique index if not exists product_links_product_store_key
  on product_links (product_id, store_id);

-- Deixam de fazer sentido no produto: passaram para `product_links`.
alter table products drop column if exists store_id;
alter table products drop column if exists price;
