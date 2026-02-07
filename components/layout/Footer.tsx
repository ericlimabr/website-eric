"use client"

import { CONTACT_DATA } from "@/constants/contact-data"
import { motion } from "framer-motion"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer id="contact" className="py-20 px-6 border-t border-border">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid md:grid-cols-2 gap-12"
        >
          {/* Contact */}
          <div>
            <p className="font-mono text-primary text-sm mb-4">// contact</p>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">Let's talk?</h2>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Interested in discussing system architecture, collaboration opportunities or just exchanging ideas about
              software engineering.
            </p>
            <div className="flex flex-col gap-3">
              {CONTACT_DATA.map((contact) => (
                <a
                  key={contact.label}
                  href={contact.href}
                  target={contact.target}
                  rel={contact.target && "noopener noreferrer"}
                  className="inline-flex items-center gap-2 text-foreground hover:text-primary 
                         transition-colors font-mono text-sm"
                >
                  <span className="text-primary">→</span>
                  {contact.value}
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div className="md:text-right">
            <p className="font-mono text-primary text-sm mb-4">// navigation</p>
            <nav className="flex flex-col gap-2">
              <a href="/projects" className="text-muted-foreground hover:text-foreground transition-colors">
                Projects
              </a>
              <a href="#stack" className="text-muted-foreground hover:text-foreground transition-colors">
                Stack
              </a>
              {/* <a
                href="https://ericlima.com.br/blog"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Blog & Writing
              </a> */}
            </nav>
          </div>
        </motion.div>

        {/* Bottom bar */}
        <div
          className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row 
                      justify-between items-center gap-4"
        >
          <p className="font-mono text-xs text-muted-foreground">© {currentYear} — Built with purpose and precision.</p>
          <p className="font-mono text-xs text-muted-foreground">
            <span className="text-primary">&lt;/&gt;</span> with Go, Python & TypeScript
          </p>
        </div>
      </div>
    </footer>
  )
}
