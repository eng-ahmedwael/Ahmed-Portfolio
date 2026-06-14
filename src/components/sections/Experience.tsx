import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Calendar, MapPin } from "lucide-react";
import { usePortfolio } from "@/context/PortfolioContext";

export function Experience() {
  const { data } = usePortfolio();
  const { experience: experiences } = data;
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="experience" ref={ref} className="py-24 relative">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 60% 50% at 20% 60%, rgba(100,0,255,0.04) 0%, transparent 70%)" }}
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
            <span className="text-primary text-sm font-mono tracking-widest uppercase">Experience</span>
            <div className="h-px w-16" style={{ background: "linear-gradient(90deg, hsl(185 100% 50%), transparent)" }} />
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-foreground mb-4">Work & Training</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Hands-on experience in robotics, machine learning, and software development.
          </p>
        </motion.div>

        <div className="relative">
          <div
            className="absolute left-6 lg:left-1/2 top-0 bottom-0 w-px -translate-x-1/2"
            style={{ background: "linear-gradient(180deg, transparent, rgba(0,150,255,0.4), rgba(0,200,255,0.3), transparent)" }}
          />

          <div className="space-y-10">
            {experiences.map((exp, i) => {
              const isLeft = i % 2 === 0;
              return (
                <motion.div
                  key={exp.id || exp.company}
                  initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.6, delay: i * 0.15 }}
                  className={`relative flex items-start gap-8 ${isLeft ? "lg:flex-row" : "lg:flex-row-reverse"} flex-row`}
                  data-testid={`experience-${exp.company.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  <div
                    className="absolute left-6 lg:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full border-2 flex-shrink-0 z-10"
                    style={{ background: exp.color, borderColor: exp.color, boxShadow: `0 0 14px ${exp.color}80` }}
                  />

                  <div className={`ml-16 lg:ml-0 lg:w-1/2 ${isLeft ? "lg:pr-12" : "lg:pl-12"}`}>
                    <motion.div
                      whileHover={{ y: -4, boxShadow: `0 0 30px ${exp.color}20` }}
                      className="rounded-2xl p-6 transition-all duration-300 relative overflow-hidden"
                      style={{
                        background: "linear-gradient(135deg, rgba(0,100,255,0.06), rgba(3,6,15,0.6))",
                        border: `1px solid ${exp.color}25`,
                      }}
                    >
                      <div
                        className="absolute top-0 left-0 right-0 h-px"
                        style={{ background: `linear-gradient(90deg, transparent, ${exp.color}50, transparent)` }}
                      />
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div>
                          <h3 className="text-base font-bold text-foreground leading-tight">{exp.role}</h3>
                          <span className="font-semibold text-sm mt-1 block" style={{ color: exp.color }}>
                            {exp.company}
                          </span>
                        </div>
                        <span
                          className="text-xs font-medium px-2 py-1 rounded-full flex-shrink-0"
                          style={{ background: `${exp.color}15`, color: exp.color, border: `1px solid ${exp.color}30` }}
                        >
                          {exp.type}
                        </span>
                      </div>

                      <div className="flex items-center gap-4 mb-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar size={12} />
                          {exp.period}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin size={12} />
                          {exp.location}
                        </span>
                      </div>

                      <ul className="space-y-2 mb-4">
                        {exp.achievements.map((a, j) => (
                          <li key={j} className="flex gap-2 text-sm text-muted-foreground">
                            <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: exp.color }} />
                            {a}
                          </li>
                        ))}
                      </ul>

                      <div className="flex flex-wrap gap-2">
                        {exp.tech.map((t) => (
                          <span
                            key={t}
                            className="text-xs px-2 py-0.5 rounded-full font-mono"
                            style={{ background: `${exp.color}12`, border: `1px solid ${exp.color}25`, color: exp.color }}
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  </div>

                  <div className="hidden lg:block lg:w-1/2" />
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
