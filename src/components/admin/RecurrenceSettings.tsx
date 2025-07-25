
import React from 'react';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Repeat, Calendar, Clock } from 'lucide-react';

interface RecurrenceSettingsProps {
  isRecurring: boolean;
  onIsRecurringChange: (value: boolean) => void;
  pattern: string;
  onPatternChange: (value: string) => void;
  interval: number;
  onIntervalChange: (value: number) => void;
  endDate: string;
  onEndDateChange: (value: string) => void;
  count: number | null;
  onCountChange: (value: number | null) => void;
}

export function RecurrenceSettings({
  isRecurring,
  onIsRecurringChange,
  pattern,
  onPatternChange,
  interval,
  onIntervalChange,
  endDate,
  onEndDateChange,
  count,
  onCountChange
}: RecurrenceSettingsProps) {
  const [endType, setEndType] = React.useState<'date' | 'count' | 'never'>('never');

  React.useEffect(() => {
    if (endDate) {
      setEndType('date');
    } else if (count) {
      setEndType('count');
    } else {
      setEndType('never');
    }
  }, [endDate, count]);

  const handleEndTypeChange = (newEndType: 'date' | 'count' | 'never') => {
    setEndType(newEndType);
    
    if (newEndType === 'date') {
      onCountChange(null);
    } else if (newEndType === 'count') {
      onEndDateChange('');
    } else {
      onEndDateChange('');
      onCountChange(null);
    }
  };

  return (
    <div className="space-y-4 p-4 border border-gray-300 rounded-lg bg-white dark:bg-gray-50 dark:border-gray-400">
      <div className="flex items-center space-x-2">
        <Repeat className="h-4 w-4 text-glee-spelman" />
        <Label className="font-medium text-gray-900 dark:text-gray-800">Recurring Event Settings</Label>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="is_recurring"
          checked={isRecurring}
          onCheckedChange={onIsRecurringChange}
        />
        <Label htmlFor="is_recurring" className="text-gray-800 dark:text-gray-700">Make this a recurring event</Label>
      </div>

      {isRecurring && (
        <div className="space-y-4 pl-6 border-l-2 border-glee-spelman">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="recurrence_pattern" className="text-gray-800 dark:text-gray-700">Repeat Pattern</Label>
              <Select value={pattern} onValueChange={onPatternChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select pattern" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="recurrence_interval" className="text-gray-800 dark:text-gray-700">Every</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="recurrence_interval"
                  type="number"
                  min="1"
                  max="365"
                  value={interval}
                  onChange={(e) => onIntervalChange(parseInt(e.target.value) || 1)}
                  className="w-20"
                />
                <span className="text-sm text-gray-600 dark:text-gray-500">
                  {pattern === 'daily' && (interval === 1 ? 'day' : 'days')}
                  {pattern === 'weekly' && (interval === 1 ? 'week' : 'weeks')}
                  {pattern === 'monthly' && (interval === 1 ? 'month' : 'months')}
                  {pattern === 'yearly' && (interval === 1 ? 'year' : 'years')}
                </span>
              </div>
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-800 dark:text-gray-700">End Recurrence</Label>
            <div className="space-y-3 mt-2">
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="end_never"
                  name="end_type"
                  checked={endType === 'never'}
                  onChange={() => handleEndTypeChange('never')}
                  className="h-4 w-4"
                />
                <Label htmlFor="end_never" className="text-sm text-gray-800 dark:text-gray-700">Never</Label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="end_date"
                  name="end_type"
                  checked={endType === 'date'}
                  onChange={() => handleEndTypeChange('date')}
                  className="h-4 w-4"
                />
                <Label htmlFor="end_date" className="text-sm text-gray-800 dark:text-gray-700">On</Label>
                {endType === 'date' && (
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-600" />
                    <Input
                      type="date"
                      value={endDate}
                      onChange={(e) => onEndDateChange(e.target.value)}
                      className="w-auto"
                    />
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="end_count"
                  name="end_type"
                  checked={endType === 'count'}
                  onChange={() => handleEndTypeChange('count')}
                  className="h-4 w-4"
                />
                <Label htmlFor="end_count" className="text-sm text-gray-800 dark:text-gray-700">After</Label>
                {endType === 'count' && (
                  <div className="flex items-center space-x-2">
                    <Input
                      type="number"
                      min="1"
                      max="365"
                      value={count || ''}
                      onChange={(e) => onCountChange(parseInt(e.target.value) || null)}
                      className="w-20"
                    />
                    <span className="text-sm text-gray-600 dark:text-gray-500">occurrences</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-300 rounded-lg p-3 text-sm text-blue-900 dark:bg-blue-100 dark:border-blue-400">
            <div className="flex items-start gap-2">
              <Clock className="h-4 w-4 mt-0.5 flex-shrink-0 text-blue-700" />
              <div>
                <p className="font-medium text-blue-900">Recurring Event Preview</p>
                <p className="text-blue-800">
                  This event will repeat every {interval} {pattern === 'daily' && (interval === 1 ? 'day' : 'days')}
                  {pattern === 'weekly' && (interval === 1 ? 'week' : 'weeks')}
                  {pattern === 'monthly' && (interval === 1 ? 'month' : 'months')}
                  {pattern === 'yearly' && (interval === 1 ? 'year' : 'years')}
                  {endType === 'date' && endDate && ` until ${new Date(endDate).toLocaleDateString()}`}
                  {endType === 'count' && count && ` for ${count} occurrences`}
                  {endType === 'never' && ' indefinitely'}.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
