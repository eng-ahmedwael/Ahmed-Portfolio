import { useState, useEffect, useRef, type ReactNode, type ReactElement } from "react";
import type * as React from "react";
import { Link } from "wouter";
import {
  LayoutDashboard, User, GraduationCap, Zap, Briefcase, FolderOpen,
  BookOpen, Heart, Mail, Settings, LogOut, Plus, Trash2, Save,
  ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Eye, ExternalLink, RefreshCw, Lock,
  MessageSquare, Inbox, CheckCheck, Upload, X as XIcon, ImageIcon, Play,
} from "lucide-react";
import {
  usePortfolio, getAdminPassword, setAdminPassword,
  loadMessages, deleteMessage, markMessageRead,
  type ContactMessage,
} from "@/context/PortfolioContext";
import {
  defaultPortfolioData,
  type HeroData, type AboutData, type EducationEntry,
  type SkillsData, type SkillItem, type ExperienceEntry,
  type ProjectEntry, type CourseEntry, type VolunteerEntry,
  type ContactData, type MediaItem,
} from "@/data/portfolioDefaults";
import { storeVideo, removeVideo } from "@/utils/videoStore";

const sidebarSections = [
  { id: "hero", label: "Hero", icon: LayoutDashboard },
  { id: "about", label: "About", icon: User },
  { id: "education", label: "Education", icon: GraduationCap },
  { id: "skills", label: "Skills", icon: Zap },
  { id: "experience", label: "Experience", icon: Briefcase },
  { id: "projects", label: "Projects", icon: FolderOpen },
  { id: "courses", label: "Courses", icon: BookOpen },
  { id: "volunteer", label: "Volunteer", icon: Heart },
  { id: "contact", label: "Contact", icon: Mail },
  { id: "messages", label: "Messages", icon: MessageSquare },
  { id: "settings", label: "Settings", icon: Settings },
];

