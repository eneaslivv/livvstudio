-- Create the table for Portfolio Items
create table if not exists portfolio_items (
    id uuid default gen_random_uuid() primary key,
    title text not null,
    subtitle text,
    category text,
    services text,
    year text,
    image text, -- URL to the image
    featured boolean default false,
    slug text unique,
    color text,
    description text,
    created_at timestamptz default now()
);

-- Enable RLS
alter table portfolio_items enable row level security;

-- Policies
-- Allow public to read everything
create policy "Public read" on portfolio_items for select using (true);
-- Allow authenticated (admin) users to do everything
create policy "Admin all" on portfolio_items for all using (true);
