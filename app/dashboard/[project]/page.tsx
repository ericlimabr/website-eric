import fs from "fs"
import path from "path"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import type { Snapshot } from "@/website-dashboard/types"
import DashboardShell from "@/components/dashboard/DashboardShell"

interface Props {
  params: Promise<{ project: string }>
}

export async function generateStaticParams() {
  const dir = path.join(process.cwd(), "website-dashboard", "snapshots")
  if (!fs.existsSync(dir)) return []
  return fs.readdirSync(dir).map((project) => ({ project }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { project } = await params
  return {
    title: `Dev Dashboard · ${project}`,
    description: `Weekly development progress for ${project}.`,
    robots: { index: false, follow: false },
  }
}

function loadSnapshots(project: string): Snapshot[] {
  const dir = path.join(process.cwd(), "website-dashboard", "snapshots", project)
  if (!fs.existsSync(dir)) return []
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .sort()
    .map((f) => JSON.parse(fs.readFileSync(path.join(dir, f), "utf-8")) as Snapshot)
}

export default async function DashboardPage({ params }: Props) {
  const { project } = await params
  const snapshots = loadSnapshots(project)
  if (snapshots.length === 0) notFound()

  return (
    <div className="min-h-screen bg-background">
      <DashboardShell snapshots={snapshots} />
    </div>
  )
}
