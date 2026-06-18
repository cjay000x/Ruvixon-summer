import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Check, AlertCircle, Info, Sparkles, HelpCircle, Bell } from "lucide-react";
import { Toast as ToastType } from "../types";

interface ToastContainerProps {
  toasts: ToastType[];
  onDismiss: (id: string) => void;
}

export default function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  return (
    <div className="fixed bottom-6 right-6 z-100 flex flex-col gap-3.5 max-w-sm w-full pointer-events-none px-4 md:px-0">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
        ))}
      </AnimatePresence>
    </div>
  );
}

interface ToastItemProps {
  key?: string;
  toast: ToastType;
  onDismiss: (id: string) => void;
}

function ToastItem({ toast, onDismiss }: ToastItemProps) {
  const { id, title, message, type = "info", duration = 4000 } = toast;
  const [progress, setProgress] = useState(100);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    const intervalTime = 40;
    const step = (intervalTime / duration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          onDismiss(id);
          return 0;
        }
        return prev - step;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [id, duration, isPaused, onDismiss]);

  // Styling maps supporting the bespoke design architecture of Maison Ruvixon
  const typeStyles = {
    success: {
      bg: "bg-stone-950 border-stone-800",
      accent: "text-emerald-400 bg-emerald-500/10",
      icon: Check,
      tag: "Serigraph Registry Completed",
      line: "bg-emerald-400"
    },
    error: {
      bg: "bg-stone-950 border-stone-850",
      accent: "text-rose-400 bg-rose-500/10",
      icon: AlertCircle,
      tag: "Verification Discrepancy",
      line: "bg-rose-500"
    },
    warning: {
      bg: "bg-[#FAF9F6] border-amber-300/85",
      accent: "text-amber-700 bg-amber-500/10",
      icon: AlertCircle,
      tag: "Signature Authorization Requisite",
      line: "bg-amber-500"
    },
    ambient: {
      bg: "bg-stone-950 border-stone-800",
      accent: "text-amber-200 bg-amber-200/5",
      icon: Sparkles,
      tag: "Atelier Haute Coordination",
      line: "bg-amber-200"
    },
    info: {
      bg: "bg-[#FAF9F6] border-stone-200",
      accent: "text-stone-900 bg-stone-100",
      icon: Info,
      tag: "Maison Dispatch Bulletin",
      line: "bg-stone-950"
    }
  };

  const currentStyle = typeStyles[type] || typeStyles.info;
  const IconComponent = currentStyle.icon;
  const isDark = currentStyle.bg.includes("bg-stone-950");

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.22 } }}
      layout
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className={`pointer-events-auto w-full rounded-xl border p-4 shadow-[0_12px_40px_rgba(0,0,0,0.12)] relative overflow-hidden transition-all duration-300 ${currentStyle.bg} flex gap-3.5`}
    >
      {/* Icon Badge */}
      <div className={`p-2.5 rounded-lg shrink-0 h-fit ${currentStyle.accent}`}>
        <IconComponent className="w-4.5 h-4.5" />
      </div>

      {/* Content */}
      <div className="flex-1 space-y-1.5 text-left select-none pr-3 min-w-0">
        <div className="flex flex-col gap-0.5">
          <span className={`text-[8px] uppercase tracking-widest font-mono font-bold ${
            isDark ? "text-stone-400" : "text-stone-500"
          }`}>
            {currentStyle.tag}
          </span>
          {title && (
            <h5 className={`text-xs font-serif font-bold italic truncate ${
              isDark ? "text-stone-100" : "text-stone-950"
            }`}>
              {title}
            </h5>
          )}
        </div>
        <p className={`text-[11px] leading-relaxed font-sans ${
          isDark ? "text-stone-300" : "text-stone-600"
        }`}>
          {message}
        </p>
      </div>

      {/* Close button button */}
      <button
        onClick={() => onDismiss(id)}
        className={`shrink-0 p-1 rounded-full transition-all hover:bg-stone-500/10 h-fit cursor-pointer self-start ${
          isDark ? "text-stone-400 hover:text-stone-150" : "text-stone-400 hover:text-stone-950"
        }`}
      >
        <X className="w-3.5 h-3.5" />
      </button>

      {/* Fine-line edge indicator progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-stone-500/10">
        <motion.div 
          className={`h-full ${currentStyle.line}`} 
          style={{ width: `${progress}%` }} 
          transition={{ ease: "linear" }}
        />
      </div>
    </motion.div>
  );
}
