'use client';

import { useState, useRef, useEffect } from 'react';

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

            <div style={{ display: 'flex', gap: 24, justifyContent: 'center' }}>
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
                  <p style={{ color: 'var(--lavender)', fontSize: 13, fontStyle: 'italic', opacity: 0.8 }}>Ella</p>
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
                  <p style={{ color: 'var(--gold)', fontSize: 13, fontStyle: 'italic', opacity: 0.8 }}>Él</p>
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

// ── Main App ───────────────────────────────────────────────────────────────
export default function Home() {
  const [role, setRole] = useState<UserRole>(null);
  const [showRoleSelector, setShowRoleSelector] = useState(false);
  const [stories, setStories] = useState<Story[]>([]);
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

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    loadStoriesFromCloud().then(data => { setStories(data); setLoading(false); });
    const seen = localStorage.getItem('welcome_seen');
    if (!seen) { setShowWelcome(true); localStorage.setItem('welcome_seen', '1'); }
    const savedRole = localStorage.getItem('user_role') as UserRole;
    if (savedRole) setRole(savedRole);
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
      setPlaying(null); setIsPaused(false);
      setTimerLeft(null); setTimer(null);
      return;
    }
    timerRef.current = setTimeout(() => setTimerLeft(t => (t ?? 0) - 1), 1000);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [timerLeft]);

  const playStory = (story: Story) => {
    if (audioRef.current) { audioRef.current.pause(); audioRef.current.src = ''; }
    const audio = new Audio(story.url);
    audio.volume = volume;
    audioRef.current = audio;
    audio.play();
    setPlaying(story.id); setIsPaused(false); setCurrentTime(0);
    audio.addEventListener('timeupdate', () => setCurrentTime(audio.currentTime));
    audio.addEventListener('loadedmetadata', () => setDuration(audio.duration));
    audio.addEventListener('ended', () => { setPlaying(null); setIsPaused(false); setCurrentTime(0); });
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (audioRef.current.paused) { audioRef.current.play(); setIsPaused(false); }
    else { audioRef.current.pause(); setIsPaused(true); }
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
    setTimer(minutes); setTimerLeft(minutes * 60);
  };

  const cancelTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setTimerLeft(null); setTimer(null);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    setNewTitle(file.name.replace(/\.(mp3|m4a|wav|ogg|aac)$/i, '').replace(/[-_]/g, ' '));
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setUploading(true); setUploadProgress(0);
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
        xhr.onload = () => xhr.status === 200 ? resolve(JSON.parse(xhr.responseText)) : reject();
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

      setUploadStep('Guardando en la nube...'); setUploadProgress(90);

      const newStory: Story = {
        id: result.public_id,
        title: newTitle || selectedFile.name,
        duration: dur || result.duration,
        uploadedAt: new Date().toISOString(),
        url: result.secure_url,
        publicId: result.public_id,
      };

      const updated = [newStory, ...stories];
      await saveStoriesToCloud(updated);
      setStories(updated);
      setUploadProgress(100); setUploadStep('¡Listo!');

      setTimeout(() => {
        setUploading(false); setShowUpload(false);
        setSelectedFile(null); setNewTitle('');
        setUploadProgress(0); setUploadStep('');
        if (fileInputRef.current) fileInputRef.current.value = '';
      }, 800);
    } catch {
      setUploading(false);
      alert('Hubo un error. Intenta de nuevo.');
    }
  };

  const deleteStory = async (id: string) => {
    if (playing === id) { audioRef.current?.pause(); setPlaying(null); }
    const updated = stories.filter(s => s.id !== id);
    setStories(updated);
    await saveStoriesToCloud(updated);
  };

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
          {/* Switch role button */}
          {role && (
            <button onClick={() => {
              localStorage.removeItem('welcome_seen');
              localStorage.removeItem('user_role');
              setRole(null);
              setShowWelcome(true);
            }} style={{
              marginTop: 12, background: 'none', border: 'none',
              color: 'var(--lavender-dim)', fontSize: 12, cursor: 'pointer',
              opacity: 0.5, letterSpacing: '0.1em', textTransform: 'uppercase',
            }}>
              cambiar ✦
            </button>
          )}
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
            }}>Cancelar</button>
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
            <div onClick={() => fileInputRef.current?.click()} style={{
              border: `2px dashed ${selectedFile ? 'rgba(201,169,110,0.6)' : 'rgba(155,143,192,0.3)'}`,
              borderRadius: 12, padding: '32px 20px', textAlign: 'center', cursor: 'pointer',
              background: selectedFile ? 'rgba(201,169,110,0.05)' : 'rgba(20,24,48,0.4)',
              transition: 'all 0.3s', marginBottom: 16,
            }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>{selectedFile ? '🎵' : '📂'}</div>
              <p style={{ color: selectedFile ? 'var(--gold)' : 'var(--lavender)', fontSize: 15 }}>
                {selectedFile ? selectedFile.name : 'Toca para seleccionar un archivo'}
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
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {stories.map((story, i) => (
              <div key={story.id} style={{
                background: playing === story.id
                  ? 'linear-gradient(135deg, rgba(30,37,69,0.95), rgba(20,26,55,0.95))'
                  : 'rgba(14,16,32,0.7)',
                border: `1px solid ${playing === story.id ? 'rgba(201,169,110,0.4)' : 'rgba(155,143,192,0.15)'}`,
                borderRadius: 14, padding: '18px 20px', cursor: 'pointer',
                transition: 'all 0.3s', backdropFilter: 'blur(8px)',
                animation: `fade-in 0.5s ${i * 0.07}s ease both`,
                boxShadow: playing === story.id ? '0 4px 30px rgba(201,169,110,0.1)' : 'none',
              }}
                onClick={() => playing === story.id ? togglePlay() : playStory(story)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: '50%',
                    background: playing === story.id
                      ? 'linear-gradient(135deg, rgba(201,169,110,0.4), rgba(155,143,192,0.3))'
                      : 'rgba(30,37,69,0.8)',
                    border: `1px solid ${playing === story.id ? 'rgba(201,169,110,0.5)' : 'rgba(155,143,192,0.2)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 16, flexShrink: 0, transition: 'all 0.2s',
                  }}>
                    {playing === story.id && !isPaused ? '⏸' : '▶'}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{
                      fontFamily: "'Playfair Display', serif", fontSize: 17,
                      color: playing === story.id ? 'var(--gold)' : 'var(--moon-white)',
                      marginBottom: 3, whiteSpace: 'nowrap', overflow: 'hidden',
                      textOverflow: 'ellipsis', transition: 'color 0.2s',
                    }}>{story.title}</p>
                    <p style={{ color: 'var(--lavender-dim)', fontSize: 13 }}>
                      {story.duration ? formatDuration(story.duration) : '—'} · {formatDate(story.uploadedAt)}
                    </p>
                  </div>
                  {/* Delete — solo para El Sol */}
                  {isSol && (
                    <button onClick={e => { e.stopPropagation(); deleteStory(story.id); }} style={{
                      background: 'none', border: 'none', color: 'rgba(155,143,192,0.4)',
                      cursor: 'pointer', fontSize: 18, padding: 4, flexShrink: 0, transition: 'color 0.2s',
                    }}
                      onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,100,100,0.7)')}
                      onMouseLeave={e => (e.currentTarget.style.color = 'rgba(155,143,192,0.4)')}
                    >×</button>
                  )}
                </div>
              </div>
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
                  background: `linear-gradient(90deg, var(--gold) ${(currentTime/(duration||1))*100}%, rgba(155,143,192,0.25) ${(currentTime/(duration||1))*100}%)`,
                  outline: 'none', cursor: 'pointer',
                }}
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
                    background: `linear-gradient(90deg, var(--lavender) ${volume*100}%, rgba(155,143,192,0.25) ${volume*100}%)`,
                    outline: 'none', cursor: 'pointer',
                  }}
                />
              </div>
              <button onClick={togglePlay} style={{
                width: 52, height: 52, borderRadius: '50%',
                background: 'linear-gradient(135deg, rgba(201,169,110,0.3), rgba(155,143,192,0.25))',
                border: '1px solid rgba(201,169,110,0.5)',
                color: 'var(--moon-white)', fontSize: 20, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s',
              }}>{isPaused ? '▶' : '⏸'}</button>
              <div style={{ display: 'flex', gap: 6, flex: 1, justifyContent: 'flex-end' }}>
                {[15, 30, 60].map(min => (
                  <button key={min}
                    onClick={() => timer === min && timerLeft ? cancelTimer() : startSleepTimer(min)}
                    style={{
                      background: timer === min && timerLeft ? 'rgba(155,143,192,0.3)' : 'rgba(30,37,69,0.6)',
                      border: `1px solid ${timer === min && timerLeft ? 'rgba(155,143,192,0.5)' : 'rgba(155,143,192,0.2)'}`,
                      color: timer === min && timerLeft ? 'var(--lavender)' : 'var(--lavender-dim)',
                      padding: '4px 8px', borderRadius: 6, cursor: 'pointer',
                      fontSize: 11, fontFamily: "'Crimson Pro', serif", transition: 'all 0.2s',
                    }}
                  >{min}min</button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
