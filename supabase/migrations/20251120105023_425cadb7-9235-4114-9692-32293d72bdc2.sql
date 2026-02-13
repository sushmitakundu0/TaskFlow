-- Add tags column to tasks table
ALTER TABLE public.tasks ADD COLUMN tags TEXT[] DEFAULT '{}';

-- Add an index for better query performance on tags
CREATE INDEX idx_tasks_tags ON public.tasks USING GIN(tags);