function uid() {
  return `id-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold uppercase tracking-widest text-blue-300/70">{label}</label>
      {children}
    </div>
  );
}

const inputCls =
  "w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-blue-400/60 transition";
const btnCls =
  "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition";

function SaveBar({ onSave, onReset, saved, error }: { onSave: () => void; onReset: () => void; saved: boolean; error?: string }) {
  return (
    <div className="flex flex-wrap items-center gap-3 pt-6 border-t border-white/10">
      <button onClick={onSave} className={`${btnCls} bg-blue-500 hover:bg-blue-400 text-white`}>
        <Save size={15} /> Save Section
      </button>
      <button onClick={onReset} className={`${btnCls} bg-white/5 hover:bg-white/10 text-white/60`}>
        <RefreshCw size={15} /> Reset to Default
      </button>
      {saved && <span className="text-green-400 text-sm">✓ Saved!</span>}
      {error && <span className="text-red-400 text-sm">✗ {error}</span>}
    </div>
  );
}

function ListStringEditor({ label, items, onChange }: { label: string; items: string[]; onChange: (v: string[]) => void }) {
  return (
    <Field label={label}>
      <div className="flex flex-col gap-2">
        {items.map((item, i) => (
          <div key={i} className="flex gap-2">
            <input className={inputCls} value={item} onChange={e => {
              const next = [...items]; next[i] = e.target.value; onChange(next);
            }} />
            <button onClick={() => onChange(items.filter((_, j) => j !== i))}
              className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400">
              <Trash2 size={14} />
            </button>
          </div>
        ))}
        <button onClick={() => onChange([...items, ""])}
          className={`${btnCls} bg-white/5 hover:bg-white/10 text-blue-300 w-fit`}>
          <Plus size={14} /> Add
        </button>
      </div>
    </Field>
  );
}

function TagEditor({ label, tags, onChange }: { label: string; tags: string[]; onChange: (v: string[]) => void }) {
  const [input, setInput] = useState("");
  return (
    <Field label={label}>
      <div className="flex flex-wrap gap-2 mb-2">
        {tags.map((t, i) => (
          <span key={i} className="flex items-center gap-1 px-2 py-1 rounded-full bg-blue-500/15 text-blue-300 text-xs">
            {t}
            <button onClick={() => onChange(tags.filter((_, j) => j !== i))} className="hover:text-red-400">×</button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input className={inputCls} value={input} placeholder="Add tag, press Enter"
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter" && input.trim()) { onChange([...tags, input.trim()]); setInput(""); } }} />
        <button onClick={() => { if (input.trim()) { onChange([...tags, input.trim()]); setInput(""); } }}
          className={`${btnCls} bg-blue-500/20 hover:bg-blue-500/30 text-blue-300`}>
          <Plus size={14} />
        </button>
      </div>
    </Field>
  );
}

function compressImage(file: File, maxDim = 1200, quality = 0.75): Promise<string> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      let { width, height } = img;
      if (width > maxDim || height > maxDim) {
        if (width >= height) { height = Math.round((height * maxDim) / width); width = maxDim; }
        else { width = Math.round((width * maxDim) / height); height = maxDim; }
      }
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) { reject(new Error("Canvas not supported")); return; }
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL("image/jpeg", quality));
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("Failed to load image")); };
    img.src = url;
  });
}

function SingleImageUploader({
  label,
  value,
  onChange,
}: {
  label: string;
  value?: string;
  onChange: (v: string | undefined) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadErr, setUploadErr] = useState("");
  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true); setUploadErr("");
    try {
      const compressed = await compressImage(file);
      onChange(compressed);
    } catch {
      setUploadErr("Failed to process image. Try a smaller file.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };
  return (
    <Field label={label}>
      <div className="flex items-center gap-3 flex-wrap">
        {value ? (
          <div className="relative">
            <img src={value} alt="Preview" className="w-16 h-16 rounded-lg object-cover border border-white/10" />
            <button
              type="button"
              onClick={() => onChange(undefined)}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 flex items-center justify-center text-white hover:bg-red-600 transition"
            >
              <XIcon size={10} />
            </button>
          </div>
        ) : (
          <div
            className="w-16 h-16 rounded-lg border-2 border-dashed border-white/20 flex items-center justify-center cursor-pointer hover:border-blue-400/50 transition"
            onClick={() => inputRef.current?.click()}
          >
            <ImageIcon size={20} className="text-white/20" />
          </div>
        )}
        <button
          type="button"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
          className={`${btnCls} bg-white/5 hover:bg-white/10 text-blue-300 disabled:opacity-50`}
        >
          <Upload size={14} /> {uploading ? "Processing…" : value ? "Replace" : "Upload Image"}
        </button>
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
      </div>
      {uploadErr && <p className="text-red-400 text-xs mt-1">{uploadErr}</p>}
    </Field>
  );
}

function MultiImageUploader({
  label,
  images,
  onChange,
}: {
  label: string;
  images: string[];
  onChange: (v: string[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadErr, setUploadErr] = useState("");
  const handleFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;
    setUploading(true); setUploadErr("");
    try {
      const compressed = await Promise.all(files.map(f => compressImage(f)));
      onChange([...images, ...compressed]);
    } catch {
      setUploadErr("Failed to process one or more images. Try smaller files.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };
  return (
    <Field label={label}>
      <div className="flex flex-wrap gap-2 mb-2">
        {images.map((img, i) => (
          <div key={i} className="relative">
            <img src={img} alt={`Image ${i + 1}`} className="w-20 h-14 object-cover rounded-lg border border-white/10" />
            <button
              type="button"
              onClick={() => onChange(images.filter((_, j) => j !== i))}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 flex items-center justify-center text-white hover:bg-red-600 transition"
            >
              <XIcon size={10} />
            </button>
          </div>
        ))}
        <div
          className="w-20 h-14 rounded-lg border-2 border-dashed border-white/20 flex flex-col items-center justify-center cursor-pointer hover:border-blue-400/50 transition gap-1"
          onClick={() => !uploading && inputRef.current?.click()}
        >
          {uploading ? (
            <span className="text-white/40 text-[10px]">…</span>
          ) : (
            <>
              <Upload size={14} className="text-white/30" />
              <span className="text-white/30 text-[10px]">Add</span>
            </>
          )}
        </div>
      </div>
      <button
        type="button"
        disabled={uploading}
        onClick={() => inputRef.current?.click()}
        className={`${btnCls} bg-white/5 hover:bg-white/10 text-blue-300 w-fit disabled:opacity-50`}
      >
        <ImageIcon size={14} /> {uploading ? "Processing…" : "Upload Images"}
      </button>
      <input ref={inputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFiles} />
      {uploadErr && <p className="text-red-400 text-xs mt-1">{uploadErr}</p>}
      {images.length > 0 && !uploadErr && (
        <p className="text-xs text-white/30 mt-1">{images.length} image{images.length !== 1 ? "s" : ""} · First image shows as card cover</p>
      )}
    </Field>
  );
}

function MediaEditor({
  label,
  media,
  onChange,
}: {
  label: string;
  media: MediaItem[];
  onChange: (v: MediaItem[]) => void;
}) {
  const imgInputRef = useRef<HTMLInputElement>(null);
  const vidInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadingVid, setUploadingVid] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const [uploadErr, setUploadErr] = useState("");

  const move = (from: number, dir: -1 | 1) => {
    const to = from + dir;
    if (to < 0 || to >= media.length) return;
    const arr = [...media];
    [arr[from], arr[to]] = [arr[to], arr[from]];
    onChange(arr);
  };

  const remove = (i: number) => {
    const item = media[i];
    if (item.type === 'video' && item.src.startsWith('idb:')) {
      removeVideo(item.src.slice(4)).catch(() => {});
    }
    onChange(media.filter((_, j) => j !== i));
  };

  const handleImages = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setUploading(true); setUploadErr("");
    try {
      const compressed = await Promise.all(files.map(f => compressImage(f)));
      onChange([...media, ...compressed.map(src => ({ type: 'image' as const, src }))]);
    } catch {
      setUploadErr("Failed to process images.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleVideo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 200 * 1024 * 1024) {
      setUploadErr("Video too large (max 200 MB).");
      e.target.value = "";
      return;
    }
    setUploadingVid(true); setVideoProgress(0); setUploadErr("");
    try {
      await new Promise<void>((resolve, reject) => {
        const reader = new FileReader();
        reader.onprogress = (ev) => {
          if (ev.lengthComputable) {
            setVideoProgress(Math.round((ev.loaded / ev.total) * 80));
          }
        };
        reader.onload = () => { setVideoProgress(85); resolve(); };
        reader.onerror = () => reject(reader.error);
        reader.readAsArrayBuffer(file);
      });
      setVideoProgress(90);
      const key = `vid_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
      await storeVideo(key, file);
      setVideoProgress(100);
      onChange([...media, { type: 'video', src: `idb:${key}` }]);
      setTimeout(() => { setVideoProgress(0); setUploadingVid(false); }, 700);
    } catch {
      setUploadErr("Failed to store video.");
      setVideoProgress(0);
      setUploadingVid(false);
    } finally {
      e.target.value = "";
    }
  };

  return (
    <Field label={label}>
      <div className="flex flex-wrap gap-2 mb-1">
        {media.map((item, i) => (
          <div key={i} className="relative group w-20 h-14">
            {item.type === 'image' ? (
              <img src={item.src} alt={`Item ${i + 1}`}
                className="w-20 h-14 object-cover rounded-lg border border-white/10" />
            ) : (
              <div className="w-20 h-14 rounded-lg flex flex-col items-center justify-center gap-0.5 border border-orange-500/20"
                style={{ background: "rgba(220,80,0,0.1)" }}>
                <Play size={16} className="text-orange-400" />
                <span className="text-[9px] text-orange-300/70">Video</span>
              </div>
            )}
            {i === 0 && (
              <div className="absolute top-0.5 left-0.5 text-[8px] px-1 py-px rounded"
                style={{ background: "rgba(0,100,255,0.75)", color: "#fff" }}>1st</div>
            )}
            <div className="absolute inset-0 rounded-lg bg-black/65 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
              <button type="button" onClick={() => move(i, -1)} disabled={i === 0}
                className="p-1 rounded bg-white/15 text-white/70 hover:text-white disabled:opacity-20 transition">
                <ChevronLeft size={11} />
              </button>
              <button type="button" onClick={() => remove(i)}
                className="p-1 rounded bg-red-500/50 text-white hover:bg-red-500/80 transition">
                <XIcon size={11} />
              </button>
              <button type="button" onClick={() => move(i, 1)} disabled={i === media.length - 1}
                className="p-1 rounded bg-white/15 text-white/70 hover:text-white disabled:opacity-20 transition">
                <ChevronRight size={11} />
              </button>
            </div>
          </div>
        ))}
        <button type="button" disabled={uploading}
          onClick={() => imgInputRef.current?.click()}
          className="w-20 h-14 rounded-lg border-2 border-dashed border-white/20 flex flex-col items-center justify-center gap-1 hover:border-blue-400/50 transition disabled:opacity-50">
          {uploading ? <span className="text-white/40 text-[10px]">…</span> : <>
            <ImageIcon size={15} className="text-white/30" />
            <span className="text-[10px] text-white/30">Image</span>
          </>}
        </button>
        <button type="button" disabled={uploadingVid}
          onClick={() => vidInputRef.current?.click()}
          className="w-20 h-14 rounded-lg border-2 border-dashed border-orange-400/25 flex flex-col items-center justify-center gap-1 hover:border-orange-400/55 transition disabled:opacity-50">
          {uploadingVid ? (
            <span className="text-[10px] font-bold" style={{ color: "#FB923C" }}>{videoProgress}%</span>
          ) : <>
            <Play size={15} className="text-orange-400/60" />
            <span className="text-[10px] text-orange-300/50">Video</span>
          </>}
        </button>
        <input ref={imgInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleImages} />
        <input ref={vidInputRef} type="file" accept="video/mp4,video/webm,video/*" className="hidden" onChange={handleVideo} />
      </div>

      {uploadingVid && (
        <div className="mt-2">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] text-orange-300/70">
              {videoProgress < 85 ? "Reading file…" : videoProgress < 95 ? "Saving to storage…" : "Done!"}
            </span>
            <span className="text-[11px] font-bold" style={{ color: "#FB923C" }}>{videoProgress}%</span>
          </div>
          <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
            <div
              className="h-full rounded-full"
              style={{
                width: `${videoProgress}%`,
                background: "linear-gradient(90deg, #EA580C, #FB923C)",
                transition: "width 0.2s ease",
                boxShadow: "0 0 8px rgba(251,146,60,0.6)",
              }}
            />
          </div>
        </div>
      )}

      {uploadErr && <p className="text-red-400 text-xs mt-1">{uploadErr}</p>}
      {media.length > 0 && !uploadErr && !uploadingVid && (
        <p className="text-xs text-white/30 mt-0.5">
          {media.length} item{media.length !== 1 ? 's' : ''} · Hover to reorder or delete · First = card cover
        </p>
      )}
    </Field>
  );
}

