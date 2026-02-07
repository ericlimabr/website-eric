"use client"

import { motion } from "framer-motion"
import { useEffect, useState, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import MagneticButton from "./MagneticButton"

gsap.registerPlugin(ScrollTrigger)

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

  useEffect(() => {
    // Parallax grid effect
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

    // Scale down heading on scroll
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
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
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
              href="/contact"
              className="px-8 py-3 border border-border text-foreground font-medium rounded-sm
                       hover:border-primary/50 hover:text-primary transition-all duration-300 inline-block"
            >
              Contact
            </MagneticButton>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5, duration: 0.5 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <span className="font-mono text-xs">scroll</span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="w-px h-8 bg-linear-to-b from-primary/50 to-transparent"
            />
          </div>
        </motion.div>
      </div>
    </section>
  )
}
