
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock } from "lucide-react";
import { format } from 'date-fns';

interface SpelmanAcademicDate {
  id: string;
  title: string;
  date: Date;
  description: string;
  category: 'orientation' | 'registration' | 'classes' | 'exams' | 'holiday' | 'break' | 'deadline' | 'special';
  imageUrl: string;
}

interface SpelmanDateCardProps {
  spelmanDate: SpelmanAcademicDate;
}

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'holiday':
      return 'from-red-50 via-white to-blue-50 border-red-300';
    case 'orientation':
      return 'from-purple-50 via-white to-purple-50 border-purple-300';
    case 'registration':
      return 'from-orange-50 via-white to-orange-50 border-orange-300';
    case 'classes':
      return 'from-green-50 via-white to-green-50 border-green-300';
    case 'exams':
      return 'from-blue-50 via-white to-blue-50 border-blue-300';
    case 'break':
      return 'from-yellow-50 via-white to-yellow-50 border-yellow-300';
    case 'deadline':
      return 'from-red-50 via-white to-red-50 border-red-400';
    case 'special':
      return 'from-indigo-50 via-white to-indigo-50 border-indigo-300';
    default:
      return 'from-gray-50 via-white to-gray-50 border-gray-300';
  }
};

const getCategoryTextColor = (category: string) => {
  switch (category) {
    case 'holiday':
      return 'text-red-800';
    case 'orientation':
      return 'text-purple-800';
    case 'registration':
      return 'text-orange-800';
    case 'classes':
      return 'text-green-800';
    case 'exams':
      return 'text-blue-800';
    case 'break':
      return 'text-yellow-800';
    case 'deadline':
      return 'text-red-900';
    case 'special':
      return 'text-indigo-800';
    default:
      return 'text-gray-800';
  }
};

export const SpelmanDateCard: React.FC<SpelmanDateCardProps> = ({ spelmanDate }) => {
  const categoryColorClass = getCategoryColor(spelmanDate.category);
  const textColorClass = getCategoryTextColor(spelmanDate.category);

  return (
    <Card className={`shadow-md bg-gradient-to-r ${categoryColorClass}`}>
      <CardHeader>
        <CardTitle className={`flex items-center gap-2 ${textColorClass}`}>
          <Calendar className="h-5 w-5" />
          <span>{spelmanDate.title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className={`flex items-center gap-4 mt-2 text-sm ${textColorClass}`}>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {format(spelmanDate.date, 'MMM d, yyyy')}
              </div>
              <span className="capitalize bg-white/50 px-2 py-1 rounded text-xs font-medium">
                {spelmanDate.category.replace('_', ' ')}
              </span>
            </div>
            <p className={`mt-2 text-sm ${textColorClass}`}>{spelmanDate.description}</p>
          </div>
          <div className="ml-4 w-16 h-16 rounded overflow-hidden border-2 border-white/50">
            <img 
              src={spelmanDate.imageUrl} 
              alt={spelmanDate.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
