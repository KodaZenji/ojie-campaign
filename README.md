# Hon. Ojie Inegbeboh — Campaign Website

APC re-election campaign website for Hon. Eugene Ojie Inegbeboh,
Igueben Constituency, Edo State House of Assembly.

Built by Eromosele Benjamin Michael (KodaZenji) · NICTM Uromi · 2026
Voluntarily, with gratitude.

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Run locally
npm run dev

# 3. Open in browser
http://localhost:3000
```

---

## Editing Content

**All text, links and data live in one file:**

```
lib/data.ts
```

Open that file to change:
- Candidate name, photo, WhatsApp number
- Hero tagline
- Achievement card headlines and body text
- APC section bullet points
- Second term agenda items
- Press outlets
- Footer text
- SEO / Open Graph title and description

You never need to touch a component file just to change wording.

---

## Adding a Photo

1. Drop the photo file into `/public/` — e.g. `ojie-photo.jpg`
2. In `lib/data.ts`, set:
   ```ts
   photo: "/ojie-photo.jpg",
   ```
The hero and navbar will automatically show the photo instead of the initials avatar.

---

## Adding Achievement Card Images

1. Drop images into `/public/images/`
2. In `lib/data.ts`, update the `image` field on the relevant achievement:
   ```ts
   image: "/images/monarch-incident.jpg",
   ```

---

## Connecting the Contact Form (Supabase)

1. Install Supabase:
   ```bash
   npm install @supabase/supabase-js
   ```

2. Create a `messages` table in your Supabase project:
   ```sql
   create table messages (
     id uuid default uuid_generate_v4() primary key,
     name text not null,
     phone text not null,
     message text,
     created_at timestamptz default now()
   );
   ```

3. Copy `.env.example` to `.env.local` and fill in your Supabase URL and service key.

4. Uncomment the Supabase block in `app/api/contact/route.ts`.

5. In `components/ContactSection.tsx`, uncomment the fetch call to `/api/contact`.

---

## Deploying to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow the prompts — select your GitHub repo or local folder.
# Vercel will give you a free live URL instantly.
```

To connect a custom domain (e.g. ojieigueben.com):
1. Buy the domain from Namecheap or Dynadot (~$10/year)
2. In Vercel dashboard → Project → Domains → Add Domain
3. Follow the DNS instructions — takes under 30 minutes

---

## Project Structure

```
ojie-campaign/
├── app/
│   ├── globals.css              Tailwind + Google Fonts + reusable classes
│   ├── layout.tsx               Root layout, metadata, OG tags
│   ├── page.tsx                 Home page — assembles all sections
│   └── api/contact/route.ts     Contact form API (Supabase-ready)
│
├── components/
│   ├── icons/
│   │   └── WhatsAppIcon.tsx     Reusable WhatsApp SVG icon
│   ├── Navbar.tsx               Sticky top navigation
│   ├── Hero.tsx                 Full-screen hero with photo/initials
│   ├── StatsBar.tsx             "1 Term · APC · 20/24" strip
│   ├── AchievementCard.tsx      Single Facebook-post styled card
│   ├── AchievementGrid.tsx      Renders all achievement cards
│   ├── QuoteBlock.tsx           Monarch quote, green background
│   ├── APCSection.tsx           APC membership explanation
│   ├── AgendaSection.tsx        Second term priorities grid
│   ├── PressGrid.tsx            Media coverage outlets
│   ├── GratitudeNote.tsx        Developer gratitude note
│   ├── ContactSection.tsx       WhatsApp CTA + contact form
│   ├── FloatingWhatsApp.tsx     Fixed WhatsApp button on every page
│   └── Footer.tsx               Footer + share nudge bar
│
├── lib/
│   └── data.ts                  ALL EDITABLE CONTENT IS HERE
│
├── public/                      Drop photos and images here
├── .env.example                 Environment variable template
├── next.config.js
├── tailwind.config.ts           APC brand colors defined here
├── tsconfig.json
└── package.json
```

---

## Component Map — What Each File Controls

| Component | Controls |
|---|---|
| `lib/data.ts` | Every word of content on the site |
| `Navbar.tsx` | Top sticky bar, logo, party badge, WhatsApp button |
| `Hero.tsx` | Photo/avatar, name, tagline, two CTA buttons |
| `StatsBar.tsx` | Three stat boxes below the hero |
| `AchievementCard.tsx` | Single FB-post card structure |
| `AchievementGrid.tsx` | Grid layout for all achievement cards |
| `QuoteBlock.tsx` | The monarch quote section |
| `APCSection.tsx` | APC membership explanation and bullet points |
| `AgendaSection.tsx` | Six second-term priority cards |
| `PressGrid.tsx` | Media outlet links grid |
| `GratitudeNote.tsx` | Developer thank-you note |
| `ContactSection.tsx` | WhatsApp button + contact form + form state |
| `FloatingWhatsApp.tsx` | Fixed bottom-right WhatsApp button |
| `Footer.tsx` | Footer text + WhatsApp share nudge |

---

Built with Next.js 14 · Tailwind CSS · Vercel · TypeScript
