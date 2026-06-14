import { useRef } from "react";
import { motion, useInView, type Variants } from "framer-motion";
import { useCountUp } from "@/hooks/useCountUp";
import { Code2, BookOpen, Cpu, Users, type LucideIcon } from "lucide-react";
import { usePortfolio } from "@/context/PortfolioContext";

const iconMap: LucideIcon[] = [BookOpen, Code2, Cpu, Users];

interface StatCardProps {
  label: string;
  value: number;
  suffix: string;
  color: string;
  icon: LucideIcon;
  start: boolean;
}

function StatCard({ label, value, suffix, icon: Icon, color, start }: StatCardProps) {
  const count = useCountUp(value, 2000, start);
  return (
    <motion.div
      whileHover={{ y: -6, boxShadow: `0 0 40px ${color}35` }}
      className="relative rounded-2xl p-6 flex flex-col items-center text-center transition-all duration-300 overflow-hidden"
      style={{
        background: "linear-gradient(135deg, rgba(0,100,255,0.06) 0%, rgba(0,200,255,0.04) 100%)",
        border: `1px solid ${color}30`,
      }}
      data-testid={`stat-${label.toLowerCase().replace(/\s+/g, "-")}`}
    >
      <div
        className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: `linear-gradient(135deg, ${color}08 0%, transparent 60%)` }}
      />
      <div
        className="absolute -top-12 -right-12 w-32 h-32 rounded-full pointer-events-none"
        style={{ background: `radial-gradient(circle, ${color}15 0%, transparent 70%)` }}
      />
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 relative"
        style={{
          background: `linear-gradient(135deg, ${color}20, ${color}10)`,
          border: `1px solid ${color}40`,
          boxShadow: `0 0 15px ${color}25`,
        }}
      >
        <Icon size={22} style={{ color }} />
      </div>
      <span className="text-4xl font-black mb-1" style={{ color, filter: `drop-shadow(0 0 10px ${color}60)` }}>
        {count}{suffix}
      </span>
      <span className="text-sm text-muted-foreground font-medium">{label}</span>
    </motion.div>
  );
}

