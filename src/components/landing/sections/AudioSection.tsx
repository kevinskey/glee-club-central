
import React from "react";
import { CustomAudioSection } from "./CustomAudioSection";

interface AudioTrack {
  id: string;
  title: string;
  audioUrl: string;
  albumArt: string;
  artist: string;
  duration: string;
}

interface AudioSectionProps {
  tracks: AudioTrack[];
}

export function AudioSection({ tracks }: AudioSectionProps) {
  return <CustomAudioSection tracks={tracks} />;
}
