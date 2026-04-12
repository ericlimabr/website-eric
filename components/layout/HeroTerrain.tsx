"use client"

import { useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { EffectComposer, Bloom } from "@react-three/postprocessing"
import * as THREE from "three"

const vertexShader = /* glsl */ `
  uniform float uTime;
  varying  float vHeight;

  // Gradient noise (Perlin-like)
  vec2 hash2(vec2 p) {
    p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
    return -1.0 + 2.0 * fract(sin(p) * 43758.5453);
  }
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(dot(hash2(i + vec2(0,0)), f - vec2(0,0)),
          dot(hash2(i + vec2(1,0)), f - vec2(1,0)), u.x),
      mix(dot(hash2(i + vec2(0,1)), f - vec2(0,1)),
          dot(hash2(i + vec2(1,1)), f - vec2(1,1)), u.x),
      u.y
    );
  }
  float fbm(vec2 p) {
    return noise(p)        * 0.55
         + noise(p * 2.1)  * 0.28
         + noise(p * 4.3)  * 0.12
         + noise(p * 9.1)  * 0.05;
  }

  void main() {
    vec3 pos = position;

    // Scroll forward over time
    vec2 noiseUV = vec2(pos.x * 0.18, pos.z * 0.18 - uTime * 0.38);
    float h = fbm(noiseUV);
    pos.y += h * 3.2;
    vHeight = h;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`

const fragmentShader = /* glsl */ `
  varying float vHeight;

  void main() {
    // Dim base, bright peaks — peaks bloom
    float brightness = 0.25 + max(0.0, vHeight) * 1.4;
    gl_FragColor = vec4(0.0, brightness, brightness, 1.0);
  }
`

function Terrain() {
  const matRef = useRef<THREE.ShaderMaterial>(null)

  useFrame((_, delta) => {
    if (matRef.current) matRef.current.uniforms.uTime.value += delta
  })

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.5, -20]}>
      <planeGeometry args={[55, 100, 90, 160]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        wireframe
        uniforms={{ uTime: { value: 0 } }}
      />
    </mesh>
  )
}

export default function HeroTerrain() {
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
      <Canvas camera={{ position: [0, 6, 18], fov: 60 }} gl={{ alpha: true }}>
        <Terrain />
        <EffectComposer>
          <Bloom luminanceThreshold={0.15} mipmapBlur intensity={1.6} />
        </EffectComposer>
      </Canvas>
    </div>
  )
}
