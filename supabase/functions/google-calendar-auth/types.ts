
export interface OAuthTokens {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
}

export interface GoogleCalendarEvent {
  id: string;
  summary: string;
  start: { dateTime?: string; date?: string };
  end: { dateTime?: string; date?: string };
  description?: string;
  location?: string;
}

export interface CalendarListItem {
  id: string;
  summary: string;
  primary?: boolean;
}
