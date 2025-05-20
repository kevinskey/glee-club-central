
import React from 'react';
import { Layout } from "@/components/landing/Layout";
import { Header } from "@/components/landing/Header";

const HomeTemp = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 p-6">
        <Layout>
          <h1 className="text-3xl font-bold text-center my-8">Welcome to GleeWorld</h1>
          <p className="text-center text-lg mb-6">
            The central hub for Spelman College Glee Club
          </p>
        </Layout>
      </main>
    </div>
  );
};

export default HomeTemp;
