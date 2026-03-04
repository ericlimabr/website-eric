"use client"

import { motion } from "framer-motion"
import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import TextReveal from "./TextReveal"
import { STACK_CATEGORIES, STACK_ITEM_ICONS } from "@/constants/stack-categories"

gsap.registerPlugin(ScrollTrigger)

export default function Stack() {
  const cardsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!cardsRef.current) return

    const cards = cardsRef.current.querySelectorAll(".stack-card")

    cards.forEach((card, index) => {
      gsap.fromTo(
        card,
        {
          y: 60,
          opacity: 0,
          rotateY: -15,
        },
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
    <section id="stack" className="py-32 px-6 bg-surface">
      <div className="max-w-5xl mx-auto">
        <div className="mb-16">
          <p className="font-mono text-primary text-sm mb-2">// stack</p>
          <TextReveal as="h2" className="text-3xl md:text-4xl font-bold text-foreground">
            Technologies & Skills
          </TextReveal>
        </div>

        <div ref={cardsRef} className="grid md:grid-cols-2 gap-6" style={{ perspective: "1000px" }}>
          {STACK_CATEGORIES.map((category) => {
            const Icon = category.icon

            return (
              <div
                key={category.title}
                className="stack-card p-6 bg-card border border-border rounded-sm
                       hover:border-primary/20 transition-all duration-300"
                style={{ transformStyle: "preserve-3d" }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">
                    <Icon className="w-6 h-6 text-primary transition-transform group-hover:scale-110" />
                  </span>
                  <h3 className="text-lg font-semibold text-foreground">{category.title}</h3>
                </div>

                <div className="flex flex-wrap gap-2">
                  {category.items.map((item) => {
                    const ItemIcon = STACK_ITEM_ICONS[item]
                    return (
                      <span
                        key={item}
                        className="font-mono text-sm px-3 py-1.5 bg-muted text-muted-foreground
                               rounded-sm hover:text-primary transition-colors cursor-default
                               inline-flex items-center gap-1.5"
                      >
                        {ItemIcon && <ItemIcon className="w-3.5 h-3.5 shrink-0" />}
                        {item}
                      </span>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>

        {/* Interests section */}
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
  )
}
