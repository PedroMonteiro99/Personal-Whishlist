-- 0004_reservations.sql
--
-- Reservas de presentes (DB-901). É o primeiro estado escrito a partir do
-- browser — o oposto de conteúdo, que continua a viver no Git (REPO-004).
--
-- Modelo de segurança, sem contas de utilizador:
--   · A tabela tem RLS ativa e NENHUMA política. Ninguém lhe toca diretamente,
--     nem para ler: a chave anónima exposta ao browser não serve de nada aqui.
--   · Todo o acesso passa por três funções `security definer`, que são a
--     superfície pública. Cada uma expõe só o que é preciso.
--   · Quem reserva guarda um token aleatório no seu browser. A base de dados
--     guarda apenas o SHA-256 desse token: uma fuga da tabela não permite
--     cancelar reservas de ninguém.
--
-- Não há chave estrangeira para produtos: o catálogo não vive aqui (DB-002).
-- Uma reserva de um produto entretanto removido do MDX deixa simplesmente de
-- ser mostrada.

create extension if not exists pgcrypto with schema extensions;

create table if not exists reservations (
  id uuid primary key default gen_random_uuid(),
  product_slug text not null,
  reserver_name text not null,
  token_hash text not null,
  created_at timestamptz not null default now(),
  constraint reservations_name_length
    check (char_length(reserver_name) between 1 and 40),
  constraint reservations_slug_length
    check (char_length(product_slug) between 1 and 120)
);

-- Um produto só pode ser oferecido uma vez: é o objetivo da funcionalidade.
create unique index if not exists reservations_product_slug_key
  on reservations (product_slug);

alter table reservations enable row level security;

-- Sem políticas: o acesso direto fica fechado para `anon` e `authenticated`.

-- Devolve o estado público. Nunca expõe `token_hash`: em vez disso, compara-o
-- com o token de quem pergunta e devolve apenas um booleano, para o browser
-- saber quais reservas são suas sem ter de as registar localmente.
create or replace function public.list_reservations(p_token text default null)
returns table (
  product_slug text,
  reserver_name text,
  created_at timestamptz,
  is_mine boolean
)
language sql
security definer
stable
set search_path = public, extensions
as $$
  select
    r.product_slug,
    r.reserver_name,
    r.created_at,
    p_token is not null
      and r.token_hash = encode(extensions.digest(p_token, 'sha256'), 'hex')
  from reservations r;
$$;

-- Devolve false quando o produto já estava reservado, sem revelar por quem.
create or replace function public.reserve_product(
  p_slug text,
  p_name text,
  p_token text
)
returns boolean
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  v_name text := nullif(btrim(p_name), '');
begin
  if v_name is null or char_length(v_name) > 40 then
    raise exception 'Nome inválido' using errcode = '22023';
  end if;

  if p_token is null or char_length(p_token) < 20 then
    raise exception 'Token inválido' using errcode = '22023';
  end if;

  if p_slug is null or char_length(btrim(p_slug)) = 0 then
    raise exception 'Produto inválido' using errcode = '22023';
  end if;

  insert into reservations (product_slug, reserver_name, token_hash)
  values (
    btrim(p_slug),
    v_name,
    encode(extensions.digest(p_token, 'sha256'), 'hex')
  )
  on conflict (product_slug) do nothing;

  return found;
end;
$$;

-- Só apaga quando o token corresponde: ninguém desfaz a reserva de outro.
create or replace function public.release_product(p_slug text, p_token text)
returns boolean
language plpgsql
security definer
set search_path = public, extensions
as $$
begin
  if p_token is null or p_slug is null then
    return false;
  end if;

  delete from reservations
  where product_slug = btrim(p_slug)
    and token_hash = encode(extensions.digest(p_token, 'sha256'), 'hex');

  return found;
end;
$$;

revoke all on function public.list_reservations(text) from public;
revoke all on function public.reserve_product(text, text, text) from public;
revoke all on function public.release_product(text, text) from public;

grant execute on function public.list_reservations(text) to anon, authenticated;
grant execute on function public.reserve_product(text, text, text) to anon, authenticated;
grant execute on function public.release_product(text, text) to anon, authenticated;
