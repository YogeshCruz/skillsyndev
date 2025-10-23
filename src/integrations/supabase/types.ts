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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      job_roles: {
        Row: {
          created_at: string
          description: string | null
          experience_level: string | null
          id: string
          industry: string | null
          required_skills: string[]
          salary_range: string | null
          title: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          experience_level?: string | null
          id?: string
          industry?: string | null
          required_skills: string[]
          salary_range?: string | null
          title: string
        }
        Update: {
          created_at?: string
          description?: string | null
          experience_level?: string | null
          id?: string
          industry?: string | null
          required_skills?: string[]
          salary_range?: string | null
          title?: string
        }
        Relationships: []
      }
      learning_recommendations: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_free: boolean | null
          job_role_id: string
          provider: string | null
          recommendation_type: string
          skill_name: string
          title: string
          url: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_free?: boolean | null
          job_role_id: string
          provider?: string | null
          recommendation_type: string
          skill_name: string
          title: string
          url?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_free?: boolean | null
          job_role_id?: string
          provider?: string | null
          recommendation_type?: string
          skill_name?: string
          title?: string
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "learning_recommendations_job_role_id_fkey"
            columns: ["job_role_id"]
            isOneToOne: false
            referencedRelation: "job_roles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          education: string | null
          email: string | null
          full_name: string | null
          id: string
          interests: string[] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          education?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          interests?: string[] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          education?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          interests?: string[] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      resumes: {
        Row: {
          created_at: string
          education: string[] | null
          experience: string[] | null
          file_hash: string | null
          file_url: string
          filename: string
          id: string
          keywords: string[] | null
          parsed_data: Json | null
          resume_score: number | null
          score_explanation: string | null
          skills: string[] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          education?: string[] | null
          experience?: string[] | null
          file_hash?: string | null
          file_url: string
          filename: string
          id?: string
          keywords?: string[] | null
          parsed_data?: Json | null
          resume_score?: number | null
          score_explanation?: string | null
          skills?: string[] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          education?: string[] | null
          experience?: string[] | null
          file_hash?: string | null
          file_url?: string
          filename?: string
          id?: string
          keywords?: string[] | null
          parsed_data?: Json | null
          resume_score?: number | null
          score_explanation?: string | null
          skills?: string[] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_job_matches: {
        Row: {
          created_at: string
          id: string
          is_saved: boolean | null
          job_role_id: string
          match_percentage: number
          matching_skills: string[] | null
          missing_skills: string[] | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_saved?: boolean | null
          job_role_id: string
          match_percentage: number
          matching_skills?: string[] | null
          missing_skills?: string[] | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_saved?: boolean | null
          job_role_id?: string
          match_percentage?: number
          matching_skills?: string[] | null
          missing_skills?: string[] | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_job_matches_job_role_id_fkey"
            columns: ["job_role_id"]
            isOneToOne: false
            referencedRelation: "job_roles"
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
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
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
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
