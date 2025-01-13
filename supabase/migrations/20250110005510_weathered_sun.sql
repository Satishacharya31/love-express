/*
  # Add template data to proposals

  1. Changes
    - Add template_data column to proposals table to store proposal template information
    
  2. Security
    - No changes to existing RLS policies needed
*/

ALTER TABLE proposals 
ADD COLUMN IF NOT EXISTS template_id text,
ADD COLUMN IF NOT EXISTS template_data jsonb;