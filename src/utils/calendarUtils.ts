
import { EventType } from "@/types/calendar";

/**
 * Returns the appropriate Tailwind CSS color class based on event type
 * @param type The type of calendar event
 * @returns Tailwind CSS color class string
 */
export function getEventTypeColor(type: EventType | string): string {
  switch (type) {
    case "concert":
      return "bg-glee-purple";
    case "rehearsal":
      return "bg-blue-500";
    case "sectional":
      return "bg-green-500";
    case "special":
      return "bg-amber-500";
    case "tour":
      return "bg-pink-500";
    default:
      return "bg-gray-500";
  }
}

/**
 * Returns the appropriate hover variant of Tailwind CSS color class based on event type
 * @param type The type of calendar event
 * @returns Tailwind CSS hover color class string
 */
export function getEventTypeHoverColor(type: EventType | string): string {
  switch (type) {
    case "concert":
      return "hover:bg-glee-purple/90";
    case "rehearsal":
      return "hover:bg-blue-500/90";
    case "sectional":
      return "hover:bg-green-500/90";
    case "special":
      return "hover:bg-amber-500/90";
    case "tour":
      return "hover:bg-pink-500/90";
    default:
      return "hover:bg-gray-500/90";
  }
}

/**
 * Returns a combined string of color and hover classes for an event type
 * @param type The type of calendar event
 * @returns Combined Tailwind CSS class string
 */
export function getEventTypeColorWithHover(type: EventType | string): string {
  return `${getEventTypeColor(type)} ${getEventTypeHoverColor(type)}`;
}

/**
 * Returns the text display name for an event type
 * @param type The type of calendar event
 * @returns Human-readable event type name
 */
export function getEventTypeName(type: EventType | string): string {
  switch (type) {
    case "concert":
      return "Concert";
    case "rehearsal":
      return "Rehearsal";
    case "sectional":
      return "Sectional";
    case "special":
      return "Special Event";
    case "tour":
      return "Tour";
    default:
      return "Event";
  }
}
