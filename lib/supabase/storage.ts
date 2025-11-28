import { createClient } from './client';

const MANIFESTATIONS_BUCKET = 'manifestations';

interface StoredProfileImage {
  path: string;
  url: string;
  createdAt: Date;
}

/**
 * Upload an image to Supabase storage
 * @param userId - The user's ID
 * @param file - The file to upload (base64 or Blob)
 * @param filename - Optional custom filename
 * @returns The public URL of the uploaded image
 */
export async function uploadImage(
  userId: string,
  file: string | Blob,
  filename?: string
): Promise<string> {
  const supabase = createClient();

  // Generate filename if not provided
  const finalFilename = filename || `${Date.now()}.jpg`;
  const filePath = `${userId}/${finalFilename}`;

  let fileToUpload: Blob;
  let mimeType = 'image/jpeg';

  const stringToBlob = async (input: string): Promise<Blob> => {
    const isHttpUrl = /^https?:\/\//i.test(input);
    const isDataUrl = input.startsWith('data:image/');

    if (isHttpUrl) {
      const response = await fetch(input);
      if (!response.ok) {
        throw new Error(`Failed to fetch image from URL: ${response.statusText}`);
      }
      mimeType = response.headers.get('content-type') || mimeType;
      return await response.blob();
    }

    if (isDataUrl) {
      // Extract mime type + base64 payload
      const match = input.match(/^data:(image\/[\w.+-]+);base64,(.+)$/);
      if (match) {
        mimeType = match[1];
        const base64Data = match[2];
        return decodeBase64ToBlob(base64Data, mimeType);
      }
      throw new Error('Invalid data URL format');
    }

    // Assume raw base64 string (without prefix)
    return decodeBase64ToBlob(input, mimeType);
  };

  const decodeBase64ToBlob = (base64Data: string, type: string): Blob => {
    try {
      if (typeof atob === 'function') {
        const binaryString = atob(base64Data);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        return new Blob([bytes], { type });
      }

      if (typeof Buffer !== 'undefined') {
        const buffer = Buffer.from(base64Data, 'base64');
        return new Blob([buffer], { type });
      }

      throw new Error('No available base64 decoder in this environment');
    } catch (decodeError) {
      console.error('Base64 decode error:', decodeError);
      throw new Error('Failed to decode image data');
    }
  };

  // Convert strings to Blob when necessary
  if (typeof file === 'string') {
    fileToUpload = await stringToBlob(file);
  } else {
    mimeType = file.type || mimeType;
    fileToUpload = file;
  }

  console.log(`Uploading image to ${MANIFESTATIONS_BUCKET}/${filePath}, size: ${fileToUpload.size} bytes`);

  // Upload to storage
  const { data, error } = await supabase.storage
    .from(MANIFESTATIONS_BUCKET)
    .upload(filePath, fileToUpload, {
      cacheControl: '3600',
      upsert: true,
      contentType: mimeType,
    });

  if (error) {
    console.error('Storage upload error:', error);
    console.error('Error details:', JSON.stringify(error, null, 2));
    throw new Error(`Failed to upload image: ${error.message}`);
  }

  console.log('Upload successful, path:', data.path);

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from(MANIFESTATIONS_BUCKET)
    .getPublicUrl(data.path);

  console.log('Public URL:', publicUrl);

  return publicUrl;
}

/**
 * List all profile images stored for a user
 */
export async function listProfileImages(userId: string): Promise<StoredProfileImage[]> {
  const supabase = createClient();

  const { data, error } = await supabase.storage
    .from(MANIFESTATIONS_BUCKET)
    .list(userId, {
      limit: 1000,
      offset: 0,
      sortBy: { column: 'created_at', order: 'desc' },
    });

  if (error) {
    console.error('Storage list error:', error);
    throw new Error(`Failed to list profile images: ${error.message}`);
  }

  const files = (data || []).filter(
    (item) => Boolean(item.id) && item.name.startsWith('profile-')
  );

  return files.map((file) => {
    const path = `${userId}/${file.name}`;
    const {
      data: { publicUrl },
    } = supabase.storage.from(MANIFESTATIONS_BUCKET).getPublicUrl(path);

    return {
      path,
      url: publicUrl,
      createdAt: file.created_at ? new Date(file.created_at) : new Date(),
    };
  });
}

/**
 * Delete an image from Supabase storage
 * @param imageUrl - The public URL of the image to delete
 */
export async function deleteImage(imageUrl: string): Promise<void> {
  const supabase = createClient();

  // Extract path from URL
  const urlParts = imageUrl.split('/manifestations/');
  if (urlParts.length !== 2) {
    throw new Error('Invalid image URL');
  }

  const filePath = urlParts[1];

  const { error } = await supabase.storage
    .from('manifestations')
    .remove([filePath]);

  if (error) {
    console.error('Delete error:', error);
    throw new Error(`Failed to delete image: ${error.message}`);
  }
}
