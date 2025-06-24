-- Create answer_logs table
CREATE TABLE IF NOT EXISTS public.answer_logs (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  question_id INTEGER NOT NULL,
  chosen_index SMALLINT NOT NULL CHECK (chosen_index >= 0 AND chosen_index <= 4),
  is_correct BOOLEAN NOT NULL,
  answered_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_answer_logs_user_id ON public.answer_logs(user_id);
CREATE INDEX idx_answer_logs_question_id ON public.answer_logs(question_id);
CREATE INDEX idx_answer_logs_answered_at ON public.answer_logs(answered_at);

-- Enable Row Level Security
ALTER TABLE public.answer_logs ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to view only their own answer logs
CREATE POLICY "Users can view own answer logs" ON public.answer_logs
  FOR SELECT USING (auth.uid() = user_id);

-- Create policy to allow users to insert their own answer logs
CREATE POLICY "Users can insert own answer logs" ON public.answer_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT, INSERT ON public.answer_logs TO authenticated;
GRANT USAGE ON SEQUENCE public.answer_logs_id_seq TO authenticated;