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
    "font-semibold text-[15px] rounded-[10px] px-6 py-3.5 transition-colors active:scale-[0.97] disabled:opacity-50 disabled:pointer-events-none";

  const variants = {
    primary: "bg-zepto-purple text-white active:bg-zepto-purple-dark",
    secondary:
      "bg-zepto-purple-light text-zepto-purple active:bg-purple-200",
    ghost: "bg-transparent text-zepto-purple",
  };

  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      className={`${base} ${variants[variant]} ${fullWidth ? "w-full" : ""}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </motion.button>
  );
}
