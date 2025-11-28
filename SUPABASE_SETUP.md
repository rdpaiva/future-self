## Supabase Setup Guide for Manifestr

Follow these steps to set up your Supabase project for Manifestr.

### Step 1: Get Your Supabase Credentials

1. Go to your [Supabase Dashboard](https://app.supabase.com)
2. Select your "Manifestr" project
3. Click on **Settings** (gear icon) → **API**
4. Copy the following values:
   - **Project URL** - This is your `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key** - This is your `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Step 2: Add Environment Variables

Create a `.env.local` file in your project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
GOOGLE_API_KEY=your_google_api_key_here
```

### Step 3: Set Up Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Click **New Query**
3. Copy the contents of `supabase/migrations/001_initial_schema.sql`
4. Paste it into the SQL editor
5. Click **Run** to execute the migration

This will create:
- ✅ `profiles` table - User profiles linked to auth
- ✅ `manifestations` table - User's saved manifestations
- ✅ Storage bucket for images
- ✅ Row Level Security (RLS) policies
- ✅ Automatic triggers for user creation

### Step 4: Configure Authentication

1. In Supabase dashboard, go to **Authentication** → **Providers**
2. **Email** should already be enabled
3. Configure the following settings:

#### Email Settings
- Go to **Authentication** → **Email Templates**
- Customize the confirmation and password reset emails if desired

#### Site URL
- Go to **Authentication** → **URL Configuration**
- Add your site URL:
  - Development: `http://localhost:3000`
  - Production: Your deployed URL

#### Redirect URLs
Add these allowed redirect URLs:
- `http://localhost:3000/auth/callback`
- `https://your-domain.com/auth/callback` (for production)

### Step 5: Verify Storage Setup

1. Go to **Storage** in your Supabase dashboard
2. You should see a bucket named `manifestations`
3. It should be set to **Public** (images are viewable by anyone with the URL)

### Step 6: Test the Setup

Run these SQL queries in the SQL Editor to verify everything is set up correctly:

```sql
-- Check tables exist
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public';

-- Check RLS is enabled
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public';

-- Check storage bucket
SELECT * FROM storage.buckets WHERE name = 'manifestations';
```

Expected results:
- You should see `profiles` and `manifestations` tables
- Both should have `rowsecurity = true`
- Storage bucket should exist with `public = true`

### Optional: Configure Email Provider

For production, you'll want to configure a custom email provider:

1. Go to **Settings** → **Auth** → **SMTP Settings**
2. Add your email provider credentials (SendGrid, Mailgun, etc.)
3. This allows you to send emails from your own domain

### Database Schema Overview

#### profiles
- Automatically created when a user signs up
- Links to `auth.users` table
- Stores user information

#### manifestations
- Stores all generated vision board images
- Each manifestation is linked to a user
- Includes original image URL, generated image URL, selected dreams, and affirmation

#### Storage
- `manifestations` bucket stores all uploaded and generated images
- Organized by user ID: `{user_id}/{filename}`
- Publicly accessible via URL

### Troubleshooting

#### "relation does not exist" error
- Make sure you ran the migration SQL script
- Check the SQL Editor for any errors

#### Authentication not working
- Verify your environment variables are set correctly
- Check that Site URL and Redirect URLs are configured
- Make sure you restarted your dev server after adding env vars

#### Images not uploading
- Verify the storage bucket exists and is public
- Check storage policies were created
- Look at the Network tab in browser dev tools for errors

#### RLS policies blocking access
- Test policies in SQL Editor:
```sql
-- Should return your user ID when authenticated
SELECT auth.uid();

-- Should return your manifestations
SELECT * FROM manifestations WHERE user_id = auth.uid();
```

### Next Steps

After completing the setup:
1. Run `npm install` to install Supabase dependencies
2. Run `npm run dev` to start the development server
3. Navigate to `/auth/login` to test authentication
4. Create an account and start manifesting! ✨

### Security Notes

- ✅ Row Level Security (RLS) is enabled on all tables
- ✅ Users can only access their own data
- ✅ Storage bucket is public (images can be viewed by anyone with URL)
- ✅ Auth is required for all user operations
- ⚠️ Consider adding rate limiting for image generation in production
- ⚠️ Monitor storage usage - each user can upload unlimited images

### Useful SQL Queries

```sql
-- Count users
SELECT COUNT(*) FROM auth.users;

-- Count manifestations per user
SELECT user_id, COUNT(*) as total_manifestations
FROM manifestations
GROUP BY user_id;

-- Total storage used
SELECT SUM(metadata->>'size')::bigint as total_bytes
FROM storage.objects
WHERE bucket_id = 'manifestations';

-- Recent manifestations
SELECT * FROM manifestations
ORDER BY created_at DESC
LIMIT 10;
```

---

Need help? Check the [Supabase Documentation](https://supabase.com/docs) or reach out in the project issues.
