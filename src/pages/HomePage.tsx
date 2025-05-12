
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Music, Calendar, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-cover bg-center flex flex-col"
         style={{ backgroundImage: "url('/lovable-uploads/b57ced8e-7ed7-405b-8302-41ab726303af.png')" }}>
      {/* Semi-transparent overlay */}
      <div className="absolute inset-0 bg-black/70 z-0"></div>
      
      <div className="container mx-auto px-4 py-12 z-10 relative flex-1 flex flex-col">
        <header className="mb-8">
          <nav className="flex justify-between items-center">
            <div className="text-white font-bold text-xl">Glee World</div>
            <div className="space-x-2">
              <Button variant="outline" className="text-white border-white hover:bg-white/20">
                <Link to="/about">About</Link>
              </Button>
              <Button variant="outline" className="text-white border-white hover:bg-white/20">
                <Link to="/contact">Contact</Link>
              </Button>
            </div>
          </nav>
        </header>
        
        <main className="flex-1 flex flex-col items-center justify-center text-white">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Spelman College Glee Club
            </h1>
            <p className="text-xl mb-8 text-white/80">
              Welcome to the central digital hub for the Spelman College Glee Club. 
              Manage sheet music, attendance, calendar events, and more in one seamless platform.
            </p>
            
            <div className="flex flex-wrap gap-4 justify-center mb-12">
              <Button 
                size="lg"
                className="bg-glee-purple hover:bg-glee-purple/90"
              >
                <Link to="/login" className="flex items-center gap-2">
                  Member Login <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button 
                variant="outline"
                size="lg" 
                className="text-white border-white hover:bg-white/20"
              >
                <Link to="/register">New Member Registration</Link>
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl mt-8">
            <Card className="bg-white/10 backdrop-blur border-none text-white">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <Music className="h-12 w-12 mb-4 text-glee-purple" />
                <h3 className="text-xl font-bold mb-2">Sheet Music</h3>
                <p className="text-white/80">Access your sheet music library organized by section</p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/10 backdrop-blur border-none text-white">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <Calendar className="h-12 w-12 mb-4 text-glee-purple" />
                <h3 className="text-xl font-bold mb-2">Events</h3>
                <p className="text-white/80">Track rehearsals and performances in one place</p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/10 backdrop-blur border-none text-white">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <Users className="h-12 w-12 mb-4 text-glee-purple" />
                <h3 className="text-xl font-bold mb-2">Members</h3>
                <p className="text-white/80">Connect with other members of the Glee Club</p>
              </CardContent>
            </Card>
          </div>
        </main>
        
        <footer className="mt-12 text-white/70 text-center text-sm">
          <p>© {new Date().getFullYear()} Spelman College Glee Club. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default HomePage;
