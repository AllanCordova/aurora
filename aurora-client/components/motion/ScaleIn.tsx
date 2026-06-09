"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { scaleIn, transitionMedium } from "@/lib/motion/presets";
import { cn } from "@/lib/utils/cn";

type ScaleInProps = HTMLMotionProps<"div"> & {
  delay?: number;
};

export function ScaleIn({ children, className, delay = 0, ...props }: ScaleInProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={scaleIn}
      transition={{ ...transitionMedium, delay }}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}
