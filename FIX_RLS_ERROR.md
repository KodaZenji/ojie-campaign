# 🔧 Fix: Row Level Security Policy Error

## Problem
You're seeing this error when trying to save achievements:
```
new row violates row-level security policy for table "achievements"
```

## Cause
The Supabase database has Row Level Security (RLS) enabled, but the policies don't allow authenticated users (admins) to INSERT or UPDATE records.

## Solution

### Step 1: Open Supabase SQL Editor
1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Click **SQL Editor** in the left sidebar

### Step 2: Run These SQL Commands

Copy and paste ALL of this into the SQL Editor and click **Run**:

```sql
-- Drop old policies if they exist
DROP POLICY IF EXISTS "Public can view published achievements" ON achievements;
DROP POLICY IF EXISTS "Authenticated users can manage achievements" ON achievements;

DROP POLICY IF EXISTS "Public can view approved wall posts" ON wall_posts;
DROP POLICY IF EXISTS "Anyone can create wall posts" ON wall_posts;
DROP POLICY IF EXISTS "Authenticated users can manage wall posts" ON wall_posts;

DROP POLICY IF EXISTS "Admins can view all contact messages" ON contact_messages;
DROP POLICY IF EXISTS "Authenticated users can manage contact messages" ON contact_messages;

-- Recreate policies with correct permissions

-- === ACHIEVEMENTS TABLE ===
-- Public can only VIEW published achievements
CREATE POLICY "Public can view published achievements"
  ON achievements FOR SELECT
  USING (is_published = true);

-- Authenticated users (admins) can do EVERYTHING (SELECT, INSERT, UPDATE, DELETE)
CREATE POLICY "Authenticated users can manage achievements"
  ON achievements FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- === WALL POSTS TABLE ===
-- Public can VIEW approved and visible wall posts
CREATE POLICY "Public can view approved wall posts"
  ON wall_posts FOR SELECT
  USING (is_approved = true AND is_hidden = false);

-- Anyone can CREATE wall posts (they'll need admin approval)
CREATE POLICY "Anyone can create wall posts"
  ON wall_posts FOR INSERT
  WITH CHECK (true);

-- Authenticated users (admins) can do EVERYTHING with wall posts
CREATE POLICY "Authenticated users can manage wall posts"
  ON wall_posts FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- === CONTACT MESSAGES TABLE ===
-- Only authenticated users (admins) can access contact messages
CREATE POLICY "Authenticated users can manage contact messages"
  ON contact_messages FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);
```

### Step 3: Verify It Worked
You should see a success message like:
```
Success. No rows returned
```

### Step 4: Test in Admin Panel
1. Refresh your admin page
2. Try creating a new achievement
3. It should work now! ✅

## What Changed?

**Before:** 
- Only had SELECT policy for public users
- No policies for authenticated users to write data

**After:**
- Public can still only view published achievements
- Authenticated admins can now INSERT, UPDATE, DELETE achievements
- Same fix applied to wall_posts and contact_messages tables

## Still Not Working?

### Check 1: Are You Logged In?
1. Go to `/admin/login`
2. Log in with your admin credentials
3. Try again

### Check 2: Verify Policies Were Created
Run this in SQL Editor:
```sql
SELECT * FROM pg_policies WHERE tablename = 'achievements';
```

You should see 2 policies:
1. `Public can view published achievements`
2. `Authenticated users can manage achievements`

### Check 3: Clear Browser Cache
1. Press `Ctrl + Shift + Delete` (Windows) or `Cmd + Shift + Delete` (Mac)
2. Clear cache and cookies
3. Reload the page

### Check 4: Check Console for Errors
1. Open browser DevTools (F12)
2. Go to Console tab
3. Look for any red errors
4. Share them if you need help

## Understanding RLS

Row Level Security (RLS) is like a bouncer for your database:
- **Without RLS**: Anyone can access anything
- **With RLS**: You define rules for who can do what

Our policies say:
- 🌐 **Public**: Can only SEE published achievements
- 👤 **Logged-in Admins**: Can do EVERYTHING (create, edit, delete)

This keeps your data secure while allowing admins full control!

---

**Need more help?** The updated policies are also in [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)
