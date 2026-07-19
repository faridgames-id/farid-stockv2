import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

interface FormSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  className?: string;
  buttonClassName?: string;
}

const FormSelect: React.FC<FormSelectProps> = ({ 
  value, 
  onChange, 
  options, 
  placeholder = "-- Pilih --", 
  className = "",
  buttonClassName = "w-full flex items-center justify-between bg-slate-800 border border-slate-700 rounded-lg sm:rounded-xl px-3 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium cursor-pointer"
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // We don't need selectedLabel anymore because value directly represents the text in the input
  // unless value and label are different. In our case, they are mostly identical.
  // We'll just bind input to value.

  // Filter options based on current input value (basic autocomplete)
  const filteredOptions = options.filter(opt => opt.label.toLowerCase().includes((value || '').toLowerCase()));
  const displayOptions = filteredOptions.length > 0 ? filteredOptions : options;

  // Remove padding from the wrapper so it doesn't double-pad with the input
  const wrapperClass = buttonClassName
    .replace(/\b(px|py|p|sm:px|sm:py|sm:p)-[^\s]+\b/g, '')
    .replace('cursor-pointer', '')
    .trim();

  return (
    <div className={`relative ${className}`} ref={ref}>
      <div 
        className={`${wrapperClass} flex items-center justify-between p-0 overflow-hidden focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500`}
      >
        <input 
          type="text"
          value={value || ''}
          onChange={(e) => {
            onChange(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="w-full bg-transparent border-none outline-none focus:ring-0 text-white placeholder-slate-400 px-3 py-2 sm:px-4 sm:py-2.5"
        />
        <button 
          type="button" 
          onClick={() => setIsOpen(!isOpen)}
          className="pr-3 sm:pr-4 h-full flex items-center justify-center outline-none"
        >
          <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-300 shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -5, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -5, scale: 0.98 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute top-full mt-2 left-0 w-full bg-slate-900 border border-slate-700/80 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.7)] rounded-xl overflow-hidden z-[100] max-h-60 overflow-y-auto custom-scrollbar"
          >
            {displayOptions.map((opt) => (
              <button
                type="button"
                key={opt.value}
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-3 text-sm transition-colors ${value === opt.value ? 'bg-blue-600/20 text-blue-400 font-bold' : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'}`}
              >
                {opt.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FormSelect;
