"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import ScrollProgress from "@/components/layout/ScrollProgress"
import TextReveal from "@/components/layout/TextReveal"
import { CONTACT_DATA } from "@/constants/contact-data"

export default function ContactPage() {
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
              href="/stack"
              className="font-mono text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              Stack
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
            <p className="font-mono text-primary text-sm mb-3">// contact</p>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-foreground mb-6">
              Let's
              <span className="text-primary text-glow"> Talk</span>
              <span className="text-primary">.</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl leading-relaxed">
              Interested in discussing <span className="text-foreground">system architecture</span>, collaboration
              opportunities or just exchanging ideas about <span className="text-primary">software engineering</span>.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-5xl mx-auto px-6">
        <div className="h-px bg-border" />
      </div>

      {/* Contact Content */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16">
          {/* Links */}
          <div>
            <p className="font-mono text-primary text-sm mb-2">// reach out</p>
            <TextReveal as="h2" className="text-3xl md:text-4xl font-bold text-foreground mb-8">
              Get in Touch
            </TextReveal>

            <div className="space-y-6">
              {CONTACT_DATA.map((contact, i) => (
                <motion.a
                  key={contact.label}
                  href={contact.href}
                  target={contact.href.startsWith("mailto") ? undefined : "_blank"}
                  rel={contact.href.startsWith("mailto") ? undefined : "noopener noreferrer"}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.15, duration: 0.6 }}
                  className="group flex items-start gap-4 p-5 border border-border rounded-sm
                           hover:border-primary/30 transition-all duration-300"
                >
                  <span className="font-mono text-primary text-xs mt-1">{contact.prefix}</span>
                  <div>
                    <p className="font-mono text-xs text-muted-foreground mb-1">{contact.label}</p>
                    <p className="text-foreground group-hover:text-primary transition-colors">{contact.value}</p>
                  </div>
                  <span className="ml-auto text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all">
                    →
                  </span>
                </motion.a>
              ))}
            </div>
          </div>

          {/* Availability */}
          <div>
            <p className="font-mono text-primary text-sm mb-2">// status</p>
            <TextReveal as="h2" className="text-3xl md:text-4xl font-bold text-foreground mb-8">
              Availability
            </TextReveal>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="space-y-6"
            >
              <div className="p-6 border border-border rounded-sm">
                <div className="flex items-center gap-3 mb-3">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <span className="font-mono text-sm text-foreground">Open to opportunities</span>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Currently open to freelance work, consulting, and full-time positions in software engineering with
                  focus on back-end and distributed systems.
                </p>
              </div>

              <div className="p-6 border border-dashed border-border rounded-sm">
                <h3 className="font-mono text-primary text-sm mb-3">// preferred topics</h3>
                <div className="flex flex-wrap gap-2">
                  {[
                    "System Design",
                    "Go / Python",
                    "Distributed Systems",
                    "PaaS / DevOps",
                    "Architecture",
                    "Open Source",
                  ].map((topic) => (
                    <span
                      key={topic}
                      className="font-mono text-xs px-3 py-1.5 bg-muted text-muted-foreground
                               rounded-sm hover:text-primary transition-colors cursor-default"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
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
