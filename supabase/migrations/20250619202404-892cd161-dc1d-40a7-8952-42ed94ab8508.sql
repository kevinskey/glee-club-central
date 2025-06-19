
-- Create pdf_library table first
CREATE TABLE IF NOT EXISTS public.pdf_library (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  file_path TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size BIGINT,
  voice_part TEXT,
  category TEXT DEFAULT 'general',
  tags TEXT[] DEFAULT '{}',
  is_public BOOLEAN DEFAULT true,
  uploaded_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on pdf_library
ALTER TABLE public.pdf_library ENABLE ROW LEVEL SECURITY;

-- Create policies for pdf_library - everyone can view public PDFs
CREATE POLICY "Anyone can view public PDFs" 
  ON public.pdf_library 
  FOR SELECT 
  USING (is_public = true);

-- Only authenticated users can upload PDFs
CREATE POLICY "Authenticated users can upload PDFs" 
  ON public.pdf_library 
  FOR INSERT 
  TO authenticated
  WITH CHECK (auth.uid() = uploaded_by);

-- Only admins can update/delete PDFs
CREATE POLICY "Admins can manage all PDFs" 
  ON public.pdf_library 
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND (is_super_admin = true OR role = 'admin')
    )
  );

-- Create updated_at trigger for pdf_library
CREATE OR REPLACE FUNCTION update_pdf_library_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_pdf_library_updated_at_trigger
  BEFORE UPDATE ON public.pdf_library
  FOR EACH ROW
  EXECUTE FUNCTION update_pdf_library_updated_at();
