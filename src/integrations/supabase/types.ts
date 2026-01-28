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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      contact_messages: {
        Row: {
          created_at: string
          email: string
          id: string
          is_read: boolean | null
          message: string
          name: string
          phone: string | null
          processed_at: string | null
          processed_by: string | null
          subject: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          is_read?: boolean | null
          message: string
          name: string
          phone?: string | null
          processed_at?: string | null
          processed_by?: string | null
          subject?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          is_read?: boolean | null
          message?: string
          name?: string
          phone?: string | null
          processed_at?: string | null
          processed_by?: string | null
          subject?: string | null
        }
        Relationships: []
      }
      daily_specials: {
        Row: {
          created_at: string
          date: string
          description: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          name: string
          price: number
        }
        Insert: {
          created_at?: string
          date: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name: string
          price: number
        }
        Update: {
          created_at?: string
          date?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name?: string
          price?: number
        }
        Relationships: []
      }
      event_bookings: {
        Row: {
          created_at: string
          event_id: string
          guest_email: string | null
          guest_name: string
          guest_phone: string | null
          id: string
          num_tickets: number
          status: Database["public"]["Enums"]["booking_status"]
          total_price: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          event_id: string
          guest_email?: string | null
          guest_name: string
          guest_phone?: string | null
          id?: string
          num_tickets?: number
          status?: Database["public"]["Enums"]["booking_status"]
          total_price?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          event_id?: string
          guest_email?: string | null
          guest_name?: string
          guest_phone?: string | null
          id?: string
          num_tickets?: number
          status?: Database["public"]["Enums"]["booking_status"]
          total_price?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_bookings_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          capacity: number
          created_at: string
          description: string | null
          end_time: string | null
          event_date: string
          id: string
          image_url: string | null
          is_public: boolean | null
          name: string
          start_time: string | null
          status: Database["public"]["Enums"]["booking_status"]
          ticket_price: number | null
          tickets_sold: number | null
          updated_at: string
          venue_id: string | null
        }
        Insert: {
          capacity?: number
          created_at?: string
          description?: string | null
          end_time?: string | null
          event_date: string
          id?: string
          image_url?: string | null
          is_public?: boolean | null
          name: string
          start_time?: string | null
          status?: Database["public"]["Enums"]["booking_status"]
          ticket_price?: number | null
          tickets_sold?: number | null
          updated_at?: string
          venue_id?: string | null
        }
        Update: {
          capacity?: number
          created_at?: string
          description?: string | null
          end_time?: string | null
          event_date?: string
          id?: string
          image_url?: string | null
          is_public?: boolean | null
          name?: string
          start_time?: string | null
          status?: Database["public"]["Enums"]["booking_status"]
          ticket_price?: number | null
          tickets_sold?: number | null
          updated_at?: string
          venue_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "events_venue_id_fkey"
            columns: ["venue_id"]
            isOneToOne: false
            referencedRelation: "venues"
            referencedColumns: ["id"]
          },
        ]
      }
      guests: {
        Row: {
          address: string | null
          created_at: string
          email: string | null
          first_name: string
          id: string
          id_number: string | null
          id_type: string | null
          last_name: string
          nationality: string | null
          phone: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          email?: string | null
          first_name: string
          id?: string
          id_number?: string | null
          id_type?: string | null
          last_name: string
          nationality?: string | null
          phone?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          created_at?: string
          email?: string | null
          first_name?: string
          id?: string
          id_number?: string | null
          id_type?: string | null
          last_name?: string
          nationality?: string | null
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      menu_categories: {
        Row: {
          created_at: string
          description: string | null
          display_order: number | null
          id: string
          is_active: boolean | null
          name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          name?: string
        }
        Relationships: []
      }
      menu_items: {
        Row: {
          allergens: string[] | null
          category_id: string | null
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          is_available: boolean | null
          is_featured: boolean | null
          name: string
          price: number
          updated_at: string
        }
        Insert: {
          allergens?: string[] | null
          category_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_available?: boolean | null
          is_featured?: boolean | null
          name: string
          price: number
          updated_at?: string
        }
        Update: {
          allergens?: string[] | null
          category_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_available?: boolean | null
          is_featured?: boolean | null
          name?: string
          price?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "menu_items_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "menu_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          department: Database["public"]["Enums"]["department_type"] | null
          full_name: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          department?: Database["public"]["Enums"]["department_type"] | null
          full_name?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          department?: Database["public"]["Enums"]["department_type"] | null
          full_name?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      reservations: {
        Row: {
          check_in_date: string
          check_out_date: string
          created_at: string
          created_by: string | null
          guest_id: string | null
          id: string
          num_guests: number
          reservation_number: string
          room_id: string | null
          room_type_id: string | null
          special_requests: string | null
          status: Database["public"]["Enums"]["reservation_status"]
          total_price: number | null
          updated_at: string
        }
        Insert: {
          check_in_date: string
          check_out_date: string
          created_at?: string
          created_by?: string | null
          guest_id?: string | null
          id?: string
          num_guests?: number
          reservation_number: string
          room_id?: string | null
          room_type_id?: string | null
          special_requests?: string | null
          status?: Database["public"]["Enums"]["reservation_status"]
          total_price?: number | null
          updated_at?: string
        }
        Update: {
          check_in_date?: string
          check_out_date?: string
          created_at?: string
          created_by?: string | null
          guest_id?: string | null
          id?: string
          num_guests?: number
          reservation_number?: string
          room_id?: string | null
          room_type_id?: string | null
          special_requests?: string | null
          status?: Database["public"]["Enums"]["reservation_status"]
          total_price?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "reservations_guest_id_fkey"
            columns: ["guest_id"]
            isOneToOne: false
            referencedRelation: "guests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reservations_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reservations_room_type_id_fkey"
            columns: ["room_type_id"]
            isOneToOne: false
            referencedRelation: "room_types"
            referencedColumns: ["id"]
          },
        ]
      }
      room_types: {
        Row: {
          amenities: Json | null
          base_price: number
          capacity: number
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          name: string
          total_rooms: number
          updated_at: string
        }
        Insert: {
          amenities?: Json | null
          base_price: number
          capacity?: number
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name: string
          total_rooms?: number
          updated_at?: string
        }
        Update: {
          amenities?: Json | null
          base_price?: number
          capacity?: number
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name?: string
          total_rooms?: number
          updated_at?: string
        }
        Relationships: []
      }
      rooms: {
        Row: {
          created_at: string
          floor: number | null
          id: string
          notes: string | null
          room_number: string
          room_type_id: string | null
          status: Database["public"]["Enums"]["room_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          floor?: number | null
          id?: string
          notes?: string | null
          room_number: string
          room_type_id?: string | null
          status?: Database["public"]["Enums"]["room_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          floor?: number | null
          id?: string
          notes?: string | null
          room_number?: string
          room_type_id?: string | null
          status?: Database["public"]["Enums"]["room_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "rooms_room_type_id_fkey"
            columns: ["room_type_id"]
            isOneToOne: false
            referencedRelation: "room_types"
            referencedColumns: ["id"]
          },
        ]
      }
      table_reservations: {
        Row: {
          created_at: string
          guest_email: string | null
          guest_name: string
          guest_phone: string | null
          id: string
          num_guests: number
          reservation_date: string
          reservation_time: string
          special_requests: string | null
          status: Database["public"]["Enums"]["booking_status"]
          table_number: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          guest_email?: string | null
          guest_name: string
          guest_phone?: string | null
          id?: string
          num_guests?: number
          reservation_date: string
          reservation_time: string
          special_requests?: string | null
          status?: Database["public"]["Enums"]["booking_status"]
          table_number?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          guest_email?: string | null
          guest_name?: string
          guest_phone?: string | null
          id?: string
          num_guests?: number
          reservation_date?: string
          reservation_time?: string
          special_requests?: string | null
          status?: Database["public"]["Enums"]["booking_status"]
          table_number?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      venues: {
        Row: {
          amenities: Json | null
          capacity: number
          created_at: string
          description: string | null
          hourly_rate: number | null
          id: string
          image_url: string | null
          is_active: boolean | null
          name: string
          updated_at: string
        }
        Insert: {
          amenities?: Json | null
          capacity?: number
          created_at?: string
          description?: string | null
          hourly_rate?: number | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name: string
          updated_at?: string
        }
        Update: {
          amenities?: Json | null
          capacity?: number
          created_at?: string
          description?: string | null
          hourly_rate?: number | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_reservation_number: { Args: never; Returns: string }
      get_user_department: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["department_type"]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: { Args: { _user_id: string }; Returns: boolean }
      is_event_staff: { Args: { _user_id: string }; Returns: boolean }
      is_receptionist: { Args: { _user_id: string }; Returns: boolean }
      is_restaurant_staff: { Args: { _user_id: string }; Returns: boolean }
      is_staff: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "employee"
      booking_status: "pending" | "confirmed" | "cancelled"
      department_type: "reception" | "restaurant" | "events"
      reservation_status:
        | "pending"
        | "confirmed"
        | "checked_in"
        | "checked_out"
        | "cancelled"
      room_status: "available" | "occupied" | "maintenance" | "cleaning"
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
    Enums: {
      app_role: ["admin", "employee"],
      booking_status: ["pending", "confirmed", "cancelled"],
      department_type: ["reception", "restaurant", "events"],
      reservation_status: [
        "pending",
        "confirmed",
        "checked_in",
        "checked_out",
        "cancelled",
      ],
      room_status: ["available", "occupied", "maintenance", "cleaning"],
    },
  },
} as const
