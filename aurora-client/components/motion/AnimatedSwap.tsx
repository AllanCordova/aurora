"use client";

import { AnimatePresence, motion } from "framer-motion";
import { slideFromRight, transitionFast } from "@/lib/motion/presets";

type AnimatedSwapProps = {
  swapKey: string;
  children: React.ReactNode;
  className?: string;
};

export function AnimatedSwap({ swapKey, children, className }: AnimatedSwapProps) {
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={swapKey}
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={slideFromRight}
        transition={transitionFast}
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
