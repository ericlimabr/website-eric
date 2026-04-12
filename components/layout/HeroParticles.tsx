"use client"

import { useRef, useMemo, useEffect } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { EffectComposer, Bloom } from "@react-three/postprocessing"
import * as THREE from "three"

const COUNT          = 2500
const SPREAD_X       = 22
const SPREAD_Y       = 13
const REPEL_RADIUS   = 2.8
const REPEL_STRENGTH = 0.18
const SPRING         = 0.028
const DAMPING        = 0.87

function ParticleField() {
  const mouse = useRef(new THREE.Vector3(9999, 9999, 0))
  const { camera } = useThree()

  const home = useMemo(() => {
    const arr = new Float32Array(COUNT * 3)
    for (let i = 0; i < COUNT; i++) {
      arr[i * 3]     = (Math.random() - 0.5) * SPREAD_X
      arr[i * 3 + 1] = (Math.random() - 0.5) * SPREAD_Y
      arr[i * 3 + 2] = (Math.random() - 0.5) * 4
    }
    return arr
  }, [])

  const pos = useMemo(() => home.slice(), [home])
  const vel = useMemo(() => new Float32Array(COUNT * 3), [])

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3))
    return geo
  }, [pos])

  useEffect(() => () => geometry.dispose(), [geometry])

  useEffect(() => {
    const vec = new THREE.Vector3()
    const onMove = (e: MouseEvent) => {
      vec.set(
        (e.clientX / window.innerWidth)  *  2 - 1,
        (e.clientY / window.innerHeight) * -2 + 1,
        0.5
      )
      vec.unproject(camera)
      vec.sub(camera.position).normalize()
      const t = -camera.position.z / vec.z
      mouse.current.copy(camera.position).addScaledVector(vec, t)
    }
    window.addEventListener("mousemove", onMove)
    return () => window.removeEventListener("mousemove", onMove)
  }, [camera])

  useFrame(() => {
    const mx = mouse.current.x
    const my = mouse.current.y

    for (let i = 0; i < COUNT; i++) {
      const xi = i * 3, yi = xi + 1, zi = xi + 2

      const dx   = pos[xi] - mx
      const dy   = pos[yi] - my
      const dist = Math.sqrt(dx * dx + dy * dy)

      if (dist < REPEL_RADIUS && dist > 0) {
        const f = (1 - dist / REPEL_RADIUS) * REPEL_STRENGTH
        vel[xi] += (dx / dist) * f
        vel[yi] += (dy / dist) * f
      }

      vel[xi] += (home[xi] - pos[xi]) * SPRING
      vel[yi] += (home[yi] - pos[yi]) * SPRING
      vel[zi] += (home[zi] - pos[zi]) * SPRING

      vel[xi] *= DAMPING
      vel[yi] *= DAMPING
      vel[zi] *= DAMPING

      pos[xi] += vel[xi]
      pos[yi] += vel[yi]
      pos[zi] += vel[zi]
    }

    geometry.attributes.position.needsUpdate = true
  })

  return (
    <points geometry={geometry}>
      <pointsMaterial
        color="#00ffff"
        size={0.055}
        sizeAttenuation
        transparent
        opacity={0.65}
      />
    </points>
  )
}

export default function HeroParticles() {
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
      <Canvas camera={{ position: [0, 0, 9], fov: 60 }} gl={{ alpha: true }}>
        <ParticleField />
        <EffectComposer>
          <Bloom luminanceThreshold={0.05} mipmapBlur intensity={0.9} />
        </EffectComposer>
      </Canvas>
    </div>
  )
}
