import ScrollProgress from "@/components/layout/ScrollProgress"
import Hero from "@/components/layout/Hero"
import Projects from "@/components/layout/Projects"
import Stack from "@/components/layout/Stack"
import Footer from "@/components/layout/Footer"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <ScrollProgress />
      <Hero />
      <Projects />
      <Stack />
      <Footer />
    </main>
  )
}
