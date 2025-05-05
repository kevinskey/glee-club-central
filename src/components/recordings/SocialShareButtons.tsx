
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Copy, Check, Facebook, Twitter, Linkedin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SocialShareButtonsProps {
  url: string;
  title: string;
}

export function SocialShareButtons({ url, title }: SocialShareButtonsProps) {
  const { toast } = useToast();
  const [copied, setCopied] = React.useState(false);

  // Copy URL to clipboard
  const handleCopyLink = () => {
    navigator.clipboard.writeText(url)
      .then(() => {
        setCopied(true);
        toast({
          title: "Link copied",
          description: "Share link has been copied to clipboard",
        });
        setTimeout(() => setCopied(false), 2000);
      })
      .catch((error) => {
        console.error("Error copying to clipboard:", error);
        toast({
          title: "Copy failed",
          description: "Failed to copy link to clipboard",
          variant: "destructive",
        });
      });
  };

  // Share on Facebook
  const handleShareFacebook = () => {
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(title)}`;
    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  // Share on Twitter
  const handleShareTwitter = () => {
    const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  // Share on LinkedIn
  const handleShareLinkedIn = () => {
    const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`;
    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  return (
    <div className="space-y-4">
      {/* URL input with copy button */}
      <div className="flex space-x-2">
        <Input 
          value={url} 
          readOnly 
          className="flex-1"
        />
        <Button 
          size="icon" 
          onClick={handleCopyLink}
          variant="outline"
          className="flex-shrink-0"
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        </Button>
      </div>
      
      {/* Social media buttons */}
      <div className="grid grid-cols-3 gap-2">
        <Button 
          onClick={handleShareFacebook} 
          variant="outline"
          className="w-full flex items-center justify-center gap-2"
        >
          <Facebook className="h-4 w-4" />
          Facebook
        </Button>
        <Button 
          onClick={handleShareTwitter} 
          variant="outline"
          className="w-full flex items-center justify-center gap-2"
        >
          <Twitter className="h-4 w-4" />
          Twitter
        </Button>
        <Button 
          onClick={handleShareLinkedIn} 
          variant="outline"
          className="w-full flex items-center justify-center gap-2"
        >
          <Linkedin className="h-4 w-4" />
          LinkedIn
        </Button>
      </div>
    </div>
  );
}
