import { useState, useRef, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Github, ExternalLink, X, Calendar, Play, ChevronLeft, ChevronRight } from "lucide-react";
import { usePortfolio } from "@/context/PortfolioContext";
import type { ProjectEntry, MediaItem } from "@/data/portfolioDefaults";
import { loadVideoUrl } from "@/utils/videoStore";

function DemoCardBtn({ href, testId }: { href: string; testId: string }) {
  const [hov, setHov] = useState(false);
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => e.stopPropagation()}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium"
      style={{
        background: hov ? "rgba(0,200,100,0.18)" : "rgba(0,0,0,0.45)",
        color: "hsl(150 100% 55%)",
        border: hov
          ? "1px solid rgba(0,220,120,0.55)"
          : "1px solid rgba(0,200,100,0.18)",
        boxShadow: hov
          ? "0 0 14px rgba(0,220,100,0.55), 0 0 32px rgba(0,200,80,0.2)"
          : "none",
        transition: "all 0.2s ease",
      }}
      data-testid={testId}
    >
      <Play size={11} />
      Demo
    </a>
  );
}

function resolveMedia(project: ProjectEntry): MediaItem[] {
  if (project.media && project.media.length > 0) return project.media;
  if (project.images && project.images.length > 0) return project.images.map(src => ({ type: 'image' as const, src }));
  return [];
}

function VideoPlayer({ src }: { src: string }) {
  const [url, setUrl] = useState<string | null>(src.startsWith('idb:') ? null : src);
  const blobUrl = useRef<string | null>(null);

  useEffect(() => {
    if (!src.startsWith('idb:')) { setUrl(src); return; }
    let cancelled = false;
    loadVideoUrl(src.slice(4)).then(u => {
      if (cancelled) { if (u) URL.revokeObjectURL(u); return; }
      blobUrl.current = u;
      setUrl(u);
    });
    return () => {
      cancelled = true;
      if (blobUrl.current) { URL.revokeObjectURL(blobUrl.current); blobUrl.current = null; }
    };
  }, [src]);

  if (!url) return (
    <div className="w-full h-48 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.4)" }}>
      <span className="text-white/40 text-sm">Loading video…</span>
    </div>
  );
  return <video src={url} controls className="w-full max-h-64 block" style={{ outline: 'none', background: '#000' }} />;
}

function Lightbox({ items, startIdx, onClose }: { items: MediaItem[]; startIdx: number; onClose: () => void }) {
  const imageItems = items.filter(it => it.type === 'image');
  const [idx, setIdx] = useState(startIdx);
  const cur = imageItems[idx];

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') setIdx(p => (p - 1 + imageItems.length) % imageItems.length);
      if (e.key === 'ArrowRight') setIdx(p => (p + 1) % imageItems.length);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [imageItems.length, onClose]);

  if (!cur) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      className="fixed inset-0 z-[200] flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.94)', backdropFilter: 'blur(12px)' }}
      onClick={onClose}
    >
      <img
        src={cur.src}
        alt={`Image ${idx + 1}`}
        className="rounded-lg select-none"
        style={{ maxWidth: '92vw', maxHeight: '88vh', objectFit: 'contain', boxShadow: '0 0 80px rgba(0,0,0,0.8)' }}
        onClick={e => e.stopPropagation()}
        draggable={false}
      />

      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 rounded-full transition"
        style={{ background: 'rgba(255,255,255,0.12)', color: '#fff' }}
      >
        <X size={20} />
      </button>

      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 text-xs font-mono px-3 py-1 rounded-full"
        style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)' }}>
        {idx + 1} / {imageItems.length}
      </div>

      {imageItems.length > 1 && (
        <>
          <button
            onClick={e => { e.stopPropagation(); setIdx(p => (p - 1 + imageItems.length) % imageItems.length); }}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full transition"
            style={{ background: 'rgba(255,255,255,0.1)', color: '#fff' }}
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={e => { e.stopPropagation(); setIdx(p => (p + 1) % imageItems.length); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full transition"
            style={{ background: 'rgba(255,255,255,0.1)', color: '#fff' }}
          >
            <ChevronRight size={24} />
          </button>
        </>
      )}
    </motion.div>
  );
}

