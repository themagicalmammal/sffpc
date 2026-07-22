"use client";

import { useRef, useMemo, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  Grid,
  Text as DreiText,
  Box,
} from "@react-three/drei";
import * as THREE from "three";
import { useStore, type CustomCase } from "@/lib/store";
import { cases, getCaseColor } from "@/lib/cases";

type AnyCase = NonNullable<(typeof cases)[number]> | CustomCase;

// Scale factor: 1 unit = 1mm
const SCALE = 0.01;

function CaseBox({
  caseData,
  index,
  offset,
}: {
  caseData: AnyCase;
  index: number;
  offset: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  const color = getCaseColor(index);
  const w = caseData.width * SCALE;
  const h = caseData.height * SCALE;
  const l = caseData.length * SCALE;

  useFrame((_state, delta) => {
    if (meshRef.current && hovered) {
      meshRef.current.position.y = h / 2 + 0.05 + Math.sin(delta * 3) * 0.01;
    }
  });

  return (
    <group position={[offset, 0, 0]}>
      <Box
        ref={meshRef}
        args={[w, h, l]}
        position={[0, h / 2, 0]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial
          color={hovered ? "#fbbf24" : color}
          roughness={0.4}
          metalness={0.3}
        />
      </Box>
      {/* Edge wireframe for clarity */}
      <Box args={[w + 0.001, h + 0.001, l + 0.001]}>
        <meshBasicMaterial color="white" wireframe transparent opacity={0.15} />
      </Box>
      {/* Label */}
      <DreiText
        position={[0, h + 0.08, 0]}
        fontSize={0.08}
        color="white"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.005}
        outlineColor="black"
      >
        {caseData.name.length > 18 ? caseData.name.slice(0, 16) + "…" : caseData.name}
      </DreiText>
      {/* Dimensions label */}
      <DreiText
        position={[0, h + 0.02, 0]}
        fontSize={0.04}
        color="rgba(255,255,255,0.6)"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.003}
        outlineColor="black"
      >
        {caseData.length}×{caseData.width}×{caseData.height}mm
      </DreiText>
    </group>
  );
}

export default function Viewer() {
  const selected = useStore((s) => s.selected);
  const entries = Array.from(selected.entries());

  // Calculate spacing
  const caseSpacing = useMemo(() => {
    if (entries.length === 0) return 0;
    const maxDim = Math.max(
      ...entries.map(([, c]) => Math.max(c.length, c.width, c.height))
    );
    return Math.max(maxDim, 200) * SCALE + 0.05;
  }, [entries]);

  return (
    <div className="w-full h-full min-h-[60vh] rounded-2xl overflow-hidden shadow-2xl border border-white/10" style={{ background: "linear-gradient(180deg, #0f172a 0%, #1e293b 100%)" }}>
      <Canvas
        shadows
        camera={{ position: [5, 4, 5], fov: 50 }}
        gl={{ antialias: true, alpha: false }}
      >
        {/* Lights */}
        <ambientLight intensity={0.4} />
        <directionalLight
          position={[10, 15, 10]}
          intensity={1.2}
          castShadow
          shadow-mapSize={[2048, 2048]}
        />
        <directionalLight position={[-5, 5, -5]} intensity={0.3} color="#93c5fd" />
        <pointLight position={[0, 8, 0]} intensity={0.5} color="#fde68a" />

        {/* Grid */}
        <Grid
          position={[0, 0, 0]}
          cellSize={0.5}
          cellThickness={0.3}
          sectionSize={2}
          fadeDistance={15}
        />

        {/* Case boxes */}
        {entries.map(([id, caseData], i) => (
          <CaseBox
            key={id}
            caseData={caseData}
            index={i}
            offset={(i - (entries.length - 1) / 2) * caseSpacing}
          />
        ))}

        {/* Empty state text */}
        {entries.length === 0 && (
          <DreiText
            position={[0, 1.5, 0]}
            fontSize={0.2}
            color="rgba(255,255,255,0.3)"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.01}
            outlineColor="black"
          >
            Select cases to compare
          </DreiText>
        )}

        {/* Controls */}
        <OrbitControls
          makeDefault
          minPolarAngle={0}
          maxPolarAngle={Math.PI / 2}
          minDistance={2}
          maxDistance={20}
          enablePan={true}
        />
      </Canvas>
    </div>
  );
}
