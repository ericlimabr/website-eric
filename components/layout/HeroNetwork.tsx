"use client"

import { useEffect, useRef, useState, useMemo } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { EffectComposer, Bloom } from "@react-three/postprocessing"
import * as THREE from "three"
import { forceSimulation, forceLink, forceManyBody, forceCenter } from "d3-force-3d"

const NODE_COUNT = 20
const colorCyan = new THREE.Color("#00ffff")
const colorDim  = new THREE.Color("#003333")

interface NodeData {
  id: string
  group: number
  x: number
  y: number
  z: number
}

// Store links as plain IDs — never rely on d3's mutated source/target references
interface LinkData {
  sourceId: string
  targetId: string
}

function NetworkScene() {
  const groupRef = useRef<THREE.Group>(null)
  const [nodes, setNodes] = useState<NodeData[]>([])
  const [links, setLinks] = useState<LinkData[]>([])
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)

  useEffect(() => {
    const initialNodes: NodeData[] = Array.from({ length: NODE_COUNT }, (_, i) => ({
      id: `node-${i}`,
      group: i === 0 ? 0 : i < 4 ? 1 : 2,
      x: (Math.random() - 0.5) * 10,
      y: (Math.random() - 0.5) * 10,
      z: 0,
    }))

    const rawLinks: { source: string; target: string }[] = []
    for (let i = 1; i < 4; i++) rawLinks.push({ source: "node-0", target: `node-${i}` })
    let w = 4
    for (let i = 1; i < 4; i++) {
      for (let j = 0; j < 5; j++) {
        if (w < NODE_COUNT) { rawLinks.push({ source: `node-${i}`, target: `node-${w}` }); w++ }
      }
    }

    // Capture IDs before d3 mutates source/target into node object references
    const resolvedLinks: LinkData[] = rawLinks.map((l) => ({
      sourceId: l.source,
      targetId: l.target,
    }))

    // Run 2D force layout for natural x/y clustering
    forceSimulation(initialNodes)
      .numDimensions(2)
      .force("link", forceLink(rawLinks).id((d: unknown) => (d as NodeData).id).distance(2))
      .force("charge", forceManyBody<NodeData>().strength(-30))
      .force("center", forceCenter<NodeData>(0, 0, 0))
      .stop()
      .tick(150)

    // Apply explicit z-spread — d3 link forces always collapse z
    const nodesWithZ = initialNodes.map((n) => ({
      ...n,
      z: (Math.random() - 0.5) * 10,
    }))

    setNodes(nodesWithZ)
    setLinks(resolvedLinks)
  }, [])

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.001
      groupRef.current.rotation.x += 0.0005
    }
  })

  const linesGeometry = useMemo(() => {
    if (!nodes.length || !links.length) return null
    const nodeMap = new Map(nodes.map((n) => [n.id, n]))
    const points: THREE.Vector3[] = []

    for (const link of links) {
      const src = nodeMap.get(link.sourceId)
      const tgt = nodeMap.get(link.targetId)
      if (src && tgt) {
        points.push(new THREE.Vector3(src.x, src.y, src.z))
        points.push(new THREE.Vector3(tgt.x, tgt.y, tgt.z))
      }
    }

    return new THREE.BufferGeometry().setFromPoints(points)
  }, [nodes, links])

  useEffect(() => () => { linesGeometry?.dispose() }, [linesGeometry])

  return (
    <group ref={groupRef}>
      {nodes.map((node) => {
        const isHovered = hoveredNode === node.id
        const isDimmed  = hoveredNode !== null && !isHovered
        const size = node.group === 0 ? 0.4 : node.group === 1 ? 0.2 : 0.1

        return (
          <mesh
            key={node.id}
            position={[node.x, node.y, node.z]}
            onPointerOver={(e) => { e.stopPropagation(); setHoveredNode(node.id) }}
            onPointerOut={() => setHoveredNode(null)}
          >
            <sphereGeometry args={[size, 16, 16]} />
            <meshStandardMaterial
              color={isDimmed ? colorDim : colorCyan}
              emissive={isDimmed ? colorDim : colorCyan}
              emissiveIntensity={isHovered ? 3 : 1}
            />
          </mesh>
        )
      })}

      {linesGeometry && (
        <lineSegments geometry={linesGeometry}>
          <lineBasicMaterial color={colorCyan} transparent opacity={0.2} />
        </lineSegments>
      )}
    </group>
  )
}

export default function HeroNetwork() {
  return (
    <div style={{
      width: "100%",
      height: "100vh",
      position: "absolute",
      top: 0,
      left: 0,
      zIndex: 0,
      pointerEvents: "none",
    }}>
      <Canvas camera={{ position: [0, 0, 12] }} gl={{ alpha: true }}>
        <ambientLight intensity={0.2} />
        <NetworkScene />
        <EffectComposer>
          <Bloom luminanceThreshold={0.1} mipmapBlur intensity={1.5} />
        </EffectComposer>
      </Canvas>
    </div>
  )
}
