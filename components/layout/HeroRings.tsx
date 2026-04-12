"use client"

import { useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { EffectComposer, Bloom } from "@react-three/postprocessing"
import * as THREE from "three"

interface RingProps {
  radius: number
  tube: number
  tilt: [number, number, number]   // initial euler rotation
  speed: [number, number, number]  // rotation speed per axis
  opacity: number
}

const RINGS: RingProps[] = [
  { radius: 4.5, tube: 0.012, tilt: [0.4,  0,    0.2 ], speed: [0,      0.0015, 0.0005], opacity: 0.9 },
  { radius: 3.5, tube: 0.012, tilt: [1.2,  0.3,  0   ], speed: [0.001,  0,      0.0012], opacity: 0.7 },
  { radius: 5.5, tube: 0.010, tilt: [0.8,  1.0,  0.5 ], speed: [0.0008, 0.001,  0     ], opacity: 0.5 },
  { radius: 2.5, tube: 0.014, tilt: [2.0,  0.5,  1.2 ], speed: [0.002,  0,      0.0008], opacity: 0.6 },
  { radius: 6.2, tube: 0.008, tilt: [0.2,  1.5,  0.8 ], speed: [0.0005, 0.0012, 0     ], opacity: 0.35 },
]

const colorCyan = new THREE.Color("#00ffff")

function Ring({ radius, tube, tilt, speed, opacity }: RingProps) {
  const ref = useRef<THREE.Mesh>(null)

  useFrame(() => {
    if (!ref.current) return
    ref.current.rotation.x += speed[0]
    ref.current.rotation.y += speed[1]
    ref.current.rotation.z += speed[2]
  })

  return (
    <mesh ref={ref} rotation={tilt}>
      <torusGeometry args={[radius, tube, 8, 160]} />
      <meshStandardMaterial
        color={colorCyan}
        emissive={colorCyan}
        emissiveIntensity={1.2}
        transparent
        opacity={opacity}
      />
    </mesh>
  )
}

function Nucleus() {
  return (
    <mesh>
      <sphereGeometry args={[0.08, 16, 16]} />
      <meshStandardMaterial
        color={colorCyan}
        emissive={colorCyan}
        emissiveIntensity={4}
      />
    </mesh>
  )
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.1} />
      <Nucleus />
      {RINGS.map((ring, i) => (
        <Ring key={i} {...ring} />
      ))}
    </>
  )
}

export default function HeroRings() {
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
      <Canvas camera={{ position: [0, 0, 10], fov: 60 }} gl={{ alpha: true }}>
        <Scene />
        <EffectComposer>
          <Bloom luminanceThreshold={0.05} mipmapBlur intensity={2.0} />
        </EffectComposer>
      </Canvas>
    </div>
  )
}
