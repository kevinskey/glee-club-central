
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function ContactSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50 dark:bg-gray-900">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Contact Us</h2>
            <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Want to learn more about the Spelman College Glee Club? Get in touch with us.
            </p>
          </div>
        </div>
        <div className="mx-auto max-w-md space-y-4 mt-8">
          <form className="space-y-4">
            <div className="space-y-2">
              <Input placeholder="Your Name" />
            </div>
            <div className="space-y-2">
              <Input type="email" placeholder="Email Address" />
            </div>
            <div className="space-y-2">
              <Textarea placeholder="Your Message" />
            </div>
            <Button type="submit" className="w-full bg-glee-purple hover:bg-glee-purple/90">
              Send Message
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
