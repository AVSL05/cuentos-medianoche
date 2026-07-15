# Cuentos de Medianoche - Complete Documentation

## Overview

**Cuentos de Medianoche** is a romantic, intimate audio storytelling platform designed for sharing bedtime stories and narrations. It's a Next.js web application with a beautiful midnight-themed UI that allows one person (El Sol) to upload audio stories and another person (La Luna) to listen and enjoy them.

**Live App:** https://cuentos-medianoche.vercel.app/

---

## Features

### 🎯 Core Features

1. **Dual Role System (La Luna & El Sol)**
   - **La Luna (The Moon)** - Listener role: Can play stories, set sleep timers, and enjoy the audio content
   - **El Sol (The Sun)** - Creator/Admin role: Can upload, manage, and delete stories
   - Personalized welcome messages and interface elements based on role
   - Role selection with romantic animated transitions
   - Switch roles anytime from the interface

2. **Audio Management**
   - Upload MP3, M4A, WAV, OGG, AAC audio files
   - Automatic metadata extraction (title, duration, upload date)
   - Cloud storage via Cloudinary
   - Persistent storage using JSONBin API
   - Auto-generated titles from filename (with formatting)

3. **Audio Player**
   - Play/pause controls
   - Seek bar with current time and duration display
   - Volume control (desktop only - browser limitation on mobile)
   - Clean, elegant player UI fixed at bottom of screen
   - Real-time duration tracking

4. **Sleep Timer**
   - Set automatic stop timer: 15, 30, or 60 minutes
   - Pauses audio when timer expires
   - Timer countdown display
   - Cancel timer anytime
   - Designed to help fall asleep gradually

5. **Beautiful UI/UX**
   - Midnight dark theme with navy, lavender, and gold accents
   - Animated starfield background
   - Floating moon and sun elements
   - Smooth animations and transitions
   - Fully responsive design
   - Custom scrollbar styling

---

## Technical Architecture

### Tech Stack

```
Frontend:     Next.js 14.2.3 + React 18 + TypeScript
Styling:      CSS3 with custom animations (Tailwind-inspired utilities)
Font:         Playfair Display (headers) + Crimson Pro (body)
Storage:      Cloudinary (audio files) + JSONBin (metadata)
Deployment:   Vercel
```

### Key Technologies & Integrations

