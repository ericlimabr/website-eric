"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"

export default function HomeNav() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 700)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.nav
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="fixed top-0 left-0 right-0 z-50 px-6 py-4 bg-background/80 backdrop-blur-md border-b border-border"
        >
          <div className="max-w-5xl mx-auto flex items-center justify-between">
            <span className="font-mono text-sm text-muted-foreground">Eric Lima</span>
            <div className="flex items-center gap-6">
              <Link
                href="/projects"
                className="font-mono text-xs text-muted-foreground hover:text-primary transition-colors"
              >
                Projects
              </Link>
              <Link
                href="/stack"
                className="font-mono text-xs text-muted-foreground hover:text-primary transition-colors"
              >
                Stack
              </Link>
              <a
                href="https://wa.me/5561991036135"
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-xs px-3 py-1.5 bg-primary text-primary-foreground
                           rounded-sm hover:bg-primary/90 transition-all duration-200"
              >
                WhatsApp
              </a>
            </div>
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  )
}
