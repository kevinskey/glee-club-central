
interface SpelmanAcademicDate {
  id: string;
  title: string;
  date: Date;
  description: string;
  category: 'orientation' | 'registration' | 'classes' | 'exams' | 'holiday' | 'break' | 'deadline' | 'special';
  imageUrl: string;
}

export const getSpelmanAcademicDates = (year: number = 2025): SpelmanAcademicDate[] => {
  return [
    // August
    {
      id: 'new-student-orientation-start',
      title: "New Student Orientation Begins",
      date: new Date(year, 7, 13), // August 13
      description: "New Student Orientation period begins (Aug 13-17)",
      category: 'orientation',
      imageUrl: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=600&fit=crop"
    },
    {
      id: 'registration-ends-aug',
      title: "Registration Ends",
      date: new Date(year, 7, 19), // August 19
      description: "Last day for regular registration",
      category: 'registration',
      imageUrl: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=600&fit=crop"
    },
    {
      id: 'first-day-classes',
      title: "First Day of Classes",
      date: new Date(year, 7, 20), // August 20
      description: "Fall semester classes begin",
      category: 'classes',
      imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop"
    },
    {
      id: 'late-registration-begins',
      title: "Late Registration Begins",
      date: new Date(year, 7, 21), // August 21
      description: "Late registration period begins",
      category: 'registration',
      imageUrl: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=600&fit=crop"
    },
    {
      id: 'late-registration-ends-aug',
      title: "Late Registration Ends",
      date: new Date(year, 7, 29), // August 29
      description: "Last day for late registration",
      category: 'registration',
      imageUrl: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=600&fit=crop"
    },

    // September
    {
      id: 'labor-day',
      title: "Labor Day - Campus Closed",
      date: new Date(year, 8, 1), // September 1
      description: "Holiday - Campus closed, no classes",
      category: 'holiday',
      imageUrl: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&h=600&fit=crop"
    },
    {
      id: 'spring-schedule-draft',
      title: "Spring 2026 Schedule Due",
      date: new Date(year, 8, 8), // September 8
      description: "Spring 2026 schedule revisions (1st Draft) due from Department Heads",
      category: 'deadline',
      imageUrl: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=600&fit=crop"
    },
    {
      id: 'summer-transcripts-due',
      title: "Summer Transcripts Due",
      date: new Date(year, 8, 19), // September 19
      description: "Summer school transcripts due",
      category: 'deadline',
      imageUrl: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=600&fit=crop"
    },
    {
      id: 'mid-semester-exams-sept',
      title: "Mid-Semester Examinations",
      date: new Date(year, 8, 25), // September 25
      description: "Mid-semester examinations (Sept 25-26)",
      category: 'exams',
      imageUrl: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=600&fit=crop"
    },

    // October
    {
      id: 'fall-break-start',
      title: "Fall Break Begins",
      date: new Date(year, 9, 6), // October 6
      description: "Fall break - No Spelman classes (Oct 6-7)",
      category: 'break',
      imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop"
    },
    {
      id: 'incompletes-makeup-deadline',
      title: "Incompletes Make-up Deadline",
      date: new Date(year, 9, 10), // October 10
      description: "Last day to make-up incompletes (I) for Spring 2025 and Missing Grades",
      category: 'deadline',
      imageUrl: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=600&fit=crop"
    },
    {
      id: 'mid-semester-grades-due',
      title: "Mid-Semester Grades Due",
      date: new Date(year, 9, 10), // October 10
      description: "Mid-semester grades due",
      category: 'deadline',
      imageUrl: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=600&fit=crop"
    },
    {
      id: 'advisement-begins',
      title: "Spring 2026 Advisement Begins",
      date: new Date(year, 9, 13), // October 13
      description: "Advisement for Spring 2026 begins",
      category: 'registration',
      imageUrl: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=600&fit=crop"
    },
    {
      id: 'last-withdraw-day',
      title: "Last Day to Withdraw",
      date: new Date(year, 9, 13), // October 13
      description: "Last day to withdraw from a course",
      category: 'deadline',
      imageUrl: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=600&fit=crop"
    },
    {
      id: 'graduation-app-deadline-dec',
      title: "December Graduation Application Deadline",
      date: new Date(year, 9, 17), // October 17
      description: "Graduation application deadline for December 2025",
      category: 'deadline',
      imageUrl: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=600&fit=crop"
    },

    // November
    {
      id: 'spring-registration-begins',
      title: "Spring 2026 Registration Begins",
      date: new Date(year, 10, 3), // November 3
      description: "Registration for Spring 2026 begins",
      category: 'registration',
      imageUrl: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=600&fit=crop"
    },
    {
      id: 'thanksgiving-break-start',
      title: "Thanksgiving Break",
      date: new Date(year, 10, 27), // November 27
      description: "Thanksgiving holiday - College closed (Nov 27-28)",
      category: 'holiday',
      imageUrl: "https://images.unsplash.com/photo-1500673922987-e212871fec22?w=800&h=600&fit=crop"
    },

    // December
    {
      id: 'graduation-app-deadline-may',
      title: "May Graduation Application Deadline",
      date: new Date(year, 11, 1), // December 1
      description: "Graduation application deadline for May 2026 candidates",
      category: 'deadline',
      imageUrl: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=600&fit=crop"
    },
    {
      id: 'last-day-classes-fall',
      title: "Last Day of Fall Classes",
      date: new Date(year, 11, 3), // December 3
      description: "Last day of fall semester classes",
      category: 'classes',
      imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop"
    },
    {
      id: 'reading-period-fall',
      title: "Reading Period",
      date: new Date(year, 11, 5), // December 5
      description: "Reading period (Dec 5-6)",
      category: 'exams',
      imageUrl: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=600&fit=crop"
    },
    {
      id: 'final-exams-fall',
      title: "Final Examinations",
      date: new Date(year, 11, 8), // December 8
      description: "Final examinations (Dec 8-12)",
      category: 'exams',
      imageUrl: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=600&fit=crop"
    },
    {
      id: 'semester-ends-fall',
      title: "Fall Semester Ends",
      date: new Date(year, 11, 12), // December 12
      description: "Fall semester ends",
      category: 'classes',
      imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop"
    },
    {
      id: 'final-grades-due-fall',
      title: "Final Grades Due",
      date: new Date(year, 11, 16), // December 16
      description: "All grades due in Registrar's Office by 10 a.m.",
      category: 'deadline',
      imageUrl: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=600&fit=crop"
    },

    // January (next year)
    {
      id: 'registration-ends-spring',
      title: "Spring Registration Ends",
      date: new Date(year + 1, 0, 13), // January 13
      description: "Registration ends for spring semester",
      category: 'registration',
      imageUrl: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=600&fit=crop"
    },
    {
      id: 'spring-classes-begin',
      title: "Spring Classes Begin",
      date: new Date(year + 1, 0, 14), // January 14
      description: "Spring semester classes begin",
      category: 'classes',
      imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop"
    },
    {
      id: 'mlk-day',
      title: "Martin Luther King Jr. Day",
      date: new Date(year + 1, 0, 19), // January 19
      description: "Holiday - Campus closed, no classes",
      category: 'holiday',
      imageUrl: "https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?w=800&h=600&fit=crop"
    },

    // February
    {
      id: 'fall-schedule-revisions',
      title: "Fall 2026 Schedule Revisions Due",
      date: new Date(year + 1, 1, 13), // February 13
      description: "Fall 2026 schedule revisions (1st Draft) due from Department Heads",
      category: 'deadline',
      imageUrl: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=600&fit=crop"
    },

    // March
    {
      id: 'mid-semester-exams-spring',
      title: "Mid-Semester Examinations",
      date: new Date(year + 1, 2, 5), // March 5
      description: "Mid-semester examinations (March 5-6)",
      category: 'exams',
      imageUrl: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=600&fit=crop"
    },
    {
      id: 'spring-break',
      title: "Spring Break",
      date: new Date(year + 1, 2, 9), // March 9
      description: "Spring break - College open, no classes (March 9-13)",
      category: 'break',
      imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop"
    },
    {
      id: 'fall-advisement-begins',
      title: "Fall 2026 Advisement Begins",
      date: new Date(year + 1, 2, 23), // March 23
      description: "Advisement for Fall 2026 begins",
      category: 'registration',
      imageUrl: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=600&fit=crop"
    },

    // April
    {
      id: 'good-friday',
      title: "Good Friday - College Closed",
      date: new Date(year + 1, 3, 3), // April 3
      description: "Holiday - College closed",
      category: 'holiday',
      imageUrl: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&h=600&fit=crop"
    },
    {
      id: 'fall-registration-begins',
      title: "Fall 2026 Registration Begins",
      date: new Date(year + 1, 3, 6), // April 6
      description: "Registration for Fall 2026 begins",
      category: 'registration',
      imageUrl: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=600&fit=crop"
    },
    {
      id: 'founders-day',
      title: "Founders Day",
      date: new Date(year + 1, 3, 9), // April 9
      description: "Founders Day observed",
      category: 'special',
      imageUrl: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=600&fit=crop"
    },
    {
      id: 'research-day',
      title: "Research Day",
      date: new Date(year + 1, 3, 17), // April 17
      description: "Research Day - No classes",
      category: 'special',
      imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop"
    },
    {
      id: 'last-day-classes-spring',
      title: "Last Day of Spring Classes",
      date: new Date(year + 1, 3, 29), // April 29
      description: "Last day of spring semester classes",
      category: 'classes',
      imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop"
    },

    // May
    {
      id: 'final-exams-spring',
      title: "Final Examinations",
      date: new Date(year + 1, 4, 4), // May 4
      description: "Final examinations (May 4-8)",
      category: 'exams',
      imageUrl: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=600&fit=crop"
    },
    {
      id: 'spring-semester-ends',
      title: "Spring Semester Ends",
      date: new Date(year + 1, 4, 8), // May 8
      description: "Spring semester ends",
      category: 'classes',
      imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop"
    },
    {
      id: 'baccalaureate-services',
      title: "Baccalaureate Services",
      date: new Date(year + 1, 4, 16), // May 16
      description: "Baccalaureate services",
      category: 'special',
      imageUrl: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=600&fit=crop"
    },
    {
      id: 'commencement',
      title: "Commencement Services",
      date: new Date(year + 1, 4, 17), // May 17
      description: "Commencement services",
      category: 'special',
      imageUrl: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=600&fit=crop"
    }
  ];
};

export const getSpelmanDateByDate = (date: Date): SpelmanAcademicDate | null => {
  const spelmanDates = getSpelmanAcademicDates(date.getFullYear());
  return spelmanDates.find(spelmanDate => 
    spelmanDate.date.getDate() === date.getDate() &&
    spelmanDate.date.getMonth() === date.getMonth() &&
    spelmanDate.date.getFullYear() === date.getFullYear()
  ) || null;
};
