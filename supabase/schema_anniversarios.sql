-- ============================================================
-- Schema: Planilhas + Aniversários
-- Rode este arquivo inteiro no SQL Editor do Supabase, uma vez,
-- ANTES de rodar seed_anniversarios.sql.
-- ============================================================

-- ============ municipalities ============
create table if not exists municipalities (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) default auth.uid(),
  nome text not null,
  data_aniversario text,          -- 'DD/MM', nullable
  instagram text,
  nota text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table municipalities enable row level security;

create policy "municipalities_select" on municipalities for select using (user_id = auth.uid());
create policy "municipalities_insert" on municipalities for insert with check (user_id = auth.uid());
create policy "municipalities_update" on municipalities for update using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "municipalities_delete" on municipalities for delete using (user_id = auth.uid());

create unique index if not exists municipalities_user_nome_uidx on municipalities (user_id, nome);

-- ============ anniversary_people ============
create table if not exists anniversary_people (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) default auth.uid(),
  nome text not null,
  cargo text,
  categoria text not null check (categoria in ('igreja', 'lideranca')),
  tags text[] not null default '{}',
  tipo_aniversario text check (tipo_aniversario in ('Nascimento', 'Ordenação Presbiteral', 'Ordenação Episcopal') or tipo_aniversario is null),
  data_aniversario text,           -- 'DD/MM', nullable (lideranças sem data conhecida)
  municipio_id uuid references municipalities(id) on delete set null,
  instagram text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table anniversary_people enable row level security;

create policy "anniversary_people_select" on anniversary_people for select using (user_id = auth.uid());
create policy "anniversary_people_insert" on anniversary_people for insert with check (user_id = auth.uid());
create policy "anniversary_people_update" on anniversary_people for update using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "anniversary_people_delete" on anniversary_people for delete using (user_id = auth.uid());

create index if not exists anniversary_people_municipio_idx on anniversary_people (municipio_id);
create index if not exists anniversary_people_data_idx on anniversary_people (data_aniversario);
create index if not exists anniversary_people_categoria_idx on anniversary_people (categoria);

-- ============ anniversary_materials ============
create table if not exists anniversary_materials (
  id uuid primary key default gen_random_uuid(),
  pessoa_id uuid not null references anniversary_people(id) on delete cascade,
  tipo text not null check (tipo in ('foto', 'video')),
  storage_path text not null,
  texto text,
  enviado boolean not null default false,
  created_at timestamptz default now()
);

alter table anniversary_materials enable row level security;

create policy "anniversary_materials_select" on anniversary_materials for select
  using (pessoa_id in (select id from anniversary_people where user_id = auth.uid()));
create policy "anniversary_materials_insert" on anniversary_materials for insert
  with check (pessoa_id in (select id from anniversary_people where user_id = auth.uid()));
create policy "anniversary_materials_update" on anniversary_materials for update
  using (pessoa_id in (select id from anniversary_people where user_id = auth.uid()))
  with check (pessoa_id in (select id from anniversary_people where user_id = auth.uid()));
create policy "anniversary_materials_delete" on anniversary_materials for delete
  using (pessoa_id in (select id from anniversary_people where user_id = auth.uid()));

create index if not exists anniversary_materials_pessoa_idx on anniversary_materials (pessoa_id);

-- ============ storage bucket ============
insert into storage.buckets (id, name, public)
values ('anniversary-materials', 'anniversary-materials', true)
on conflict (id) do nothing;

-- bucket "público" só controla leitura via URL; insert/update/delete
-- ainda exigem policy explícita em storage.objects
create policy "anniversary_materials_storage_insert" on storage.objects for insert
  with check (bucket_id = 'anniversary-materials' and auth.role() = 'authenticated');
create policy "anniversary_materials_storage_select" on storage.objects for select
  using (bucket_id = 'anniversary-materials');
create policy "anniversary_materials_storage_update" on storage.objects for update
  using (bucket_id = 'anniversary-materials' and auth.role() = 'authenticated');
create policy "anniversary_materials_storage_delete" on storage.objects for delete
  using (bucket_id = 'anniversary-materials' and auth.role() = 'authenticated');
