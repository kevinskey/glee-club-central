
export const getResponsiveHeightClass = (height?: string) => {
  switch (height) {
    case 'tiny': return 'h-[200px] sm:h-[250px] md:h-[300px]';
    case 'small': return 'h-[250px] sm:h-[300px] md:h-[400px]';
    case 'medium': return 'h-[300px] sm:h-[400px] md:h-[500px]';
    case 'full': return 'h-[350px] sm:h-[500px] md:h-screen';
    case 'large':
    default:
      return 'h-[280px] sm:h-[400px] md:h-[550px]';
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
