
import React from "react";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ChevronRight, FileText, Users, Calendar, Music, Headphones } from "lucide-react";

export default function AdministrationPage() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-white dark:bg-gray-950">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <h1 className="font-playfair text-3xl md:text-4xl lg:text-5xl font-bold text-glee-purple mb-6">
              Administration
            </h1>
            <p className="text-lg mb-8 text-gray-700 dark:text-gray-300">
              Welcome to the administration portal for the Spelman College Glee Club. Please log in 
              to access administrative tools and resources.
            </p>
            
            <div className="mb-10 p-6 bg-glee-purple/10 rounded-lg border border-glee-purple/20">
              <h2 className="text-xl font-semibold mb-3">Administrator Access</h2>
              <p className="mb-4">
                This area is restricted to authorized club administrators and faculty. If you're an 
                administrator or faculty member, please log in to access management tools.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button 
                  onClick={() => navigate("/login")}
                  className="bg-glee-purple hover:bg-glee-purple/90 text-white"
                >
                  Log In to Admin Portal
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => navigate("/dashboard/members")}
                  className="border-glee-purple text-glee-purple hover:bg-glee-purple/10"
                >
                  <Users className="mr-2 h-4 w-4" /> View Members
                </Button>
              </div>
            </div>
            
            <h2 className="text-xl font-semibold mb-4">Administration Features</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-glee-purple" />
                    Member Management
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Manage member profiles, section assignments, attendance records, and contact information.
                  </p>
                  <Button variant="outline" className="w-full" onClick={() => navigate("/dashboard/members")}>
                    Access <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-glee-purple" />
                    Event Scheduling
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Create and manage rehearsals, performances, tours, and other club events.
                  </p>
                  <Button variant="outline" className="w-full" onClick={() => navigate("/login")}>
                    Access <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Music className="h-5 w-5 text-glee-purple" />
                    Repertoire Library
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Manage sheet music, organize by section, and upload new scores for member access.
                  </p>
                  <Button variant="outline" className="w-full" onClick={() => navigate("/login")}>
                    Access <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Headphones className="h-5 w-5 text-glee-purple" />
                    Media Resources
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Upload and manage recordings, practice tracks, and performance videos.
                  </p>
                  <Button variant="outline" className="w-full" onClick={() => navigate("/login")}>
                    Access <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-glee-purple" />
                    Forms & Documentation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Access administrative forms, handbook documents, and other important club paperwork.
                  </p>
                  <Button variant="outline" className="w-full" onClick={() => navigate("/login")}>
                    Access <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
