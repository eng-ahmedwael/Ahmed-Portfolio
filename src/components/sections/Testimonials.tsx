import { useState, useEffect, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Mitchell",
    role: "CTO",
    company: "TechVentures Inc.",
    avatar: "SM",
    color: "hsl(210 100% 56%)",
    quote:
      "Ahmed transformed our legacy monolith into a modern microservices architecture. His technical depth is matched only by his ability to communicate complex concepts to non-technical stakeholders. An exceptional engineer.",
    rating: 5,
  },
  {
    name: "Marcus Chen",
    role: "Product Director",
    company: "Digital Agency Pro",
    avatar: "MC",
    color: "hsl(185 100% 50%)",
    quote:
      "Working with Ahmed was a game-changer for our team. He delivered our e-commerce platform 2 weeks ahead of schedule, and the performance improvements he implemented reduced our server costs by 40%. Truly remarkable.",
    rating: 5,
  },
  {
    name: "Fatima Al-Rashid",
    role: "Founder",
    company: "StartupFlow",
    avatar: "FA",
    color: "hsl(250 100% 70%)",
    quote:
      "Ahmed built our MVP from scratch in 6 weeks — exactly what we needed to secure our seed funding. His technical judgment is excellent and he's the kind of engineer who thinks about the whole product, not just the code.",
    rating: 5,
  },
  {
    name: "David Park",
    role: "Lead Engineer",
    company: "CloudScale Systems",
    avatar: "DP",
    color: "hsl(30 100% 60%)",
    quote:
      "Ahmed is one of the most thorough engineers I've had the pleasure of working alongside. His approach to system design, testing, and documentation sets the standard for our entire team. Highly recommended.",
    rating: 5,
  },
];

export function Testimonials() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  useEffect(() => {
    const interval = setInterval(() => {
      setDirection(1);
      setCurrent((c) => (c + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const go = (dir: number) => {
    setDirection(dir);
    setCurrent((c) => (c + dir + testimonials.length) % testimonials.length);
  };

  const t = testimonials[current];

  return (
    <section id="testimonials" ref={ref} className="py-24 relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 50% 60% at 80% 40%, rgba(150,0,255,0.04) 0%, transparent 70%)" }}
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
            <span className="text-primary text-sm font-mono tracking-widest uppercase">Testimonials</span>
            <div className="h-px w-12 bg-primary" />
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-foreground mb-4">What They Say</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Feedback from clients and colleagues who've experienced the work firsthand.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative max-w-3xl mx-auto"
        >
          <div className="relative h-72 sm:h-64 overflow-hidden">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={current}
                custom={direction}
                initial={{ opacity: 0, x: direction * 60 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -direction * 60 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="absolute inset-0"
                data-testid={`testimonial-${current}`}
              >
                <div
                  className="glass-card rounded-2xl p-8 h-full flex flex-col justify-between"
                  style={{ border: `1px solid ${t.color}25` }}
                >
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} size={14} style={{ color: "hsl(30 100% 60%)", fill: "hsl(30 100% 60%)" }} />
                    ))}
                  </div>
                  <p className="text-foreground text-base leading-relaxed flex-1 italic">"{t.quote}"</p>
                  <div className="flex items-center gap-4 mt-6">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                      style={{ background: `linear-gradient(135deg, ${t.color}, ${t.color}99)` }}
                    >
                      {t.avatar}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground text-sm">{t.name}</p>
                      <p className="text-muted-foreground text-xs">{t.role} · {t.company}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex items-center justify-center gap-4 mt-6">
            <button
              onClick={() => go(-1)}
              className="p-2 rounded-full border border-border hover:border-primary text-muted-foreground hover:text-primary transition-all"
              data-testid="testimonial-prev"
            >
              <ChevronLeft size={18} />
            </button>
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i); }}
                  className="transition-all duration-300 rounded-full"
                  style={{
                    width: i === current ? 24 : 8,
                    height: 8,
                    background: i === current ? "hsl(210 100% 56%)" : "rgba(255,255,255,0.15)",
                  }}
                  data-testid={`testimonial-dot-${i}`}
                />
              ))}
            </div>
            <button
              onClick={() => go(1)}
              className="p-2 rounded-full border border-border hover:border-primary text-muted-foreground hover:text-primary transition-all"
              data-testid="testimonial-next"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
