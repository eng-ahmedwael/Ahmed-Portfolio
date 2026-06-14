import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Award, Star, Shield, Zap } from "lucide-react";
import { useCountUp } from "@/hooks/useCountUp";

const certifications = [
  {
    name: "AWS Certified Developer",
    issuer: "Amazon Web Services",
    year: "2023",
    color: "#FF9900",
    icon: Shield,
  },
  {
    name: "Meta Frontend Developer",
    issuer: "Meta (Facebook)",
    year: "2022",
    color: "#0866FF",
    icon: Star,
  },
  {
    name: "Google UX Design",
    issuer: "Google",
    year: "2022",
    color: "#4285F4",
    icon: Award,
  },
  {
    name: "Docker Certified Associate",
    issuer: "Docker, Inc.",
    year: "2021",
    color: "#2496ED",
    icon: Zap,
  },
  {
    name: "MongoDB Developer",
    issuer: "MongoDB University",
    year: "2021",
    color: "#47A248",
    icon: Shield,
  },
  {
    name: "GitHub Actions",
    issuer: "GitHub",
    year: "2023",
    color: "#2088FF",
    icon: Award,
  },
];

const milestones = [
  { value: 5, label: "Awards Won", suffix: "", color: "hsl(30 100% 60%)" },
  { value: 10, label: "Certifications", suffix: "+", color: "hsl(210 100% 56%)" },
  { value: 50, label: "Projects Shipped", suffix: "+", color: "hsl(185 100% 50%)" },
  { value: 5, label: "Years Experience", suffix: "+", color: "hsl(250 100% 70%)" },
];

function MilestoneCounter({ value, label, suffix, color, start }: { value: number; label: string; suffix: string; color: string; start: boolean }) {
  const count = useCountUp(value, 1800, start);
  return (
    <div className="text-center" data-testid={`milestone-${label.toLowerCase().replace(/\s+/g, "-")}`}>
      <div className="text-4xl font-black mb-1" style={{ color }}>
        {count}{suffix}
      </div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  );
}

export function Achievements() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="achievements" ref={ref} className="py-24 relative">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 60% 50% at 50% 30%, rgba(255,150,0,0.04) 0%, transparent 70%)" }}
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
            <span className="text-primary text-sm font-mono tracking-widest uppercase">Achievements</span>
            <div className="h-px w-12 bg-primary" />
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-foreground mb-4">Recognition & Certs</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Validated expertise through industry-recognized certifications and professional milestones.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="glass-card rounded-2xl p-8 mb-12"
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {milestones.map((m, i) => (
              <motion.div
                key={m.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.3 + i * 0.1, duration: 0.4, ease: "backOut" }}
              >
                <MilestoneCounter {...m} start={inView} />
              </motion.div>
            ))}
          </div>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {certifications.map((cert, i) => {
            const Icon = cert.icon;
            return (
              <motion.div
                key={cert.name}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
                whileHover={{ y: -6, boxShadow: `0 0 30px ${cert.color}25` }}
                className="glass-card rounded-2xl p-6 transition-all duration-300 cursor-default"
                data-testid={`cert-${cert.name.toLowerCase().replace(/\s+/g, "-")}`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: `${cert.color}15`, border: `1px solid ${cert.color}30` }}
                  >
                    <Icon size={22} style={{ color: cert.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-foreground text-sm leading-tight mb-1">{cert.name}</h3>
                    <p className="text-muted-foreground text-xs mb-2">{cert.issuer}</p>
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-mono"
                      style={{ background: `${cert.color}12`, color: cert.color, border: `1px solid ${cert.color}25` }}
                    >
                      {cert.year}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
