
import React, { useState } from "react";
import { EnhancedCustomAudioPlayer } from "@/components/audio/EnhancedCustomAudioPlayer";
import { AudioFileSelector } from "@/components/audio/AudioFileSelector";
import { useAudioFiles, AudioFileData } from "@/hooks/useAudioFiles";
import { Button } from "@/components/ui/button";
import { Music, Settings } from "lucide-react";

export function CustomAudioSection() {
  const { audioFiles, isLoading } = useAudioFiles();
  const [selectedAudioFile, setSelectedAudioFile] = useState<AudioFileData | null>(null);
  const [showFileSelector, setShowFileSelector] = useState(false);

  const handleSelectAudioFile = (file: AudioFileData) => {
    setSelectedAudioFile(file);
    setShowFileSelector(false);
  };

  // Auto-select first audio file if none selected and files are available
  React.useEffect(() => {
    if (!selectedAudioFile && audioFiles.length > 0 && !isLoading) {
      setSelectedAudioFile(audioFiles[0]);
    }
  }, [audioFiles, selectedAudioFile, isLoading]);

  if (isLoading) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Listen to the Sound of GleeWorld
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Experience our latest recordings and performances
            </p>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading audio files...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Listen to the Sound of GleeWorld
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Experience our latest recordings and performances
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Toggle between player and selector */}
          <div className="flex justify-center mb-6">
            <div className="flex gap-2">
              <Button
                variant={!showFileSelector ? "default" : "outline"}
                onClick={() => setShowFileSelector(false)}
                className="flex items-center gap-2"
              >
                <Music className="h-4 w-4" />
                Player
              </Button>
              <Button
                variant={showFileSelector ? "default" : "outline"}
                onClick={() => setShowFileSelector(true)}
                className="flex items-center gap-2"
              >
                <Settings className="h-4 w-4" />
                Browse Audio
              </Button>
            </div>
          </div>

          {/* Main Content */}
          {showFileSelector ? (
            <AudioFileSelector
              onSelectFile={handleSelectAudioFile}
              selectedFileId={selectedAudioFile?.id}
              showPlayer={false}
            />
          ) : (
            <>
              {selectedAudioFile || audioFiles.length > 0 ? (
                <div className="space-y-6">
                  <EnhancedCustomAudioPlayer className="w-full" />
                  
                  {selectedAudioFile && (
                    <div className="text-center py-4">
                      <h3 className="text-xl font-semibold">{selectedAudioFile.title}</h3>
                      <p className="text-muted-foreground">{selectedAudioFile.description || 'Spelman College Glee Club'}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Music className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-xl font-semibold mb-2">No Audio Files Available</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Audio files will appear here once they are uploaded to the media library.
                  </p>
                  <Button onClick={() => setShowFileSelector(true)}>
                    Browse Audio Library
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
