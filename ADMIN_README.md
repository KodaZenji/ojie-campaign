# 🎉 Admin Dashboard & Dynamic Content System

## ✅ What's Been Built

Your campaign website now has a **complete admin dashboard** with real-time content management! Here's what you can do:

### 🔐 **Admin Features**
1. **Secure Login** - Email/password authentication via Supabase
2. **Achievement Management** - Add, edit, delete, publish/unpublish achievement cards
3. **Community Wall Moderation** - Approve/hide supporter messages before they go live
4. **Message Inbox** - View all contact form submissions with read/unread status
5. **Real-time Updates** - Changes appear instantly on the public site

### 🌐 **Public Features**
1. **Dynamic Achievements** - Cards auto-update when admin adds new ones
2. **Community Wall** - Supporters can post messages (requires approval)
3. **Contact Form** - Messages save directly to database

---

## 🚀 Setup Instructions

### Step 1: Create Supabase Account & Project

1. Go to https://supabase.com and sign up (free)
2. Click **"New Project"**
3. Fill in:
   - **Name**: `ojie-campaign`
   - **Database Password**: Create a strong password (save it!)
   - **Region**: Choose closest to Nigeria
4. Wait ~2 minutes for setup

### Step 2: Get Your API Keys

1. In Supabase Dashboard, go to **Settings** → **API**
2. Copy these two values:
   - **Project URL** (e.g., `https://xyzcompany.supabase.co`)
   - **anon/public key** (long string starting with `eyJ...`)

### Step 3: Add Environment Variables

Create a `.env.local` file in your project root:

```bash
cp .env.example .env.local
```

Then edit `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### Step 4: Set Up Database Tables

In your Supabase Dashboard:

1. Go to **SQL Editor** (left sidebar)
2. Click **"New Query"**
3. Paste the SQL from `SUPABASE_SETUP.md` (lines 28-95)
4. Click **"Run"** or press `Ctrl+Enter`

This creates:
- ✅ `achievements` table
- ✅ `wall_posts` table  
- ✅ `contact_messages` table
- ✅ Security policies (RLS)
- ✅ Indexes for performance

### Step 5: Create Admin User

1. In Supabase Dashboard, go to **Authentication** → **Users**
2. Click **"Add User"**
3. Enter:
   - **Email**: Your email (e.g., `admin@ojiecampaign.com`)
   - **Password**: Strong password
4. Click **"Add User"**

**⚠️ IMPORTANT:** Save these credentials securely!

### Step 6: (Optional) Add Sample Data

Want to see how achievements look? Run this SQL in Supabase:

```sql
INSERT INTO achievements (date, location, headline, body, reaction, image_url) VALUES
('February 2025 · Floor of the House', 'Udo-Eguare Incident · Edo State House of Assembly', '"He Told the Truth When the Police Would Not"', 'When security agencies falsely claimed credit for rescuing the kidnapped Udo-Eguare monarch, Hon. Ojie stood on the floor of the House and said what his people already knew — the community raised the ransom.', 'Standing Up for Igueben', ''),
('2024–2025 · Majority Caucus, APC', 'College of Education, Igueben — Main Campus', 'Our College Is Now His Priority', 'The College of Education Igueben is the heart of this constituency. Now that Hon. Ojie sits with the APC majority government, he is in the strongest position to push for COE funding.', 'Education for Igueben', '');
```

---

## 📱 How to Use the Admin Dashboard

### Accessing the Dashboard

1. Start your dev server: `npm run dev`
2. Go to: `http://localhost:3000/admin/login`
3. Enter your admin credentials
4. You'll be redirected to the dashboard

### Managing Achievements

**To Add New Achievement:**
1. Click **"Achievements"** in sidebar
2. Click **"Add New"** button
3. Fill in the form:
   - Date (e.g., "March 2025")
   - Location (where it happened)
   - Headline (compelling title)
   - Body (full story)
   - Reaction Label (e.g., "Real Leadership")
   - Image URL (optional, upload to `/public/images/`)
4. Click **"Create Achievement"**

**To Edit Existing:**
1. Click the ✏️ **Edit** icon on any card
2. Make changes
3. Click **"Update Achievement"**

**To Publish/Unpublish:**
- Click the 👁️ **Eye** icon to toggle visibility
- Unpublished achievements are hidden from public view

**To Delete:**
- Click the 🗑️ **Trash** icon
- Confirm deletion

