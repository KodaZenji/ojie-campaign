# Image Upload Setup Guide

## 🎉 What's New?

The admin portal now supports **direct image uploads** with **built-in cropping**! You can now:
- ✅ Upload images directly from your computer
- ✅ **Crop and adjust images before saving**
- ✅ Zoom in/out for perfect framing
- ✅ Rotate images as needed
- ✅ Preview images before saving
- ✅ Remove/change images easily
- ✅ Automatic optimization and storage

## 📋 Prerequisites

Before using image uploads, you need to set up a Supabase Storage bucket:

### Step 1: Create Storage Bucket
1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Click **Storage** in the left sidebar
4. Click **New Bucket**
5. Enter:
   - **Name**: `images`
   - **Public bucket**: ✅ Check this box
6. Click **Create bucket**

### Step 2: Set Up Storage Policies
In Supabase, go to **SQL Editor** and run these commands:

```sql
-- Allow authenticated users (admins) to upload images
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

## 🚀 How to Use Image Upload

### Creating a New Achievement with Image

1. Log in to admin dashboard at `/admin/login`
2. Navigate to **Achievements** page
3. Click **Add New** button
4. Fill in the form fields (Date, Location, Headline, etc.)
5. In the **Image** section:
   - Click on the dashed box that says "Choose image file"
   - Select an image from your computer
   - **The crop editor will open automatically**
6. **Adjust your image:**
   - Drag to reposition the crop area
   - Use zoom slider to zoom in/out (100% - 300%)
   - Use rotation slider or rotate button to adjust angle
   - The aspect ratio is locked at 4:3 (optimal for cards)
7. Click **Apply Crop** when satisfied
8. Preview will show the cropped result
9. Click **Create Achievement**
10. The cropped image will upload and save automatically!

### Editing an Existing Achievement

1. Find the achievement in the list
2. Click the **Edit** (pencil) icon
3. The current image will show as a preview
4. To change the image:
   - Click the dashed upload box
   - Select a new image
   - Crop editor opens automatically
   - Adjust and apply crop
   - Old image will be replaced
5. **To re-crop existing image:**
   - Click the blue **crop icon** on the preview
   - Adjust the crop as needed
   - Click **Apply Crop**
6. To remove the image:
   - Click the red **X** button on the preview
7. Click **Update Achievement**

### Supported Image Formats
- ✅ JPEG/JPG
- ✅ PNG
- ✅ WebP
- ✅ GIF

### File Size Limit
- Maximum: **5 MB** per image
- Recommended: Keep images under 2 MB for faster loading

## 🎨 Image Cropping Features

### Crop Controls
- **Drag**: Move the crop area around the image
- **Zoom Slider**: Zoom from 100% to 300%
- **Rotation Slider**: Rotate 0° to 360°
- **Rotate Button**: Quick 90° rotation
- **Aspect Ratio**: Fixed at 4:3 (perfect for achievement cards)

### Why Crop?
- Focus on the most important part of the image
- Ensure consistent sizing across all cards
- Remove unwanted background elements
- Better composition and visual appeal

## 💡 Tips for Best Results

1. **Image Dimensions**: 
   - Ideal: 1200x800px or similar landscape ratio
   - Minimum: 800x600px
   
2. **File Size Optimization**:
   - Use tools like TinyPNG or Squoosh to compress images
   - Smaller files = faster uploads and page loads

3. **Image Quality**:
   - High quality but not excessive
   - JPEG quality 80-85% is usually perfect

## 🔧 Troubleshooting

**Upload fails with error:**
- Check your internet connection
- Verify image is under 5MB
- Ensure file type is supported (JPEG, PNG, WebP, GIF)
- Confirm storage bucket is created in Supabase

**Image doesn't show after upload:**
- Wait a few seconds for upload to complete
- Refresh the achievements page
- Check browser console for errors
- Verify storage policies are set correctly

**Can't see uploaded images on website:**
- Make sure the storage bucket is **public**
- Check that RLS policies allow public SELECT access
- Clear browser cache

## 📊 Storage Management

Images are stored in Supabase Storage under:
- **Bucket**: `images`
- **Folder**: `achievements/`
- **Naming**: Automatic (timestamp + random string)

Each image gets a unique name like:
```
achievements/1712345678901-abc123.jpg
```

This prevents filename conflicts and ensures all images are organized.

## 🎯 What Changed from Before?

**Old Way:**
- Had to manually upload images elsewhere
- Copy/paste URL into text field
- Easy to make mistakes
- No preview

**New Way:**
- Direct upload from computer
- Instant preview
- One-click removal
- Automatic URL generation
- Professional workflow

---

**Need Help?**
Check the main [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) for complete system setup instructions.
