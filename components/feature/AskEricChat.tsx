"use client"

import React, { useState, useRef, useEffect } from "react"
import ReactMarkdown from "react-markdown"
import { Send, Terminal, X, MessageSquare, Loader2 } from "lucide-react"
import { MAX_CHARS_FOR_ASK_ERIC } from "@/constants/max-chars-input-chat"
import { ASK_ERIC_VERSION } from "@/constants/version"

interface Message {
  role: "user" | "assistant"
  content: string
  isError?: boolean
}

export default function AskEricChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to last message
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMsg: Message = { role: "user", content: input }
    setMessages((prev) => [...prev, userMsg])
    setInput("")
    setIsLoading(true)

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMsg] }),
      })

      const data = await res.json()

      if (res.ok) {
        setMessages((prev) => [...prev, { role: "assistant", content: data.answer }])
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: `Error: ${data.answer || "Connection lost."}`, isError: true },
        ])
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "System failure. Try again later.", isError: true },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 font-mono">
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-card border border-primary/20 p-4 rounded-full shadow-lg shadow-primary/10 
                     hover:border-primary/50 transition-all group cursor-pointer"
        >
          <MessageSquare className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
        </button>
      )}

      {/* Terminal Window */}
      {isOpen && (
        <div
          className="w-87.5 md:w-112.5 h-125 bg-[#080a0f] border border-primary/30 
                        flex flex-col rounded-sm shadow-2xl animate-in slide-in-from-bottom-4"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-3 border-b border-primary/20 bg-primary/5">
            <div className="flex items-center gap-2 text-[10px] text-primary uppercase tracking-widest">
              <Terminal className="w-3 h-3" />
              <span>Ask Eric Interface {ASK_ERIC_VERSION}</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:text-primary transition-colors cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Area */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 text-sm scrollbar-eric">
            {messages.length === 0 && (
              <div className="text-muted-foreground text-xs leading-relaxed italic">
                {">"} System initialized. Accessing Eric's architecture, projects, and theological framework. Ask
                anything.
              </div>
            )}

            {messages.map((m, i) => {
              const isOutOfScope = m.content?.startsWith("ERROR: Out of scope. Context denied.")
              const isSystemError = m.isError || isOutOfScope

              const colorClass =
                m.role === "user"
                  ? "text-muted-foreground"
                  : isSystemError
                    ? "text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.8)] font-bold animate-glitch"
                    : "text-primary"

              return (
                <div key={i} className={`${colorClass} flex gap-2 transition-all duration-300`}>
                  <span className="shrink-0 font-bold">
                    {m.role === "user" ? "USER:" : isSystemError ? "SYSTEM:" : "ERIC:"}
                  </span>
                  <div className={`prose prose-invert prose-xs max-w-full ${isSystemError ? "prose-red" : ""}`}>
                    <ReactMarkdown>{m.content}</ReactMarkdown>
                  </div>
                </div>
              )
            })}

            {isLoading && (
              <div className="flex items-center gap-2 text-primary animate-pulse">
                <Loader2 className="w-3 h-3 animate-spin" />
                <span className="text-xs uppercase">Processing...</span>
              </div>
            )}
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="p-3 border-t border-primary/20 bg-primary/5 flex gap-2">
            <input
              autoFocus
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Query the system..."
              className="flex-1 bg-transparent border-none outline-none text-sm text-foreground 
                         placeholder:text-primary/20 focus:ring-0"
              maxLength={MAX_CHARS_FOR_ASK_ERIC}
            />
            <button
              type="submit"
              disabled={isLoading}
              className="text-primary hover:scale-110 transition-transform disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
