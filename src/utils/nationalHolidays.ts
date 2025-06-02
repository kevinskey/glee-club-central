
import { Holiday } from '@/types/calendar';

// Helper function to get the nth day of the week in a month
const getNthDayOfMonth = (year: number, month: number, dayOfWeek: number, n: number): Date => {
  let count = 0;
  let date = new Date(year, month, 1);
  
  while (date.getMonth() === month) {
    if (date.getDay() === dayOfWeek) {
      count++;
      if (count === n) {
        return new Date(date);
      }
    }
    date.setDate(date.getDate() + 1);
  }
  
  return new Date(year, month, 1); // Default to the first day of the month
};

// Helper function to get the second Monday of October for Columbus Day
const getSecondMondayOfMonth = (year: number, month: number): Date => {
  return getNthDayOfMonth(year, month, 1, 2); // 1 for Monday, 2 for the second occurrence
};

// Helper function to get the fourth Thursday of November for Thanksgiving
const getFourthThursdayOfMonth = (year: number, month: number): Date => {
  return getNthDayOfMonth(year, month, 4, 4); // 4 for Thursday, 4 for the fourth occurrence
};

export const getNationalHolidays = (year: number): Holiday[] => {
  const holidays: Holiday[] = [
    {
      id: `new-years-day-${year}`,
      title: "New Year's Day",
      date: new Date(year, 0, 1), // January 1st (month is 0-indexed)
      description: "Celebration of the start of a new year",
      imageUrl: "/lovable-uploads/new-years-day.jpg"
    },
    {
      id: `martin-luther-king-jr-day-${year}`,
      title: "Martin Luther King Jr. Day",
      date: getNthDayOfMonth(year, 0, 1, 3), // 3rd Monday of January
      description: "Honors the civil rights leader Martin Luther King Jr.",
      imageUrl: "/lovable-uploads/martin-luther-king-jr-day.jpg"
    },
    {
      id: `presidents-day-${year}`,
      title: "Presidents' Day",
      date: getNthDayOfMonth(year, 1, 1, 3), // 3rd Monday of February
      description: "Honors all U.S. presidents",
      imageUrl: "/lovable-uploads/presidents-day.jpg"
    },
    {
      id: `memorial-day-${year}`,
      title: "Memorial Day",
      date: new Date(year, 4, 31), // Last Monday of May
      description: "Honors those who have died in military service",
      imageUrl: "/lovable-uploads/memorial-day.jpg"
    },
    {
      id: `juneteenth-${year}`,
      title: "Juneteenth National Independence Day",
      date: new Date(year, 5, 19), // June 19th
      description: "Federal holiday commemorating the end of slavery in the United States",
      imageUrl: "/lovable-uploads/juneteenth.jpg"
    },
    {
      id: `independence-day-${year}`,
      title: "Independence Day",
      date: new Date(year, 6, 4), // July 4th
      description: "Celebrates the Declaration of Independence",
      imageUrl: "/lovable-uploads/independence-day.jpg"
    },
    {
      id: `labor-day-${year}`,
      title: "Labor Day",
      date: getNthDayOfMonth(year, 8, 1, 1), // 1st Monday of September
      description: "Honors the American labor movement",
      imageUrl: "/lovable-uploads/labor-day.jpg"
    },
    {
      id: `columbus-day-${year}`,
      title: "Columbus Day",
      date: getSecondMondayOfMonth(year, 9), // October
      description: "Federal holiday commemorating Christopher Columbus's arrival in the Americas",
      imageUrl: "/lovable-uploads/flag.jpg"
    },
    // Black History Month (February)
    {
      id: `black-history-month-start-${year}`,
      title: "Black History Month Begins",
      date: new Date(year, 1, 1), // February 1st
      description: "Annual observance honoring African American history and achievements",
      imageUrl: "/lovable-uploads/black-history-month.jpg"
    },
    // Emancipation Day
    {
      id: `emancipation-day-${year}`,
      title: "Emancipation Day",
      date: new Date(year, 3, 16), // April 16th
      description: "Commemorates the end of slavery in Washington, D.C.",
      imageUrl: "/lovable-uploads/emancipation-day.jpg"
    },
    // Malcolm X Day
    {
      id: `malcolm-x-day-${year}`,
      title: "Malcolm X Day",
      date: new Date(year, 4, 19), // May 19th
      description: "Honors the civil rights leader Malcolm X",
      imageUrl: "/lovable-uploads/malcolm-x.jpg"
    },
    // Veterans Day
    {
      id: `veterans-day-${year}`,
      title: "Veterans Day",
      date: new Date(year, 10, 11), // November 11th
      description: "Federal holiday honoring military veterans",
      imageUrl: "/lovable-uploads/veterans-day.jpg"
    },
    // Thanksgiving
    {
      id: `thanksgiving-${year}`,
      title: "Thanksgiving Day",
      date: getFourthThursdayOfMonth(year, 10), // November
      description: "Federal holiday for giving thanks",
      imageUrl: "/lovable-uploads/thanksgiving.jpg"
    },
    // Christmas
    {
      id: `christmas-${year}`,
      title: "Christmas Day",
      date: new Date(year, 11, 25), // December 25th
      description: "Federal holiday celebrating the birth of Jesus Christ",
      imageUrl: "/lovable-uploads/christmas.jpg"
    }
  ];

  return holidays.sort((a, b) => a.date.getTime() - b.date.getTime());
};
