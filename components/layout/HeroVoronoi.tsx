"use client"

import { useRef, useEffect } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { EffectComposer, Bloom } from "@react-three/postprocessing"
import * as THREE from "three"

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const fragmentShader = /* glsl */ `
  uniform float uTime;
  uniform float uAspect;
  uniform vec2  uMouse;
  varying vec2  vUv;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  float voronoi(vec2 uv) {
    vec2 i = floor(uv);
    vec2 f = fract(uv);
    float minDist = 8.0;

    for (int y = -1; y <= 1; y++) {
      for (int x = -1; x <= 1; x++) {
        vec2 n    = vec2(float(x), float(y));
        vec2 seed = i + n;
        vec2 pt   = vec2(hash(seed), hash(seed + 31.41));
        pt = 0.5 + 0.5 * sin(uTime * 0.35 + 6.2831 * pt);
        minDist = min(minDist, length(n + pt - f));
      }
    }
    return minDist;
  }

  void main() {
    vec2 uv = vUv;
    uv.x   *= uAspect;
    uv     *= 5.0;
    uv     += uMouse * 1.2;

    float d    = voronoi(uv);
    float edge = 1.0 - smoothstep(0.0, 0.05, d);
    float fill = smoothstep(0.6, 1.0, d) * 0.025;

    gl_FragColor = vec4(0.0, 1.0, 1.0, edge * 0.45 + fill);
  }
`

function VoronoiPlane() {
  const matRef    = useRef<THREE.ShaderMaterial>(null)
  const mouse     = useRef(new THREE.Vector2(0, 0))
  const mouseTgt  = useRef(new THREE.Vector2(0, 0))
  const { viewport } = useThree()

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouseTgt.current.set(
        (e.clientX / window.innerWidth)  * 2 - 1,
        -((e.clientY / window.innerHeight) * 2 - 1)
      )
    }
    window.addEventListener("mousemove", onMove)
    return () => window.removeEventListener("mousemove", onMove)
  }, [])

  useFrame((state, delta) => {
    if (!matRef.current) return
    matRef.current.uniforms.uTime.value   += delta
    matRef.current.uniforms.uAspect.value  = state.viewport.width / state.viewport.height
    mouse.current.lerp(mouseTgt.current, delta * 1.8)
    matRef.current.uniforms.uMouse.value.copy(mouse.current)
  })

  return (
    <mesh>
      <planeGeometry args={[viewport.width, viewport.height]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        uniforms={{
          uTime:   { value: 0 },
          uAspect: { value: viewport.width / viewport.height },
          uMouse:  { value: new THREE.Vector2(0, 0) },
        }}
      />
    </mesh>
  )
}

export default function HeroVoronoi() {
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
      <Canvas camera={{ position: [0, 0, 1], fov: 75 }} gl={{ alpha: true }}>
        <VoronoiPlane />
        <EffectComposer>
          <Bloom luminanceThreshold={0.05} mipmapBlur intensity={0.5} />
        </EffectComposer>
      </Canvas>
    </div>
  )
}
