import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Globe, Layers, Zap, Palette, Code2 } from "lucide-react";

const services = [
  {
    icon: Globe,
    title: "Web Development",
    description: "Crafting blazing-fast, SEO-optimized websites with modern frameworks. From landing pages to complex web platforms with exceptional user experiences.",
    features: ["React / Next.js", "Performance optimization", "SEO & accessibility", "Responsive design"],
    color: "hsl(210 100% 56%)",
  },
  {
    icon: Layers,
    title: "Full Stack Applications",
    description: "End-to-end application development with scalable backend architecture, real-time features, and seamless frontend integration.",
    features: ["API design", "Database architecture", "Authentication & security", "Cloud deployment"],
    color: "hsl(185 100% 50%)",
  },
  {
    icon: Zap,
    title: "API Development",
    description: "Building robust, well-documented RESTful and GraphQL APIs designed for performance, scalability, and developer experience.",
    features: ["REST & GraphQL", "Rate limiting & caching", "Swagger documentation", "Webhook integrations"],
    color: "hsl(250 100% 70%)",
  },
  {
    icon: Palette,
    title: "UI/UX Implementation",
    description: "Translating designs into pixel-perfect, interactive interfaces with smooth animations and micro-interactions that delight users.",
    features: ["Figma to code", "Animation & motion", "Design systems", "Accessibility (WCAG)"],
    color: "hsl(300 100% 70%)",
  },
  {
    icon: Code2,
    title: "Software Solutions",
    description: "Custom software development for complex business problems — from automation tools to enterprise systems and AI-powered applications.",
    features: ["System architecture", "AI integration", "Process automation", "Technical consulting"],
    color: "hsl(30 100% 60%)",
  },
];

export function Services() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="services" ref={ref} className="py-24 relative">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 60% 50% at 50% 70%, rgba(0,100,255,0.05) 0%, transparent 70%)" }}
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
            <span className="text-primary text-sm font-mono tracking-widest uppercase">Services</span>
            <div className="h-px w-12 bg-primary" />
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-foreground mb-4">What I Offer</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Comprehensive software development services tailored to your specific needs and goals.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, i) => {
            const Icon = service.icon;
            const isLast = i === services.length - 1 && services.length % 3 !== 0;
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -8, boxShadow: `0 0 40px ${service.color}20` }}
                className={`glass-card rounded-2xl p-6 transition-all duration-300 cursor-default ${isLast ? "sm:col-span-2 lg:col-span-1" : ""}`}
                data-testid={`service-${service.title.toLowerCase().replace(/\s+/g, "-")}`}
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
                  style={{
                    background: `${service.color}15`,
                    border: `1px solid ${service.color}30`,
                    boxShadow: `0 0 20px ${service.color}15`,
                  }}
                >
                  <Icon size={26} style={{ color: service.color }} />
                </div>

                <h3 className="text-lg font-bold text-foreground mb-3">{service.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-5">{service.description}</p>

                <ul className="space-y-2">
                  {service.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: service.color }} />
                      <span className="text-muted-foreground">{f}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
