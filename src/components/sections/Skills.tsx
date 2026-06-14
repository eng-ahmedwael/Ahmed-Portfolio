import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { usePortfolio } from "@/context/PortfolioContext";
import type { SkillItem } from "@/data/portfolioDefaults";

function SkillBar({ skill, color, inView }: { skill: SkillItem; color: string; inView: boolean }) {
  return (
    <div className="group" data-testid={`skill-${skill.name.toLowerCase().replace(/\s+/g, "-")}`}>
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-foreground">{skill.name}</span>
        <span className="text-xs font-mono text-muted-foreground">{skill.level}%</span>
      </div>
      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
        <motion.div
          initial={{ width: 0 }}
          animate={inView ? { width: `${skill.level}%` } : { width: 0 }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.1 }}
          className="h-full rounded-full"
          style={{
            background: `linear-gradient(90deg, ${color}, ${color}bb)`,
            boxShadow: `0 0 8px ${color}60`,
          }}
        />
      </div>
    </div>
  );
}

export function Skills() {
  const { data } = usePortfolio();
  const { skills } = data;
  const categories = Object.keys(skills.categories);

  const [active, setActive] = useState<string>(categories[0] || "Programming");
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const color = skills.categoryColors[active] || "hsl(210 100% 60%)";
  const activeSkills = skills.categories[active] || [];

  return (
    <section id="skills" ref={ref} className="py-24 relative">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 60% 50% at 70% 50%, rgba(0,200,255,0.04) 0%, transparent 70%)" }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-16" style={{ background: "linear-gradient(90deg, transparent, hsl(210 100% 56%))" }} />
            <span className="text-primary text-sm font-mono tracking-widest uppercase">Skills</span>
            <div className="h-px w-16" style={{ background: "linear-gradient(90deg, hsl(185 100% 50%), transparent)" }} />
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-foreground mb-4">Technical Skills</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            A growing toolkit in data science, AI, and software development built through projects and coursework.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {categories.map((cat) => {
            const isActive = cat === active;
            const catColor = skills.categoryColors[cat] || "hsl(210 100% 60%)";
            return (
              <motion.button
                key={cat}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setActive(cat)}
                className="px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
                style={{
                  background: isActive ? `${catColor}20` : "rgba(255,255,255,0.03)",
                  border: `1px solid ${isActive ? catColor + "60" : "rgba(255,255,255,0.08)"}`,
                  color: isActive ? catColor : "hsl(var(--muted-foreground))",
                  boxShadow: isActive ? `0 0 15px ${catColor}30` : "none",
                }}
                data-testid={`skill-tab-${cat.toLowerCase().replace(/\s+/g, "-")}`}
              >
                {cat}
              </motion.button>
            );
          })}
        </motion.div>

        <motion.div
          key={active}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="rounded-2xl p-8 relative"
          style={{
            background: "linear-gradient(135deg, rgba(0,100,255,0.06), rgba(3,6,15,0.8))",
            border: `1px solid ${color}20`,
            boxShadow: `0 0 40px ${color}08`,
          }}
        >
          <div
            className="absolute top-0 left-0 right-0 h-px rounded-t-2xl"
            style={{ background: `linear-gradient(90deg, transparent, ${color}50, transparent)` }}
          />
          <div className="flex items-center gap-3 mb-8">
            <div className="w-2 h-8 rounded-full" style={{ background: color, boxShadow: `0 0 12px ${color}80` }} />
            <h3 className="text-xl font-bold text-foreground">{active}</h3>
            <span className="ml-auto text-sm text-muted-foreground font-mono">{activeSkills.length} skills</span>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {activeSkills.map((skill, i) => (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
              >
                <SkillBar skill={skill} color={color} inView={inView} />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
