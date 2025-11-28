import { createClient } from './client';

export interface Profile {
  id: string;
  email: string;
  fullName: string | null;
  avatarUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Get a user's profile with their latest avatar (from most recent manifestation)
 */
export async function getProfile(userId: string): Promise<Profile | null> {
  const supabase = createClient();

  // Get profile data
  const { data: profileData, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (profileError) {
    console.error('Error fetching profile:', profileError);
    return null;
  }

  // Get the latest manifestation's original image as the avatar
  const { data: latestManifestation } = await supabase
    .from('manifestations')
    .select('original_image_url')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  // Use the latest manifestation's original image, or fall back to stored avatar_url
  const avatarUrl = latestManifestation?.original_image_url || profileData.avatar_url;

  return {
    id: profileData.id,
    email: profileData.email,
    fullName: profileData.full_name,
    avatarUrl,
    createdAt: new Date(profileData.created_at),
    updatedAt: new Date(profileData.updated_at),
  };
}

/**
 * Update a user's profile
 */
export async function updateProfile(
  userId: string,
  updates: {
    fullName?: string;
    avatarUrl?: string | null;
  }
): Promise<void> {
  const supabase = createClient();

  const dbUpdates: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  if (updates.fullName !== undefined) {
    dbUpdates.full_name = updates.fullName;
  }
  if (updates.avatarUrl !== undefined) {
    dbUpdates.avatar_url = updates.avatarUrl;
  }

  const { error } = await supabase
    .from('profiles')
    .update(dbUpdates)
    .eq('id', userId);

  if (error) {
    console.error('Error updating profile:', error);
    throw new Error(`Failed to update profile: ${error.message}`);
  }
}
