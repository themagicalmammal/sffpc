"use client";

import { useThree, Canvas } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import { useRef, useEffect, useMemo } from "react";
import * as THREE from "three";
import { cases, getCaseColor } from "@/lib/cases";
import { useStore } from "@/lib/store";

interface CaseBoxProps {
  case: typeof cases[0];
  index: number;
  position: THREE.Vector3;
}

function CaseBox({ case: sffCase, index, position }: CaseBoxProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const scale = 0.01; // Scale mm to a reasonable size
  const color = getCaseColor(index);

  const boxW = sffCase.length * scale;
  const boxH = sffCase.height * scale;
  const boxD = sffCase.width * scale;

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        position={[boxW / 2, boxH / 2, boxD / 2]}
        onClick={(e) => {
          e.stopPropagation();
          useStore.setState({ selectedCase: sffCase });
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          document.body.style.cursor = "auto";
        }}
      >
        <boxGeometry args={[boxW, boxH, boxD]} />
        <meshStandardMaterial color={color} transparent opacity={0.9} />
      </mesh>
      {/* Label on the front face */}
      <Html position={[boxW / 2, boxH + 0.05, boxD / 2]} center style={{ pointerEvents: 'none' }}>
        <div style={{
          background: "rgba(0,0,0,0.7)",
          color: "white",
          padding: "2px 6px",
          borderRadius: "4px",
          whiteSpace: "nowrap",
          fontSize: "10px",
          lineHeight: "1.2",
        }}>
          <div style={{ fontWeight: "bold" }}>{sffCase.name}</div>
          <div>{sffCase.length}×{sffCase.width}×{sffCase.height}mm</div>
        </div>
      </Html>
    </group>
  );
}

function Scene() {
  const selectedCases = useStore((s) => s.selectedCases);
  const customCases = useStore((s) => s.customCases);
  const allCases = useMemo(() => [...cases, ...customCases.map((c, i) => ({
    ...c,
    id: `custom-${i}`,
    length: parseFloat(c.length),
    width: parseFloat(c.width),
    height: parseFloat(c.height),
  })) as typeof cases[number][]], []);

  const scaledCases = useMemo(() => {
    const scale = 0.01;
    const spacing = 0.5; // Space between cases
    return selectedCases.map((caseData, idx) => {
      const sffCase = allCases.find((c) => c.name === caseData.name);
      if (!sffCase) return null;
      const x = idx * (Math.max(sffCase.length, sffCase.width) * scale + spacing);
      return { case: sffCase, position: new THREE.Vector3(x, 0, 0) };
    }).filter(Boolean) as Array<{ case: typeof cases[0]; position: THREE.Vector3 }>;
  }, [selectedCases, allCases]);

  // Auto-adjust camera
  const { camera } = useThree();
  useEffect(() => {
    if (scaledCases.length > 0) {
      const lastPos = scaledCases[scaledCases.length - 1].position.x;
      const maxDim = Math.max(...scaledCases.map((s) =>
        Math.max(s.case.length, s.case.width, s.case.height) * 0.01
      ));
      const totalWidth = lastPos + maxDim + 1;
      const totalHeight = Math.max(...scaledCases.map((s) => s.case.height)) * 0.01;
      // Place camera at a distance proportional to the scene width
      const dist = Math.max(totalWidth * 0.8, 3);
      camera.position.set(totalWidth / 2, totalHeight * 0.6, dist);
      camera.lookAt(totalWidth / 2, totalHeight * 0.4, 0);
      camera.zoom = 1;
      camera.updateProjectionMatrix();
    }
  }, [scaledCases, selectedCases.length, camera]);

  if (scaledCases.length === 0) {
    return (
      <group>
        <mesh position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[10, 10]} />
          <meshStandardMaterial color="#e0e0e0" />
        </mesh>
        <Html position={[0, 0.3, 0]} center>
          <div style={{
            background: "rgba(0,0,0,0.6)",
            color: "white",
            padding: "8px 16px",
            borderRadius: "8px",
            textAlign: "center",
          }}>
            <p>Add cases from the selector to start comparing</p>
          </div>
        </Html>
      </group>
    );
  }

  return (
    <>
      {scaledCases.map(({ case: sffCase, position }, idx) => (
        <CaseBox
          key={sffCase.id}
          case={sffCase}
          index={cases.findIndex((c) => c.id === sffCase.id) >= 0
            ? cases.findIndex((c) => c.id === sffCase.id)
            : cases.length + customCases.findIndex((c) => c.name === sffCase.name)}
          position={position}
        />
      ))}
      {/* Ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[
        scaledCases.reduce((acc, s) => acc + s.position.x, 0) / scaledCases.length,
        0,
        0,
      ]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#f0f0f0" transparent opacity={0.5} />
      </mesh>
      {/* Grid helper */}
      <gridHelper args={[20, 20, "#cccccc", "#eeeeee"]} position={[
        scaledCases.reduce((acc, s) => acc + s.position.x, 0) / scaledCases.length,
        0.001,
        0,
      ]} />
    </>
  );
}

export default function Viewer() {
  return (
    <div className="w-full h-screen bg-black">
      <Canvas camera={{ fov: 50, near: 0.1, far: 1000 }} style={{ width: "100%", height: "100%" }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 10, 5]} intensity={1} />
        <directionalLight position={[-5, 5, -5]} intensity={0.5} />
        <Scene />
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={0.5}
          maxDistance={20}
        />
      </Canvas>
    </div>
  );
}
