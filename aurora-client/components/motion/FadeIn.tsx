"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { fadeInUp, transitionMedium } from "@/lib/motion/presets";
import { cn } from "@/lib/utils/cn";

type FadeInProps = HTMLMotionProps<"div"> & {
  delay?: number;
};

export function FadeIn({ children, className, delay = 0, ...props }: FadeInProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeInUp}
      transition={{ ...transitionMedium, delay }}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}
