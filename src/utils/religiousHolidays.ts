
interface ReligiousHoliday {
  id: string;
  title: string;
  date: Date;
  description: string;
  imageUrl: string;
  category: 'christian' | 'jewish' | 'islamic' | 'other';
}

export const getReligiousHolidays = (year: number = 2025): ReligiousHoliday[] => {
  return [
    // Christian Holidays
    {
      id: 'new-years-day-christian',
      title: "New Year's Day",
      date: new Date(year, 0, 1), // January 1
      description: "Christian celebration of the new year with prayers and resolutions.",
      imageUrl: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&h=600&fit=crop",
      category: 'christian'
    },
    {
      id: 'epiphany',
      title: "Epiphany",
      date: new Date(year, 0, 6), // January 6
      description: "Christian feast day celebrating the revelation of Christ to the Gentiles.",
      imageUrl: "https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=800&h=600&fit=crop",
      category: 'christian'
    },
    {
      id: 'ash-wednesday',
      title: "Ash Wednesday",
      date: new Date(year, 2, 5), // March 5 (approximate)
      description: "First day of Lent in the Christian calendar.",
      imageUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=600&fit=crop",
      category: 'christian'
    },
    {
      id: 'palm-sunday',
      title: "Palm Sunday",
      date: new Date(year, 3, 13), // April 13 (approximate)
      description: "Christian feast commemorating Jesus's triumphal entry into Jerusalem.",
      imageUrl: "https://images.unsplash.com/photo-1520637836862-4d197d17c86a?w=800&h=600&fit=crop",
      category: 'christian'
    },
    {
      id: 'good-friday',
      title: "Good Friday",
      date: new Date(year, 3, 18), // April 18 (approximate)
      description: "Christian observance of the crucifixion of Jesus Christ.",
      imageUrl: "https://images.unsplash.com/photo-1517021897933-0e0319cfbc28?w=800&h=600&fit=crop",
      category: 'christian'
    },
    {
      id: 'easter-sunday',
      title: "Easter Sunday",
      date: new Date(year, 3, 20), // April 20 (approximate)
      description: "Christian celebration of the resurrection of Jesus Christ.",
      imageUrl: "https://images.unsplash.com/photo-1491904768633-2b7e3e7fede5?w=800&h=600&fit=crop",
      category: 'christian'
    },
    {
      id: 'pentecost',
      title: "Pentecost",
      date: new Date(year, 4, 25), // May 25 (approximate)
      description: "Christian feast commemorating the descent of the Holy Spirit.",
      imageUrl: "https://images.unsplash.com/photo-1520637836862-4d197d17c86a?w=800&h=600&fit=crop",
      category: 'christian'
    },
    {
      id: 'all-saints-day',
      title: "All Saints' Day",
      date: new Date(year, 10, 1), // November 1
      description: "Christian feast honoring all the saints.",
      imageUrl: "https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=800&h=600&fit=crop",
      category: 'christian'
    },
    {
      id: 'advent-sunday',
      title: "First Sunday of Advent",
      date: new Date(year, 10, 30), // November 30 (approximate)
      description: "Beginning of the Christian liturgical year.",
      imageUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=600&fit=crop",
      category: 'christian'
    },
    {
      id: 'christmas-eve',
      title: "Christmas Eve",
      date: new Date(year, 11, 24), // December 24
      description: "Christian celebration on the evening before Christmas Day.",
      imageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&h=600&fit=crop",
      category: 'christian'
    },

    // Jewish Holidays
    {
      id: 'rosh-hashanah',
      title: "Rosh Hashanah",
      date: new Date(year, 8, 15), // September 15 (approximate)
      description: "Jewish New Year, a time of reflection and renewal.",
      imageUrl: "https://images.unsplash.com/photo-1533294455009-a77b7557d2d1?w=800&h=600&fit=crop",
      category: 'jewish'
    },
    {
      id: 'yom-kippur',
      title: "Yom Kippur",
      date: new Date(year, 8, 24), // September 24 (approximate)
      description: "Day of Atonement, the holiest day in Judaism.",
      imageUrl: "https://images.unsplash.com/photo-1533294455009-a77b7557d2d1?w=800&h=600&fit=crop",
      category: 'jewish'
    },
    {
      id: 'hanukkah',
      title: "Hanukkah Begins",
      date: new Date(year, 11, 14), // December 14 (approximate)
      description: "Jewish Festival of Lights celebrating the rededication of the Temple.",
      imageUrl: "https://images.unsplash.com/photo-1533294455009-a77b7557d2d1?w=800&h=600&fit=crop",
      category: 'jewish'
    },
    {
      id: 'passover',
      title: "Passover Begins",
      date: new Date(year, 3, 5), // April 5 (approximate)
      description: "Jewish celebration commemorating the Exodus from Egypt.",
      imageUrl: "https://images.unsplash.com/photo-1533294455009-a77b7557d2d1?w=800&h=600&fit=crop",
      category: 'jewish'
    },

    // Islamic Holidays
    {
      id: 'ramadan-begins',
      title: "Ramadan Begins",
      date: new Date(year, 2, 10), // March 10 (approximate)
      description: "Beginning of the Islamic holy month of fasting.",
      imageUrl: "https://images.unsplash.com/photo-1542816417-0983c9c9ad53?w=800&h=600&fit=crop",
      category: 'islamic'
    },
    {
      id: 'eid-al-fitr',
      title: "Eid al-Fitr",
      date: new Date(year, 3, 9), // April 9 (approximate)
      description: "Islamic celebration marking the end of Ramadan.",
      imageUrl: "https://images.unsplash.com/photo-1542816417-0983c9c9ad53?w=800&h=600&fit=crop",
      category: 'islamic'
    },
    {
      id: 'eid-al-adha',
      title: "Eid al-Adha",
      date: new Date(year, 5, 15), // June 15 (approximate)
      description: "Islamic Festival of Sacrifice commemorating Abraham's willingness to sacrifice his son.",
      imageUrl: "https://images.unsplash.com/photo-1542816417-0983c9c9ad53?w=800&h=600&fit=crop",
      category: 'islamic'
    }
  ];
};

export const getReligiousHolidayByDate = (date: Date): ReligiousHoliday | null => {
  const holidays = getReligiousHolidays(date.getFullYear());
  return holidays.find(holiday => 
    holiday.date.getDate() === date.getDate() &&
    holiday.date.getMonth() === date.getMonth() &&
    holiday.date.getFullYear() === date.getFullYear()
  ) || null;
};
