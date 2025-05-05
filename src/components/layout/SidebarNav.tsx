
import React from "react";
import {
  LayoutDashboard,
  FileMusic,
  Music,
  Calendar,
  Book,
  ShoppingBag,
  UserCheck,
  Library,
  AudioLines
} from "lucide-react";
import { NavItem } from "./NavItem";

export function SidebarNav({ className }: { className?: string }) {
  return (
    <nav className={className}>
      <ul className="space-y-2 lg:space-y-1">
        <li>
          <NavItem
            href="/dashboard"
            title="Dashboard"
            icon={LayoutDashboard}
          />
        </li>
        <li>
          <NavItem
            href="/dashboard/sheet-music"
            title="Sheet Music"
            icon={FileMusic}
          />
        </li>
        <li>
          <NavItem
            href="/dashboard/practice"
            title="Practice Tracks"
            icon={Music}
          />
        </li>
        <li>
          <NavItem
            href="/dashboard/recordings"
            title="Recordings"
            icon={AudioLines}
          />
        </li>
        <li>
          <NavItem
            href="/dashboard/schedule"
            title="Schedule"
            icon={Calendar}
          />
        </li>
        <li>
          <NavItem
            href="/dashboard/handbook"
            title="Handbook"
            icon={Book}
          />
        </li>
        <li>
          <NavItem
            href="/dashboard/merch"
            title="Merch"
            icon={ShoppingBag}
          />
        </li>
        <li>
          <NavItem
            href="/dashboard/attendance"
            title="Attendance"
            icon={UserCheck}
          />
        </li>
        <li>
          <NavItem
            href="/dashboard/media-library"
            title="Media Library"
            icon={Library}
          />
        </li>
        <li>
          <NavItem
            href="/dashboard/audio-management"
            title="Audio Management"
            icon={AudioLines}
          />
        </li>
      </ul>
    </nav>
  );
}
