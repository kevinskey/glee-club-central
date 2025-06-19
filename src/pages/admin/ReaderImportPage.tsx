
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ReaderUserImport } from '@/components/admin/ReaderUserImport';
import { Users, Database } from 'lucide-react';

export default function ReaderImportPage() {
  return (
    <div className="w-full max-w-none px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-navy-900 dark:text-white font-playfair">
          Reader User Import
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Import users from the music reader application into the main Glee World database
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ReaderUserImport />
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Import Process
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">1</div>
                <div>
                  <h3 className="font-semibold">Fetch Reader Users</h3>
                  <p className="text-sm text-gray-600">Connects to the music reader database and retrieves all user accounts</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">2</div>
                <div>
                  <h3 className="font-semibold">Check Existing Users</h3>
                  <p className="text-sm text-gray-600">Skips users who already exist in the main database</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">3</div>
                <div>
                  <h3 className="font-semibold">Create User Accounts</h3>
                  <p className="text-sm text-gray-600">Creates new auth accounts with temporary passwords</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">4</div>
                <div>
                  <h3 className="font-semibold">Setup Profiles</h3>
                  <p className="text-sm text-gray-600">Creates user profiles with "member" role and active status</p>
                </div>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
              <h4 className="font-semibold text-yellow-800 mb-2">Important Notes:</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Users will need to reset their passwords after import</li>
                <li>• All imported users will have "member" role</li>
                <li>• SSO will work automatically after import</li>
                <li>• Existing users are safely skipped</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
