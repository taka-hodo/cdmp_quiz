-- Add language column to test_results table
ALTER TABLE public.test_results ADD COLUMN IF NOT EXISTS language VARCHAR(2) DEFAULT 'ja';

-- Create index for language column for better query performance
CREATE INDEX IF NOT EXISTS idx_test_results_language ON public.test_results(language);

-- Add check constraint to ensure language is either 'ja' or 'en'
ALTER TABLE public.test_results ADD CONSTRAINT check_language CHECK (language IN ('ja', 'en'));