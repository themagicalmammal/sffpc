"use client";

import { useThree, Canvas } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import { useRef, useEffect, useMemo, useState, useCallback } from "react";
import * as THREE from "three";
import { cases, getCaseColor } from "@/lib/cases";
import { useStore } from "@/lib/store";

const SCALE = 0.01;
const SPACING = 0.5;



function useDragGlobal(
  draggingCase: boolean,
  name: string,
  offset: React.MutableRefObject<THREE.Vector3>,
  groundPlane: React.MutableRefObject<THREE.Plane>,
  setCasePosition: (name: string, pos: THREE.Vector3) => void,
  setDraggingCase: (name: string | null) => void,
  onDrop?: () => void
) {
  const { camera, gl } = useThree();

  const handlePointerMove = useCallback(
    (e: PointerEvent) => {
      if (!draggingCase) return;

      const rc = new THREE.Raycaster();
      const mouse = new THREE.Vector2(
        (e.clientX / window.innerWidth) * 2 - 1,
        -(e.clientY / window.innerHeight) * 2 + 1
      );
      rc.setFromCamera(mouse, camera);

      const target = new THREE.Vector3();
      rc.ray.intersectPlane(groundPlane.current, target);
      if (target) {
        const newPos = new THREE.Vector3(
          target.x - offset.current.x,
          0,
          target.z - offset.current.z
        );
        newPos.x = Math.max(0, newPos.x);
        newPos.z = Math.max(-5, Math.min(5, newPos.z));
        setCasePosition(name, newPos);
      }
    },
    [draggingCase, name, camera, setCasePosition]
  );

  const handlePointerUp = useCallback(
    (_e?: PointerEvent) => {
      if (!draggingCase) return;
      onDrop?.();
      (gl.domElement as HTMLCanvasElement & { releasePointerCapture: (id: number) => void })
        .releasePointerCapture(0);
      setDraggingCase(null);
    },
    [draggingCase, gl, onDrop, setDraggingCase]
  );

  useEffect(() => {
    if (!draggingCase) return;
    const canvas = gl.domElement as HTMLCanvasElement & {
      setPointerCapture: (id: number) => void;
      releasePointerCapture: (id: number) => void;
    };
    canvas.setPointerCapture(0);
    const onMove = (e: PointerEvent) => handlePointerMove(e as any);
    const onUp = (e: PointerEvent) => handlePointerUp(e as any);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerup", onUp);
    return () => {
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerup", onUp);
    };
  }, [draggingCase, gl, handlePointerMove, handlePointerUp]);
}

