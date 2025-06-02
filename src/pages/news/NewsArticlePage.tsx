
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { NewsItem } from "@/components/landing/news/NewsTicker";

const NEWS_ITEMS: NewsItem[] = [
  {
    id: "1",
    headline: "🎵 Spelman College Glee Club announces Spring Concert series",
    active: true,
    content: "The Spelman College Glee Club is proud to announce our Spring Concert series, featuring performances across Atlanta throughout April and May. Join us for a celebration of choral excellence as we showcase a diverse repertoire of classical, spiritual, and contemporary works.",
    date: "May 1, 2025"
  },
  {
    id: "2", 
    headline: "🏛️ HBCU Choir Festival featuring top collegiate ensembles",
    active: true,
    content: "Spelman College Glee Club will be participating in the annual HBCU Choir Festival this June, joining forces with top collegiate ensembles from across the country. This collaborative event showcases the rich choral traditions of Historically Black Colleges and Universities, highlighting our shared musical heritage and contemporary innovations.",
    date: "May 5, 2025"
  },
  {
    id: "3",
    headline: "🎓 New scholarship opportunities available for music students",
    active: true,
    content: "We're pleased to announce several new scholarship opportunities for exceptional music students at Spelman College. These scholarships aim to support talented vocalists pursuing excellence in choral music and solo performance. Applications are now open for the 2025-2026 academic year.",
    date: "May 8, 2025"
  },
  {
    id: "4",
    headline: "📰 Glee Club wins national recognition for excellence in choral music",
    active: true,
    content: "The Spelman College Glee Club has received national recognition for excellence in choral music at the Collegiate Choral Competition held last month. Our ensemble was praised for outstanding musicianship, innovative programming, and cultural authenticity in performance.",
    date: "May 12, 2025"
  }
];

const NewsArticlePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const newsItem = NEWS_ITEMS.find(item => item.id === id);
  
  const handleGoBack = () => {
    navigate(-1);
  };
  
  if (!newsItem) {
    return (
      <div className="container mx-auto py-12 px-4">
        <Button onClick={handleGoBack} variant="outline" className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
        </Button>
        <h1 className="text-3xl font-bold mb-4">News article not found</h1>
        <p>Sorry, the requested news article could not be found.</p>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-12 px-4">
      <Button onClick={handleGoBack} variant="outline" className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
      </Button>
      
      <article className="prose prose-lg dark:prose-invert max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">{newsItem.headline}</h1>
        <p className="text-muted-foreground mb-6">{newsItem.date}</p>
        
        <div className="bg-card p-6 rounded-lg shadow-sm border">
          <p className="whitespace-pre-line text-lg">{newsItem.content}</p>
          
          {/* Add more paragraphs of content here */}
          <p className="mt-6">
            For more information about Spelman College Glee Club events and performances, 
            please visit our Events page or contact the Music Department.
          </p>
        </div>
      </article>
    </div>
  );
};

export default NewsArticlePage;
