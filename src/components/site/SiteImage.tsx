
import React from "react";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface SiteImageProps {
  src: string;
  alt: string;
  aspectRatio?: number;
  className?: string;
  fallbackSrc?: string;
  width?: number | string;
  height?: number | string;
  objectFit?: "cover" | "contain" | "fill" | "none" | "scale-down";
}

export const SiteImage: React.FC<SiteImageProps> = ({
  src,
  alt,
  aspectRatio = 16 / 9,
  className = "",
  fallbackSrc = "/placeholder.svg",
  width,
  height,
  objectFit = "cover"
}) => {
  const [imgSrc, setImgSrc] = React.useState<string>(src);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  React.useEffect(() => {
    setImgSrc(src);
  }, [src]);

  const handleError = () => {
    setImgSrc(fallbackSrc);
    setIsLoading(false);
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  return (
    <div className={`overflow-hidden relative ${className}`} style={{ width, height }}>
      {aspectRatio ? (
        <AspectRatio ratio={aspectRatio}>
          <img
            src={imgSrc}
            alt={alt}
            className={`w-full h-full transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
            style={{ objectFit }}
            onError={handleError}
            onLoad={handleLoad}
          />
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-muted">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            </div>
          )}
        </AspectRatio>
      ) : (
        <>
          <img
            src={imgSrc}
            alt={alt}
            className={`w-full h-full transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
            style={{ objectFit }}
            onError={handleError}
            onLoad={handleLoad}
          />
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-muted">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