#### 1. **Cloudinary** (Audio Storage)
- **Cloud Name:** `dqknan2pq`
- **Upload Preset:** `cuentos`
- **Resource Type:** Video (used for audio due to Cloudinary's architecture)
- **Folder Structure:** `/cuentos/audios/`
- Provides secure, CDN-backed audio streaming
- Automatic duration detection
- Public URLs for audio playback

#### 2. **JSONBin** (Metadata Store)
- **Bin ID:** `69e14de1856a682189409469`
- **API Endpoint:** `https://api.jsonbin.io/v3/b/{JSONBIN_ID}`
- Stores story list with metadata
- Master Key for API authentication
- Simple document-based storage (no complex database needed)

#### 3. **Browser APIs**
- `localStorage` - Persists user role preference
- HTML5 `<audio>` element for playback
- File input for audio uploads
- XMLHttpRequest for progress tracking

---

## Data Model

### Story Object
```typescript
interface Story {
  id: string;              // Cloudinary public_id
  title: string;           // Display name
  duration?: number;       // Duration in seconds
  uploadedAt: string;      // ISO 8601 timestamp
  url: string;            // Cloudinary secure_url (HTTPS)
  publicId: string;       // Cloudinary public_id for management
}
```

### Cloud Storage Structure
```json
{
  "stories": [
    {
      "id": "cuentos/audios/story1",
      "title": "Mi Primer Cuento",
      "duration": 1245,
      "uploadedAt": "2024-04-16T15:30:00Z",
      "url": "https://res.cloudinary.com/...",
      "publicId": "cuentos/audios/story1"
    }
  ]
}
```

---

## File Structure

```
storytime/
├── app/
│   ├── layout.tsx          # Root layout component
│   ├── page.tsx            # Main application (all-in-one component)
│   ├── globals.css         # Global styles & animations
│   └── favicon.ico         # App icon
├── public/                 # Static assets
├── package.json            # Dependencies & scripts
├── tsconfig.json          # TypeScript configuration
├── next.config.js         # Next.js configuration
├── eslint.config.mjs      # ESLint configuration
├── postcss.config.mjs     # PostCSS configuration
└── README.md              # Default Next.js template
```

---

## Component Structure

### All-in-One Architecture
The entire application is built in a single React component (`page.tsx`) with internal sub-components:

1. **RoleSelector** - Modal for selecting La Luna or El Sol
2. **Main App Component** - Handles all state and UI rendering
3. **Layout** - Starfield background and decorative elements
4. **Upload Panel** - File selection and upload interface
5. **Story List** - Displays all available stories
6. **Player Bar** - Bottom fixed player with controls

---

## State Management

The application uses React `useState` for all state:

```typescript
// User & Role
const [role, setRole] = useState<UserRole>(null);
const [showRoleSelector, setShowRoleSelector] = useState(false);

// Stories
const [stories, setStories] = useState<Story[]>([]);
const [loading, setLoading] = useState(true);

// Playback
const [playing, setPlaying] = useState<string | null>(null);
const [isPaused, setIsPaused] = useState(false);
const [currentTime, setCurrentTime] = useState(0);
const [duration, setDuration] = useState(0);
const [volume, setVolume] = useState(0.8);

// Upload
const [uploading, setUploading] = useState(false);
const [uploadProgress, setUploadProgress] = useState(0);
const [uploadStep, setUploadStep] = useState('');
const [showUpload, setShowUpload] = useState(false);
const [selectedFile, setSelectedFile] = useState<File | null>(null);
const [newTitle, setNewTitle] = useState('');

// Timer
const [timer, setTimer] = useState<number | null>(null);
const [timerLeft, setTimerLeft] = useState<number | null>(null);

// First-time experience
const [showWelcome, setShowWelcome] = useState(false);
```

---

## Key Features Deep Dive

### 1. Upload Flow

```
User selects audio file
    ↓
System extracts filename and creates title
    ↓
User confirms/edits title
    ↓
File uploads to Cloudinary (XHR with progress tracking)
    ↓
Audio metadata extracted (duration)
    ↓
Story object created with all metadata
    ↓
Story list updated and saved to JSONBin
    ↓
UI updates and shows all stories
```

**Upload Progress Tracking:**
- File upload to Cloudinary: 0-80%
- Metadata extraction: 80-90%
- Cloud save: 90-100%

### 2. Audio Playback

```
User clicks story
    ↓
New Audio object created
    ↓
Volume set from state
    ↓
Audio plays
    ↓
Events track: timeupdate, loadedmetadata, ended
    ↓
UI updates in real-time with current time
```

### 3. Sleep Timer

```
User clicks 15/30/60 min button
    ↓
Timer state set with seconds
    ↓
1-second interval countdown
    ↓
Timer reaches 0
    ↓
Audio pauses automatically
    ↓
UI clears timer display
```

---

## Color Scheme & Design System

### CSS Variables
```css
--midnight: #0a0b14         /* Main background */
--deep-navy: #0d1020        /* Alternative bg */
--indigo-dark: #141830      /* Cards */
--indigo-mid: #1e2545       /* Hover states */
--star-blue: #c8d4f0        /* Text accent */
--moon-white: #e8e4f0       /* Primary text */
--gold: #c9a96e             /* El Sol accent */
--gold-dim: #8a6d42         /* Gold hover */
--lavender: #9b8fc0         /* La Luna accent */
--lavender-dim: #5c5478     /* Lavender dim */
```

### Animations
- `twinkle` - Stars twinkling effect
- `float` - Floating emoji elements
- `fade-in` - Smooth opacity + slide
- `slide-up` - Slide up with opacity
- `meetLeft/meetRight` - Moon & Sun meeting animation
- `heartAppear` - Heart pulse animation

---

## APIs & External Services

### Cloudinary Upload API
```
Endpoint: POST https://api.cloudinary.com/v1_1/{CLOUD_NAME}/video/upload
Headers: Content-Type: multipart/form-data
Body:
  - file: binary audio file
  - upload_preset: 'cuentos'
  - resource_type: 'video'
  - folder: 'cuentos/audios'

Response:
  {
    secure_url: "https://...",
    public_id: "cuentos/audios/...",
    duration: 123.45,
    ...
  }
```

### JSONBin Storage API
```
PUT: https://api.jsonbin.io/v3/b/{JSONBIN_ID}
GET: https://api.jsonbin.io/v3/b/{JSONBIN_ID}/latest
Headers:
  - Content-Type: application/json
  - X-Master-Key: {JSONBIN_KEY}
```

---

## Environment Configuration

### Required Environment Variables
None! All credentials are hardcoded as constants in `page.tsx` (intentional for simple deployment):

```typescript
const CLOUD_NAME = 'dqknan2pq';
const UPLOAD_PRESET = 'cuentos';
const JSONBIN_ID = '69e14de1856a682189409469';
const JSONBIN_KEY = '$2a$10$3xuj.14EBhW.V10.jlM/quRqDjbiS9mgiWqKypRIg1rQtVMH6oqOq';
```

### Local Development
No special environment setup needed - just run:
```bash
npm install
npm run dev
```

---

## Usage Guide

### For La Luna (Listener)

1. **First Visit**
   - Welcome screen appears
   - Choose "La Luna" to personalize experience
   - Role saved to browser storage

2. **Browse Stories**
   - See all available stories with duration and upload date
   - Stories are sorted newest first

3. **Listen**
   - Click any story to start playing
   - Use player controls at bottom:
     - Play/Pause button
     - Seek bar to jump to any time
     - Volume slider (desktop only)
     - Sleep timer buttons (15/30/60 min)

4. **Sleep Timer**
   - Click desired duration button
   - Timer shown in blue bar above stories
   - Audio stops automatically when time expires
   - Click "Cancelar" to stop timer early

### For El Sol (Creator)

1. **First Visit**
   - Welcome screen appears
   - Choose "El Sol" to unlock upload features
   - Role saved to browser storage

2. **Upload Story**
   - Click "+ Agregar cuento" button
   - Select audio file from device
   - System auto-fills title (editable)
   - See file size in MB
   - Click "☁️ Guardar en la nube" to upload
   - Progress bar shows upload status:
     - "Subiendo audio..." (uploading to Cloudinary)
     - "Guardando en la nube..." (saving metadata)
     - "¡Listo!" (complete)

3. **Manage Stories**
   - Each story shows delete button (×)
   - Click × to remove story permanently
   - Story removed from both cloud services
   - If story is playing, playback stops

4. **Playback Control**
   - Same controls as La Luna
   - Can play/pause own stories

---

## Browser Support & Limitations

### Desktop Browsers
- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Full volume control available

### Mobile Browsers
- ✅ iOS Safari 14+
- ✅ Chrome Mobile
- ✅ Firefox Mobile
- ❌ Volume control hidden (browser API limitation)
- ✅ All other features work normally

### Audio Format Support
- ✓ MP3, M4A, WAV, OGG, AAC
- ✓ Accepts `.mp3`, `.m4a`, `.wav`, `.ogg`, `.aac` files
- ✓ Size limit depends on Cloudinary plan (default ~100MB)

---

## Deployment

### Current Deployment
- **Platform:** Vercel
- **URL:** https://cuentos-medianoche.vercel.app/
- **Domain:** Connected custom domain
- **Auto-deploy:** GitHub push to main branch

### Deploying to Vercel

1. **Connect Repository**
   ```bash
   vercel link
   ```

2. **Deploy**
   ```bash
   vercel deploy --prod
   ```

3. **Environment** (if needed)
   - No secrets required (all hardcoded)
   - Node.js 18+ runtime

4. **Build Command**
   ```bash
   next build
   ```

5. **Start Command**
   ```bash
   next start
   ```

---

## Performance Considerations

### Optimizations

1. **Audio Streaming**
   - Cloudinary CDN for global distribution
   - Secure URLs (HTTPS)
   - No local storage of audio files

2. **Story List**
   - Loaded once on app start
   - Cached in React state
   - Updates only when stories change
   - Lazy fade-in animations

3. **UI Rendering**
   - Inline styles (avoiding CSS parsing overhead)
   - CSS animations use GPU (transforms)
   - No unused components

### Potential Bottlenecks

- **JSONBin API** - Not ideal for large story libraries (1000+ items)
- **Cloudinary Upload** - Depends on user connection speed
- **Metadata Extraction** - Can take 5+ seconds for long audio files

---

## Troubleshooting

### Audio Won't Upload
- Check file size (should be <100MB)
- Verify file format (MP3, M4A, WAV, OGG, AAC)
- Check internet connection
- Try different browser

### Audio Won't Play
- Clear browser cache
- Try private/incognito mode
- Check browser audio permissions
- Verify Cloudinary URL is accessible

### Timer Not Working
- Refresh page
- Check browser console for errors
- Ensure audio is actually playing

### Stories Not Loading
- Check internet connection
- JSONBin API might be down
- Try refreshing page (Ctrl+Shift+R)
- Check browser console for errors

---

## Future Enhancement Ideas

### Potential Features
1. **Collections/Playlists** - Organize stories into themed playlists
2. **Favorites** - Mark favorite stories without upload
3. **Sharing** - Generate share links for specific stories
4. **Analytics** - Track play history and listening time
5. **Custom Timers** - Set any duration, not just presets
6. **Audio Transcriptions** - View story transcripts
7. **Ratings** - Like/rate stories for feedback
8. **Multi-user Support** - Share account with multiple people
9. **Offline Mode** - Download stories for offline listening
10. **Notifications** - Notify when new story uploaded

### Technical Improvements
1. **Database Migration** - Move from JSONBin to proper database (Supabase, MongoDB)
2. **Authentication** - Add user login system
3. **Image Uploads** - Add story cover art/thumbnails
4. **Search/Filter** - Find stories by title or date
5. **Admin Dashboard** - Analytics and management interface

---

## Security Notes

⚠️ **Important Security Warnings**

1. **Cloudinary Credentials**
   - Upload preset is public (by design)
   - Credentials are readable in frontend code
   - Acceptable for personal use, not for production

2. **JSONBin API Key**
   - Master key is hardcoded in frontend (visible to anyone)
   - Could allow unauthorized access/modification
   - Consider migration to authenticated backend

3. **Recommendations**
   - Add authentication before scaling
   - Use proper backend for API requests
   - Implement proper access control
   - Store secrets server-side only
   - Use environment variables in production

---

## Development

### Local Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open browser
# Visit http://localhost:3000
```

### Building
```bash
# Production build
npm run build

# Start production server
npm start
```

### Code Quality
```bash
# Lint code (if ESLint configured)
npm run lint
```

---

## Project Metadata

- **Name:** Cuentos de Medianoche
- **Version:** 0.1.0
- **Author:** Angel Santana
- **Repository:** GitHub (private)
- **License:** Private/Unlicensed
- **Created:** 2024-04-16
- **Last Updated:** 2024-07-14

---

## Support & Contact

For issues, feature requests, or questions:
- Check this documentation first
- Review troubleshooting section
- Check browser console for error messages
- Verify internet connection and service availability

---

**Made with ❤️ for bedtime stories**
