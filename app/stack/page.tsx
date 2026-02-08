"use client"

import { motion } from "framer-motion"
import { useEffect, useRef } from "react"
import Link from "next/link"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import ScrollProgress from "@/components/layout/ScrollProgress"
import { STACK_CATEGORIES } from "@/constants/stack-categories"

gsap.registerPlugin(ScrollTrigger)

export default function StackPage() {
  const cardsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!cardsRef.current) return

    const cards = cardsRef.current.querySelectorAll(".stack-card")

    cards.forEach((card, index) => {
      gsap.fromTo(
        card,
        { y: 60, opacity: 0, rotateY: -15 },
        {
          y: 0,
          opacity: 1,
          rotateY: 0,
          duration: 0.8,
          delay: index * 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      )
    })

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    }
  }, [])

  return (
    <main className="min-h-screen bg-background">
      <ScrollProgress />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="font-mono text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-2"
          >
            <span>←</span> Eric Lima
          </Link>
          <div className="flex items-center gap-6">
            <Link
              href="/projects"
              className="font-mono text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              Projects
            </Link>
            <Link
              href="/contact"
              className="font-mono text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              Contact
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-radial" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px),
                             linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />

        <div className="relative z-10 max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <p className="font-mono text-primary text-sm mb-3">// stack</p>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-foreground mb-6">
              Technologies
              <span className="text-primary text-glow"> & Skills</span>
              <span className="text-primary">.</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl leading-relaxed">
              The tools and paradigms I use to build <span className="text-foreground">reliable</span>,{" "}
              <span className="text-primary">performant</span> systems.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-5xl mx-auto px-6">
        <div className="h-px bg-border" />
      </div>

      {/* Stack Grid */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div ref={cardsRef} className="grid md:grid-cols-2 gap-6" style={{ perspective: "1000px" }}>
            {STACK_CATEGORIES.map((category) => (
              <div
                key={category.title}
                className="stack-card p-6 bg-card border border-border rounded-sm
                         hover:border-primary/20 transition-all duration-300"
                style={{ transformStyle: "preserve-3d" }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">{category.icon}</span>
                  <h3 className="text-lg font-semibold text-foreground">{category.title}</h3>
                </div>

                <div className="flex flex-wrap gap-2">
                  {category.items.map((item) => (
                    <span
                      key={item}
                      className="font-mono text-sm px-3 py-1.5 bg-muted text-muted-foreground
                               rounded-sm hover:text-primary transition-colors cursor-default"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Engineering interests */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-12 p-8 border border-dashed border-border rounded-sm"
          >
            <h3 className="font-mono text-primary text-sm mb-4">// engineering interests</h3>
            <p className="text-muted-foreground leading-relaxed">
              Distributed systems, scalable system design and the application of
              <span className="text-foreground"> metaphysical concepts (Aristotelianism/Neoplatonism)</span> in software
              abstraction structures. I believe good architectures reflect solid ontological principles.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-border">
        <div className="max-w-5xl mx-auto text-center">
          <p className="font-mono text-xs text-muted-foreground">
            © {new Date().getFullYear()} Eric Lima — <span className="text-primary">&lt;/&gt;</span> with Go, Python &
            TypeScript
          </p>
        </div>
      </footer>
    </main>
  )
}