function CaseBox({ case: sffCase, index }: {
  case: typeof cases[0];
  index: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const color = getCaseColor(index);
  const { setDraggingCase, setCasePosition, casePositions, selectedCases } = useStore();
  const { camera } = useThree();
  const [hovered, setHovered] = useState(false);
  const [justDropped, setJustDropped] = useState(false);

  const boxW = sffCase.length * SCALE;
  const boxH = sffCase.height * SCALE;
  const boxD = sffCase.width * SCALE;

  useEffect(() => {
    if (!justDropped) return;
    const t = setTimeout(() => setJustDropped(false), 250);
    return () => clearTimeout(t);
  }, [justDropped]);

  const autoIndex = useMemo(() => {
    return selectedCases.findIndex((c) => c.name === sffCase.name);
  }, [selectedCases, sffCase.name]);

  const basePosition = useMemo(() => {
    const x = autoIndex * (Math.max(sffCase.length, sffCase.width) * SCALE + SPACING);
    return new THREE.Vector3(x, 0, 0);
  }, [autoIndex, sffCase]);

  const effectivePosition = casePositions[sffCase.name] ?? basePosition;
  const groundPlane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 1, 0), 0), []);
  const isDragging = useStore((s) => s.draggingCase === sffCase.name);

  // Global drag handler
  const dragOffsetRef = useRef<THREE.Vector3>(new THREE.Vector3());
  useDragGlobal(isDragging, sffCase.name, dragOffsetRef,
    { current: groundPlane }, setCasePosition, setDraggingCase, () => setJustDropped(true));

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    e.stopPropagation();

    setDraggingCase(sffCase.name);

    // Calculate offset from case center to click point on ground plane
    const rc = new THREE.Raycaster();
    const mouse = new THREE.Vector2(
      (e.nativeEvent.clientX / window.innerWidth) * 2 - 1,
      -(e.nativeEvent.clientY / window.innerHeight) * 2 + 1
    );
    rc.setFromCamera(mouse, camera);

    const intersection = new THREE.Vector3();
    rc.ray.intersectPlane(groundPlane, intersection);
    if (intersection) {
      dragOffsetRef.current.copy(intersection).sub(effectivePosition);
    }
  }, [sffCase.name, setDraggingCase, camera, groundPlane, effectivePosition]);

  return (
    <group position={effectivePosition}>
      <mesh
        ref={meshRef}
        position={[boxW / 2, boxH / 2, boxD / 2]}
        onClick={(e: React.MouseEvent) => {
          e.stopPropagation();
          useStore.setState({ selectedCase: sffCase });
        }}
        onPointerDown={handlePointerDown}
        onPointerOver={(e: React.PointerEvent) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={(e: React.PointerEvent) => {
          e.stopPropagation();
          setHovered(false);
          document.body.style.cursor = "auto";
        }}
      >
        <boxGeometry args={[boxW, boxH, boxD]} />
        <meshStandardMaterial
          color={hovered ? "#ffaa00" : justDropped ? "#ffffff" : color}
          transparent
          opacity={0.9}
        />
      </mesh>
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
  const casePositions = useStore((s) => s.casePositions);
  const allCases = useMemo(() => [...cases, ...customCases.map((c, i) => ({
    ...c,
    id: `custom-${i}`,
    length: parseFloat(c.length),
    width: parseFloat(c.width),
    height: parseFloat(c.height),
  })) as typeof cases[number][]], []);

  // Auto-adjust camera based on auto-layout positions (not dragged positions)
  const { camera } = useThree();
  useEffect(() => {
    if (selectedCases.length === 0) return;

    const autoPositions = selectedCases.map((caseData, idx) => {
      const sffCase = allCases.find((c) => c.name === caseData.name);
      if (!sffCase) return null;
      const x = idx * (Math.max(sffCase.length, sffCase.width) * SCALE + SPACING);
      return { x, case: sffCase };
    }).filter(Boolean) as Array<{ x: number; case: typeof cases[0] }>;

    const lastX = autoPositions[autoPositions.length - 1].x;
    const maxDim = Math.max(...autoPositions.map((s) =>
      Math.max(s.case.length, s.case.width, s.case.height) * SCALE
    ));
    const totalWidth = lastX + maxDim + 1;
    const totalHeight = Math.max(...autoPositions.map((s) => s.case.height * SCALE));

    const dist = Math.max(totalWidth * 2.0, 5);
    const camY = Math.max(totalHeight * 1.2, 1.5);
    camera.position.set(totalWidth / 2, camY, dist);
    camera.lookAt(totalWidth / 2, totalHeight * 0.5, 0);
    camera.zoom = 1;
    camera.updateProjectionMatrix();
  }, [selectedCases, allCases, camera]);

  // Center ground plane
  const centerPos = useMemo(() => {
    const autoPositions = selectedCases.map((caseData, idx) => {
      const sffCase = allCases.find((c) => c.name === caseData.name);
      if (!sffCase) return 0;
      return idx * (Math.max(sffCase.length, sffCase.width) * SCALE + SPACING);
    });
    if (autoPositions.length === 0) return 0;
    return autoPositions.reduce((a, b) => a + b, 0) / autoPositions.length;
  }, [selectedCases, allCases]);

  if (selectedCases.length === 0) {
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
      {selectedCases.map((caseData) => {
        const sffCase = allCases.find((c) => c.name === caseData.name);
        if (!sffCase) return null;
        const index = cases.findIndex((c) => c.id === sffCase.id) >= 0
          ? cases.findIndex((c) => c.id === sffCase.id)
          : cases.length + customCases.findIndex((c) => c.name === sffCase.name);
        return (
          <CaseBox
            key={sffCase.id}
            case={sffCase}
            index={index}
          />
        );
      })}
      {/* Ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[centerPos, -0.01, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#f0f0f0" transparent opacity={0.3} />
      </mesh>
      {/* Grid helper */}
      <gridHelper args={[20, 20, "#cccccc", "#eeeeee"]} position={[centerPos, 0.001, 0]} />
    </>
  );
}

export default function Viewer() {
  return (
    <div className="w-full h-screen bg-black">
      <Canvas camera={{ fov: 60, near: 0.1, far: 1000 }} style={{ width: "100%", height: "100%" }}>
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
