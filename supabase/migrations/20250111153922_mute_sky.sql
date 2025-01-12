/*
  # Create job applications table

  1. New Tables
    - `job_applications`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `company` (text)
      - `position` (text)
      - `status` (text)
      - `date_applied` (timestamptz)
      - `notes` (text)
      - `resume_file_name` (text)
      - `interview_date` (timestamptz)
      - `offer_details` (text)
      - `offer_date` (timestamptz)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `job_applications` table
    - Add policies for authenticated users to:
      - Read their own job applications
      - Create new job applications
      - Update their own job applications
      - Delete their own job applications
*/

CREATE TABLE job_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  company text NOT NULL,
  position text NOT NULL,
  status text NOT NULL,
  date_applied timestamptz NOT NULL,
  notes text DEFAULT '',
  resume_file_name text,
  interview_date timestamptz,
  offer_details text,
  offer_date timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own job applications"
  ON job_applications
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create job applications"
  ON job_applications
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own job applications"
  ON job_applications
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own job applications"
  ON job_applications
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);