create extension if not exists pgcrypto;

create table if not exists public.uploads (
  id uuid primary key default gen_random_uuid(),
  file_name text not null,
  uploaded_at timestamptz not null default now(),
  file_type text not null,
  file_size bigint not null,
  responsible text not null,
  status text not null check (status in ('cargado', 'pendiente', 'procesado', 'error')),
  observations text,
  storage_path text not null,
  preview_snippet text not null default '',
  faq_suggestions jsonb not null default '[]'::jsonb
);

create index if not exists uploads_uploaded_at_idx on public.uploads (uploaded_at desc);
create index if not exists uploads_status_idx on public.uploads (status);
create index if not exists uploads_responsible_idx on public.uploads (responsible);

insert into storage.buckets (id, name, public)
values ('everwood-conversations', 'everwood-conversations', false)
on conflict (id) do nothing;
