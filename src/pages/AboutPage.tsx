
import React from "react";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { ResponsiveText } from "@/components/ui/responsive-text";
import { Music, Users, Calendar, Award } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AboutPage() {
  const navigate = useNavigate();
  
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-primary py-16 lg:py-24">
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <ResponsiveText 
                as="h1" 
                size="4xl" 
                className="font-playfair font-bold text-primary-foreground mb-6"
                balance
              >
                About the Spelman College Glee Club
              </ResponsiveText>
              <ResponsiveText 
                size="lg" 
                className="text-primary-foreground/90 leading-relaxed max-w-3xl mx-auto"
              >
                Founded in 1925, we represent one of the nation's most distinguished collegiate choral ensembles, 
                carrying a legacy of musical excellence for nearly a century.
              </ResponsiveText>
            </div>
          </div>
          <div className="absolute inset-0 opacity-20 bg-pattern"></div>
        </div>

        {/* History Section */}
        <div className="container mx-auto px-4 py-16 lg:py-20">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
              <Music className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
              <ResponsiveText 
                as="h2" 
                size="3xl" 
                className="font-playfair font-bold text-foreground"
              >
                Our Rich Heritage
              </ResponsiveText>
            </div>
            
            <div className="space-y-8">
              <ResponsiveText 
                size="lg" 
                className="text-muted-foreground leading-relaxed"
              >
                The Spelman College Glee Club stands as one of the nation's most distinguished collegiate choral ensembles. 
                For nearly a century, our voices have carried the legacy of musical excellence representing women of African descent.
              </ResponsiveText>
              
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
                <div className="flex flex-col justify-center space-y-4">
                  <ResponsiveText 
                    as="h3" 
                    size="xl" 
                    className="font-semibold text-primary"
                  >
                    Founded in 1925
                  </ResponsiveText>
                  <ResponsiveText className="text-muted-foreground">
                    Founded under the direction of professor Willis Laurence James, the Spelman College Glee Club began 
                    as a small ensemble dedicated to preserving Negro spirituals and exploring classical repertoire. 
                    Through decades of artistic growth and evolution, we've maintained an unwavering commitment to excellence.
                  </ResponsiveText>
                </div>
              </div>
            </div>

            <div className="my-12 border-l-4 border-primary pl-6 py-4">
              <ResponsiveText 
                size="lg" 
                className="italic text-muted-foreground mb-2"
              >
                "The human voice is the most perfect instrument of all."
              </ResponsiveText>
              <ResponsiveText size="sm" className="text-right text-muted-foreground/70">
                — Arvo Pärt
              </ResponsiveText>
            </div>
          </div>
        </div>

        {/* Mission and Values */}
        <div className="bg-muted/50 py-16 lg:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-3 mb-8">
                <Users className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                <ResponsiveText 
                  as="h2" 
                  size="3xl" 
                  className="font-playfair font-bold text-foreground"
                >
                  Our Mission
                </ResponsiveText>
              </div>
              
              <ResponsiveText 
                size="lg" 
                className="mb-12 text-muted-foreground leading-relaxed"
              >
                The Spelman College Glee Club is dedicated to preserving and celebrating the musical 
                heritage of the African diaspora while fostering excellence in choral performance. 
                We strive to provide educational and performance opportunities that empower young 
                women to develop their musical talents and leadership skills.
              </ResponsiveText>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-none shadow-lg">
                  <CardContent className="pt-6">
                    <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
                      <Music className="h-6 w-6 text-primary" />
                    </div>
                    <ResponsiveText 
                      as="h3" 
                      size="lg" 
                      className="font-semibold mb-2"
                    >
                      Musical Excellence
                    </ResponsiveText>
                    <ResponsiveText className="text-muted-foreground">
                      Dedicated to the highest standards of vocal performance and musicianship.
                    </ResponsiveText>
                  </CardContent>
                </Card>

                <Card className="border-none shadow-lg">
                  <CardContent className="pt-6">
                    <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
                      <Award className="h-6 w-6 text-primary" />
                    </div>
                    <ResponsiveText 
                      as="h3" 
                      size="lg" 
                      className="font-semibold mb-2"
                    >
                      Cultural Heritage
                    </ResponsiveText>
                    <ResponsiveText className="text-muted-foreground">
                      Preserving and celebrating the rich musical traditions of the African diaspora.
                    </ResponsiveText>
                  </CardContent>
                </Card>

                <Card className="border-none shadow-lg">
                  <CardContent className="pt-6">
                    <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <ResponsiveText 
                      as="h3" 
                      size="lg" 
                      className="font-semibold mb-2"
                    >
                      Empowerment
                    </ResponsiveText>
                    <ResponsiveText className="text-muted-foreground">
                      Fostering leadership, confidence, and artistic growth in women of color.
                    </ResponsiveText>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>

        {/* Repertoire and Performances */}
        <div className="container mx-auto px-4 py-16 lg:py-20">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
              <Calendar className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
              <ResponsiveText 
                as="h2" 
                size="3xl" 
                className="font-playfair font-bold text-foreground"
              >
                Repertoire & Performances
              </ResponsiveText>
            </div>
            
            <ResponsiveText 
              size="lg" 
              className="mb-8 text-muted-foreground leading-relaxed"
            >
              Under the direction of Dr. Kevin Phillip Johnson, the Glee Club's repertoire spans 
              classical masterpieces, spirituals, jazz, and contemporary compositions. Our versatile 
              ensemble maintains the highest standards of musical excellence while celebrating the 
              rich cultural heritage of African American music.
            </ResponsiveText>

            <div className="mb-12">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="notable-performances">
                  <AccordionTrigger className="text-lg font-semibold">Notable Performances</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground space-y-2">
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
                  <AccordionTrigger className="text-lg font-semibold">Signature Works</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground space-y-4">
                    <ResponsiveText>Our repertoire encompasses a wide range of musical styles, including:</ResponsiveText>
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
                  <AccordionTrigger className="text-lg font-semibold">Notable Collaborations</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground space-y-4">
                    <ResponsiveText>The Spelman College Glee Club has had the honor of collaborating with:</ResponsiveText>
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

        {/* Director Section */}
        <div className="bg-muted/50 py-16 lg:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-3 mb-8">
                <Users className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                <ResponsiveText 
                  as="h2" 
                  size="3xl" 
                  className="font-playfair font-bold text-foreground"
                >
                  Director
                </ResponsiveText>
              </div>
              
              <Card className="border-none shadow-lg max-w-3xl mx-auto">
                <CardContent className="py-8 px-6 md:px-10">
                  <ResponsiveText 
                    as="h3" 
                    size="2xl" 
                    className="font-bold mb-2 text-primary"
                  >
                    Dr. Kevin Phillip Johnson
                  </ResponsiveText>
                  <ResponsiveText 
                    size="lg" 
                    className="font-medium mb-6 text-muted-foreground"
                  >
                    Director, Spelman College Glee Club
                  </ResponsiveText>
                  <div className="space-y-4 text-muted-foreground">
                    <ResponsiveText>
                      Dr. Kevin Phillip Johnson is an award-winning composer, arranger, and Associate Professor of Music 
                      at Spelman College, where he directs the renowned Spelman College Glee Club. A dynamic educator 
                      and cultural visionary, Dr. Johnson integrates African-American musical traditions with cutting-edge 
                      technology in both performance and pedagogy.
                    </ResponsiveText>
                    <ResponsiveText>
                      His innovative work includes the Hip-Hop Mass, the Black Music Scholar Academy, and original 
                      compositions published through Carl Fischer and Lion & Lamb Publishing. With a creative portfolio 
                      spanning choral music, screenwriting, and product development, Dr. Johnson continues to shape 
                      the future of music education and Black cultural expression.
                    </ResponsiveText>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Join Us CTA */}
        <div className="bg-primary text-primary-foreground py-16 lg:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <ResponsiveText 
                as="h2" 
                size="3xl" 
                className="font-playfair font-bold mb-6"
              >
                Join Our Community
              </ResponsiveText>
              <ResponsiveText 
                size="lg" 
                className="mb-8 text-primary-foreground/90 max-w-2xl mx-auto"
              >
                Whether you're a prospective member, an alumna, or a supporter of choral music, 
                we welcome you to be part of our continuing legacy of excellence.
              </ResponsiveText>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button 
                  size="lg"
                  variant="secondary"
                  onClick={() => navigate("/contact")}
                >
                  Contact Us
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10"
                  onClick={() => navigate("/")}
                >
                  View Performances
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
