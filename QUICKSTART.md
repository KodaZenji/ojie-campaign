# 🚀 Quick Start Guide - Admin Dashboard Setup

## ⚡ 5-Minute Setup

### 1️⃣ Install Supabase Client (Already Done!)
✅ `@supabase/supabase-js` is installed

### 2️⃣ Create Your Supabase Project
1. Go to https://supabase.com
2. Sign up with Google or email
3. Click **"New Project"**
4. Name: `ojie-campaign`
5. Database password: **Save this!**
6. Wait 2 minutes ⏳

### 3️⃣ Get Your API Keys
1. In Supabase dashboard, click **Settings** → **API**
2. Copy:
   - **Project URL** → Looks like `https://xxxxx.supabase.co`
   - **anon key** → Long string starting with `eyJ`

### 4️⃣ Create `.env.local` File
In your project root, create `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR...
```

Replace with YOUR actual values!

### 5️⃣ Run Database Setup SQL
1. In Supabase, go to **SQL Editor**
2. Click **"New Query"**
3. Copy & paste this ENTIRE block:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

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

-- Indexes for performance
CREATE INDEX idx_achievements_published ON achievements(is_published);
CREATE INDEX idx_wall_posts_approved ON wall_posts(is_approved);
CREATE INDEX idx_contact_messages_read ON contact_messages(is_read);

-- Enable Row Level Security
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE wall_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Policies: Public can view published achievements
CREATE POLICY "Public can view published achievements"
  ON achievements FOR SELECT
  USING (is_published = true);

-- Policies: Public can view approved wall posts
CREATE POLICY "Public can view approved wall posts"
  ON wall_posts FOR SELECT
  USING (is_approved = true AND is_hidden = false);

-- Policies: Anyone can create wall posts
CREATE POLICY "Anyone can create wall posts"
  ON wall_posts FOR INSERT
  WITH CHECK (true);

-- Policies: Admins can manage all data
CREATE POLICY "Admins can manage achievements"
  ON achievements FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage wall posts"
  ON wall_posts FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage contact messages"
  ON contact_messages FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Enable realtime subscriptions
ALTER PUBLICATION supabase_realtime ADD TABLE wall_posts;
ALTER PUBLICATION supabase_realtime ADD TABLE contact_messages;
```

4. Click **"Run"** ✅

### 6️⃣ Create Your Admin Account
1. In Supabase, go to **Authentication** → **Users**
2. Click **"Add User"**
3. Email: `admin@ojiecampaign.com` (or your email)
4. Password: Create strong password
5. Click **"Add User"** ✅

### 7️⃣ Test It Out!
1. Restart your dev server:
   ```bash
   npm run dev
   ```

2. Open browser to: `http://localhost:3000/admin/login`

3. Login with your credentials!

---

## 🎯 What You Can Do Now

### ✅ Admin Dashboard (`/admin/dashboard`)
- See stats overview
- Quick access to all sections

### ✅ Manage Achievements (`/admin/achievements`)
- Add new achievement cards
- Edit existing ones
- Publish/unpublish
- Delete

### ✅ Moderate Community Wall (`/admin/wall`)
- Approve pending posts
- Hide inappropriate content
- Delete spam

### ✅ View Messages (`/admin/messages`)
- Read contact form submissions
- Mark as read
- Reply via WhatsApp directly

---

## 🔗 URLs to Bookmark

| Page | URL |
|------|-----|
| **Login** | http://localhost:3000/admin/login |
| **Dashboard** | http://localhost:3000/admin/dashboard |
| **Achievements** | http://localhost:3000/admin/achievements |
| **Wall Moderation** | http://localhost:3000/admin/wall |
| **Messages** | http://localhost:3000/admin/messages |
| **Public Site** | http://localhost:3000 |

---

## ❓ Common Issues

**Can't login?**
- Double-check email/password in Supabase
- Make sure `.env.local` has correct values
- Restart dev server

**Database errors?**
- Verify all 3 tables exist in Supabase
- Check RLS policies are enabled
- Look at browser console for errors

**Nothing showing on homepage?**
- Add some achievements in admin panel
- Make sure they're marked as "Published"

---

## 📞 Need the Full Guide?

Check out `ADMIN_README.md` for detailed documentation!

---

**You're all set! 🎉**
Start managing your campaign content dynamically!
