# Manifestr ✨

**See your future self. Believe in your potential. Manifest your dreams.**

Manifestr is a beautiful, AI-powered vision board application that helps you visualize your ideal future self. Upload a photo, select your dreams, and watch as AI transforms your image to show you living your best life.

![Manifestr Preview](https://via.placeholder.com/800x400/FDF8F3/3D3225?text=Manifestr)

## Features

- **Quick Onboarding Flow** - Simple 3-step process to create your manifestation
- **AI-Powered Transformations** - Uses Google's Nano Banana Pro (Gemini 3 Pro Image) for realistic image generation
- **Dream Categories** - Choose from 6 life areas:
  - 💪 Health & Vitality
  - ✨ Career Success
  - 🏡 Dream Home
  - ✈️ Adventure & Travel
  - 🌟 Style & Confidence
  - 🍃 Abundance & Wealth
- **Vision Board Gallery** - Save and organize your manifestations
- **Daily Affirmations** - Inspiring messages to keep you motivated
- **Beautiful Design** - Elegant, serene UI with warm color palette
- **Download & Share** - Save your manifestations to share with others

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Components:** shadcn/ui + Radix UI
- **Fonts:** Cormorant Garamond & Outfit (Google Fonts)
- **AI Generation:** Google Nano Banana Pro (Gemini 3 Pro Image)
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth
- **Storage:** Supabase Storage (cloud storage for images)

## Getting Started

### Prerequisites

- Node.js 18+ and npm installed
- Google AI API key (free to start)
- Supabase account (free tier available)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd manifestr
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**

   Follow the detailed instructions in [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) to:
   - Create your Supabase project
   - Set up the database schema
   - Configure authentication
   - Set up storage bucket

4. **Set up environment variables**

   Create a `.env.local` file in the root directory:
   ```env
   # Google AI
   GOOGLE_API_KEY=your_google_api_key_here

   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

   **Get your Google API key:**
   - Go to [Google AI Studio](https://aistudio.google.com/apikey)
   - Sign in with your Google account
   - Click "Create API Key"
   - Copy your API key

   **Get your Supabase credentials:**
   - Go to your [Supabase Dashboard](https://app.supabase.com)
   - Select your project → Settings → API
   - Copy the Project URL and anon/public key

   **Note:** Nano Banana Pro (Gemini 3 Pro Image) is available in paid preview. Pricing is approximately $0.139 per 1080p/2K image and $0.24 per 4K image.

5. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

## Usage

### Getting Started

1. **Sign Up** - Create your account at `/auth/signup`
2. **Log In** - Access your personalized vision board

### Creating a Manifestation

1. **Upload Your Photo** - Click to upload a clear photo of yourself
2. **Select Your Dreams** - Choose one or more life areas you want to visualize
3. **Generate** - AI creates a visualization of your future self (powered by Google Nano Banana Pro)
4. **Save** - Add to your vision board stored securely in Supabase

### Managing Your Vision Board

- Click "Vision Board" in the top right to view all your saved manifestations
- Click any manifestation to view full details
- Download or delete manifestations as needed
- All images are stored securely in Supabase Storage
- Access your manifestations from any device by logging in

## Project Structure

```
manifestr/
├── app/
│   ├── api/
│   │   └── generate/
│   │       └── route.ts          # AI image generation API endpoint
│   ├── board/
│   │   └── page.tsx              # Vision board gallery page
│   ├── globals.css               # Global styles and animations
│   ├── layout.tsx                # Root layout with fonts
│   └── page.tsx                  # Main onboarding flow
├── components/
│   ├── ui/                       # shadcn/ui components
│   ├── WelcomeStep.tsx          # Step 0: Welcome screen
│   ├── UploadStep.tsx           # Step 1: Photo upload
│   ├── DreamSelectionStep.tsx   # Step 2: Dream selection
│   └── RevealStep.tsx           # Step 3: Generated result
├── lib/
│   ├── constants.ts             # Dreams data and affirmations
│   ├── types.ts                 # TypeScript type definitions
│   └── utils.ts                 # Utility functions
└── public/                      # Static assets
```

## Customization

### Adding New Dream Categories

Edit `lib/constants.ts`:

```typescript
export const dreams: Dream[] = [
  {
    id: 'your-dream',
    icon: '🎯',
    title: 'Your Dream',
    description: 'Dream description',
    prompt: 'AI generation prompt for this dream category',
  },
  // ... existing dreams
];
```

### Customizing Colors

The app uses a warm, earthy color palette. To customize, edit `app/globals.css`:

```css
:root {
  --primary: 30 45% 65%;        /* Golden accent */
  --background: 30 30% 98%;     /* Warm beige */
  /* ... other colors */
}
```

### Modifying Affirmations

Edit the affirmations array in `lib/constants.ts`:

```typescript
export const affirmations: string[] = [
  "Your custom affirmation here",
  // ... add more
];
```

## API Routes

### POST `/api/generate`

Generates an AI-transformed image based on user photo and selected dreams.

**Request Body:**
```json
{
  "image": "base64_encoded_image",
  "dreams": ["prompt1", "prompt2"]
}
```

**Response:**
```json
{
  "generatedImage": "base64_encoded_result",
  "model": "gemini-3-pro-image-preview"
}
```

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import project to [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard:
   - `GOOGLE_API_KEY`
4. Deploy!

### Environment Variables for Production

Make sure to set these in your hosting platform:
- `GOOGLE_API_KEY` - Your Google AI Studio API key
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous key

## Performance Considerations

- **Image Generation:** Can take 10-30 seconds depending on the AI model
- **Storage:** Images are stored in Supabase Storage with CDN delivery for fast loading
- **Database:** Uses Supabase PostgreSQL with Row Level Security (RLS) for data protection
- **Image Optimization:** Consider compressing images before upload for faster generation
- **Supabase Free Tier Limits:**
  - 500MB database space
  - 1GB file storage
  - 50MB file upload limit
  - 2GB bandwidth per month

## Future Enhancements

- [x] User authentication (Supabase Auth)
- [x] Cloud storage (Supabase Storage)
- [ ] Social sharing features
- [ ] Print/export vision board
- [ ] Scheduled affirmation reminders
- [ ] Progress tracking over time
- [ ] Community vision boards
- [ ] Mobile app (React Native)
- [ ] Multiple image styles/filters
- [ ] Video manifestations
- [ ] Meditation/visualization audio guides

## Troubleshooting

### Authentication Issues

- **Can't Sign Up:** Check that email confirmation is enabled in Supabase Auth settings
- **Can't Log In:** Verify your Supabase URL and anon key are correct in `.env.local`
- **Redirects Not Working:** Ensure redirect URLs are configured in Supabase Auth settings

### API Generation Fails

- **Check API Key:** Ensure your `.env.local` has a valid `GOOGLE_API_KEY`
- **Model Access:** Nano Banana Pro is in paid preview - ensure your Google account has access
- **Quota Limits:** Check your Google AI Studio quota and billing settings
- **API Enabled:** Verify the Generative Language API is enabled in your Google Cloud project

### Images Not Saving

- **Storage Bucket Error:** Verify the `manifestations` bucket exists in Supabase Storage
- **Upload Failed:** Check file size is under 50MB (Supabase free tier limit)
- **Permission Denied:** Ensure Row Level Security policies are set up correctly

### Slow Performance

- **Image Size:** Compress images before upload
- **Network:** Check internet connection for API calls

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for personal or commercial purposes.

## About Nano Banana Pro

**Nano Banana Pro** is Google DeepMind's state-of-the-art image generation model (Gemini 3 Pro Image). It offers:

- **High Fidelity:** Up to 4K resolution output
- **Advanced Composition:** Combine multiple reference images
- **Person Consistency:** Maintain resemblance across generations
- **Realistic Transformations:** Professional photography quality results
- **SynthID Watermarking:** Transparent AI-generated content marking

Learn more about [Nano Banana Pro from Google](https://blog.google/technology/ai/nano-banana-pro/)

## Acknowledgments

- Design inspiration from modern wellness and meditation apps
- Font pairing: Cormorant Garamond × Outfit
- Color palette inspired by natural earth tones
- AI generation powered by Google's Nano Banana Pro (Gemini 3 Pro Image)

---

Built with ❤️ for manifestation and personal growth

**Remember:** Your future self is already within you. All you have to do is believe. ✨
