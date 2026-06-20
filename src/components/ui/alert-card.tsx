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

    // Determine gradient based on type
    const bgClass = type === 'error' 
      ? "bg-gradient-to-br from-red-500 to-rose-600 text-white" 
      : "bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-400 text-white"; // User requested blue gradient

    const defaultIcon = type === 'error' 
      ? <AlertCircle className="h-6 w-6 text-white" />
      : <CheckCircle2 className="h-6 w-6 text-white" />;

    return (
      <AnimatePresence>
        {isVisible && (
          <motion.div
            ref={ref}
            className={cn(
              "relative w-full max-w-sm overflow-hidden rounded-2xl p-6 shadow-2xl pointer-events-auto",
              bgClass,
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
                  className="h-7 w-7 rounded-full hover:bg-white/20 text-white transition-colors"
                  onClick={onDismiss}
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Dismiss</span>
                </Button>
              </motion.div>
            )}

            <div className="flex items-center justify-between gap-4 relative z-10 pt-1">
              {/* Text Content */}
              <div className="flex-1 pr-2">
                <motion.h3 variants={itemVariants} className="text-xl font-bold tracking-tight font-['Outfit']">
                  {title}
                </motion.h3>
                <motion.p variants={itemVariants} className="mt-1 text-sm text-white/90 leading-relaxed">
                  {description}
                </motion.p>
              </div>

              {/* Icon with a subtle pulse animation */}
              <motion.div
                variants={itemVariants}
                className="flex flex-shrink-0 h-12 w-12 items-center justify-center rounded-full bg-white/20 shadow-inner mr-2 mt-1"
              >
                  <motion.div
                    animate={{ scale: [1, 1.15, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  >
                    {icon || defaultIcon}
                  </motion.div>
              </motion.div>
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
