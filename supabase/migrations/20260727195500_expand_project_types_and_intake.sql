alter table public.projects
  drop constraint if exists projects_mode_check;

alter table public.projects
  add constraint projects_mode_check
  check (mode in ('buyer', 'seller', 'valuation'));

alter table public.projects
  add column if not exists property_type text,
  add column if not exists target_date date;

alter table public.projects
  drop constraint if exists projects_status_check;

alter table public.projects
  add constraint projects_status_check
  check (status in ('draft', 'active', 'paused', 'completed', 'archived'));

grant select, insert, update, delete on table public.projects to authenticated;
grant select, insert, update, delete on table public.project_steps to authenticated;

