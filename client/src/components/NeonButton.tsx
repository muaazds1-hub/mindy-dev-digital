import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export interface NeonButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "glass";
  size?: "default" | "lg" | "sm";
  href?: string;
  asChild?: boolean;
}

export const NeonButton = forwardRef<HTMLButtonElement, NeonButtonProps>(
  ({ className, variant = "primary", size = "default", children, ...props }, ref) => {
    
    const baseStyles = "inline-flex items-center justify-center rounded-full font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#20eca2] disabled:pointer-events-none disabled:opacity-50";
    
    const variants = {
      primary: "bg-[#20eca2] text-[#1f58f1] neon-glow hover:neon-glow-strong hover:-translate-y-1",
      outline: "border-2 border-[#20eca2] text-[#20eca2] hover:bg-[#20eca2]/10 hover:neon-glow",
      glass: "glass-card hover:bg-white/10 text-white border-white/20 hover:border-white/40",
    };
    
    const sizes = {
      default: "h-12 px-6 py-2 text-base",
      sm: "h-9 px-4 text-sm",
      lg: "h-14 px-8 text-lg md:text-xl",
    };

    const classes = cn(baseStyles, variants[variant], sizes[size], className);

    return (
      <motion.button
        ref={ref}
        className={classes}
        whileTap={{ scale: 0.95 }}
        {...props}
      >
        {children}
      </motion.button>
    );
  }
);
NeonButton.displayName = "NeonButton";
