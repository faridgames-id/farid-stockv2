import React, { ReactNode } from "react";
import { cn } from "../../lib/utils";
import "./glowing-shadow.css";

interface GlowingShadowProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function GlowingShadow({ children, className, style }: GlowingShadowProps) {
  return (
    <div className={cn("glow-container", className)} style={style} role="button">
      <span className="glow"></span>
      <div className="glow-content">{children}</div>
    </div>
  );
}