function HeroEditor() {
  const { data, updateSection, resetSection } = usePortfolio();
  const [local, setLocal] = useState<HeroData>({ ...data.hero });
  const [saved, setSaved] = useState(false); const [saveErr, setSaveErr] = useState("");
  const set = (k: keyof HeroData, v: unknown) => setLocal(p => ({ ...p, [k]: v }));
  const save = () => { const ok = updateSection("hero", local); if (ok) { setSaved(true); setSaveErr(""); setTimeout(() => setSaved(false), 2000); } else { setSaveErr("Storage full — remove images to free space."); } };
  const reset = () => { setLocal({ ...defaultPortfolioData.hero }); resetSection("hero"); setSaveErr(""); };
  return (
    <div className="flex flex-col gap-5">
      <SingleImageUploader
        label="Profile Photo (replaces AW in navbar)"
        value={local.profileImage}
        onChange={v => set("profileImage", v)}
      />
      <div className="grid grid-cols-2 gap-4">
        <Field label="Name"><input className={inputCls} value={local.name} onChange={e => set("name", e.target.value)} /></Field>
        <Field label="Subtitle Badge"><input className={inputCls} value={local.subtitle} onChange={e => set("subtitle", e.target.value)} /></Field>
      </div>
      <Field label="Bio">
        <textarea className={inputCls} rows={3} value={local.bio} onChange={e => set("bio", e.target.value)} />
      </Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Email"><input className={inputCls} value={local.email} onChange={e => set("email", e.target.value)} /></Field>
        <Field label="Phone"><input className={inputCls} value={local.phone} onChange={e => set("phone", e.target.value)} /></Field>
        <Field label="Location"><input className={inputCls} value={local.location} onChange={e => set("location", e.target.value)} /></Field>
        <Field label="GitHub URL"><input className={inputCls} value={local.githubUrl} onChange={e => set("githubUrl", e.target.value)} /></Field>
        <Field label="LinkedIn URL"><input className={inputCls} value={local.linkedinUrl} onChange={e => set("linkedinUrl", e.target.value)} /></Field>
      </div>
      <ListStringEditor label="Typewriter Roles" items={local.roles} onChange={v => set("roles", v)} />
      <SaveBar onSave={save} onReset={reset} saved={saved} error={saveErr} />
    </div>
  );
}

function AboutEditor() {
  const { data, updateSection, resetSection } = usePortfolio();
  const [local, setLocal] = useState<AboutData>({ ...data.about, whatIDo: [...data.about.whatIDo], stats: [...data.about.stats], storyParagraphs: [...data.about.storyParagraphs] });
  const [saved, setSaved] = useState(false);
  const [saveErr, setSaveErr] = useState("");
  const save = () => { const ok = updateSection("about", local); if (ok) { setSaved(true); setSaveErr(""); setTimeout(() => setSaved(false), 2000); } else { setSaveErr("Storage full — remove images to free space."); } };
  const reset = () => { setLocal({ ...defaultPortfolioData.about }); resetSection("about"); };
  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-blue-300/70 mb-3">Story Paragraphs</p>
        {local.storyParagraphs.map((p, i) => (
          <div key={i} className="mb-2 flex gap-2">
            <textarea className={inputCls} rows={3} value={p} onChange={e => {
              const arr = [...local.storyParagraphs]; arr[i] = e.target.value;
              setLocal(prev => ({ ...prev, storyParagraphs: arr }));
            }} />
            <button onClick={() => setLocal(prev => ({ ...prev, storyParagraphs: prev.storyParagraphs.filter((_, j) => j !== i) }))}
              className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 self-start"><Trash2 size={14} /></button>
          </div>
        ))}
        <button onClick={() => setLocal(prev => ({ ...prev, storyParagraphs: [...prev.storyParagraphs, ""] }))}
          className={`${btnCls} bg-white/5 hover:bg-white/10 text-blue-300 w-fit mt-1`}><Plus size={14} /> Add Paragraph</button>
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-blue-300/70 mb-3">What I Do Cards</p>
        {local.whatIDo.map((item, i) => (
          <div key={i} className="mb-3 p-3 rounded-lg bg-white/5 border border-white/10 flex flex-col gap-2">
            <div className="flex gap-2">
              <input className={inputCls} placeholder="Label" value={item.label} onChange={e => {
                const arr = [...local.whatIDo]; arr[i] = { ...arr[i], label: e.target.value };
                setLocal(prev => ({ ...prev, whatIDo: arr }));
              }} />
              <button onClick={() => setLocal(prev => ({ ...prev, whatIDo: prev.whatIDo.filter((_, j) => j !== i) }))}
                className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400"><Trash2 size={14} /></button>
            </div>
            <textarea className={inputCls} rows={2} placeholder="Description" value={item.desc} onChange={e => {
              const arr = [...local.whatIDo]; arr[i] = { ...arr[i], desc: e.target.value };
              setLocal(prev => ({ ...prev, whatIDo: arr }));
            }} />
          </div>
        ))}
        <button onClick={() => setLocal(prev => ({ ...prev, whatIDo: [...prev.whatIDo, { label: "", desc: "" }] }))}
          className={`${btnCls} bg-white/5 hover:bg-white/10 text-blue-300 w-fit`}><Plus size={14} /> Add Card</button>
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-blue-300/70 mb-3">Stats</p>
        {local.stats.map((stat, i) => (
          <div key={i} className="mb-2 grid grid-cols-4 gap-2 items-center">
            <input className={inputCls} placeholder="Label" value={stat.label} onChange={e => {
              const arr = [...local.stats]; arr[i] = { ...arr[i], label: e.target.value };
              setLocal(prev => ({ ...prev, stats: arr }));
            }} />
            <input className={inputCls} type="number" placeholder="Value" value={stat.value} onChange={e => {
              const arr = [...local.stats]; arr[i] = { ...arr[i], value: Number(e.target.value) };
              setLocal(prev => ({ ...prev, stats: arr }));
            }} />
            <input className={inputCls} placeholder="Suffix (e.g. +)" value={stat.suffix} onChange={e => {
              const arr = [...local.stats]; arr[i] = { ...arr[i], suffix: e.target.value };
              setLocal(prev => ({ ...prev, stats: arr }));
            }} />
            <button onClick={() => setLocal(prev => ({ ...prev, stats: prev.stats.filter((_, j) => j !== i) }))}
              className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 justify-self-start"><Trash2 size={14} /></button>
          </div>
        ))}
        <button onClick={() => setLocal(prev => ({ ...prev, stats: [...prev.stats, { label: "", value: 0, suffix: "", color: "hsl(210 100% 60%)" }] }))}
          className={`${btnCls} bg-white/5 hover:bg-white/10 text-blue-300 w-fit`}><Plus size={14} /> Add Stat</button>
      </div>
      <SaveBar onSave={save} onReset={reset} saved={saved} error={saveErr} />
    </div>
  );
}

