import React, { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

interface ParallaxCardProps {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
  glassEffect?: boolean;
}

export function ParallaxCard({ children, className, intensity = 4, glassEffect = true }: ParallaxCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [cursorPos, setCursorPos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 40, mass: 0.25 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 40, mass: 0.25 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], [`${intensity}deg`, `-${intensity}deg`]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], [`-${intensity}deg`, `${intensity}deg`]);

  // Shine position follows the tilt
  const shineX = useTransform(mouseXSpring, [-0.5, 0.5], ["20%", "80%"]);
  const shineY = useTransform(mouseYSpring, [-0.5, 0.5], ["20%", "80%"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(nx);
    y.set(ny);
    setCursorPos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  const handleMouseEnter = () => setIsHovered(true);

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

  return (
    <div style={{ perspective: "1200px" }} className={className}>
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
          willChange: "transform",
        }}
        className="h-full w-full transform-gpu relative"
      >
        {/* Inner lift layer */}
        <div
          style={{ transform: "translateZ(20px)", transformStyle: "preserve-3d" }}
          className="h-full relative"
        >
          {/* ── Glass effects sit BEHIND content so they never block clicks ── */}
          {glassEffect && (
            <>
              {/* Moving radial glass glow that follows the cursor */}
              <div
                aria-hidden
                className="pointer-events-none absolute rounded-full"
                style={{
                  width: "300px",
                  height: "300px",
                  background: "radial-gradient(circle, rgba(147,197,253,0.12) 0%, rgba(99,102,241,0.07) 40%, transparent 70%)",
                  left: `${cursorPos.x}%`,
                  top: `${cursorPos.y}%`,
                  transform: "translate(-50%, -50%)",
                  opacity: isHovered ? 1 : 0,
                  transition: "left 0.05s linear, top 0.05s linear, opacity 0.3s ease",
                  filter: "blur(2px)",
                  zIndex: 0,
                }}
              />

              {/* Gloss sheen overlay */}
              <motion.div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{
                  background: `radial-gradient(ellipse at ${shineX} ${shineY}, rgba(255,255,255,0.04) 0%, transparent 65%)`,
                  opacity: isHovered ? 1 : 0,
                  transition: "opacity 0.4s ease",
                  borderRadius: "inherit",
                  zIndex: 0,
                }}
              />

              {/* Top-edge glass rim highlight */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-0 h-px"
                style={{
                  background: "linear-gradient(90deg, transparent, rgba(147,197,253,0.3), rgba(99,102,241,0.25), transparent)",
                  opacity: isHovered ? 1 : 0.35,
                  transition: "opacity 0.3s ease",
                  borderRadius: "inherit",
                  zIndex: 0,
                }}
              />

              {/* Left-edge subtle rim */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-y-0 left-0 w-px"
                style={{
                  background: "linear-gradient(180deg, transparent, rgba(147,197,253,0.18), transparent)",
                  opacity: isHovered ? 0.8 : 0.25,
                  transition: "opacity 0.3s ease",
                  zIndex: 0,
                }}
              />
            </>
          )}

          {/* Content sits on top with its own stacking context — always clickable */}
          <div className="relative" style={{ zIndex: 1 }}>
            {children}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
