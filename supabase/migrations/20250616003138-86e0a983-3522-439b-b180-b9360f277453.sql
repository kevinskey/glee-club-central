
-- Create the youtube_videos table
CREATE TABLE public.youtube_videos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  youtube_url TEXT NOT NULL,
  thumbnail_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 1,
  content_type TEXT NOT NULL DEFAULT 'video' CHECK (content_type IN ('video', 'playlist')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.youtube_videos ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for admins only
CREATE POLICY "Admins can view all youtube videos" 
  ON public.youtube_videos 
  FOR SELECT 
  USING (public.current_user_is_super_admin());

CREATE POLICY "Admins can insert youtube videos" 
  ON public.youtube_videos 
  FOR INSERT 
  WITH CHECK (public.current_user_is_super_admin());

CREATE POLICY "Admins can update youtube videos" 
  ON public.youtube_videos 
  FOR UPDATE 
  USING (public.current_user_is_super_admin());

CREATE POLICY "Admins can delete youtube videos" 
  ON public.youtube_videos 
  FOR DELETE 
  USING (public.current_user_is_super_admin());

-- Create trigger for updating updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_youtube_videos_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_youtube_videos_updated_at
  BEFORE UPDATE ON public.youtube_videos
  FOR EACH ROW
  EXECUTE FUNCTION public.update_youtube_videos_updated_at();
