export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      absence_requests: {
        Row: {
          event_id: string | null
          id: string
          member_id: string | null
          reason: string
          reviewed_at: string | null
          reviewed_by: string | null
          status: string | null
          submitted_at: string | null
        }
        Insert: {
          event_id?: string | null
          id?: string
          member_id?: string | null
          reason: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string | null
          submitted_at?: string | null
        }
        Update: {
          event_id?: string | null
          id?: string
          member_id?: string | null
          reason?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string | null
          submitted_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "absence_requests_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "absence_requests_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "user_management_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "absence_requests_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "absence_requests_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "user_management_view"
            referencedColumns: ["id"]
          },
        ]
      }
      attendance_records: {
        Row: {
          calendar_event_id: string | null
          created_at: string
          id: string
          member_id: string
          notes: string | null
          status: string
        }
        Insert: {
          calendar_event_id?: string | null
          created_at?: string
          id?: string
          member_id: string
          notes?: string | null
          status: string
        }
        Update: {
          calendar_event_id?: string | null
          created_at?: string
          id?: string
          member_id?: string
          notes?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "attendance_records_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_records_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "user_management_view"
            referencedColumns: ["id"]
          },
        ]
      }
      audio_files: {
        Row: {
          category: string
          created_at: string
          description: string | null
          file_path: string
          file_url: string
          id: string
          is_backing_track: boolean | null
          title: string
          uploaded_by: string
        }
        Insert: {
          category?: string
          created_at?: string
          description?: string | null
          file_path: string
          file_url: string
          id?: string
          is_backing_track?: boolean | null
          title: string
          uploaded_by: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          file_path?: string
          file_url?: string
          id?: string
          is_backing_track?: boolean | null
          title?: string
          uploaded_by?: string
        }
        Relationships: []
      }
      choral_titles: {
        Row: {
          amount_on_hand: number | null
          composer: string
          created_at: string | null
          has_pdf: boolean | null
          id: string
          library_number: string | null
          sheet_music_id: string | null
          title: string
          updated_at: string | null
          voicing: string
        }
        Insert: {
          amount_on_hand?: number | null
          composer: string
          created_at?: string | null
          has_pdf?: boolean | null
          id?: string
          library_number?: string | null
          sheet_music_id?: string | null
          title: string
          updated_at?: string | null
          voicing: string
        }
        Update: {
          amount_on_hand?: number | null
          composer?: string
          created_at?: string | null
          has_pdf?: boolean | null
          id?: string
          library_number?: string | null
          sheet_music_id?: string | null
          title?: string
          updated_at?: string | null
          voicing?: string
        }
        Relationships: [
          {
            foreignKeyName: "choral_titles_sheet_music_id_fkey"
            columns: ["sheet_music_id"]
            isOneToOne: false
            referencedRelation: "sheet_music"
            referencedColumns: ["id"]
          },
        ]
      }
      event_assignments: {
        Row: {
          assigned_by: string | null
          created_at: string
          event_id: string
          id: string
          notes: string | null
          user_id: string
        }
        Insert: {
          assigned_by?: string | null
          created_at?: string
          event_id: string
          id?: string
          notes?: string | null
          user_id: string
        }
        Update: {
          assigned_by?: string | null
          created_at?: string
          event_id?: string
          id?: string
          notes?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_assignments_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      event_rsvps: {
        Row: {
          created_at: string | null
          event_id: string | null
          id: string
          status: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          event_id?: string | null
          id?: string
          status: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          event_id?: string | null
          id?: string
          status?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "event_rsvps_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          allow_google_map_link: boolean | null
          allow_ics_download: boolean | null
          allow_reminders: boolean | null
          allow_rsvp: boolean | null
          created_at: string | null
          created_by: string | null
          end_time: string
          event_host_contact: string | null
          event_host_name: string | null
          event_type: string | null
          event_types: string[] | null
          feature_image_url: string | null
          full_description: string | null
          id: string
          image_url: string | null
          is_private: boolean | null
          is_public: boolean | null
          location_map_url: string | null
          location_name: string | null
          short_description: string | null
          start_time: string
          title: string
        }
        Insert: {
          allow_google_map_link?: boolean | null
          allow_ics_download?: boolean | null
          allow_reminders?: boolean | null
          allow_rsvp?: boolean | null
          created_at?: string | null
          created_by?: string | null
          end_time: string
          event_host_contact?: string | null
          event_host_name?: string | null
          event_type?: string | null
          event_types?: string[] | null
          feature_image_url?: string | null
          full_description?: string | null
          id?: string
          image_url?: string | null
          is_private?: boolean | null
          is_public?: boolean | null
          location_map_url?: string | null
          location_name?: string | null
          short_description?: string | null
          start_time: string
          title: string
        }
        Update: {
          allow_google_map_link?: boolean | null
          allow_ics_download?: boolean | null
          allow_reminders?: boolean | null
          allow_rsvp?: boolean | null
          created_at?: string | null
          created_by?: string | null
          end_time?: string
          event_host_contact?: string | null
          event_host_name?: string | null
          event_type?: string | null
          event_types?: string[] | null
          feature_image_url?: string | null
          full_description?: string | null
          id?: string
          image_url?: string | null
          is_private?: boolean | null
          is_public?: boolean | null
          location_map_url?: string | null
          location_name?: string | null
          short_description?: string | null
          start_time?: string
          title?: string
        }
        Relationships: []
      }
      fan_tags: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          label: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          label: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          label?: string
        }
        Relationships: []
      }
      fans: {
        Row: {
          created_at: string
          email: string
          favorite_memory: string | null
          full_name: string
          id: string
          notes: string | null
          tags: string[] | null
        }
        Insert: {
          created_at?: string
          email: string
          favorite_memory?: string | null
          full_name: string
          id?: string
          notes?: string | null
          tags?: string[] | null
        }
        Update: {
          created_at?: string
          email?: string
          favorite_memory?: string | null
          full_name?: string
          id?: string
          notes?: string | null
          tags?: string[] | null
        }
        Relationships: []
      }
      media_library: {
        Row: {
          created_at: string
          description: string | null
          display_order: number | null
          file_path: string
          file_type: string
          file_url: string
          folder: string | null
          hero_tag: string | null
          id: string
          is_hero: boolean | null
          is_public: boolean | null
          size: number | null
          tags: string[] | null
          title: string
          uploaded_by: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_order?: number | null
          file_path: string
          file_type: string
          file_url: string
          folder?: string | null
          hero_tag?: string | null
          id?: string
          is_hero?: boolean | null
          is_public?: boolean | null
          size?: number | null
          tags?: string[] | null
          title: string
          uploaded_by: string
        }
        Update: {
          created_at?: string
          description?: string | null
          display_order?: number | null
          file_path?: string
          file_type?: string
          file_url?: string
          folder?: string | null
          hero_tag?: string | null
          id?: string
          is_hero?: boolean | null
          is_public?: boolean | null
          size?: number | null
          tags?: string[] | null
          title?: string
          uploaded_by?: string
        }
        Relationships: []
      }
      member_notes: {
        Row: {
          created_at: string
          created_by: string
          id: string
          member_id: string
          note: string
        }
        Insert: {
          created_at?: string
          created_by: string
          id?: string
          member_id: string
          note: string
        }
        Update: {
          created_at?: string
          created_by?: string
          id?: string
          member_id?: string
          note?: string
        }
        Relationships: [
          {
            foreignKeyName: "member_notes_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "member_notes_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "user_management_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "member_notes_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "member_notes_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "user_management_view"
            referencedColumns: ["id"]
          },
        ]
      }
      member_uploads: {
        Row: {
          created_at: string | null
          description: string | null
          file_name: string
          file_path: string
          file_type: string
          file_url: string
          id: string
          member_id: string | null
          upload_category: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          file_name: string
          file_path: string
          file_type: string
          file_url: string
          id?: string
          member_id?: string | null
          upload_category: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          file_name?: string
          file_path?: string
          file_type?: string
          file_url?: string
          id?: string
          member_id?: string | null
          upload_category?: string
        }
        Relationships: [
          {
            foreignKeyName: "member_uploads_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "member_uploads_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "user_management_view"
            referencedColumns: ["id"]
          },
        ]
      }
      metronome_presets: {
        Row: {
          bpm: number
          created_at: string
          id: string
          label: string
          user_id: string
        }
        Insert: {
          bpm: number
          created_at?: string
          id?: string
          label: string
          user_id: string
        }
        Update: {
          bpm?: number
          created_at?: string
          id?: string
          label?: string
          user_id?: string
        }
        Relationships: []
      }
      mixed_recordings: {
        Row: {
          backing_track_id: string | null
          backing_volume: number | null
          created_at: string
          description: string | null
          id: string
          recording_file_path: string
          recording_file_url: string
          title: string
          user_id: string
          vocal_volume: number | null
        }
        Insert: {
          backing_track_id?: string | null
          backing_volume?: number | null
          created_at?: string
          description?: string | null
          id?: string
          recording_file_path: string
          recording_file_url: string
          title: string
          user_id: string
          vocal_volume?: number | null
        }
        Update: {
          backing_track_id?: string | null
          backing_volume?: number | null
          created_at?: string
          description?: string | null
          id?: string
          recording_file_path?: string
          recording_file_url?: string
          title?: string
          user_id?: string
          vocal_volume?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "mixed_recordings_backing_track_id_fkey"
            columns: ["backing_track_id"]
            isOneToOne: false
            referencedRelation: "audio_files"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          amount: number
          created_at: string
          currency: string | null
          customer_email: string
          customer_name: string | null
          id: string
          items: Json
          shipping_address: Json | null
          status: string | null
          stripe_session_id: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string | null
          customer_email: string
          customer_name?: string | null
          id?: string
          items?: Json
          shipping_address?: Json | null
          status?: string | null
          stripe_session_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string | null
          customer_email?: string
          customer_name?: string | null
          id?: string
          items?: Json
          shipping_address?: Json | null
          status?: string | null
          stripe_session_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      payment_records: {
        Row: {
          amount: number
          created_at: string
          description: string | null
          id: string
          member_id: string
          payment_date: string
          payment_method: string
          status: string
        }
        Insert: {
          amount: number
          created_at?: string
          description?: string | null
          id?: string
          member_id: string
          payment_date: string
          payment_method: string
          status: string
        }
        Update: {
          amount?: number
          created_at?: string
          description?: string | null
          id?: string
          member_id?: string
          payment_date?: string
          payment_method?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_records_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_records_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "user_management_view"
            referencedColumns: ["id"]
          },
        ]
      }
      pdf_annotations: {
        Row: {
          annotation_type: string | null
          annotations: Json
          created_at: string
          id: string
          is_visible: boolean | null
          page_number: number | null
          sheet_music_id: string
          source_table: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          annotation_type?: string | null
          annotations?: Json
          created_at?: string
          id?: string
          is_visible?: boolean | null
          page_number?: number | null
          sheet_music_id: string
          source_table?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          annotation_type?: string | null
          annotations?: Json
          created_at?: string
          id?: string
          is_visible?: boolean | null
          page_number?: number | null
          sheet_music_id?: string
          source_table?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      pdf_bookmarks: {
        Row: {
          created_at: string
          id: string
          page_number: number
          sheet_music_id: string
          title: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          page_number: number
          sheet_music_id: string
          title?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          page_number?: number
          sheet_music_id?: string
          title?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "pdf_bookmarks_sheet_music_id_fkey"
            columns: ["sheet_music_id"]
            isOneToOne: false
            referencedRelation: "sheet_music"
            referencedColumns: ["id"]
          },
        ]
      }
      permissions: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      pitch_recordings: {
        Row: {
          created_at: string
          data: Json
          id: string
          name: string
          user_id: string
        }
        Insert: {
          created_at?: string
          data: Json
          id?: string
          name: string
          user_id: string
        }
        Update: {
          created_at?: string
          data?: Json
          id?: string
          name?: string
          user_id?: string
        }
        Relationships: []
      }
      poll_votes: {
        Row: {
          created_at: string | null
          id: string
          member_id: string | null
          option_index: number
          poll_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          member_id?: string | null
          option_index: number
          poll_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          member_id?: string | null
          option_index?: number
          poll_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "poll_votes_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "poll_votes_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "user_management_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "poll_votes_poll_id_fkey"
            columns: ["poll_id"]
            isOneToOne: false
            referencedRelation: "polls"
            referencedColumns: ["id"]
          },
        ]
      }
      polls: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          expires_at: string | null
          id: string
          is_active: boolean | null
          options: Json
          title: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          options: Json
          title: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          options?: Json
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "polls_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "polls_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "user_management_view"
            referencedColumns: ["id"]
          },
        ]
      }
      practice_logs: {
        Row: {
          category: string
          created_at: string
          date: string
          description: string | null
          id: string
          minutes_practiced: number
          updated_at: string
          user_id: string
        }
        Insert: {
          category: string
          created_at?: string
          date?: string
          description?: string | null
          id?: string
          minutes_practiced: number
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string
          created_at?: string
          date?: string
          description?: string | null
          id?: string
          minutes_practiced?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          created_at: string | null
          featured: boolean | null
          id: string
          image_url: string | null
          is_active: boolean | null
          name: string
          price: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          featured?: boolean | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name: string
          price: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          featured?: boolean | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name?: string
          price?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          class_year: string | null
          created_at: string
          disabled: boolean | null
          dues_paid: boolean | null
          first_name: string | null
          id: string
          is_super_admin: boolean | null
          join_date: string | null
          last_name: string | null
          notes: string | null
          phone: string | null
          role: string | null
          special_roles: string | null
          status: string | null
          title: Database["public"]["Enums"]["user_title"] | null
          updated_at: string
          voice_part: string | null
        }
        Insert: {
          avatar_url?: string | null
          class_year?: string | null
          created_at?: string
          disabled?: boolean | null
          dues_paid?: boolean | null
          first_name?: string | null
          id: string
          is_super_admin?: boolean | null
          join_date?: string | null
          last_name?: string | null
          notes?: string | null
          phone?: string | null
          role?: string | null
          special_roles?: string | null
          status?: string | null
          title?: Database["public"]["Enums"]["user_title"] | null
          updated_at?: string
          voice_part?: string | null
        }
        Update: {
          avatar_url?: string | null
          class_year?: string | null
          created_at?: string
          disabled?: boolean | null
          dues_paid?: boolean | null
          first_name?: string | null
          id?: string
          is_super_admin?: boolean | null
          join_date?: string | null
          last_name?: string | null
          notes?: string | null
          phone?: string | null
          role?: string | null
          special_roles?: string | null
          status?: string | null
          title?: Database["public"]["Enums"]["user_title"] | null
          updated_at?: string
          voice_part?: string | null
        }
        Relationships: []
      }
      role_permissions: {
        Row: {
          granted: boolean
          id: string
          permission: Database["public"]["Enums"]["permission_name"]
          role_id: string | null
        }
        Insert: {
          granted?: boolean
          id?: string
          permission: Database["public"]["Enums"]["permission_name"]
          role_id?: string | null
        }
        Update: {
          granted?: boolean
          id?: string
          permission?: Database["public"]["Enums"]["permission_name"]
          role_id?: string | null
        }
        Relationships: []
      }
      setlists: {
        Row: {
          concert_date: string | null
          created_at: string
          id: string
          name: string
          sheet_music_ids: string[] | null
          user_id: string
        }
        Insert: {
          concert_date?: string | null
          created_at?: string
          id?: string
          name: string
          sheet_music_ids?: string[] | null
          user_id: string
        }
        Update: {
          concert_date?: string | null
          created_at?: string
          id?: string
          name?: string
          sheet_music_ids?: string[] | null
          user_id?: string
        }
        Relationships: []
      }
      sheet_music: {
        Row: {
          composer: string
          created_at: string
          file_path: string
          file_url: string
          id: string
          title: string
          uploaded_by: string
          voicing: string | null
        }
        Insert: {
          composer: string
          created_at?: string
          file_path: string
          file_url: string
          id?: string
          title: string
          uploaded_by: string
          voicing?: string | null
        }
        Update: {
          composer?: string
          created_at?: string
          file_path?: string
          file_url?: string
          id?: string
          title?: string
          uploaded_by?: string
          voicing?: string | null
        }
        Relationships: []
      }
      site_images: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          file_path: string
          file_url: string
          id: string
          name: string
          position: number | null
          updated_at: string | null
          uploaded_by: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          file_path: string
          file_url: string
          id?: string
          name: string
          position?: number | null
          updated_at?: string | null
          uploaded_by?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          file_path?: string
          file_url?: string
          id?: string
          name?: string
          position?: number | null
          updated_at?: string | null
          uploaded_by?: string | null
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          id: string
          key: string
          updated_at: string | null
          updated_by: string | null
          value: Json | null
        }
        Insert: {
          id?: string
          key: string
          updated_at?: string | null
          updated_by?: string | null
          value?: Json | null
        }
        Update: {
          id?: string
          key?: string
          updated_at?: string | null
          updated_by?: string | null
          value?: Json | null
        }
        Relationships: []
      }
      title_permissions: {
        Row: {
          created_at: string
          granted: boolean
          id: string
          permission_id: string
          title_id: string
        }
        Insert: {
          created_at?: string
          granted?: boolean
          id?: string
          permission_id: string
          title_id: string
        }
        Update: {
          created_at?: string
          granted?: boolean
          id?: string
          permission_id?: string
          title_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "title_permissions_permission_id_fkey"
            columns: ["permission_id"]
            isOneToOne: false
            referencedRelation: "permissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "title_permissions_title_id_fkey"
            columns: ["title_id"]
            isOneToOne: false
            referencedRelation: "user_titles"
            referencedColumns: ["id"]
          },
        ]
      }
      tour_assignments: {
        Row: {
          created_at: string | null
          id: string
          member_id: string | null
          room_number: string | null
          roommate_id: string | null
          tour_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          member_id?: string | null
          room_number?: string | null
          roommate_id?: string | null
          tour_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          member_id?: string | null
          room_number?: string | null
          roommate_id?: string | null
          tour_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tour_assignments_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tour_assignments_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "user_management_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tour_assignments_roommate_id_fkey"
            columns: ["roommate_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tour_assignments_roommate_id_fkey"
            columns: ["roommate_id"]
            isOneToOne: false
            referencedRelation: "user_management_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tour_assignments_tour_id_fkey"
            columns: ["tour_id"]
            isOneToOne: false
            referencedRelation: "tours"
            referencedColumns: ["id"]
          },
        ]
      }
      tours: {
        Row: {
          created_at: string | null
          end_date: string
          id: string
          is_active: boolean | null
          itinerary: Json | null
          name: string
          packing_guide: string | null
          start_date: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          end_date: string
          id?: string
          is_active?: boolean | null
          itinerary?: Json | null
          name: string
          packing_guide?: string | null
          start_date: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          end_date?: string
          id?: string
          is_active?: boolean | null
          itinerary?: Json | null
          name?: string
          packing_guide?: string | null
          start_date?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      uniform_assignments: {
        Row: {
          checked_in_at: string | null
          checked_out_at: string | null
          id: string
          member_id: string | null
          notes: string | null
          uniform_item_id: string | null
        }
        Insert: {
          checked_in_at?: string | null
          checked_out_at?: string | null
          id?: string
          member_id?: string | null
          notes?: string | null
          uniform_item_id?: string | null
        }
        Update: {
          checked_in_at?: string | null
          checked_out_at?: string | null
          id?: string
          member_id?: string | null
          notes?: string | null
          uniform_item_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "uniform_assignments_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "uniform_assignments_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "user_management_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "uniform_assignments_uniform_item_id_fkey"
            columns: ["uniform_item_id"]
            isOneToOne: false
            referencedRelation: "uniform_items"
            referencedColumns: ["id"]
          },
        ]
      }
      uniform_items: {
        Row: {
          condition: string | null
          created_at: string | null
          id: string
          is_available: boolean | null
          item_number: string | null
          item_type: string
          size: string | null
        }
        Insert: {
          condition?: string | null
          created_at?: string | null
          id?: string
          is_available?: boolean | null
          item_number?: string | null
          item_type: string
          size?: string | null
        }
        Update: {
          condition?: string | null
          created_at?: string | null
          id?: string
          is_available?: boolean | null
          item_number?: string | null
          item_type?: string
          size?: string | null
        }
        Relationships: []
      }
      user_messages: {
        Row: {
          content: string
          created_at: string
          id: string
          message_type: string
          recipient: string
          sent_at: string | null
          status: string
          subject: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          message_type: string
          recipient: string
          sent_at?: string | null
          status?: string
          subject?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          message_type?: string
          recipient?: string
          sent_at?: string | null
          status?: string
          subject?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_notifications: {
        Row: {
          created_at: string
          expires_at: string | null
          id: string
          is_read: boolean
          message: string
          related_event_id: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          expires_at?: string | null
          id?: string
          is_read?: boolean
          message: string
          related_event_id?: string | null
          title: string
          type?: string
          user_id: string
        }
        Update: {
          created_at?: string
          expires_at?: string | null
          id?: string
          is_read?: boolean
          message?: string
          related_event_id?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_notifications_related_event_id_fkey"
            columns: ["related_event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      user_permissions: {
        Row: {
          created_at: string
          granted: boolean
          id: string
          permission_name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          granted?: boolean
          id?: string
          permission_name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          granted?: boolean
          id?: string
          permission_name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_settings: {
        Row: {
          created_at: string | null
          email_opt_in: boolean | null
          event_reminders: boolean | null
          newsletter_opt_in: boolean | null
          order_confirmations: boolean | null
          sms_opt_in: boolean | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          email_opt_in?: boolean | null
          event_reminders?: boolean | null
          newsletter_opt_in?: boolean | null
          order_confirmations?: boolean | null
          sms_opt_in?: boolean | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          email_opt_in?: boolean | null
          event_reminders?: boolean | null
          newsletter_opt_in?: boolean | null
          order_confirmations?: boolean | null
          sms_opt_in?: boolean | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_titles: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      user_management_view: {
        Row: {
          avatar_url: string | null
          class_year: string | null
          created_at: string | null
          disabled: boolean | null
          dues_paid: boolean | null
          email: string | null
          first_name: string | null
          full_name: string | null
          id: string | null
          is_super_admin: boolean | null
          join_date: string | null
          last_name: string | null
          last_sign_in_at: string | null
          notes: string | null
          phone: string | null
          role: string | null
          status: string | null
          voice_part: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      admin_invite_user: {
        Args: {
          user_email: string
          user_role?: string
          first_name?: string
          last_name?: string
        }
        Returns: string
      }
      admin_toggle_user_status: {
        Args: { target_user_id: string; is_disabled: boolean }
        Returns: boolean
      }
      admin_update_user_role: {
        Args: { target_user_id: string; new_role: string }
        Returns: boolean
      }
      get_all_users: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          email: string
          first_name: string
          last_name: string
          phone: string
          role: string
          voice_part: string
          avatar_url: string
          status: string
          join_date: string
          created_at: string
          last_sign_in_at: string
          role_display_name: string
          voice_part_display: string
        }[]
      }
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_user_by_id: {
        Args: { p_user_id: string }
        Returns: {
          id: string
          email: string
          first_name: string
          last_name: string
          phone: string
          role: string
          voice_part: string
          avatar_url: string
          status: string
          join_date: string
          created_at: string
          last_sign_in_at: string
          role_display_name: string
          voice_part_display: string
        }[]
      }
      get_user_permissions: {
        Args: { p_user_id: string }
        Returns: {
          permission: Database["public"]["Enums"]["permission_name"]
          granted: boolean
        }[]
      }
      get_user_permissions_dynamic: {
        Args: { p_user_id: string }
        Returns: {
          permission: string
          granted: boolean
        }[]
      }
      handle_user_role: {
        Args: { p_user_id: string; p_role: string }
        Returns: undefined
      }
      has_permission: {
        Args: {
          p_user_id: string
          p_permission: Database["public"]["Enums"]["permission_name"]
        }
        Returns: boolean
      }
      initialize_user_permissions: {
        Args: { p_user_id: string }
        Returns: undefined
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_self_or_admin: {
        Args: { profile_user_id: string }
        Returns: boolean
      }
      is_user_admin: {
        Args: { user_id: string }
        Returns: boolean
      }
      update_user_status: {
        Args: { p_user_id: string; p_status: string }
        Returns: undefined
      }
      update_user_title_dynamic: {
        Args: { p_user_id: string; p_title: string }
        Returns: boolean
      }
    }
    Enums: {
      permission_name:
        | "can_view_financials"
        | "can_edit_financials"
        | "can_upload_sheet_music"
        | "can_view_sheet_music"
        | "can_edit_attendance"
        | "can_view_attendance"
        | "can_view_wardrobe"
        | "can_edit_wardrobe"
        | "can_upload_media"
        | "can_manage_tour"
        | "can_manage_stage"
        | "can_view_prayer_box"
        | "can_post_announcements"
        | "can_manage_users"
        | "can_manage_archives"
        | "can_post_social"
        | "can_view_travel_logistics"
        | "can_manage_spiritual_events"
        | "can_grade_submissions"
        | "can_upload_documents"
        | "can_view_events"
        | "can_submit_absence_form"
      user_title:
        | "Super Admin"
        | "Treasurer"
        | "Librarian"
        | "Wardrobe Mistress"
        | "Secretary"
        | "President"
        | "Historian"
        | "PR Manager"
        | "Tour Manager"
        | "Stage Manager"
        | "Chaplain"
        | "Section Leader"
        | "Student Worker"
        | "General Member"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      permission_name: [
        "can_view_financials",
        "can_edit_financials",
        "can_upload_sheet_music",
        "can_view_sheet_music",
        "can_edit_attendance",
        "can_view_attendance",
        "can_view_wardrobe",
        "can_edit_wardrobe",
        "can_upload_media",
        "can_manage_tour",
        "can_manage_stage",
        "can_view_prayer_box",
        "can_post_announcements",
        "can_manage_users",
        "can_manage_archives",
        "can_post_social",
        "can_view_travel_logistics",
        "can_manage_spiritual_events",
        "can_grade_submissions",
        "can_upload_documents",
        "can_view_events",
        "can_submit_absence_form",
      ],
      user_title: [
        "Super Admin",
        "Treasurer",
        "Librarian",
        "Wardrobe Mistress",
        "Secretary",
        "President",
        "Historian",
        "PR Manager",
        "Tour Manager",
        "Stage Manager",
        "Chaplain",
        "Section Leader",
        "Student Worker",
        "General Member",
      ],
    },
  },
} as const
