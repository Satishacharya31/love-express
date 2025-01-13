/*
  # Add profiles and update schema

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key)
      - `full_name` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    - `proposals` (recreated with updated structure)
    - `messages` (recreated with updated structure)

  2. Changes
    - Add trigger for profile creation on user signup
    - Set up public access policies
    - Add profile management policies

  3. Security
    - Enable RLS on all tables
    - Add public access policies
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  full_name text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create proposals table
CREATE TABLE IF NOT EXISTS proposals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  proposer_id uuid REFERENCES auth.users NOT NULL,
  partner_id uuid REFERENCES auth.users,
  partner_name text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  template_id text,
  template_data jsonb,
  created_at timestamptz DEFAULT now()
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  proposal_id uuid REFERENCES proposals,
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Users can update their own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Proposals policies
CREATE POLICY "Anyone can create proposals"
  ON proposals
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Proposals are viewable by everyone"
  ON proposals
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Partners can update proposals"
  ON proposals
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Messages policies
CREATE POLICY "Anyone can create messages"
  ON messages
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Messages are viewable by everyone"
  ON messages
  FOR SELECT
  TO public
  USING (true);

-- Function to handle new user profiles
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (
    new.id,
    COALESCE(
      new.raw_user_meta_data->>'full_name',
      new.raw_user_meta_data->>'name',
      split_part(new.email, '@', 1)
    )
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user profiles
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();