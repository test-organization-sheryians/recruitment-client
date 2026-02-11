# UploadThing Setup Instructions

## 1. Install UploadThing

```bash
npm install uploadthing @uploadthing/react
```

## 2. Get Your API Keys

1. Go to https://uploadthing.com
2. Sign up / Log in
3. Create a new app
4. Copy your API keys

## 3. Add Environment Variables

Add to your `.env.local` file:

```env
UPLOADTHING_SECRET=sk_live_xxxxxxxxxxxxx
UPLOADTHING_APP_ID=your-app-id
```

## 4. Implementation Complete

The following files have been created:

- ✅ `/src/lib/uploadthing.ts` - Client helpers
- ✅ `/src/app/api/uploadthing/core.ts` - File router configuration
- ✅ `/src/app/api/uploadthing/route.ts` - API route handler
- ✅ Updated `BlogSettingPanel.tsx` - Hero image upload
- ✅ Updated `BlogEditor.tsx` - Blog content image upload

## How It Works

### Hero Image Upload (BlogSettingPanel)

When you upload a hero image:

1. File is selected via file input
2. `startUpload()` sends file to UploadThing
3. UploadThing returns a permanent URL
4. URL is stored in state and sent to backend

### Blog Content Images (BlogEditor)

When you add images in the blog editor:

1. BlockNote editor calls `uploadFile()`
2. File is uploaded to UploadThing
3. Returns permanent URL
4. URL is embedded in blog content

## Console Logs

Both uploads log detailed information:

- File name, size, type
- Upload progress
- Final UploadThing URL
- Complete upload object

## Next Steps

1. Install the package: `npm install uploadthing @uploadthing/react`
2. Add your API keys to `.env.local`
3. Restart your dev server
4. Test uploading images!

## Features

- ✅ Automatic CDN delivery
- ✅ Image optimization
- ✅ Permanent URLs (no blob URLs)
- ✅ Progress tracking
- ✅ Error handling with fallbacks
- ✅ Detailed console logging
- ✅ Max file size limits (4MB for content, 8MB for hero)
- ✅ Image-only uploads

## Backend Storage

Images are now stored on UploadThing's CDN and you'll receive URLs like:

```
https://utfs.io/f/8a9b2c3d-4e5f-6a7b.png
```

These URLs can be saved directly to your MongoDB database in the `hero.imageUrl` field and blog content.
