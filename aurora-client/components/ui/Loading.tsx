"use client";

import { motion } from "framer-motion";
import { fadeIn, transitionMedium } from "@/lib/motion/presets";
import { cn } from "@/lib/utils/cn";

type LoadingProps = {
  label?: string;
  fullScreen?: boolean;
  className?: string;
};

export function Loading({
  label = "Loading...",
  fullScreen = false,
  className,
}: LoadingProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      transition={transitionMedium}
      className={cn(
        "flex items-center justify-center text-sm text-muted-foreground",
        fullScreen && "min-h-screen",
        className,
      )}
    >
      <div className="flex items-center gap-3">
        <motion.span
          animate={{ rotate: 360 }}
          transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
          className="h-4 w-4 rounded-app border-2 border-border border-t-primary"
        />
        <motion.span
          animate={{ opacity: [0.55, 1, 0.55] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
        >
          {label}
        </motion.span>
      </div>
    </motion.div>
  );
}
