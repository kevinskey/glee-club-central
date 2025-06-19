
interface ReaderPDFFile {
  id: string;
  title: string;
  file_url: string;
  description?: string;
  category: string;
  voice_part?: string;
  created_at: string;
}

interface ReaderAudioFile {
  id: string;
  title: string;
  file_url: string;
  description?: string;
  category: string;
  created_at: string;
}

export class ReaderImporter {
  private baseUrl = 'https://reader.gleeworld.org';

  async fetchPDFs(): Promise<ReaderPDFFile[]> {
    try {
      console.log('🔍 Fetching PDFs from reader.gleeworld.org...');
      
      // Try to fetch from the reader API endpoints
      const response = await fetch(`${this.baseUrl}/api/pdfs`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch PDFs: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('📄 Found PDFs:', data.length);
      return data;
    } catch (error) {
      console.error('❌ Error fetching PDFs from reader:', error);
      throw error;
    }
  }

  async fetchAudioFiles(): Promise<ReaderAudioFile[]> {
    try {
      console.log('🔍 Fetching audio files from reader.gleeworld.org...');
      
      const response = await fetch(`${this.baseUrl}/api/audio`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch audio files: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('🎵 Found audio files:', data.length);
      return data;
    } catch (error) {
      console.error('❌ Error fetching audio files from reader:', error);
      throw error;
    }
  }

  async importPDFToSupabase(pdf: ReaderPDFFile) {
    const { supabase } = await import('@/integrations/supabase/client');
    
    try {
      // Import PDF metadata to pdf_library table
      const { data, error } = await supabase
        .from('pdf_library')
        .insert({
          title: pdf.title,
          description: pdf.description,
          file_url: pdf.file_url,
          file_path: pdf.file_url,
          category: pdf.category,
          voice_part: pdf.voice_part,
          imported_from: 'reader.gleeworld.org',
          created_at: pdf.created_at,
        })
        .select()
        .single();

      if (error) throw error;
      
      console.log('✅ Imported PDF:', pdf.title);
      return data;
    } catch (error) {
      console.error('❌ Error importing PDF:', pdf.title, error);
      throw error;
    }
  }

  async importAudioToSupabase(audio: ReaderAudioFile) {
    const { supabase } = await import('@/integrations/supabase/client');
    
    try {
      // Import audio to both audio_files and media_library tables
      const { data: audioData, error: audioError } = await supabase
        .from('audio_files')
        .insert({
          title: audio.title,
          description: audio.description,
          file_url: audio.file_url,
          category: audio.category,
          imported_from: 'reader.gleeworld.org',
          created_at: audio.created_at,
        })
        .select()
        .single();

      if (audioError) throw audioError;

      // Also add to media_library for unified access
      const { data: mediaData, error: mediaError } = await supabase
        .from('media_library')
        .insert({
          title: audio.title,
          description: audio.description,
          file_url: audio.file_url,
          file_path: audio.file_url,
          file_type: 'audio/mpeg',
          folder: audio.category,
          imported_from: 'reader.gleeworld.org',
          created_at: audio.created_at,
        })
        .select()
        .single();

      if (mediaError) throw mediaError;
      
      console.log('✅ Imported audio:', audio.title);
      return { audioData, mediaData };
    } catch (error) {
      console.error('❌ Error importing audio:', audio.title, error);
      throw error;
    }
  }

  async importAll() {
    try {
      console.log('🚀 Starting bulk import from reader.gleeworld.org...');
      
      // Fetch all data
      const [pdfs, audioFiles] = await Promise.all([
        this.fetchPDFs(),
        this.fetchAudioFiles(),
      ]);

      console.log(`📊 Import summary: ${pdfs.length} PDFs, ${audioFiles.length} audio files`);

      // Import PDFs
      const pdfResults = [];
      for (const pdf of pdfs) {
        try {
          const result = await this.importPDFToSupabase(pdf);
          pdfResults.push(result);
        } catch (error) {
          console.error(`Failed to import PDF: ${pdf.title}`, error);
        }
      }

      // Import Audio Files
      const audioResults = [];
      for (const audio of audioFiles) {
        try {
          const result = await this.importAudioToSupabase(audio);
          audioResults.push(result);
        } catch (error) {
          console.error(`Failed to import audio: ${audio.title}`, error);
        }
      }

      console.log('✅ Import completed!');
      console.log(`📄 Imported ${pdfResults.length}/${pdfs.length} PDFs`);
      console.log(`🎵 Imported ${audioResults.length}/${audioFiles.length} audio files`);

      return {
        pdfs: pdfResults,
        audio: audioResults,
        summary: {
          totalPDFs: pdfs.length,
          importedPDFs: pdfResults.length,
          totalAudio: audioFiles.length,
          importedAudio: audioResults.length,
        },
      };
    } catch (error) {
      console.error('❌ Bulk import failed:', error);
      throw error;
    }
  }
}

export const readerImporter = new ReaderImporter();
