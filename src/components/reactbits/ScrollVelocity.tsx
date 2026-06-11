"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useMotionValue,
  useVelocity,
  useAnimationFrame,
} from "framer-motion";
// Local wrap implementation to remove @motionone/utils dependency
const wrap = (min: number, max: number, v: number) => {
  const range = max - min;
  return ((((v - min) % range) + range) % range) + min;
};

interface ScrollVelocityProps {
  texts: string[];
  baseVelocity?: number;
  className?: string;
}

interface ParqueeProps {
  text: string;
  baseVelocity: number;
}

function ParqueeItem({ text, baseVelocity = 100 }: ParqueeProps) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400,
  });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], {
    clamp: false,
  });

  const x = useTransform(baseX, (v) => `${wrap(-20, -45, v)}%`);

  const directionFactor = useRef<number>(1);
  useAnimationFrame((t, delta) => {
    let moveBy = directionFactor.current * baseVelocity * (delta / 1000);

    if (velocityFactor.get() < 0) {
      directionFactor.current = -1;
    } else if (velocityFactor.get() > 0) {
      directionFactor.current = 1;
    }

    moveBy += directionFactor.current * velocityFactor.get() * 2;

    baseX.set(baseX.get() + moveBy);
  });

  return (
    <div className="flex flex-nowrap overflow-hidden whitespace-nowrap py-4">
      <motion.div
        className="flex whitespace-nowrap text-4xl md:text-6xl font-bold uppercase tracking-wider text-muted/30"
        style={{ x }}
      >
        <span className="mr-8">{text} </span>
        <span className="mr-8">{text} </span>
        <span className="mr-8">{text} </span>
        <span className="mr-8">{text} </span>
        <span className="mr-8">{text} </span>
        <span className="mr-8">{text} </span>
        <span className="mr-8">{text} </span>
        <span className="mr-8">{text} </span>
      </motion.div>
    </div>
  );
}

export default function ScrollVelocity({
  texts,
  baseVelocity = 5,
  className = "",
}: ScrollVelocityProps) {
  return (
    <section className={`w-full overflow-hidden ${className}`}>
      {texts.map((text, i) => (
        <ParqueeItem
          key={i}
          text={text}
          baseVelocity={baseVelocity * (i % 2 === 0 ? 1 : -1)}
        />
      ))}
    </section>
  );
}
