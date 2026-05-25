import { motion } from "framer-motion";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost";
  fullWidth?: boolean;
  disabled?: boolean;
}

export function Button({
  children,
  onClick,
  variant = "primary",
  fullWidth = false,
  disabled = false,
}: ButtonProps) {
  const base =
    "font-semibold text-[16px] rounded-full px-6 py-4 transition-all active:scale-95 duration-150 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2";

  const variants = {
    primary: "bg-primary text-on-primary hover:bg-surface-tint shadow-md",
    secondary:
      "bg-surface-white border border-outline-variant text-primary hover:bg-surface-container-low",
    ghost: "bg-transparent text-primary",
  };

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      className={`${base} ${variants[variant]} ${fullWidth ? "w-full" : ""}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </motion.button>
  );
}
