"use client"

import { motion } from "framer-motion"
import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import ScrollProgress from "@/components/layout/ScrollProgress"
import TextReveal from "@/components/layout/TextReveal"
import Link from "next/link"

gsap.registerPlugin(ScrollTrigger)

const features = [
  {
    title: "One-Click Deploy",
    description:
      "Push your code and let Capy handle the rest — from building containers to routing traffic through Traefik.",
    icon: "⚡",
  },
  {
    title: "Git-Based Workflow",
    description: "Connect your repository and deploy on every push. Branch previews and rollback built in.",
    icon: "⎇",
  },
  {
    title: "SQLite-Powered State",
    description:
      "Lightweight, embedded database for platform state. No external DB dependency needed to run the control plane.",
    icon: "🗄",
  },
  {
    title: "Traefik Reverse Proxy",
    description: "Automatic SSL, load balancing, and domain routing with zero-config Traefik integration.",
    icon: "🔀",
  },
]

const techStack = [
  { name: "Go", role: "Core API & orchestration engine" },
  { name: "React", role: "Dashboard & management UI" },
  { name: "SQLite", role: "Platform state persistence" },
  { name: "Traefik", role: "Reverse proxy & SSL termination" },
  { name: "Docker", role: "Container runtime" },
  { name: "WebSocket", role: "Real-time build logs" },
]

const architecture = [
  { layer: "Client", detail: "React SPA with real-time WebSocket log streaming" },
  { layer: "API Gateway", detail: "Go HTTP server with middleware chain" },
  { layer: "Orchestrator", detail: "Container lifecycle manager built on Docker SDK" },
  { layer: "Proxy", detail: "Traefik with dynamic config generation" },
  { layer: "Storage", detail: "SQLite for metadata, volumes for app data" },
]

export default function ProjectCapy() {
  const featuresRef = useRef<HTMLDivElement>(null)
  const archRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (featuresRef.current) {
      const cards = featuresRef.current.querySelectorAll(".feature-card")
      cards.forEach((card, i) => {
        gsap.fromTo(
          card,
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            delay: i * 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 88%",
              toggleActions: "play none none reverse",
            },
          }
        )
      })
    }

    if (archRef.current) {
      const rows = archRef.current.querySelectorAll(".arch-row")
      rows.forEach((row, i) => {
        gsap.fromTo(
          row,
          { x: -80, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.7,
            delay: i * 0.08,
            ease: "power3.out",
            scrollTrigger: {
              trigger: row,
              start: "top 90%",
              toggleActions: "play none none reverse",
            },
          }
        )
      })
    }

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill())
    }
  }, [])

  return (
    <main className="min-h-screen bg-background">
      <ScrollProgress />

      {/* Back navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="font-mono text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-2"
          >
            <span>←</span> Eric Lima
          </Link>
          <span className="font-mono text-xs text-muted-foreground px-3 py-1 bg-secondary rounded-sm border border-border">
            In Development
          </span>
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
            <p className="font-mono text-primary text-sm mb-3">// project</p>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-foreground mb-6">
              Capy
              <span className="text-primary text-glow">.</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl leading-relaxed mb-8">
              Platform as a Service for simplified application deployment. Architecture inspired by{" "}
              <span className="text-foreground">CapRover</span>, built with focus on{" "}
              <span className="text-primary">developer experience</span>.
            </p>

            <div className="flex flex-wrap gap-3">
              {["Go", "React", "SQLite", "Traefik"].map((tech) => (
                <span
                  key={tech}
                  className="font-mono text-sm px-4 py-2 bg-secondary text-secondary-foreground border border-border rounded-sm"
                >
                  {tech}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-5xl mx-auto px-6">
        <div className="h-px bg-border" />
      </div>

      {/* Overview */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16">
          <div>
            <p className="font-mono text-primary text-sm mb-2">// overview</p>
            <TextReveal as="h2" className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Why Capy?
            </TextReveal>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Deploying applications shouldn't require a PhD in DevOps. Capy abstracts away the complexity of
                container orchestration, reverse proxying, and SSL management into a clean, developer-friendly
                interface.
              </p>
              <p>
                Built entirely in <span className="text-foreground">Go</span> for performance and reliability, with a{" "}
                <span className="text-foreground">React</span> dashboard that gives you real-time visibility into your
                deployments.
              </p>
            </div>
          </div>
          <div className="space-y-6">
            <p className="font-mono text-primary text-sm mb-2">// goals</p>
            {[
              "Self-hosted alternative to Heroku/Render",
              "Zero-config SSL with Let's Encrypt",
              "Real-time build logs via WebSocket",
              "Git push to deploy workflow",
            ].map((goal, i) => (
              <motion.div
                key={goal}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="flex items-start gap-3"
              >
                <span className="text-primary font-mono text-sm mt-1">0{i + 1}</span>
                <p className="text-foreground">{goal}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6 bg-card/50">
        <div className="max-w-5xl mx-auto">
          <p className="font-mono text-primary text-sm mb-2">// features</p>
          <TextReveal as="h2" className="text-3xl md:text-4xl font-bold text-foreground mb-12">
            Core Capabilities
          </TextReveal>

          <div ref={featuresRef} className="grid md:grid-cols-2 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="feature-card group p-6 md:p-8 bg-card border border-border rounded-sm
                         hover:border-primary/30 transition-all duration-500"
              >
                <span className="text-2xl mb-4 block">{feature.icon}</span>
                <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Architecture */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <p className="font-mono text-primary text-sm mb-2">// architecture</p>
          <TextReveal as="h2" className="text-3xl md:text-4xl font-bold text-foreground mb-12">
            System Design
          </TextReveal>

          <div ref={archRef} className="space-y-3">
            {architecture.map((item, i) => (
              <div
                key={item.layer}
                className="arch-row flex items-center gap-4 p-4 md:p-5 border border-border rounded-sm
                         hover:border-primary/20 transition-colors group"
              >
                <span className="font-mono text-primary text-xs w-6 shrink-0">{String(i).padStart(2, "0")}</span>
                <div className="h-px flex-1 max-w-8 bg-border group-hover:bg-primary/30 transition-colors" />
                <span className="font-mono text-sm text-foreground w-28 shrink-0">{item.layer}</span>
                <div className="h-px flex-1 bg-border group-hover:bg-primary/30 transition-colors hidden md:block" />
                <span className="text-sm text-muted-foreground">{item.detail}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-24 px-6 bg-card/50">
        <div className="max-w-5xl mx-auto">
          <p className="font-mono text-primary text-sm mb-2">// stack</p>
          <TextReveal as="h2" className="text-3xl md:text-4xl font-bold text-foreground mb-12">
            Built With
          </TextReveal>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {techStack.map((tech, i) => (
              <motion.div
                key={tech.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.4 }}
                className="p-5 border border-border rounded-sm hover:border-primary/30 transition-all duration-300"
              >
                <h3 className="font-mono text-foreground font-semibold mb-1">{tech.name}</h3>
                <p className="text-xs text-muted-foreground">{tech.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA / Back */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <p className="font-mono text-primary text-sm mb-4">// next</p>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">Want to see more?</h2>
          <p className="text-muted-foreground mb-8">Check out the other projects or get in touch.</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-primary-foreground font-medium rounded-sm
                     hover:bg-primary/90 transition-all duration-300 border-glow"
          >
            <span>←</span> Back to Home
          </Link>
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
