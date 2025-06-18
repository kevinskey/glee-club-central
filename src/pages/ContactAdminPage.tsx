
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Mail, Phone, MessageSquare } from 'lucide-react';

const ContactAdminPage = () => {
  return (
    <div className="w-full px-2 sm:px-3 md:px-4 lg:px-6 py-6 space-y-8">
      <div className="glass-card p-4 sm:p-6 rounded-2xl animate-glass-fade-in">
        <h1 className="text-display bg-gradient-to-r from-[#0072CE] to-[#0072CE]/80 bg-clip-text text-transparent font-playfair">
          Contact Admin
        </h1>
        <p className="text-subhead text-muted-foreground mt-2">
          Get in touch with the Glee Club administrators
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Contact Form */}
        <Card className="glass-card rounded-2xl border-white/20 animate-glass-scale">
          <CardHeader>
            <CardTitle className="text-subhead font-playfair text-foreground flex items-center">
              <MessageSquare className="mr-3 h-5 w-5 text-[#0072CE]" />
              Send a Message
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-body text-foreground">Name</Label>
              <Input id="name" className="glass-input mt-1" placeholder="Your full name" />
            </div>
            <div>
              <Label htmlFor="email" className="text-body text-foreground">Email</Label>
              <Input id="email" type="email" className="glass-input mt-1" placeholder="your.email@example.com" />
            </div>
            <div>
              <Label htmlFor="subject" className="text-body text-foreground">Subject</Label>
              <Input id="subject" className="glass-input mt-1" placeholder="What's this about?" />
            </div>
            <div>
              <Label htmlFor="message" className="text-body text-foreground">Message</Label>
              <Textarea id="message" className="glass-input mt-1 min-h-[120px]" placeholder="Tell us how we can help..." />
            </div>
            <Button className="w-full glass-button-primary rounded-xl">
              Send Message
            </Button>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <div className="space-y-6">
          <Card className="glass-card rounded-2xl border-white/20 animate-glass-scale" style={{ animationDelay: '100ms' }}>
            <CardHeader>
              <CardTitle className="text-subhead font-playfair text-foreground flex items-center">
                <Mail className="mr-3 h-5 w-5 text-[#0072CE]" />
                Email Support
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-body text-muted-foreground mb-2">
                For general inquiries and support:
              </p>
              <a href="mailto:admin@spelmanglee.com" className="text-body text-[#0072CE] hover:underline">
                admin@spelmanglee.com
              </a>
            </CardContent>
          </Card>

          <Card className="glass-card rounded-2xl border-white/20 animate-glass-scale" style={{ animationDelay: '200ms' }}>
            <CardHeader>
              <CardTitle className="text-subhead font-playfair text-foreground flex items-center">
                <Phone className="mr-3 h-5 w-5 text-[#0072CE]" />
                Phone Support
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-body text-muted-foreground mb-2">
                Office hours: Monday - Friday, 9AM - 5PM EST
              </p>
              <a href="tel:+1-404-555-0123" className="text-body text-[#0072CE] hover:underline">
                (404) 555-0123
              </a>
            </CardContent>
          </Card>

          <Card className="glass-card rounded-2xl border-white/20 animate-glass-scale" style={{ animationDelay: '300ms' }}>
            <CardHeader>
              <CardTitle className="text-subhead font-playfair text-foreground">
                Response Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-body text-muted-foreground">
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
