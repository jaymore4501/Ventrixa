"use client";

import React from "react";
import { motion } from "framer-motion";

interface GradualBlurProps {
  text?: string;
  children?: React.ReactNode;
  duration?: number;
  delay?: number;
  className?: string;
}

export default function GradualBlur({
  text,
  children,
  duration = 0.8,
  delay = 0,
  className = "",
}: GradualBlurProps) {
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.05,
        delayChildren: delay,
      },
    },
  };

  const itemVariants = {
    hidden: { filter: "blur(10px)", opacity: 0 },
    visible: {
      filter: "blur(0px)",
      opacity: 1,
      transition: { duration },
    },
  };

  if (text) {
    const words = text.split(" ");
    return (
      <motion.span
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className={`inline-block ${className}`}
      >
        {words.map((word, index) => (
          <motion.span
            key={index}
            variants={itemVariants}
            className="inline-block mr-1.5"
          >
            {word}
          </motion.span>
        ))}
      </motion.span>
    );
  }

  return (
    <motion.div
      initial={{ filter: "blur(12px)", opacity: 0 }}
      animate={{ filter: "blur(0px)", opacity: 1 }}
      transition={{ duration, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
