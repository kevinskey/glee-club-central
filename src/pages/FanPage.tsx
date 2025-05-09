
import React from "react";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";

export default function FanPage() {
  const navigate = useNavigate();
  
  // Function to navigate to calendar page
  const handleViewCalendar = () => {
    navigate('/calendar');
  };
  
  return (
    <div className="flex min-h-screen flex-col">
      <Header initialShowNewsFeed={false} />
      <main className="flex-1 bg-white dark:bg-gray-950">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <h1 className="font-playfair text-3xl md:text-4xl lg:text-5xl font-bold text-glee-purple mb-6">
              Fan Portal
            </h1>
            <p className="text-lg mb-8 text-gray-700 dark:text-gray-300">
              Welcome to the Spelman College Glee Club fan portal. Here you can find information about upcoming performances, our history, and more.
            </p>
            
            <div className="grid gap-8 md:grid-cols-2">
              <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-glee-purple" />
                  Upcoming Performances
                </h2>
                <ul className="space-y-4">
                  <li className="border-b pb-2">
                    <p className="font-medium">Spring Concert</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">May 15, 2025 - Sisters Chapel</p>
                  </li>
                  <li className="border-b pb-2">
                    <p className="font-medium">Summer Tour - New York</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">June 10, 2025 - Carnegie Hall</p>
                  </li>
                  <li>
                    <p className="font-medium">Atlanta Music Festival</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">July 22, 2025 - Fox Theatre</p>
                  </li>
                </ul>
                <div className="mt-4">
                  <Button 
                    onClick={handleViewCalendar}
                    className="bg-glee-purple hover:bg-glee-purple/90 text-white w-full"
                  >
                    View Full Calendar
                  </Button>
                </div>
              </div>
              
              <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg">
                <h2 className="text-xl font-semibold mb-4">Join Our Mailing List</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Stay updated with our latest concerts, tours, and releases.
                </p>
                <form className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-1">Name</label>
                    <input 
                      type="text" 
                      id="name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
                    <input 
                      type="email" 
                      id="email"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="your.email@example.com"
                    />
                  </div>
                  <button 
                    type="submit"
                    className="bg-glee-purple hover:bg-glee-purple/90 text-white px-4 py-2 rounded-md"
                  >
                    Subscribe
                  </button>
                </form>
              </div>
            </div>
            
            <div className="mt-12">
              <h2 className="text-2xl font-semibold mb-6">About the Glee Club</h2>
              <div className="prose max-w-none dark:prose-invert">
                <p>
                  The Spelman College Glee Club, founded in 1925, has maintained a standard of choral excellence for women of African descent for over 95 years. It's one of the oldest and most distinguished women's collegiate choral ensembles in the country.
                </p>
                <p className="mt-4">
                  Under the direction of Dr. Kevin Phillip Johnson, the Glee Club's repertoire spans from classical masterpieces to spirituals, jazz, and contemporary compositions. The ensemble has performed in prestigious venues around the world and collaborated with numerous symphony orchestras.
                </p>
                <p className="mt-4">
                  Through its performances, the Spelman College Glee Club continues to uplift and inspire audiences while preserving and celebrating the rich musical heritage of the African diaspora.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
