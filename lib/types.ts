export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          phone_number: string | null
          bio: string | null
          location: string | null
          role: 'user' | 'admin' | 'moderator'
          is_verified: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          phone_number?: string | null
          bio?: string | null
          location?: string | null
          role?: 'user' | 'admin' | 'moderator'
          is_verified?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          phone_number?: string | null
          bio?: string | null
          location?: string | null
          role?: 'user' | 'admin' | 'moderator'
          is_verified?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      campaigns: {
        Row: {
          id: string
          creator_id: string
          title: string
          description: string
          story: string
          category: string
          goal_amount: number
          current_amount: number
          status: 'draft' | 'active' | 'completed' | 'cancelled' | 'suspended'
          featured_image_url: string | null
          video_url: string | null
          images: string[]
          tags: string[]
          location: string | null
          end_date: string | null
          is_featured: boolean
          is_verified: boolean
          verification_notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          creator_id: string
          title: string
          description: string
          story: string
          category: string
          goal_amount: number
          current_amount?: number
          status?: 'draft' | 'active' | 'completed' | 'cancelled' | 'suspended'
          featured_image_url?: string | null
          video_url?: string | null
          images?: string[]
          tags?: string[]
          location?: string | null
          end_date?: string | null
          is_featured?: boolean
          is_verified?: boolean
          verification_notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          creator_id?: string
          title?: string
          description?: string
          story?: string
          category?: string
          goal_amount?: number
          current_amount?: number
          status?: 'draft' | 'active' | 'completed' | 'cancelled' | 'suspended'
          featured_image_url?: string | null
          video_url?: string | null
          images?: string[]
          tags?: string[]
          location?: string | null
          end_date?: string | null
          is_featured?: boolean
          is_verified?: boolean
          verification_notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      campaign_updates: {
        Row: {
          id: string
          campaign_id: string
          title: string
          content: string
          images: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          campaign_id: string
          title: string
          content: string
          images?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          campaign_id?: string
          title?: string
          content?: string
          images?: string[]
          created_at?: string
          updated_at?: string
        }
      }
      donations: {
        Row: {
          id: string
          campaign_id: string
          donor_id: string | null
          amount: number
          message: string | null
          is_anonymous: boolean
          payment_method: 'card' | 'ussd' | 'wallet' | 'bank_transfer'
          payment_reference: string | null
          status: 'pending' | 'completed' | 'failed' | 'refunded'
          transaction_id: string | null
          metadata: any
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          campaign_id: string
          donor_id?: string | null
          amount: number
          message?: string | null
          is_anonymous?: boolean
          payment_method: 'card' | 'ussd' | 'wallet' | 'bank_transfer'
          payment_reference?: string | null
          status?: 'pending' | 'completed' | 'failed' | 'refunded'
          transaction_id?: string | null
          metadata?: any
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          campaign_id?: string
          donor_id?: string | null
          amount?: number
          message?: string | null
          is_anonymous?: boolean
          payment_method?: 'card' | 'ussd' | 'wallet' | 'bank_transfer'
          payment_reference?: string | null
          status?: 'pending' | 'completed' | 'failed' | 'refunded'
          transaction_id?: string | null
          metadata?: any
          created_at?: string
          updated_at?: string
        }
      }
      comments: {
        Row: {
          id: string
          campaign_id: string
          user_id: string
          content: string
          parent_id: string | null
          is_deleted: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          campaign_id: string
          user_id: string
          content: string
          parent_id?: string | null
          is_deleted?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          campaign_id?: string
          user_id?: string
          content?: string
          parent_id?: string | null
          is_deleted?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      campaign_follows: {
        Row: {
          id: string
          campaign_id: string
          user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          campaign_id: string
          user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          campaign_id?: string
          user_id?: string
          created_at?: string
        }
      }
      reports: {
        Row: {
          id: string
          reporter_id: string
          campaign_id: string | null
          comment_id: string | null
          reason: string
          description: string | null
          status: 'pending' | 'reviewed' | 'resolved' | 'dismissed'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          reporter_id: string
          campaign_id?: string | null
          comment_id?: string | null
          reason: string
          description?: string | null
          status?: 'pending' | 'reviewed' | 'resolved' | 'dismissed'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          reporter_id?: string
          campaign_id?: string | null
          comment_id?: string | null
          reason?: string
          description?: string | null
          status?: 'pending' | 'reviewed' | 'resolved' | 'dismissed'
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
      campaign_status: 'draft' | 'active' | 'completed' | 'cancelled' | 'suspended'
      donation_status: 'pending' | 'completed' | 'failed' | 'refunded'
      payment_method: 'card' | 'ussd' | 'wallet' | 'bank_transfer'
      user_role: 'user' | 'admin' | 'moderator'
    }
  }
}

// Helper types
export type Profile = Database['public']['Tables']['profiles']['Row']
export type Campaign = Database['public']['Tables']['campaigns']['Row']
export type CampaignUpdate = Database['public']['Tables']['campaign_updates']['Row']
export type Donation = Database['public']['Tables']['donations']['Row']
export type Comment = Database['public']['Tables']['comments']['Row']
export type CampaignFollow = Database['public']['Tables']['campaign_follows']['Row']
export type Report = Database['public']['Tables']['reports']['Row']

// Insert types
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert']
export type CampaignInsert = Database['public']['Tables']['campaigns']['Insert']
export type CampaignUpdateInsert = Database['public']['Tables']['campaign_updates']['Insert']
export type DonationInsert = Database['public']['Tables']['donations']['Insert']
export type CommentInsert = Database['public']['Tables']['comments']['Insert']
export type CampaignFollowInsert = Database['public']['Tables']['campaign_follows']['Insert']
export type ReportInsert = Database['public']['Tables']['reports']['Insert']

// Update types
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update']
export type CampaignUpdateType = Database['public']['Tables']['campaigns']['Update']
export type CampaignUpdateUpdate = Database['public']['Tables']['campaign_updates']['Update']
export type DonationUpdate = Database['public']['Tables']['donations']['Update']
export type CommentUpdate = Database['public']['Tables']['comments']['Update']
export type CampaignFollowUpdate = Database['public']['Tables']['campaign_follows']['Update']
export type ReportUpdate = Database['public']['Tables']['reports']['Update']

// Extended types with relations
export type CampaignWithCreator = Campaign & {
  creator: Profile
}

export type CampaignWithStats = Campaign & {
  creator: Profile
  supporters_count: number
  donations_count: number
  updates_count: number
  comments_count: number
}

export type DonationWithDonor = Donation & {
  donor: Profile | null
  campaign: Campaign
}

export type CommentWithUser = Comment & {
  user: Profile
  replies?: CommentWithUser[]
}