function EducationEditor() {
  const { data, updateSection, resetSection } = usePortfolio();
  const [local, setLocal] = useState<EducationEntry[]>(data.education.map(e => ({ ...e, highlights: [...e.highlights] })));
  const [saved, setSaved] = useState(false);
  const [expanded, setExpanded] = useState<number | null>(0);
  const [saveErr, setSaveErr] = useState("");
  const save = () => { const ok = updateSection("education", local); if (ok) { setSaved(true); setSaveErr(""); setTimeout(() => setSaved(false), 2000); } else { setSaveErr("Storage full — remove images to free space."); } };
  const reset = () => { setLocal(defaultPortfolioData.education.map(e => ({ ...e }))); resetSection("education"); };
  const setField = (i: number, k: keyof EducationEntry, v: unknown) => {
    const arr = [...local]; arr[i] = { ...arr[i], [k]: v }; setLocal(arr);
  };
  return (
    <div className="flex flex-col gap-4">
      {local.map((edu, i) => (
        <div key={i} className="rounded-xl border border-white/10 bg-white/3 overflow-hidden">
          <button className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-white/5"
            onClick={() => setExpanded(expanded === i ? null : i)}>
            <span className="font-medium text-white">{edu.institution || "New Entry"}</span>
            <div className="flex items-center gap-2">
              <button onClick={e => { e.stopPropagation(); setLocal(local.filter((_, j) => j !== i)); }}
                className="p-1 rounded hover:text-red-400 text-white/40"><Trash2 size={14} /></button>
              {expanded === i ? <ChevronUp size={16} className="text-white/40" /> : <ChevronDown size={16} className="text-white/40" />}
            </div>
          </button>
          {expanded === i && (
            <div className="px-4 pb-4 flex flex-col gap-3">
              <Field label="Degree / Title"><input className={inputCls} value={edu.degree} onChange={e => setField(i, "degree", e.target.value)} /></Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Institution"><input className={inputCls} value={edu.institution} onChange={e => setField(i, "institution", e.target.value)} /></Field>
                <Field label="Location"><input className={inputCls} value={edu.location} onChange={e => setField(i, "location", e.target.value)} /></Field>
                <Field label="Period"><input className={inputCls} value={edu.period} onChange={e => setField(i, "period", e.target.value)} /></Field>
                <Field label="Year Label (e.g. 3rd Year)"><input className={inputCls} value={edu.year} onChange={e => setField(i, "year", e.target.value)} /></Field>
              </div>
              <ListStringEditor label="Highlights" items={edu.highlights} onChange={v => setField(i, "highlights", v)} />
            </div>
          )}
        </div>
      ))}
      <button onClick={() => setLocal([...local, { degree: "", institution: "", location: "", period: "", year: "", color: "hsl(210 100% 60%)", highlights: [] }])}
        className={`${btnCls} bg-white/5 hover:bg-white/10 text-blue-300 w-fit`}><Plus size={14} /> Add Education</button>
      <SaveBar onSave={save} onReset={reset} saved={saved} error={saveErr} />
    </div>
  );
}

