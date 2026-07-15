# API Reference & Technical Specifications

## Table of Contents
1. [Cloudinary Upload API](#cloudinary-upload-api)
2. [JSONBin Storage API](#jsonbin-storage-api)
3. [Frontend Data Models](#frontend-data-models)
4. [Function Reference](#function-reference)

---

## Cloudinary Upload API

### Overview
Cloudinary handles all audio file storage and streaming with CDN distribution.

### Upload Endpoint

**URL:** `https://api.cloudinary.com/v1_1/{CLOUD_NAME}/video/upload`

**Method:** `POST`

**Cloud Name:** `dqknan2pq`

### Request Format

```
Content-Type: multipart/form-data

Form Parameters:
├── file: File                    (Required) Binary audio file
├── upload_preset: string         (Required) "cuentos"
├── resource_type: string         (Required) "video"
└── folder: string                (Required) "cuentos/audios"
```

### Upload Request (JavaScript)

```javascript
const CLOUD_NAME = 'dqknan2pq';
const UPLOAD_PRESET = 'cuentos';

const formData = new FormData();
formData.append('file', audioFile);
formData.append('upload_preset', UPLOAD_PRESET);
formData.append('resource_type', 'video');
formData.append('folder', 'cuentos/audios');

const xhr = new XMLHttpRequest();
xhr.open('POST', `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/video/upload`);
xhr.send(formData);
```

### Response Format

```json
{
  "public_id": "cuentos/audios/my_story_abc123",
  "version": 1681656600,
  "signature": "...",
  "width": 0,
  "height": 0,
  "format": "mp3",
  "resource_type": "video",
  "created_at": "2024-04-16T15:30:00Z",
  "tags": [],
  "bytes": 5242880,
  "type": "upload",
  "etag": "...",
  "placeholder": false,
  "url": "http://res.cloudinary.com/dqknan2pq/video/upload/v1681656600/cuentos/audios/my_story_abc123.mp3",
  "secure_url": "https://res.cloudinary.com/dqknan2pq/video/upload/v1681656600/cuentos/audios/my_story_abc123.mp3",
  "folder": "cuentos/audios",
  "original_filename": "my_story",
  "duration": 234.5,
  "is_audio": false
}
```

### Response Fields (Relevant)

| Field | Type | Description |
|-------|------|-------------|
| `public_id` | string | Unique identifier for the file |
| `secure_url` | string | HTTPS URL for streaming |
| `duration` | number | Audio duration in seconds |
| `bytes` | number | File size in bytes |
| `created_at` | ISO string | Upload timestamp |

### Progress Tracking

```javascript
const xhr = new XMLHttpRequest();

xhr.upload.addEventListener('progress', (event) => {
  if (event.lengthComputable) {
    const percentComplete = (event.loaded / event.total) * 100;
    console.log(`Upload progress: ${percentComplete}%`);
  }
});
```

### Error Handling

```javascript
xhr.addEventListener('error', () => {
  console.error('Upload failed');
});

xhr.addEventListener('abort', () => {
  console.error('Upload aborted');
});
```

---

## JSONBin Storage API

### Overview
JSONBin stores metadata for all stories in a single JSON document. Think of it as a simple cloud database.

### Configuration

**Endpoint:** `https://api.jsonbin.io/v3/b/`

**Bin ID:** `69e14de1856a682189409469`

**Master Key:** `$2a$10$3xuj.14EBhW.V10.jlM/quRqDjbiS9mgiWqKypRIg1rQtVMH6oqOq`

### Get Stories (Read)

**URL:** `https://api.jsonbin.io/v3/b/69e14de1856a682189409469/latest`

**Method:** `GET`

**Headers:**
```
Content-Type: application/json
X-Master-Key: $2a$10$3xuj.14EBhW.V10.jlM/quRqDjbiS9mgiWqKypRIg1rQtVMH6oqOq
```

**Response:**
```json
{
  "record": {
    "stories": [
      {
        "id": "cuentos/audios/story1",
        "title": "Mi Primer Cuento",
        "duration": 1245,
        "uploadedAt": "2024-04-16T15:30:00.000Z",
        "url": "https://res.cloudinary.com/...",
        "publicId": "cuentos/audios/story1"
      }
    ]
  },
  "metadata": {
    "id": "69e14de1856a682189409469",
    "parent": null,
    "name": null,
    "private": false,
    "createdAt": "2024-04-16T14:00:00.000Z"
  }
}
```

### Update Stories (Write)

**URL:** `https://api.jsonbin.io/v3/b/69e14de1856a682189409469`

**Method:** `PUT`

**Headers:**
```
Content-Type: application/json
X-Master-Key: $2a$10$3xuj.14EBhW.V10.jlM/quRqDjbiS9mgiWqKypRIg1rQtVMH6oqOq
```

**Request Body:**
```json
{
  "stories": [
    {
      "id": "cuentos/audios/new_story",
      "title": "New Story Title",
      "duration": 1234,
      "uploadedAt": "2024-04-16T16:00:00.000Z",
      "url": "https://res.cloudinary.com/...",
      "publicId": "cuentos/audios/new_story"
    }
  ]
}
```

**Response:**
```json
{
  "success": true
}
```

### JavaScript Implementation

```javascript
// Load stories from cloud
async function loadStoriesFromCloud() {
  try {
    const res = await fetch(
      'https://api.jsonbin.io/v3/b/69e14de1856a682189409469/latest',
      {
        headers: {
          'X-Master-Key': '$2a$10$3xuj.14EBhW.V10.jlM/quRqDjbiS9mgiWqKypRIg1rQtVMH6oqOq'
        }
      }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data.record?.stories) ? data.record.stories : [];
  } catch {
    return [];
  }
}

// Save stories to cloud
async function saveStoriesToCloud(stories) {
  try {
    const res = await fetch(
      'https://api.jsonbin.io/v3/b/69e14de1856a682189409469',
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Master-Key': '$2a$10$3xuj.14EBhW.V10.jlM/quRqDjbiS9mgiWqKypRIg1rQtVMH6oqOq'
        },
        body: JSON.stringify({ stories })
      }
    );
    return res.ok;
  } catch {
    return false;
  }
}
```

---

## Frontend Data Models

### Story Type

```typescript
interface Story {
  id: string;              // Cloudinary public_id (unique key)
  title: string;           // Display name (user-provided)
  duration?: number;       // Duration in seconds (auto-detected)
  uploadedAt: string;      // ISO 8601 timestamp (when uploaded)
  url: string;            // HTTPS Cloudinary URL for playback
  publicId: string;       // Same as id (Cloudinary public_id)
}
```

### UserRole Type

```typescript
type UserRole = 'luna' | 'sol' | null;

// 'luna' = La Luna (listener, can't upload)
// 'sol'  = El Sol (creator, can upload)
// null   = Not yet selected
```

### Example Story

```typescript
{
  id: "cuentos/audios/first_story_v1681656600",
  title: "El Primer Cuento Especial",
  duration: 1234.5,
  uploadedAt: "2024-04-16T15:30:00.000Z",
  url: "https://res.cloudinary.com/dqknan2pq/video/upload/v1681656600/cuentos/audios/first_story_v1681656600.mp3",
  publicId: "cuentos/audios/first_story_v1681656600"
}
```

---

## Function Reference

### Storage Functions

#### `loadStoriesFromCloud(): Promise<Story[]>`

Fetches all stories from JSONBin.

**Returns:** Array of Story objects (empty array on error)

**Usage:**
```typescript
const stories = await loadStoriesFromCloud();
setStories(stories);
```

**Error Handling:** Returns empty array if fetch fails

---

#### `saveStoriesToCloud(stories: Story[]): Promise<boolean>`

Saves story list to JSONBin.

**Parameters:**
- `stories: Story[]` - Array of all stories to save

**Returns:** `true` if successful, `false` on error

**Usage:**
```typescript
const updated = [newStory, ...stories];
const success = await saveStoriesToCloud(updated);
if (!success) {
  alert('Hubo un error. Intenta de nuevo.');
}
```

---

### UI Functions

#### `formatDuration(secs: number): string`

Converts seconds to MM:SS format.

**Parameters:**
- `secs: number` - Duration in seconds

**Returns:** String in format "M:SS" or "MM:SS"

**Examples:**
```typescript
formatDuration(65)    // "1:05"
formatDuration(3661)  // "61:01"
formatDuration(45)    // "0:45"
```

---

#### `formatDate(iso: string): string`

Formats ISO date to Spanish locale.

**Parameters:**
- `iso: string` - ISO 8601 timestamp

**Returns:** Formatted date string in Spanish

**Examples:**
```typescript
formatDate("2024-04-16T15:30:00Z")  // "16 de abril"
formatDate("2024-07-14T12:00:00Z")  // "14 de julio"
```

---

### Playback Functions

#### `playStory(story: Story): void`

Starts playing an audio story.

**Parameters:**
- `story: Story` - Story object to play

**Behavior:**
- Stops any currently playing audio
- Creates new Audio object
- Sets volume from state
- Attaches event listeners
- Plays audio

---

#### `togglePlay(): void`

Toggles between play and pause.

**Behavior:**
- If playing: pauses audio
- If paused: resumes audio
- Updates UI state

---

#### `seek(e: React.ChangeEvent<HTMLInputElement>): void`

Jumps to specific time in audio.

**Parameters:**
- `e` - Input range change event

**Behavior:**
- Extracts new time from event
- Sets audio currentTime
- Updates UI state

---

### Timer Functions

#### `startSleepTimer(minutes: number): void`

Starts countdown timer to pause audio.

**Parameters:**
- `minutes: number` - Duration (15, 30, or 60)

**Behavior:**
- Sets timer state
- Starts 1-second interval countdown
- Updates UI every second

---

#### `cancelTimer(): void`

Stops and clears active timer.

**Behavior:**
- Clears timeout reference
- Resets timer state
- Removes timer UI

---

### Upload Functions

#### `handleFileSelect(e: React.ChangeEvent<HTMLInputElement>): void`

Processes selected audio file.

**Parameters:**
- `e` - File input change event

**Behavior:**
- Extracts file from input
- Auto-generates title from filename
- Sets selected file state

---

#### `handleUpload(): Promise<void>`

Uploads audio to Cloudinary and saves metadata.

**Behavior:**

1. **Validation**
   - Checks if file selected
   - Sets uploading state

2. **Upload Phase**
   - Creates FormData
   - Sends to Cloudinary
   - Tracks progress (0-80%)

3. **Duration Detection**
   - Creates Audio object
   - Waits for metadata load
   - Extracts duration

4. **Save Phase**
   - Creates Story object
   - Saves to JSONBin (80-100%)

5. **Cleanup**
   - Updates local state
   - Clears upload form
   - Closes upload UI

**Error Handling:**
```javascript
try {
  // Upload steps
} catch {
  setUploading(false);
  alert('Hubo un error. Intenta de nuevo.');
}
```

---

#### `deleteStory(id: string): Promise<void>`

Removes story from cloud.

**Parameters:**
- `id: string` - Story ID to delete

**Behavior:**
- Stops playback if story is playing
- Filters story from local array
- Saves updated array to JSONBin
- Updates UI

---

### State Management

#### Component State
```typescript
// User & Role
role: UserRole
showRoleSelector: boolean

// Stories
stories: Story[]
loading: boolean

// Playback
playing: string | null          // Story ID or null
isPaused: boolean
currentTime: number             // Seconds
duration: number                // Seconds
volume: number                  // 0.0 to 1.0

// Upload
uploading: boolean
uploadProgress: number          // 0-100%
uploadStep: string              // Current step message
showUpload: boolean
selectedFile: File | null
newTitle: string

// Timer
timer: number | null            // Set minutes or null
timerLeft: number | null        // Remaining seconds or null

// First-time
showWelcome: boolean
```

---

## Authentication & Security

### Current Implementation
- ❌ **No authentication** - Anyone can read/modify stories
- ❌ **Secrets hardcoded** - API keys visible in frontend

### Security Concerns
```
🔓 Cloudinary Upload Preset
   ├─ Public (by design)
   ├─ Limited to /cuentos/audios/ folder
   └─ Can only upload videos

🔓 JSONBin Master Key
   ├─ Visible in frontend code
   ├─ Full read/write access
   └─ Anyone can download/modify stories

⚠️  Recommendations
   ├─ Add backend authentication
   ├─ Move secrets to server
   ├─ Implement access control
   └─ Use OAuth or JWT tokens
```

---

## Error Codes & Messages

### Upload Errors

| Error | Cause | Solution |
|-------|-------|----------|
| "Hubo un error. Intenta de nuevo." | Network or API failure | Check connection, retry |
| File not accepted | Wrong format | Use MP3, M4A, WAV, OGG, AAC |
| Upload timeout | Connection too slow | Try again with better connection |

### Playback Errors

| Error | Cause | Solution |
|-------|-------|----------|
| No audio plays | URL unreachable | Check Cloudinary status |
| Audio cuts out | Network interruption | Refresh and retry |
| Duration 0 | Metadata failed to load | Some older browsers have issues |

### Storage Errors

| Error | Cause | Solution |
|-------|-------|----------|
| Stories won't load | JSONBin down | Wait and refresh |
| Stories won't save | API failure | Retry operation |
| localStorage full | Browser storage limit | Clear cache |

---

## Limits & Quotas

### Cloudinary (Free Plan)
- **Storage:** 25GB total
- **Bandwidth:** 25GB/month
- **Uploads:** Unlimited files
- **File Size:** Up to ~100MB per file
- **Formats:** MP3, M4A, WAV, OGG, AAC

### JSONBin (Free Plan)
- **Collections:** 100 bins
- **Size:** ~128KB per bin
- **Requests:** Reasonable rate limits
- **Retention:** Bins persist

### Browser Storage (localStorage)
- **Size:** 5-10MB per domain
- **Persistence:** Until manually cleared
- **Scope:** Per-origin only

---

## Rate Limiting

### Cloudinary
- Reasonable rate limits for free tier
- No specific documented limits
- Large concurrent uploads may be throttled

### JSONBin
- No documented rate limits
- Free tier has reasonable quotas
- Should handle 100-200 operations/minute

### Frontend UI Limits
- Upload: One at a time (UI disabled during upload)
- Delete: Immediate (no queue)
- Playback: One story at a time

---

## Testing APIs

### Test Upload
```bash
curl -X POST \
  -F "file=@test.mp3" \
  -F "upload_preset=cuentos" \
  -F "resource_type=video" \
  -F "folder=cuentos/audios" \
  "https://api.cloudinary.com/v1_1/dqknan2pq/video/upload"
```

### Test Storage Read
```bash
curl -X GET \
  -H "X-Master-Key: $2a$10$3xuj.14EBhW.V10.jlM/quRqDjbiS9mgiWqKypRIg1rQtVMH6oqOq" \
  "https://api.jsonbin.io/v3/b/69e14de1856a682189409469/latest"
```

### Test Storage Write
```bash
curl -X PUT \
  -H "Content-Type: application/json" \
  -H "X-Master-Key: $2a$10$3xuj.14EBhW.V10.jlM/quRqDjbiS9mgiWqKypRIg1rQtVMH6oqOq" \
  -d '{"stories":[]}' \
  "https://api.jsonbin.io/v3/b/69e14de1856a682189409469"
```

---

## Debugging Tips

### Enable Verbose Logging
Add to `page.tsx`:
```typescript
const DEBUG = true;

if (DEBUG) {
  console.log('[DEBUG] Stories loaded:', stories);
  console.log('[DEBUG] Playing:', playing, currentStory);
}
```

### Network Debugging
1. Open DevTools (F12)
2. Go to Network tab
3. Check Cloudinary requests
4. Check JSONBin requests
5. Verify response codes and payloads

### Storage Debugging
```javascript
// View localStorage
console.log(localStorage.getItem('welcome_seen'));
console.log(localStorage.getItem('user_role'));

// Clear localStorage
localStorage.clear();
```

### Audio Debugging
```javascript
// Check audio element state
console.log(audioRef.current.paused);
console.log(audioRef.current.currentTime);
console.log(audioRef.current.duration);
console.log(audioRef.current.volume);
```

---

**Last Updated:** 2024-07-14
