import type { Transition, Variants } from "framer-motion";

export const easeSmooth: Transition["ease"] = [0.22, 1, 0.36, 1];

export const transitionFast: Transition = {
  duration: 0.28,
  ease: easeSmooth,
};

export const transitionMedium: Transition = {
  duration: 0.42,
  ease: easeSmooth,
};

export const springSnappy: Transition = {
  type: "spring",
  stiffness: 320,
  damping: 28,
};

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0 },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.97 },
  visible: { opacity: 1, scale: 1 },
};

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.04,
    },
  },
};

export const slideFromRight: Variants = {
  hidden: { opacity: 0, x: 16 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -12 },
};
