"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { fadeInUp, staggerContainer, transitionMedium } from "@/lib/motion/presets";
import { cn } from "@/lib/utils/cn";

type StaggerListProps = HTMLMotionProps<"div">;

export function StaggerList({ children, className, ...props }: StaggerListProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}

type StaggerItemProps = HTMLMotionProps<"div">;

export function StaggerItem({ children, className, ...props }: StaggerItemProps) {
  return (
    <motion.div
      variants={fadeInUp}
      transition={transitionMedium}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}
