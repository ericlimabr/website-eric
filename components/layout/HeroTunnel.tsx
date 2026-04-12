"use client"

import { useRef, useMemo, useEffect } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { EffectComposer, Bloom } from "@react-three/postprocessing"
import * as THREE from "three"

const TUNNEL_RADIUS = 4
const TUNNEL_LENGTH = 60

function buildStreamTexture(): THREE.CanvasTexture {
  const W = 512
  const H = 1024
  const canvas = document.createElement("canvas")
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext("2d")!

  const charSize = 13
  const cols = Math.floor(W / charSize)
  const rows = Math.floor(H / charSize)

  // Each column gets a "stream head" row — chars above it are bright, below dim
  const streamHeads = Array.from({ length: cols }, () => Math.floor(Math.random() * rows))

  ctx.font = `${charSize - 1}px monospace`

  for (let c = 0; c < cols; c++) {
    const head = streamHeads[c]
    for (let r = 0; r < rows; r++) {
      const ch = Math.random() > 0.5 ? "1" : "0"
      const dist = head - r
      let alpha: number

      if (dist === 0) alpha = 1          // stream head: full bright
      else if (dist > 0 && dist < 8) alpha = 1 - dist / 8  // tail fading
      else alpha = Math.random() * 0.08  // background noise

      if (alpha < 0.02) continue
      ctx.fillStyle = dist === 0
        ? `rgba(180,255,255,${alpha})`   // head: near-white cyan
        : `rgba(0,255,255,${alpha})`     // tail: pure cyan
      ctx.fillText(ch, c * charSize + 2, r * charSize + charSize - 1)
    }
  }

  const tex = new THREE.CanvasTexture(canvas)
  tex.wrapS = THREE.RepeatWrapping
  tex.wrapT = THREE.RepeatWrapping
  tex.repeat.set(3, 6)
  return tex
}

function Tunnel() {
  const meshRef = useRef<THREE.Mesh>(null)
  const texture = useMemo(() => buildStreamTexture(), [])

  useEffect(() => () => texture.dispose(), [texture])

  useFrame((_, delta) => {
    if (!meshRef.current) return
    const mat = meshRef.current.material as THREE.MeshBasicMaterial
    mat.map!.offset.y -= delta * 0.12
  })

  return (
    <mesh ref={meshRef} rotation={[Math.PI / 2, 0, 0]}>
      <cylinderGeometry args={[TUNNEL_RADIUS, TUNNEL_RADIUS, TUNNEL_LENGTH, 48, 1, true]} />
      <meshBasicMaterial
        map={texture}
        side={THREE.BackSide}
        transparent
        opacity={0.55}
      />
    </mesh>
  )
}

export default function HeroTunnel() {
  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        position: "absolute",
        top: 0,
        left: 0,
        zIndex: 0,
        pointerEvents: "none",
      }}
    >
      <Canvas camera={{ position: [0, 0, 0.1], fov: 80 }} gl={{ alpha: true }}>
        <Tunnel />
        <EffectComposer>
          <Bloom luminanceThreshold={0.1} mipmapBlur intensity={1.4} />
        </EffectComposer>
      </Canvas>
    </div>
  )
}
