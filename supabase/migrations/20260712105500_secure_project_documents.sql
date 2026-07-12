create schema if not exists extensions;

do $$
begin
  if exists (
    select 1
    from pg_extension
    join pg_namespace on pg_namespace.oid = pg_extension.extnamespace
    where pg_extension.extname = 'vector'
      and pg_namespace.nspname = 'public'
  ) then
    alter extension vector set schema extensions;
  end if;
end
$$;

drop policy if exists "authenticated can upload project documents" on storage.objects;
drop policy if exists "authenticated can read project documents" on storage.objects;
drop policy if exists "authenticated can update project documents" on storage.objects;

create policy "users can upload own project documents"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'project-documents'
  and (storage.foldername(name))[1] = (select auth.uid())::text
);

create policy "users can read own project documents"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'project-documents'
  and (storage.foldername(name))[1] = (select auth.uid())::text
);

create policy "users can update own project documents"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'project-documents'
  and (storage.foldername(name))[1] = (select auth.uid())::text
)
with check (
  bucket_id = 'project-documents'
  and (storage.foldername(name))[1] = (select auth.uid())::text
);

create policy "users can delete own project documents"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'project-documents'
  and (storage.foldername(name))[1] = (select auth.uid())::text
);
