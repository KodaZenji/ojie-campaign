import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        // Validate file type
        const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json(
                { error: "Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed." },
                { status: 400 }
            );
        }

        // Validate file size (max 5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            return NextResponse.json(
                { error: "File too large. Maximum size is 5MB." },
                { status: 400 }
            );
        }

        // Initialize Supabase client
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (!supabaseUrl || !supabaseServiceKey) {
            console.error("Missing env vars:", {
                hasUrl: !!supabaseUrl,
                hasKey: !!supabaseServiceKey,
                url: supabaseUrl?.substring(0, 20),
                keyLength: supabaseServiceKey?.length
            });
            return NextResponse.json(
                { error: "Server configuration error" },
                { status: 500 }
            );
        }

        const supabase = createClient(supabaseUrl, supabaseServiceKey);

        // Generate unique filename
        const fileExt = file.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `achievements/${fileName}`;

        // Convert file to buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Upload to Supabase Storage
        const { data, error } = await supabase.storage
            .from("images")
            .upload(filePath, buffer, {
                contentType: file.type,
                cacheControl: "3600",
                upsert: false,
            });

        if (error) {
            console.error("Upload error:", error);
            return NextResponse.json(
                { error: "Failed to upload image" },
                { status: 500 }
            );
        }

        // Get public URL
        const {
            data: { publicUrl },
        } = supabase.storage.from("images").getPublicUrl(filePath);

        return NextResponse.json(
            {
                success: true,
                url: publicUrl,
                path: filePath,
            },
            { status: 200 }
        );
    } catch (err) {
        console.error("Image upload error:", err);
        return NextResponse.json(
            { error: "Server error during upload" },
            { status: 500 }
        );
    }
}
