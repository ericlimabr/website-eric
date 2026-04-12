"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"

export default function HomeNav() {
  const [visible, setVisible] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 700)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // Close menu when nav hides
  useEffect(() => { if (!visible) setMenuOpen(false) }, [visible])

  return (
    <AnimatePresence>
      {visible && (
        <motion.nav
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border"
        >
          <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
            <span className="font-mono text-sm text-muted-foreground">Eric Lima</span>

            {/* Desktop links */}
            <div className="hidden sm:flex items-center gap-6">
              <Link href="/projects" className="font-mono text-xs text-muted-foreground hover:text-primary transition-colors">
                Projects
              </Link>
              <Link href="/stack" className="font-mono text-xs text-muted-foreground hover:text-primary transition-colors">
                Stack
              </Link>
              <a
                href="https://wa.me/5561991036135"
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-xs px-3 py-1.5 bg-primary text-primary-foreground rounded-sm hover:bg-primary/90 transition-all duration-200"
              >
                WhatsApp
              </a>
            </div>

            {/* Mobile: WhatsApp + hamburger */}
            <div className="flex sm:hidden items-center gap-3">
              <a
                href="https://wa.me/5561991036135"
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-xs px-3 py-1.5 bg-primary text-primary-foreground rounded-sm hover:bg-primary/90 transition-all duration-200"
              >
                WhatsApp
              </a>
              <button
                onClick={() => setMenuOpen((o) => !o)}
                className="p-1.5 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Toggle menu"
              >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  {menuOpen ? (
                    <>
                      <line x1="3" y1="3" x2="15" y2="15" />
                      <line x1="15" y1="3" x2="3" y2="15" />
                    </>
                  ) : (
                    <>
                      <line x1="3" y1="5"  x2="15" y2="5"  />
                      <line x1="3" y1="9"  x2="15" y2="9"  />
                      <line x1="3" y1="13" x2="15" y2="13" />
                    </>
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile dropdown */}
          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="sm:hidden overflow-hidden border-t border-border"
              >
                <div className="flex flex-col px-6 py-3 gap-4">
                  <Link
                    href="/projects"
                    onClick={() => setMenuOpen(false)}
                    className="font-mono text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    Projects
                  </Link>
                  <Link
                    href="/stack"
                    onClick={() => setMenuOpen(false)}
                    className="font-mono text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    Stack
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.nav>
      )}
    </AnimatePresence>
  )
}
