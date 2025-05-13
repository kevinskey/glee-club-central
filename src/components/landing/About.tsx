
import React from 'react';

export function About() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">About Us</h2>
            <p className="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              The Spelman College Glee Club has maintained a standard of musical excellence and choral perfection 
              while sharing its musical talents with the greater Atlanta community and audiences around the world.
            </p>
            <p className="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Founded in 1925, the Spelman College Glee Club has a long tradition of performing a wide range 
              of choral literature from traditional classical repertoire to spirituals, jazz and contemporary works.
            </p>
          </div>
          <div className="flex items-center justify-center">
            <div className="w-full h-full bg-gray-200 rounded-md overflow-hidden">
              {/* Placeholder for image */}
              <div className="w-full h-80 flex items-center justify-center text-gray-500">
                Glee Club Image
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
