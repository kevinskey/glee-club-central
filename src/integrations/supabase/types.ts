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
      ai_settings: {
        Row: {
          enabled: boolean | null
          feature_name: string
          id: string
          settings: Json | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          enabled?: boolean | null
          feature_name: string
          id?: string
          settings?: Json | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          enabled?: boolean | null
          feature_name?: string
          id?: string
          settings?: Json | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      analytics_events: {
        Row: {
          created_at: string
          event_type: string
          feature_used: string | null
          id: string
          ip_address: unknown | null
          metadata: Json | null
          page_path: string | null
          session_duration: number | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          event_type: string
          feature_used?: string | null
          id?: string
          ip_address?: unknown | null
          metadata?: Json | null
          page_path?: string | null
          session_duration?: number | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          event_type?: string
          feature_used?: string | null
          id?: string
          ip_address?: unknown | null
          metadata?: Json | null
          page_path?: string | null
          session_duration?: number | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      announcement_recipients: {
        Row: {
          announcement_id: string | null
          delivered_at: string | null
          delivery_method: string | null
          id: string
          read_at: string | null
          user_id: string | null
        }
        Insert: {
          announcement_id?: string | null
          delivered_at?: string | null
          delivery_method?: string | null
          id?: string
          read_at?: string | null
          user_id?: string | null
        }
        Update: {
          announcement_id?: string | null
          delivered_at?: string | null
          delivery_method?: string | null
          id?: string
          read_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "announcement_recipients_announcement_id_fkey"
            columns: ["announcement_id"]
            isOneToOne: false
            referencedRelation: "announcements"
            referencedColumns: ["id"]
          },
        ]
      }
      announcements: {
        Row: {
          ai_generated: boolean | null
          content: string
          created_at: string | null
          created_by: string | null
          delivery_methods: string[] | null
          id: string
          scheduled_for: string | null
          sent_at: string | null
          target_audience: Json | null
          title: string
        }
        Insert: {
          ai_generated?: boolean | null
          content: string
          created_at?: string | null
          created_by?: string | null
          delivery_methods?: string[] | null
          id?: string
          scheduled_for?: string | null
          sent_at?: string | null
          target_audience?: Json | null
          title: string
        }
        Update: {
          ai_generated?: boolean | null
          content?: string
          created_at?: string | null
          created_by?: string | null
          delivery_methods?: string[] | null
          id?: string
          scheduled_for?: string | null
          sent_at?: string | null
          target_audience?: Json | null
          title?: string
        }
        Relationships: []
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
      audio_tracks: {
        Row: {
          created_at: string | null
          id: string
          label: string | null
          page_number: number | null
          score_id: string
          timecode: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          label?: string | null
          page_number?: number | null
          score_id: string
          timecode: number
        }
        Update: {
          created_at?: string | null
          id?: string
          label?: string | null
          page_number?: number | null
          score_id?: string
          timecode?: number
        }
        Relationships: [
          {
            foreignKeyName: "audio_tracks_score_id_fkey"
            columns: ["score_id"]
            isOneToOne: false
            referencedRelation: "scores"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string | null
          id: string
          new_values: Json | null
          old_values: Json | null
          record_id: string | null
          table_name: string
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          id?: string
          new_values?: Json | null
          old_values?: Json | null
          record_id?: string | null
          table_name: string
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          id?: string
          new_values?: Json | null
          old_values?: Json | null
          record_id?: string | null
          table_name?: string
          user_id?: string | null
        }
        Relationships: []
      }
      budget_entries: {
        Row: {
          amount: number
          category: string
          created_at: string
          id: string
          purpose: string | null
          receipt_url: string | null
          updated_at: string
          uploaded_by: string | null
        }
        Insert: {
          amount: number
          category: string
          created_at?: string
          id?: string
          purpose?: string | null
          receipt_url?: string | null
          updated_at?: string
          uploaded_by?: string | null
        }
        Update: {
          amount?: number
          category?: string
          created_at?: string
          id?: string
          purpose?: string | null
          receipt_url?: string | null
          updated_at?: string
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "budget_entries_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "budget_entries_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "user_management_view"
            referencedColumns: ["id"]
          },
        ]
      }
      cash_log: {
        Row: {
          action: string
          amount: number
          id: string
          logged_by: string | null
          notes: string | null
          timestamp: string
        }
        Insert: {
          action: string
          amount: number
          id?: string
          logged_by?: string | null
          notes?: string | null
          timestamp?: string
        }
        Update: {
          action?: string
          amount?: number
          id?: string
          logged_by?: string | null
          notes?: string | null
          timestamp?: string
        }
        Relationships: [
          {
            foreignKeyName: "cash_log_logged_by_fkey"
            columns: ["logged_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cash_log_logged_by_fkey"
            columns: ["logged_by"]
            isOneToOne: false
            referencedRelation: "user_management_view"
            referencedColumns: ["id"]
          },
        ]
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
      design_assets: {
        Row: {
          extracted_at: string | null
          extracted_files: Json | null
          extraction_status: string | null
          file_name: string
          file_path: string
          file_size: number
          file_type: string
          id: string
          uploaded_at: string
          uploaded_by: string
        }
        Insert: {
          extracted_at?: string | null
          extracted_files?: Json | null
          extraction_status?: string | null
          file_name: string
          file_path: string
          file_size: number
          file_type: string
          id?: string
          uploaded_at?: string
          uploaded_by: string
        }
        Update: {
          extracted_at?: string | null
          extracted_files?: Json | null
          extraction_status?: string | null
          file_name?: string
          file_path?: string
          file_size?: number
          file_type?: string
          id?: string
          uploaded_at?: string
          uploaded_by?: string
        }
        Relationships: []
      }
      dues: {
        Row: {
          amount_owed: number
          amount_paid: number
          created_at: string
          date_paid: string | null
          id: string
          member_id: string | null
          notes: string | null
          updated_at: string
        }
        Insert: {
          amount_owed?: number
          amount_paid?: number
          created_at?: string
          date_paid?: string | null
          id?: string
          member_id?: string | null
          notes?: string | null
          updated_at?: string
        }
        Update: {
          amount_owed?: number
          amount_paid?: number
          created_at?: string
          date_paid?: string | null
          id?: string
          member_id?: string | null
          notes?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "dues_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dues_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "user_management_view"
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
          ai_suggested_title: string | null
          allow_google_map_link: boolean | null
          allow_ics_download: boolean | null
          allow_reminders: boolean | null
          allow_rsvp: boolean | null
          call_time: string | null
          conflict_detected: boolean | null
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
          is_recurring: boolean | null
          location_map_url: string | null
          location_name: string | null
          parent_event_id: string | null
          recurrence_count: number | null
          recurrence_end_date: string | null
          recurrence_interval: number | null
          recurrence_pattern: string | null
          short_description: string | null
          start_time: string
          title: string
        }
        Insert: {
          ai_suggested_title?: string | null
          allow_google_map_link?: boolean | null
          allow_ics_download?: boolean | null
          allow_reminders?: boolean | null
          allow_rsvp?: boolean | null
          call_time?: string | null
          conflict_detected?: boolean | null
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
          is_recurring?: boolean | null
          location_map_url?: string | null
          location_name?: string | null
          parent_event_id?: string | null
          recurrence_count?: number | null
          recurrence_end_date?: string | null
          recurrence_interval?: number | null
          recurrence_pattern?: string | null
          short_description?: string | null
          start_time: string
          title: string
        }
        Update: {
          ai_suggested_title?: string | null
          allow_google_map_link?: boolean | null
          allow_ics_download?: boolean | null
          allow_reminders?: boolean | null
          allow_rsvp?: boolean | null
          call_time?: string | null
          conflict_detected?: boolean | null
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
          is_recurring?: boolean | null
          location_map_url?: string | null
          location_name?: string | null
          parent_event_id?: string | null
          recurrence_count?: number | null
          recurrence_end_date?: string | null
          recurrence_interval?: number | null
          recurrence_pattern?: string | null
          short_description?: string | null
          start_time?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "events_parent_event_id_fkey"
            columns: ["parent_event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
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
      financial_budgets: {
        Row: {
          academic_year: string
          budgeted_amount: number
          category: string
          created_at: string | null
          created_by: string
          id: string
          notes: string | null
          semester: string | null
          updated_at: string | null
        }
        Insert: {
          academic_year: string
          budgeted_amount: number
          category: string
          created_at?: string | null
          created_by: string
          id?: string
          notes?: string | null
          semester?: string | null
          updated_at?: string | null
        }
        Update: {
          academic_year?: string
          budgeted_amount?: number
          category?: string
          created_at?: string | null
          created_by?: string
          id?: string
          notes?: string | null
          semester?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "financial_budgets_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_budgets_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "user_management_view"
            referencedColumns: ["id"]
          },
        ]
      }
      financial_categories: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          type: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          type: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          type?: string
        }
        Relationships: []
      }
      financial_transactions: {
        Row: {
          amount: number
          approved_at: string | null
          approved_by: string | null
          category: string
          created_at: string | null
          created_by: string
          date: string
          description: string
          id: string
          member_id: string | null
          notes: string | null
          payment_method: string | null
          receipt_url: string | null
          reference_id: string | null
          reference_type: string | null
          status: string | null
          subcategory: string | null
          transaction_type: string
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          amount: number
          approved_at?: string | null
          approved_by?: string | null
          category: string
          created_at?: string | null
          created_by: string
          date?: string
          description: string
          id?: string
          member_id?: string | null
          notes?: string | null
          payment_method?: string | null
          receipt_url?: string | null
          reference_id?: string | null
          reference_type?: string | null
          status?: string | null
          subcategory?: string | null
          transaction_type: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          amount?: number
          approved_at?: string | null
          approved_by?: string | null
          category?: string
          created_at?: string | null
          created_by?: string
          date?: string
          description?: string
          id?: string
          member_id?: string | null
          notes?: string | null
          payment_method?: string | null
          receipt_url?: string | null
          reference_id?: string | null
          reference_type?: string | null
          status?: string | null
          subcategory?: string | null
          transaction_type?: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "financial_transactions_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_transactions_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "user_management_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_transactions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_transactions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "user_management_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_transactions_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_transactions_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "user_management_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_transactions_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_transactions_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "user_management_view"
            referencedColumns: ["id"]
          },
        ]
      }
      hero_settings: {
        Row: {
          animation_style: string | null
          created_at: string | null
          id: string
          loop: boolean | null
          pause_on_hover: boolean | null
          scroll_interval: number | null
          spacing_settings: Json | null
          updated_at: string | null
        }
        Insert: {
          animation_style?: string | null
          created_at?: string | null
          id?: string
          loop?: boolean | null
          pause_on_hover?: boolean | null
          scroll_interval?: number | null
          spacing_settings?: Json | null
          updated_at?: string | null
        }
        Update: {
          animation_style?: string | null
          created_at?: string | null
          id?: string
          loop?: boolean | null
          pause_on_hover?: boolean | null
          scroll_interval?: number | null
          spacing_settings?: Json | null
          updated_at?: string | null
        }
        Relationships: []
      }
      hero_slides: {
        Row: {
          button_link: string | null
          button_text: string | null
          created_at: string | null
          description: string | null
          id: string
          media_id: string | null
          media_type: string | null
          section_id: string | null
          show_title: boolean | null
          slide_order: number | null
          text_alignment: string | null
          text_position: string | null
          title: string
          updated_at: string | null
          visible: boolean | null
          youtube_url: string | null
        }
        Insert: {
          button_link?: string | null
          button_text?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          media_id?: string | null
          media_type?: string | null
          section_id?: string | null
          show_title?: boolean | null
          slide_order?: number | null
          text_alignment?: string | null
          text_position?: string | null
          title?: string
          updated_at?: string | null
          visible?: boolean | null
          youtube_url?: string | null
        }
        Update: {
          button_link?: string | null
          button_text?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          media_id?: string | null
          media_type?: string | null
          section_id?: string | null
          show_title?: boolean | null
          slide_order?: number | null
          text_alignment?: string | null
          text_position?: string | null
          title?: string
          updated_at?: string | null
          visible?: boolean | null
          youtube_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "hero_slides_media_id_fkey"
            columns: ["media_id"]
            isOneToOne: false
            referencedRelation: "media_library"
            referencedColumns: ["id"]
          },
        ]
      }
      karaoke_tracks: {
        Row: {
          artist: string
          created_at: string
          duration: string | null
          file_path: string
          file_url: string
          id: string
          title: string
          updated_at: string
          uploaded_by: string
        }
        Insert: {
          artist?: string
          created_at?: string
          duration?: string | null
          file_path: string
          file_url: string
          id?: string
          title: string
          updated_at?: string
          uploaded_by: string
        }
        Update: {
          artist?: string
          created_at?: string
          duration?: string | null
          file_path?: string
          file_url?: string
          id?: string
          title?: string
          updated_at?: string
          uploaded_by?: string
        }
        Relationships: []
      }
      media_library: {
        Row: {
          created_at: string
          description: string | null
          display_order: number | null
          event_id: string | null
          file_path: string
          file_type: string
          file_url: string
          folder: string | null
          hero_tag: string | null
          id: string
          is_hero: boolean | null
          is_internal: boolean | null
          is_public: boolean | null
          size: number | null
          tags: string[] | null
          title: string
          uploaded_by: string
          year_tag: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_order?: number | null
          event_id?: string | null
          file_path: string
          file_type: string
          file_url: string
          folder?: string | null
          hero_tag?: string | null
          id?: string
          is_hero?: boolean | null
          is_internal?: boolean | null
          is_public?: boolean | null
          size?: number | null
          tags?: string[] | null
          title: string
          uploaded_by: string
          year_tag?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          display_order?: number | null
          event_id?: string | null
          file_path?: string
          file_type?: string
          file_url?: string
          folder?: string | null
          hero_tag?: string | null
          id?: string
          is_hero?: boolean | null
          is_internal?: boolean | null
          is_public?: boolean | null
          size?: number | null
          tags?: string[] | null
          title?: string
          uploaded_by?: string
          year_tag?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "media_library_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
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
      music_analytics: {
        Row: {
          audio_file_id: string | null
          created_at: string | null
          event_type: string
          id: string
          ip_address: unknown | null
          listen_duration: number | null
          session_id: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          audio_file_id?: string | null
          created_at?: string | null
          event_type: string
          id?: string
          ip_address?: unknown | null
          listen_duration?: number | null
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          audio_file_id?: string | null
          created_at?: string | null
          event_type?: string
          id?: string
          ip_address?: unknown | null
          listen_duration?: number | null
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "music_analytics_audio_file_id_fkey"
            columns: ["audio_file_id"]
            isOneToOne: false
            referencedRelation: "audio_files"
            referencedColumns: ["id"]
          },
        ]
      }
      music_files: {
        Row: {
          composer: string | null
          created_at: string | null
          file_path: string
          file_type: string
          filename: string
          id: string
          is_shared: boolean | null
          org: string
          tags: string[] | null
          title: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          composer?: string | null
          created_at?: string | null
          file_path: string
          file_type: string
          filename: string
          id?: string
          is_shared?: boolean | null
          org: string
          tags?: string[] | null
          title?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          composer?: string | null
          created_at?: string | null
          file_path?: string
          file_type?: string
          filename?: string
          id?: string
          is_shared?: boolean | null
          org?: string
          tags?: string[] | null
          title?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      music_player_settings: {
        Row: {
          description: string | null
          id: string
          setting_key: string
          setting_value: Json
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          description?: string | null
          id?: string
          setting_key: string
          setting_value?: Json
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          description?: string | null
          id?: string
          setting_key?: string
          setting_value?: Json
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      news_items: {
        Row: {
          active: boolean
          ai_prompt: string | null
          content: string | null
          created_at: string
          created_by: string | null
          end_date: string | null
          generated_by_ai: boolean
          headline: string
          id: string
          priority: number
          start_date: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          ai_prompt?: string | null
          content?: string | null
          created_at?: string
          created_by?: string | null
          end_date?: string | null
          generated_by_ai?: boolean
          headline: string
          id?: string
          priority?: number
          start_date?: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          ai_prompt?: string | null
          content?: string | null
          created_at?: string
          created_by?: string | null
          end_date?: string | null
          generated_by_ai?: boolean
          headline?: string
          id?: string
          priority?: number
          start_date?: string
          updated_at?: string
        }
        Relationships: []
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
      pdf_files: {
        Row: {
          composer: string | null
          created_at: string
          description: string | null
          file_name: string
          file_path: string
          file_url: string
          id: string
          title: string | null
          updated_at: string
          uploaded_by: string | null
        }
        Insert: {
          composer?: string | null
          created_at?: string
          description?: string | null
          file_name: string
          file_path: string
          file_url: string
          id?: string
          title?: string | null
          updated_at?: string
          uploaded_by?: string | null
        }
        Update: {
          composer?: string | null
          created_at?: string
          description?: string | null
          file_name?: string
          file_path?: string
          file_url?: string
          id?: string
          title?: string | null
          updated_at?: string
          uploaded_by?: string | null
        }
        Relationships: []
      }
      pdf_library: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          file_path: string
          file_size: number | null
          file_url: string
          id: string
          is_public: boolean | null
          tags: string[] | null
          title: string
          updated_at: string
          uploaded_by: string | null
          voice_part: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          file_path: string
          file_size?: number | null
          file_url: string
          id?: string
          is_public?: boolean | null
          tags?: string[] | null
          title: string
          updated_at?: string
          uploaded_by?: string | null
          voice_part?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          file_path?: string
          file_size?: number | null
          file_url?: string
          id?: string
          is_public?: boolean | null
          tags?: string[] | null
          title?: string
          updated_at?: string
          uploaded_by?: string | null
          voice_part?: string | null
        }
        Relationships: []
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
      playlist_tracks: {
        Row: {
          audio_file_id: string | null
          created_at: string | null
          id: string
          is_featured: boolean | null
          playlist_id: string | null
          track_order: number | null
        }
        Insert: {
          audio_file_id?: string | null
          created_at?: string | null
          id?: string
          is_featured?: boolean | null
          playlist_id?: string | null
          track_order?: number | null
        }
        Update: {
          audio_file_id?: string | null
          created_at?: string | null
          id?: string
          is_featured?: boolean | null
          playlist_id?: string | null
          track_order?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "playlist_tracks_audio_file_id_fkey"
            columns: ["audio_file_id"]
            isOneToOne: false
            referencedRelation: "audio_files"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "playlist_tracks_playlist_id_fkey"
            columns: ["playlist_id"]
            isOneToOne: false
            referencedRelation: "playlists"
            referencedColumns: ["id"]
          },
        ]
      }
      playlists: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          display_order: number | null
          id: string
          is_active: boolean | null
          is_homepage_default: boolean | null
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          is_homepage_default?: boolean | null
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          is_homepage_default?: boolean | null
          name?: string
          updated_at?: string | null
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
          recording_id: string | null
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
          recording_id?: string | null
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
          recording_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "practice_logs_recording_id_fkey"
            columns: ["recording_id"]
            isOneToOne: false
            referencedRelation: "track_recordings"
            referencedColumns: ["id"]
          },
        ]
      }
      product_variants: {
        Row: {
          additional_price: number | null
          color: string | null
          created_at: string | null
          id: string
          inventory_count: number | null
          product_id: string | null
          size: string | null
          sku: string | null
        }
        Insert: {
          additional_price?: number | null
          color?: string | null
          created_at?: string | null
          id?: string
          inventory_count?: number | null
          product_id?: string | null
          size?: string | null
          sku?: string | null
        }
        Update: {
          additional_price?: number | null
          color?: string | null
          created_at?: string | null
          id?: string
          inventory_count?: number | null
          product_id?: string | null
          size?: string | null
          sku?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_variants_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          featured: boolean | null
          id: string
          image_url: string | null
          is_active: boolean | null
          name: string
          price: number
          tier: string | null
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          featured?: boolean | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name: string
          price: number
          tier?: string | null
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          featured?: boolean | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name?: string
          price?: number
          tier?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          account_balance: number | null
          avatar_url: string | null
          class_year: string | null
          created_at: string
          current_cart_id: string | null
          default_shipping_address: string | null
          design_history_ids: string[] | null
          disabled: boolean | null
          dues_paid: boolean | null
          ecommerce_enabled: boolean | null
          exec_board_role: string | null
          first_name: string | null
          id: string
          is_exec_board: boolean | null
          is_super_admin: boolean | null
          join_date: string | null
          last_name: string | null
          music_role: string | null
          notes: string | null
          org: string | null
          phone: string | null
          role: string | null
          role_tags: string[] | null
          special_roles: string | null
          status: string | null
          title: Database["public"]["Enums"]["user_title"] | null
          updated_at: string
          voice_part: string | null
        }
        Insert: {
          account_balance?: number | null
          avatar_url?: string | null
          class_year?: string | null
          created_at?: string
          current_cart_id?: string | null
          default_shipping_address?: string | null
          design_history_ids?: string[] | null
          disabled?: boolean | null
          dues_paid?: boolean | null
          ecommerce_enabled?: boolean | null
          exec_board_role?: string | null
          first_name?: string | null
          id: string
          is_exec_board?: boolean | null
          is_super_admin?: boolean | null
          join_date?: string | null
          last_name?: string | null
          music_role?: string | null
          notes?: string | null
          org?: string | null
          phone?: string | null
          role?: string | null
          role_tags?: string[] | null
          special_roles?: string | null
          status?: string | null
          title?: Database["public"]["Enums"]["user_title"] | null
          updated_at?: string
          voice_part?: string | null
        }
        Update: {
          account_balance?: number | null
          avatar_url?: string | null
          class_year?: string | null
          created_at?: string
          current_cart_id?: string | null
          default_shipping_address?: string | null
          design_history_ids?: string[] | null
          disabled?: boolean | null
          dues_paid?: boolean | null
          ecommerce_enabled?: boolean | null
          exec_board_role?: string | null
          first_name?: string | null
          id?: string
          is_exec_board?: boolean | null
          is_super_admin?: boolean | null
          join_date?: string | null
          last_name?: string | null
          music_role?: string | null
          notes?: string | null
          org?: string | null
          phone?: string | null
          role?: string | null
          role_tags?: string[] | null
          special_roles?: string | null
          status?: string | null
          title?: Database["public"]["Enums"]["user_title"] | null
          updated_at?: string
          voice_part?: string | null
        }
        Relationships: []
      }
      recordings: {
        Row: {
          backing_track_artist: string | null
          backing_track_id: string | null
          backing_track_title: string | null
          created_at: string
          description: string | null
          duration: number | null
          file_path: string
          file_url: string
          id: string
          recording_type: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          backing_track_artist?: string | null
          backing_track_id?: string | null
          backing_track_title?: string | null
          created_at?: string
          description?: string | null
          duration?: number | null
          file_path: string
          file_url: string
          id?: string
          recording_type?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          backing_track_artist?: string | null
          backing_track_id?: string | null
          backing_track_title?: string | null
          created_at?: string
          description?: string | null
          duration?: number | null
          file_path?: string
          file_url?: string
          id?: string
          recording_type?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "recordings_backing_track_id_fkey"
            columns: ["backing_track_id"]
            isOneToOne: false
            referencedRelation: "karaoke_tracks"
            referencedColumns: ["id"]
          },
        ]
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
      scheduled_playlists: {
        Row: {
          created_at: string | null
          created_by: string | null
          end_time: string | null
          id: string
          is_active: boolean | null
          playlist_id: string | null
          repeat_schedule: Json | null
          start_time: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          end_time?: string | null
          id?: string
          is_active?: boolean | null
          playlist_id?: string | null
          repeat_schedule?: Json | null
          start_time: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          end_time?: string | null
          id?: string
          is_active?: boolean | null
          playlist_id?: string | null
          repeat_schedule?: Json | null
          start_time?: string
        }
        Relationships: [
          {
            foreignKeyName: "scheduled_playlists_playlist_id_fkey"
            columns: ["playlist_id"]
            isOneToOne: false
            referencedRelation: "playlists"
            referencedColumns: ["id"]
          },
        ]
      }
      score_annotations: {
        Row: {
          annotation_data: Json
          annotation_type: string | null
          created_at: string | null
          id: string
          page_number: number
          score_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          annotation_data?: Json
          annotation_type?: string | null
          created_at?: string | null
          id?: string
          page_number?: number
          score_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          annotation_data?: Json
          annotation_type?: string | null
          created_at?: string | null
          id?: string
          page_number?: number
          score_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "score_annotations_score_id_fkey"
            columns: ["score_id"]
            isOneToOne: false
            referencedRelation: "scores"
            referencedColumns: ["id"]
          },
        ]
      }
      score_bookmarks: {
        Row: {
          created_at: string | null
          id: string
          page_number: number
          score_id: string
          title: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          page_number: number
          score_id: string
          title?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          page_number?: number
          score_id?: string
          title?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "score_bookmarks_score_id_fkey"
            columns: ["score_id"]
            isOneToOne: false
            referencedRelation: "scores"
            referencedColumns: ["id"]
          },
        ]
      }
      scores: {
        Row: {
          audio_url: string | null
          composer: string | null
          created_at: string | null
          difficulty: string | null
          file_path: string
          file_url: string
          genre: string | null
          id: string
          is_favorite: boolean | null
          tags: string[] | null
          title: string
          updated_at: string | null
          uploaded_by: string
          voice_part: string | null
        }
        Insert: {
          audio_url?: string | null
          composer?: string | null
          created_at?: string | null
          difficulty?: string | null
          file_path: string
          file_url: string
          genre?: string | null
          id?: string
          is_favorite?: boolean | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
          uploaded_by: string
          voice_part?: string | null
        }
        Update: {
          audio_url?: string | null
          composer?: string | null
          created_at?: string | null
          difficulty?: string | null
          file_path?: string
          file_url?: string
          genre?: string | null
          id?: string
          is_favorite?: boolean | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
          uploaded_by?: string
          voice_part?: string | null
        }
        Relationships: []
      }
      set_lists: {
        Row: {
          created_at: string
          description: string | null
          id: string
          pdf_file_ids: string[] | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          pdf_file_ids?: string[] | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          pdf_file_ids?: string[] | null
          title?: string
          updated_at?: string
          user_id?: string
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
          audio_url: string | null
          composer: string
          created_at: string
          difficulty: string | null
          file_path: string
          file_url: string
          id: string
          is_favorite: boolean | null
          pdf_url: string | null
          title: string
          uploaded_by: string
          voicing: string | null
        }
        Insert: {
          audio_url?: string | null
          composer: string
          created_at?: string
          difficulty?: string | null
          file_path: string
          file_url: string
          id?: string
          is_favorite?: boolean | null
          pdf_url?: string | null
          title: string
          uploaded_by: string
          voicing?: string | null
        }
        Update: {
          audio_url?: string | null
          composer?: string
          created_at?: string
          difficulty?: string | null
          file_path?: string
          file_url?: string
          id?: string
          is_favorite?: boolean | null
          pdf_url?: string | null
          title?: string
          uploaded_by?: string
          voicing?: string | null
        }
        Relationships: []
      }
      sheet_music_metadata: {
        Row: {
          created_at: string | null
          difficulty_level: string | null
          genre: string | null
          id: string
          language: string | null
          sheet_music_id: string | null
          tags: string[] | null
          updated_at: string | null
          voice_parts: string[] | null
        }
        Insert: {
          created_at?: string | null
          difficulty_level?: string | null
          genre?: string | null
          id?: string
          language?: string | null
          sheet_music_id?: string | null
          tags?: string[] | null
          updated_at?: string | null
          voice_parts?: string[] | null
        }
        Update: {
          created_at?: string | null
          difficulty_level?: string | null
          genre?: string | null
          id?: string
          language?: string | null
          sheet_music_id?: string | null
          tags?: string[] | null
          updated_at?: string | null
          voice_parts?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "sheet_music_metadata_sheet_music_id_fkey"
            columns: ["sheet_music_id"]
            isOneToOne: false
            referencedRelation: "sheet_music"
            referencedColumns: ["id"]
          },
        ]
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
      slide_designs: {
        Row: {
          animation_settings: Json | null
          background_color: string | null
          background_image_url: string | null
          background_media_id: string | null
          created_at: string
          created_by: string | null
          description: string | null
          design_data: Json
          display_order: number
          id: string
          is_active: boolean
          layout_type: string
          link_url: string | null
          template_id: string | null
          title: string
          updated_at: string
        }
        Insert: {
          animation_settings?: Json | null
          background_color?: string | null
          background_image_url?: string | null
          background_media_id?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          design_data?: Json
          display_order?: number
          id?: string
          is_active?: boolean
          layout_type: string
          link_url?: string | null
          template_id?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          animation_settings?: Json | null
          background_color?: string | null
          background_image_url?: string | null
          background_media_id?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          design_data?: Json
          display_order?: number
          id?: string
          is_active?: boolean
          layout_type?: string
          link_url?: string | null
          template_id?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "slide_designs_background_media_id_fkey"
            columns: ["background_media_id"]
            isOneToOne: false
            referencedRelation: "media_library"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "slide_designs_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "slide_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      slide_templates: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          is_active: boolean
          layout_type: string
          name: string
          template_data: Json
          thumbnail_url: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          layout_type: string
          name: string
          template_data?: Json
          thumbnail_url?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          layout_type?: string
          name?: string
          template_data?: Json
          thumbnail_url?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      soundcloud_embeds: {
        Row: {
          artist: string
          created_at: string
          description: string | null
          display_order: number
          id: string
          is_active: boolean
          title: string
          updated_at: string
          url: string
        }
        Insert: {
          artist?: string
          created_at?: string
          description?: string | null
          display_order?: number
          id?: string
          is_active?: boolean
          title: string
          updated_at?: string
          url: string
        }
        Update: {
          artist?: string
          created_at?: string
          description?: string | null
          display_order?: number
          id?: string
          is_active?: boolean
          title?: string
          updated_at?: string
          url?: string
        }
        Relationships: []
      }
      store_items: {
        Row: {
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          is_active: boolean
          name: string
          price: number
          quantity_in_stock: number
          tags: string[] | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          name: string
          price: number
          quantity_in_stock?: number
          tags?: string[] | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          name?: string
          price?: number
          quantity_in_stock?: number
          tags?: string[] | null
          updated_at?: string
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
      top_slider_items: {
        Row: {
          background_color: string | null
          created_at: string
          description: string | null
          display_order: number
          id: string
          image_url: string | null
          link_url: string | null
          media_id: string | null
          text_color: string | null
          title: string
          updated_at: string
          visible: boolean
          youtube_url: string | null
        }
        Insert: {
          background_color?: string | null
          created_at?: string
          description?: string | null
          display_order?: number
          id?: string
          image_url?: string | null
          link_url?: string | null
          media_id?: string | null
          text_color?: string | null
          title: string
          updated_at?: string
          visible?: boolean
          youtube_url?: string | null
        }
        Update: {
          background_color?: string | null
          created_at?: string
          description?: string | null
          display_order?: number
          id?: string
          image_url?: string | null
          link_url?: string | null
          media_id?: string | null
          text_color?: string | null
          title?: string
          updated_at?: string
          visible?: boolean
          youtube_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_top_slider_media"
            columns: ["media_id"]
            isOneToOne: false
            referencedRelation: "media_library"
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
      tour_merch_assignments: {
        Row: {
          assigned_quantity: number
          created_at: string
          created_by: string | null
          event_id: string | null
          id: string
          item_id: string | null
          notes: string | null
          updated_at: string
        }
        Insert: {
          assigned_quantity?: number
          created_at?: string
          created_by?: string | null
          event_id?: string | null
          id?: string
          item_id?: string | null
          notes?: string | null
          updated_at?: string
        }
        Update: {
          assigned_quantity?: number
          created_at?: string
          created_by?: string | null
          event_id?: string | null
          id?: string
          item_id?: string | null
          notes?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tour_merch_assignments_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tour_merch_assignments_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "user_management_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tour_merch_assignments_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tour_merch_assignments_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "store_items"
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
      track_recordings: {
        Row: {
          backing_track_id: string | null
          created_at: string | null
          id: string
          recording_file_path: string
          recording_file_url: string
          share_level: string | null
          title: string
          user_id: string | null
        }
        Insert: {
          backing_track_id?: string | null
          created_at?: string | null
          id?: string
          recording_file_path: string
          recording_file_url: string
          share_level?: string | null
          title: string
          user_id?: string | null
        }
        Update: {
          backing_track_id?: string | null
          created_at?: string | null
          id?: string
          recording_file_path?: string
          recording_file_url?: string
          share_level?: string | null
          title?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "track_recordings_backing_track_id_fkey"
            columns: ["backing_track_id"]
            isOneToOne: false
            referencedRelation: "audio_files"
            referencedColumns: ["id"]
          },
        ]
      }
      treasurer_notes: {
        Row: {
          content: string
          created_at: string
          created_by: string | null
          id: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          created_by?: string | null
          id?: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          created_by?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "treasurer_notes_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "treasurer_notes_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "user_management_view"
            referencedColumns: ["id"]
          },
        ]
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
      user_orders: {
        Row: {
          created_at: string
          id: string
          item_ids: string[]
          shipping_address: string | null
          status: string
          total_price: number
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          item_ids?: string[]
          shipping_address?: string | null
          status?: string
          total_price: number
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          item_ids?: string[]
          shipping_address?: string | null
          status?: string
          total_price?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_orders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_orders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_management_view"
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
      user_role_permissions: {
        Row: {
          created_at: string | null
          enabled: boolean
          id: string
          permission_key: string
          role: string
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          enabled?: boolean
          id?: string
          permission_key: string
          role: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          enabled?: boolean
          id?: string
          permission_key?: string
          role?: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      user_setlists: {
        Row: {
          created_at: string
          id: string
          name: string
          pdf_files: Json | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          pdf_files?: Json | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          pdf_files?: Json | null
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
      youtube_videos: {
        Row: {
          content_type: string
          created_at: string
          description: string | null
          display_order: number
          id: string
          is_active: boolean
          thumbnail_url: string | null
          title: string
          updated_at: string
          youtube_url: string
        }
        Insert: {
          content_type?: string
          created_at?: string
          description?: string | null
          display_order?: number
          id?: string
          is_active?: boolean
          thumbnail_url?: string | null
          title: string
          updated_at?: string
          youtube_url: string
        }
        Update: {
          content_type?: string
          created_at?: string
          description?: string | null
          display_order?: number
          id?: string
          is_active?: boolean
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
          youtube_url?: string
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
      admin_create_user: {
        Args: {
          user_email: string
          user_password?: string
          user_first_name?: string
          user_last_name?: string
          user_role?: string
          user_voice_part?: string
          user_phone?: string
          user_class_year?: string
        }
        Returns: Json
      }
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
      assign_admin_role: {
        Args: { target_user_id: string }
        Returns: boolean
      }
      can_access_profile: {
        Args: { profile_user_id: string }
        Returns: boolean
      }
      can_manage_users: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      check_is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      check_user_is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      current_user_is_super_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      generate_recurring_events: {
        Args: { p_parent_event_id: string; p_max_instances?: number }
        Returns: undefined
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
      get_current_active_playlist: {
        Args: Record<PropertyKey, never>
        Returns: {
          playlist_id: string
          playlist_name: string
          tracks: Json
        }[]
      }
      get_current_user_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_exec_board_role: {
        Args: { user_id?: string }
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
      is_exec_board_member: {
        Args: { user_id?: string }
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
