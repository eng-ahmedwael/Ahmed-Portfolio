import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Award, Calendar } from "lucide-react";
import { usePortfolio } from "@/context/PortfolioContext";

const providerColors: Record<string, string> = {
  AWS: "hsl(30 100% 60%)",
  IBM: "hsl(210 100% 60%)",
  NVIDIA: "hsl(120 80% 50%)",
  Kaggle: "hsl(185 100% 55%)",
  Udemy: "hsl(250 100% 70%)",
};

function getBadgeColor(badge: string, fallback: string): string {
  return providerColors[badge] || fallback || "hsl(210 100% 60%)";
}

export function Courses() {
  const { data } = usePortfolio();
  const { courses } = data;
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const providers = [...new Set(courses.map(c => c.badge).filter(Boolean))];

  return (
    <section id="courses" ref={ref} className="py-24 relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 50% 50% at 80% 30%, rgba(0,200,255,0.05) 0%, transparent 65%),
            radial-gradient(ellipse 40% 40% at 20% 70%, rgba(0,100,255,0.04) 0%, transparent 60%)
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
            <span className="text-primary text-sm font-mono tracking-widest uppercase">Certifications</span>
            <div className="h-px w-16" style={{ background: "linear-gradient(90deg, hsl(185 100% 50%), transparent)" }} />
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-foreground mb-4">Courses & Certs</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Continuous learning through certifications from world-leading platforms — AWS, IBM, NVIDIA, and more.
          </p>
        </motion.div>

        <div className="flex flex-wrap gap-3 justify-center mb-12">
          {providers.map((provider) => {
            const color = getBadgeColor(provider, "hsl(210 100% 60%)");
            return (
              <motion.div
                key={provider}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.4 }}
                className="px-4 py-2 rounded-full text-sm font-bold"
                style={{
                  background: `${color}15`,
                  border: `1px solid ${color}40`,
                  color,
                  boxShadow: `0 0 12px ${color}20`,
                }}
              >
                {provider}
              </motion.div>
            );
          })}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map((course, i) => {
            const color = getBadgeColor(course.badge, course.color);
            return (
              <motion.div
                key={course.id || course.title}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.07 }}
                whileHover={{ y: -5, boxShadow: `0 0 30px ${color}20` }}
                className="rounded-2xl p-5 transition-all duration-300 relative overflow-hidden group"
                style={{
                  background: "linear-gradient(135deg, rgba(0,100,255,0.05), rgba(3,6,15,0.7))",
                  border: `1px solid ${color}20`,
                }}
              >
                <div
                  className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: `linear-gradient(90deg, transparent, ${color}60, transparent)` }}
                />
                <div
                  className="absolute -top-8 -right-8 w-24 h-24 rounded-full pointer-events-none opacity-30"
                  style={{ background: `radial-gradient(circle, ${color}20 0%, transparent 70%)` }}
                />

                <div className="flex items-start gap-3 relative">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: `${color}15`, border: `1px solid ${color}35` }}
                  >
                    <Award size={18} style={{ color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-foreground leading-tight mb-1">{course.title}</h3>
                    <p className="text-xs font-semibold mb-2" style={{ color }}>{course.provider}</p>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Calendar size={11} />
                      {course.period}
                    </div>
                  </div>
                </div>

                {course.badge && (
                  <div
                    className="absolute bottom-3 right-3 text-xs font-black px-2 py-0.5 rounded-full opacity-60"
                    style={{ color, background: `${color}10` }}
                  >
                    {course.badge}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
