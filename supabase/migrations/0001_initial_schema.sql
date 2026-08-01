-- 0001_initial_schema.sql
-- Ver PROJECT_BLUEPRINT.md — secção 14 (Database) para descrição de cada tabela.

create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text,
  icon text,
  "order" integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists stores (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  url text not null,
  logo text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  category_id uuid references categories(id) on delete set null,
  store_id uuid references stores(id) on delete set null,
  price numeric(10, 2),
  currency text not null default 'EUR',
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high')),
  favorite boolean not null default false,
  images jsonb not null default '[]',
  seo jsonb,
  body text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists product_links (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references products(id) on delete cascade not null,
  label text not null,
  url text not null,
  created_at timestamptz not null default now()
);

-- RLS: leitura pública, escrita apenas via service role (usado nos scripts de sincronização).
alter table categories enable row level security;
alter table stores enable row level security;
alter table products enable row level security;
alter table product_links enable row level security;

create policy "public read categories" on categories for select using (true);
create policy "public read stores" on stores for select using (true);
create policy "public read products" on products for select using (true);
create policy "public read product_links" on product_links for select using (true);
