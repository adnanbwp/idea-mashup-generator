-- Users table (managed by Supabase Auth)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ideas table
CREATE TABLE ideas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Generation elements (personas, problems, technologies, business models, etc.)
CREATE TABLE generation_elements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type VARCHAR(50) NOT NULL, -- 'persona', 'problem', 'technology', 'business_model', 'format', 'channel', 'action_verb', 'trend'
  content TEXT NOT NULL,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_ideas_user_id ON ideas(user_id);
CREATE INDEX idx_ideas_created_at ON ideas(created_at DESC);
CREATE INDEX idx_generation_elements_type ON generation_elements(type);
CREATE INDEX idx_generation_elements_active ON generation_elements(active);

-- Enable Row Level Security (RLS)
ALTER TABLE ideas ENABLE ROW LEVEL SECURITY;

-- RLS Policies for ideas table
CREATE POLICY "Users can view their own ideas" ON ideas
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own ideas" ON ideas
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own ideas" ON ideas
  FOR DELETE USING (auth.uid() = user_id);

-- Allow all users to read generation elements (public data)
CREATE POLICY "Anyone can view active generation elements" ON generation_elements
  FOR SELECT USING (active = true);