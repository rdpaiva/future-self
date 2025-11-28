export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      manifestations: {
        Row: {
          id: string
          user_id: string
          original_image_url: string
          generated_image_url: string
          dreams: string[]
          affirmation: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          original_image_url: string
          generated_image_url: string
          dreams: string[]
          affirmation: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          original_image_url?: string
          generated_image_url?: string
          dreams?: string[]
          affirmation?: string
          created_at?: string
          updated_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
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
  }
}