function MediaGallery({ project }: { project: ProjectEntry }) {
  const items = resolveMedia(project);
  const [idx, setIdx] = useState(0);
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const swipeStartX = useRef<number | null>(null);
  const swipeMoved = useRef(false);

  if (!items.length) return null;

  const imageItems = items.filter(it => it.type === 'image');
  const prev = () => setIdx(p => (p - 1 + items.length) % items.length);
  const next = () => setIdx(p => (p + 1) % items.length);

  const onPointerDown = (e: React.PointerEvent) => { swipeStartX.current = e.clientX; swipeMoved.current = false; };
  const onPointerMove = (e: React.PointerEvent) => {
    if (swipeStartX.current !== null && Math.abs(e.clientX - swipeStartX.current) > 8) swipeMoved.current = true;
  };
  const onPointerUp = (e: React.PointerEvent) => {
    if (swipeStartX.current === null) return;
    const dx = e.clientX - swipeStartX.current;
    const wasDrag = swipeMoved.current;
    swipeStartX.current = null;
    swipeMoved.current = false;
    if (Math.abs(dx) >= 40 && items.length > 1) { dx < 0 ? next() : prev(); return; }
    if (!wasDrag && items[idx].type === 'image') {
      const imgIdx = items.slice(0, idx + 1).filter(it => it.type === 'image').length - 1;
      if (imgIdx >= 0) setLightboxIdx(imgIdx);
    }
  };

  const cur = items[idx];

  return (
    <div className="relative w-full select-none">
      <div
        className="relative overflow-hidden rounded-xl cursor-pointer"
        style={{ background: "rgba(0,0,0,0.5)", touchAction: 'pan-y' }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
      >
        {cur.type === 'video' ? (
          <VideoPlayer src={cur.src} />
        ) : (
          <>
            <img src={cur.src} alt={`Media ${idx + 1}`}
              className="w-full object-contain block"
              style={{ maxHeight: '240px' }}
              draggable={false}
            />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
              style={{ background: 'rgba(0,0,0,0.25)' }}>
              <div className="px-3 py-1.5 rounded-full text-xs font-medium"
                style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', backdropFilter: 'blur(4px)' }}>
                Click to expand
              </div>
            </div>
          </>
        )}

        {cur.type === 'video' && (
          <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold pointer-events-none"
            style={{ background: "rgba(200,50,0,0.85)", color: "#fff" }}>
            <Play size={8} /> VIDEO
          </div>
        )}

        {items.length > 1 && (
          <>
            <button onClick={e => { e.stopPropagation(); prev(); }}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full transition"
              style={{ background: "rgba(0,0,0,0.55)", color: "rgba(255,255,255,0.8)" }}>
              <ChevronLeft size={15} />
            </button>
            <button onClick={e => { e.stopPropagation(); next(); }}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full transition"
              style={{ background: "rgba(0,0,0,0.55)", color: "rgba(255,255,255,0.8)" }}>
              <ChevronRight size={15} />
            </button>
            <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5 pointer-events-none">
              {items.map((_, i) => (
                <div key={i} className="rounded-full transition-all"
                  style={{ width: i === idx ? '14px' : '5px', height: '5px', background: i === idx ? project.accent : 'rgba(255,255,255,0.35)' }} />
              ))}
            </div>
          </>
        )}
      </div>

      {items.length > 1 && (
        <div className="flex gap-2 mt-2 overflow-x-auto pb-1 scrollbar-hide">
          {items.map((item, i) => (
            <button key={i} onClick={() => setIdx(i)} className="flex-shrink-0">
              {item.type === 'image' ? (
                <img src={item.src} alt={`Thumb ${i + 1}`}
                  className="w-12 h-9 object-cover rounded-lg transition-all"
                  style={{ border: i === idx ? `2px solid ${project.accent}` : '2px solid transparent', opacity: i === idx ? 1 : 0.5 }} />
              ) : (
                <div className="w-12 h-9 rounded-lg flex items-center justify-center transition-all"
                  style={{ border: i === idx ? `2px solid ${project.accent}` : '2px solid rgba(255,255,255,0.1)', background: 'rgba(200,50,0,0.15)', opacity: i === idx ? 1 : 0.55 }}>
                  <Play size={12} className="text-orange-400" />
                </div>
              )}
            </button>
          ))}
        </div>
      )}

      <AnimatePresence>
        {lightboxIdx !== null && imageItems.length > 0 && (
          <Lightbox items={items} startIdx={lightboxIdx} onClose={() => setLightboxIdx(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}

function ProjectModal({ project, onClose }: { project: ProjectEntry; onClose: () => void }) {
  const [demoHov, setDemoHov] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.80)", backdropFilter: "blur(8px)" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.93, y: 30, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.93, y: 30, opacity: 0 }}
        transition={{ type: "spring", damping: 22, stiffness: 280 }}
        className="rounded-2xl max-w-xl w-full max-h-[88vh] overflow-y-auto relative scrollbar-hide"
        style={{
          background: `
            radial-gradient(ellipse 80% 45% at 0% 0%, hsl(220 90% 14%) 0%, transparent 55%),
            radial-gradient(ellipse 65% 45% at 100% 100%, hsl(210 85% 11%) 0%, transparent 55%),
            radial-gradient(ellipse 55% 35% at 100% 0%, hsl(195 80% 10%) 0%, transparent 50%),
            hsl(222 50% 5%)
          `,
          border: `1px solid rgba(80,130,255,0.28)`,
          boxShadow: `0 0 0 1px rgba(255,255,255,0.04), 0 30px 90px rgba(0,60,180,0.4), 0 8px 30px rgba(0,0,0,0.85)`,
        }}
        onClick={(e) => e.stopPropagation()}
        data-testid="project-modal"
      >
        {/* Decorative top glow strip */}
        <div
          className="absolute top-0 left-0 right-0 h-px rounded-t-2xl"
          style={{ background: "linear-gradient(90deg, transparent 5%, rgba(100,160,255,0.7) 35%, rgba(120,180,255,0.9) 50%, rgba(100,160,255,0.7) 65%, transparent 95%)" }}
        />
        {/* Decorative corner orb top-left */}
        <div
          className="absolute top-0 left-0 w-56 h-56 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(60,120,255,0.25) 0%, transparent 70%)", transform: "translate(-30%, -30%)" }}
        />
        {/* Decorative corner orb bottom-right */}
        <div
          className="absolute bottom-0 right-0 w-72 h-72 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(0,100,255,0.18) 0%, transparent 65%)", transform: "translate(25%, 25%)" }}
        />

        {/* Header */}
        <div className="relative p-7 pb-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)" }}
              >
                {project.emoji}
              </div>
              {/* Title: pure white for maximum contrast */}
              <h3 className="text-xl font-black leading-tight" style={{ color: "#ffffff" }}>{project.title}</h3>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg transition-colors flex-shrink-0 mt-0.5"
              style={{ background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.6)" }}
              data-testid="modal-close"
            >
              <X size={18} />
            </button>
          </div>

          <div className="flex items-center gap-2 mt-3 text-xs flex-wrap">
            {/* Period */}
            <span
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full font-medium"
              style={{ background: "rgba(255,180,50,0.12)", color: "#fbbf24", border: "1px solid rgba(255,180,50,0.25)" }}
            >
              <Calendar size={11} />
              {project.period}
            </span>
            {/* Category badge */}
            {project.category && (() => {
              const cc = CATEGORY_COLORS[project.category] ?? project.accent;
              return (
                <span className="px-2.5 py-1 rounded-full font-semibold"
                  style={{ background: `${cc}18`, color: cc, border: `1px solid ${cc}40`, textShadow: `0 0 8px ${cc}80` }}>
                  {project.category}
                </span>
              );
            })()}
            {project.context && (
              <span
                className="px-2.5 py-1 rounded-full font-medium"
                style={{ background: `${project.accent}22`, color: project.accent, border: `1px solid ${project.accent}40` }}
              >
                {project.context}
              </span>
            )}
          </div>

          {resolveMedia(project).length > 0 && (
            <div className="mt-4">
              <MediaGallery project={project} />
            </div>
          )}

          {/* Description: warm off-white, not pure white, not blue */}
          <p className="mt-4 text-sm leading-relaxed" style={{ color: "rgba(220,228,255,0.82)" }}>{project.longDesc}</p>
        </div>

        <div className="h-px mx-7" style={{ background: "linear-gradient(90deg, transparent, rgba(100,160,255,0.25), transparent)" }} />

        {/* Key Features */}
        <div className="relative px-7 py-5">
          <div className="flex items-center gap-2 mb-4">
            {/* Cyan bar — clearly different from the dark-blue background */}
            <div className="w-1 h-4 rounded-full" style={{ background: "linear-gradient(180deg, #00e5ff, #00b4d8)" }} />
            <h4 className="text-xs font-black tracking-widest uppercase" style={{ color: "#00e5ff" }}>Key Features</h4>
          </div>
          <ul className="space-y-2.5">
            {project.features.map((f) => (
              <li key={f} className="flex gap-3 text-sm leading-relaxed" style={{ color: "rgba(210,225,255,0.78)" }}>
                <div
                  className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                  style={{ background: "#00e5ff", boxShadow: "0 0 6px rgba(0,229,255,0.6)" }}
                />
                {f}
              </li>
            ))}
          </ul>
        </div>

        <div className="h-px mx-7" style={{ background: "linear-gradient(90deg, transparent, rgba(100,160,255,0.25), transparent)" }} />

        {/* Tech Stack */}
        <div className="relative px-7 py-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-4 rounded-full" style={{ background: "linear-gradient(180deg, #00e5ff, #00b4d8)" }} />
            <h4 className="text-xs font-black tracking-widest uppercase" style={{ color: "#00e5ff" }}>Tech Stack</h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {project.tech.map((t) => (
              /* Lime-green tinted pills — warm contrast against cold blue */
              <span
                key={t}
                className="text-xs px-3 py-1 rounded-full font-mono transition-colors"
                style={{
                  background: "rgba(255,255,255,0.07)",
                  border: "1px solid rgba(255,255,255,0.14)",
                  color: "#e2f0ff",
                }}
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="relative px-7 pb-7 pt-1 flex gap-3 flex-wrap">
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors"
              style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.14)", color: "#c8dcff" }}
              data-testid="modal-github"
            >
              <Github size={15} />
              View on GitHub
            </a>
          )}
          {project.demo && (
            <motion.a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium overflow-hidden"
              style={{
                background: "rgba(4, 14, 40, 0.92)",
                border: "1px solid rgba(0,140,255,0.38)",
                color: "#ffffff",
              }}
              animate={{
                boxShadow: demoHov
                  ? "0 0 0 1px rgba(0,170,255,0.65), 0 0 28px rgba(0,160,255,0.55), 0 0 55px rgba(0,150,255,0.22)"
                  : "0 0 0 0px rgba(0,0,0,0)",
              }}
              transition={{ duration: 0.22 }}
              onMouseEnter={() => setDemoHov(true)}
              onMouseLeave={() => setDemoHov(false)}
              whileTap={{ scale: 0.96 }}
              data-testid="modal-demo"
            >
              <motion.div
                className="absolute inset-0"
                animate={{ opacity: demoHov ? 1 : 0 }}
                transition={{ duration: 0.22 }}
                style={{
                  background:
                    "linear-gradient(135deg, hsl(210 100% 50%), hsl(185 100% 44%))",
                }}
              />
              <span className="relative flex items-center gap-2">
                <Play size={15} />
                Live Demo
              </span>
            </motion.a>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

const CATEGORY_COLORS: Record<string, string> = {
  "Machine Learning": "hsl(185 100% 55%)",
  "Computer Vision":  "hsl(30 100% 60%)",
  "NLP / AI":         "hsl(250 100% 70%)",
  "Web & Desktop":    "hsl(210 100% 60%)",
  "Embedded":         "hsl(120 80% 55%)",
};

export function Projects() {
  const { data } = usePortfolio();
  const { projects } = data;

  const allCategories = [...new Set(projects.map(p => p.category).filter(Boolean))] as string[];

  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [selected, setSelected] = useState<ProjectEntry | null>(null);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const filtered = projects.filter((p) => {
    const matchesCat = !activeCategory || p.category === activeCategory;
    return matchesCat;
  });

  return (
    <section id="projects" ref={ref} className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-16" style={{ background: "linear-gradient(90deg, transparent, hsl(210 100% 56%))" }} />
            <span className="text-primary text-sm font-mono tracking-widest uppercase">Projects</span>
            <div className="h-px w-16" style={{ background: "linear-gradient(90deg, hsl(185 100% 50%), transparent)" }} />
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-foreground mb-4">Featured Work</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Real projects built with data science, machine learning, and software development skills.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-2 mb-8"
        >
          <button
            onClick={() => setActiveCategory(null)}
            className="px-3 py-2 rounded-lg text-xs font-semibold transition-all"
            style={
              !activeCategory
                ? { background: "hsl(210 100% 56%)", color: "white", boxShadow: "0 0 12px rgba(0,150,255,0.4)" }
                : { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "hsl(var(--muted-foreground))" }
            }
            data-testid="filter-all"
          >
            All
          </button>
          {allCategories.map((cat) => {
            const color = CATEGORY_COLORS[cat] ?? "hsl(210 100% 60%)";
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat === activeCategory ? null : cat)}
                className="px-3 py-2 rounded-lg text-xs font-semibold transition-all"
                style={
                  isActive
                    ? { background: `${color}22`, color, border: `1px solid ${color}55`, boxShadow: `0 0 12px ${color}30` }
                    : { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "hsl(var(--muted-foreground))" }
                }
                data-testid={`filter-${cat.toLowerCase().replace(/[\s/]/g, "-")}`}
              >
                {cat}
              </button>
            );
          })}
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filtered.map((project, i) => (
              <motion.div
                key={project.id || project.title}
                layout
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                whileHover={{ y: -8, boxShadow: `0 20px 60px ${project.accent}20` }}
                className="rounded-2xl overflow-hidden cursor-pointer group transition-all duration-300"
                style={{
                  background: "linear-gradient(135deg, rgba(0,100,255,0.05), rgba(3,6,15,0.8))",
                  border: `1px solid ${project.accent}20`,
                }}
                onClick={() => setSelected(project)}
                data-testid={`project-card-${project.title.toLowerCase().replace(/\s+/g, "-")}`}
              >
                <div
                  className="h-36 flex items-center justify-center relative overflow-hidden"
                  style={{ background: project.gradient }}
                >
                  {(() => {
                    const first = resolveMedia(project)[0];
                    if (first?.type === 'image') return (
                      <img src={first.src} alt={project.title}
                        className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300" />
                    );
                    if (first?.type === 'video') return (
                      <div className="absolute inset-0 flex items-center justify-center"
                        style={{ background: "rgba(220,50,0,0.12)" }}>
                        <div className="w-12 h-12 rounded-full bg-black/50 flex items-center justify-center">
                          <Play size={22} className="text-white ml-1" />
                        </div>
                      </div>
                    );
                    return null;
                  })()}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ background: `${project.accent}10` }} />
                  {resolveMedia(project).length === 0 && (
                    <span className="text-5xl opacity-70 group-hover:opacity-90 group-hover:scale-110 transition-all duration-300 select-none">
                      {project.emoji}
                    </span>
                  )}
                  <div
                    className="absolute top-3 right-3 text-xs font-mono px-2 py-0.5 rounded-full"
                    style={{ background: `${project.accent}20`, color: project.accent, border: `1px solid ${project.accent}30`, backdropFilter: "blur(4px)" }}
                  >
                    {project.period.split("–")[0].trim()}
                  </div>
                  {project.category && (() => {
                    const cc = CATEGORY_COLORS[project.category] ?? project.accent;
                    return (
                      <div className="absolute top-3 left-3 text-[10px] font-bold px-2 py-0.5 rounded-full"
                        style={{ background: `${cc}22`, color: cc, border: `1px solid ${cc}45`, backdropFilter: "blur(4px)" }}>
                        {project.category}
                      </div>
                    );
                  })()}
                </div>

                <div className="p-5">
                  <h3 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors leading-tight mb-1">
                    {project.title}
                  </h3>
                  <p className="text-xs mb-1" style={{ color: project.accent }}>
                    {project.context}
                  </p>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{project.description}</p>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {project.tech.slice(0, 4).map((t) => (
                      <span
                        key={t}
                        className="text-xs px-2 py-0.5 rounded font-mono"
                        style={{ background: `${project.accent}12`, color: project.accent }}
                      >
                        {t}
                      </span>
                    ))}
                    {project.tech.length > 4 && (
                      <span className="text-xs px-2 py-0.5 rounded text-muted-foreground" style={{ background: "rgba(255,255,255,0.04)" }}>
                        +{project.tech.length - 4}
                      </span>
                    )}
                  </div>

                  <div className="flex gap-2">
                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-muted-foreground hover:text-foreground border border-border transition-all"
                        data-testid={`project-github-${project.title.toLowerCase().replace(/\s+/g, "-")}`}
                      >
                        <Github size={13} />
                        Code
                      </a>
                    )}
                    {project.demo && (
                      <DemoCardBtn
                        href={project.demo}
                        testId={`project-demo-${project.title.toLowerCase().replace(/\s+/g, "-")}`}
                      />
                    )}
                    <button
                      onClick={(e) => { e.stopPropagation(); setSelected(project); }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white transition-all ml-auto"
                      style={{ background: `linear-gradient(135deg, ${project.accent}, ${project.accent}cc)` }}
                    >
                      <ExternalLink size={13} />
                      Details
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {selected && <ProjectModal project={selected} onClose={() => setSelected(null)} />}
        </AnimatePresence>
      </div>
    </section>
  );
}
