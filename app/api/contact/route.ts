import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// ── HOW TO ACTIVATE THIS ROUTE ────────────────────────────────────────────────
// 1. Install Supabase client:  npm install @supabase/supabase-js
// 2. Create a table in Supabase called "messages" with columns:
//      id (uuid, default uuid_generate_v4())
//      name (text)
//      phone (text)
//      message (text)
//      created_at (timestamptz, default now())
// 3. Add your keys to .env.local:
//      SUPABASE_URL=https://xxxxxx.supabase.co
//      SUPABASE_SERVICE_KEY=your-service-role-key
// 4. Uncomment the Supabase block below and remove the placeholder response.
// ─────────────────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, phone, message } = body as {
      name: string;
      phone: string;
      message?: string;
    };

    if (!name || !phone) {
      return NextResponse.json({ error: "Name and phone are required." }, { status: 400 });
    }

    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_KEY!
    );

    const { error } = await supabase
      .from("messages")
      .insert([{ name, phone, message }]);

    if (error) throw error;
    // ────────────────────────────────────────────────────────────────────────


    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("Contact form error:", err);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
