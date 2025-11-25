-- PROFILES TABLE
create table public.profiles (
  id uuid references auth.users not null primary key,
  email text,
  full_name text,
  role text check (role in ('user', 'provider')),
  avatar_url text,
  bio text,
  phone text,
  location text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone."
  on profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on profiles for update
  using ( auth.uid() = id );

-- SERVICES TABLE (For Providers)
create table public.services (
  id uuid default uuid_generate_v4() primary key,
  provider_id uuid references public.profiles(id) not null,
  title text not null,
  description text,
  category text not null,
  price numeric not null,
  image_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.services enable row level security;

create policy "Services are viewable by everyone."
  on services for select
  using ( true );

create policy "Providers can insert their own services."
  on services for insert
  with check ( auth.uid() = provider_id );

create policy "Providers can update their own services."
  on services for update
  using ( auth.uid() = provider_id );

-- BOOKINGS TABLE
create table public.bookings (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) not null,
  provider_id uuid references public.profiles(id) not null,
  service_id uuid references public.services(id) not null,
  status text check (status in ('pending', 'accepted', 'completed', 'cancelled')) default 'pending',
  booking_date date not null,
  booking_time time not null,
  total_price numeric not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.bookings enable row level security;

create policy "Users can view their own bookings."
  on bookings for select
  using ( auth.uid() = user_id or auth.uid() = provider_id );

create policy "Users can create bookings."
  on bookings for insert
  with check ( auth.uid() = user_id );

create policy "Providers can update booking status."
  on bookings for update
  using ( auth.uid() = provider_id );

-- REVIEWS TABLE
create table public.reviews (
  id uuid default uuid_generate_v4() primary key,
  booking_id uuid references public.bookings(id) not null,
  reviewer_id uuid references public.profiles(id) not null,
  provider_id uuid references public.profiles(id) not null,
  rating integer check (rating >= 1 and rating <= 5),
  comment text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.reviews enable row level security;

create policy "Reviews are viewable by everyone."
  on reviews for select
  using ( true );

create policy "Users can create reviews for their bookings."
  on reviews for insert
  with check ( auth.uid() = reviewer_id );

-- TRIGGER TO CREATE PROFILE ON SIGNUP
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (new.id, new.email, new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'role');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- MESSAGES TABLE (Chat System)
create table public.messages (
  id uuid default uuid_generate_v4() primary key,
  booking_id uuid references public.bookings(id) not null,
  sender_id uuid references public.profiles(id) not null,
  receiver_id uuid references public.profiles(id) not null,
  message text not null,
  message_type text check (message_type in ('text', 'image', 'file')) default 'text',
  attachment_url text,
  is_read boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.messages enable row level security;

create policy "Users can view messages they are part of."
  on messages for select
  using ( auth.uid() = sender_id OR auth.uid() = receiver_id );

create policy "Users can send messages."
  on messages for insert
  with check ( auth.uid() = sender_id );

create policy "Users can mark messages as read."
  on messages for update
  using ( auth.uid() = receiver_id );

-- NOTIFICATIONS TABLE (Push Notifications)
create table public.notifications (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) not null,
  title text not null,
  body text not null,
  type text not null,
  data jsonb,
  is_read boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.notifications enable row level security;

create policy "Users can view their own notifications."
  on notifications for select
  using ( auth.uid() = user_id );

create policy "Users can update their own notifications."
  on notifications for update
  using ( auth.uid() = user_id );
