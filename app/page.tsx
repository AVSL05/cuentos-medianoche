'use client';

import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';

const CLOUD_NAME = 'dqknan2pq';
const UPLOAD_PRESET = 'cuentos';
const JSONBIN_ID = '69e14de1856a682189409469';
const JSONBIN_URL = `https://api.jsonbin.io/v3/b/${JSONBIN_ID}`;
const JSONBIN_KEY = '$2a$10$3xuj.14EBhW.V10.jlM/quRqDjbiS9mgiWqKypRIg1rQtVMH6oqOq';

type UserRole = 'luna' | 'sol' | null;

interface Story {
  id: string;
  title: string;
  duration?: number;
  uploadedAt: string;
  url: string;
  publicId: string;
  isFavorite?: boolean;
}

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface DeleteConfirmation {
  storyId: string;
  storyTitle: string;
}

const STARS = Array.from({ length: 80 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 2 + 0.5,
  delay: Math.random() * 4,
  duration: Math.random() * 3 + 2,
}));

function formatDuration(secs: number) {
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('es-MX', { day: 'numeric', month: 'long' });
}

async function saveStoriesToCloud(stories: Story[]) {
  try {
    const res = await fetch(JSONBIN_URL, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'X-Master-Key': JSONBIN_KEY },
      body: JSON.stringify({ stories }),
    });
    return res.ok;
  } catch { return false; }
}

async function loadStoriesFromCloud(): Promise<Story[]> {
  try {
    const res = await fetch(`${JSONBIN_URL}/latest`, {
      headers: { 'X-Master-Key': JSONBIN_KEY },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data.record?.stories) ? data.record.stories : [];
  } catch { return []; }
}

// ── Toast Notifications ────────────────────────────────────────────────────
function Toast({ toast, onRemove }: { toast: Toast; onRemove: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onRemove, 4000);
    return () => clearTimeout(timer);
  }, [onRemove]);

  const bgColor = {
    success: 'rgba(76, 175, 80, 0.2)',
    error: 'rgba(244, 67, 54, 0.2)',
    info: 'rgba(33, 150, 243, 0.2)',
  }[toast.type];

  const borderColor = {
    success: 'rgba(76, 175, 80, 0.5)',
    error: 'rgba(244, 67, 54, 0.5)',
    info: 'rgba(33, 150, 243, 0.5)',
  }[toast.type];

  const icon = { success: '✓', error: '✕', info: 'ℹ' }[toast.type];

  return (
    <div style={{
      background: bgColor,
      border: `1px solid ${borderColor}`,
      color: 'var(--moon-white)',
      padding: '12px 16px',
      borderRadius: 8,
      marginBottom: 8,
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      animation: 'slide-up 0.3s ease',
      fontSize: 14,
    }}>
      <span style={{ fontSize: 16 }}>{icon}</span>
      <span>{toast.message}</span>
    </div>
  );
}

