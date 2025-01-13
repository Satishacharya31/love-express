/*
  # Create proposal and messaging tables

  1. New Tables
    - `proposal_responses`: Stores user responses to the proposal
    - `messages`: Stores chat messages between users
  
  2. Security
    - Row Level Security enabled on both tables
    - Policies for authenticated users to manage their data
*/

-- Create tables with appropriate constraints
DO $$ 
BEGIN
  -- Create proposal_responses table
  CREATE TABLE IF NOT EXISTS proposal_responses (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    response text NOT NULL,
    created_at timestamptz DEFAULT now(),
    CONSTRAINT fk_user
      FOREIGN KEY(user_id) 
      REFERENCES auth.users(id)
  );

  -- Create messages table
  CREATE TABLE IF NOT EXISTS messages (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    content text NOT NULL,
    created_at timestamptz DEFAULT now(),
    CONSTRAINT fk_user
      FOREIGN KEY(user_id) 
      REFERENCES auth.users(id)
  );

  -- Enable Row Level Security
  ALTER TABLE proposal_responses ENABLE ROW LEVEL SECURITY;
  ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

  -- Create policies for proposal_responses
  CREATE POLICY "Users can insert their own response"
    ON proposal_responses
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

  CREATE POLICY "Users can view all responses"
    ON proposal_responses
    FOR SELECT
    TO authenticated
    USING (true);

  -- Create policies for messages
  CREATE POLICY "Users can insert their own messages"
    ON messages
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

  CREATE POLICY "Users can view all messages"
    ON messages
    FOR SELECT
    TO authenticated
    USING (true);

END $$;