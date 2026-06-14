import { Heart } from "lucide-react";

export function Footer() {
  return (
    <footer
      className="relative py-6 overflow-hidden"
      style={{
        background: "linear-gradient(180deg, transparent 0%, rgba(3,6,15,0.8) 100%)",
        borderTop: "1px solid rgba(0,150,255,0.1)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative flex justify-center">
        <p className="text-sm text-muted-foreground flex items-center gap-2">
          Built with
          <Heart size={14} className="text-red-400" />
          by Ahmed Wael · {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
}
