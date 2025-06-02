import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Home, Calendar, Music, User } from 'lucide-react';

export function MobileBottomNav() {
  const { isAuthenticated, isAdmin } = useAuth();

  return (
    <div className="fixed inset-x-0 bottom-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-2 px-4 sm:px-6 lg:hidden">
      <div className="flex items-center justify-between">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 ${
              isActive ? 'text-blue-600 dark:text-blue-400' : ''
            }`
          }
        >
          <Home className="h-5 w-5 mb-1" />
          Home
        </NavLink>

        <NavLink
          to="/calendar"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 ${
              isActive ? 'text-blue-600 dark:text-blue-400' : ''
            }`
          }
        >
          <Calendar className="h-5 w-5 mb-1" />
          Calendar
        </NavLink>

        <NavLink
          to="/recordings"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 ${
              isActive ? 'text-blue-600 dark:text-blue-400' : ''
            }`
          }
        >
          <Music className="h-5 w-5 mb-1" />
          Recordings
        </NavLink>

        {isAuthenticated ? (
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 ${
                isActive ? 'text-blue-600 dark:text-blue-400' : ''
              }`
            }
          >
            <User className="h-5 w-5 mb-1" />
            Profile
          </NavLink>
        ) : (
          <NavLink
            to="/login"
            className={({ isActive }) =>
              `flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 ${
                isActive ? 'text-blue-600 dark:text-blue-400' : ''
              }`
            }
          >
            <User className="h-5 w-5 mb-1" />
            Login
          </NavLink>
        )}
      </div>
    </div>
  );
}
