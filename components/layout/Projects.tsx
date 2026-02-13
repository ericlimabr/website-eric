"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import TextReveal from "./TextReveal"
import Link from "next/link"
import { PROJECTS } from "@/constants/projects"
import Heartbeat from "../feature/Heartbeat"

gsap.registerPlugin(ScrollTrigger)

export default function Projects() {
  const projectsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!projectsRef.current) return

    const articles = projectsRef.current.querySelectorAll(".project-card")

    articles.forEach((article, index) => {
      gsap.fromTo(
        article,
        {
          x: index % 2 === 0 ? -100 : 100,
          opacity: 0,
        },
        {
          x: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: article,
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
    <section id="projects" className="py-32 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-16">
          <p className="font-mono text-primary text-sm mb-2">// projects</p>
          <TextReveal as="h2" className="text-3xl md:text-4xl font-bold text-foreground">
            What I'm Building
          </TextReveal>
        </div>

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

                  <Heartbeat status={project.status === "Active" ? "Active" : "Inactive"} className="md:flex hidden" />
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

                  <Heartbeat status={project.status === "Active" ? "Active" : "Inactive"} className="flex md:hidden" />
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
  )
}
