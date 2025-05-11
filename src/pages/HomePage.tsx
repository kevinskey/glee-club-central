
import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">Spelman College Glee Club</h1>
      <p className="text-xl mb-6">Welcome to the central hub for the Spelman College Glee Club.</p>
      
      <div className="mt-8">
        <Link 
          to="/login" 
          className="px-4 py-2 bg-glee-purple text-white rounded-md hover:bg-glee-purple/90 transition"
        >
          Member Login
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
