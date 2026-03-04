import { Cpu, Monitor, Database, Network, LucideIcon } from "lucide-react"
import {
  SiGo,
  SiPython,
  SiFastapi,
  SiTypescript,
  SiReact,
  SiNextdotjs,
  SiTailwindcss,
  SiDocker,
  SiLinux,
  SiPostgresql,
  SiSqlite,
} from "react-icons/si"
import { IconType } from "react-icons"

export interface StackCategory {
  title: string
  items: string[]
  icon: LucideIcon
}

export const STACK_ITEM_ICONS: Record<string, IconType> = {
  Golang: SiGo,
  Python: SiPython,
  FastAPI: SiFastapi,
  TypeScript: SiTypescript,
  React: SiReact,
  "Next.js": SiNextdotjs,
  "Tailwind CSS": SiTailwindcss,
  Docker: SiDocker,
  Linux: SiLinux,
  PostgreSQL: SiPostgresql,
  SQLite: SiSqlite,
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
