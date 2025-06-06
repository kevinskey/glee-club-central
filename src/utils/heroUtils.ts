
export const getResponsiveHeightClass = (height?: string) => {
  // Remove fixed heights, use minimums only to let images determine actual height
  switch (height) {
    case 'tiny': return 'min-h-[200px]';
    case 'small': return 'min-h-[250px]';
    case 'medium': return 'min-h-[300px]';
    case 'full': return 'min-h-[400px]';
    case 'large':
    default:
      return 'min-h-[320px]';
  }
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
