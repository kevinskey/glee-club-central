
import React from "react";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AtSign, MapPin, Phone } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header initialShowNewsFeed={false} />
      <main className="flex-1 bg-white dark:bg-gray-950">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <h1 className="font-playfair text-3xl md:text-4xl lg:text-5xl font-bold text-glee-purple mb-6">
              Contact Us
            </h1>
            <p className="text-lg mb-8 text-gray-700 dark:text-gray-300">
              We'd love to hear from you. Whether you have questions about upcoming performances, 
              membership, or would like to support the Glee Club, please don't hesitate to reach out.
            </p>
            
            <div className="grid gap-8 md:grid-cols-2">
              <div>
                <h2 className="text-xl font-semibold mb-4">Send Us a Message</h2>
                <form className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-1">Your Name</label>
                    <Input 
                      id="name"
                      placeholder="Enter your name"
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-1">Your Email</label>
                    <Input 
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium mb-1">Subject</label>
                    <Input 
                      id="subject"
                      placeholder="What is your message about?"
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium mb-1">Message</label>
                    <Textarea 
                      id="message"
                      placeholder="Your message..."
                      className="w-full min-h-[150px]"
                    />
                  </div>
                  <Button 
                    type="submit"
                    className="bg-glee-purple hover:bg-glee-purple/90 text-white"
                  >
                    Send Message
                  </Button>
                </form>
              </div>
              
              <div>
                <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
                <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg space-y-6">
                  <div className="flex gap-4">
                    <MapPin className="h-5 w-5 text-glee-purple shrink-0 mt-1" />
                    <div>
                      <p className="font-medium">Spelman College Glee Club</p>
                      <p className="text-gray-600 dark:text-gray-400">350 Spelman Ln SW</p>
                      <p className="text-gray-600 dark:text-gray-400">Atlanta, GA 30314</p>
                      <p className="text-gray-600 dark:text-gray-400">United States</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <Phone className="h-5 w-5 text-glee-purple shrink-0 mt-1" />
                    <div>
                      <p className="font-medium">Phone</p>
                      <p className="text-gray-600 dark:text-gray-400">(404) 555-1234</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <AtSign className="h-5 w-5 text-glee-purple shrink-0 mt-1" />
                    <div>
                      <p className="font-medium">Email</p>
                      <p className="text-gray-600 dark:text-gray-400">gleeclub@spelman.edu</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8">
                  <h2 className="text-xl font-semibold mb-4">Office Hours</h2>
                  <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg">
                    <p className="font-medium mb-2">During Academic Year</p>
                    <p className="text-gray-600 dark:text-gray-400">Monday - Friday: 9:00 AM - 5:00 PM</p>
                    <p className="text-gray-600 dark:text-gray-400">Saturday - Sunday: Closed</p>
                    
                    <p className="font-medium mb-2 mt-4">Summer Hours</p>
                    <p className="text-gray-600 dark:text-gray-400">Monday - Thursday: 9:00 AM - 4:00 PM</p>
                    <p className="text-gray-600 dark:text-gray-400">Friday - Sunday: Closed</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
