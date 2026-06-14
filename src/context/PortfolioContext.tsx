import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { defaultPortfolioData, type PortfolioData } from "@/data/portfolioDefaults";

const STORAGE_KEY = "aw_portfolio_data";
const PASSWORD_KEY = "aw_admin_password";

function loadData(): PortfolioData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<PortfolioData>;
      const merged: PortfolioData = {
        ...defaultPortfolioData,
        ...parsed,
        contact: { ...defaultPortfolioData.contact, ...(parsed.contact ?? {}) },
        hero: { ...defaultPortfolioData.hero, ...(parsed.hero ?? {}) },
      };
      if (merged.hero?.orbitalTech) {
        merged.hero.orbitalTech = merged.hero.orbitalTech.map(
          (item: { label: string; color: string }) =>
            item.label === "Python" && item.color === "#3776AB"
              ? { ...item, color: "#4FC3F7" }
              : item
        );
      }
      return merged;
    }
  } catch {
    /* ignore */
  }
  return defaultPortfolioData;
}

function trySave(key: string, value: string): boolean {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

interface PortfolioContextType {
  data: PortfolioData;
  updateSection: <K extends keyof PortfolioData>(section: K, value: PortfolioData[K]) => boolean;
  resetSection: <K extends keyof PortfolioData>(section: K) => void;
  resetAll: () => void;
}

const PortfolioContext = createContext<PortfolioContextType | null>(null);

export function PortfolioProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<PortfolioData>(loadData);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        setData(loadData());
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const updateSection = <K extends keyof PortfolioData>(section: K, value: PortfolioData[K]): boolean => {
    let saved = false;
    setData((prev) => {
      const next = { ...prev, [section]: value };
      saved = trySave(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
    return saved;
  };

  const resetSection = <K extends keyof PortfolioData>(section: K) => {
    updateSection(section, defaultPortfolioData[section]);
  };

  const resetAll = () => {
    localStorage.removeItem(STORAGE_KEY);
    setData(defaultPortfolioData);
  };

  return (
    <PortfolioContext.Provider value={{ data, updateSection, resetSection, resetAll }}>
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  const ctx = useContext(PortfolioContext);
  if (!ctx) throw new Error("usePortfolio must be used within PortfolioProvider");
  return ctx;
}

export function getAdminPassword(): string {
  return localStorage.getItem(PASSWORD_KEY) || import.meta.env.VITE_ADMIN_PASSWORD || "2305245";
}

export function setAdminPassword(newPwd: string) {
  localStorage.setItem(PASSWORD_KEY, newPwd);
}

// ── Messages ──────────────────────────────────────────────────────────────────
export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  date: string;
  read: boolean;
}

const MESSAGES_KEY = "aw_messages";

export function saveMessage(msg: Omit<ContactMessage, "id" | "date" | "read">): boolean {
  try {
    const existing = loadMessages();
    const updated = [
      { ...msg, id: `msg-${Date.now()}`, date: new Date().toISOString(), read: false },
      ...existing,
    ];
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(updated));
    return true;
  } catch {
    return false;
  }
}

export function loadMessages(): ContactMessage[] {
  try {
    const raw = localStorage.getItem(MESSAGES_KEY);
    return raw ? (JSON.parse(raw) as ContactMessage[]) : [];
  } catch {
    return [];
  }
}

export function deleteMessage(id: string): void {
  try {
    const updated = loadMessages().filter((m) => m.id !== id);
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(updated));
  } catch { /* ignore */ }
}

export function markMessageRead(id: string): void {
  try {
    const updated = loadMessages().map((m) => (m.id === id ? { ...m, read: true } : m));
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(updated));
  } catch { /* ignore */ }
}
