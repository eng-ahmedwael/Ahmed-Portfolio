import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Heart, Calendar, Users } from "lucide-react";
import { usePortfolio } from "@/context/PortfolioContext";

export function Volunteer() {
  const { data } = usePortfolio();
  const { volunteer: volunteerRoles } = data;
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="volunteer" ref={ref} className="py-24 relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 50% 50% at 30% 50%, rgba(0,150,255,0.05) 0%, transparent 65%),
            radial-gradient(ellipse 40% 40% at 75% 60%, rgba(0,200,255,0.04) 0%, transparent 60%)
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
            <span className="text-primary text-sm font-mono tracking-widest uppercase">Volunteer</span>
            <div className="h-px w-16" style={{ background: "linear-gradient(90deg, hsl(185 100% 50%), transparent)" }} />
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-foreground mb-4">Community Involvement</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Giving back through tech communities, youth organizations, and student initiatives.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {volunteerRoles.map((vol, i) => (
            <motion.div
              key={vol.id || vol.organization}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              whileHover={{ y: -6, boxShadow: `0 0 40px ${vol.color}25` }}
              className="rounded-2xl p-6 transition-all duration-300 relative overflow-hidden group"
              style={{
                background: "linear-gradient(135deg, rgba(0,100,255,0.06), rgba(3,6,15,0.75))",
                border: `1px solid ${vol.color}25`,
              }}
            >
              <div
                className="absolute top-0 left-0 right-0 h-px"
                style={{ background: `linear-gradient(90deg, transparent, ${vol.color}50, transparent)` }}
              />
              <div
                className="absolute -bottom-12 -right-12 w-32 h-32 rounded-full pointer-events-none"
                style={{ background: `radial-gradient(circle, ${vol.color}10 0%, transparent 70%)` }}
              />

              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 relative"
                style={{ background: `${vol.color}15`, border: `1px solid ${vol.color}35`, boxShadow: `0 0 15px ${vol.color}25` }}
              >
                <Heart size={22} style={{ color: vol.color }} />
              </div>

              <span
                className="inline-block text-xs font-bold px-3 py-1 rounded-full mb-3"
                style={{ background: `${vol.color}15`, color: vol.color, border: `1px solid ${vol.color}30` }}
              >
                {vol.role}
              </span>

              <h3 className="text-base font-bold text-foreground mb-2 leading-tight">{vol.organization}</h3>

              <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
                <Calendar size={12} style={{ color: vol.color }} />
                {vol.period}
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed">{vol.description}</p>

              <div className="mt-4 flex items-center gap-1.5 text-xs" style={{ color: vol.color }}>
                <Users size={12} />
                <span className="font-medium">Community Impact</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
