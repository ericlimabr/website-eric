"use client"

import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion"
import { useEffect, useState, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import MagneticButton from "./MagneticButton"
import { SiGo, SiPython, SiTypescript, SiDocker, SiPostgresql, SiReact, SiNextdotjs, SiLinux } from "react-icons/si"
import { IconType } from "react-icons"

gsap.registerPlugin(ScrollTrigger)

interface TechItem {
  icon: IconType
  label: string
  description: string
}

const TECH_ITEMS: TechItem[] = [
  {
    icon: SiGo,
    label: "Go",
    description: "Compiled, statically typed language I use for backend services, CLIs, and high-performance APIs.",
  },
  {
    icon: SiPython,
    label: "Python",
    description: "Versatile scripting and automation. Used for data pipelines, tooling, and FastAPI services.",
  },
  {
    icon: SiTypescript,
    label: "TypeScript",
    description: "Typed superset of JavaScript powering all frontend code with strong type safety.",
  },
  {
    icon: SiNextdotjs,
    label: "Next.js",
    description: "React framework with SSR and edge support. This very site runs on it.",
  },
  {
    icon: SiReact,
    label: "React",
    description: "Component-based UI library forming the foundation of my frontend architecture.",
  },
  {
    icon: SiDocker,
    label: "Docker",
    description: "Container platform for consistent, reproducible deployments across environments.",
  },
  {
    icon: SiLinux,
    label: "Linux",
    description: "Primary OS for all servers and development environments.",
  },
  {
    icon: SiPostgresql,
    label: "PostgreSQL",
    description: "Robust relational database used for production workloads.",
  },
]

function TypewriterText({ text, delay = 0 }: { text: string; delay?: number }) {
  const [displayedText, setDisplayedText] = useState("")
  const [showCursor, setShowCursor] = useState(true)

  useEffect(() => {
    const timeout = setTimeout(() => {
      let index = 0
      const interval = setInterval(() => {
        if (index <= text.length) {
          setDisplayedText(text.slice(0, index))
          index++
        } else {
          clearInterval(interval)
          setTimeout(() => setShowCursor(false), 2000)
        }
      }, 50)
      return () => clearInterval(interval)
    }, delay)
    return () => clearTimeout(timeout)
  }, [text, delay])

  return (
    <span>
      {displayedText}
      {showCursor && <span className="animate-blink text-primary">_</span>}
    </span>
  )
}

export default function Hero() {
  const gridRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const [activeTech, setActiveTech] = useState<TechItem | null>(null)
  const [isTouch] = useState(() =>
    typeof window !== "undefined"
      ? navigator.maxTouchPoints > 0 || window.matchMedia("(hover: none)").matches
      : false
  )

  const tooltipRef = useRef<HTMLDivElement>(null)
  const iconsRef = useRef<HTMLDivElement>(null)
  const [mobileTipBottom, setMobileTipBottom] = useState(0)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const springX = useSpring(mouseX, { stiffness: 500, damping: 35 })
  const springY = useSpring(mouseY, { stiffness: 500, damping: 35 })

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isTouch) return
    const cardW = 224 // w-56 is fixed
    const cardH = tooltipRef.current?.offsetHeight || 180 // fallback generous so it always clears
    const x = Math.min(e.clientX + 20, window.innerWidth - cardW - 8)
    const y = Math.max(8, e.clientY - cardH - 10)
    mouseX.set(x)
    mouseY.set(y)
  }

  const handleIconEnter = (tech: TechItem) => {
    if (!isTouch) setActiveTech(tech)
  }

  const handleIconLeave = () => {
    if (!isTouch) setActiveTech(null)
  }

  const handleIconClick = (tech: TechItem) => {
    if (!isTouch) return
    if (iconsRef.current) {
      const top = iconsRef.current.getBoundingClientRect().top
      setMobileTipBottom(window.innerHeight - top + 12)
    }
    setActiveTech((prev) => (prev?.label === tech.label ? null : tech))
  }

  useEffect(() => {
    if (gridRef.current) {
      gsap.to(gridRef.current, {
        yPercent: 30,
        ease: "none",
        scrollTrigger: {
          trigger: gridRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      })
    }

    if (headingRef.current) {
      gsap.to(headingRef.current, {
        scale: 0.8,
        opacity: 0.3,
        ease: "none",
        scrollTrigger: {
          trigger: headingRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      })
    }

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    }
  }, [])

  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-radial" />

      {/* Grid pattern with parallax */}
      <div
        ref={gridRef}
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px),
                           linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Name badge */}
          <p className="font-mono text-primary text-sm md:text-base mb-2 tracking-widest">ERIC LIMA</p>

          {/* Terminal-style prefix */}
          <p className="font-mono text-muted-foreground text-xs md:text-sm mb-4">
            <span className="text-primary">~/</span>systems<span className="text-primary">/</span>engineering
          </p>

          {/* Main heading with GSAP scale effect */}
          <h1 ref={headingRef} className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
            <span className="text-foreground">Building </span>
            <span className="text-primary text-glow">
              <TypewriterText text="systems" delay={800} />
            </span>
            <br />
            <span className="text-muted-foreground font-normal">that scale.</span>
          </h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.6 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Software Engineer specializing in <span className="text-foreground">Go</span>,
            <span className="text-foreground"> Python</span> and distributed architectures. Focused on performance,
            security and system design.
          </motion.p>

          {/* Tech icons strip */}
          <motion.div
            ref={iconsRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8, duration: 0.6 }}
            className="flex items-center justify-center gap-5 mb-10"
          >
            {TECH_ITEMS.map((tech) => (
              <div
                key={tech.label}
                className="text-muted-foreground hover:text-primary transition-colors duration-200 cursor-default"
                onMouseEnter={() => handleIconEnter(tech)}
                onMouseLeave={handleIconLeave}
                onClick={() => handleIconClick(tech)}
              >
                <tech.icon className="w-5 h-5" />
              </div>
            ))}
          </motion.div>

          {/* CTA buttons with magnetic effect */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2, duration: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <MagneticButton
              href="/projects"
              className="group px-8 py-3 bg-primary text-primary-foreground font-medium rounded-sm
                       hover:bg-primary/90 transition-all duration-300 border-glow inline-block"
            >
              View Projects
              <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform">→</span>
            </MagneticButton>
            <MagneticButton
              href="https://wa.me/5561991036135"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 border border-border text-foreground font-medium rounded-sm
                       hover:border-primary/50 hover:text-primary transition-all duration-300 inline-block"
            >
              WhatsApp
            </MagneticButton>
          </motion.div>
        </motion.div>
      </div>

      {/* Floating tech tooltip — follows cursor on desktop, fixed bottom on mobile */}
      <AnimatePresence>
        {activeTech && (
          <motion.div
            ref={tooltipRef}
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ duration: 0.15 }}
            className={
              isTouch
                ? "fixed left-4 right-4 z-50 p-4 rounded-sm shadow-xl border border-border"
                : "fixed top-0 left-0 z-50 pointer-events-none w-56 p-4 rounded-sm shadow-lg border border-border"
            }
            style={{
              ...(!isTouch ? { x: springX, y: springY } : { bottom: mobileTipBottom }),
              backgroundColor: "hsl(220, 18%, 10%)",
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <activeTech.icon className="w-4 h-4 text-primary shrink-0" />
              <span className="font-semibold text-foreground text-sm">{activeTech.label}</span>
            </div>
            <p className="font-mono text-xs text-muted-foreground leading-relaxed">{activeTech.description}</p>
            {isTouch && (
              <button
                onClick={() => setActiveTech(null)}
                className="absolute top-2 right-2 text-muted-foreground hover:text-foreground text-xs px-1"
              >
                ✕
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
