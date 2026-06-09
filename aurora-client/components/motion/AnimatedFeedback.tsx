"use client";

import { AnimatePresence, motion } from "framer-motion";
import { fadeIn, transitionFast } from "@/lib/motion/presets";

type AnimatedFeedbackProps = {
  show: boolean;
  children: React.ReactNode;
  className?: string;
};

export function AnimatedFeedback({ show, children, className }: AnimatedFeedbackProps) {
  return (
    <AnimatePresence initial={false}>
      {show && (
        <motion.div
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={fadeIn}
          transition={transitionFast}
          className={className}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
