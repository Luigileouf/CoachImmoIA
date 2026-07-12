create table if not exists public.coach_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete set null,
  contact_email text not null,
  message text not null,
  screen text not null,
  mode text not null check (mode in ('buyer', 'seller')),
  urgency text not null check (urgency in ('advice', 'soon', 'urgent')),
  status text not null default 'pending' check (status in ('pending', 'in_progress', 'resolved')),
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists coach_requests_status_created_at_idx
on public.coach_requests (status, created_at desc);

create index if not exists coach_requests_user_id_idx
on public.coach_requests (user_id);

alter table public.coach_requests enable row level security;

create policy "anyone can request a coach"
on public.coach_requests
for insert
to anon, authenticated
with check (
  status = 'pending'
  and char_length(contact_email) between 5 and 320
  and contact_email like '%@%'
  and char_length(message) between 10 and 2000
  and (
    (auth.uid() is null and user_id is null)
    or auth.uid() = user_id
  )
);

create policy "users can read own coach requests"
on public.coach_requests
for select
to authenticated
using (auth.uid() = user_id);

grant insert on public.coach_requests to anon, authenticated;
grant select on public.coach_requests to authenticated;
