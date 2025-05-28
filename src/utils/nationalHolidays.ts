
interface NationalHoliday {
  id: string;
  title: string;
  date: Date;
  description: string;
  imageUrl: string;
  isObserved: boolean;
  category: 'federal' | 'observance';
}

export const getNationalHolidays = (year: number = 2025): NationalHoliday[] => {
  return [
    {
      id: 'new-years-day',
      title: "New Year's Day",
      date: new Date(year, 0, 1), // January 1
      description: "A federal holiday celebrating the beginning of the new year.",
      imageUrl: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&h=600&fit=crop",
      isObserved: true,
      category: 'federal'
    },
    {
      id: 'martin-luther-king-day',
      title: "Martin Luther King Jr. Day",
      date: new Date(year, 0, 20), // Third Monday in January (approximate)
      description: "A federal holiday honoring the civil rights leader Martin Luther King Jr.",
      imageUrl: "https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?w=800&h=600&fit=crop",
      isObserved: true,
      category: 'federal'
    },
    {
      id: 'presidents-day',
      title: "Presidents' Day",
      date: new Date(year, 1, 17), // Third Monday in February (approximate)
      description: "A federal holiday honoring all American presidents, particularly George Washington and Abraham Lincoln.",
      imageUrl: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=800&h=600&fit=crop",
      isObserved: true,
      category: 'federal'
    },
    {
      id: 'memorial-day',
      title: "Memorial Day",
      date: new Date(year, 4, 26), // Last Monday in May (approximate)
      description: "A federal holiday honoring those who died while serving in the U.S. military.",
      imageUrl: "https://images.unsplash.com/photo-1500673922987-e212871fec22?w=800&h=600&fit=crop",
      isObserved: true,
      category: 'federal'
    },
    {
      id: 'independence-day',
      title: "Independence Day",
      date: new Date(year, 6, 4), // July 4
      description: "A federal holiday celebrating the Declaration of Independence and the founding of the United States.",
      imageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&h=600&fit=crop",
      isObserved: true,
      category: 'federal'
    },
    {
      id: 'labor-day',
      title: "Labor Day",
      date: new Date(year, 8, 1), // First Monday in September (approximate)
      description: "A federal holiday celebrating the achievements of American workers.",
      imageUrl: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&h=600&fit=crop",
      isObserved: true,
      category: 'federal'
    },
    {
      id: 'columbus-day',
      title: "Columbus Day",
      date: new Date(year, 9, 13), // Second Monday in October (approximate)
      description: "A federal holiday commemorating Christopher Columbus's arrival in the Americas.",
      imageUrl: "https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?w=800&h=600&fit=crop",
      isObserved: true,
      category: 'federal'
    },
    {
      id: 'veterans-day',
      title: "Veterans Day",
      date: new Date(year, 10, 11), // November 11
      description: "A federal holiday honoring military veterans who served in the U.S. Armed Forces.",
      imageUrl: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=800&h=600&fit=crop",
      isObserved: true,
      category: 'federal'
    },
    {
      id: 'thanksgiving',
      title: "Thanksgiving Day",
      date: new Date(year, 10, 27), // Fourth Thursday in November (approximate)
      description: "A federal holiday for giving thanks and celebrating the harvest and other blessings of the past year.",
      imageUrl: "https://images.unsplash.com/photo-1500673922987-e212871fec22?w=800&h=600&fit=crop",
      isObserved: true,
      category: 'federal'
    },
    {
      id: 'christmas',
      title: "Christmas Day",
      date: new Date(year, 11, 25), // December 25
      description: "A federal holiday celebrating the birth of Jesus Christ.",
      imageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&h=600&fit=crop",
      isObserved: true,
      category: 'federal'
    }
  ];
};

export const getHolidayByDate = (date: Date): NationalHoliday | null => {
  const holidays = getNationalHolidays(date.getFullYear());
  return holidays.find(holiday => 
    holiday.date.getDate() === date.getDate() &&
    holiday.date.getMonth() === date.getMonth() &&
    holiday.date.getFullYear() === date.getFullYear()
  ) || null;
};
