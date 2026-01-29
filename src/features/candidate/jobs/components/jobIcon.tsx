"use client";

import {
  Code,
  Palette,
  Megaphone,
  TrendingUp,
  Package,
  Landmark,
  Gamepad2,
  Database,
  Cpu,
  Monitor,
  Briefcase,
} from "lucide-react";

type IconKey =
  | "engineering"
  | "backend"
  | "frontend"
  | "design"
  | "marketing"
  | "sales"
  | "product"
  | "finance"
  | "game"
  | "data"
  | "system"
  | "default";

interface JobIconProps {
  name?: string;
  iconKey?: IconKey;
  className?: string;
}

/* 🔒 FUTURE-PROOF ICON MAP */
const ICON_MAP: Record<IconKey, React.ElementType> = {
  engineering: Code,
  backend: Code,
  frontend: Monitor,
  design: Palette,
  marketing: Megaphone,
  sales: TrendingUp,
  product: Package,
  finance: Landmark,
  game: Gamepad2,
  data: Database,
  system: Cpu,
  default: Briefcase,
};

export default function JobIcon({
  name = "",
  iconKey,
  className,
}: JobIconProps) {
  /* 1️⃣ If iconKey is provided (future-ready) */
  if (iconKey && ICON_MAP[iconKey]) {
    const Icon = ICON_MAP[iconKey];
    return <Icon className={className} />;
  }

  /* 2️⃣ Fallback to keyword-based detection */
  const key = name.toLowerCase();

  

/* 🔥 SPECIFIC roles FIRST */
if (key.includes("game")) return <Gamepad2 className={className} />;
if (key.includes("frontend") || key.includes("web"))
  return <Monitor className={className} />;
if (key.includes("backend")) return <Code className={className} />;
if (key.includes("design") || key.includes("ui") || key.includes("ux"))
  return <Palette className={className} />;
if (key.includes("marketing")) return <Megaphone className={className} />;
if (key.includes("sales")) return <TrendingUp className={className} />;
if (key.includes("product")) return <Package className={className} />;
if (key.includes("finance") || key.includes("account"))
  return <Landmark className={className} />;
if (key.includes("data")) return <Database className={className} />;
if (key.includes("system")) return <Cpu className={className} />;

/* 🧱 GENERIC developer catch LAST */
if (
  key.includes("developer") ||
  key.includes("engineer") ||
  key.includes(".net") ||
  key.includes("java") ||
  key.includes("python") ||
  key.includes("software")
) {
  return <Code className={className} />;
}

/* 🛟 fallback */
return <Briefcase className={className} />;}