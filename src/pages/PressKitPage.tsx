
import React, { useState, useEffect } from "react";
import { Layout } from "@/components/landing/Layout";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DownloadCloud, FileText, Image, Music, Users, ExternalLink, Mail, Phone } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { FlickrGallery } from "@/components/media/FlickrGallery";
import { PressKitMediaGrid } from "@/components/media/PressKitMediaGrid";
import { PressKitDocuments } from "@/components/media/PressKitDocuments";
import { VideoPlayer } from "@/components/videos/VideoPlayer";
import { useYouTubeChannel } from "@/hooks/useYouTubeChannel";
import { Spinner } from "@/components/ui/spinner";

export default function PressKitPage() {
  const navigate = useNavigate();
  const { videos, loading, error } = useYouTubeChannel({ maxResults: 3 });
  const [selectedVideoIndex, setSelectedVideoIndex] = useState<number | null>(0);
  
  return (
    <Layout>
      <main className="flex-1 bg-white dark:bg-gray-950">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-glee-purple py-16">
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="font-playfair text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                Press Kit
              </h1>
              <p className="text-lg md:text-xl text-white/90 leading-relaxed max-w-3xl mx-auto">
                Resources for media professionals, event organizers, and partners interested in featuring the Spelman College Glee Club.
              </p>
            </div>
          </div>
          <div className="absolute inset-0 opacity-20 bg-pattern"></div>
        </div>

        {/* Quick Links */}
        <div className="bg-gray-50 dark:bg-gray-900 py-8">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex flex-wrap gap-4 justify-center">
                <Button 
                  variant="outline"
                  className="flex items-center gap-2 hover:bg-glee-purple hover:text-white"
                  onClick={() => document.getElementById('biography')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  <FileText className="h-4 w-4" />
                  Biography
                </Button>
                <Button 
                  variant="outline"
                  className="flex items-center gap-2 hover:bg-glee-purple hover:text-white"
                  onClick={() => document.getElementById('press-photos')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  <Image className="h-4 w-4" />
                  Press Photos
                </Button>
                <Button 
                  variant="outline"
                  className="flex items-center gap-2 hover:bg-glee-purple hover:text-white"
                  onClick={() => document.getElementById('logos')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  <Image className="h-4 w-4" />
                  Logos
                </Button>
                <Button 
                  variant="outline"
                  className="flex items-center gap-2 hover:bg-glee-purple hover:text-white"
                  onClick={() => document.getElementById('videos')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  <Music className="h-4 w-4" />
                  Videos
                </Button>
                <Button 
                  variant="outline"
                  className="flex items-center gap-2 hover:bg-glee-purple hover:text-white"
                  onClick={() => document.getElementById('documents')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  <FileText className="h-4 w-4" />
                  Documents
                </Button>
                <Button 
                  variant="outline"
                  className="flex items-center gap-2 hover:bg-glee-purple hover:text-white"
                  onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  <Users className="h-4 w-4" />
                  Contact
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Biography Section */}
        <div id="biography" className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <FileText className="h-8 w-8 text-glee-accent" />
              <h2 className="font-playfair text-3xl font-bold text-gray-800 dark:text-gray-100">Biography</h2>
            </div>
            
            <div className="prose max-w-none dark:prose-invert">
              <p className="text-lg mb-6 text-gray-700 dark:text-gray-300 leading-relaxed">
                The Spelman College Glee Club stands as one of the nation's most distinguished collegiate choral ensembles. 
                For nearly a century, our voices have carried the legacy of musical excellence representing women of African descent.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-12">
                <div className="rounded-xl overflow-hidden shadow-md">
                  <AspectRatio ratio={4/3}>
                    <img 
                      src="/lovable-uploads/3ad02de0-04d1-4a5e-9279-898e9c317d80.png" 
                      alt="Spelman College Glee Club performing" 
                      className="object-cover w-full h-full"
                    />
                  </AspectRatio>
                </div>
                <div className="flex flex-col justify-center">
                  <h3 className="text-2xl font-semibold mb-4 text-glee-purple">Founded in 1925</h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    Founded under the direction of professor Willis Laurence James, the Spelman College Glee Club began 
                    as a small ensemble dedicated to preserving Negro spirituals and exploring classical repertoire. 
                    Through decades of artistic growth and evolution, we've maintained an unwavering commitment to excellence.
                  </p>
                </div>
              </div>
              
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                The Spelman College Glee Club is dedicated to preserving and celebrating the musical 
                heritage of the African diaspora while fostering excellence in choral performance. 
                Under the direction of Dr. Kevin Phillip Johnson, the Glee Club's repertoire spans 
                classical masterpieces, spirituals, jazz, and contemporary compositions. Our versatile 
                ensemble maintains the highest standards of musical excellence while celebrating the 
                rich cultural heritage of African American music.
              </p>

              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                Throughout its distinguished history, the Spelman College Glee Club has performed at prestigious venues 
                including Carnegie Hall, the Kennedy Center, and Lincoln Center, and has embarked on international tours 
                across Europe, Africa, and South America. The ensemble has been featured on national television programs 
                and has collaborated with renowned orchestras and artists, continuing to uphold its reputation for 
                exceptional musicianship and cultural significance.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <Button className="bg-glee-purple hover:bg-glee-spelman">
                  <DownloadCloud className="mr-2 h-4 w-4" /> Download Full Bio (PDF)
                </Button>
                <Button variant="outline" className="flex gap-2">
                  <ExternalLink className="h-4 w-4" />
                  <a href="https://www.spelman.edu/academics/majors-and-programs/music/ensembles/glee-club" target="_blank" rel="noopener noreferrer">
                    Official Spelman Website
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Press Photos */}
        <div id="press-photos" className="bg-gray-50 dark:bg-gray-900 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-3 mb-6">
                <Image className="h-8 w-8 text-glee-accent" />
                <h2 className="font-playfair text-3xl font-bold text-gray-800 dark:text-gray-100">Press Photos</h2>
              </div>
              
              <p className="text-lg mb-8 text-gray-700 dark:text-gray-300">
                High-resolution photographs of the Spelman College Glee Club for media use. Click on any image to view or download the high-resolution version.
                All photographs are credited to Spelman College unless otherwise noted. For permission to use these images, please 
                <a href="/contact" className="text-glee-purple hover:text-glee-accent mx-1">contact us</a>.
              </p>

              {/* High-Resolution Press Images */}
              <PressKitMediaGrid 
                bucketName="glee-presskit"
                folder="images"
                title="High Resolution Press Images"
                maxItems={8}
              />
              
              {/* Flickr Gallery Section */}
              <div className="mt-12">
                <h3 className="text-xl font-semibold mb-4 text-glee-purple">From Our Flickr Gallery</h3>
                <FlickrGallery photoCount={6} />
              </div>

              <div className="text-center mt-8">
                <Button className="bg-glee-purple hover:bg-glee-spelman">
                  <DownloadCloud className="mr-2 h-4 w-4" /> Download All Press Photos (ZIP)
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Logos Section */}
        <div id="logos" className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <Image className="h-8 w-8 text-glee-accent" />
              <h2 className="font-playfair text-3xl font-bold text-gray-800 dark:text-gray-100">Logo Files</h2>
            </div>
            
            <p className="text-lg mb-8 text-gray-700 dark:text-gray-300">
              Official Spelman College Glee Club logos in various formats for media use. Please do not alter or modify these logos.
            </p>

            <PressKitMediaGrid 
              bucketName="glee-presskit"
              folder="logos"
              title="Logo Package"
              maxItems={8}
            />
            
            <div className="mt-8 text-center">
              <Button className="bg-glee-purple hover:bg-glee-spelman">
                <DownloadCloud className="mr-2 h-4 w-4" /> Download Complete Logo Package
              </Button>
            </div>
          </div>
        </div>

        {/* Videos Section */}
        <div id="videos" className="bg-gray-50 dark:bg-gray-900 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-3 mb-6">
                <Music className="h-8 w-8 text-glee-accent" />
                <h2 className="font-playfair text-3xl font-bold text-gray-800 dark:text-gray-100">Performance Videos</h2>
              </div>
              
              <p className="text-lg mb-8 text-gray-700 dark:text-gray-300">
                Selected performance videos showcasing the Spelman College Glee Club. These videos may be embedded in media coverage with proper attribution.
              </p>

              {loading ? (
                <div className="flex justify-center py-12">
                  <Spinner size="lg" />
                </div>
              ) : error ? (
                <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-md text-red-600 dark:text-red-400 text-center mb-8">
                  Unable to load videos. Please try again later.
                </div>
              ) : (
                <div className="space-y-8">
                  {selectedVideoIndex !== null && videos[selectedVideoIndex] && (
                    <div className="mb-8">
                      <VideoPlayer
                        videoId={videos[selectedVideoIndex].id}
                        title={videos[selectedVideoIndex].title}
                        description={videos[selectedVideoIndex].description}
                      />
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {videos.map((video, index) => (
                      <Card 
                        key={video.id} 
                        className={`cursor-pointer hover:shadow-md transition-shadow ${selectedVideoIndex === index ? 'ring-2 ring-glee-purple' : ''}`}
                        onClick={() => setSelectedVideoIndex(index)}
                      >
                        <div className="relative">
                          <AspectRatio ratio={16/9}>
                            <img 
                              src={video.thumbnailUrl} 
                              alt={video.title}
                              className="w-full h-full object-cover"
                            />
                          </AspectRatio>
                          <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition-opacity">
                            <Button size="sm" variant="secondary">
                              Select Video
                            </Button>
                          </div>
                        </div>
                        <CardContent className="p-3">
                          <h3 className="font-medium text-sm line-clamp-2">{video.title}</h3>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Documents Section */}
        <div id="documents" className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <FileText className="h-8 w-8 text-glee-accent" />
              <h2 className="font-playfair text-3xl font-bold text-gray-800 dark:text-gray-100">Press Documents</h2>
            </div>
            
            <p className="text-lg mb-8 text-gray-700 dark:text-gray-300">
              Press materials and official documents for media, presenters, and partners. Click to download each file.
            </p>

            <PressKitDocuments 
              bucketName="glee-presskit"
              folder="docs"
            />
          </div>
        </div>

        {/* Contact Information */}
        <div id="contact" className="bg-gray-50 dark:bg-gray-900 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-3 mb-6">
                <Users className="h-8 w-8 text-glee-accent" />
                <h2 className="font-playfair text-3xl font-bold text-gray-800 dark:text-gray-100">Contact Information</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Director Contact Card */}
                <Card className="bg-white dark:bg-gray-800 border-none shadow-lg h-full">
                  <CardContent className="py-8 px-6 md:px-10">
                    <h3 className="text-2xl font-bold mb-2 text-glee-purple">Dr. Kevin Phillip Johnson</h3>
                    <p className="text-lg font-medium mb-6 text-gray-600 dark:text-gray-400">
                      Director, Spelman College Glee Club
                    </p>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Mail className="h-5 w-5 text-glee-spelman" />
                        <a href="mailto:kevin@spelman.edu" className="text-glee-spelman hover:underline">
                          kevin@spelman.edu
                        </a>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone className="h-5 w-5 text-glee-spelman" />
                        <a href="tel:+14045551234" className="text-glee-spelman hover:underline">
                          (404) 555-1234
                        </a>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Media Relations Contact Card */}
                <Card className="bg-white dark:bg-gray-800 border-none shadow-lg h-full">
                  <CardContent className="py-8 px-6 md:px-10">
                    <h3 className="text-2xl font-bold mb-2 text-glee-purple">Media Relations</h3>
                    <p className="text-lg font-medium mb-6 text-gray-600 dark:text-gray-400">
                      Spelman College Office of Communications
                    </p>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Mail className="h-5 w-5 text-glee-spelman" />
                        <a href="mailto:media@spelman.edu" className="text-glee-spelman hover:underline">
                          media@spelman.edu
                        </a>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone className="h-5 w-5 text-glee-spelman" />
                        <a href="tel:+14045552345" className="text-glee-spelman hover:underline">
                          (404) 555-2345
                        </a>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="mt-12 text-center">
                <Button 
                  variant="outline"
                  className="border-glee-purple text-glee-purple hover:bg-glee-purple hover:text-white"
                  onClick={() => navigate("/contact")}
                >
                  Contact Us Through Our Online Form
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}
