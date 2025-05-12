
import React from "react";
import { Footer } from "@/components/landing/Footer";

const PrivacyPolicyPage = () => {
  return (
    <div className="bg-background min-h-screen flex flex-col">
      <main className="flex-1">
        <div className="container max-w-4xl px-4 py-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-6">Privacy Policy</h1>
          
          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
            <p className="text-lg mb-6">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
              <p>
                Spelman College Glee Club ("we", "our", or "us") operates the Glee World website and app (the "Service"). 
                This page informs you of our policies regarding the collection, use, and disclosure of personal data when 
                you use our Service and the choices you have associated with that data.
              </p>
              <p>
                We use your data to provide and improve the Service. By using the Service, you agree to the collection 
                and use of information in accordance with this policy.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Information Collection and Use</h2>
              <p>
                We collect several different types of information for various purposes to provide and improve our Service to you.
              </p>
              
              <h3 className="text-xl font-semibold mt-4 mb-2">Types of Data Collected</h3>
              
              <h4 className="text-lg font-medium mt-3 mb-1">Personal Data</h4>
              <p>
                While using our Service, we may ask you to provide us with certain personally identifiable information 
                that can be used to contact or identify you ("Personal Data"). Personally identifiable information may include, but is not limited to:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Name</li>
                <li>Email address</li>
                <li>Phone number</li>
                <li>Educational information</li>
                <li>Student ID</li>
                <li>Cookies and Usage Data</li>
              </ul>
              
              <h4 className="text-lg font-medium mt-3 mb-1">Usage Data</h4>
              <p>
                We may also collect information on how the Service is accessed and used ("Usage Data"). This Usage Data 
                may include information such as your computer's Internet Protocol address (e.g. IP address), browser type, 
                browser version, the pages of our Service that you visit, the time and date of your visit, the time spent on 
                those pages, unique device identifiers and other diagnostic data.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Use of Data</h2>
              <p>Spelman College Glee Club uses the collected data for various purposes:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>To provide and maintain our Service</li>
                <li>To notify you about changes to our Service</li>
                <li>To allow you to participate in interactive features of our Service when you choose to do so</li>
                <li>To provide member support</li>
                <li>To gather analysis or valuable information so that we can improve our Service</li>
                <li>To monitor the usage of our Service</li>
                <li>To detect, prevent and address technical issues</li>
              </ul>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Data Security</h2>
              <p>
                The security of your data is important to us, but remember that no method of transmission over the Internet, 
                or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to 
                protect your Personal Data, we cannot guarantee its absolute security.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Changes to This Privacy Policy</h2>
              <p>
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new 
                Privacy Policy on this page.
              </p>
              <p>
                We will let you know via email and/or a prominent notice on our Service, prior to the change becoming 
                effective and update the "effective date" at the top of this Privacy Policy.
              </p>
              <p>
                You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy 
                are effective when they are posted on this page.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy, please contact us:
              </p>
              <ul className="list-disc pl-6 mb-4">
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

export default PrivacyPolicyPage;
