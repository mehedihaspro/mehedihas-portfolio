interface DividerProps {
  variant?: "solid" | "decorative";
  className?: string;
}

export function Divider({ variant = "solid", className = "" }: DividerProps) {
  if (variant === "decorative") {
    return (
      <div className={`flex items-center gap-6 w-full ${className}`}>
        <div className="flex-1 h-px bg-border" />
        <span className="text-amber text-[16px] tracking-[12px] shrink-0 font-inter">
          ✻ ✻ ✻
        </span>
        <div className="flex-1 h-px bg-border" />
      </div>
    );
  }

  return <div className={`w-full h-px bg-border ${className}`} />;
}
