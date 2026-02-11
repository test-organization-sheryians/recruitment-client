"use client";

import { useEffect, useMemo, useState } from "react";
import { Sparkles } from "lucide-react";
import { loadFull } from "tsparticles";
import type { ISourceOptions } from "@tsparticles/engine";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { cn } from "@/lib/utils";

interface SparkleButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

const baseOptions: ISourceOptions = {
  particles: {
    number: { value: 15, density: { enable: false } },
    color: {
      value: ["#60a5fa", "#a78bfa", "#38bdf8", "#ffffff"],
    },
    shape: {
      type: "star",
    },
    size: {
      value: { min: 1, max: 3 },
    },
    opacity: { value: 0.9 },
    move: {
      enable: true,
      speed: 1,
      outModes: { default: "destroy" },
    },
  },
  emitters: {
    position: { x: 50, y: 50 },
    rate: { quantity: 3, delay: 0.4 },
  },
  fullScreen: { enable: false },
  background: { color: "transparent" },
  detectRetina: true,
};

export default function SparkleButton({
  children,
  onClick,
  className,
}: SparkleButtonProps) {
  const [ready, setReady] = useState(false);
  const [hover, setHover] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadFull(engine);
    }).then(() => setReady(true));
  }, []);

  const options = useMemo(() => {
    return {
      ...baseOptions,
      autoPlay: hover,
    };
  }, [hover]);

  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={cn(
        "relative overflow-hidden rounded-xl px-4 py-2 text-xs font-semibold transition-all duration-300",
        "bg-gradient-to-r from-blue-500 to-purple-500 text-white",
        "hover:scale-105 active:scale-95 shadow-md",
        className
      )}
    >
      <div className="relative z-10 flex items-center gap-2">
        <Sparkles className="h-4 w-4 animate-pulse" />
        {children}
      </div>

      {ready && (
        <Particles
          className="pointer-events-none absolute inset-0 z-0 opacity-0 transition-opacity group-hover:opacity-100"
          options={options}
        />
      )}
    </button>
  );
}