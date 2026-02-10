interface HeartbeatProps {
  status: "Active" | "Inactive"
}

export default function Heartbeat({ status }: HeartbeatProps) {
  const isActive = status === "Active"
  const color = isActive ? "#19e6bd" : "#ef4444"

  const heartbeatPath = "M0 15 H15 L18 5 L22 25 L25 10 L28 15 H50"
  const flatLinePath = "M0 15 H50"

  return (
    <div className="flex items-center gap-2 font-mono text-[10px] tracking-tighter uppercase">
      <svg width="50" height="30" viewBox="0 0 50 30" className="drop-shadow-[0_0_3px_rgba(var(--primary),0.5)]">
        {/* Ghost background line */}
        <path d={isActive ? heartbeatPath : flatLinePath} fill="none" stroke={color} strokeWidth="1" opacity="0.2" />

        {/* Main scanning line */}
        <path
          d={isActive ? heartbeatPath : flatLinePath}
          fill="none"
          stroke={color}
          strokeWidth="1.5"
          strokeDasharray="100"
          strokeDashoffset="100"
          className="animate-heartbeat-scan"
        />

        {/* Glow point following the path */}
        <circle r="1.5" fill={color}>
          <animateMotion dur="2s" repeatCount="indefinite" path={isActive ? heartbeatPath : flatLinePath} />
        </circle>
      </svg>
      <span style={{ color }}>{status === "Active" ? "Online" : "Offline"}</span>
    </div>
  )
}
