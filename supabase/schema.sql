-- BASIQ Database Schema
-- Run this in your Supabase SQL editor to set up the database

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profile table
CREATE TABLE IF NOT EXISTS profile (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  age INT,
  height_cm INT,
  weight_kg NUMERIC(5,2),
  goal TEXT CHECK (goal IN ('Bajar grasa', 'Recomposición corporal', 'Ganar fuerza', 'Bienestar')),
  activity_level TEXT CHECK (activity_level IN ('Sedentario', 'Entreno ocasional', 'Entreno regular')),
  training_days_per_week INT CHECK (training_days_per_week >= 1 AND training_days_per_week <= 7),
  session_duration_min INT,
  training_location TEXT CHECK (training_location IN ('Gym', 'Casa', 'Mixto')),
  injuries_notes TEXT,
  nutrition_mode TEXT CHECK (nutrition_mode IN ('Guía simple', 'Porciones', 'Calorías/macros')),
  protein_target_g INT,
  first_meal_time TEXT, -- HH:MM format
  last_meal_time TEXT, -- HH:MM format
  fasting_12h BOOLEAN DEFAULT FALSE,
  coach_tone TEXT CHECK (coach_tone IN ('directo', 'estricto')) DEFAULT 'directo',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Daily check-ins table
CREATE TABLE IF NOT EXISTS daily_checkins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  -- Sleep
  sleep_hours NUMERIC(3,1),
  sleep_quality INT CHECK (sleep_quality >= 1 AND sleep_quality <= 10),
  -- State
  energy INT CHECK (energy >= 1 AND energy <= 10),
  stress INT CHECK (stress >= 1 AND stress <= 10),
  mood INT CHECK (mood >= 1 AND mood <= 10),
  -- Pain
  pain_level INT CHECK (pain_level >= 0 AND pain_level <= 10),
  pain_area TEXT,
  -- Weight
  weight_kg NUMERIC(5,2),
  -- Training
  trained BOOLEAN DEFAULT FALSE,
  training_type TEXT CHECK (training_type IN ('Fuerza', 'Cardio', 'Mixto', 'Movilidad')),
  training_minutes INT,
  rpe INT CHECK (rpe >= 1 AND rpe <= 10), -- Rate of Perceived Exertion
  -- Nutrition
  protein_hit BOOLEAN DEFAULT FALSE,
  veggies_hit BOOLEAN DEFAULT FALSE,
  water_hit BOOLEAN DEFAULT FALSE,
  -- Notes
  note TEXT,
  tomorrow_plan TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- Coach messages table
CREATE TABLE IF NOT EXISTS coach_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_daily_checkins_user_date ON daily_checkins(user_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_coach_messages_user_created ON coach_messages(user_id, created_at DESC);

-- Enable Row Level Security
ALTER TABLE profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE coach_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profile table
CREATE POLICY "Users can view own profile"
  ON profile FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
  ON profile FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON profile FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for daily_checkins table
CREATE POLICY "Users can view own check-ins"
  ON daily_checkins FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own check-ins"
  ON daily_checkins FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own check-ins"
  ON daily_checkins FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own check-ins"
  ON daily_checkins FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for coach_messages table
CREATE POLICY "Users can view own messages"
  ON coach_messages FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own messages"
  ON coach_messages FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own messages"
  ON coach_messages FOR DELETE
  USING (auth.uid() = user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for profile updated_at
CREATE TRIGGER update_profile_updated_at
  BEFORE UPDATE ON profile
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
