
import React from "react";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Music, Users, Calendar, Award } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AboutPage() {
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
                About the Spelman College Glee Club
              </h1>
              <p className="text-lg md:text-xl text-white/90 leading-relaxed max-w-3xl mx-auto">
                Founded in 1925, we represent one of the nation's most distinguished collegiate choral ensembles, 
                carrying a legacy of musical excellence for nearly a century.
              </p>
            </div>
          </div>
          <div className="absolute inset-0 opacity-20 bg-pattern"></div>
        </div>

        {/* History Section */}
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <Music className="h-8 w-8 text-glee-accent" />
              <h2 className="font-playfair text-3xl font-bold text-gray-800 dark:text-gray-100">Our Rich Heritage</h2>
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
            </div>

            <div className="my-12 border-l-4 border-glee-accent pl-6 py-2">
              <p className="text-xl italic text-gray-700 dark:text-gray-300">
                "The human voice is the most perfect instrument of all."
              </p>
              <p className="text-right text-gray-500 mt-2">— Arvo Pärt</p>
            </div>
          </div>
        </div>

        {/* Mission and Values */}
        <div className="bg-gray-50 dark:bg-gray-900 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-3 mb-6">
                <Users className="h-8 w-8 text-glee-accent" />
                <h2 className="font-playfair text-3xl font-bold text-gray-800 dark:text-gray-100">Our Mission</h2>
              </div>
              
              <p className="text-lg mb-12 text-gray-700 dark:text-gray-300 leading-relaxed">
                The Spelman College Glee Club is dedicated to preserving and celebrating the musical 
                heritage of the African diaspora while fostering excellence in choral performance. 
                We strive to provide educational and performance opportunities that empower young 
                women to develop their musical talents and leadership skills.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-white dark:bg-gray-800 border-none shadow-lg">
                  <CardContent className="pt-6">
                    <div className="rounded-full bg-glee-purple/10 w-12 h-12 flex items-center justify-center mb-4">
                      <Music className="h-6 w-6 text-glee-purple" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Musical Excellence</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Dedicated to the highest standards of vocal performance and musicianship.
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-white dark:bg-gray-800 border-none shadow-lg">
                  <CardContent className="pt-6">
                    <div className="rounded-full bg-glee-purple/10 w-12 h-12 flex items-center justify-center mb-4">
                      <Award className="h-6 w-6 text-glee-purple" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Cultural Heritage</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Preserving and celebrating the rich musical traditions of the African diaspora.
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-white dark:bg-gray-800 border-none shadow-lg">
                  <CardContent className="pt-6">
                    <div className="rounded-full bg-glee-purple/10 w-12 h-12 flex items-center justify-center mb-4">
                      <Users className="h-6 w-6 text-glee-purple" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Empowerment</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Fostering leadership, confidence, and artistic growth in women of color.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>

        {/* Repertoire and Performances */}
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <Calendar className="h-8 w-8 text-glee-accent" />
              <h2 className="font-playfair text-3xl font-bold text-gray-800 dark:text-gray-100">Repertoire & Performances</h2>
            </div>
            
            <p className="text-lg mb-8 text-gray-700 dark:text-gray-300 leading-relaxed">
              Under the direction of Dr. Kevin Phillip Johnson, the Glee Club's repertoire spans 
              classical masterpieces, spirituals, jazz, and contemporary compositions. Our versatile 
              ensemble maintains the highest standards of musical excellence while celebrating the 
              rich cultural heritage of African American music.
            </p>

            <div className="mb-12">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="notable-performances">
                  <AccordionTrigger className="text-xl font-semibold">Notable Performances</AccordionTrigger>
                  <AccordionContent className="text-gray-700 dark:text-gray-300">
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Carnegie Hall (New York, NY)</li>
                      <li>The Kennedy Center (Washington, DC)</li>
                      <li>Lincoln Center (New York, NY)</li>
                      <li>International tours across Europe, Africa, and South America</li>
                      <li>White House performances for multiple U.S. Presidents</li>
                      <li>Atlanta Symphony Hall with the Atlanta Symphony Orchestra</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="signature-works">
                  <AccordionTrigger className="text-xl font-semibold">Signature Works</AccordionTrigger>
                  <AccordionContent className="text-gray-700 dark:text-gray-300">
                    <p className="mb-4">Our repertoire encompasses a wide range of musical styles, including:</p>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Negro spirituals and traditional African American compositions</li>
                      <li>Classical choral masterworks</li>
                      <li>Contemporary gospel and jazz arrangements</li>
                      <li>Commissioned works by prominent African American composers</li>
                      <li>Multi-cultural pieces celebrating global musical traditions</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="collaborations">
                  <AccordionTrigger className="text-xl font-semibold">Notable Collaborations</AccordionTrigger>
                  <AccordionContent className="text-gray-700 dark:text-gray-300">
                    <p className="mb-4">The Spelman College Glee Club has had the honor of collaborating with:</p>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>The Atlanta Symphony Orchestra</li>
                      <li>The Morehouse College Glee Club</li>
                      <li>Grammy-winning artists and composers</li>
                      <li>International choral festivals and competitions</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            <div className="rounded-xl overflow-hidden shadow-md my-8">
              <AspectRatio ratio={16/9}>
                <img 
                  src="/lovable-uploads/10bab1e7-0f4e-402f-ab65-feb4710b5eaf.png" 
                  alt="Spelman College Glee Club in performance" 
                  className="object-cover w-full h-full"
                />
              </AspectRatio>
            </div>
          </div>
        </div>

        {/* Join Us CTA */}
        <div className="bg-glee-purple text-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="font-playfair text-3xl font-bold mb-6">Join Our Community</h2>
              <p className="text-lg mb-8 text-white/90 max-w-2xl mx-auto">
                Whether you're a prospective member, an alumna, or a supporter of choral music, 
                we welcome you to be part of our continuing legacy of excellence.
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
                  View Performances
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Leadership Section */}
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <Users className="h-8 w-8 text-glee-accent" />
              <h2 className="font-playfair text-3xl font-bold text-gray-800 dark:text-gray-100">Leadership</h2>
            </div>
            
            <div className="prose max-w-none dark:prose-invert mb-12">
              <p className="text-lg mb-6 text-gray-700 dark:text-gray-300 leading-relaxed">
                The Spelman College Glee Club is led by a dedicated team of faculty directors and student officers 
                who work together to uphold our tradition of excellence.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <Card className="overflow-hidden">
                <div className="p-1">
                  <AspectRatio ratio={1/1} className="overflow-hidden rounded-md bg-gray-100 dark:bg-gray-800">
                    <img 
                      src="/lovable-uploads/642b93d7-fc15-4c2c-a7df-fe81aadb2f3b.png" 
                      alt="Dr. Kevin Phillip Johnson" 
                      className="object-cover w-full h-full"
                    />
                  </AspectRatio>
                </div>
                <CardContent className="text-center py-6">
                  <h3 className="text-xl font-bold mb-1">Dr. Kevin Phillip Johnson</h3>
                  <p className="text-glee-purple font-medium mb-3">Director</p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Leading the Glee Club with distinction since 2010, Dr. Johnson holds a Doctor of Musical 
                    Arts degree and has conducted performances worldwide.
                  </p>
                </CardContent>
              </Card>

              <Card className="overflow-hidden">
                <div className="p-1">
                  <AspectRatio ratio={1/1} className="overflow-hidden rounded-md bg-gray-100 dark:bg-gray-800">
                    <img 
                      src="/lovable-uploads/9a044e72-80dc-40a6-b716-2d5c2d35b878.png" 
                      alt="Dr. Maya Williams" 
                      className="object-cover w-full h-full"
                    />
                  </AspectRatio>
                </div>
                <CardContent className="text-center py-6">
                  <h3 className="text-xl font-bold mb-1">Dr. Maya Williams</h3>
                  <p className="text-glee-purple font-medium mb-3">Assistant Director</p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Dr. Williams specializes in vocal pedagogy and arranging traditional spirituals 
                    for modern choral performance. Spelman Class of 2005.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
