
import React from 'react';
import { Layout } from '@/components/landing/Layout';

const LandingPage = () => {
  return (
    <Layout>
      <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-16 text-center">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-playfair font-bold mb-6 text-glee-purple">
            Glee Club Central is under construction.
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mt-4 mb-8">
            We're working on building an amazing experience for you. Please check back soon.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default LandingPage;
