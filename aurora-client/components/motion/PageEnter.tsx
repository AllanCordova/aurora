"use client";

import { motion } from "framer-motion";
import { fadeInUp, transitionMedium } from "@/lib/motion/presets";
import { cn } from "@/lib/utils/cn";

type PageEnterProps = {
  children: React.ReactNode;
  className?: string;
};

export function PageEnter({ children, className }: PageEnterProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeInUp}
      transition={transitionMedium}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}
