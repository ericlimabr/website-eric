"use client"

import { useRef, useMemo } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Text } from "@react-three/drei"
import { EffectComposer, Bloom } from "@react-three/postprocessing"
import * as THREE from "three"

const SNIPPETS = [
  "func main() {",
  "ctx := context.Background()",
  "defer wg.Done()",
  "select { case <-ch: }",
  "go handleRequest(conn)",
  "if err != nil {",
  "return nil, err",
  "}()",
  "async def fetch(",
  "await asyncio.gather(",
  "yield from pipeline",
  "@dataclass",
  "def __init__(self):",
  "map[string]any{}",
  "interface{}",
  "chan struct{}",
  "sync.Mutex",
  "os.Getenv(",
  "json.Unmarshal(",
  "http.HandleFunc(",
]

const GLYPH_COUNT = 18

interface GlyphProps {
  text: string
  position: [number, number, number]
  rotation: [number, number, number]
  speed: number
  phaseOffset: number
}

function Glyph({ text, position, rotation, speed, phaseOffset }: GlyphProps) {
  const ref = useRef<THREE.Mesh>(null)

  useFrame(({ clock }) => {
    if (!ref.current) return
    const t = clock.getElapsedTime() * speed + phaseOffset
    // Gentle drift upward, reset at top
    ref.current.position.y = position[1] + ((t * 0.3) % 20) - 10
    // Fade in/out using sine
    const mat = ref.current.material as THREE.MeshBasicMaterial
    mat.opacity = Math.max(0, Math.sin(t * 0.5) * 0.6 + 0.1)
  })

  return (
    <Text
      ref={ref}
      position={position}
      rotation={rotation}
      fontSize={0.28}
color="#00ffff"
      anchorX="center"
      anchorY="middle"
      material-transparent
      material-opacity={0}
      material-depthWrite={false}
    >
      {text}
    </Text>
  )
}

function GlyphField() {
  const glyphs = useMemo(() => {
    return Array.from({ length: GLYPH_COUNT }, (_, i) => ({
      id: i,
      text: SNIPPETS[i % SNIPPETS.length],
      position: [
        (Math.random() - 0.5) * 24,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 10 - 2,
      ] as [number, number, number],
      rotation: [
        (Math.random() - 0.5) * 0.3,
        (Math.random() - 0.5) * 0.3,
        (Math.random() - 0.5) * 0.2,
      ] as [number, number, number],
      speed: 0.3 + Math.random() * 0.4,
      phaseOffset: Math.random() * Math.PI * 2,
    }))
  }, [])

  return (
    <>
      {glyphs.map((g) => (
        <Glyph key={g.id} {...g} />
      ))}
    </>
  )
}

export default function HeroGlyphs() {
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
      <Canvas camera={{ position: [0, 0, 14], fov: 60 }} gl={{ alpha: true }}>
        <GlyphField />
        <EffectComposer>
          <Bloom luminanceThreshold={0.05} mipmapBlur intensity={0.8} />
        </EffectComposer>
      </Canvas>
    </div>
  )
}
