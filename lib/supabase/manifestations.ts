import { createClient } from './client';
import { uploadImage, deleteImage } from './storage';
import { Manifestation } from '../types';

/**
 * Create a new manifestation in the database
 */
export async function createManifestation(
  userId: string,
  originalImage: string,
  generatedImage: string,
  dreams: string[],
  affirmation: string
): Promise<Manifestation> {
  const supabase = createClient();

  console.log('Creating manifestation for user:', userId);
  console.log('Original image length:', originalImage?.length || 0);
  console.log('Generated image length:', generatedImage?.length || 0);

  // Upload images to storage
  console.log('Uploading original image...');
  const originalImageUrl = await uploadImage(userId, originalImage, `profile-${Date.now()}.jpg`);
  console.log('Original image uploaded:', originalImageUrl);

  console.log('Uploading generated image...');
  const generatedImageUrl = await uploadImage(userId, generatedImage, `generated-${Date.now()}.jpg`);
  console.log('Generated image uploaded:', generatedImageUrl);

  // Create database record
  console.log('Inserting into database...');
  const { data, error } = await supabase
    .from('manifestations')
    .insert({
      user_id: userId,
      original_image_url: originalImageUrl,
      generated_image_url: generatedImageUrl,
      dreams,
      affirmation,
    })
    .select()
    .single();

  if (error) {
    console.error('Database insert error:', error);
    console.error('Error details:', JSON.stringify(error, null, 2));
    throw new Error(`Failed to save manifestation: ${error.message}`);
  }

  console.log('Manifestation saved successfully:', data.id);

  return {
    id: data.id,
    originalImage: data.original_image_url,
    generatedImage: data.generated_image_url,
    dreams: data.dreams,
    affirmation: data.affirmation,
    createdAt: new Date(data.created_at),
  };
}

/**
 * Get all manifestations for a user
 */
export async function getManifestations(userId: string): Promise<Manifestation[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('manifestations')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Database fetch error:', error);
    throw new Error(`Failed to fetch manifestations: ${error.message}`);
  }

  console.log(`Fetched ${data.length} manifestations for user ${userId}`);
  return data.map((item) => ({
    id: item.id,
    originalImage: item.original_image_url,
    generatedImage: item.generated_image_url,
    dreams: item.dreams,
    affirmation: item.affirmation,
    createdAt: new Date(item.created_at),
  }));
}

/**
 * Delete a manifestation
 */
export async function deleteManifestation(manifestationId: string): Promise<void> {
  const supabase = createClient();

  // Get manifestation details first
  const { data: manifestation, error: fetchError } = await supabase
    .from('manifestations')
    .select('*')
    .eq('id', manifestationId)
    .single();

  if (fetchError || !manifestation) {
    throw new Error('Manifestation not found');
  }

  // Delete images from storage
  try {
    await deleteImage(manifestation.original_image_url);
    await deleteImage(manifestation.generated_image_url);
  } catch (err) {
    console.error('Failed to delete images:', err);
    // Continue with database deletion even if storage deletion fails
  }

  // Delete from database
  const { error } = await supabase
    .from('manifestations')
    .delete()
    .eq('id', manifestationId);

  if (error) {
    console.error('Database delete error:', error);
    throw new Error(`Failed to delete manifestation: ${error.message}`);
  }
}
