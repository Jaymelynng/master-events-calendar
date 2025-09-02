
-- 1) link_types: catalog of available link types (text IDs match your UI, e.g. 'website')
create table if not exists public.link_types (
  id text primary key,
  label text not null,
  display_label text not null,
  emoji text not null default '',
  category text not null default 'Other',
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Keep updated_at fresh
drop trigger if exists set_updated_at_on_link_types on public.link_types;
create trigger set_updated_at_on_link_types
before update on public.link_types
for each row execute function public.update_updated_at_column();

-- RLS
alter table public.link_types enable row level security;

drop policy if exists "Anyone can view active link types" on public.link_types;
create policy "Anyone can view active link types"
on public.link_types
for select
to public
using (is_active = true);

drop policy if exists "Authenticated users can manage link types" on public.link_types;
create policy "Authenticated users can manage link types"
on public.link_types
for all
to authenticated
using (true)
with check (true);

-- Seed common link types (id stays stable, labels/emojis adjustable later)
insert into public.link_types (id, label, display_label, emoji, category, sort_order) values
('website','Website','🌐 Website','🌐','Main',1),
('facebook','Facebook','📘 Facebook','📘','Social Media',2),
('instagram','Instagram','📷 Instagram','📷','Social Media',3),
('classes','Class Schedule','📅 Classes','📅','Programs',10),
('registration','Registration','📝 Registration','📝','Programs',11),
('events','Events','🎪 Events','🎪','Programs',12),
('parent_portal','Parent Portal','👨‍👩‍👧 Portal','👨‍👩‍👧','Customer',20),
('messenger','Messenger','💬 Messenger','💬','Customer',21),
('booking','Booking','🗓️ Booking','🗓️','Customer',22),
('open_gym','Open Gym','🤸 Open Gym','🤸','Programs',23),
('skill_clinics','Skill Clinics','🏅 Skill Clinics','🏅','Programs',24),
('kids_night_out','Kids Night Out','🌙 KNO','🌙','Programs',25),
('party_booking','Party Booking','🎉 Parties','🎉','Programs',26),
('meta_business','Meta Business','📊 Meta Business','📊','Business',30),
('map','Map','🗺️ Map','🗺️','Info',40),
('canva_promos','Promo Codes','🎨 Promos','🎨','Marketing',50)
on conflict (id) do nothing;

-- 2) gym_links: one row per gym per link type
create table if not exists public.gym_links (
  id uuid primary key default gen_random_uuid(),
  gym_id uuid not null references public.gyms(id) on delete cascade,
  link_type_id text not null references public.link_types(id) on delete restrict,
  url text not null,
  notes text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  added_by_user_id uuid
);

create unique index if not exists gym_links_unique_per_type on public.gym_links (gym_id, link_type_id);

drop trigger if exists set_updated_at_on_gym_links on public.gym_links;
create trigger set_updated_at_on_gym_links
before update on public.gym_links
for each row execute function public.update_updated_at_column();

-- RLS
alter table public.gym_links enable row level security;

drop policy if exists "Anyone can view active gym links" on public.gym_links;
create policy "Anyone can view active gym links"
on public.gym_links
for select
to public
using (is_active = true);

drop policy if exists "Authenticated users can manage gym links" on public.gym_links;
create policy "Authenticated users can manage gym links"
on public.gym_links
for all
to authenticated
using (true)
with check (true);

-- 3) Migrate any existing URLs from gyms into gym_links (skip blanks)
insert into public.gym_links (gym_id, link_type_id, url)
select id, 'website', website
from public.gyms
where coalesce(nullif(website,''),'') <> ''
on conflict (gym_id, link_type_id) do nothing;

insert into public.gym_links (gym_id, link_type_id, url)
select id, 'classes', classes_url
from public.gyms
where coalesce(nullif(classes_url,''),'') <> ''
on conflict (gym_id, link_type_id) do nothing;

insert into public.gym_links (gym_id, link_type_id, url)
select id, 'parent_portal', parent_portal_url
from public.gyms
where coalesce(nullif(parent_portal_url,''),'') <> ''
on conflict (gym_id, link_type_id) do nothing;

insert into public.gym_links (gym_id, link_type_id, url)
select id, 'messenger', messenger_link
from public.gyms
where coalesce(nullif(messenger_link,''),'') <> ''
on conflict (gym_id, link_type_id) do nothing;

insert into public.gym_links (gym_id, link_type_id, url)
select id, 'booking', booking_url
from public.gyms
where coalesce(nullif(booking_url,''),'') <> ''
on conflict (gym_id, link_type_id) do nothing;

insert into public.gym_links (gym_id, link_type_id, url)
select id, 'open_gym', open_gym_url
from public.gyms
where coalesce(nullif(open_gym_url,''),'') <> ''
on conflict (gym_id, link_type_id) do nothing;

insert into public.gym_links (gym_id, link_type_id, url)
select id, 'skill_clinics', skill_clinics_url
from public.gyms
where coalesce(nullif(skill_clinics_url,''),'') <> ''
on conflict (gym_id, link_type_id) do nothing;

insert into public.gym_links (gym_id, link_type_id, url)
select id, 'kids_night_out', kids_night_out_url
from public.gyms
where coalesce(nullif(kids_night_out_url,''),'') <> ''
on conflict (gym_id, link_type_id) do nothing;

insert into public.gym_links (gym_id, link_type_id, url)
select id, 'party_booking', party_booking_url
from public.gyms
where coalesce(nullif(party_booking_url,''),'') <> ''
on conflict (gym_id, link_type_id) do nothing;

insert into public.gym_links (gym_id, link_type_id, url)
select id, 'meta_business', meta_business_url
from public.gyms
where coalesce(nullif(meta_business_url,''),'') <> ''
on conflict (gym_id, link_type_id) do nothing;

insert into public.gym_links (gym_id, link_type_id, url)
select id, 'map', map_url
from public.gyms
where coalesce(nullif(map_url,''),'') <> ''
on conflict (gym_id, link_type_id) do nothing;

-- Optional: extract social media links from jsonb column
insert into public.gym_links (gym_id, link_type_id, url)
select id, 'facebook', social_media->>'facebook'
from public.gyms
where social_media ? 'facebook' and coalesce(nullif(social_media->>'facebook',''),'') <> ''
on conflict (gym_id, link_type_id) do nothing;

insert into public.gym_links (gym_id, link_type_id, url)
select id, 'instagram', social_media->>'instagram'
from public.gyms
where social_media ? 'instagram' and coalesce(nullif(social_media->>'instagram',''),'') <> ''
on conflict (gym_id, link_type_id) do nothing;

-- 4) Enable realtime for gym_links (so new links show up instantly)
alter table public.gym_links replica identity full;

do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'gym_links'
  ) then
    alter publication supabase_realtime add table public.gym_links;
  end if;
end $$;
