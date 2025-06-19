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
      
      const response = await fetch(`${this.baseUrl}/api/pdfs`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('📡 PDF API Response status:', response.status);
      console.log('📡 PDF API Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.log('📡 PDF API Error response body:', errorText);
        throw new Error(`Failed to fetch PDFs: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const responseText = await response.text();
      console.log('📡 PDF API Raw response:', responseText.substring(0, 500) + '...');

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('❌ Failed to parse PDF response as JSON:', parseError);
        console.log('📡 Full response text:', responseText);
        throw new Error(`Invalid JSON response from PDF API: ${parseError.message}`);
      }

      console.log('📄 Found PDFs:', Array.isArray(data) ? data.length : 'Not an array');
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('❌ Error fetching PDFs from reader:', error);
      
      // Try alternative endpoints
      console.log('🔄 Trying alternative endpoints...');
      
      try {
        const altResponse = await fetch(`${this.baseUrl}/pdfs`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        console.log('📡 Alternative PDF endpoint status:', altResponse.status);
        
        if (altResponse.ok) {
          const altResponseText = await altResponse.text();
          console.log('📡 Alternative PDF response:', altResponseText.substring(0, 200) + '...');
          
          try {
            const altData = JSON.parse(altResponseText);
            return Array.isArray(altData) ? altData : [];
          } catch (altParseError) {
            console.error('❌ Alternative endpoint also returned invalid JSON');
          }
        }
      } catch (altError) {
        console.error('❌ Alternative endpoint also failed:', altError);
      }
      
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

      console.log('📡 Audio API Response status:', response.status);
      console.log('📡 Audio API Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.log('📡 Audio API Error response body:', errorText);
        throw new Error(`Failed to fetch audio files: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const responseText = await response.text();
      console.log('📡 Audio API Raw response:', responseText.substring(0, 500) + '...');

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('❌ Failed to parse audio response as JSON:', parseError);
        console.log('📡 Full response text:', responseText);
        throw new Error(`Invalid JSON response from audio API: ${parseError.message}`);
      }

      console.log('🎵 Found audio files:', Array.isArray(data) ? data.length : 'Not an array');
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('❌ Error fetching audio files from reader:', error);
      
      // Try alternative endpoints
      console.log('🔄 Trying alternative audio endpoints...');
      
      try {
        const altResponse = await fetch(`${this.baseUrl}/audio`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        console.log('📡 Alternative audio endpoint status:', altResponse.status);
        
        if (altResponse.ok) {
          const altResponseText = await altResponse.text();
          console.log('📡 Alternative audio response:', altResponseText.substring(0, 200) + '...');
          
          try {
            const altData = JSON.parse(altResponseText);
            return Array.isArray(altData) ? altData : [];
          } catch (altParseError) {
            console.error('❌ Alternative audio endpoint also returned invalid JSON');
          }
        }
      } catch (altError) {
        console.error('❌ Alternative audio endpoint also failed:', altError);
      }
      
      throw error;
    }
  }

  async testConnection(): Promise<{ success: boolean; message: string; details?: any }> {
    try {
      console.log('🔍 Testing connection to reader.gleeworld.org...');
      
      const response = await fetch(this.baseUrl, { 
        method: 'HEAD',
        mode: 'cors' 
      });
      
      console.log('📡 Connection test response:', response.status, response.statusText);
      
      if (response.ok) {
        return {
          success: true,
          message: 'Connection successful',
          details: {
            status: response.status,
            headers: Object.fromEntries(response.headers.entries())
          }
        };
      } else {
        return {
          success: false,
          message: `Server responded with status: ${response.status} ${response.statusText}`,
          details: { status: response.status }
        };
      }
    } catch (error) {
      console.error('❌ Connection test failed:', error);
      return {
        success: false,
        message: `Connection failed: ${error.message}`,
        details: { error: error.name }
      };
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
      
      // Test connection first
      const connectionTest = await this.testConnection();
      if (!connectionTest.success) {
        throw new Error(`Connection failed: ${connectionTest.message}`);
      }
      
      // Fetch all data
      const [pdfs, audioFiles] = await Promise.all([
        this.fetchPDFs().catch(error => {
          console.error('❌ PDF fetch failed, continuing with empty array:', error);
          return [];
        }),
        this.fetchAudioFiles().catch(error => {
          console.error('❌ Audio fetch failed, continuing with empty array:', error);
          return [];
        }),
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
