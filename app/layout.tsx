import type { Metadata } from "next"
import { Space_Grotesk, JetBrains_Mono } from "next/font/google"
import "./globals.css"
import ScrollToTop from "@/components/feature/ScrollToTop"
import { CONTACT_DATA } from "@/constants/contact-data"

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: {
    default: "Eric Lima | Software Engineer & Platform Architect",
    template: "%s | Eric Lima", // Permite que páginas internas fiquem "Project Palladium | Eric Lima"
  },
  description:
    "Software Engineer specializing in Go, Python, and System Design. Building scalable architectures and exploring the intersection of code and classical philosophy.",
  keywords: [
    "Software Engineering",
    "Go",
    "Golang",
    "Python",
    "FastAPI",
    "System Design",
    "Platform Engineering",
    "Next.js",
    "React",
    "Backend Developer",
  ],
  authors: [{ name: "Eric Lima" }],
  creator: "Eric Lima",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://ericlima.com.br", // Substitua pelo seu domínio
    title: "Eric Lima | Software Engineer & Platform Architect",
    description: "High-performance systems and thoughtful software architecture.",
    siteName: "Eric Lima Portfolio",
    images: [
      {
        url: "/og-image.png", // Crie uma imagem de 1200x630px para redes sociais
        width: 1200,
        height: 630,
        alt: "Eric Lima - Software Engineering",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Eric Lima",
    description: "Software Engineer & Platform Architect",
    creator: "@LuteroFeliz",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Eric Lima",
    jobTitle: "Software Engineer",
    url: "https://ericlima.com.br",
    sameAs: [CONTACT_DATA[1].href, CONTACT_DATA[2].href],
    knowsAbout: ["Go", "Python", "System Design", "Platform Engineering"],
  }

  return (
    <html lang="en">
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} antialiased`}>
        {children}
        <ScrollToTop />
      </body>
    </html>
  )
}
