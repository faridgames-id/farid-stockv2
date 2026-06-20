import React from 'react';
import { motion } from 'framer-motion';

// Loading spinner component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-64">
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"
    />
  </div>
);

// Lazy loader wrapper component
const LazyLoader = ({ children }: { children: React.ReactNode }) => {
  return (
    <React.Suspense fallback={<LoadingSpinner />}>
      {children}
    </React.Suspense>
  );
};

export default LazyLoader;