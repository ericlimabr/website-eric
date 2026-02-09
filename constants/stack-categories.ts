import { Cpu, Monitor, Database, Network, LucideIcon } from "lucide-react"

export interface StackCategory {
  title: string
  items: string[]
  icon: LucideIcon
}

export const STACK_CATEGORIES: StackCategory[] = [
  {
    title: "Back-end & Systems",
    items: ["Golang", "Python", "FastAPI", "REST APIs"],
    icon: Cpu,
  },
  {
    title: "Front-end",
    items: ["TypeScript", "React", "Next.js", "Tailwind CSS"],
    icon: Monitor,
  },
  {
    title: "Infrastructure",
    items: ["Docker", "Traefik", "Linux", "PostgreSQL", "SQLite"],
    icon: Database,
  },
  {
    title: "Architecture",
    items: ["System Design", "Zero-Knowledge", "Distributed Systems", "PaaS"],
    icon: Network,
  },
]
