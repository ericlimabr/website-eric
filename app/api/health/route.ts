import { PORTFOLIO_VERSION } from "@/constants/version"
import { NextResponse } from "next/server"

export async function GET() {
  const healthData = {
    status: "UP",
    timestamp: new Date().toISOString(),
    system: {
      name: "eric-lima-portfolio",
      version: PORTFOLIO_VERSION,
      environment: process.env.NODE_ENV,
    },
    uptime: process.uptime(),
  }

  return NextResponse.json(healthData, {
    status: 200,
    headers: {
      "Cache-Control": "no-store, max-age=0",
    },
  })
}
