"use client"

import { useEffect, useState, useSyncExternalStore } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CONSENT_STORAGE_KEY, OPEN_CONSENT_EVENT } from "@/constants/gtm"

type Consent = "granted" | "denied"

const CONSENT_CHANGE_EVENT = "consent-change"

function subscribe(onChange: () => void) {
  window.addEventListener(CONSENT_CHANGE_EVENT, onChange)
  return () => window.removeEventListener(CONSENT_CHANGE_EVENT, onChange)
}

function readConsent(): Consent | null {
  try {
    const value = localStorage.getItem(CONSENT_STORAGE_KEY)
    return value === "granted" || value === "denied" ? value : null
  } catch {
    return null
  }
}

function applyConsent(consent: Consent) {
  try {
    localStorage.setItem(CONSENT_STORAGE_KEY, consent)
  } catch {}

  window.gtag?.("consent", "update", {
    ad_storage: consent,
    ad_user_data: consent,
    ad_personalization: consent,
    analytics_storage: consent,
  })
  window.dataLayer?.push({ event: "consent_update", consent })
  window.dispatchEvent(new Event(CONSENT_CHANGE_EVENT))
}

export default function ConsentBanner() {
  // On the server the stored choice is unknown, so the banner stays hidden until hydration.
  const storedConsent = useSyncExternalStore(subscribe, readConsent, () => "unknown" as const)
  const [isReopened, setIsReopened] = useState(false)
  const isVisible = isReopened || storedConsent === null

  useEffect(() => {
    const open = () => setIsReopened(true)
    window.addEventListener(OPEN_CONSENT_EVENT, open)
    return () => window.removeEventListener(OPEN_CONSENT_EVENT, open)
  }, [])

  const choose = (consent: Consent) => {
    setIsReopened(false)
    applyConsent(consent)
  }

  return (
    <AnimatePresence>
      {isVisible && (
        // Visual emphasis only: the gradient never blocks the page (no cookie wall).
        <motion.div
          key="consent-gradient"
          aria-hidden
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="pointer-events-none fixed inset-x-0 bottom-0 z-[55] h-[60vh] bg-gradient-to-t from-background via-background/80 to-transparent"
        />
      )}
      {isVisible && (
        <motion.div
          key="consent-banner"
          role="dialog"
          aria-live="polite"
          aria-labelledby="consent-title"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="fixed inset-x-4 bottom-4 z-[60] mx-auto max-w-3xl rounded-lg bg-foreground p-6 text-background shadow-2xl md:bottom-10 md:p-10"
        >
          <p className="mb-3 font-mono text-sm font-semibold text-[hsl(168_80%_26%)]">// cookies</p>
          <h2 id="consent-title" className="mb-3 text-2xl font-bold md:text-3xl">
            Help me make this site better
          </h2>
          <p className="mb-8 max-w-2xl text-base leading-relaxed text-background/80 md:text-lg">
            With your permission, analytics cookies show which projects and pages people actually read, so I know what
            to build and write next. If you reject, no cookies are stored and Google Analytics only receives basic
            cookieless signals, like a page being loaded. You can change your choice anytime under Cookie preferences in
            the footer.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              onClick={() => choose("denied")}
              className="flex-1 cursor-pointer rounded-md border-2 border-background px-6 py-4 font-mono text-base font-semibold text-background transition-colors hover:bg-background/10"
            >
              Reject
            </button>
            <button
              onClick={() => choose("granted")}
              className="flex-1 cursor-pointer rounded-md border-2 border-background bg-background px-6 py-4 font-mono text-base font-semibold text-foreground transition-colors hover:bg-background/85"
            >
              Accept
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
