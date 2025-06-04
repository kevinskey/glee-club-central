
import React, { useState } from "react";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AtSign, MapPin, Phone, Send, Check } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { useMessaging } from "@/hooks/useMessaging";
import { toast } from "sonner";

// Define form schema
const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  subject: z.string().min(3, "Subject must be at least 3 characters"),
  message: z.string().min(10, "Message must be at least 10 characters")
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { sendEmail } = useMessaging();
  
  // Define contact information
  const contactInfo = {
    address: {
      name: "Dr. Kevin P. Johnson",
      title: "Spelman College Glee Club",
      street: "350 Spelman Lane SW",
      box: "Box 312",
      city: "Atlanta",
      state: "GA",
      zip: "30314",
      country: "United States"
    },
    phone: "404-270-5480",
    email: "kjohns10@spelman.edu",
    hours: {
      academic: {
        weekdays: "Monday - Friday: 9:00 AM - 5:00 PM",
        weekend: "Saturday - Sunday: Closed"
      },
      summer: {
        weekdays: "Monday - Thursday: 9:00 AM - 4:00 PM",
        weekend: "Friday - Sunday: Closed"
      }
    }
  };
  
  // Initialize form
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: ""
    }
  });
  
  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);
    
    try {
      // Send email to the Glee Club
      await sendEmail(
        contactInfo.email,
        `Contact Form Submission: ${data.subject}`,
        `
          <h2>New Contact Form Submission</h2>
          <p><strong>From:</strong> ${data.name} (${data.email})</p>
          <p><strong>Subject:</strong> ${data.subject}</p>
          <h3>Message:</h3>
          <p>${data.message.replace(/\n/g, '<br>')}</p>
        `
      );
      
      // Send confirmation to the user
      await sendEmail(
        data.email,
        "Thank you for contacting the Spelman College Glee Club",
        `
          <h2>Thank you for contacting us!</h2>
          <p>Dear ${data.name},</p>
          <p>We have received your message and will get back to you as soon as possible.</p>
          <p>Your inquiry details:</p>
          <ul>
            <li><strong>Subject:</strong> ${data.subject}</li>
            <li><strong>Message:</strong> ${data.message.replace(/\n/g, '<br>')}</li>
          </ul>
          <p>Best regards,<br>The Spelman College Glee Club</p>
        `
      );
      
      toast.success("Your message has been sent", {
        description: "We will respond to you as soon as possible."
      });
      
      setSubmitted(true);
      form.reset();
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message", {
        description: "Please try again or contact us directly at kjohns10@spelman.edu"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-background min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="container max-w-4xl px-4 py-8 md:py-12">
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
              
              {submitted ? (
                <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg text-center">
                  <div className="mx-auto w-12 h-12 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center mb-4">
                    <Check className="h-6 w-6 text-green-600 dark:text-green-300" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">Message Sent Successfully!</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Thank you for reaching out to us. We'll get back to you as soon as possible.
                  </p>
                  <Button 
                    variant="outline"
                    onClick={() => setSubmitted(false)}
                    className="bg-white dark:bg-gray-800"
                  >
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Your Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Your Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="Enter your email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Subject</FormLabel>
                          <FormControl>
                            <Input placeholder="What is your message about?" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Message</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Your message..." 
                              className="min-h-[150px]" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button 
                      type="submit"
                      className="bg-glee-purple hover:bg-glee-purple/90 text-white"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <span className="mr-2">Sending...</span>
                          <span className="animate-spin">⏳</span>
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              )}
            </div>
            
            <div>
              <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
              <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg flex flex-col items-center text-center space-y-6">
                <div className="flex flex-col items-center">
                  <MapPin className="h-5 w-5 text-glee-purple mb-2" />
                  <div>
                    <p className="font-medium">{contactInfo.address.name}</p>
                    <p className="text-gray-600 dark:text-gray-400">{contactInfo.address.title}</p>
                    <p className="text-gray-600 dark:text-gray-400">{contactInfo.address.street}</p>
                    <p className="text-gray-600 dark:text-gray-400">{contactInfo.address.box}</p>
                    <p className="text-gray-600 dark:text-gray-400">
                      {contactInfo.address.city}, {contactInfo.address.state} {contactInfo.address.zip}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">{contactInfo.address.country}</p>
                  </div>
                </div>
                
                <div className="flex flex-col items-center">
                  <Phone className="h-5 w-5 text-glee-purple mb-2" />
                  <div>
                    <p className="font-medium">Phone</p>
                    <p className="text-gray-600 dark:text-gray-400">{contactInfo.phone}</p>
                  </div>
                </div>
                
                <div className="flex flex-col items-center">
                  <AtSign className="h-5 w-5 text-glee-purple mb-2" />
                  <div>
                    <p className="font-medium">Email</p>
                    <a 
                      href={`mailto:${contactInfo.email}`}
                      className="text-gray-600 dark:text-gray-400 hover:text-glee-purple dark:hover:text-glee-accent"
                    >
                      {contactInfo.email}
                    </a>
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4">Office Hours</h2>
                <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg text-center">
                  <p className="font-medium mb-2">During Academic Year</p>
                  <p className="text-gray-600 dark:text-gray-400">{contactInfo.hours.academic.weekdays}</p>
                  <p className="text-gray-600 dark:text-gray-400">{contactInfo.hours.academic.weekend}</p>
                  
                  <p className="font-medium mb-2 mt-4">Summer Hours</p>
                  <p className="text-gray-600 dark:text-gray-400">{contactInfo.hours.summer.weekdays}</p>
                  <p className="text-gray-600 dark:text-gray-400">{contactInfo.hours.summer.weekend}</p>
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
