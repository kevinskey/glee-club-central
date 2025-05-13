
import React from 'react';

export function Features() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50 dark:bg-gray-900">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Features</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              The Spelman College Glee Club provides a wide range of opportunities for growth and excellence
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-8">
          {/* Feature cards would go here */}
          <div className="flex flex-col items-center space-y-2 p-4 border rounded-lg bg-white dark:bg-gray-850">
            <div className="rounded-full bg-glee-purple p-2 text-white">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18V5l12-2v13" />
                <circle cx="6" cy="18" r="3" />
                <circle cx="18" cy="16" r="3" />
              </svg>
            </div>
            <h3 className="text-xl font-bold">Musical Excellence</h3>
            <p className="text-muted-foreground text-sm">
              Perform a diverse repertoire from classical to spirituals to contemporary works
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
