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
    number: { 
        value : 0,
    },
    color: {
      value: ["#60a5fa", "#a78bfa", "#38bdf8", "#c084fc", "#ffffff", "#0ea5e9"],
    },
    shape: {
      type: "star",
    },
    size: {
      value: { min: 1.5, max: 2.5 },
    },
    opacity: { value: 0.9 },
    rotate: {
  animation: {
    enable: true,
    speed: 6,
  },
},
    move: {
  enable: true,
  speed: { min: 0.3, max: 1 },
  direction: "none",
  outModes: { default: "destroy" },
},
  },
  emitters: [
    {
      position: { x: 50, y: 50 },
      rate: {
        quantity: 3,
        delay: 0.5,
      },
      size: {
        width: 60,
        height: 60,
      },
    },
  ],
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
    <div className="relative w-fit">
      {ready && (
        <div className="absolute inset-0 z-0 overflow-hidden" style={{ inset: "-12px" }}>
          <Particles
            className={cn(
              "pointer-events-none absolute inset-0 transition-opacity",
              hover ? "opacity-100" : "opacity-0"
            )}
            options={options}
          />
        </div>
      )}
      <button
        type="button"
        onClick={onClick}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        className={cn(
          "group relative z-10 overflow-visible rounded-xl px-4 py-2 text-md font-semibold transition-all duration-300",
          "bg-gradient-to-r from-blue-500 to-purple-500 text-white",
          "hover:scale-105 active:scale-95",
          className
        )}
      >
        <div className="relative z-90 flex items-center gap-1">
          <Sparkles className="h-4 w-4 animate-pulse" />
          {children}
        </div>
      </button>
    </div>
  );
}

