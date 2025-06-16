
-- Allow public viewing of active YouTube videos
DROP POLICY IF EXISTS "Admins can view all youtube videos" ON public.youtube_videos;

CREATE POLICY "Anyone can view active youtube videos" 
  ON public.youtube_videos 
  FOR SELECT 
  USING (is_active = true);

CREATE POLICY "Admins can view all youtube videos" 
  ON public.youtube_videos 
  FOR SELECT 
  USING (public.current_user_is_super_admin());
