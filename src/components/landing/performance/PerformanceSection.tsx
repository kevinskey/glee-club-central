
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Music, Calendar, Users, Award } from 'lucide-react';
import { Link } from 'react-router-dom';

// Sample performance data since calendar functionality is removed
const upcomingPerformances = [
  {
    id: '1',
    title: 'Spring Gala Concert',
    date: '2024-04-15',
    venue: 'Sisters Chapel, Spelman College',
    description: 'Our signature spring performance featuring classical and contemporary works.'
  },
  {
    id: '2',
    title: 'Community Outreach Concert',
    date: '2024-05-20',
    venue: 'Atlanta Symphony Hall',
    description: 'Special community performance in partnership with local arts organizations.'
  }
];

const stats = [
  {
    icon: <Users className="h-8 w-8 text-glee-purple" />,
    value: '45+',
    label: 'Active Members'
  },
  {
    icon: <Calendar className="h-8 w-8 text-glee-spelman" />,
    value: '143',
    label: 'Years of Excellence'
  },
  {
    icon: <Music className="h-8 w-8 text-glee-purple" />,
    value: '20+',
    label: 'Annual Performances'
  },
  {
    icon: <Award className="h-8 w-8 text-glee-spelman" />,
    value: '50+',
    label: 'Awards & Honors'
  }
];

export function PerformanceSection() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="flex justify-center mb-3">
                {stat.icon}
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {stat.value}
              </div>
              <div className="text-gray-600">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Upcoming Performances */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-glee-purple mb-4">
            Upcoming Performances
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Experience the artistry and excellence of the Spelman College Glee Club
          </p>
        </div>

        {/* Horizontal Scrolling Performance Cards */}
        <div className="mb-12">
          <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory touch-pan-x">
            {upcomingPerformances.map((performance) => (
              <Card 
                key={performance.id} 
                className="flex-shrink-0 w-80 md:w-96 overflow-hidden hover:shadow-lg transition-shadow snap-start"
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-glee-purple mb-2">
                        {performance.title}
                      </h3>
                      <div className="text-glee-spelman font-medium mb-1">
                        {new Date(performance.date).toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </div>
                      <div className="text-gray-600 mb-3">
                        {performance.venue}
                      </div>
                    </div>
                    <Music className="h-8 w-8 text-glee-purple/30 flex-shrink-0" />
                  </div>
                  <p className="text-gray-700 mb-4">
                    {performance.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="text-center">
          <Link to="/contact">
            <Button size="lg" className="bg-glee-spelman hover:bg-glee-spelman/90">
              Get Performance Updates
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
