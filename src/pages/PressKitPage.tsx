
import React from "react";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DownloadCloud, FileText, Image, Music, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { FlickrGallery } from "@/components/media/FlickrGallery";

export default function PressKitPage() {
  const navigate = useNavigate();
  
  return (
    <div className="flex min-h-screen flex-col">
      <Header initialShowNewsFeed={false} />
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
                  onClick={() => document.getElementById('fact-sheet')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  <FileText className="h-4 w-4" />
                  Fact Sheet
                </Button>
                <Button 
                  variant="outline"
                  className="flex items-center gap-2 hover:bg-glee-purple hover:text-white"
                  onClick={() => document.getElementById('director')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  <Users className="h-4 w-4" />
                  Director
                </Button>
                <Button 
                  variant="outline"
                  className="flex items-center gap-2 hover:bg-glee-purple hover:text-white"
                  onClick={() => document.getElementById('downloads')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  <DownloadCloud className="h-4 w-4" />
                  Downloads
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

              {/* Our Curated Press Photos */}
              <h3 className="text-xl font-semibold mb-4 text-glee-purple">Official Press Images</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                <div className="rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                  <AspectRatio ratio={4/3}>
                    <img 
                      src="/lovable-uploads/3ad02de0-04d1-4a5e-9279-898e9c317d80.png" 
                      alt="Spelman College Glee Club performing" 
                      className="object-cover w-full h-full"
                    />
                  </AspectRatio>
                  <div className="p-3 bg-white dark:bg-gray-800">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Spelman College Glee Club in Performance, 2023</p>
                  </div>
                </div>
                <div className="rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                  <AspectRatio ratio={4/3}>
                    <img 
                      src="/lovable-uploads/10bab1e7-0f4e-402f-ab65-feb4710b5eaf.png" 
                      alt="Spelman College Glee Club formal portrait" 
                      className="object-cover w-full h-full"
                    />
                  </AspectRatio>
                  <div className="p-3 bg-white dark:bg-gray-800">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Glee Club Formal Portrait, 2022</p>
                  </div>
                </div>
                <div className="rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                  <AspectRatio ratio={4/3}>
                    <img 
                      src="/lovable-uploads/e06ff100-0add-4adc-834f-50ef81098d35.png" 
                      alt="Spelman College Glee Club with orchestra" 
                      className="object-cover w-full h-full"
                    />
                  </AspectRatio>
                  <div className="p-3 bg-white dark:bg-gray-800">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Glee Club with Orchestra, Carnegie Hall</p>
                  </div>
                </div>
              </div>
              
              {/* Flickr Gallery Section */}
              <h3 className="text-xl font-semibold mb-4 text-glee-purple">From Our Flickr Gallery</h3>
              <FlickrGallery photoCount={6} />

              <div className="text-center mt-8">
                <Button className="bg-glee-purple hover:bg-glee-spelman">
                  <DownloadCloud className="mr-2 h-4 w-4" /> Download All Press Photos (ZIP)
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Fact Sheet */}
        <div id="fact-sheet" className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <FileText className="h-8 w-8 text-glee-accent" />
              <h2 className="font-playfair text-3xl font-bold text-gray-800 dark:text-gray-100">Fact Sheet</h2>
            </div>
            
            <Card className="border-none shadow-lg">
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-glee-purple">Full Name</h3>
                    <p className="text-gray-700 dark:text-gray-300">Spelman College Glee Club</p>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-glee-purple">Founded</h3>
                    <p className="text-gray-700 dark:text-gray-300">1925</p>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-glee-purple">Ensemble Size</h3>
                    <p className="text-gray-700 dark:text-gray-300">Approximately 50 vocalists, representing all academic disciplines at Spelman College</p>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-glee-purple">Repertoire</h3>
                    <p className="text-gray-700 dark:text-gray-300">Classical choral literature, Negro spirituals, contemporary compositions, gospel, and jazz arrangements</p>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-glee-purple">Notable Performances</h3>
                    <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300 space-y-1">
                      <li>Carnegie Hall (New York, NY)</li>
                      <li>The Kennedy Center (Washington, DC)</li>
                      <li>Lincoln Center (New York, NY)</li>
                      <li>International tours across Europe, Africa, and South America</li>
                      <li>White House performances for multiple U.S. Presidents</li>
                      <li>Atlanta Symphony Hall with the Atlanta Symphony Orchestra</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-glee-purple">Notable Collaborations</h3>
                    <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300 space-y-1">
                      <li>The Atlanta Symphony Orchestra</li>
                      <li>The Morehouse College Glee Club</li>
                      <li>Grammy-winning artists and composers</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Director Section */}
        <div id="director" className="bg-gray-50 dark:bg-gray-900 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-3 mb-6">
                <Users className="h-8 w-8 text-glee-accent" />
                <h2 className="font-playfair text-3xl font-bold text-gray-800 dark:text-gray-100">Director</h2>
              </div>
              
              <Card className="bg-white dark:bg-gray-800 border-none shadow-lg max-w-3xl mx-auto">
                <CardContent className="py-8 px-6 md:px-10">
                  <h3 className="text-2xl font-bold mb-2 text-glee-purple">Dr. Kevin Phillip Johnson</h3>
                  <p className="text-lg font-medium mb-6 text-gray-600 dark:text-gray-400">
                    Director, Spelman College Glee Club
                  </p>
                  <div className="space-y-4 text-gray-700 dark:text-gray-300">
                    <p>
                      Dr. Kevin Phillip Johnson is an award-winning composer, arranger, and Associate Professor of Music 
                      at Spelman College, where he directs the renowned Spelman College Glee Club. A dynamic educator 
                      and cultural visionary, Dr. Johnson integrates African-American musical traditions with cutting-edge 
                      technology in both performance and pedagogy.
                    </p>
                    <p>
                      His innovative work includes the Hip-Hop Mass, the Black Music Scholar Academy, and original 
                      compositions published through Carl Fischer and Lion & Lamb Publishing. With a creative portfolio 
                      spanning choral music, screenwriting, and product development, Dr. Johnson continues to shape 
                      the future of music education and Black cultural expression.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Downloads Section */}
        <div id="downloads" className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <DownloadCloud className="h-8 w-8 text-glee-accent" />
              <h2 className="font-playfair text-3xl font-bold text-gray-800 dark:text-gray-100">Downloads</h2>
            </div>
            
            <p className="text-lg mb-8 text-gray-700 dark:text-gray-300">
              Download official materials for media and promotional use. For additional resources or specific requests, please 
              <a href="/contact" className="text-glee-purple hover:text-glee-accent mx-1">contact us</a>.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <FileText className="h-12 w-12 text-glee-purple" />
                    <div>
                      <h3 className="text-xl font-semibold mb-1">Press Release</h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">Latest press release about upcoming performances (PDF)</p>
                      <Button size="sm" className="bg-glee-purple hover:bg-glee-spelman">
                        <DownloadCloud className="mr-2 h-4 w-4" /> Download
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <Image className="h-12 w-12 text-glee-purple" />
                    <div>
                      <h3 className="text-xl font-semibold mb-1">Logo Package</h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">Official logos in various formats (ZIP)</p>
                      <Button size="sm" className="bg-glee-purple hover:bg-glee-spelman">
                        <DownloadCloud className="mr-2 h-4 w-4" /> Download
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <Music className="h-12 w-12 text-glee-purple" />
                    <div>
                      <h3 className="text-xl font-semibold mb-1">Performance Rider</h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">Technical and logistical requirements (PDF)</p>
                      <Button size="sm" className="bg-glee-purple hover:bg-glee-spelman">
                        <DownloadCloud className="mr-2 h-4 w-4" /> Download
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <FileText className="h-12 w-12 text-glee-purple" />
                    <div>
                      <h3 className="text-xl font-semibold mb-1">Full Media Kit</h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">Complete press kit with all materials (ZIP)</p>
                      <Button size="sm" className="bg-glee-purple hover:bg-glee-spelman">
                        <DownloadCloud className="mr-2 h-4 w-4" /> Download
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Contact CTA */}
        <div className="bg-glee-purple text-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="font-playfair text-3xl font-bold mb-6">Media Inquiries</h2>
              <p className="text-lg mb-8 text-white/90 max-w-2xl mx-auto">
                For interview requests, booking inquiries, or additional press materials, 
                please contact our media relations team.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button 
                  size="lg"
                  className="bg-white text-glee-purple hover:bg-gray-100"
                  onClick={() => navigate("/contact")}
                >
                  Contact Us
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-white text-white hover:bg-white/20"
                  onClick={() => navigate("/")}
                >
                  Return to Homepage
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