// ── Role Selector ──────────────────────────────────────────────────────────
function RoleSelector({ onSelect }: { onSelect: (role: UserRole) => void }) {
  const [chosen, setChosen] = useState<UserRole>(null);
  const [animating, setAnimating] = useState(false);

  const choose = (role: UserRole) => {
    if (animating) return;
    setChosen(role);
    setAnimating(true);
    setTimeout(() => onSelect(role), 2200);
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 300,
      background: 'rgba(5,6,15,0.92)', backdropFilter: 'blur(16px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
    }}>
      <div style={{
        textAlign: 'center', maxWidth: 420,
        animation: 'slide-up 0.6s cubic-bezier(0.16,1,0.3,1) forwards',
      }}>
        {!animating ? (
          <>
            <p style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 14, letterSpacing: '0.2em',
              color: 'var(--lavender)', textTransform: 'uppercase',
              marginBottom: 12, opacity: 0.7,
            }}>¿Quién está aquí esta noche?</p>
            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(22px,5vw,32px)', fontWeight: 400,
              color: 'var(--moon-white)', marginBottom: 40, lineHeight: 1.3,
            }}>Elige tu lugar en el cielo</h2>

            <div style={{ display: 'flex', gap: 24, justifyContent: 'center', flexWrap: 'wrap' }}>
              {/* Luna */}
              <button onClick={() => choose('luna')} style={{
                background: 'linear-gradient(145deg, rgba(20,24,55,0.9), rgba(30,37,80,0.8))',
                border: '1px solid rgba(155,143,192,0.35)',
                borderRadius: 24, padding: '32px 28px', cursor: 'pointer',
                flex: 1, maxWidth: 160, transition: 'all 0.3s',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14,
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'rgba(155,143,192,0.7)';
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 12px 40px rgba(155,143,192,0.2)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'rgba(155,143,192,0.35)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <span style={{ fontSize: 52, animation: 'float 4s ease-in-out infinite' }}>🌙</span>
                <div>
                  <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, color: 'var(--moon-white)', marginBottom: 4 }}>La Luna</p>
                  <p style={{ color: 'var(--lavender)', fontSize: 13, fontStyle: 'italic', opacity: 0.8 }}>Escucha</p>
                </div>
              </button>

              {/* Sol */}
              <button onClick={() => choose('sol')} style={{
                background: 'linear-gradient(145deg, rgba(40,28,10,0.9), rgba(60,40,10,0.8))',
                border: '1px solid rgba(201,169,110,0.35)',
                borderRadius: 24, padding: '32px 28px', cursor: 'pointer',
                flex: 1, maxWidth: 160, transition: 'all 0.3s',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14,
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'rgba(201,169,110,0.7)';
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 12px 40px rgba(201,169,110,0.2)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'rgba(201,169,110,0.35)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <span style={{ fontSize: 52, animation: 'float 4s 0.5s ease-in-out infinite' }}>☀️</span>
                <div>
                  <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, color: 'var(--moon-white)', marginBottom: 4 }}>El Sol</p>
                  <p style={{ color: 'var(--gold)', fontSize: 13, fontStyle: 'italic', opacity: 0.8 }}>Cuenta</p>
                </div>
              </button>
            </div>
          </>
        ) : (
          /* Heart animation */
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
            <div style={{ position: 'relative', width: 140, height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{
                fontSize: 44,
                position: 'absolute',
                animation: chosen === 'luna' ? 'meetLeft 0.8s cubic-bezier(0.4,0,0.2,1) forwards' : 'meetRight 0.8s cubic-bezier(0.4,0,0.2,1) forwards',
              }}>
                {chosen === 'luna' ? '🌙' : '☀️'}
              </span>
              <span style={{
                fontSize: 44,
                position: 'absolute',
                animation: chosen === 'luna' ? 'meetRight 0.8s cubic-bezier(0.4,0,0.2,1) forwards' : 'meetLeft 0.8s cubic-bezier(0.4,0,0.2,1) forwards',
              }}>
                {chosen === 'luna' ? '☀️' : '🌙'}
              </span>
            </div>
            <span style={{
              fontSize: 56,
              animation: 'heartAppear 0.6s 0.9s cubic-bezier(0.175,0.885,0.32,1.275) both',
              display: 'block',
            }}>🤍</span>
            <p style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 18, color: 'var(--moon-white)',
              fontStyle: 'italic', opacity: 0,
              animation: 'fade-in 0.5s 1.4s ease forwards',
            }}>
              {chosen === 'luna' ? 'Buenas noches, amor...' : 'Bienvenido de vuelta...'}
            </p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes meetLeft {
          0% { transform: translateX(-50px); opacity: 1; }
          80% { transform: translateX(0px); opacity: 1; }
          100% { transform: translateX(0px); opacity: 0; }
        }
        @keyframes meetRight {
          0% { transform: translateX(50px); opacity: 1; }
          80% { transform: translateX(0px); opacity: 1; }
          100% { transform: translateX(0px); opacity: 0; }
        }
        @keyframes heartAppear {
          0% { transform: scale(0) rotate(-20deg); opacity: 0; }
          60% { transform: scale(1.3) rotate(5deg); opacity: 1; }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

// ── Story Card Component ────────────────────────────────────────────────────
function StoryCard({
  story,
  isPlaying,
  isPaused,
  isSol,
  onPlay,
  onDelete,
  onToggleFavorite,
  index,
  onDeleteConfirm,
}: {
  story: Story;
  isPlaying: boolean;
  isPaused: boolean;
  isSol: boolean;
  onPlay: (story: Story) => void;
  onDelete: (id: string) => Promise<void> | void;
  onToggleFavorite: (id: string) => void;
  index: number;
  onDeleteConfirm?: (storyId: string, storyTitle: string) => void;
}) {
  return (
    <div
      onClick={() => onPlay(story)}
      style={{
        background: isPlaying
          ? 'linear-gradient(135deg, rgba(30,37,69,0.95), rgba(20,26,55,0.95))'
          : 'rgba(14,16,32,0.7)',
        border: `1px solid ${isPlaying ? 'rgba(201,169,110,0.4)' : 'rgba(155,143,192,0.15)'}`,
        borderRadius: 14, padding: '18px 20px', cursor: 'pointer',
        transition: 'all 0.3s', backdropFilter: 'blur(8px)',
        animation: `fade-in 0.5s ${index * 0.07}s ease both`,
        boxShadow: isPlaying ? '0 4px 30px rgba(201,169,110,0.1)' : 'none',
        display: 'flex', alignItems: 'center', gap: 14,
      }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onPlay(story);
        }
      }}
      aria-label={`${story.title}, ${story.duration ? formatDuration(story.duration) : 'duración desconocida'}`}
    >
      <div style={{
        width: 44, height: 44, borderRadius: '50%',
        background: isPlaying
          ? 'linear-gradient(135deg, rgba(201,169,110,0.4), rgba(155,143,192,0.3))'
          : 'rgba(30,37,69,0.8)',
        border: `1px solid ${isPlaying ? 'rgba(201,169,110,0.5)' : 'rgba(155,143,192,0.2)'}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 16, flexShrink: 0, transition: 'all 0.2s',
      }}>
        {isPlaying && !isPaused ? '⏸' : '▶'}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{
          fontFamily: "'Playfair Display', serif", fontSize: 17,
          color: isPlaying ? 'var(--gold)' : 'var(--moon-white)',
          marginBottom: 3, whiteSpace: 'nowrap', overflow: 'hidden',
          textOverflow: 'ellipsis', transition: 'color 0.2s',
        }}>{story.title}</p>
        <p style={{ color: 'var(--lavender-dim)', fontSize: 13 }}>
          {story.duration ? formatDuration(story.duration) : '—'} · {formatDate(story.uploadedAt)}
        </p>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggleFavorite(story.id);
        }}
        style={{
          background: 'none', border: 'none',
          color: story.isFavorite ? 'rgba(201,169,110,0.8)' : 'rgba(155,143,192,0.3)',
          cursor: 'pointer', fontSize: 18, padding: 4, flexShrink: 0, transition: 'all 0.2s',
        }}
        aria-label={story.isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
      >
        ♥
      </button>
      {isSol && (
        <button
          onClick={(e: any) => {
            e.stopPropagation();
            if (onDeleteConfirm) {
              onDeleteConfirm(story.id, story.title);
            } else {
              onDelete(story.id);
            }
          }}
          style={{
            background: 'none', border: 'none', color: 'rgba(155,143,192,0.4)',
            cursor: 'pointer', fontSize: 18, padding: 4, flexShrink: 0, transition: 'color 0.2s',
          }}
          onMouseEnter={(e: any) => (e.currentTarget.style.color = 'rgba(255,100,100,0.7)')}
          onMouseLeave={(e: any) => (e.currentTarget.style.color = 'rgba(155,143,192,0.4)')}
          aria-label="Eliminar cuento"
        >
          ×
        </button>
      )}
    </div>
  );
}

// ── Main App ───────────────────────────────────────────────────────────────
export default function Home() {
  const [role, setRole] = useState<UserRole>(null);
  const [showRoleSelector, setShowRoleSelector] = useState(false);
  const [stories, setStories] = useState<Story[]>([]);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [playing, setPlaying] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStep, setUploadStep] = useState('');
  const [showUpload, setShowUpload] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [volume, setVolume] = useState(0.8);
  const [timer, setTimer] = useState<number | null>(null);
  const [timerLeft, setTimerLeft] = useState<number | null>(null);
  const [showWelcome, setShowWelcome] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [deleteConfirm, setDeleteConfirm] = useState<DeleteConfirmation | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordingChunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Load initial data
  useEffect(() => {
    loadStoriesFromCloud().then(data => {
      setStories(data);
      setLoading(false);
    });
    const seen = localStorage.getItem('welcome_seen');
    if (!seen) {
      setShowWelcome(true);
      localStorage.setItem('welcome_seen', '1');
    }
    const savedRole = localStorage.getItem('user_role') as UserRole;
    if (savedRole) setRole(savedRole);

    const savedFavorites = localStorage.getItem('favorites');
    if (savedFavorites) {
      setFavorites(new Set(JSON.parse(savedFavorites)));
    }
  }, []);

  // Save favorites to localStorage
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(Array.from(favorites)));
  }, [favorites]);

  const addToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Math.random().toString();
    setToasts(prev => [...prev, { id, message, type }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const handleRoleSelect = (r: UserRole) => {
    setRole(r);
    if (r) localStorage.setItem('user_role', r);
    setShowRoleSelector(false);
  };

  const handleWelcomeEnter = () => {
    setShowWelcome(false);
    setShowRoleSelector(true);
  };

  // Sleep timer
  useEffect(() => {
    if (timerLeft === null) return;
    if (timerLeft <= 0) {
      audioRef.current?.pause();
      setPlaying(null);
      setIsPaused(false);
      setTimerLeft(null);
      setTimer(null);
      addToast('¡Descansa bien! 🌙', 'success');
      return;
    }
    timerRef.current = setTimeout(() => setTimerLeft(t => (t ?? 0) - 1), 1000);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [timerLeft, addToast]);

  const playStory = (story: Story) => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
    }
    const audio = new Audio(story.url);
    audio.volume = volume;
    audioRef.current = audio;
    audio.play().catch(() => addToast('Error al reproducir audio', 'error'));
    setPlaying(story.id);
    setIsPaused(false);
    setCurrentTime(0);
    audio.addEventListener('timeupdate', () => setCurrentTime(audio.currentTime));
    audio.addEventListener('loadedmetadata', () => setDuration(audio.duration));
    audio.addEventListener('ended', () => {
      setPlaying(null);
      setIsPaused(false);
      setCurrentTime(0);
    });
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (audioRef.current.paused) {
      audioRef.current.play();
      setIsPaused(false);
    } else {
      audioRef.current.pause();
      setIsPaused(true);
    }
  };

  const seek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (audioRef.current) audioRef.current.currentTime = val;
    setCurrentTime(val);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value);
    setVolume(v);
    if (audioRef.current) audioRef.current.volume = v;
  };

  const startSleepTimer = (minutes: number) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setTimer(minutes);
    setTimerLeft(minutes * 60);
    addToast(`Dormiré en ${minutes} minutos 😴`, 'info');
  };

  const cancelTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setTimerLeft(null);
    setTimer(null);
    addToast('Timer cancelado', 'info');
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 100 * 1024 * 1024) {
      addToast('Archivo muy grande (máximo 100MB)', 'error');
      return;
    }
    setSelectedFile(file);
    setNewTitle(file.name.replace(/\.(mp3|m4a|wav|ogg|aac)$/i, '').replace(/[-_]/g, ' '));
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setUploading(true);
    setUploadProgress(0);
    try {
      setUploadStep('Subiendo audio...');
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('upload_preset', UPLOAD_PRESET);
      formData.append('resource_type', 'video');
      formData.append('folder', 'cuentos/audios');

      const xhr = new XMLHttpRequest();
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) setUploadProgress(Math.round((e.loaded / e.total) * 80));
      });

      const result = await new Promise<any>((resolve, reject) => {
        xhr.onload = () => (xhr.status === 200 ? resolve(JSON.parse(xhr.responseText)) : reject());
        xhr.onerror = reject;
        xhr.open('POST', `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/video/upload`);
        xhr.send(formData);
      });

      const audio = new Audio(result.secure_url);
      const dur = await new Promise<number>((resolve) => {
        audio.addEventListener('loadedmetadata', () => resolve(audio.duration));
        audio.addEventListener('error', () => resolve(0));
        setTimeout(() => resolve(result.duration || 0), 5000);
      });

      setUploadStep('Guardando en la nube...');
      setUploadProgress(90);

      const newStory: Story = {
        id: result.public_id,
        title: newTitle || selectedFile.name,
        duration: dur || result.duration,
        uploadedAt: new Date().toISOString(),
        url: result.secure_url,
        publicId: result.public_id,
        isFavorite: false,
      };

      const updated = [newStory, ...stories];
      await saveStoriesToCloud(updated);
      setStories(updated);
      setUploadProgress(100);
      setUploadStep('¡Listo!');
      addToast(`"${newTitle}" subido exitosamente! 🎉`, 'success');

      setTimeout(() => {
        setUploading(false);
        setShowUpload(false);
        setSelectedFile(null);
        setNewTitle('');
        setUploadProgress(0);
        setUploadStep('');
        if (fileInputRef.current) fileInputRef.current.value = '';
      }, 800);
    } catch {
      setUploading(false);
      addToast('Error al subir. Intenta de nuevo.', 'error');
    }
  };

  const deleteStory = async (id: string) => {
    if (playing === id) {
      audioRef.current?.pause();
      setPlaying(null);
    }
    const updated = stories.filter(s => s.id !== id);
    setStories(updated);
    await saveStoriesToCloud(updated);
    setFavorites(prev => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    setDeleteConfirm(null);
    addToast('Cuento eliminado', 'info');
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      recordingChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        recordingChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(recordingChunksRef.current, { type: 'audio/webm' });
        const audioFile = new File([audioBlob], `grabación-${Date.now()}.webm`, { type: 'audio/webm' });
        setSelectedFile(audioFile);
        setNewTitle(`Grabación ${new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}`);
        addToast('Grabación completada ✓', 'success');
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      addToast('Grabando... 🎤', 'info');

      recordingTimerRef.current = setInterval(() => {
        setRecordingTime((t: number) => t + 1);
      }, 1000);
    } catch {
      addToast('Error: No se puede acceder al micrófono', 'error');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    }
  };

  const toggleFavorite = (id: string) => {
    setFavorites(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
    setStories(prev =>
      prev.map(s =>
        s.id === id ? { ...s, isFavorite: !s.isFavorite } : s
      )
    );
  };

  // Filter and sort stories
  const filteredStories = useMemo(() => {
    let filtered = stories.map(s => ({ ...s, isFavorite: favorites.has(s.id) }));

    if (searchQuery.trim()) {
      filtered = filtered.filter(s =>
        s.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered.sort((a, b) => {
      if (a.isFavorite !== b.isFavorite) return b.isFavorite ? 1 : -1;
      return new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime();
    });
  }, [stories, searchQuery, favorites]);

  const currentStory = stories.find(s => s.id === playing);
  const isSol = role === 'sol';

  return (
    <div style={{ minHeight: '100vh', background: 'var(--midnight)', position: 'relative', overflowX: 'hidden' }}>

      {/* Stars */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        {STARS.map(star => (
          <div key={star.id} style={{
            position: 'absolute', left: `${star.x}%`, top: `${star.y}%`,
            width: star.size, height: star.size, borderRadius: '50%', background: 'white',
            animation: `twinkle ${star.duration}s ${star.delay}s ease-in-out infinite`,
          }} />
        ))}
        <div style={{
          position: 'absolute', top: '6%', right: '8%', width: 80, height: 80, borderRadius: '50%',
          background: 'radial-gradient(circle at 35% 35%, #f0e8c8, #c8b87a)',
          boxShadow: '0 0 40px rgba(200,184,122,0.4), 0 0 80px rgba(200,184,122,0.15)',
          animation: 'float 6s ease-in-out infinite',
        }} />
        <div style={{
          position: 'absolute', bottom: '-10%', left: '-10%', width: '60%', height: '60%',
          borderRadius: '50%', background: 'radial-gradient(circle, rgba(30,37,69,0.6) 0%, transparent 70%)',
        }} />
      </div>

      {/* Welcome modal */}
      {showWelcome && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 200,
          background: 'rgba(5,6,15,0.85)', backdropFilter: 'blur(12px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
        }}>
          <div style={{
            background: 'linear-gradient(145deg, rgba(14,16,40,0.98), rgba(20,24,55,0.98))',
            border: '1px solid rgba(201,169,110,0.3)', borderRadius: 24,
            padding: '40px 32px', maxWidth: 400, textAlign: 'center',
            boxShadow: '0 24px 80px rgba(0,0,0,0.6), 0 0 60px rgba(201,169,110,0.08)',
            animation: 'slide-up 0.6s cubic-bezier(0.16,1,0.3,1) forwards',
          }}>
            <div style={{ fontSize: 52, marginBottom: 16, animation: 'float 4s ease-in-out infinite' }}>🌙</div>
            <h2 style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 26, fontWeight: 400, color: 'var(--gold)', marginBottom: 16, lineHeight: 1.3,
            }}>Bienvenida, mi amor</h2>
            <p style={{
              color: 'var(--star-blue)', fontSize: 16, lineHeight: 1.7,
              fontStyle: 'italic', marginBottom: 12, fontWeight: 300,
            }}>
              Aquí encontrarás mi voz cada noche, lista para acompañarte mientras cierras los ojos.
            </p>
            <p style={{ color: 'var(--lavender)', fontSize: 14, lineHeight: 1.6, marginBottom: 28, opacity: 0.8 }}>
              Escoge un cuento, ponte cómoda y deja que te lleve lejos... ✨
            </p>
            <button onClick={handleWelcomeEnter} style={{
              background: 'linear-gradient(135deg, rgba(201,169,110,0.25), rgba(155,143,192,0.2))',
              border: '1px solid rgba(201,169,110,0.5)', color: 'var(--gold)',
              padding: '13px 36px', borderRadius: 50, cursor: 'pointer',
              fontFamily: "'Playfair Display', serif", fontSize: 16,
              letterSpacing: '0.05em', transition: 'all 0.2s',
            }}>
              Entrar 🌙
            </button>
          </div>
        </div>
      )}

      {/* Role selector */}
      {showRoleSelector && <RoleSelector onSelect={handleRoleSelect} />}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 400,
          background: 'rgba(5,6,15,0.85)', backdropFilter: 'blur(12px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
        }}>
          <div style={{
            background: 'linear-gradient(145deg, rgba(14,16,40,0.98), rgba(20,24,55,0.98))',
            border: '1px solid rgba(244,67,54,0.3)', borderRadius: 24,
            padding: '40px 32px', maxWidth: 400, textAlign: 'center',
            boxShadow: '0 24px 80px rgba(0,0,0,0.6), 0 0 60px rgba(244,67,54,0.08)',
            animation: 'slide-up 0.3s ease forwards',
          }}>
            <div style={{ fontSize: 44, marginBottom: 20 }}>⚠️</div>
            <h3 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 22, fontWeight: 400, color: 'var(--moon-white)', marginBottom: 12,
            }}>¿Eliminar cuento?</h3>
            <p style={{
              color: 'var(--lavender)', fontSize: 15, marginBottom: 28, lineHeight: 1.6,
            }}>
              Se eliminará permanentemente:<br/>
              <strong style={{ color: 'var(--gold)' }}>"{deleteConfirm.storyTitle}"</strong>
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button onClick={() => setDeleteConfirm(null)} style={{
                flex: 1, background: 'rgba(155,143,192,0.15)', border: '1px solid rgba(155,143,192,0.3)',
                color: 'var(--lavender)', padding: '12px', borderRadius: 10, cursor: 'pointer',
                fontSize: 15, transition: 'all 0.2s',
              }}>
                Cancelar
              </button>
              <button onClick={() => deleteStory(deleteConfirm.storyId)} style={{
                flex: 1, background: 'rgba(244,67,54,0.2)', border: '1px solid rgba(244,67,54,0.5)',
                color: 'rgba(255,100,100,0.8)', padding: '12px', borderRadius: 10, cursor: 'pointer',
                fontSize: 15, fontWeight: 600, transition: 'all 0.2s',
              }}
                onMouseEnter={(e: any) => {
                  e.currentTarget.style.background = 'rgba(244,67,54,0.3)';
                }}
                onMouseLeave={(e: any) => {
                  e.currentTarget.style.background = 'rgba(244,67,54,0.2)';
                }}
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast notifications */}
      <div style={{
        position: 'fixed', top: 20, right: 20, zIndex: 1000,
        maxWidth: 400, pointerEvents: 'auto',
      }}>
        {toasts.map(toast => (
          <Toast key={toast.id} toast={toast} onRemove={() => removeToast(toast.id)} />
        ))}
      </div>

      {/* Main content */}
      <div style={{ position: 'relative', zIndex: 1, maxWidth: 680, margin: '0 auto', padding: '0 20px 160px' }}>

        <header style={{ textAlign: 'center', paddingTop: 60, paddingBottom: 40 }}>
          <div style={{ fontSize: 40, marginBottom: 12, animation: 'float 5s ease-in-out infinite' }}>
            {role === 'luna' ? '🌙' : role === 'sol' ? '☀️' : '🌙'}
          </div>
          <h1 style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: 'clamp(28px, 6vw, 42px)', fontWeight: 400,
            color: 'var(--moon-white)', letterSpacing: '0.02em', lineHeight: 1.2, marginBottom: 10,
          }}>Cuentos de Medianoche</h1>
          <p style={{ color: 'var(--lavender)', fontSize: 16, fontStyle: 'italic', fontWeight: 300, opacity: 0.8 }}>
            Historias para cerrar los ojos y soñar contigo
          </p>
          {/* Switch role button - Always visible */}
          <button onClick={() => {
            localStorage.removeItem('welcome_seen');
            localStorage.removeItem('user_role');
            setRole(null);
            setShowWelcome(true);
          }} style={{
            marginTop: 16, background: 'rgba(155,143,192,0.15)',
            border: '1px solid rgba(155,143,192,0.4)',
            color: 'var(--lavender)', fontSize: 'clamp(12px, 3vw, 14px)',
            cursor: 'pointer',
            letterSpacing: '0.1em', textTransform: 'uppercase',
            padding: '8px 16px', borderRadius: 8, transition: 'all 0.2s',
            visibility: role ? 'visible' : 'hidden',
            opacity: role ? 1 : 0,
          }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(155,143,192,0.25)';
              e.currentTarget.style.borderColor = 'rgba(155,143,192,0.6)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(155,143,192,0.15)';
              e.currentTarget.style.borderColor = 'rgba(155,143,192,0.4)';
            }}
            aria-label="Cambiar rol"
          >
            {role === 'luna' ? '🌙 Cambiar a El Sol' : '☀️ Cambiar a La Luna'}
          </button>
        </header>

        {/* Sleep timer bar */}
        {timerLeft !== null && (
          <div style={{
            background: 'rgba(30,37,69,0.8)', border: '1px solid rgba(155,143,192,0.3)',
            borderRadius: 12, padding: '12px 20px', marginBottom: 20,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            animation: 'fade-in 0.4s ease forwards',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 18 }}>😴</span>
              <span style={{ color: 'var(--lavender)', fontSize: 14 }}>
                Apagando en <strong style={{ color: 'var(--moon-white)' }}>{formatDuration(timerLeft)}</strong>
              </span>
            </div>
            <button onClick={cancelTimer} style={{
              background: 'none', color: 'var(--gold)', cursor: 'pointer', fontSize: 13,
              padding: '4px 10px', borderRadius: 6, border: '1px solid rgba(201,169,110,0.3)',
              transition: 'all 0.2s',
            }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(201,169,110,0.2)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'none')}
              aria-label="Cancelar temporizador"
            >
              Cancelar
            </button>
          </div>
        )}

        {/* Upload button — solo para El Sol */}
        {isSol && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 24 }}>
            <button onClick={() => setShowUpload(!showUpload)} style={{
              background: showUpload ? 'rgba(201,169,110,0.2)' : 'rgba(201,169,110,0.1)',
              border: '1px solid rgba(201,169,110,0.4)', color: 'var(--gold)',
              padding: '10px 20px', borderRadius: 10, cursor: 'pointer',
              fontFamily: "'Crimson Pro', Georgia, serif", fontSize: 15,
              display: 'flex', alignItems: 'center', gap: 8, transition: 'all 0.2s',
            }}>
              <span>{showUpload ? '✕' : '+'}</span>
              {showUpload ? 'Cerrar' : 'Agregar cuento'}
            </button>
          </div>
        )}

        {/* Upload panel */}
        {isSol && showUpload && (
          <div style={{
            background: 'rgba(14,16,32,0.9)', border: '1px solid rgba(155,143,192,0.25)',
            borderRadius: 16, padding: 28, marginBottom: 28,
            animation: 'slide-up 0.4s cubic-bezier(0.16,1,0.3,1) forwards',
            backdropFilter: 'blur(10px)',
          }}>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, marginBottom: 20, color: 'var(--moon-white)' }}>
              ✨ Nuevo cuento
            </h3>

            {/* Recording UI */}
            {!isRecording && !selectedFile && (
              <div style={{ marginBottom: 20, textAlign: 'center' }}>
                <p style={{ color: 'var(--lavender)', fontSize: 14, marginBottom: 12 }}>O graba tu voz directamente:</p>
                <button onClick={startRecording} style={{
                  background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.25), rgba(76, 175, 80, 0.15))',
                  border: '1px solid rgba(76, 175, 80, 0.5)',
                  color: 'rgba(76, 175, 80, 0.9)',
                  padding: '12px 24px', borderRadius: 10, cursor: 'pointer',
                  fontSize: 16, fontWeight: 600, transition: 'all 0.2s',
                  display: 'inline-flex', alignItems: 'center', gap: 10,
                }}>
                  🎤 Grabar
                </button>
              </div>
            )}

            {/* Recording in progress */}
            {isRecording && (
              <div style={{
                background: 'rgba(76, 175, 80, 0.1)', border: '1px solid rgba(76, 175, 80, 0.4)',
                borderRadius: 12, padding: '20px', marginBottom: 20, textAlign: 'center',
              }}>
                <div style={{ fontSize: 40, marginBottom: 12, animation: 'pulse 1.5s ease-in-out infinite' }}>🎤</div>
                <p style={{ color: 'rgba(76, 175, 80, 0.9)', fontSize: 14, marginBottom: 8, fontWeight: 600 }}>Grabando...</p>
                <p style={{ color: 'var(--lavender)', fontSize: 18, marginBottom: 12, fontFamily: 'monospace' }}>
                  {formatDuration(recordingTime)}
                </p>
                <button onClick={stopRecording} style={{
                  background: 'rgba(244, 67, 54, 0.2)', border: '1px solid rgba(244, 67, 54, 0.5)',
                  color: 'rgba(255, 100, 100, 0.8)', padding: '10px 20px', borderRadius: 8,
                  cursor: 'pointer', fontSize: 14, fontWeight: 600, transition: 'all 0.2s',
                }}>
                  ⏹ Detener
                </button>
              </div>
            )}

            {/* File selection */}
            <div onClick={() => fileInputRef.current?.click()} style={{
              border: `2px dashed ${selectedFile ? 'rgba(201,169,110,0.6)' : 'rgba(155,143,192,0.3)'}`,
              borderRadius: 12, padding: '32px 20px', textAlign: 'center', cursor: 'pointer',
              background: selectedFile ? 'rgba(201,169,110,0.05)' : 'rgba(20,24,48,0.4)',
              transition: 'all 0.3s', marginBottom: 16,
              opacity: isRecording ? 0.5 : 1,
              pointerEvents: isRecording ? 'none' : 'auto',
            }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>{selectedFile ? '🎵' : '📂'}</div>
              <p style={{ color: selectedFile ? 'var(--gold)' : 'var(--lavender)', fontSize: 15 }}>
                {selectedFile ? selectedFile.name : 'O toca para seleccionar un archivo'}
              </p>
              <p style={{ color: 'var(--lavender-dim)', fontSize: 12, marginTop: 8 }}>
                MP3, M4A, WAV, Voice Notes, o cualquier audio
              </p>
              {selectedFile && (
                <p style={{ color: 'var(--lavender-dim)', fontSize: 13, marginTop: 4 }}>
                  {(selectedFile.size / 1024 / 1024).toFixed(1)} MB
                </p>
              )}
            </div>
            <input ref={fileInputRef} type="file" accept="audio/*" style={{ display: 'none' }} onChange={handleFileSelect} />

            {selectedFile && (
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', color: 'var(--lavender)', fontSize: 13, marginBottom: 6 }}>
                  Título del cuento
                </label>
                <input value={newTitle} onChange={e => setNewTitle(e.target.value)}
                  placeholder="Dale un nombre bonito..."
                  style={{
                    width: '100%', background: 'rgba(20,24,48,0.8)',
                    border: '1px solid rgba(155,143,192,0.3)', borderRadius: 8,
                    padding: '10px 14px', color: 'var(--moon-white)',
                    fontFamily: "'Crimson Pro', serif", fontSize: 16, outline: 'none',
                  }}
                />
              </div>
            )}

            {uploading && (
              <div style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ color: 'var(--lavender)', fontSize: 13 }}>{uploadStep}</span>
                  <span style={{ color: 'var(--gold)', fontSize: 13 }}>{uploadProgress}%</span>
                </div>
                <div style={{ background: 'rgba(30,37,69,0.8)', borderRadius: 6, height: 6, overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', width: `${uploadProgress}%`,
                    background: 'linear-gradient(90deg, var(--lavender), var(--gold))',
                    borderRadius: 6, transition: 'width 0.3s',
                  }} />
                </div>
              </div>
            )}

            <button onClick={handleUpload} disabled={!selectedFile || uploading} style={{
              width: '100%',
              background: selectedFile && !uploading
                ? 'linear-gradient(135deg, rgba(201,169,110,0.25), rgba(155,143,192,0.2))'
                : 'rgba(30,37,69,0.4)',
              border: `1px solid ${selectedFile ? 'rgba(201,169,110,0.5)' : 'rgba(155,143,192,0.15)'}`,
              color: selectedFile && !uploading ? 'var(--gold)' : 'var(--lavender-dim)',
              padding: '12px', borderRadius: 10,
              cursor: selectedFile && !uploading ? 'pointer' : 'not-allowed',
              fontFamily: "'Crimson Pro', serif", fontSize: 16, transition: 'all 0.2s',
            }}>
              {uploading ? uploadStep : '☁️ Guardar en la nube'}
            </button>
          </div>
        )}

        {/* Search bar */}
        {!loading && stories.length > 3 && (
          <div style={{ marginBottom: 24 }}>
            <input
              type="text"
              placeholder="Buscar cuento..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                background: 'rgba(20,24,48,0.6)',
                border: '1px solid rgba(155,143,192,0.3)',
                borderRadius: 10,
                padding: '10px 16px',
                color: 'var(--moon-white)',
                fontFamily: "'Crimson Pro', serif",
                fontSize: 15,
                outline: 'none',
                transition: 'all 0.2s',
              }}
              onFocus={(e) => {
                e.currentTarget.style.background = 'rgba(20,24,48,0.8)';
                e.currentTarget.style.borderColor = 'rgba(155,143,192,0.5)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.background = 'rgba(20,24,48,0.6)';
                e.currentTarget.style.borderColor = 'rgba(155,143,192,0.3)';
              }}
            />
          </div>
        )}

        {/* Story list */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ fontSize: 36, marginBottom: 12, animation: 'float 2s ease-in-out infinite' }}>🌙</div>
            <p style={{ color: 'var(--lavender)', fontStyle: 'italic', fontSize: 15 }}>Cargando cuentos...</p>
          </div>
        ) : stories.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--lavender-dim)' }}>
            <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.5 }}>📖</div>
            <p style={{ fontStyle: 'italic', fontSize: 16 }}>Aún no hay cuentos...</p>
            <p style={{ fontSize: 14, marginTop: 6, opacity: 0.7 }}>Sube el primero y hazla soñar</p>
          </div>
        ) : filteredStories.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--lavender-dim)' }}>
            <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.5 }}>🔍</div>
            <p style={{ fontStyle: 'italic', fontSize: 16 }}>No se encontraron cuentos</p>
            <p style={{ fontSize: 14, marginTop: 6, opacity: 0.7 }}>Intenta con otra búsqueda</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {filteredStories.map((story, i) => (
              <StoryCard
                key={story.id}
                story={story}
                isPlaying={playing === story.id}
                isPaused={isPaused}
                isSol={isSol}
                onPlay={playStory}
                onDelete={deleteStory}
                onToggleFavorite={toggleFavorite}
                index={i}
                onDeleteConfirm={(id, title) => setDeleteConfirm({ storyId: id, storyTitle: title })}
              />
            ))}
          </div>
        )}
      </div>

      {/* Player bar */}
      {playing && currentStory && (
        <div style={{
          position: 'fixed', bottom: 0, left: 0, right: 0,
          background: 'linear-gradient(180deg, rgba(10,11,20,0) 0%, rgba(10,11,20,0.98) 20%)',
          backdropFilter: 'blur(20px)', borderTop: '1px solid rgba(155,143,192,0.15)',
          padding: '16px 20px 28px', zIndex: 100,
          animation: 'slide-up 0.4s cubic-bezier(0.16,1,0.3,1) forwards',
        }}>
          <div style={{ maxWidth: 680, margin: '0 auto' }}>
            <p style={{
              fontFamily: "'Playfair Display', serif", fontSize: 15,
              color: 'var(--gold)', marginBottom: 10, textAlign: 'center', fontStyle: 'italic',
            }}>🌙 {currentStory.title}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <span style={{ color: 'var(--lavender-dim)', fontSize: 12, width: 34, textAlign: 'right' }}>
                {formatDuration(currentTime)}
              </span>
              <input type="range" min={0} max={duration || 100} value={currentTime} onChange={seek}
                style={{
                  flex: 1, WebkitAppearance: 'none', height: 4, borderRadius: 2,
                  background: `linear-gradient(90deg, var(--gold) ${(currentTime / (duration || 1)) * 100}%, rgba(155,143,192,0.25) ${(currentTime / (duration || 1)) * 100}%)`,
                  outline: 'none', cursor: 'pointer',
                }}
                aria-label="Barra de progreso"
              />
              <span style={{ color: 'var(--lavender-dim)', fontSize: 12, width: 34 }}>
                {duration ? formatDuration(duration) : '--:--'}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
              <div className="volume-desktop" style={{ display: 'flex', alignItems: 'center', gap: 6, flex: 1 }}>
                <span style={{ fontSize: 14 }}>🔊</span>
                <input type="range" min={0} max={1} step={0.05} value={volume} onChange={handleVolumeChange}
                  style={{
                    width: 70, WebkitAppearance: 'none', height: 3, borderRadius: 2,
                    background: `linear-gradient(90deg, var(--lavender) ${volume * 100}%, rgba(155,143,192,0.25) ${volume * 100}%)`,
                    outline: 'none', cursor: 'pointer',
                  }}
                  aria-label="Control de volumen"
                />
              </div>
              <button onClick={togglePlay} style={{
                width: 52, height: 52, borderRadius: '50%',
                background: 'linear-gradient(135deg, rgba(201,169,110,0.3), rgba(155,143,192,0.25))',
                border: '1px solid rgba(201,169,110,0.5)',
                color: 'var(--moon-white)', fontSize: 20, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s',
              }}
                onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.1)')}
                onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                aria-label={isPaused ? 'Reproducir' : 'Pausar'}
              >{isPaused ? '▶' : '⏸'}</button>
              <div style={{ display: 'flex', gap: 6, flex: 1, justifyContent: 'flex-end' }}>
                {[15, 30, 60].map(min => (
                  <button key={min}
                    onClick={() => (timer === min && timerLeft ? cancelTimer() : startSleepTimer(min))}
                    style={{
                      background: timer === min && timerLeft ? 'rgba(155,143,192,0.3)' : 'rgba(30,37,69,0.6)',
                      border: `1px solid ${timer === min && timerLeft ? 'rgba(155,143,192,0.5)' : 'rgba(155,143,192,0.2)'}`,
                      color: timer === min && timerLeft ? 'var(--lavender)' : 'var(--lavender-dim)',
                      padding: '4px 8px', borderRadius: 6, cursor: 'pointer',
                      fontSize: 11, fontFamily: "'Crimson Pro', serif", transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = 'rgba(155,143,192,0.4)';
                      e.currentTarget.style.transform = 'scale(1.05)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = timer === min && timerLeft ? 'rgba(155,143,192,0.5)' : 'rgba(155,143,192,0.2)';
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                    aria-label={`Temporizador de ${min} minutos`}
                  >{min}m</button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
