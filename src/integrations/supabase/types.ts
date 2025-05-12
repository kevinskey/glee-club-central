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
            foreignKeyName: "attendance_records_calendar_event_id_fkey"
            columns: ["calendar_event_id"]
            isOneToOne: false
            referencedRelation: "calendar_events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_records_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "profiles"
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
          title?: string
          uploaded_by?: string
        }
        Relationships: []
      }
      calendar_events: {
        Row: {
          allday: boolean | null
          created_at: string
          date: string
          description: string | null
          google_event_id: string | null
          id: string
          image_url: string | null
          last_synced_at: string | null
          location: string
          time: string
          title: string
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          allday?: boolean | null
          created_at?: string
          date: string
          description?: string | null
          google_event_id?: string | null
          id?: string
          image_url?: string | null
          last_synced_at?: string | null
          location: string
          time: string
          title: string
          type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          allday?: boolean | null
          created_at?: string
          date?: string
          description?: string | null
          google_event_id?: string | null
          id?: string
          image_url?: string | null
          last_synced_at?: string | null
          location?: string
          time?: string
          title?: string
          type?: string
          updated_at?: string
          user_id?: string
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
      media_library: {
        Row: {
          created_at: string
          description: string | null
          file_path: string
          file_type: string
          file_url: string
          folder: string | null
          id: string
          is_public: boolean | null
          tags: string[] | null
          title: string
          uploaded_by: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          file_path: string
          file_type: string
          file_url: string
          folder?: string | null
          id?: string
          is_public?: boolean | null
          tags?: string[] | null
          title: string
          uploaded_by: string
        }
        Update: {
          created_at?: string
          description?: string | null
          file_path?: string
          file_type?: string
          file_url?: string
          folder?: string | null
          id?: string
          is_public?: boolean | null
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
            foreignKeyName: "member_notes_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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
        ]
      }
      pdf_annotations: {
        Row: {
          annotations: Json
          created_at: string
          id: string
          sheet_music_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          annotations?: Json
          created_at?: string
          id?: string
          sheet_music_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          annotations?: Json
          created_at?: string
          id?: string
          sheet_music_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "pdf_annotations_sheet_music_id_fkey"
            columns: ["sheet_music_id"]
            isOneToOne: false
            referencedRelation: "sheet_music"
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
      profiles: {
        Row: {
          avatar_url: string | null
          class_year: string | null
          created_at: string
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
        Relationships: [
          {
            foreignKeyName: "role_permissions_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "user_roles"
            referencedColumns: ["id"]
          },
        ]
      }
      setlists: {
        Row: {
          created_at: string
          id: string
          name: string
          sheet_music_ids: string[] | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          sheet_music_ids?: string[] | null
          user_id: string
        }
        Update: {
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
      user_google_tokens: {
        Row: {
          access_token: string
          created_at: string
          expires_at: string
          id: string
          refresh_token: string
          updated_at: string
          user_id: string
        }
        Insert: {
          access_token: string
          created_at?: string
          expires_at: string
          id?: string
          refresh_token: string
          updated_at?: string
          user_id: string
        }
        Update: {
          access_token?: string
          created_at?: string
          expires_at?: string
          id?: string
          refresh_token?: string
          updated_at?: string
          user_id?: string
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
      user_roles: {
        Row: {
          description: string | null
          id: string
          title: Database["public"]["Enums"]["user_title"]
        }
        Insert: {
          description?: string | null
          id?: string
          title: Database["public"]["Enums"]["user_title"]
        }
        Update: {
          description?: string | null
          id?: string
          title?: Database["public"]["Enums"]["user_title"]
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
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
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      update_user_status: {
        Args: { p_user_id: string; p_status: string }
        Returns: undefined
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
