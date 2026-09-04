-- 0003_drop_catalog_tables.sql
--
-- O catálogo deixou de viver na base de dados. A aplicação serve-o a partir dos
-- MDX em `content/`, e como o Git é a única fonte de verdade (REPO-001), toda a
-- alteração de conteúdo é um commit — que já dispara um rebuild. Uma cópia em
-- base de dados que ninguém lê só podia divergir em silêncio.
--
-- O projeto Supabase mantém-se para estado gerado por visitantes (reservas),
-- que é o oposto de conteúdo: não pertence ao Git.

drop table if exists product_links;
drop table if exists products;
drop table if exists categories;
drop table if exists stores;

-- Existe unicamente para o workflow `keepalive` ter o que consultar: o plano
-- gratuito do Supabase pausa o projeto ao fim de 30 dias sem atividade na base
-- de dados (CI-006). Sem tabelas, não haveria pedido possível.
create table if not exists heartbeat (
  id smallint primary key default 1,
  checked_at timestamptz not null default now(),
  constraint heartbeat_single_row check (id = 1)
);

insert into heartbeat (id) values (1) on conflict (id) do nothing;

alter table heartbeat enable row level security;

create policy "public read heartbeat" on heartbeat for select using (true);
