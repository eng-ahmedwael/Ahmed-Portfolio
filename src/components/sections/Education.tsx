import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { GraduationCap, Calendar, MapPin, BookOpen } from "lucide-react";
import { usePortfolio } from "@/context/PortfolioContext";

export function Education() {
  const { data } = usePortfolio();
  const { education } = data;
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="education" ref={ref} className="py-24 relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 60% 50% at 70% 40%, rgba(0,120,255,0.06) 0%, transparent 65%),
            radial-gradient(ellipse 40% 40% at 20% 70%, rgba(0,200,255,0.05) 0%, transparent 60%)
          `,
        }}
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
            <span className="text-primary text-sm font-mono tracking-widest uppercase">Education</span>
            <div className="h-px w-16" style={{ background: "linear-gradient(90deg, hsl(185 100% 50%), transparent)" }} />
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-foreground mb-4">Academic Background</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Building a strong foundation in data science, AI, and computer science at Alexandria National University.
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto space-y-8">
          {education.map((edu, i) => (
            <motion.div
              key={edu.institution + i}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: i * 0.15 }}
              className="relative"
            >
              <motion.div
                whileHover={{ y: -4, boxShadow: `0 0 50px ${edu.color}20` }}
                className="rounded-2xl p-8 transition-all duration-300 relative overflow-hidden"
                style={{
                  background: "linear-gradient(135deg, rgba(0,100,255,0.08) 0%, rgba(3,6,15,0.8) 50%, rgba(0,200,255,0.05) 100%)",
                  border: `1px solid ${edu.color}30`,
                  boxShadow: `0 0 30px ${edu.color}08`,
                }}
              >
                <div
                  className="absolute top-0 left-0 right-0 h-px"
                  style={{ background: `linear-gradient(90deg, transparent, ${edu.color}60, transparent)` }}
                />
                <div
                  className="absolute -top-16 -right-16 w-48 h-48 rounded-full pointer-events-none"
                  style={{ background: `radial-gradient(circle, ${edu.color}12 0%, transparent 70%)` }}
                />

                <div className="flex items-start gap-6 relative">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0"
                    style={{
                      background: `linear-gradient(135deg, ${edu.color}25, ${edu.color}10)`,
                      border: `1px solid ${edu.color}40`,
                      boxShadow: `0 0 20px ${edu.color}30`,
                    }}
                  >
                    <GraduationCap size={28} style={{ color: edu.color }} />
                  </div>

                  <div className="flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                      <div>
                        <h3 className="text-lg font-bold text-foreground leading-tight mb-1">{edu.degree}</h3>
                        <p className="font-semibold" style={{ color: edu.color }}>{edu.institution}</p>
                      </div>
                      <span
                        className="text-sm font-bold px-3 py-1.5 rounded-full flex-shrink-0"
                        style={{
                          background: `${edu.color}15`,
                          color: edu.color,
                          border: `1px solid ${edu.color}35`,
                          boxShadow: `0 0 10px ${edu.color}20`,
                        }}
                      >
                        {edu.year}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <Calendar size={14} style={{ color: edu.color }} />
                        {edu.period}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <MapPin size={14} style={{ color: edu.color }} />
                        {edu.location}
                      </span>
                    </div>

                    <div className="space-y-2.5">
                      {edu.highlights.map((h, j) => (
                        <motion.div
                          key={j}
                          initial={{ opacity: 0, x: 20 }}
                          animate={inView ? { opacity: 1, x: 0 } : {}}
                          transition={{ delay: 0.3 + j * 0.08, duration: 0.4 }}
                          className="flex gap-3 text-sm text-muted-foreground"
                        >
                          <div
                            className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                            style={{ background: edu.color, boxShadow: `0 0 6px ${edu.color}80` }}
                          />
                          {h}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>

              {i === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="mt-6 grid sm:grid-cols-3 gap-4"
                >
                  {[
                    { icon: BookOpen, label: "Major", value: "Data Science & AI", color: "hsl(210 100% 60%)" },
                    { icon: Calendar, label: "Duration", value: "4 Years (2023–2027)", color: "hsl(185 100% 55%)" },
                    { icon: GraduationCap, label: "Status", value: "Currently Enrolled", color: "hsl(170 100% 50%)" },
                  ].map(({ icon: Icon, label, value, color }) => (
                    <div
                      key={label}
                      className="rounded-xl p-4 text-center"
                      style={{ background: `${color}08`, border: `1px solid ${color}20` }}
                    >
                      <Icon size={18} className="mx-auto mb-2" style={{ color }} />
                      <p className="text-xs text-muted-foreground mb-1">{label}</p>
                      <p className="text-sm font-semibold text-foreground">{value}</p>
                    </div>
                  ))}
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
