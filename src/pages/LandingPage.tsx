
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Music, FileText, Calendar, Headphones, Mic } from "lucide-react";

export default function LandingPage() {
  const navigate = useNavigate();
  
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Music className="h-5 w-5 text-glee-purple" />
            <span className="font-playfair text-lg font-semibold text-glee-purple">
              Glee World
            </span>
          </div>
          <Button onClick={() => navigate("/login")}>Login</Button>
        </div>
      </header>

      {/* Hero section */}
      <section className="relative flex flex-1 flex-col items-center justify-center bg-gradient-to-b from-background to-accent px-4 py-20 text-center">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-10"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80')",
          }}
        ></div>
        <div className="relative container mx-auto max-w-3xl">
          <h1 className="mb-4 font-playfair text-4xl font-bold leading-tight tracking-tighter sm:text-5xl md:text-6xl">
            Welcome to{" "}
            <span className="bg-gradient-to-r from-glee-purple to-glee-gold bg-clip-text text-transparent">
              Glee World
            </span>
          </h1>
          <p className="mb-8 max-w-2xl text-xl text-muted-foreground md:text-2xl">
            The digital hub for our college choir. Access sheet music, submit recordings, pay dues, and more.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              size="lg"
              className="bg-glee-purple hover:bg-glee-purple/90"
              onClick={() => navigate("/login")}
            >
              Login to Your Account
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate("/login")}
            >
              New Member? Login Here
            </Button>
          </div>
        </div>
      </section>

      {/* Features section */}
      <section className="bg-white py-16 dark:bg-gray-900">
        <div className="container">
          <h2 className="mb-12 text-center font-playfair text-3xl font-bold">
            Everything You Need in One Place
          </h2>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 rounded-full bg-glee-purple/10 p-3">
                <FileText className="h-6 w-6 text-glee-purple" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">Sheet Music</h3>
              <p className="text-muted-foreground">
                Access all your music by voice part
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 rounded-full bg-glee-purple/10 p-3">
                <Calendar className="h-6 w-6 text-glee-purple" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">Schedule</h3>
              <p className="text-muted-foreground">
                Never miss rehearsals or performances
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 rounded-full bg-glee-purple/10 p-3">
                <Headphones className="h-6 w-6 text-glee-purple" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">Practice Media</h3>
              <p className="text-muted-foreground">
                Warm-ups and sectionals at your fingertips
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 rounded-full bg-glee-purple/10 p-3">
                <Mic className="h-6 w-6 text-glee-purple" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">Recordings</h3>
              <p className="text-muted-foreground">
                Submit your vocal recordings with ease
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-6">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2 text-glee-purple">
            <Music className="h-5 w-5" />
            <span className="font-playfair text-lg font-semibold">
              Glee World
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Glee World. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
