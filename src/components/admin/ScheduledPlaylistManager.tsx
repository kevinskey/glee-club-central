import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Calendar, Clock, Play, Pause, Trash2, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";

interface Playlist {
  id: string;
  name: string;
  description: string;
  is_active: boolean;
}

interface ScheduledPlaylist {
  id: string;
  playlist_id: string;
  start_time: string;
  end_time: string | null;
  is_active: boolean;
  created_at: string;
  playlists: Playlist;
}

export function ScheduledPlaylistManager() {
  const [scheduledPlaylists, setScheduledPlaylists] = useState<
    ScheduledPlaylist[]
  >([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newSchedule, setNewSchedule] = useState({
    playlist_id: "",
    start_time: "",
    end_time: "",
    is_active: true,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Load scheduled playlists
      const { data: scheduledData, error: scheduledError } = await supabase
        .from("scheduled_playlists")
        .select(
          `
          *,
          playlists (
            id,
            name,
            description,
            is_active
          )
        `,
        )
        .order("start_time", { ascending: false });

      if (scheduledError) throw scheduledError;

      // Load all playlists
      const { data: playlistData, error: playlistError } = await supabase
        .from("playlists")
        .select("*")
        .order("name");

      if (playlistError) throw playlistError;

      setScheduledPlaylists(scheduledData || []);
      setPlaylists(playlistData || []);
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("Failed to load scheduled playlists");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddSchedule = async () => {
    if (!newSchedule.playlist_id || !newSchedule.start_time) {
      toast.error("Please select a playlist and start time");
      return;
    }

    try {
      const { error } = await supabase.from("scheduled_playlists").insert({
        playlist_id: newSchedule.playlist_id,
        start_time: newSchedule.start_time,
        end_time: newSchedule.end_time || null,
        is_active: newSchedule.is_active,
      });

      if (error) throw error;

      toast.success("Scheduled playlist added successfully");
      setShowAddForm(false);
      setNewSchedule({
        playlist_id: "",
        start_time: "",
        end_time: "",
        is_active: true,
      });
      loadData();
    } catch (error) {
      console.error("Error adding scheduled playlist:", error);
      toast.error("Failed to add scheduled playlist");
    }
  };

  const toggleScheduleStatus = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("scheduled_playlists")
        .update({ is_active: !currentStatus })
        .eq("id", id);

      if (error) throw error;

      toast.success(`Schedule ${!currentStatus ? "activated" : "deactivated"}`);
      loadData();
    } catch (error) {
      console.error("Error updating schedule status:", error);
      toast.error("Failed to update schedule status");
    }
  };

  const deleteSchedule = async (id: string) => {
    if (!confirm("Are you sure you want to delete this scheduled playlist?")) {
      return;
    }

    try {
      const { error } = await supabase
        .from("scheduled_playlists")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast.success("Scheduled playlist deleted");
      loadData();
    } catch (error) {
      console.error("Error deleting scheduled playlist:", error);
      toast.error("Failed to delete scheduled playlist");
    }
  };

  const isCurrentlyActive = (schedule: ScheduledPlaylist) => {
    const now = new Date();
    const startTime = new Date(schedule.start_time);
    const endTime = schedule.end_time ? new Date(schedule.end_time) : null;

    return (
      schedule.is_active && now >= startTime && (!endTime || now <= endTime)
    );
  };

  if (isLoading) {
    return <div className="p-4">Loading scheduled playlists...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Scheduled Playlists</h3>
        <Button onClick={() => setShowAddForm(!showAddForm)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Schedule
        </Button>
      </div>

      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Scheduled Playlist</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="playlist">Playlist</Label>
              <Select
                value={newSchedule.playlist_id}
                onValueChange={(value) =>
                  setNewSchedule((prev) => ({ ...prev, playlist_id: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a playlist" />
                </SelectTrigger>
                <SelectContent>
                  {playlists.map((playlist) => (
                    <SelectItem key={playlist.id} value={playlist.id}>
                      {playlist.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="start_time">Start Time</Label>
                <Input
                  id="start_time"
                  type="datetime-local"
                  value={newSchedule.start_time}
                  onChange={(e) =>
                    setNewSchedule((prev) => ({
                      ...prev,
                      start_time: e.target.value,
                    }))
                  }
                />
              </div>
              <div>
                <Label htmlFor="end_time">End Time (Optional)</Label>
                <Input
                  id="end_time"
                  type="datetime-local"
                  value={newSchedule.end_time}
                  onChange={(e) =>
                    setNewSchedule((prev) => ({
                      ...prev,
                      end_time: e.target.value,
                    }))
                  }
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="is_active"
                checked={newSchedule.is_active}
                onCheckedChange={(checked) =>
                  setNewSchedule((prev) => ({ ...prev, is_active: checked }))
                }
              />
              <Label htmlFor="is_active">Active</Label>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleAddSchedule}>Add Schedule</Button>
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {scheduledPlaylists.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center text-muted-foreground">
              No scheduled playlists found. Add one to get started!
            </CardContent>
          </Card>
        ) : (
          scheduledPlaylists.map((schedule) => (
            <Card
              key={schedule.id}
              className={
                isCurrentlyActive(schedule)
                  ? "border-green-500 bg-green-50 dark:bg-green-950/20"
                  : ""
              }
            >
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold">
                        {schedule.playlists.name}
                      </h4>
                      {isCurrentlyActive(schedule) && (
                        <span className="px-2 py-1 text-xs bg-green-500 text-white rounded-full flex items-center gap-1">
                          <Play className="h-3 w-3" />
                          Currently Active
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {schedule.playlists.description || "No description"}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        Starts:{" "}
                        {format(new Date(schedule.start_time), "MMM d, yyyy")}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {format(new Date(schedule.start_time), "h:mm a")}
                      </div>
                      {schedule.end_time && (
                        <div>
                          Ends:{" "}
                          {format(
                            new Date(schedule.end_time),
                            "MMM d, yyyy h:mm a",
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        toggleScheduleStatus(schedule.id, schedule.is_active)
                      }
                    >
                      {schedule.is_active ? (
                        <>
                          <Pause className="h-4 w-4 mr-1" />
                          Deactivate
                        </>
                      ) : (
                        <>
                          <Play className="h-4 w-4 mr-1" />
                          Activate
                        </>
                      )}
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteSchedule(schedule.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
