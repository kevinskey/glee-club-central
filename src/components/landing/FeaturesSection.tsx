
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Music, Calendar, Users, Book, Mic, Award } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard = ({ icon, title, description }: FeatureCardProps) => {
  return (
    <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-all duration-300 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
      <CardContent className="p-6 flex flex-col items-center text-center">
        <div className="w-12 h-12 flex items-center justify-center rounded-full bg-glee-spelman/10 text-glee-spelman mb-4">
          {icon}
        </div>
        <h3 className="text-xl font-playfair font-bold mb-3">{title}</h3>
        <p className="text-muted-foreground font-inter text-sm md:text-base leading-relaxed text-pretty">{description}</p>
      </CardContent>
    </Card>
  );
};

export function FeaturesSection() {
  const isMobile = useIsMobile();
  
  const features = [
    {
      icon: <Music className="w-6 h-6" />,
      title: "Sheet Music Library",
      description: "Access all sheet music organized by section (S1, S2, A1, A2)"
    },
    {
      icon: <Calendar className="w-6 h-6" />,
      title: "Event Calendar",
      description: "View upcoming performances and rehearsal schedules"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Member Portal",
      description: "Connect with fellow members through our private portal"
    },
    {
      icon: <Book className="w-6 h-6" />,
      title: "Digital Handbook",
      description: "Access the Glee Club handbook anytime, anywhere"
    },
    {
      icon: <Mic className="w-6 h-6" />,
      title: "Practice Resources",
      description: "Upload recordings and practice with helpful tools"
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: "Rich Legacy",
      description: "Explore our century-long history of musical excellence"
    }
  ];
  
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-white to-blue-50 dark:from-glee-dark dark:to-gray-900/90">
      <div className="container px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
