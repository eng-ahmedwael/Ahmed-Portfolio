import { useEffect, useRef } from "react";
import { motion, type Variants } from "framer-motion";
import { Github, Linkedin, Mail, ChevronDown, Download, Eye } from "lucide-react";
import { useTypewriter } from "@/hooks/useTypewriter";
import { usePortfolio } from "@/context/PortfolioContext";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  alpha: number;
}

export function Hero() {
  const { data } = usePortfolio();
  const { hero } = data;
  const [firstName, ...restParts] = hero.name.split(" ");
  const lastName = restParts.join(" ");

  const displayText = useTypewriter(hero.roles);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animFrameRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const count = 80;
    particlesRef.current = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 2 + 0.5,
      alpha: Math.random() * 0.5 + 0.1,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const particles = particlesRef.current;

      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 150, 255, ${p.alpha})`;
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const other = particles[j];
          const dx = p.x - other.x;
          const dy = p.y - other.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(other.x, other.y);
            ctx.strokeStyle = `rgba(0, 150, 255, ${0.08 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      });

      animFrameRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  const scrollTo = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const container: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.3 } },
  };
  const item: Variants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none" />

      <div
        className="absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(0,100,255,0.08) 0%, transparent 70%), radial-gradient(ellipse 50% 40% at 80% 80%, rgba(0,200,255,0.06) 0%, transparent 60%)",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div variants={container} initial="hidden" animate="show">
            <motion.div variants={item} className="flex items-center gap-3 mb-6">
              <div className="h-px w-12 bg-primary" />
              <span className="text-primary text-sm font-mono tracking-widest uppercase">
                {hero.subtitle}
              </span>
            </motion.div>

            <motion.h1 variants={item} className="text-5xl sm:text-6xl lg:text-7xl font-black mb-4 leading-tight">
              <span className="text-foreground">Hi, I'm </span>
              <span
                style={{
                  background: "linear-gradient(135deg, hsl(210 100% 70%), hsl(185 100% 60%))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {firstName}
              </span>
              <br />
              <span
                style={{
                  background: "linear-gradient(135deg, hsl(185 100% 60%), hsl(210 100% 70%))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {lastName}
              </span>
            </motion.h1>

            <motion.div variants={item} className="flex items-center gap-2 mb-8 h-10">
              <span className="text-xl text-muted-foreground font-mono">{">"}</span>
              <span className="text-xl text-accent font-mono font-medium">{displayText}</span>
              <span className="w-0.5 h-6 bg-accent animate-pulse" />
            </motion.div>

            <motion.p variants={item} className="text-muted-foreground text-lg leading-relaxed mb-10 max-w-lg">
              {hero.bio}
            </motion.p>

            <motion.div variants={item} className="flex flex-wrap gap-4 mb-10">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(0,150,255,0.5)" }}
                whileTap={{ scale: 0.97 }}
                onClick={() => scrollTo("#projects")}
                className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white transition-all"
                style={{ background: "linear-gradient(135deg, hsl(210 100% 56%), hsl(185 100% 50%))" }}
                data-testid="hero-view-projects"
              >
                <Eye size={18} />
                View Projects
              </motion.button>
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                href={`mailto:${hero.email}`}
                className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-foreground border border-border hover:border-primary transition-all"
                style={{ background: "rgba(255,255,255,0.03)" }}
                data-testid="hero-download-resume"
              >
                <Download size={18} />
                Download CV
              </motion.a>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => scrollTo("#contact")}
                className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-primary hover:text-accent transition-all"
                data-testid="hero-contact"
              >
                <Mail size={18} />
                Contact Me
              </motion.button>
            </motion.div>

            <motion.div variants={item} className="flex items-center gap-4">
              {[
                { icon: Github, href: hero.githubUrl, label: "GitHub" },
                { icon: Linkedin, href: hero.linkedinUrl, label: "LinkedIn" },
                { icon: Mail, href: `mailto:${hero.email}`, label: "Email" },
              ].map(({ icon: Icon, href, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.15, y: -3 }}
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-muted-foreground hover:text-primary border border-border hover:border-primary transition-all"
                  style={{ background: "rgba(255,255,255,0.03)" }}
                  data-testid={`hero-social-${label.toLowerCase()}`}
                >
                  <Icon size={18} />
                </motion.a>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "backOut" }}
            className="flex justify-center lg:justify-end"
          >
            <div className="relative">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute -inset-8 rounded-full border border-primary/10"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute -inset-4 rounded-full border border-accent/10"
              />

              <div
                className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-full flex items-center justify-center"
                style={{
                  background: "linear-gradient(135deg, rgba(0,100,255,0.12), rgba(0,200,255,0.08))",
                  border: "2px solid rgba(0,150,255,0.25)",
                  boxShadow: "0 0 60px rgba(0,150,255,0.2), inset 0 0 60px rgba(0,150,255,0.05)",
                }}
              >
                <div
                  className="w-48 h-48 sm:w-60 sm:h-60 rounded-full flex items-center justify-center overflow-hidden"
                  style={{
                    background: "linear-gradient(135deg, hsl(210 100% 56% / 0.3), hsl(185 100% 50% / 0.2))",
                    border: "1px solid rgba(0,200,255,0.2)",
                  }}
                >
                  {hero.profileImage ? (
                    <img
                      src={hero.profileImage}
                      alt={hero.name}
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <span
                      className="text-6xl sm:text-7xl font-black"
                      style={{
                        background: "linear-gradient(135deg, hsl(210 100% 70%), hsl(185 100% 60%))",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        filter: "drop-shadow(0 0 20px rgba(0,150,255,0.5))",
                      }}
                    >
                      {hero.name.split(" ").map(w => w[0]).join("")}
                    </span>
                  )}
                </div>
              </div>

              {hero.orbitalTech.map(({ label, color }, idx) => {
                const angle = idx * (360 / hero.orbitalTech.length);
                const rad = ((angle - 90) * Math.PI) / 180;
                const r = 155;
                const x = Math.cos(rad) * r;
                const y = Math.sin(rad) * r;
                return (
                  <motion.div
                    key={label}
                    animate={{ y: [0, -6, 0] }}
                    transition={{ duration: 3 + angle / 60, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute text-xs font-mono font-semibold px-2 py-1 rounded-md"
                    style={{
                      left: `calc(50% + ${x}px)`,
                      top: `calc(50% + ${y}px)`,
                      transform: "translate(-50%, -50%)",
                      background: "rgba(3,6,15,0.85)",
                      border: `1px solid ${color}65`,
                      color,
                      textShadow: `0 0 10px ${color}`,
                      boxShadow: `0 0 16px ${color}35, 0 0 6px ${color}20`,
                    }}
                  >
                    {label}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 8, 0] }}
        transition={{ delay: 2, duration: 2, repeat: Infinity, ease: "easeInOut" }}
        onClick={() => scrollTo("#about")}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-muted-foreground hover:text-primary transition-colors"
        data-testid="hero-scroll-indicator"
      >
        <span className="text-xs tracking-widest uppercase font-mono">Scroll</span>
        <ChevronDown size={16} />
      </motion.button>
    </section>
  );
}
