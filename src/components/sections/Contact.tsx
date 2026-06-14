import { useRef } from "react";
import type * as React from "react";
import { motion, useInView } from "framer-motion";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Phone, MapPin, Github, Linkedin, Send, Instagram, Facebook } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { usePortfolio, saveMessage } from "@/context/PortfolioContext";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(20, "Message must be at least 20 characters"),
});

type FormValues = z.infer<typeof schema>;

export function Contact() {
  const { data } = usePortfolio();
  const { contact } = data;
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const { toast } = useToast();

  const contacts = [
    { icon: Mail, label: "Email", value: contact.email, color: "hsl(210 100% 60%)", href: `mailto:${contact.email}` },
    { icon: Phone, label: "Phone", value: contact.phone, color: "hsl(185 100% 55%)", href: `tel:${contact.phone.replace(/\s/g, "")}` },
    { icon: MapPin, label: "Location", value: contact.location, color: "hsl(220 100% 65%)", href: "#" },
  ];

  const socials: Array<{
    icon: React.ComponentType<{ size?: number }>;
    href: string;
    label: string;
    color: string;
    gradientBg?: string;
  }> = [
    { icon: Github, href: contact.githubUrl, label: "GitHub", color: "hsl(0 0% 85%)" },
    { icon: Linkedin, href: contact.linkedinUrl, label: "LinkedIn", color: "#0077B5" },
    ...(contact.instagramUrl ? [{
      icon: Instagram,
      href: contact.instagramUrl,
      label: "Instagram",
      color: "#ffffff",
      gradientBg: "linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)",
    }] : []),
    ...(contact.facebookUrl ? [{ icon: Facebook, href: contact.facebookUrl, label: "Facebook", color: "#4267B2" }] : []),
  ];

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (formData: FormValues) => {
    await new Promise((r) => setTimeout(r, 800));
    const ok = saveMessage(formData);
    if (ok) {
      toast({
        title: "Message sent! 🚀",
        description: "Thanks for reaching out, Ahmed will get back to you soon.",
      });
      reset();
    } else {
      toast({
        title: "Failed to send message",
        description: "Storage is full. Please try again later.",
        variant: "destructive",
      });
    }
  };

  return (
    <section id="contact" ref={ref} className="py-24 relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 60% 50% at 20% 50%, rgba(0,100,255,0.06) 0%, transparent 65%),
            radial-gradient(ellipse 50% 50% at 80% 50%, rgba(0,200,255,0.05) 0%, transparent 60%)
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
            <span className="text-primary text-sm font-mono tracking-widest uppercase">Contact</span>
            <div className="h-px w-16" style={{ background: "linear-gradient(90deg, hsl(185 100% 50%), transparent)" }} />
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-foreground mb-4">Get In Touch</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Have a project in mind or want to collaborate? Feel free to reach out!
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="space-y-6"
          >
            <div
              className="rounded-2xl p-8 relative overflow-hidden"
              style={{
                background: "linear-gradient(135deg, rgba(0,100,255,0.07), rgba(3,6,15,0.8))",
                border: "1px solid rgba(0,150,255,0.2)",
              }}
            >
              <div
                className="absolute top-0 left-0 right-0 h-px"
                style={{ background: "linear-gradient(90deg, transparent, rgba(0,150,255,0.5), transparent)" }}
              />
              <h3 className="text-xl font-bold text-foreground mb-6">Contact Info</h3>
              <div className="space-y-4">
                {contacts.map(({ icon: Icon, label, value, color, href }) => (
                  <a
                    key={label}
                    href={href}
                    className="flex items-center gap-4 p-4 rounded-xl transition-all duration-200 group hover:scale-[1.01]"
                    style={{ background: `${color}08`, border: `1px solid ${color}20` }}
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: `${color}15`, border: `1px solid ${color}30` }}
                    >
                      <Icon size={18} style={{ color }} />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
                      <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{value}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            <div
              className="rounded-2xl p-6 relative overflow-hidden"
              style={{
                background: "linear-gradient(135deg, rgba(0,200,255,0.06), rgba(3,6,15,0.8))",
                border: "1px solid rgba(0,200,255,0.15)",
              }}
            >
              <div
                className="absolute top-0 left-0 right-0 h-px"
                style={{ background: "linear-gradient(90deg, transparent, rgba(0,200,255,0.4), transparent)" }}
              />
              <h3 className="text-base font-bold text-foreground mb-4">Find Me Online</h3>
              <div className="flex flex-wrap gap-3">
                {socials.map(({ icon: Icon, href, label, color, gradientBg }) => (
                  <motion.a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, y: -3 }}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
                    style={gradientBg ? {
                      background: gradientBg,
                      border: "none",
                      color,
                    } : {
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      color,
                    }}
                    data-testid={`social-${label.toLowerCase()}`}
                  >
                    <Icon size={16} />
                    {label}
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
          >
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="rounded-2xl p-8 space-y-5 relative overflow-hidden"
              style={{
                background: "linear-gradient(135deg, rgba(0,100,255,0.06), rgba(3,6,15,0.85))",
                border: "1px solid rgba(0,150,255,0.18)",
              }}
              data-testid="contact-form"
            >
              <div
                className="absolute top-0 left-0 right-0 h-px"
                style={{ background: "linear-gradient(90deg, transparent, rgba(0,150,255,0.5), transparent)" }}
              />
              <h3 className="text-xl font-bold text-foreground mb-2">Send a Message</h3>

              {[
                { id: "name", label: "Your Name", type: "text", placeholder: "Ahmed Wael" },
                { id: "email", label: "Email Address", type: "email", placeholder: "you@example.com" },
                { id: "subject", label: "Subject", type: "text", placeholder: "Project collaboration..." },
              ].map(({ id, label, type, placeholder }) => (
                <div key={id}>
                  <label className="block text-sm font-medium text-foreground mb-1.5">{label}</label>
                  <input
                    type={type}
                    placeholder={placeholder}
                    {...register(id as keyof FormValues)}
                    className="w-full px-4 py-3 rounded-xl text-sm text-foreground placeholder:text-muted-foreground outline-none transition-all focus:ring-1 ring-primary"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)" }}
                    data-testid={`contact-${id}`}
                  />
                  {errors[id as keyof FormValues] && (
                    <p className="text-xs text-red-400 mt-1">{errors[id as keyof FormValues]?.message}</p>
                  )}
                </div>
              ))}

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Message</label>
                <textarea
                  rows={4}
                  placeholder="Tell me about your project or idea..."
                  {...register("message")}
                  className="w-full px-4 py-3 rounded-xl text-sm text-foreground placeholder:text-muted-foreground outline-none transition-all resize-none focus:ring-1 ring-primary"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)" }}
                  data-testid="contact-message"
                />
                {errors.message && (
                  <p className="text-xs text-red-400 mt-1">{errors.message.message}</p>
                )}
              </div>

              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: 1.02, boxShadow: "0 0 30px rgba(0,150,255,0.4)" }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-white transition-all disabled:opacity-60"
                style={{ background: "linear-gradient(135deg, hsl(210 100% 56%), hsl(185 100% 50%))" }}
                data-testid="contact-submit"
              >
                <Send size={16} />
                {isSubmitting ? "Sending..." : "Send Message"}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>

      <Toaster />
    </section>
  );
}
