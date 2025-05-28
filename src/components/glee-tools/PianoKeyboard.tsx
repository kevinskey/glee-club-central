
import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { useAdvancedAudio } from '@/hooks/useAdvancedAudio';
import { Volume2, Keyboard, Settings } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const WHITE_KEYS = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
const BLACK_KEYS = ['C#', 'D#', '', 'F#', 'G#', 'A#', ''];
const OCTAVES = [2, 3, 4, 5, 6];

interface PianoKeyboardProps {
  onClose?: () => void;
}

export function PianoKeyboard({ onClose }: PianoKeyboardProps) {
  const [activeKeys, setActiveKeys] = useState<Set<string>>(new Set());
  const [volume, setVolume] = useState(80);
  const [selectedInstrument, setSelectedInstrument] = useState('acoustic_grand_piano');
  const [startOctave, setStartOctave] = useState(3);
  const [octaveCount, setOctaveCount] = useState(3);
  const [sustain, setSustain] = useState(false);
  const [velocity, setVelocity] = useState(100);
  
  const { 
    isInitialized, 
    isLoading, 
    error, 
    playNote, 
    stopNote, 
    stopAllNotes,
    availableInstruments,
    loadInstrument
  } = useAdvancedAudio();

  const handleNoteOn = useCallback(async (note: string, octave: number) => {
    if (!isInitialized) return;
    
    const noteKey = `${note}${octave}`;
    
    try {
      await playNote(
        noteKey, 
        Math.round((velocity / 100) * 127), 
        sustain ? undefined : 2,
        selectedInstrument
      );
      
      setActiveKeys(prev => new Set(prev).add(noteKey));
    } catch (error) {
      console.error('Error playing note:', error);
    }
  }, [isInitialized, velocity, sustain, selectedInstrument, playNote]);

  const handleNoteOff = useCallback((note: string, octave: number) => {
    if (!sustain) {
      const noteKey = `${note}${octave}`;
      stopNote(noteKey, selectedInstrument);
      setActiveKeys(prev => {
        const newSet = new Set(prev);
        newSet.delete(noteKey);
        return newSet;
      });
    }
  }, [sustain, selectedInstrument, stopNote]);

  const handleStopAll = useCallback(() => {
    stopAllNotes();
    setActiveKeys(new Set());
  }, [stopAllNotes]);

  const handleInstrumentChange = useCallback(async (instrumentId: string) => {
    setSelectedInstrument(instrumentId);
    await loadInstrument(instrumentId);
  }, [loadInstrument]);

  const renderOctave = useCallback((octave: number) => {
    return (
      <div key={octave} className="relative flex">
        {/* White keys */}
        {WHITE_KEYS.map((note, index) => {
          const noteKey = `${note}${octave}`;
          const isActive = activeKeys.has(noteKey);
          
          return (
            <Button
              key={noteKey}
              className={cn(
                "relative w-10 h-32 border border-gray-300 bg-white text-black text-xs font-mono rounded-b-md transition-all duration-100 shadow-sm",
                isActive ? "bg-gray-200 shadow-inner scale-95" : "hover:bg-gray-50 active:bg-gray-200"
              )}
              onMouseDown={() => handleNoteOn(note, octave)}
              onMouseUp={() => handleNoteOff(note, octave)}
              onMouseLeave={() => handleNoteOff(note, octave)}
              onTouchStart={(e) => {
                e.preventDefault();
                handleNoteOn(note, octave);
              }}
              onTouchEnd={(e) => {
                e.preventDefault();
                handleNoteOff(note, octave);
              }}
              disabled={!isInitialized}
            >
              <div className="absolute bottom-2 text-center w-full">
                <div className="font-semibold">{note}</div>
                <div className="text-xs opacity-60">{octave}</div>
              </div>
            </Button>
          );
        })}
        
        {/* Black keys */}
        <div className="absolute inset-0 flex">
          {BLACK_KEYS.map((note, index) => {
            if (!note) {
              return <div key={`empty-${index}`} className="w-10" />;
            }
            
            const noteKey = `${note}${octave}`;
            const isActive = activeKeys.has(noteKey);
            const leftOffset = index * 40 + 25; // 40px = white key width, 25px offset
            
            return (
              <Button
                key={noteKey}
                className={cn(
                  "absolute w-6 h-20 bg-gray-900 text-white text-xs font-mono rounded-b-md transition-all duration-100 z-10 shadow-md",
                  isActive ? "bg-gray-600 shadow-inner scale-95" : "hover:bg-gray-700 active:bg-gray-600"
                )}
                style={{ left: `${leftOffset}px` }}
                onMouseDown={() => handleNoteOn(note, octave)}
                onMouseUp={() => handleNoteOff(note, octave)}
                onMouseLeave={() => handleNoteOff(note, octave)}
                onTouchStart={(e) => {
                  e.preventDefault();
                  handleNoteOn(note, octave);
                }}
                onTouchEnd={(e) => {
                  e.preventDefault();
                  handleNoteOff(note, octave);
                }}
                disabled={!isInitialized}
              >
                <div className="absolute bottom-1 text-center w-full">
                  <div className="text-xs">{note.replace('#', '♯')}</div>
                </div>
              </Button>
            );
          })}
        </div>
      </div>
    );
  }, [activeKeys, isInitialized, handleNoteOn, handleNoteOff]);

  if (isLoading) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="flex items-center justify-center p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto mb-2"></div>
            <div className="text-sm text-muted-foreground">Initializing piano keyboard...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="p-6">
          <div className="text-center">
            <div className="text-red-500 mb-2">Audio Error</div>
            <div className="text-sm text-muted-foreground">{error}</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const keyboardInstruments = availableInstruments.filter(inst => 
    inst.category === 'Piano' || inst.category === 'Organ' || inst.category === 'Strings'
  );

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle className="text-center flex items-center justify-center gap-2">
          <Keyboard className="h-5 w-5" />
          Professional Piano Keyboard
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs defaultValue="keyboard" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="keyboard">Keyboard</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="keyboard" className="space-y-4">
            {/* Quick Controls */}
            <div className="flex flex-wrap items-center gap-4 p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-2">
                <Volume2 className="h-4 w-4" />
                <span className="text-sm font-medium">Volume:</span>
                <div className="w-24">
                  <Slider
                    value={[volume]}
                    onValueChange={(values) => setVolume(values[0])}
                    min={0}
                    max={100}
                    step={1}
                  />
                </div>
                <span className="text-sm text-muted-foreground">{volume}%</span>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSustain(!sustain)}
                className={sustain ? "bg-primary text-primary-foreground" : ""}
              >
                Sustain {sustain ? "ON" : "OFF"}
              </Button>
              
              <Button variant="outline" size="sm" onClick={handleStopAll}>
                Stop All
              </Button>
            </div>
            
            {/* Piano Keyboard */}
            <div className="flex justify-center overflow-x-auto pb-4">
              <div className="flex space-x-0 p-4 bg-gradient-to-b from-gray-100 to-gray-200 rounded-lg shadow-inner">
                {Array.from({ length: octaveCount }, (_, i) => startOctave + i).map(octave => 
                  renderOctave(octave)
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="settings" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Instrument Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Instrument</label>
                <Select value={selectedInstrument} onValueChange={handleInstrumentChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {keyboardInstruments.map(instrument => (
                      <SelectItem key={instrument.id} value={instrument.id}>
                        {instrument.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Keyboard Range */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Starting Octave</label>
                <Select value={startOctave.toString()} onValueChange={(value) => setStartOctave(parseInt(value))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {OCTAVES.map(octave => (
                      <SelectItem key={octave} value={octave.toString()}>
                        Octave {octave}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Number of Octaves */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Number of Octaves</label>
                <Select value={octaveCount.toString()} onValueChange={(value) => setOctaveCount(parseInt(value))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 Octave</SelectItem>
                    <SelectItem value="2">2 Octaves</SelectItem>
                    <SelectItem value="3">3 Octaves</SelectItem>
                    <SelectItem value="4">4 Octaves</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Velocity */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Velocity: {velocity}%</label>
                <Slider
                  value={[velocity]}
                  onValueChange={(values) => setVelocity(values[0])}
                  min={1}
                  max={127}
                  step={1}
                  className="w-full"
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        {/* Close Button */}
        {onClose && (
          <div className="flex justify-center pt-4">
            <Button variant="ghost" size="sm" onClick={onClose}>
              Close
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
