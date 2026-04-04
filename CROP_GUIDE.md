# Image Cropping Quick Guide

## 📸 How to Crop Images in Admin Portal

### Step-by-Step Workflow

```
1. Upload Image
   ↓
2. Crop Editor Opens Automatically
   ↓
3. Adjust & Preview
   ↓
4. Apply Crop
   ↓
5. Save Achievement
```

---

## 🎯 Crop Editor Features

### 1. **Drag to Reposition**
- Click and drag the image to move it within the crop frame
- The crop area stays fixed while you reposition the image

### 2. **Zoom Control** (100% - 300%)
```
[Slider] ────────────────●──────────────
         100%          200%           300%
```
- Slide left to zoom out (see more of the image)
- Slide right to zoom in (focus on details)
- Current zoom percentage shown above slider

### 3. **Rotation Control** (0° - 360°)
```
[Slider] ───────●──────────────────────
                90°
                
[Rotate Button] ↻  (Quick 90° rotation)
```
- Use slider for precise rotation
- Click rotate button for instant 90° turns
- Great for fixing sideways photos

### 4. **Aspect Ratio: 4:3**
The crop frame maintains a 4:3 ratio, which is perfect for achievement cards.

Example dimensions:
- 800 × 600 px
- 1200 × 900 px
- 1600 × 1200 px

---

## 💡 Pro Tips

### ✅ DO:
- **Focus on the subject**: Center the main person/object
- **Leave breathing room**: Don't crop too tight around faces
- **Check edges**: Make sure no important elements are cut off
- **Use zoom**: Get closer to the action when needed
- **Rotate if needed**: Fix tilted horizon lines

### ❌ DON'T:
- Cut off heads or faces at awkward angles
- Leave too much empty space
- Forget to check all corners of the crop
- Over-zoom (causes pixelation)

---

## 🖼️ Visual Example

**Before Crop:**
```
┌─────────────────────────────────┐
│                                 │
│    [Person far to the left]     │
│                                 │
│         Lots of empty           │
│            space here           │
│                                 │
└─────────────────────────────────┘
```

**After Crop:**
```
┌──────────────────┐
│                  │
│   [Person        │
│    centered]     │
│                  │
│  Perfect framing │
│                  │
└──────────────────┘
```

---

## 🔄 Re-Cropping Existing Images

Already uploaded an image but want to adjust it?

1. Find the achievement in the list
2. Click **Edit** (pencil icon)
3. On the image preview, click the **blue crop icon** (top-right)
4. Crop editor opens with current image
5. Make your adjustments
6. Click **Apply Crop**
7. Click **Update Achievement**

---

## ⚙️ Technical Details

### What Happens When You Crop:
1. Original image is loaded into memory
2. Your crop settings are applied (position, zoom, rotation)
3. New cropped version is created as JPEG (90% quality)
4. Cropped file replaces the original in the upload queue
5. Only the cropped version is uploaded to Supabase

### File Format:
- Output: JPEG
- Quality: 90% (good balance of quality vs size)
- Filename: `cropped-image.jpg` (renamed during upload)

### Performance:
- Cropping happens in your browser (fast!)
- No server processing needed
- Usually completes in < 1 second

---

## 🆘 Troubleshooting

**Crop editor won't open:**
- Refresh the page and try again
- Check browser console for errors
- Ensure image file is valid

**Can't see the image in cropper:**
- Wait a moment for large images to load
- Try a different image format
- Check if file is corrupted

**Crop looks blurry:**
- Don't zoom in more than 200%
- Start with higher resolution images (at least 800px wide)
- Avoid cropping very small images

**Lost my crop settings:**
- Changes aren't saved until you click "Apply Crop"
- Clicking "Cancel" discards all changes
- You can always re-crop by clicking the crop icon

---

## 📊 Comparison: With vs Without Cropping

| Feature | Without Cropping | With Cropping |
|---------|-----------------|---------------|
| Image consistency | ❌ Varies wildly | ✅ Uniform look |
| Focus on subject | ❌ Depends on original | ✅ Always centered |
| Professional appearance | ⚠️ Hit or miss | ✅ Polished |
| Storage efficiency | ❌ Full size | ✅ Optimized |
| Loading speed | ⚠️ Variable | ✅ Consistent |

---

**Ready to crop?** Head to `/admin/achievements` and try it out! 🚀
