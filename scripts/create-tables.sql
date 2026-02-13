-- Create tables for Knox Wedding app
-- Run this in Supabase Dashboard → SQL Editor

-- Create guest_passwords table
CREATE TABLE IF NOT EXISTS guest_passwords (
  id BIGSERIAL PRIMARY KEY,
  password TEXT NOT NULL UNIQUE,
  guest_name TEXT,
  guest_group TEXT NOT NULL CHECK (guest_group IN ('friends', 'family', 'admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create rsvp_submissions table
CREATE TABLE IF NOT EXISTS rsvp_submissions (
  id BIGSERIAL PRIMARY KEY,
  password TEXT NOT NULL UNIQUE REFERENCES guest_passwords(password),
  guest_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  attendance TEXT NOT NULL,
  guests INTEGER NOT NULL DEFAULT 1,
  message TEXT,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security (RLS)
ALTER TABLE guest_passwords ENABLE ROW LEVEL SECURITY;
ALTER TABLE rsvp_submissions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies to allow access via anon key
-- Allow reading guest passwords (for login verification)
CREATE POLICY "allow_select_guest_passwords" 
  ON guest_passwords 
  FOR SELECT 
  TO anon 
  USING (true);

-- Allow inserting/updating guest passwords (for seeding)
CREATE POLICY "allow_insert_guest_passwords" 
  ON guest_passwords 
  FOR INSERT 
  TO anon 
  WITH CHECK (true);

CREATE POLICY "allow_update_guest_passwords" 
  ON guest_passwords 
  FOR UPDATE 
  TO anon 
  USING (true)
  WITH CHECK (true);

-- Allow deleting guest passwords (for admin)
CREATE POLICY "allow_delete_guest_passwords"
  ON guest_passwords
  FOR DELETE
  TO anon
  USING (true);

-- Allow reading RSVP submissions (for status check)
CREATE POLICY "allow_select_rsvp" 
  ON rsvp_submissions 
  FOR SELECT 
  TO anon 
  USING (true);

-- Allow inserting RSVP submissions
CREATE POLICY "allow_insert_rsvp" 
  ON rsvp_submissions 
  FOR INSERT 
  TO anon 
  WITH CHECK (true);

-- Create index for faster password lookups
CREATE INDEX IF NOT EXISTS idx_guest_passwords_password ON guest_passwords(password);
CREATE INDEX IF NOT EXISTS idx_rsvp_submissions_password ON rsvp_submissions(password);
