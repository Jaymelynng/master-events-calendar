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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      custom_data_entries: {
        Row: {
          data_content: string
          data_type: string
          gym_id: string | null
          id: string
          is_active: boolean | null
          notes: string | null
          template_id: string | null
          uploaded_at: string | null
        }
        Insert: {
          data_content: string
          data_type: string
          gym_id?: string | null
          id?: string
          is_active?: boolean | null
          notes?: string | null
          template_id?: string | null
          uploaded_at?: string | null
        }
        Update: {
          data_content?: string
          data_type?: string
          gym_id?: string | null
          id?: string
          is_active?: boolean | null
          notes?: string | null
          template_id?: string | null
          uploaded_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "custom_data_entries_gym_id_fkey"
            columns: ["gym_id"]
            isOneToOne: false
            referencedRelation: "gyms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "custom_data_entries_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "email_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      email_templates: {
        Row: {
          category: string | null
          category_id: string | null
          created_at: string | null
          description: string | null
          html_content: string
          id: string
          is_active: boolean | null
          name: string
          notes: string | null
          updated_at: string | null
          variables: Json | null
        }
        Insert: {
          category?: string | null
          category_id?: string | null
          created_at?: string | null
          description?: string | null
          html_content: string
          id?: string
          is_active?: boolean | null
          name: string
          notes?: string | null
          updated_at?: string | null
          variables?: Json | null
        }
        Update: {
          category?: string | null
          category_id?: string | null
          created_at?: string | null
          description?: string | null
          html_content?: string
          id?: string
          is_active?: boolean | null
          name?: string
          notes?: string | null
          updated_at?: string | null
          variables?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "email_templates_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "template_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      generated_emails: {
        Row: {
          generated_at: string | null
          generation_notes: string | null
          gym_id: string | null
          html_content: string
          id: string
          template_id: string | null
        }
        Insert: {
          generated_at?: string | null
          generation_notes?: string | null
          gym_id?: string | null
          html_content: string
          id?: string
          template_id?: string | null
        }
        Update: {
          generated_at?: string | null
          generation_notes?: string | null
          gym_id?: string | null
          html_content?: string
          id?: string
          template_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "generated_emails_gym_id_fkey"
            columns: ["gym_id"]
            isOneToOne: false
            referencedRelation: "gyms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "generated_emails_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "email_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      gym_links: {
        Row: {
          added_by_user_id: string | null
          created_at: string
          gym_id: string
          id: string
          is_active: boolean
          link_type_id: string
          notes: string | null
          updated_at: string
          url: string
        }
        Insert: {
          added_by_user_id?: string | null
          created_at?: string
          gym_id: string
          id?: string
          is_active?: boolean
          link_type_id: string
          notes?: string | null
          updated_at?: string
          url: string
        }
        Update: {
          added_by_user_id?: string | null
          created_at?: string
          gym_id?: string
          id?: string
          is_active?: boolean
          link_type_id?: string
          notes?: string | null
          updated_at?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "gym_links_gym_id_fkey"
            columns: ["gym_id"]
            isOneToOne: false
            referencedRelation: "gyms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gym_links_link_type_id_fkey"
            columns: ["link_type_id"]
            isOneToOne: false
            referencedRelation: "link_types"
            referencedColumns: ["id"]
          },
        ]
      }
      gyms: {
        Row: {
          address: string | null
          age_groups: string[] | null
          booking_url: string | null
          branding: Json | null
          city: string | null
          classes_url: string | null
          created_at: string
          description: string | null
          email: string | null
          gym_id: string | null
          id: string
          kids_night_out_url: string | null
          logo_url: string | null
          manager: string | null
          map_url: string | null
          messenger_link: string | null
          meta_business_url: string | null
          name: string
          open_gym_url: string | null
          parent_portal_url: string | null
          party_booking_url: string | null
          phone: string | null
          pricing: Json | null
          programs: string[] | null
          skill_clinics_url: string | null
          social_media: Json | null
          specialties: string[] | null
          state: string | null
          updated_at: string
          website: string | null
        }
        Insert: {
          address?: string | null
          age_groups?: string[] | null
          booking_url?: string | null
          branding?: Json | null
          city?: string | null
          classes_url?: string | null
          created_at?: string
          description?: string | null
          email?: string | null
          gym_id?: string | null
          id?: string
          kids_night_out_url?: string | null
          logo_url?: string | null
          manager?: string | null
          map_url?: string | null
          messenger_link?: string | null
          meta_business_url?: string | null
          name: string
          open_gym_url?: string | null
          parent_portal_url?: string | null
          party_booking_url?: string | null
          phone?: string | null
          pricing?: Json | null
          programs?: string[] | null
          skill_clinics_url?: string | null
          social_media?: Json | null
          specialties?: string[] | null
          state?: string | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          address?: string | null
          age_groups?: string[] | null
          booking_url?: string | null
          branding?: Json | null
          city?: string | null
          classes_url?: string | null
          created_at?: string
          description?: string | null
          email?: string | null
          gym_id?: string | null
          id?: string
          kids_night_out_url?: string | null
          logo_url?: string | null
          manager?: string | null
          map_url?: string | null
          messenger_link?: string | null
          meta_business_url?: string | null
          name?: string
          open_gym_url?: string | null
          parent_portal_url?: string | null
          party_booking_url?: string | null
          phone?: string | null
          pricing?: Json | null
          programs?: string[] | null
          skill_clinics_url?: string | null
          social_media?: Json | null
          specialties?: string[] | null
          state?: string | null
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      link_types: {
        Row: {
          category: string
          created_at: string
          display_label: string
          emoji: string
          id: string
          is_active: boolean
          label: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          category?: string
          created_at?: string
          display_label: string
          emoji?: string
          id: string
          is_active?: boolean
          label: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          display_label?: string
          emoji?: string
          id?: string
          is_active?: boolean
          label?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      template_categories: {
        Row: {
          color: string | null
          created_at: string | null
          description: string | null
          icon: string | null
          id: string
          is_active: boolean | null
          name: string
          sort_order: number | null
          updated_at: string | null
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          sort_order?: number | null
          updated_at?: string | null
        }
        Update: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          sort_order?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      template_variables: {
        Row: {
          created_at: string | null
          custom_data_instructions: string | null
          custom_data_type: string | null
          default_value: string | null
          description: string | null
          id: string
          is_required: boolean | null
          name: string
          placeholder: string
          requires_custom_data: boolean | null
          template_id: string | null
          type: string
        }
        Insert: {
          created_at?: string | null
          custom_data_instructions?: string | null
          custom_data_type?: string | null
          default_value?: string | null
          description?: string | null
          id?: string
          is_required?: boolean | null
          name: string
          placeholder: string
          requires_custom_data?: boolean | null
          template_id?: string | null
          type: string
        }
        Update: {
          created_at?: string | null
          custom_data_instructions?: string | null
          custom_data_type?: string | null
          default_value?: string | null
          description?: string | null
          id?: string
          is_required?: boolean | null
          name?: string
          placeholder?: string
          requires_custom_data?: boolean | null
          template_id?: string | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "template_variables_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "email_templates"
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
