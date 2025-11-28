# Manifestr Setup Checklist

Complete these steps to get Manifestr running with Supabase authentication and storage.

## ✅ Step 1: Install Dependencies

```bash
npm install
```

This installs:
- Next.js and React
- Supabase client libraries
- Google Generative AI SDK
- UI components (shadcn/ui, Radix UI)
- Tailwind CSS

## ✅ Step 2: Set Up Supabase Project

### 2.1 Create Project
1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Name it "Manifestr"
4. Choose a database password (save this!)
5. Select a region close to you
6. Click "Create Project"

### 2.2 Get API Credentials
1. Go to Settings → API
2. Copy these values:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 2.3 Run Database Migration
1. Go to SQL Editor in Supabase dashboard
2. Click "New Query"
3. Copy the entire contents of `supabase/migrations/001_initial_schema.sql`
4. Paste and click "Run"
5. Verify no errors appear

### 2.4 Configure Authentication
1. Go to Authentication → Providers
2. Ensure "Email" is enabled
3. Go to Authentication → URL Configuration
4. Add redirect URLs:
   - `http://localhost:3000/auth/callback`
   - `https://your-production-domain.com/auth/callback` (when deploying)

### 2.5 Verify Storage
1. Go to Storage
2. Confirm the `manifestations` bucket exists
3. Check that it's set to "Public"

## ✅ Step 3: Get Google AI API Key

1. Go to [Google AI Studio](https://aistudio.google.com/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the key → `GOOGLE_API_KEY`

## ✅ Step 4: Configure Environment Variables

Create `.env.local` in your project root:

```env
# Google AI (Nano Banana Pro)
GOOGLE_API_KEY=your_google_api_key_here

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

## ✅ Step 5: Run the Application

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## ✅ Step 6: Test the Application

### Test Authentication
1. Go to `http://localhost:3000/auth/signup`
2. Create an account with your email
3. Check your email for confirmation link (if email confirmation is enabled)
4. Log in at `http://localhost:3000/auth/login`

### Test Manifestation Creation
1. Upload a photo of yourself
2. Select one or more dream categories
3. Click "Reveal My Future Self"
4. Wait for AI generation (10-30 seconds)
5. Click "Save to My Vision Board"

### Test Vision Board
1. Click "Vision Board" in top right
2. Verify your manifestation appears
3. Click on it to view details
4. Test download and delete functions

## 🔍 Troubleshooting

### "API keys not configured"
- Check `.env.local` exists
- Restart `npm run dev` after creating `.env.local`
- Verify no typos in environment variable names

### "Failed to fetch manifestations"
- Check database migration ran successfully
- Verify Row Level Security policies are in place
- Check browser console for specific errors

### "Storage bucket error"
- Go to Supabase Storage
- Verify `manifestations` bucket exists
- Check bucket is set to "Public"

### "Authentication not working"
- Check Supabase URL and keys are correct
- Verify redirect URLs are configured
- Check email confirmation settings

## 📚 Additional Resources

- [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) - Detailed Supabase setup guide
- [README.md](./README.md) - Full project documentation
- [Supabase Docs](https://supabase.com/docs)
- [Google AI Studio](https://aistudio.google.com)

## 🎉 You're Ready!

Once all steps are complete, you should be able to:
- ✅ Sign up and log in
- ✅ Create manifestations with AI-generated images
- ✅ Save manifestations to your personal vision board
- ✅ View, download, and delete manifestations
- ✅ Access your vision board from any device

---

**Need Help?** Check the troubleshooting sections in README.md or SUPABASE_SETUP.md
