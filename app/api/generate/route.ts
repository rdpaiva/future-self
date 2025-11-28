import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * Convert an image URL to base64 by fetching it
 */
async function urlToBase64(url: string): Promise<{ base64: string; mimeType: string }> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch image: ${response.statusText}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  const base64 = Buffer.from(arrayBuffer).toString('base64');
  const mimeType = response.headers.get('content-type') || 'image/jpeg';

  return { base64, mimeType };
}

/**
 * Check if a string is a URL
 */
function isUrl(str: string): boolean {
  return str.startsWith('http://') || str.startsWith('https://');
}

export async function POST(request: NextRequest) {
  try {
    const { image, dreams } = await request.json();

    if (!image) {
      return NextResponse.json(
        { error: 'Image is required' },
        { status: 400 }
      );
    }

    if (!dreams || dreams.length === 0) {
      return NextResponse.json(
        { error: 'At least one dream must be selected' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GOOGLE_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key not configured. Please set GOOGLE_API_KEY in .env.local' },
        { status: 500 }
      );
    }

    // Initialize Google AI with Gemini API
    const genAI = new GoogleGenerativeAI(apiKey);

    // Use Nano Banana Pro (Gemini 3 Pro Image) model
    const model = genAI.getGenerativeModel({
      model: 'gemini-3-pro-image-preview'
    });

    // Build the prompt based on selected dreams
    const dreamPrompts = dreams.join(', ');
    const prompt = `Edit this photo to show this person as their ideal future self with these qualities: ${dreamPrompts}.

Make them look:
- Successful, healthy, confident, and living their best life
- Professional photography quality with natural lighting
- Photorealistic and believable
- Maintaining their facial features and identity
- In an environment that matches their dreams

Keep the transformation realistic and inspiring.`;

    // Handle both URL and base64 image inputs
    let base64Data: string;
    let mimeType = 'image/jpeg';

    if (isUrl(image)) {
      // Fetch the image from URL and convert to base64
      const result = await urlToBase64(image);
      base64Data = result.base64;
      mimeType = result.mimeType;
    } else {
      // Extract mime type from data URL if present
      const mimeMatch = image.match(/^data:(image\/\w+);base64,/);
      if (mimeMatch) {
        mimeType = mimeMatch[1];
      }
      // Remove data URL prefix if present
      base64Data = image.replace(/^data:image\/\w+;base64,/, '');
    }

    // Call Google Nano Banana Pro API (Gemini 3 Pro Image)
    const result = await model.generateContent({
      contents: [{
        role: 'user',
        parts: [
          { text: prompt },
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Data
            }
          }
        ]
      }],
      generationConfig: {
        temperature: 0.8,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 8192,
      },
    });

    const response = await result.response;

    // Check if we have image data in the response
    if (!response.candidates || response.candidates.length === 0) {
      throw new Error('No image generated');
    }

    const candidate = response.candidates[0];

    // Extract the generated image from the response
    // Gemini image generation returns the image in the content parts
    const imagePart = candidate.content.parts.find(
      (part: any) => part.inlineData?.mimeType?.startsWith('image/')
    );

    if (!imagePart || !imagePart.inlineData) {
      throw new Error('No image data in response');
    }

    // Return the generated image as base64
    const generatedImage = `data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`;

    return NextResponse.json({
      generatedImage,
      model: 'gemini-3-pro-image-preview',
    });

  } catch (error) {
    console.error('Error generating image:', error);
    return NextResponse.json(
      {
        error: 'Failed to generate image',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
