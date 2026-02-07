import { useEffect, useRef, ReactNode } from "react"
import gsap from "gsap"

interface MagneticButtonProps {
  children: ReactNode
  href: string
  className?: string
  strength?: number
}

export default function MagneticButton({ children, href, className = "", strength = 0.4 }: MagneticButtonProps) {
  const buttonRef = useRef<HTMLAnchorElement>(null)
  const textRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!buttonRef.current) return

    const button = buttonRef.current
    const text = textRef.current

    const handleMouseMove = (e: MouseEvent) => {
      const rect = button.getBoundingClientRect()
      const x = e.clientX - rect.left - rect.width / 2
      const y = e.clientY - rect.top - rect.height / 2

      gsap.to(button, {
        x: x * strength,
        y: y * strength,
        duration: 0.4,
        ease: "power2.out",
      })

      if (text) {
        gsap.to(text, {
          x: x * strength * 0.5,
          y: y * strength * 0.5,
          duration: 0.4,
          ease: "power2.out",
        })
      }
    }

    const handleMouseLeave = () => {
      gsap.to(button, {
        x: 0,
        y: 0,
        duration: 0.7,
        ease: "elastic.out(1, 0.3)",
      })

      if (text) {
        gsap.to(text, {
          x: 0,
          y: 0,
          duration: 0.7,
          ease: "elastic.out(1, 0.3)",
        })
      }
    }

    button.addEventListener("mousemove", handleMouseMove)
    button.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      button.removeEventListener("mousemove", handleMouseMove)
      button.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [strength])

  return (
    <a ref={buttonRef} href={href} className={className}>
      <span ref={textRef} className="inline-flex items-center">
        {children}
      </span>
    </a>
  )
}
