
-- Create playlists table for organizing tracks
CREATE TABLE public.playlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT false,
  is_homepage_default BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create playlist_tracks junction table
CREATE TABLE public.playlist_tracks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  playlist_id UUID REFERENCES public.playlists(id) ON DELETE CASCADE,
  audio_file_id UUID REFERENCES public.audio_files(id) ON DELETE CASCADE,
  track_order INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(playlist_id, audio_file_id)
);

-- Create music player settings table
CREATE TABLE public.music_player_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key TEXT UNIQUE NOT NULL,
  setting_value JSONB NOT NULL DEFAULT '{}',
  description TEXT,
  updated_by UUID REFERENCES auth.users(id),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create music analytics table
CREATE TABLE public.music_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  audio_file_id UUID REFERENCES public.audio_files(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL, -- 'play', 'pause', 'skip', 'complete'
  session_id UUID,
  listen_duration INTEGER DEFAULT 0, -- seconds listened
  user_agent TEXT,
  ip_address INET,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create scheduled playlists table
CREATE TABLE public.scheduled_playlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  playlist_id UUID REFERENCES public.playlists(id) ON DELETE CASCADE,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  repeat_schedule JSONB, -- for recurring schedules
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add RLS policies
ALTER TABLE public.playlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.playlist_tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.music_player_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.music_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scheduled_playlists ENABLE ROW LEVEL SECURITY;

-- Playlists policies
CREATE POLICY "Anyone can view active playlists" ON public.playlists
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage playlists" ON public.playlists
  FOR ALL USING (is_current_user_admin());

-- Playlist tracks policies
CREATE POLICY "Anyone can view playlist tracks" ON public.playlist_tracks
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.playlists p WHERE p.id = playlist_id AND p.is_active = true)
  );

CREATE POLICY "Admins can manage playlist tracks" ON public.playlist_tracks
  FOR ALL USING (is_current_user_admin());

-- Music player settings policies
CREATE POLICY "Anyone can view player settings" ON public.music_player_settings
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins can manage player settings" ON public.music_player_settings
  FOR ALL USING (is_current_user_admin());

-- Music analytics policies
CREATE POLICY "Users can insert their own analytics" ON public.music_analytics
  FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Admins can view all analytics" ON public.music_analytics
  FOR SELECT USING (is_current_user_admin());

-- Scheduled playlists policies
CREATE POLICY "Anyone can view active scheduled playlists" ON public.scheduled_playlists
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage scheduled playlists" ON public.scheduled_playlists
  FOR ALL USING (is_current_user_admin());

-- Insert default player settings
INSERT INTO public.music_player_settings (setting_key, setting_value, description) VALUES
  ('default_volume', '0.7', 'Default volume level (0.0 to 1.0)'),
  ('autoplay', 'false', 'Whether to autoplay tracks'),
  ('shuffle_mode', 'false', 'Whether shuffle is enabled by default'),
  ('repeat_mode', '"none"', 'Default repeat mode: none, track, playlist'),
  ('show_visualizer', 'true', 'Whether to show audio visualizer'),
  ('analytics_enabled', 'true', 'Whether to collect listening analytics');

-- Create function to get current active playlist
CREATE OR REPLACE FUNCTION public.get_current_active_playlist()
RETURNS TABLE (
  playlist_id UUID,
  playlist_name TEXT,
  tracks JSONB
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check for scheduled playlist first
  IF EXISTS (
    SELECT 1 FROM public.scheduled_playlists sp
    JOIN public.playlists p ON sp.playlist_id = p.id
    WHERE sp.is_active = true 
    AND NOW() BETWEEN sp.start_time AND COALESCE(sp.end_time, NOW() + INTERVAL '1 year')
    ORDER BY sp.start_time DESC
    LIMIT 1
  ) THEN
    RETURN QUERY
    SELECT 
      p.id,
      p.name,
      jsonb_agg(
        jsonb_build_object(
          'id', af.id,
          'title', af.title,
          'artist', COALESCE(af.description, 'Spelman Glee Club'),
          'audioUrl', af.file_url,
          'albumArt', '/lovable-uploads/bf415f6e-790e-4f30-9259-940f17e208d0.png',
          'duration', '3:45',
          'order', pt.track_order,
          'featured', pt.is_featured
        ) ORDER BY pt.track_order
      ) as tracks
    FROM public.scheduled_playlists sp
    JOIN public.playlists p ON sp.playlist_id = p.id
    JOIN public.playlist_tracks pt ON p.id = pt.playlist_id
    JOIN public.audio_files af ON pt.audio_file_id = af.id
    WHERE sp.is_active = true 
    AND NOW() BETWEEN sp.start_time AND COALESCE(sp.end_time, NOW() + INTERVAL '1 year')
    GROUP BY p.id, p.name
    ORDER BY sp.start_time DESC
    LIMIT 1;
  ELSE
    -- Fall back to default homepage playlist
    RETURN QUERY
    SELECT 
      p.id,
      p.name,
      jsonb_agg(
        jsonb_build_object(
          'id', af.id,
          'title', af.title,
          'artist', COALESCE(af.description, 'Spelman Glee Club'),
          'audioUrl', af.file_url,
          'albumArt', '/lovable-uploads/bf415f6e-790e-4f30-9259-940f17e208d0.png',
          'duration', '3:45',
          'order', pt.track_order,
          'featured', pt.is_featured
        ) ORDER BY pt.track_order
      ) as tracks
    FROM public.playlists p
    JOIN public.playlist_tracks pt ON p.id = pt.playlist_id
    JOIN public.audio_files af ON pt.audio_file_id = af.id
    WHERE p.is_homepage_default = true AND p.is_active = true
    GROUP BY p.id, p.name
    LIMIT 1;
  END IF;
END;
$$;

-- Create triggers for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_playlists_updated_at BEFORE UPDATE ON public.playlists
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_music_player_settings_updated_at BEFORE UPDATE ON public.music_player_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for music tables
ALTER TABLE public.playlists REPLICA IDENTITY FULL;
ALTER TABLE public.playlist_tracks REPLICA IDENTITY FULL;
ALTER TABLE public.music_player_settings REPLICA IDENTITY FULL;

-- Add tables to realtime publication
ALTER publication supabase_realtime ADD TABLE public.playlists;
ALTER publication supabase_realtime ADD TABLE public.playlist_tracks;
ALTER publication supabase_realtime ADD TABLE public.music_player_settings;