function SkillsEditor() {
  const { data, updateSection, resetSection } = usePortfolio();
  const [local, setLocal] = useState<SkillsData>({ categories: { ...data.skills.categories }, categoryColors: { ...data.skills.categoryColors } });
  const [saved, setSaved] = useState(false);
  const [activecat, setActivecat] = useState<string>(Object.keys(data.skills.categories)[0] || "");
  const [saveErr, setSaveErr] = useState("");
  const save = () => { const ok = updateSection("skills", local); if (ok) { setSaved(true); setSaveErr(""); setTimeout(() => setSaved(false), 2000); } else { setSaveErr("Storage full — remove images to free space."); } };
  const reset = () => { setLocal({ categories: { ...defaultPortfolioData.skills.categories }, categoryColors: { ...defaultPortfolioData.skills.categoryColors } }); resetSection("skills"); };
  const cats = Object.keys(local.categories);
  const updateSkill = (cat: string, idx: number, field: keyof SkillItem, val: string | number) => {
    const arr = [...local.categories[cat]];
    arr[idx] = { ...arr[idx], [field]: val };
    setLocal(p => ({ ...p, categories: { ...p.categories, [cat]: arr } }));
  };
  const addSkill = (cat: string) => setLocal(p => ({ ...p, categories: { ...p.categories, [cat]: [...p.categories[cat], { name: "", level: 70 }] } }));
  const removeSkill = (cat: string, idx: number) => setLocal(p => ({ ...p, categories: { ...p.categories, [cat]: p.categories[cat].filter((_, j) => j !== idx) } }));
  const addCat = () => {
    const name = `Category ${cats.length + 1}`;
    setLocal(p => ({ categories: { ...p.categories, [name]: [] }, categoryColors: { ...p.categoryColors, [name]: "hsl(210 100% 60%)" } }));
    setActivecat(name);
  };
  const removeCat = (cat: string) => {
    const { [cat]: _, ...rest } = local.categories;
    const { [cat]: __, ...restColors } = local.categoryColors;
    setLocal({ categories: rest, categoryColors: restColors });
    setActivecat(Object.keys(rest)[0] || "");
  };
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        {cats.map(cat => (
          <button key={cat} onClick={() => setActivecat(cat)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${activecat === cat ? "bg-blue-500 text-white" : "bg-white/5 text-white/60 hover:bg-white/10"}`}>
            {cat}
          </button>
        ))}
        <button onClick={addCat} className={`${btnCls} bg-white/5 hover:bg-white/10 text-blue-300`}><Plus size={14} /> Add Category</button>
      </div>
      {activecat && local.categories[activecat] && (
        <div className="rounded-xl border border-white/10 bg-white/3 p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between mb-1">
            <span className="font-semibold text-white">{activecat}</span>
            <button onClick={() => removeCat(activecat)} className="text-red-400 hover:text-red-300 text-sm flex items-center gap-1"><Trash2 size={14} /> Remove Category</button>
          </div>
          {local.categories[activecat].map((skill, i) => (
            <div key={i} className="flex items-center gap-3">
              <input className={inputCls + " flex-1"} placeholder="Skill name" value={skill.name} onChange={e => updateSkill(activecat, i, "name", e.target.value)} />
              <input type="range" min={0} max={100} value={skill.level} className="w-28" onChange={e => updateSkill(activecat, i, "level", Number(e.target.value))} />
              <span className="text-blue-300 text-sm w-8 text-right">{skill.level}</span>
              <button onClick={() => removeSkill(activecat, i)} className="p-1 rounded hover:text-red-400 text-white/30"><Trash2 size={14} /></button>
            </div>
          ))}
          <button onClick={() => addSkill(activecat)} className={`${btnCls} bg-white/5 hover:bg-white/10 text-blue-300 w-fit`}><Plus size={14} /> Add Skill</button>
        </div>
      )}
      <SaveBar onSave={save} onReset={reset} saved={saved} error={saveErr} />
    </div>
  );
}

function ExperienceEditor() {
  const { data, updateSection, resetSection } = usePortfolio();
  const [local, setLocal] = useState<ExperienceEntry[]>(data.experience.map(e => ({ ...e, achievements: [...e.achievements], tech: [...e.tech] })));
  const [saved, setSaved] = useState(false);
  const [expanded, setExpanded] = useState<number | null>(0);
  const [saveErr, setSaveErr] = useState("");
  const save = () => { const ok = updateSection("experience", local); if (ok) { setSaved(true); setSaveErr(""); setTimeout(() => setSaved(false), 2000); } else { setSaveErr("Storage full — remove images to free space."); } };
  const reset = () => { setLocal(defaultPortfolioData.experience.map(e => ({ ...e }))); resetSection("experience"); };
  const setField = (i: number, k: keyof ExperienceEntry, v: unknown) => {
    const arr = [...local]; arr[i] = { ...arr[i], [k]: v }; setLocal(arr);
  };
  return (
    <div className="flex flex-col gap-4">
      {local.map((exp, i) => (
        <div key={exp.id} className="rounded-xl border border-white/10 bg-white/3 overflow-hidden">
          <button className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/5"
            onClick={() => setExpanded(expanded === i ? null : i)}>
            <div className="text-left">
              <div className="font-medium text-white">{exp.role || "New Entry"}</div>
              <div className="text-xs text-white/40">{exp.company}</div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={e => { e.stopPropagation(); setLocal(local.filter((_, j) => j !== i)); }}
                className="p-1 rounded hover:text-red-400 text-white/40"><Trash2 size={14} /></button>
              {expanded === i ? <ChevronUp size={16} className="text-white/40" /> : <ChevronDown size={16} className="text-white/40" />}
            </div>
          </button>
          {expanded === i && (
            <div className="px-4 pb-4 flex flex-col gap-3">
              <Field label="Role / Title"><input className={inputCls} value={exp.role} onChange={e => setField(i, "role", e.target.value)} /></Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Company"><input className={inputCls} value={exp.company} onChange={e => setField(i, "company", e.target.value)} /></Field>
                <Field label="Location"><input className={inputCls} value={exp.location} onChange={e => setField(i, "location", e.target.value)} /></Field>
                <Field label="Period"><input className={inputCls} value={exp.period} onChange={e => setField(i, "period", e.target.value)} /></Field>
                <Field label="Type (e.g. Freelance)"><input className={inputCls} value={exp.type} onChange={e => setField(i, "type", e.target.value)} /></Field>
              </div>
              <ListStringEditor label="Achievements" items={exp.achievements} onChange={v => setField(i, "achievements", v)} />
              <TagEditor label="Tech Tags" tags={exp.tech} onChange={v => setField(i, "tech", v)} />
            </div>
          )}
        </div>
      ))}
      <button onClick={() => setLocal([...local, { id: uid(), role: "", company: "", location: "", period: "", type: "", color: "hsl(210 100% 60%)", achievements: [], tech: [] }])}
        className={`${btnCls} bg-white/5 hover:bg-white/10 text-blue-300 w-fit`}><Plus size={14} /> Add Experience</button>
      <SaveBar onSave={save} onReset={reset} saved={saved} error={saveErr} />
    </div>
  );
}

function ProjectsEditor() {
  const { data, updateSection, resetSection } = usePortfolio();
  const [local, setLocal] = useState<ProjectEntry[]>(data.projects.map(p => ({
    ...p,
    tech: [...p.tech],
    features: [...p.features],
    media: p.media ?? (p.images ? p.images.map(src => ({ type: 'image' as const, src })) : []),
  })));
  const [saved, setSaved] = useState(false);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [saveErr, setSaveErr] = useState("");
  const save = () => { const ok = updateSection("projects", local); if (ok) { setSaved(true); setSaveErr(""); setTimeout(() => setSaved(false), 2000); } else { setSaveErr("Storage full — remove images to free space."); } };
  const reset = () => { setLocal(defaultPortfolioData.projects.map(p => ({ ...p }))); resetSection("projects"); };
  const setField = (i: number, k: keyof ProjectEntry, v: unknown) => {
    const arr = [...local]; arr[i] = { ...arr[i], [k]: v }; setLocal(arr);
  };
  return (
    <div className="flex flex-col gap-4">
      {local.map((proj, i) => (
        <div key={proj.id} className="rounded-xl border border-white/10 bg-white/3 overflow-hidden">
          <button className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/5"
            onClick={() => setExpanded(expanded === i ? null : i)}>
            <div className="text-left flex items-center gap-3">
              <span className="text-xl">{proj.emoji}</span>
              <div>
                <div className="font-medium text-white">{proj.title || "New Project"}</div>
                <div className="text-xs text-white/40">{proj.period} · {proj.context}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {proj.demo && <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-400">Demo ✓</span>}
              <button onClick={e => { e.stopPropagation(); setLocal(local.filter((_, j) => j !== i)); }}
                className="p-1 rounded hover:text-red-400 text-white/40"><Trash2 size={14} /></button>
              {expanded === i ? <ChevronUp size={16} className="text-white/40" /> : <ChevronDown size={16} className="text-white/40" />}
            </div>
          </button>
          {expanded === i && (
            <div className="px-4 pb-4 flex flex-col gap-3">
              <div className="grid grid-cols-3 gap-3">
                <Field label="Title"><input className={inputCls} value={proj.title} onChange={e => setField(i, "title", e.target.value)} /></Field>
                <Field label="Period"><input className={inputCls} value={proj.period} onChange={e => setField(i, "period", e.target.value)} /></Field>
                <Field label="Context"><input className={inputCls} value={proj.context} onChange={e => setField(i, "context", e.target.value)} /></Field>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <Field label="Category">
                  <input className={inputCls} placeholder="e.g. Machine Learning" value={proj.category ?? ""} onChange={e => setField(i, "category", e.target.value)} />
                </Field>
                <Field label="Emoji"><input className={inputCls} value={proj.emoji} onChange={e => setField(i, "emoji", e.target.value)} /></Field>
                <Field label="Accent Color (hsl or hex)"><input className={inputCls} value={proj.accent} onChange={e => setField(i, "accent", e.target.value)} /></Field>
              </div>
              <Field label="Short Description">
                <textarea className={inputCls} rows={2} value={proj.description} onChange={e => setField(i, "description", e.target.value)} />
              </Field>
              <Field label="Long Description (modal)">
                <textarea className={inputCls} rows={4} value={proj.longDesc} onChange={e => setField(i, "longDesc", e.target.value)} />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="GitHub URL">
                  <input className={inputCls} value={proj.github} onChange={e => setField(i, "github", e.target.value)} />
                </Field>
                <Field label="🚀 Live Demo URL">
                  <input className={inputCls} placeholder="https://..." value={proj.demo} onChange={e => setField(i, "demo", e.target.value)} />
                </Field>
              </div>
              <TagEditor label="Tech Stack" tags={proj.tech} onChange={v => setField(i, "tech", v)} />
              <ListStringEditor label="Key Features" items={proj.features} onChange={v => setField(i, "features", v)} />
              <MediaEditor
                label="Media — Images & Videos (shown in modal & card cover)"
                media={proj.media ?? []}
                onChange={v => setField(i, "media", v)}
              />
            </div>
          )}
        </div>
      ))}
      <button onClick={() => {
        setLocal([...local, { id: uid(), title: "", period: "", context: "", description: "", longDesc: "", tech: [], features: [], github: "", demo: "", gradient: "linear-gradient(135deg,#0055ff22,#00aaff22)", accent: "hsl(210 100% 60%)", emoji: "🚀" }]);
        setExpanded(local.length);
      }} className={`${btnCls} bg-white/5 hover:bg-white/10 text-blue-300 w-fit`}><Plus size={14} /> Add Project</button>
      <SaveBar onSave={save} onReset={reset} saved={saved} error={saveErr} />
    </div>
  );
}

function CoursesEditor() {
  const { data, updateSection, resetSection } = usePortfolio();
  const [local, setLocal] = useState<CourseEntry[]>(data.courses.map(c => ({ ...c })));
  const [saved, setSaved] = useState(false);
  const [saveErr, setSaveErr] = useState("");
  const save = () => { const ok = updateSection("courses", local); if (ok) { setSaved(true); setSaveErr(""); setTimeout(() => setSaved(false), 2000); } else { setSaveErr("Storage full — remove images to free space."); } };
  const reset = () => { setLocal(defaultPortfolioData.courses.map(c => ({ ...c }))); resetSection("courses"); };
  const setField = (i: number, k: keyof CourseEntry, v: string) => {
    const arr = [...local]; arr[i] = { ...arr[i], [k]: v }; setLocal(arr);
  };
  return (
    <div className="flex flex-col gap-3">
      {local.map((c, i) => (
        <div key={c.id} className="grid grid-cols-[1fr_1fr_auto_auto] gap-2 items-center p-3 rounded-xl bg-white/3 border border-white/10">
          <input className={inputCls} placeholder="Course title" value={c.title} onChange={e => setField(i, "title", e.target.value)} />
          <input className={inputCls} placeholder="Provider" value={c.provider} onChange={e => setField(i, "provider", e.target.value)} />
          <input className={inputCls} placeholder="Period" value={c.period} onChange={e => setField(i, "period", e.target.value)} />
          <button onClick={() => setLocal(local.filter((_, j) => j !== i))} className="p-2 rounded hover:text-red-400 text-white/30"><Trash2 size={14} /></button>
        </div>
      ))}
      <button onClick={() => setLocal([...local, { id: uid(), title: "", provider: "", period: "", badge: "", color: "hsl(210 100% 60%)" }])}
        className={`${btnCls} bg-white/5 hover:bg-white/10 text-blue-300 w-fit`}><Plus size={14} /> Add Course</button>
      <SaveBar onSave={save} onReset={reset} saved={saved} error={saveErr} />
    </div>
  );
}

function VolunteerEditor() {
  const { data, updateSection, resetSection } = usePortfolio();
  const [local, setLocal] = useState<VolunteerEntry[]>(data.volunteer.map(v => ({ ...v })));
  const [saved, setSaved] = useState(false);
  const [saveErr, setSaveErr] = useState("");
  const save = () => { const ok = updateSection("volunteer", local); if (ok) { setSaved(true); setSaveErr(""); setTimeout(() => setSaved(false), 2000); } else { setSaveErr("Storage full — remove images to free space."); } };
  const reset = () => { setLocal(defaultPortfolioData.volunteer.map(v => ({ ...v }))); resetSection("volunteer"); };
  const setField = (i: number, k: keyof VolunteerEntry, v: string) => {
    const arr = [...local]; arr[i] = { ...arr[i], [k]: v }; setLocal(arr);
  };
  return (
    <div className="flex flex-col gap-3">
      {local.map((v, i) => (
        <div key={v.id} className="p-3 rounded-xl bg-white/3 border border-white/10 flex flex-col gap-2">
          <div className="grid grid-cols-[1fr_1fr_auto] gap-2 items-center">
            <input className={inputCls} placeholder="Role" value={v.role} onChange={e => setField(i, "role", e.target.value)} />
            <input className={inputCls} placeholder="Organization" value={v.organization} onChange={e => setField(i, "organization", e.target.value)} />
            <button onClick={() => setLocal(local.filter((_, j) => j !== i))} className="p-2 rounded hover:text-red-400 text-white/30"><Trash2 size={14} /></button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <input className={inputCls} placeholder="Period" value={v.period} onChange={e => setField(i, "period", e.target.value)} />
            <input className={inputCls} placeholder="Description" value={v.description} onChange={e => setField(i, "description", e.target.value)} />
          </div>
        </div>
      ))}
      <button onClick={() => setLocal([...local, { id: uid(), role: "", organization: "", period: "", color: "hsl(210 100% 60%)", description: "" }])}
        className={`${btnCls} bg-white/5 hover:bg-white/10 text-blue-300 w-fit`}><Plus size={14} /> Add Entry</button>
      <SaveBar onSave={save} onReset={reset} saved={saved} error={saveErr} />
    </div>
  );
}

function ContactEditor() {
  const { data, updateSection, resetSection } = usePortfolio();
  const [local, setLocal] = useState<ContactData>({ ...data.contact });
  const [saved, setSaved] = useState(false);
  const [saveErr, setSaveErr] = useState("");
  const save = () => { const ok = updateSection("contact", local); if (ok) { setSaved(true); setSaveErr(""); setTimeout(() => setSaved(false), 2000); } else { setSaveErr("Storage full — remove images to free space."); } };
  const reset = () => { setLocal({ ...defaultPortfolioData.contact }); resetSection("contact"); };
  const set = (k: keyof ContactData, v: string) => setLocal(p => ({ ...p, [k]: v }));
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4">
        <Field label="Email"><input className={inputCls} value={local.email} onChange={e => set("email", e.target.value)} /></Field>
        <Field label="Phone"><input className={inputCls} value={local.phone} onChange={e => set("phone", e.target.value)} /></Field>
        <Field label="Location"><input className={inputCls} value={local.location} onChange={e => set("location", e.target.value)} /></Field>
        <Field label="GitHub URL"><input className={inputCls} value={local.githubUrl} onChange={e => set("githubUrl", e.target.value)} /></Field>
        <Field label="LinkedIn URL"><input className={inputCls} value={local.linkedinUrl} onChange={e => set("linkedinUrl", e.target.value)} /></Field>
        <Field label="Instagram URL"><input className={inputCls} placeholder="https://instagram.com/..." value={local.instagramUrl || ""} onChange={e => set("instagramUrl", e.target.value)} /></Field>
        <Field label="Facebook URL"><input className={inputCls} placeholder="https://facebook.com/..." value={local.facebookUrl || ""} onChange={e => set("facebookUrl", e.target.value)} /></Field>
      </div>
      <SaveBar onSave={save} onReset={reset} saved={saved} error={saveErr} />
    </div>
  );
}

function MessagesViewer() {
  const [msgs, setMsgs] = useState<ContactMessage[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);

  const refresh = () => setMsgs(loadMessages());

  // Load on mount
  useEffect(() => { refresh(); }, []);

  // Auto-refresh when a message arrives from another tab (storage event)
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === "aw_messages") refresh();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // Auto-refresh when this tab regains focus (same-tab contact → admin flow)
  useEffect(() => {
    window.addEventListener("focus", refresh);
    return () => window.removeEventListener("focus", refresh);
  }, []);

  const handleDelete = (id: string) => {
    deleteMessage(id);
    refresh();
  };

  const handleExpand = (id: string) => {
    if (expanded !== id) {
      markMessageRead(id);
      refresh();
    }
    setExpanded(prev => (prev === id ? null : id));
  };

  const unread = msgs.filter(m => !m.read).length;

  if (msgs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-white/30 gap-3">
        <Inbox size={40} />
        <p className="text-sm">No messages yet</p>
        <p className="text-xs text-white/20">Messages sent from the contact form will appear here</p>
        <button
          type="button"
          onClick={refresh}
          className="mt-2 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/40 text-xs transition"
        >
          <RefreshCw size={12} /> Refresh
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm text-white/40">
          {msgs.length} message{msgs.length !== 1 ? "s" : ""}
          {unread > 0 && <span className="ml-2 px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold">{unread} new</span>}
        </p>
        <button
          type="button"
          onClick={refresh}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-white/40 hover:text-white/70 text-xs transition"
        >
          <RefreshCw size={11} /> Refresh
        </button>
      </div>

      {msgs.map((msg) => (
        <div
          key={msg.id}
          className="rounded-xl border transition-all"
          style={{
            background: msg.read ? "rgba(255,255,255,0.02)" : "rgba(0,100,255,0.06)",
            borderColor: msg.read ? "rgba(255,255,255,0.07)" : "rgba(0,100,255,0.25)",
          }}
        >
          <button
            className="w-full flex items-start justify-between gap-3 px-4 py-3.5 text-left"
            onClick={() => handleExpand(msg.id)}
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                {!msg.read && <div className="w-2 h-2 rounded-full bg-blue-400 flex-shrink-0" />}
                <span className="text-sm font-semibold text-white truncate">{msg.name}</span>
                <span className="text-xs text-white/30 flex-shrink-0">{msg.email}</span>
              </div>
              <p className="text-xs text-white/50 truncate">{msg.subject}</p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="text-xs text-white/25">
                {new Date(msg.date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
              </span>
              {expanded === msg.id ? <ChevronUp size={14} className="text-white/30" /> : <ChevronDown size={14} className="text-white/30" />}
            </div>
          </button>

          {expanded === msg.id && (
            <div className="px-4 pb-4 border-t border-white/6 pt-3">
              <div className="flex items-center gap-2 mb-3 text-xs text-white/30">
                <CheckCheck size={12} className="text-green-400" />
                <span>Received {new Date(msg.date).toLocaleString("en-GB")}</span>
              </div>
              <p className="text-xs text-white/20 font-semibold uppercase tracking-wider mb-1">Subject</p>
              <p className="text-sm text-white/70 mb-4">{msg.subject}</p>
              <p className="text-xs text-white/20 font-semibold uppercase tracking-wider mb-1">Message</p>
              <p className="text-sm text-white/60 leading-relaxed whitespace-pre-wrap mb-4">{msg.message}</p>
              <div className="flex gap-2">
                <a
                  href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}`}
                  className={`${btnCls} bg-blue-500/10 hover:bg-blue-500/20 text-blue-400`}
                >
                  <Mail size={13} /> Reply
                </a>
                <button
                  onClick={() => handleDelete(msg.id)}
                  className={`${btnCls} bg-red-500/10 hover:bg-red-500/20 text-red-400`}
                >
                  <Trash2 size={13} /> Delete
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function SettingsEditor({ onLogout }: { onLogout: () => void }) {
  const { resetAll } = usePortfolio();
  const [currentPwd, setCurrentPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [msg, setMsg] = useState<{ text: string; ok: boolean } | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);

  const changePassword = () => {
    if (currentPwd !== getAdminPassword()) { setMsg({ text: "Current password is incorrect.", ok: false }); return; }
    if (newPwd.length < 4) { setMsg({ text: "New password must be at least 4 characters.", ok: false }); return; }
    if (newPwd !== confirmPwd) { setMsg({ text: "New passwords do not match.", ok: false }); return; }
    setAdminPassword(newPwd);
    setCurrentPwd(""); setNewPwd(""); setConfirmPwd("");
    setMsg({ text: "Password changed successfully!", ok: true });
    setTimeout(() => setMsg(null), 3000);
  };

  return (
    <div className="flex flex-col gap-8 max-w-lg">
      <div className="p-5 rounded-xl bg-white/3 border border-white/10 flex flex-col gap-4">
        <div className="flex items-center gap-2 text-white font-semibold"><Lock size={16} className="text-blue-400" /> Change Password</div>
        <Field label="Current Password">
          <input type="password" className={inputCls} value={currentPwd} onChange={e => setCurrentPwd(e.target.value)} />
        </Field>
        <Field label="New Password">
          <input type="password" className={inputCls} value={newPwd} onChange={e => setNewPwd(e.target.value)} />
        </Field>
        <Field label="Confirm New Password">
          <input type="password" className={inputCls} value={confirmPwd} onChange={e => setConfirmPwd(e.target.value)} />
        </Field>
        {msg && <p className={`text-sm ${msg.ok ? "text-green-400" : "text-red-400"}`}>{msg.text}</p>}
        <button onClick={changePassword} className={`${btnCls} bg-blue-500 hover:bg-blue-400 text-white w-fit`}>
          <Lock size={15} /> Change Password
        </button>
      </div>

      <div className="p-5 rounded-xl bg-red-500/5 border border-red-500/20 flex flex-col gap-3">
        <div className="font-semibold text-red-400">Danger Zone</div>
        <p className="text-sm text-white/50">Reset all portfolio data to the original defaults. This cannot be undone.</p>
        {!confirmReset ? (
          <button onClick={() => setConfirmReset(true)} className={`${btnCls} bg-red-500/10 hover:bg-red-500/20 text-red-400 w-fit`}>
            Reset All Data
          </button>
        ) : (
          <div className="flex gap-3">
            <button onClick={() => { resetAll(); setConfirmReset(false); }} className={`${btnCls} bg-red-500 hover:bg-red-600 text-white`}>
              Yes, Reset Everything
            </button>
            <button onClick={() => setConfirmReset(false)} className={`${btnCls} bg-white/5 hover:bg-white/10 text-white/60`}>
              Cancel
            </button>
          </div>
        )}
      </div>

      <div className="p-5 rounded-xl bg-white/3 border border-white/10 flex flex-col gap-3">
        <div className="font-semibold text-white">Session</div>
        <button onClick={onLogout} className={`${btnCls} bg-white/5 hover:bg-white/10 text-red-400 w-fit`}>
          <LogOut size={15} /> Logout
        </button>
      </div>
    </div>
  );
}

const editors: Record<string, (props: { onLogout: () => void }) => ReactElement> = {
  hero: () => <HeroEditor />,
  about: () => <AboutEditor />,
  education: () => <EducationEditor />,
  skills: () => <SkillsEditor />,
  experience: () => <ExperienceEditor />,
  projects: () => <ProjectsEditor />,
  courses: () => <CoursesEditor />,
  volunteer: () => <VolunteerEditor />,
  contact: () => <ContactEditor />,
  messages: () => <MessagesViewer />,
  settings: ({ onLogout }) => <SettingsEditor onLogout={onLogout} />,
};

function AdminLogin({ onLogin }: { onLogin: () => void }) {
  const [pwd, setPwd] = useState("");
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pwd === getAdminPassword()) {
      sessionStorage.setItem("aw_admin_auth", "true");
      onLogin();
    } else {
      setError("Incorrect password. Please try again.");
      setShake(true);
      setTimeout(() => setShake(false), 600);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "radial-gradient(ellipse at center, rgba(0,80,255,0.08) 0%, #03060f 70%)" }}>
      <div className={`w-full max-w-sm mx-4 transition-all ${shake ? "animate-[shake_0.6s_ease]" : ""}`}>
        <div className="rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl p-8 flex flex-col gap-6">
          <div className="text-center">
            <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
              <Lock size={24} className="text-blue-400" />
            </div>
            <h1 className="text-xl font-bold text-white">Admin Access</h1>
            <p className="text-sm text-white/40 mt-1">Portfolio Management</p>
          </div>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Field label="Password">
              <input
                type="password"
                className={`${inputCls} text-center tracking-widest text-lg`}
                value={pwd}
                onChange={e => { setPwd(e.target.value); setError(""); }}
                placeholder="••••••••"
                autoFocus
              />
            </Field>
            {error && <p className="text-red-400 text-sm text-center">{error}</p>}
            <button type="submit" className={`${btnCls} bg-blue-500 hover:bg-blue-400 text-white justify-center w-full py-3`}>
              Enter Admin Panel
            </button>
          </form>
          <Link href="/" className="text-center text-sm text-white/30 hover:text-white/60 transition">
            ← Back to Portfolio
          </Link>
        </div>
      </div>
      <style>{`@keyframes shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-8px)}75%{transform:translateX(8px)}}`}</style>
    </div>
  );
}

function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const [active, setActive] = useState("hero");
  const ActiveEditor = editors[active];

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#03060f" }}>
      {/* Top bar */}
      <header className="flex items-center justify-between px-6 py-3 border-b border-white/10 bg-black/30 backdrop-blur sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
            <LayoutDashboard size={16} className="text-blue-400" />
          </div>
          <span className="font-bold text-white">Portfolio Admin</span>
          <span className="text-xs text-white/30 hidden sm:block">Ahmed Wael</span>
        </div>
        <div className="flex items-center gap-3">
          <a href="/" target="_blank" rel="noopener noreferrer"
            className={`${btnCls} bg-white/5 hover:bg-white/10 text-white/60`}>
            <Eye size={14} /> <span className="hidden sm:inline">View Portfolio</span>
            <ExternalLink size={12} />
          </a>
          <button onClick={onLogout} className={`${btnCls} bg-white/5 hover:bg-red-500/10 text-white/60 hover:text-red-400`}>
            <LogOut size={14} /> <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <nav className="w-56 shrink-0 border-r border-white/10 bg-black/20 flex flex-col py-4 overflow-y-auto">
          {sidebarSections.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setActive(id)}
              className={`flex items-center gap-3 px-4 py-2.5 text-sm transition text-left w-full ${active === id ? "bg-blue-500/15 text-blue-300 border-r-2 border-blue-400" : "text-white/50 hover:text-white hover:bg-white/5"}`}>
              <Icon size={16} />
              {label}
            </button>
          ))}
        </nav>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-3xl mx-auto">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-white capitalize">
                {sidebarSections.find(s => s.id === active)?.label}
              </h2>
              <p className="text-sm text-white/40 mt-1">
              {active === "messages" ? "Messages from the contact form" : "Edit and save changes to your portfolio"}
            </p>
            </div>
            <div className="text-white">
              <ActiveEditor onLogout={onLogout} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default function Admin() {
  const [authenticated, setAuthenticated] = useState(
    () => sessionStorage.getItem("aw_admin_auth") === "true"
  );

  const handleLogin = () => setAuthenticated(true);
  const handleLogout = () => {
    sessionStorage.removeItem("aw_admin_auth");
    setAuthenticated(false);
  };

  if (!authenticated) return <AdminLogin onLogin={handleLogin} />;
  return <AdminDashboard onLogout={handleLogout} />;
}
