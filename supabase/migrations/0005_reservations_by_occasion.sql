-- 0005_reservations_by_occasion.sql
--
-- Uma reserva pertence a uma ocasião. Sem isto, `unique(product_slug)` fazia
-- com que um produto só pudesse ser oferecido **uma vez para sempre**: passado
-- o Natal, continuaria eternamente "já tratado".
--
-- A ocasião vem do MDX (content/occasions/), que é a fonte de verdade. Aqui
-- guarda-se apenas o slug, sem chave estrangeira, pela mesma razão que
-- `product_slug` não a tem: o conteúdo não vive nesta base de dados.

alter table reservations
  add column if not exists occasion text not null default 'natal-2026';

alter table reservations
  alter column occasion drop default;

alter table reservations
  add constraint reservations_occasion_length
  check (char_length(occasion) between 1 and 60);

-- Um produto pode ser oferecido uma vez **por ocasião**.
drop index if exists reservations_product_slug_key;

create unique index if not exists reservations_product_occasion_key
  on reservations (product_slug, occasion);

-- As funções passam a trabalhar sempre dentro de uma ocasião.
drop function if exists public.list_reservations(text);
drop function if exists public.reserve_product(text, text, text);
drop function if exists public.release_product(text, text);

create or replace function public.list_reservations(
  p_occasion text,
  p_token text default null
)
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
  from reservations r
  where r.occasion = btrim(p_occasion);
$$;

create or replace function public.reserve_product(
  p_slug text,
  p_name text,
  p_token text,
  p_occasion text
)
returns boolean
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  v_name text := nullif(btrim(p_name), '');
  v_occasion text := nullif(btrim(p_occasion), '');
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

  if v_occasion is null or char_length(v_occasion) > 60 then
    raise exception 'Ocasião inválida' using errcode = '22023';
  end if;

  insert into reservations (product_slug, reserver_name, token_hash, occasion)
  values (
    btrim(p_slug),
    v_name,
    encode(extensions.digest(p_token, 'sha256'), 'hex'),
    v_occasion
  )
  on conflict (product_slug, occasion) do nothing;

  return found;
end;
$$;

create or replace function public.release_product(
  p_slug text,
  p_token text,
  p_occasion text
)
returns boolean
language plpgsql
security definer
set search_path = public, extensions
as $$
begin
  if p_token is null or p_slug is null or p_occasion is null then
    return false;
  end if;

  delete from reservations
  where product_slug = btrim(p_slug)
    and occasion = btrim(p_occasion)
    and token_hash = encode(extensions.digest(p_token, 'sha256'), 'hex');

  return found;
end;
$$;

revoke all on function public.list_reservations(text, text) from public;
revoke all on function public.reserve_product(text, text, text, text) from public;
revoke all on function public.release_product(text, text, text) from public;

grant execute on function public.list_reservations(text, text) to anon, authenticated;
grant execute on function public.reserve_product(text, text, text, text) to anon, authenticated;
grant execute on function public.release_product(text, text, text) to anon, authenticated;
