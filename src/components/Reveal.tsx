"use client";
import { useEffect, useRef, useState, ReactNode, ElementType } from "react";

type Props = {
  children: ReactNode;
  delay?: number;
  as?: ElementType;
  className?: string;
  y?: number;
  once?: boolean;
  [key: string]: unknown;
};

const DURATION = 700;

export default function Reveal({
  children,
  delay = 0,
  as: Tag = "div",
  className = "",
  y = 24,
  once = true,
  ...rest
}: Props) {
  const ref = useRef<HTMLElement | null>(null);
  const [shown, setShown] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setShown(true);
      setDone(true);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShown(true);
            if (once) io.disconnect();
          } else if (!once) {
            setShown(false);
            setDone(false);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    io.observe(node);
    return () => io.disconnect();
  }, [once]);

  useEffect(() => {
    if (!shown) return;
    const t = setTimeout(() => setDone(true), DURATION + delay + 50);
    return () => clearTimeout(t);
  }, [shown, delay]);

  const style: React.CSSProperties = done
    ? {}
    : {
        opacity: shown ? 1 : 0,
        transform: shown ? "translateY(0)" : `translateY(${y}px)`,
        transition: `opacity ${DURATION}ms cubic-bezier(.22,.61,.36,1) ${delay}ms, transform ${DURATION}ms cubic-bezier(.22,.61,.36,1) ${delay}ms`,
        willChange: "opacity, transform",
      };

  return (
    <Tag
      ref={ref as React.Ref<HTMLElement>}
      className={className}
      style={style}
      {...rest}
    >
      {children}
    </Tag>
  );
}
