
// Import the shared event types
import { EVENT_TYPES as SHARED_EVENT_TYPES } from './eventTypes';

// Re-export for consistency
export const EVENT_TYPES = SHARED_EVENT_TYPES;
export type EventType = typeof EVENT_TYPES[number]['value'];

export interface PlannerModule {
  id: string;
  title: string;
  description: string;
  icon: string;
  required: boolean;
  defaultExpanded?: boolean;
}

// Core modules that appear for all event types
export const CORE_MODULES: PlannerModule[] = [
  {
    id: 'event-info',
    title: 'Event Information',
    description: 'Basic event details, title, date, and description',
    icon: 'Calendar',
    required: true,
    defaultExpanded: true,
  },
  {
    id: 'partners-people',
    title: 'Partners & People',
    description: 'Collaborators, guest artists, and key personnel',
    icon: 'Users',
    required: false,
  },
  {
    id: 'location',
    title: 'Location & Venue',
    description: 'Venue details, directions, and logistics',
    icon: 'MapPin',
    required: true,
  },
  {
    id: 'communications',
    title: 'Communications',
    description: 'Announcements, marketing, and member notifications',
    icon: 'MessageCircle',
    required: false,
  },
];

// Specialized modules for specific event types
export const SPECIALIZED_MODULES: Record<EventType, PlannerModule[]> = {
  concert: [
    {
      id: 'repertoire',
      title: 'Repertoire & Music',
      description: 'Song selections, sheet music, and performance order',
      icon: 'Music',
      required: true,
    },
    {
      id: 'wardrobe',
      title: 'Wardrobe & Styling',
      description: 'Performance attire and appearance guidelines',
      icon: 'Shirt',
      required: true,
    },
    {
      id: 'technical',
      title: 'Technical Requirements',
      description: 'Sound, lighting, and stage requirements',
      icon: 'Settings',
      required: false,
    },
    {
      id: 'ticketing',
      title: 'Ticketing & Sales',
      description: 'Ticket pricing, sales, and audience management',
      icon: 'Ticket',
      required: false,
    },
  ],
  performance: [
    {
      id: 'repertoire',
      title: 'Performance Music',
      description: 'Song selections, sheet music, and performance order',
      icon: 'Music',
      required: true,
    },
    {
      id: 'wardrobe',
      title: 'Wardrobe & Styling',
      description: 'Performance attire and appearance guidelines',
      icon: 'Shirt',
      required: true,
    },
    {
      id: 'technical',
      title: 'Technical Requirements',
      description: 'Sound, lighting, and stage requirements',
      icon: 'Settings',
      required: false,
    },
  ],
  rehearsal: [
    {
      id: 'repertoire',
      title: 'Rehearsal Music',
      description: 'Songs to practice and rehearsal focus areas',
      icon: 'Music',
      required: true,
    },
    {
      id: 'attendance',
      title: 'Attendance Tracking',
      description: 'Member attendance and excused absences',
      icon: 'CheckCircle',
      required: true,
    },
    {
      id: 'notes',
      title: 'Rehearsal Notes',
      description: 'Director notes and improvement areas',
      icon: 'FileText',
      required: false,
    },
  ],
  audition: [
    {
      id: 'requirements',
      title: 'Audition Requirements',
      description: 'Audition pieces, criteria, and expectations',
      icon: 'ClipboardList',
      required: true,
    },
    {
      id: 'judges',
      title: 'Judges & Evaluation',
      description: 'Judging panel and scoring criteria',
      icon: 'UserCheck',
      required: true,
    },
    {
      id: 'scheduling',
      title: 'Audition Scheduling',
      description: 'Time slots and candidate management',
      icon: 'Clock',
      required: true,
    },
  ],
  workshop: [
    {
      id: 'curriculum',
      title: 'Workshop Curriculum',
      description: 'Learning objectives and session content',
      icon: 'BookOpen',
      required: true,
    },
    {
      id: 'materials',
      title: 'Materials & Resources',
      description: 'Handouts, recordings, and required materials',
      icon: 'Package',
      required: false,
    },
    {
      id: 'facilitator',
      title: 'Facilitator Information',
      description: 'Workshop leader details and bio',
      icon: 'User',
      required: true,
    },
  ],
  masterclass: [
    {
      id: 'curriculum',
      title: 'Masterclass Curriculum',
      description: 'Learning objectives and session content',
      icon: 'BookOpen',
      required: true,
    },
    {
      id: 'materials',
      title: 'Materials & Resources',
      description: 'Handouts, recordings, and required materials',
      icon: 'Package',
      required: false,
    },
    {
      id: 'facilitator',
      title: 'Master Teacher Information',
      description: 'Master teacher details and bio',
      icon: 'User',
      required: true,
    },
  ],
  tour: [
    {
      id: 'itinerary',
      title: 'Tour Itinerary',
      description: 'Travel schedule and performance locations',
      icon: 'Route',
      required: true,
    },
    {
      id: 'logistics',
      title: 'Travel Logistics',
      description: 'Transportation, accommodations, and meals',
      icon: 'Plane',
      required: true,
    },
    {
      id: 'repertoire',
      title: 'Tour Repertoire',
      description: 'Performance songs for tour venues',
      icon: 'Music',
      required: true,
    },
    {
      id: 'budget',
      title: 'Tour Budget',
      description: 'Expenses, funding, and cost tracking',
      icon: 'DollarSign',
      required: false,
    },
  ],
  fundraiser: [
    {
      id: 'goals',
      title: 'Fundraising Goals',
      description: 'Target amounts and fund allocation',
      icon: 'Target',
      required: true,
    },
    {
      id: 'donations',
      title: 'Donation Management',
      description: 'Donor tracking and contribution processing',
      icon: 'Heart',
      required: true,
    },
    {
      id: 'incentives',
      title: 'Donor Incentives',
      description: 'Recognition levels and thank you gifts',
      icon: 'Gift',
      required: false,
    },
  ],
  social: [
    {
      id: 'activities',
      title: 'Activities & Games',
      description: 'Entertainment and social activities planned',
      icon: 'Gamepad2',
      required: false,
    },
    {
      id: 'catering',
      title: 'Food & Catering',
      description: 'Menu, dietary restrictions, and service details',
      icon: 'Utensils',
      required: false,
    },
  ],
  meeting: [
    {
      id: 'agenda',
      title: 'Meeting Agenda',
      description: 'Topics, discussion points, and time allocation',
      icon: 'List',
      required: true,
    },
    {
      id: 'minutes',
      title: 'Meeting Minutes',
      description: 'Notes, decisions, and action items',
      icon: 'PenTool',
      required: false,
    },
  ],
  outreach: [
    {
      id: 'community',
      title: 'Community Partner',
      description: 'Partner organization and contact information',
      icon: 'HandHeart',
      required: true,
    },
    {
      id: 'service',
      title: 'Service Activity',
      description: 'Type of service and member roles',
      icon: 'Heart',
      required: true,
    },
  ],
  competition: [
    {
      id: 'repertoire',
      title: 'Competition Pieces',
      description: 'Required and optional performance pieces',
      icon: 'Music',
      required: true,
    },
    {
      id: 'rules',
      title: 'Competition Rules',
      description: 'Guidelines, judging criteria, and regulations',
      icon: 'Scale',
      required: true,
    },
    {
      id: 'registration',
      title: 'Registration & Fees',
      description: 'Entry requirements and payment details',
      icon: 'CreditCard',
      required: false,
    },
  ],
  // Additional event types with basic modules
  event: [
    {
      id: 'details',
      title: 'Event Details',
      description: 'Additional event information and requirements',
      icon: 'FileText',
      required: false,
    },
  ],
  holiday: [
    {
      id: 'celebration',
      title: 'Celebration Activities',
      description: 'Holiday-specific activities and traditions',
      icon: 'Gift',
      required: false,
    },
  ],
  academic: [
    {
      id: 'academic-info',
      title: 'Academic Information',
      description: 'Academic calendar details and requirements',
      icon: 'BookOpen',
      required: false,
    },
  ],
};

export const getModulesForEventType = (eventType: EventType): PlannerModule[] => {
  return [...CORE_MODULES, ...(SPECIALIZED_MODULES[eventType] || [])];
};
