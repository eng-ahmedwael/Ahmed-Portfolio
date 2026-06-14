import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { usePortfolio } from "@/context/PortfolioContext";

const navLinks = [
  { label: "About", href: "#about" },
  { label: "Education", href: "#education" },
  { label: "Skills", href: "#skills" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Courses", href: "#courses" },
  { label: "Contact", href: "#contact" },
];

const allSections = ["home", "about", "education", "skills", "experience", "projects", "courses", "volunteer", "contact"];

export function Navbar() {
  const { data } = usePortfolio();
  const profileImage = data.hero.profileImage;
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
      for (const id of [...allSections].reverse()) {
        const el = document.getElementById(id);
        if (el && window.scrollY >= el.offsetTop - 100) {
          setActiveSection(id);
          break;
        }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
    setMobileOpen(false);
  };

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? "rgba(3, 6, 15, 0.88)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(0,150,255,0.1)" : "none",
        boxShadow: scrolled ? "0 4px 30px rgba(0,100,255,0.06)" : "none",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={() => scrollTo("#home")}
            className="flex items-center gap-2.5"
            data-testid="nav-logo"
          >
            {profileImage ? (
              <img
                src={profileImage}
                alt="Profile"
                className="w-9 h-9 rounded-lg object-cover"
                style={{ boxShadow: "0 0 15px rgba(0,150,255,0.4)" }}
              />
            ) : (
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center text-sm font-black text-white"
                style={{
                  background: "linear-gradient(135deg, hsl(210 100% 56%), hsl(185 100% 50%))",
                  boxShadow: "0 0 15px rgba(0,150,255,0.4)",
                }}
              >
                AW
              </div>
            )}
            <div className="hidden sm:block">
              <p className="text-foreground font-bold text-sm leading-none">Ahmed Wael</p>
              <p className="text-muted-foreground text-xs leading-none mt-0.5">Data Science & AI</p>
            </div>
          </motion.button>

          <div className="hidden lg:flex items-center gap-0.5">
            {navLinks.map((link) => {
              const isActive = activeSection === link.href.replace("#", "");
              return (
                <motion.button
                  key={link.href}
                  whileHover={{ scale: 1.04 }}
                  onClick={() => scrollTo(link.href)}
                  className={`relative px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                    isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                  }`}
                  data-testid={`nav-link-${link.label.toLowerCase()}`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute inset-0 rounded-lg"
                      style={{
                        background: "rgba(0,150,255,0.1)",
                        border: "1px solid rgba(0,150,255,0.2)",
                      }}
                      transition={{ type: "spring", duration: 0.4 }}
                    />
                  )}
                  <span className="relative">{link.label}</span>
                </motion.button>
              );
            })}
            <motion.a
              whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(0,150,255,0.4)" }}
              whileTap={{ scale: 0.95 }}
              href="mailto:aw7065051@gmail.com"
              className="ml-2 px-4 py-2 rounded-lg text-xs font-semibold text-white transition-all"
              style={{
                background: "linear-gradient(135deg, hsl(210 100% 56%), hsl(185 100% 50%))",
                boxShadow: "0 0 12px rgba(0,150,255,0.25)",
              }}
              data-testid="nav-hire-me"
            >
              Hire Me
            </motion.a>
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground"
            data-testid="nav-mobile-toggle"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden overflow-hidden"
            style={{
              background: "rgba(3, 6, 15, 0.97)",
              backdropFilter: "blur(20px)",
              borderBottom: "1px solid rgba(0,150,255,0.1)",
            }}
          >
            <div className="px-4 py-4 flex flex-col gap-1">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => scrollTo(link.href)}
                  className="text-left px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground rounded-lg hover:bg-white/5 transition-colors"
                  data-testid={`mobile-nav-${link.label.toLowerCase()}`}
                >
                  {link.label}
                </button>
              ))}
              <a
                href="mailto:aw7065051@gmail.com"
                className="mt-2 text-center px-4 py-2.5 rounded-lg text-sm font-semibold text-white"
                style={{ background: "linear-gradient(135deg, hsl(210 100% 56%), hsl(185 100% 50%))" }}
              >
                Hire Me
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
