
import React from "react";
import { Footer } from "@/components/landing/Footer";
import { PageHeaderWithToggle } from "@/components/ui/page-header-with-toggle";
import { FileText } from "lucide-react";

const TermsOfServicePage = () => {
  return (
    <div className="bg-background min-h-screen flex flex-col">
      <main className="flex-1">
        <div className="container max-w-4xl px-4 py-8 md:py-12">
          <PageHeaderWithToggle
            title="Terms of Service"
            icon={<FileText className="h-6 w-6" />}
            description="Last updated: May 12, 2025"
          />
          
          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none mt-8 bg-card rounded-lg p-6 md:p-8 shadow-sm border">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-foreground">Introduction</h2>
              <p className="text-muted-foreground paragraph-spacing">
                Welcome to Glee World, the official platform of Spelman College Glee Club. These Terms of Service 
                ("Terms") govern your use of our website, mobile application, and services (collectively, the 
                "Service") operated by Spelman College Glee Club ("we", "us", or "our").
              </p>
              <p className="text-muted-foreground paragraph-spacing">
                By accessing or using the Service, you agree to be bound by these Terms. If you disagree with 
                any part of the Terms, then you may not access the Service.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-foreground">Use of the Service</h2>
              <p className="text-muted-foreground paragraph-spacing">
                Glee World provides a platform for Spelman College Glee Club members and supporters to access 
                information, resources, and communicate with one another. The Service is intended to be used for 
                lawful purposes and in accordance with these Terms.
              </p>
              
              <h3 className="text-xl font-semibold mt-6 mb-3 text-foreground">Public Access and Member Access</h3>
              <p className="text-muted-foreground paragraph-spacing">
                Portions of our Service are publicly accessible without registration. Other features and 
                functionalities require member authentication and are exclusively available to current Spelman 
                College Glee Club members, faculty, or designated administrators.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-foreground">User Accounts</h2>
              <p className="text-muted-foreground paragraph-spacing">
                When you create an account with us, you must provide accurate, complete, and up-to-date information. 
                Failure to do so constitutes a breach of the Terms and may result in immediate termination of your account.
              </p>
              <p className="text-muted-foreground paragraph-spacing">
                You are responsible for safeguarding the password that you use to access the Service and for any 
                activities or actions under your password, whether your password is with our Service or a third-party service.
              </p>
              <p className="text-muted-foreground paragraph-spacing">
                You agree not to disclose your password to any third party. You must notify us immediately upon 
                becoming aware of any breach of security or unauthorized use of your account.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-foreground">Intellectual Property</h2>
              <p className="text-muted-foreground paragraph-spacing">
                The Service and its original content, features, and functionality are and will remain the exclusive 
                property of Spelman College Glee Club and its licensors. The Service is protected by copyright, 
                trademark, and other laws of both the United States and foreign countries.
              </p>
              <p className="text-muted-foreground paragraph-spacing">
                Our trademarks and trade dress may not be used in connection with any product or service without 
                the prior written consent of Spelman College Glee Club.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-foreground">Content Usage and Copyright</h2>
              <p className="text-muted-foreground paragraph-spacing">
                Sheet music, recordings, and other materials provided through the Service are for personal, 
                non-commercial use by authorized members only. These materials may be protected by copyright and 
                other intellectual property laws.
              </p>
              <p className="text-muted-foreground paragraph-spacing">
                You may not distribute, modify, transmit, reuse, download, repost, copy, or use said content, 
                whether in whole or in part, for commercial purposes or for personal gain, without express 
                advance written permission from us.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-foreground">Termination</h2>
              <p className="text-muted-foreground paragraph-spacing">
                We may terminate or suspend your account immediately, without prior notice or liability, for any reason, 
                including without limitation if you breach the Terms.
              </p>
              <p className="text-muted-foreground paragraph-spacing">
                Upon termination, your right to use the Service will immediately cease. If you wish to terminate 
                your account, you may simply discontinue using the Service, or notify us that you wish to delete your account.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-foreground">Changes</h2>
              <p className="text-muted-foreground paragraph-spacing">
                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a 
                revision is material we will try to provide at least 30 days' notice prior to any new terms taking effect.
              </p>
              <p className="text-muted-foreground paragraph-spacing">
                By continuing to access or use our Service after those revisions become effective, you agree to 
                be bound by the revised terms. If you do not agree to the new terms, please stop using the Service.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-foreground">Contact Us</h2>
              <p className="text-muted-foreground paragraph-spacing">
                If you have any questions about these Terms, please contact us:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2 text-muted-foreground">
                <li>By email: gleeclub@spelman.edu</li>
                <li>By phone: (404) 555-0123</li>
              </ul>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TermsOfServicePage;
