"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Sparkles } from "lucide-react";
import { loadFull } from "tsparticles";
import type { ISourceOptions, Engine } from "@tsparticles/engine";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { cn } from "@/lib/utils";

interface SparkleButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

const baseOptions: ISourceOptions = {
   key: "star",
  name: "Star",
  particles: {
    number: {
      value: 18,
      density: {
        enable: false,
      },
    },
    color: {
      value: ["#7c3aed", "#bae6fd", "#a78bfa", "#93c5fd", "#0284c7", "#fafafa", "#38bdf8"],
    },
    shape: {
      type: "star",
      options: {
        star: {
          sides: 4,
        },
      },
    },
    opacity: {
      value: 0.7,
    },
    size: {
      value: { min: 0.9, max: 3 },
    },
    rotate: {
      value: {
        min: 0,
        max: 360,
      },
      enable: true,
      direction: "clockwise",
      animation: {
        enable: true,
        speed: 10,
        sync: false,
      },
    },
    links: {
      enable: false,
    },
    reduceDuplicates: true,
    move: {
      enable: true,
      center: {
        x: 100,
        y: 30,
      },
    },
  },
  interactivity: {
    events: {},
  },
  smooth: true,
  fpsLimit: 130,
  background: {
    color: "transparent",
    size: "cover",
  },
  fullScreen: {
    enable: false,
  },
  detectRetina: true,
  absorbers: [
    {
      enable: true,
      opacity: 0,
      size: {
        value: 4,
        density: 1,
        limit: {
          radius: 9,
          mass: 9,
        },
      },
      position: {
        x: 100,
        y: 40,
      },
    },
  ],
  emitters: [
    {
      autoPlay: true,
      fill: true,
      life: {
        wait: true,
      },
      rate: {
        quantity: 10,
        delay: 0.6,
      },
      position: {
        x: 100,
        y: 40,
      },
    },
  ],
};

export default function SparkleButton({
  children,
  onClick,
  className,
}: SparkleButtonProps) {
  const [ready, setReady] = useState(false);
  const [hover, setHover] = useState(false);
  const initializationRef = useRef(false);

  useEffect(() => {
    // Guard against double initialization in React Strict Mode (Development)
    if (initializationRef.current) return;
    initializationRef.current = true;

    initParticlesEngine(async (engine: Engine) => {
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
        <div className="absolute inset-0 z-0 overflow-hidden" style={{ inset: "-10px" }}>
          <Particles
            className={cn(
              "pointer-events-none absolute inset-0 transition-opacity",
              hover ? "opacity-80" : "opacity-2"
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
          "group relative z-10 overflow-visible rounded-xl px-3 py-2 text-sm font-semibold transition-all duration-300",
          "bg-linear-to-r from-blue-500 to-purple-500 text-white",
          "hover:scale-105 active:scale-95",
          className
        )}
      >
        <div className="relative z-90 flex items-center gap-1">
          <Sparkles className="h-4 w-4" />
          {children}
        </div>
      </button>
    </div>
  );
}


