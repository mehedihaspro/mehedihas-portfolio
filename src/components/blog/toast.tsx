"use client";

import { useEffect, useState } from "react";
import { Check, X } from "lucide-react";

interface ToastProps {
  message: string;
  show: boolean;
  onHide: () => void;
  type?: "success" | "error";
}

export function Toast({ message, show, onHide, type = "success" }: ToastProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!show) return;

    // Defer visibility toggle to next frame so the slide-in animation runs.
    const enterRaf = requestAnimationFrame(() => setVisible(true));
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onHide, 300);
    }, 2000);

    return () => {
      cancelAnimationFrame(enterRaf);
      clearTimeout(timer);
    };
  }, [show, onHide]);

  if (!show) return null;

  return (
    <div
      className={`fixed bottom-9 left-1/2 -translate-x-1/2 z-[1200] flex items-center gap-2 px-5 py-2.5 rounded-full text-[13px] font-medium text-white font-inter transition-all duration-300 ${
        visible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
      } ${type === "success" ? "bg-text-primary" : "bg-error"}`}
      role="status"
    >
      {type === "success" ? (
        <Check size={14} strokeWidth={2.5} className="text-amber" />
      ) : (
        <X size={14} strokeWidth={2.5} />
      )}
      {message}
    </div>
  );
}
