/*
  # Create proposals table and update messages schema

  1. New Tables
    - `proposals`
      - `id` (uuid, primary key)
      - `proposer_id` (uuid, references auth.users)
      - `partner_id` (uuid, references auth.users, nullable)
      - `partner_name` (text)
      - `status` (text)
      - `created_at` (timestamp)

  2. Changes
    - Add `proposal_id` to messages table
    - Update messages RLS policies

  3. Security
    - Enable RLS on proposals table
    - Add policies for proposals table
*/

-- Create proposals table
CREATE TABLE IF NOT EXISTS proposals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  proposer_id uuid REFERENCES auth.users NOT NULL,
  partner_id uuid REFERENCES auth.users,
  partner_name text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

-- Add proposal_id to messages
ALTER TABLE messages ADD COLUMN IF NOT EXISTS proposal_id uuid REFERENCES proposals;

-- Enable RLS
ALTER TABLE proposals ENABLE ROW LEVEL SECURITY;

-- Policies for proposals
CREATE POLICY "Users can create their own proposals"
  ON proposals
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = proposer_id);

CREATE POLICY "Users can view proposals they created or are invited to"
  ON proposals
  FOR SELECT
  TO authenticated
  USING (auth.uid() = proposer_id OR auth.uid() = partner_id);

CREATE POLICY "Partners can update their own response"
  ON proposals
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = partner_id)
  WITH CHECK (auth.uid() = partner_id);

-- Update messages policies
DROP POLICY IF EXISTS "Users can insert their own messages" ON messages;
DROP POLICY IF EXISTS "Users can view all messages" ON messages;

CREATE POLICY "Users can insert messages for their proposals"
  ON messages
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() IN (
      SELECT proposer_id FROM proposals WHERE id = proposal_id
      UNION
      SELECT partner_id FROM proposals WHERE id = proposal_id
    )
  );

CREATE POLICY "Users can view messages for their proposals"
  ON messages
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() IN (
      SELECT proposer_id FROM proposals WHERE id = proposal_id
      UNION
      SELECT partner_id FROM proposals WHERE id = proposal_id
    )
  );