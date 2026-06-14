import { motion, AnimatePresence } from "framer-motion";

interface LoadingScreenProps {
  isLoading: boolean;
}

const ORBIT_COLORS = ["#61DAFB", "#FF7043", "#A78BFA"];
const ORBIT_ANGLES = [0, 120, 240];
const ORBIT_R = 68;
const ORBIT_CENTER = 74;
const CONTAINER_HALF = 74;

export function LoadingScreen({ isLoading }: LoadingScreenProps) {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="loading"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
          style={{ background: "hsl(213 100% 4%)" }}
          data-testid="loading-screen"
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, ease: "backOut" }}
            className="relative mb-8"
          >
            {/* Orbiting colored dots — same idea as Hero orbital badges */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
              className="absolute pointer-events-none"
              style={{ inset: `-${CONTAINER_HALF - 48}px` }}
            >
              {ORBIT_ANGLES.map((angle, i) => {
                const rad = ((angle - 90) * Math.PI) / 180;
                const cx = ORBIT_CENTER + ORBIT_R * Math.cos(rad);
                const cy = ORBIT_CENTER + ORBIT_R * Math.sin(rad);
                return (
                  <div
                    key={i}
                    className="absolute w-2.5 h-2.5 rounded-full"
                    style={{
                      left: `${cx - 5}px`,
                      top: `${cy - 5}px`,
                      background: ORBIT_COLORS[i],
                      boxShadow: `0 0 10px ${ORBIT_COLORS[i]}, 0 0 22px ${ORBIT_COLORS[i]}70`,
                    }}
                  />
                );
              })}
            </motion.div>

            {/* Outer CW spinning gradient border */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
              className="absolute rounded-2xl"
              style={{
                inset: "-10px",
                background:
                  "linear-gradient(hsl(213 100% 4%), hsl(213 100% 4%)) padding-box, " +
                  "linear-gradient(135deg, hsl(210 100% 60%), hsl(185 100% 50%), transparent, hsl(270 80% 60%)) border-box",
                border: "2px solid transparent",
              }}
            />

            {/* Inner CCW counter-spinning border */}
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }}
              className="absolute rounded-xl"
              style={{
                inset: "-4px",
                background:
                  "linear-gradient(hsl(213 100% 4%), hsl(213 100% 4%)) padding-box, " +
                  "linear-gradient(45deg, hsl(185 100% 55%), transparent, hsl(210 100% 55%)) border-box",
                border: "1px solid transparent",
              }}
            />

            {/* AW center block */}
            <div
              className="w-24 h-24 rounded-2xl flex items-center justify-center text-4xl font-black text-white relative"
              style={{
                background:
                  "linear-gradient(135deg, hsl(210 100% 46%), hsl(185 100% 40%))",
                boxShadow:
                  "0 0 40px rgba(0,150,255,0.5), 0 0 80px rgba(0,150,255,0.2)",
              }}
            >
              <motion.span
                animate={{ opacity: [1, 0.72, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                AW
              </motion.span>
            </div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-muted-foreground text-sm tracking-widest uppercase mb-6"
          >
            Loading Portfolio
          </motion.p>

          <div
            className="w-48 h-0.5 rounded-full overflow-hidden"
            style={{ background: "rgba(255,255,255,0.08)" }}
          >
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 1.8, ease: "easeInOut" }}
              className="h-full"
              style={{
                background:
                  "linear-gradient(90deg, hsl(210 100% 56%), hsl(185 100% 50%), hsl(270 80% 65%))",
              }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
