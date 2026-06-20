import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';

export const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0, 
    transition: { type: 'spring', stiffness: 260, damping: 20 } 
  }
};

interface PageMotionWrapperProps {
  children: ReactNode;
  className?: string;
}

const PageMotionWrapper: React.FC<PageMotionWrapperProps> = ({ children, className = '' }) => {
  return (
    <motion.div
      variants={{ 
        hidden: { opacity: 0 }, 
        show: { opacity: 1, transition: { staggerChildren: 0.1 } } 
      }}
      initial="hidden"
      animate="show"
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default PageMotionWrapper;
