"use client"

import { motion } from "framer-motion"
import { useEffect, useRef } from "react"
import Link from "next/link"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import ScrollProgress from "@/components/layout/ScrollProgress"
import { PROJECTS } from "@/constants/projects"
import Heartbeat from "@/components/feature/Heartbeat"

gsap.registerPlugin(ScrollTrigger)

export default function ProjectsPage() {
  const projectsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!projectsRef.current) return

    const articles = projectsRef.current.querySelectorAll(".project-card")

    articles.forEach((article, index) => {
      gsap.fromTo(
        article,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          delay: index * 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: article,
            start: "top 88%",
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
              href="/stack"
              className="font-mono text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              Stack
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
            <p className="font-mono text-primary text-sm mb-3">// projects</p>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-foreground mb-6">
              What I'm
              <span className="text-primary text-glow"> Building</span>
              <span className="text-primary">.</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl leading-relaxed">
              A collection of projects focused on <span className="text-foreground">system design</span>,{" "}
              <span className="text-foreground">developer tools</span> and{" "}
              <span className="text-primary">scalable architectures</span>.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-5xl mx-auto px-6">
        <div className="h-px bg-border" />
      </div>

      {/* Projects List */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div ref={projectsRef} className="space-y-6">
            {PROJECTS.map((project) => (
              <article
                key={project.name}
                className="project-card group relative p-6 md:p-8 bg-card border border-border rounded-sm
                         hover:border-primary/30 transition-all duration-500"
              >
                {/* Status badge */}
                <span
                  className="absolute top-6 right-6 font-mono text-xs text-muted-foreground
                               px-2 py-1 bg-secondary rounded-sm"
                >
                  {project.status}
                </span>

                <div className="flex flex-col gap-4">
                  <div className="flex flex-row gap-4">
                    <h3
                      className="text-xl md:text-2xl font-semibold text-foreground 
                                group-hover:text-primary transition-colors"
                    >
                      {project.name}
                    </h3>

                    <Heartbeat
                      status={project.status === "Active" ? "Active" : "Inactive"}
                      className="md:flex hidden"
                    />
                  </div>

                  <p className="text-muted-foreground leading-relaxed max-w-2xl">{project.description}</p>

                  <div className="flex flex-wrap gap-2 mt-2">
                    {project.stack.map((tech) => (
                      <span
                        key={tech}
                        className="font-mono text-xs px-3 py-1 bg-secondary text-secondary-foreground
                                 border border-border rounded-sm"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="flex justify-between">
                    {project.link !== "#" &&
                      (project.internal ? (
                        <Link
                          href={project.link}
                          className="inline-flex items-center gap-2 text-sm text-primary 
                                  hover:underline underline-offset-4 mt-2"
                        >
                          View Details
                          <span className="group-hover:translate-x-1 transition-transform">→</span>
                        </Link>
                      ) : (
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-sm text-primary 
                                  hover:underline underline-offset-4 mt-2"
                        >
                          Visit
                          <span className="group-hover:translate-x-1 transition-transform">→</span>
                        </a>
                      ))}

                    <Heartbeat
                      status={project.status === "Active" ? "Active" : "Inactive"}
                      className="flex md:hidden"
                    />
                  </div>
                </div>

                {/* Hover glow effect */}
                <div
                  className="absolute inset-0 rounded-sm opacity-0 group-hover:opacity-100 
                              transition-opacity duration-500 pointer-events-none"
                  style={{
                    background:
                      "radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), hsl(var(--primary) / 0.06), transparent 40%)",
                  }}
                />
              </article>
            ))}
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
