import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  SiReact, SiNextdotjs, SiTypescript, SiNodedotjs, SiPython,
  SiPostgresql, SiMongodb, SiRedis, SiDocker, SiKubernetes,
  SiGooglecloud, SiGit, SiGraphql, SiTailwindcss,
  SiGithubactions, SiFastapi, SiTensorflow, SiLinux, SiVite,
} from "react-icons/si";
import { Cloud } from "lucide-react";

const techStack = [
  { name: "React", icon: SiReact, color: "#61DAFB" },
  { name: "Next.js", icon: SiNextdotjs, color: "#ffffff" },
  { name: "TypeScript", icon: SiTypescript, color: "#3178C6" },
  { name: "Node.js", icon: SiNodedotjs, color: "#68A063" },
  { name: "Python", icon: SiPython, color: "#FFD43B" },
  { name: "PostgreSQL", icon: SiPostgresql, color: "#336791" },
  { name: "MongoDB", icon: SiMongodb, color: "#47A248" },
  { name: "Redis", icon: SiRedis, color: "#FF4438" },
  { name: "Docker", icon: SiDocker, color: "#2496ED" },
  { name: "Kubernetes", icon: SiKubernetes, color: "#326CE5" },
  { name: "AWS", icon: Cloud, color: "#FF9900" },
  { name: "GCP", icon: SiGooglecloud, color: "#4285F4" },
  { name: "Git", icon: SiGit, color: "#F05032" },
  { name: "GraphQL", icon: SiGraphql, color: "#E10098" },
  { name: "Tailwind", icon: SiTailwindcss, color: "#06B6D4" },
  { name: "GitHub Actions", icon: SiGithubactions, color: "#2088FF" },
  { name: "FastAPI", icon: SiFastapi, color: "#009688" },
  { name: "TensorFlow", icon: SiTensorflow, color: "#FF6F00" },
  { name: "Linux", icon: SiLinux, color: "#FCC624" },
  { name: "Vite", icon: SiVite, color: "#646CFF" },
];

export function TechStack() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="tech" ref={ref} className="py-24 relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 70% 50% at 50% 50%, rgba(0,150,255,0.04) 0%, transparent 70%)" }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-12 bg-primary" />
            <span className="text-primary text-sm font-mono tracking-widest uppercase">Tech Stack</span>
            <div className="h-px w-12 bg-primary" />
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-foreground mb-4">Tools of the Trade</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Technologies I work with to build exceptional digital products.
          </p>
        </motion.div>

        <div className="grid grid-cols-4 sm:grid-cols-5 lg:grid-cols-10 gap-4">
          {techStack.map((tech, i) => {
            const Icon = tech.icon;
            const delay = (i % 10) * 0.05;
            const floatDuration = 2.5 + (i % 5) * 0.4;

            return (
              <motion.div
                key={tech.name}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.4, delay: delay + 0.2, ease: "backOut" }}
                className="group relative"
                data-testid={`tech-${tech.name.toLowerCase().replace(/\s+/g, "-")}`}
              >
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: floatDuration, repeat: Infinity, ease: "easeInOut", delay: i * 0.1 }}
                  whileHover={{ scale: 1.2, y: -12 }}
                  className="glass-card rounded-xl p-3 flex flex-col items-center gap-1.5 cursor-default transition-all duration-200"
                  style={{ border: "1px solid rgba(255,255,255,0.06)" }}
                >
                  <Icon size={28} style={{ color: tech.color }} />
                  <span className="text-[9px] text-muted-foreground font-mono text-center leading-tight hidden sm:block">
                    {tech.name}
                  </span>
                </motion.div>

                <div
                  className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded text-xs text-white font-medium opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10"
                  style={{
                    background: "rgba(3,6,15,0.95)",
                    border: `1px solid ${tech.color}40`,
                    boxShadow: `0 0 8px ${tech.color}30`,
                  }}
                >
                  {tech.name}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
