"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

interface TextRevealProps {
  children: string
  className?: string
  as?: "h1" | "h2" | "h3" | "p" | "span"
  delay?: number
}

export default function TextReveal({ children, className = "", as: Tag = "span", delay = 0 }: TextRevealProps) {
  const containerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const chars = containerRef.current.querySelectorAll(".char")

    gsap.set(chars, {
      y: 50,
      opacity: 0,
      rotateX: -40,
    })

    gsap.to(chars, {
      y: 0,
      opacity: 1,
      rotateX: 0,
      stagger: 0.03,
      duration: 0.6,
      delay,
      ease: "power3.out",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 85%",
        toggleActions: "play none none reverse",
      },
    })

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    }
  }, [delay, children])

  const splitText = children.split("").map((char, index) => (
    <span
      key={index}
      className="char inline-block"
      style={{
        display: char === " " ? "inline" : "inline-block",
        perspective: "1000px",
      }}
    >
      {char === " " ? "\u00A0" : char}
    </span>
  ))

  return (
    <Tag ref={containerRef as any} className={`${className} overflow-hidden`} style={{ perspective: "1000px" }}>
      {splitText}
    </Tag>
  )
}
