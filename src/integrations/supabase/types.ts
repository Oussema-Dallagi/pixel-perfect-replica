export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      decisions: {
        Row: {
          content: string
          created_at: string
          id: string
          made_by: string | null
          meeting_id: string
          owner_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          made_by?: string | null
          meeting_id: string
          owner_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          made_by?: string | null
          meeting_id?: string
          owner_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "decisions_meeting_id_fkey"
            columns: ["meeting_id"]
            isOneToOne: false
            referencedRelation: "meetings"
            referencedColumns: ["id"]
          },
        ]
      }
      device_commands: {
        Row: {
          acked_at: string | null
          command: string
          created_at: string
          device_id: string
          id: string
          owner_id: string
          status: string
        }
        Insert: {
          acked_at?: string | null
          command: string
          created_at?: string
          device_id: string
          id?: string
          owner_id: string
          status?: string
        }
        Update: {
          acked_at?: string | null
          command?: string
          created_at?: string
          device_id?: string
          id?: string
          owner_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "device_commands_device_id_fkey"
            columns: ["device_id"]
            isOneToOne: false
            referencedRelation: "devices"
            referencedColumns: ["id"]
          },
        ]
      }
      devices: {
        Row: {
          api_key: string
          battery: number | null
          co2: number | null
          created_at: string
          firmware: string | null
          humidity: number | null
          id: string
          last_seen: string | null
          light: number | null
          name: string
          noise: number | null
          owner_id: string
          recording: boolean
          room: string
          temp: number | null
          wifi: number | null
        }
        Insert: {
          api_key?: string
          battery?: number | null
          co2?: number | null
          created_at?: string
          firmware?: string | null
          humidity?: number | null
          id?: string
          last_seen?: string | null
          light?: number | null
          name: string
          noise?: number | null
          owner_id: string
          recording?: boolean
          room: string
          temp?: number | null
          wifi?: number | null
        }
        Update: {
          api_key?: string
          battery?: number | null
          co2?: number | null
          created_at?: string
          firmware?: string | null
          humidity?: number | null
          id?: string
          last_seen?: string | null
          light?: number | null
          name?: string
          noise?: number | null
          owner_id?: string
          recording?: boolean
          room?: string
          temp?: number | null
          wifi?: number | null
        }
        Relationships: []
      }
      meetings: {
        Row: {
          created_at: string
          device_id: string | null
          ended_at: string | null
          id: string
          owner_id: string
          participants: string[]
          room: string | null
          scheduled_at: string | null
          score: number | null
          started_at: string | null
          status: string
          summary: string | null
          title: string
        }
        Insert: {
          created_at?: string
          device_id?: string | null
          ended_at?: string | null
          id?: string
          owner_id: string
          participants?: string[]
          room?: string | null
          scheduled_at?: string | null
          score?: number | null
          started_at?: string | null
          status?: string
          summary?: string | null
          title: string
        }
        Update: {
          created_at?: string
          device_id?: string | null
          ended_at?: string | null
          id?: string
          owner_id?: string
          participants?: string[]
          room?: string | null
          scheduled_at?: string | null
          score?: number | null
          started_at?: string | null
          status?: string
          summary?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "meetings_device_id_fkey"
            columns: ["device_id"]
            isOneToOne: false
            referencedRelation: "devices"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          co2_max: number
          created_at: string
          full_name: string | null
          id: string
          role_title: string | null
          temp_max: number
        }
        Insert: {
          co2_max?: number
          created_at?: string
          full_name?: string | null
          id: string
          role_title?: string | null
          temp_max?: number
        }
        Update: {
          co2_max?: number
          created_at?: string
          full_name?: string | null
          id?: string
          role_title?: string | null
          temp_max?: number
        }
        Relationships: []
      }
      sensor_readings: {
        Row: {
          co2: number | null
          created_at: string
          device_id: string
          humidity: number | null
          id: number
          light: number | null
          noise: number | null
          owner_id: string
          temp: number | null
        }
        Insert: {
          co2?: number | null
          created_at?: string
          device_id: string
          humidity?: number | null
          id?: never
          light?: number | null
          noise?: number | null
          owner_id: string
          temp?: number | null
        }
        Update: {
          co2?: number | null
          created_at?: string
          device_id?: string
          humidity?: number | null
          id?: never
          light?: number | null
          noise?: number | null
          owner_id?: string
          temp?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "sensor_readings_device_id_fkey"
            columns: ["device_id"]
            isOneToOne: false
            referencedRelation: "devices"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          assignee: string | null
          created_at: string
          due_date: string | null
          id: string
          meeting_id: string | null
          owner_id: string
          priority: string
          status: string
          title: string
        }
        Insert: {
          assignee?: string | null
          created_at?: string
          due_date?: string | null
          id?: string
          meeting_id?: string | null
          owner_id: string
          priority?: string
          status?: string
          title: string
        }
        Update: {
          assignee?: string | null
          created_at?: string
          due_date?: string | null
          id?: string
          meeting_id?: string | null
          owner_id?: string
          priority?: string
          status?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_meeting_id_fkey"
            columns: ["meeting_id"]
            isOneToOne: false
            referencedRelation: "meetings"
            referencedColumns: ["id"]
          },
        ]
      }
      transcript_lines: {
        Row: {
          content: string
          created_at: string
          id: string
          meeting_id: string
          offset_seconds: number
          owner_id: string
          speaker: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          meeting_id: string
          offset_seconds?: number
          owner_id: string
          speaker: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          meeting_id?: string
          offset_seconds?: number
          owner_id?: string
          speaker?: string
        }
        Relationships: [
          {
            foreignKeyName: "transcript_lines_meeting_id_fkey"
            columns: ["meeting_id"]
            isOneToOne: false
            referencedRelation: "meetings"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
