import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle2, AlertCircle } from "lucide-react";

import { cn } from "../../lib/utils";
import { Button } from "./button";

// Define the props for the AlertCard component
interface AlertCardProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  title: string;
  description: string;
  buttonText?: string;
  onButtonClick?: () => void;
  isVisible: boolean;
  onDismiss?: () => void;
  type?: 'success' | 'error' | 'info';
}

const AlertCard = React.forwardRef<HTMLDivElement, AlertCardProps>(
  ({
    className,
    icon,
    title,
    description,
    buttonText,
    onButtonClick,
    isVisible,
    onDismiss,
    type = 'success',
    ...props
  }, ref) => {
    
    // Animation variants for the card container
    const cardVariants = {
      hidden: { opacity: 0, y: -20, scale: 0.95 },
      visible: { 
        opacity: 1, 
        y: 0, 
        scale: 1,
        transition: { 
          type: "spring", 
          stiffness: 400, 
          damping: 25,
          staggerChildren: 0.1,
        }
      },
      exit: { 
        opacity: 0, 
        y: -20, 
        scale: 0.98,
        transition: { duration: 0.2 }
      }
    };

    // Animation variants for child elements for a staggered effect
    const itemVariants = {
      hidden: { opacity: 0, y: 10 },
      visible: { opacity: 1, y: 0 },
    };

    const defaultIcon = type === 'error' 
      ? <AlertCircle className="h-5 w-5" />
      : <CheckCircle2 className="h-5 w-5" />;

    return (
      <AnimatePresence>
        {isVisible && (
          <motion.div
            ref={ref}
            className={cn(
              "relative flex items-start gap-3 w-[320px] overflow-hidden rounded-xl p-4 pointer-events-auto",
              "bg-[#0f172a]/95 backdrop-blur-md border border-slate-700/50 shadow-[4px_4px_12px_rgba(0,0,0,0.5),-4px_-4px_12px_rgba(255,255,255,0.02),inset_1px_1px_2px_rgba(255,255,255,0.05)]",
              className
            )}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            role="alert"
            aria-live="assertive"
            {...props}
          >
            {/* Optional dismiss button */}
            {onDismiss && (
              <motion.div variants={itemVariants} className="absolute top-2 right-2 z-10">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                  onClick={onDismiss}
                >
                  <X className="h-3 w-3" />
                  <span className="sr-only">Dismiss</span>
                </Button>
              </motion.div>
            )}

            {/* Icon */}
            <motion.div
              variants={itemVariants}
              className={cn(
                "flex flex-shrink-0 h-12 w-12 items-center justify-center rounded-2xl backdrop-blur-xl mt-0.5 relative overflow-hidden",
                type === 'error' 
                  ? "bg-gradient-to-br from-red-500/40 to-red-900/10 text-red-100 border border-red-400/50 shadow-[0_0_20px_rgba(239,68,68,0.3),inset_0_1px_2px_rgba(255,255,255,0.4)]" 
                  : "bg-gradient-to-br from-blue-500/40 to-blue-900/10 text-blue-100 border border-blue-400/50 shadow-[0_0_20px_rgba(59,130,246,0.3),inset_0_1px_2px_rgba(255,255,255,0.4)]"
              )}
            >
                <motion.div
                  animate={{ scale: [1, 1.15, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  {icon || defaultIcon}
                </motion.div>
            </motion.div>

            {/* Text Content */}
            <div className="flex-1 pr-4 pt-0.5">
              <motion.h3 variants={itemVariants} className="text-[15px] font-bold tracking-tight text-white leading-none mb-1.5">
                {title}
              </motion.h3>
              <motion.p variants={itemVariants} className="text-[13px] text-slate-300 leading-snug">
                {description}
              </motion.p>
            </div>
            
            {/* Action Button (Optional for normal toasts) */}
            {buttonText && onButtonClick && (
              <motion.div variants={itemVariants} className="mt-5">
                <Button
                  className="w-full rounded-full bg-white py-5 text-sm font-bold text-blue-700 shadow-lg transition-transform duration-200 hover:bg-white/90 active:scale-95"
                  onClick={onButtonClick}
                >
                  {buttonText}
                </Button>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    );
  }
);
AlertCard.displayName = "AlertCard";

export { AlertCard };
