
export const audioCategoryLabels: Record<string, string> = {
  my_tracks: "My Tracks",
  recordings: "Recordings",
  part_tracks: "Part Tracks",
  backing_tracks: "Backing Tracks"
};

export const getCategoryLabel = (categoryKey: string): string => {
  return audioCategoryLabels[categoryKey] || categoryKey;
};
