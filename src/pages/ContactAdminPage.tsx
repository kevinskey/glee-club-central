
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Mail, Phone, MessageSquare } from 'lucide-react';

const ContactAdminPage = () => {
  return (
    <div className="p-6 space-y-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white font-playfair mb-2">
          Contact Admin
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Get in touch with the Glee Club administrators
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Contact Form */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-900 dark:text-white font-playfair flex items-center">
              <MessageSquare className="mr-3 h-5 w-5 text-[#0072CE]" />
              Send a Message
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-gray-900 dark:text-white">Name</Label>
              <Input id="name" className="mt-1" placeholder="Your full name" />
            </div>
            <div>
              <Label htmlFor="email" className="text-gray-900 dark:text-white">Email</Label>
              <Input id="email" type="email" className="mt-1" placeholder="your.email@example.com" />
            </div>
            <div>
              <Label htmlFor="subject" className="text-gray-900 dark:text-white">Subject</Label>
              <Input id="subject" className="mt-1" placeholder="What's this about?" />
            </div>
            <div>
              <Label htmlFor="message" className="text-gray-900 dark:text-white">Message</Label>
              <Textarea id="message" className="mt-1 min-h-[120px]" placeholder="Tell us how we can help..." />
            </div>
            <Button className="w-full bg-[#0072CE] hover:bg-[#0072CE]/90 text-white">
              Send Message
            </Button>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <div className="space-y-6">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-900 dark:text-white font-playfair flex items-center">
                <Mail className="mr-3 h-5 w-5 text-[#0072CE]" />
                Email Support
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300 mb-2">
                For general inquiries and support:
              </p>
              <a href="mailto:admin@spelmanglee.com" className="text-[#0072CE] hover:underline">
                admin@spelmanglee.com
              </a>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-900 dark:text-white font-playfair flex items-center">
                <Phone className="mr-3 h-5 w-5 text-[#0072CE]" />
                Phone Support
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300 mb-2">
                Office hours: Monday - Friday, 9AM - 5PM EST
              </p>
              <a href="tel:+1-404-555-0123" className="text-[#0072CE] hover:underline">
                (404) 555-0123
              </a>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-900 dark:text-white font-playfair">
                Response Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300">
                We typically respond to all inquiries within 24 hours during business days. For urgent matters, please call our office directly.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ContactAdminPage;