### Moderating Community Wall

**New posts require approval before going live!**

1. Click **"Community Wall"** in sidebar
2. You'll see **"Pending"** tab by default
3. For each post:
   - ✅ Click **"Approve"** to publish immediately
   - ❌ Click **Delete** to remove spam/inappropriate content
4. Switch tabs to see:
   - **Approved** - Live posts
   - **All Posts** - Everything

**Hide Without Deleting:**
- Click the 👁️ **Eye** icon on approved posts to hide temporarily

### Viewing Messages

1. Click **"Messages"** in sidebar
2. Click any message to view details
3. Actions available:
   - ✓ **Mark as Read** - Clears yellow highlight
   - 📞 **Call Now** - Clicks to call supporter
   - 💬 **Reply on WhatsApp** - Opens WhatsApp chat
   - 🗑️ **Delete** - Remove after responding

---

## 🎨 Public Site Features

### Community Wall (Live on Homepage)

Supporters can now:
1. Scroll to "Community Wall" section
2. Click **"Share Your Support"**
3. Fill in name, phone (optional), message
4. Submit for moderation
5. See their post appear after admin approval!

### Real-Time Updates

- New achievements → appear instantly on homepage
- Approved wall posts → show up immediately
- No page refresh needed!

---

## 🔒 Security Features

✅ **Row Level Security (RLS)** enabled on all tables
✅ **Public can only view** published/approved content
✅ **Only authenticated admins** can create/edit/delete
✅ **Moderation required** for user submissions
✅ **No raw database access** from frontend

---

## 🛠️ Troubleshooting

### Can't Login?
- Check email/password match what's in Supabase
- Reset password in Supabase → Authentication → Users → Edit

### "Missing Supabase environment variables"?
- Ensure `.env.local` exists
- Check values match Supabase dashboard exactly
- Restart dev server: `npm run dev`

### Database errors?
- Verify SQL tables were created successfully
- Check RLS policies are active
- Look at browser console for specific error

### Wall posts not appearing?
- Check if approved in admin dashboard
- Verify `is_approved = true` and `is_hidden = false`
- Try clearing browser cache

---

## 📊 Database Schema Reference

### `achievements` Table
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Unique identifier |
| date | TEXT | When it happened |
| location | TEXT | Where it happened |
| headline | TEXT | Story title |
| body | TEXT | Full story |
| reaction | TEXT | Facebook-style reaction label |
| image_url | TEXT | Path to image (optional) |
| is_published | BOOLEAN | Visible to public? |
| created_at | TIMESTAMP | Auto-generated |

### `wall_posts` Table
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Unique identifier |
| name | TEXT | Supporter's name |
| message | TEXT | Their message |
| phone | TEXT | Optional contact info |
| is_approved | BOOLEAN | Admin approved? |
| is_hidden | BOOLEAN | Hidden by admin? |
| created_at | TIMESTAMP | When submitted |

### `contact_messages` Table
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Unique identifier |
| name | TEXT | Sender's name |
| phone | TEXT | Phone number |
| message | TEXT | Their message |
| is_read | BOOLEAN | Marked as read? |
| created_at | TIMESTAMP | When received |

---

## 🎯 Next Steps (Future Enhancements)

You could add:
- 📸 **Image Upload** - Direct upload to Supabase Storage
- 📊 **Analytics Dashboard** - Track views, engagement
- 📧 **Email Notifications** - Alert admin of new posts
- 🔔 **Push Notifications** - Real-time alerts
- 👥 **Multiple Admin Roles** - Editor vs Super Admin
- 📱 **SMS Integration** - Send bulk updates to supporters

---

## 💡 Tips for Best Results

1. **Regular Updates** - Add new achievements weekly
2. **Quick Moderation** - Approve wall posts same-day
3. **Respond to Messages** - Use WhatsApp quick-reply links
4. **Monitor Analytics** - See which posts get most engagement
5. **Backup Important Content** - Keep copies offline

---

## 🆘 Need Help?

**Supabase Docs:** https://supabase.com/docs
**Next.js Docs:** https://nextjs.org/docs
**This Project:** Check `SUPABASE_SETUP.md` for detailed SQL commands

---

**Built with ❤️ for Hon. Ojie Inegbeboh's Re-election Campaign**
*Edo State House of Assembly · Igueben First, Always*
