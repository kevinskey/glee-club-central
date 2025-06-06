
export const getResponsiveHeightClass = (height?: string) => {
  // Using standard hero height instead of variable heights
  return 'h-[60vh] min-h-[400px] max-h-[600px]';
};

export const getTextPositionClass = (position?: string) => {
  switch (position) {
    case 'top': return 'items-start pt-4 sm:pt-8 md:pt-12';
    case 'bottom': return 'items-end pb-4 sm:pb-8 md:pb-12';
    default: return 'items-center';
  }
};

export const getTextAlignmentClass = (alignment?: string) => {
  switch (alignment) {
    case 'left': return 'text-left';
    case 'right': return 'text-right';
    default: return 'text-center';
  }
};