export function About() {
  const { data } = usePortfolio();
  const { about } = data;
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const statsWithIcons = about.stats.map((stat, i) => ({
    ...stat,
    icon: iconMap[i % iconMap.length],
  }));

  const container: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.12 } },
  };
  const item: Variants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <section id="about" ref={ref} className="py-24 relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 70% 60% at 20% 40%, rgba(0,120,255,0.07) 0%, transparent 65%),
            radial-gradient(ellipse 50% 50% at 80% 60%, rgba(0,200,255,0.06) 0%, transparent 60%),
            radial-gradient(ellipse 40% 40% at 50% 80%, rgba(0,100,255,0.05) 0%, transparent 60%)
          `,
        }}
      />
      <div
        className="absolute top-1/4 left-0 w-64 h-px pointer-events-none"
        style={{ background: "linear-gradient(90deg, transparent, rgba(0,150,255,0.3), transparent)" }}
      />
      <div
        className="absolute top-3/4 right-0 w-64 h-px pointer-events-none"
        style={{ background: "linear-gradient(90deg, transparent, rgba(0,200,255,0.25), transparent)" }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={container}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          className="text-center mb-16"
        >
          <motion.div variants={item} className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-16" style={{ background: "linear-gradient(90deg, transparent, hsl(210 100% 56%))" }} />
            <span className="text-primary text-sm font-mono tracking-widest uppercase">About Me</span>
            <div className="h-px w-16" style={{ background: "linear-gradient(90deg, hsl(185 100% 50%), transparent)" }} />
          </motion.div>
          <motion.h2 variants={item} className="text-4xl sm:text-5xl font-black text-foreground mb-4">
            Who I Am
          </motion.h2>
          <motion.p variants={item} className="text-muted-foreground max-w-2xl mx-auto">
            A passionate Data Science & AI student building real-world solutions through code and data.
          </motion.p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-10 items-start mb-16">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <div
              className="rounded-2xl p-8 h-full relative overflow-hidden"
              style={{
                background: "linear-gradient(135deg, rgba(0,100,255,0.07) 0%, rgba(3,6,15,0.6) 50%, rgba(0,200,255,0.05) 100%)",
                border: "1px solid rgba(0,150,255,0.2)",
                boxShadow: "0 0 40px rgba(0,100,255,0.08), inset 0 1px 0 rgba(255,255,255,0.05)",
              }}
            >
              <div
                className="absolute -top-20 -left-20 w-64 h-64 rounded-full pointer-events-none"
                style={{ background: "radial-gradient(circle, rgba(0,150,255,0.08) 0%, transparent 70%)" }}
              />
              <div
                className="absolute top-0 left-0 right-0 h-px"
                style={{ background: "linear-gradient(90deg, transparent, rgba(0,150,255,0.4), transparent)" }}
              />
              <div className="flex items-center gap-3 mb-6 relative">
                <div
                  className="w-1 h-8 rounded-full"
                  style={{ background: "linear-gradient(180deg, hsl(210 100% 60%), hsl(185 100% 55%))", boxShadow: "0 0 10px rgba(0,150,255,0.5)" }}
                />
                <h3 className="text-xl font-bold text-foreground">My Story</h3>
              </div>
              <div className="space-y-4 text-muted-foreground leading-relaxed relative">
                {about.storyParagraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
          >
            <div
              className="rounded-2xl p-8 relative overflow-hidden"
              style={{
                background: "linear-gradient(135deg, rgba(0,200,255,0.07) 0%, rgba(3,6,15,0.6) 50%, rgba(0,100,255,0.05) 100%)",
                border: "1px solid rgba(0,200,255,0.2)",
                boxShadow: "0 0 40px rgba(0,200,255,0.08), inset 0 1px 0 rgba(255,255,255,0.05)",
              }}
            >
              <div
                className="absolute -bottom-20 -right-20 w-64 h-64 rounded-full pointer-events-none"
                style={{ background: "radial-gradient(circle, rgba(0,200,255,0.07) 0%, transparent 70%)" }}
              />
              <div
                className="absolute top-0 left-0 right-0 h-px"
                style={{ background: "linear-gradient(90deg, transparent, rgba(0,200,255,0.4), transparent)" }}
              />
              <div className="flex items-center gap-3 mb-6 relative">
                <div
                  className="w-1 h-8 rounded-full"
                  style={{ background: "linear-gradient(180deg, hsl(185 100% 55%), hsl(210 100% 60%))", boxShadow: "0 0 10px rgba(0,200,255,0.5)" }}
                />
                <h3 className="text-xl font-bold text-foreground">What I Do</h3>
              </div>
              <div className="space-y-3 relative">
                {about.whatIDo.map(({ label, desc }, i) => (
                  <motion.div
                    key={label}
                    initial={{ opacity: 0, x: 20 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.25 + i * 0.1, duration: 0.5 }}
                    className="flex gap-4 p-4 rounded-xl transition-all duration-300"
                    style={{
                      background: i % 2 === 0
                        ? "linear-gradient(135deg, rgba(0,120,255,0.06), rgba(0,200,255,0.03))"
                        : "linear-gradient(135deg, rgba(0,200,255,0.06), rgba(0,120,255,0.03))",
                      border: `1px solid rgba(${i % 2 === 0 ? "0,120,255" : "0,200,255"},0.12)`,
                    }}
                  >
                    <div
                      className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                      style={{
                        background: i % 2 === 0 ? "hsl(210 100% 60%)" : "hsl(185 100% 55%)",
                        boxShadow: `0 0 8px ${i % 2 === 0 ? "rgba(0,120,255,0.6)" : "rgba(0,200,255,0.6)"}`,
                      }}
                    />
                    <div>
                      <p className="font-semibold text-foreground text-sm mb-1">{label}</p>
                      <p className="text-muted-foreground text-sm">{desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statsWithIcons.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
            >
              <StatCard {...stat} start={inView} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
