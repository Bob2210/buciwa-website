import Image from "next/image"
import { cn } from "@/lib/utils"

interface MascotProps {
  type: "hero" | "front" | "side-a" | "side-b" | "angry"
  className?: string
  size?: "sm" | "md" | "lg" | "xl"
  animate?: boolean
  containerClass?: string
}

const mascotMap = {
  hero: "/mascot/hero.png",
  front: "/mascot/front.png",
  "side-a": "/mascot/side-a.png",
  "side-b": "/mascot/side-b.png",
  angry: "/mascot/angry.png",
}

const sizeMap = {
  sm: 80,
  md: 120,
  lg: 180,
  xl: 420,
}

export function Mascot({ type, className, size = "md", animate = false, containerClass }: MascotProps) {
  const px = sizeMap[size]

  return (
    <div
      className={cn(
        "flex items-center justify-center",
        animate && "animate-float",
        containerClass
      )}
    >
      <Image
        src={mascotMap[type]}
        alt="捕词蛙吉祥物"
        width={px}
        height={px}
        className={cn("object-contain", className)}
        style={{ maxHeight: px, width: "auto", height: "auto" }}
        priority
      />
    </div>
  )
}
