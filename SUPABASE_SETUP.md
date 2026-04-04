# Supabase Configuration for Ojie Campaign Admin System

## 🚀 Setup Instructions

### 1. Create a Supabase Project
1. Go to https://supabase.com and sign up/login
2. Click "New Project"
3. Choose:
   - **Name**: ojie-campaign
   - **Database Password**: (save this securely!)
   - **Region**: Choose closest to Nigeria (likely Europe)
4. Wait ~2 minutes for setup

### 2. Get Your Credentials
1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy these values:/
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 3. Add Environment Variables
Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

### 4. Set Up Database Tables
Run these SQL commands in Supabase **SQL Editor**:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Admin users table (managed by Supabase Auth)
-- No need to create manually - uses Supabase Auth

-- Achievements table
CREATE TABLE achievements (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  date TEXT NOT NULL,
  location TEXT NOT NULL,
  headline TEXT NOT NULL,
  body TEXT NOT NULL,
  reaction TEXT NOT NULL,
  image_url TEXT,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Community wall posts table
CREATE TABLE wall_posts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  message TEXT NOT NULL,
  phone TEXT,
  is_approved BOOLEAN DEFAULT false,
  is_hidden BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Contact messages table
CREATE TABLE contact_messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_achievements_published ON achievements(is_published);
CREATE INDEX idx_wall_posts_approved ON wall_posts(is_approved);
CREATE INDEX idx_contact_messages_read ON contact_messages(is_read);

-- Enable Row Level Security (RLS)
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE wall_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Policies for achievements
-- Public can view published achievements
CREATE POLICY "Public can view published achievements"
  ON achievements FOR SELECT
  USING (is_published = true);

-- Authenticated users (admins) can do everything
CREATE POLICY "Authenticated users can manage achievements"
  ON achievements FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Policies for wall posts
-- Public can view approved wall posts
CREATE POLICY "Public can view approved wall posts"
  ON wall_posts FOR SELECT
  USING (is_approved = true AND is_hidden = false);

-- Anyone can create wall posts (pending approval)
CREATE POLICY "Anyone can create wall posts"
  ON wall_posts FOR INSERT
  WITH CHECK (true);

-- Authenticated users (admins) can manage all wall posts
CREATE POLICY "Authenticated users can manage wall posts"
  ON wall_posts FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Policies for contact messages
-- Only authenticated users (admins) can access
CREATE POLICY "Authenticated users can manage contact messages"
  ON contact_messages FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Set up Realtime subscriptions
ALTER PUBLICATION supabase_realtime ADD TABLE wall_posts;
ALTER PUBLICATION supabase_realtime ADD TABLE contact_messages;
```

### 5. Create Storage Bucket for Images
In Supabase Dashboard:
1. Go to **Storage** → **Buckets**
2. Click **New Bucket**
3. Enter:
   - **Name**: `images`
   - **Public bucket**: ✅ Check this box (makes images publicly accessible)
4. Click **Create bucket**

**Set up Storage Policies:**
Go to **SQL Editor** and run:
```sql
-- Allow anyone to upload images (for admin use)
CREATE POLICY "Allow authenticated users to upload images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'images');

-- Allow public access to view images
CREATE POLICY "Allow public to view images"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'images');

-- Allow admins to delete images
CREATE POLICY "Allow authenticated users to delete images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'images');
```

### 6. Create Initial Admin User
In Supabase Dashboard:
1. Go to **Authentication** → **Users**
2. Click **Add User**
3. Enter:
   - **Email**: admin@ojiecampaign.com (or your email)
   - **Password**: (create a strong password)
4. Save the credentials securely!

### 7. Insert Sample Achievements (Optional)
```sql
INSERT INTO achievements (date, location, headline, body, reaction, image_url) VALUES
('February 2025 · Floor of the House', 'Udo-Eguare Incident · Edo State House of Assembly', '"He Told the Truth When the Police Would Not"', 'When security agencies falsely claimed credit for rescuing the kidnapped Udo-Eguare monarch, Hon. Ojie stood on the floor of the House and said what his people already knew — the community raised the ransom. Not the police. Not the ESSC. The community.', 'Standing Up for Igueben', ''),
('2024–2025 · Majority Caucus, APC', 'College of Education, Igueben — Main Campus', 'Our College Is Now His Priority — From the Right Side of the Table', 'The College of Education Igueben is the heart of this constituency. Now that Hon. Ojie sits with the APC majority government, he is in the strongest position any Igueben lawmaker has been in years to push for COE funding, expanded programmes and full recognition.', 'Education for Igueben', '');
```

## 🔐 Accessing Admin Dashboard

Once everything is set up:
1. Navigate to `/admin/login` on your website
2. Use the admin credentials you created
3. You'll be redirected to `/admin/dashboard`

## 📊 What You Can Do

### Admin Dashboard Features:
- ✅ Add/Edit/Delete achievement cards
- ✅ View and moderate community wall posts
- ✅ See all contact form submissions
- ✅ Real-time updates when someone posts

### Public Features:
- ✅ View published achievements (auto-updates)
- ✅ Submit messages to community wall
- ✅ Send contact messages via form

## 🔧 Troubleshooting

**Can't connect to Supabase?**
- Check `.env.local` exists and has correct values
- Restart dev server: `npm run dev`
- Verify Supabase project is active

**Permission errors?**
- Ensure RLS policies are set up correctly
- Check admin user is authenticated in Supabase

**Need to reset admin password?**
- Go to Supabase → Authentication → Users
- Click the three dots next to user → Edit
- Update password

## 🎨 Next Steps

After setup, the admin can:
1. Log in and manage achievements dynamically
2. Approve/reject wall posts from supporters
3. Track all contact form submissions
4. Update content without touching code
