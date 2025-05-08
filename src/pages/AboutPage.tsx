
import React from "react";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header initialShowNewsFeed={false} />
      <main className="flex-1 bg-white dark:bg-gray-950">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <h1 className="font-playfair text-3xl md:text-4xl lg:text-5xl font-bold text-glee-purple mb-6">
              About the Spelman College Glee Club
            </h1>
            
            <div className="prose max-w-none dark:prose-invert">
              <p className="text-lg mb-6 text-gray-700 dark:text-gray-300 leading-relaxed">
                Founded in 1925, the Spelman College Glee Club has maintained a standard of 
                choral excellence for women of African descent for nearly a century. It stands 
                as one of the oldest and most distinguished women's collegiate choral ensembles 
                in the United States.
              </p>
              
              <h2 className="text-2xl font-semibold mb-4 text-glee-purple mt-10">Our Legacy</h2>
              <p className="mb-6 text-gray-700 dark:text-gray-300 leading-relaxed">
                Throughout its illustrious history, the Spelman College Glee Club has performed 
                for diverse audiences across the United States and internationally. Our performances 
                have graced prestigious venues including Carnegie Hall, the Kennedy Center, and 
                Lincoln Center. The Glee Club has also had the honor of performing for several 
                U.S. Presidents and notable dignitaries from around the world.
              </p>
              
              <h2 className="text-2xl font-semibold mb-4 text-glee-purple mt-10">Our Artistry</h2>
              <p className="mb-6 text-gray-700 dark:text-gray-300 leading-relaxed">
                Under the direction of Dr. Kevin Phillip Johnson, the Glee Club's repertoire spans 
                classical masterpieces, spirituals, jazz, and contemporary compositions. Our versatile 
                ensemble maintains the highest standards of musical excellence while celebrating the 
                rich cultural heritage of African American music.
              </p>
              
              <h2 className="text-2xl font-semibold mb-4 text-glee-purple mt-10">Our Mission</h2>
              <p className="mb-6 text-gray-700 dark:text-gray-300 leading-relaxed">
                The Spelman College Glee Club is dedicated to preserving and celebrating the musical 
                heritage of the African diaspora while fostering excellence in choral performance. 
                We strive to provide educational and performance opportunities that empower young 
                women to develop their musical talents and leadership skills.
              </p>
              
              <h2 className="text-2xl font-semibold mb-4 text-glee-purple mt-10">Join Us</h2>
              <p className="mb-6 text-gray-700 dark:text-gray-300 leading-relaxed">
                We invite you to experience the beauty and power of the Spelman College Glee Club 
                through our performances and recordings. Whether you're a prospective member, 
                an alumna, or a supporter of choral music, we welcome you to be part of our 
                continuing legacy of excellence.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
