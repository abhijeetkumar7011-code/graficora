"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useTheme } from "@/components/useTheme";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Float,
  RoundedBox,
  MeshDistortMaterial,
  Sparkles,
  Environment,
  Lightformer,
} from "@react-three/drei";
import * as THREE from "three";

// Per-theme colours. The context is provided *inside* <Canvas> (React context does not cross the R3F boundary).
const PALETTES = {
  dark: {
    colors: ["#8b5cf6", "#ec4899", "#fb923c"],
    core: "#ec4899",
    coreGlow: "#8b5cf6",
    track: "#c4b5fd",
    trackBeads: "#f9a8d4",
    sparkle: "#f0abfc",
    ambient: 0.5,
    lights: ["#8b5cf6", "#ec4899", "#fb923c"],
    env: ["#8b5cf6", "#ec4899", "#fb923c", "#ffffff"],
  },
  light: {
    colors: ["#2563eb", "#ec4899", "#f97316"],
    core: "#ec4899",
    coreGlow: "#2563eb",
    track: "#7c3aed",
    trackBeads: "#fb923c",
    sparkle: "#f472b6",
    ambient: 0.9,
    lights: ["#60a5fa", "#f472b6", "#fb923c"],
    env: ["#60a5fa", "#f472b6", "#fb923c", "#ffffff"],
  },
};
const PalCtx = createContext(PALETTES.dark);

// shared, mutable — updated from window events, read inside useFrame (no re-renders)
const mouse = { x: 0, y: 0 };
const motion = { speed: 1 };

function Glossy({ color, ...rest }) {
  return (
    <meshPhysicalMaterial
      color={color}
      metalness={0.55}
      roughness={0.18}
      clearcoat={1}
      clearcoatRoughness={0.1}
      envMapIntensity={1.3}
      {...rest}
    />
  );
}

/* ------------------------------ objects ------------------------------ */

// Stylised generic mirrorless camera (no brand marks)
function CameraModel() {
  return (
    <group scale={0.85}>
      <RoundedBox args={[1.7, 1.05, 0.75]} radius={0.14} smoothness={6}>
        <meshPhysicalMaterial color="#4a4a6a" metalness={0.65} roughness={0.28} clearcoat={1} envMapIntensity={1.8} />
      </RoundedBox>
      <RoundedBox args={[0.5, 1.05, 0.9]} radius={0.14} smoothness={6} position={[0.65, 0, 0.08]}>
        <meshStandardMaterial color="#2a2a40" roughness={0.6} metalness={0.3} />
      </RoundedBox>
      <RoundedBox args={[0.55, 0.28, 0.45]} radius={0.08} smoothness={4} position={[-0.35, 0.65, -0.05]}>
        <meshStandardMaterial color="#4a4a6a" metalness={0.6} roughness={0.35} />
      </RoundedBox>
      <mesh position={[-0.12, 0, 0.62]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.42, 0.46, 0.55, 48]} />
        <meshStandardMaterial color="#0c0c12" metalness={0.9} roughness={0.25} />
      </mesh>
      <mesh position={[-0.12, 0, 0.9]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.43, 0.04, 16, 64]} />
        <meshStandardMaterial color="#ec4899" emissive="#ec4899" emissiveIntensity={0.9} />
      </mesh>
      <mesh position={[-0.12, 0, 0.89]}>
        <circleGeometry args={[0.36, 48]} />
        <meshPhysicalMaterial color="#6d28d9" metalness={1} roughness={0.05} iridescence={1} clearcoat={1} envMapIntensity={2} />
      </mesh>
      <mesh position={[0.55, 0.38, 0.4]}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshStandardMaterial color="#ff2d55" emissive="#ff2d55" emissiveIntensity={2} />
      </mesh>
    </group>
  );
}

function PenModel({ color }) {
  return (
    <group rotation={[0, 0, -0.6]} scale={0.95}>
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.16, 0.16, 1.1, 32]} />
        <Glossy color={color} />
      </mesh>
      <mesh position={[0, -0.27, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[0.16, 0.45, 32]} />
        <meshStandardMaterial color="#e5e7eb" metalness={1} roughness={0.18} />
      </mesh>
      <mesh position={[0, -0.52, 0]}>
        <sphereGeometry args={[0.03, 12, 12]} />
        <meshStandardMaterial color="#fff" emissive="#fff" emissiveIntensity={1.5} />
      </mesh>
    </group>
  );
}

function FrameModel({ color }) {
  return (
    <group>
      <RoundedBox args={[1.3, 1.8, 0.08]} radius={0.06} smoothness={4}>
        <Glossy color={color} />
      </RoundedBox>
      <RoundedBox args={[1.05, 1.5, 0.1]} radius={0.04} smoothness={4} position={[0, 0, 0.01]}>
        <meshStandardMaterial color="#0f0f1a" roughness={0.6} metalness={0.3} />
      </RoundedBox>
      <mesh position={[0, 0.2, 0.07]}>
        <circleGeometry args={[0.3, 40]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.7} />
      </mesh>
      <mesh position={[0, -0.45, 0.07]}>
        <planeGeometry args={[0.7, 0.07]} />
        <meshStandardMaterial color="#fff" emissive="#fff" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[-0.13, -0.6, 0.07]}>
        <planeGeometry args={[0.44, 0.05]} />
        <meshStandardMaterial color="#fff" emissive="#fff" emissiveIntensity={0.3} />
      </mesh>
    </group>
  );
}

function Shape({ kind, color }) {
  switch (kind) {
    case "camera":
      return <CameraModel />;
    case "pen":
      return <PenModel color={color} />;
    case "frame":
      return <FrameModel color={color} />;
    case "knot":
      return (
        <mesh>
          <torusKnotGeometry args={[0.5, 0.16, 140, 24]} />
          <Glossy color={color} />
        </mesh>
      );
    case "ico":
      return (
        <mesh>
          <icosahedronGeometry args={[0.72, 0]} />
          <Glossy color={color} flatShading />
        </mesh>
      );
    case "octa":
      return (
        <mesh>
          <octahedronGeometry args={[0.75, 0]} />
          <Glossy color={color} flatShading />
        </mesh>
      );
    case "torus":
      return (
        <mesh>
          <torusGeometry args={[0.55, 0.21, 24, 72]} />
          <Glossy color={color} />
        </mesh>
      );
    default:
      return (
        <mesh>
          <sphereGeometry args={[0.6, 48, 48]} />
          <Glossy color={color} />
        </mesh>
      );
  }
}

// camera & frame keep their face pointing outward; the rest tumble
function Item({ kind, color }) {
  const ref = useRef();
  const spin = kind === "camera" || kind === "frame" ? 0 : 0.9;
  useFrame((_, dt) => {
    if (spin) ref.current.rotation.y += dt * spin * motion.speed;
  });
  return (
    <group ref={ref}>
      <Shape kind={kind} color={color} />
    </group>
  );
}

/* ------------------------------ orbits ------------------------------ */

const ITEMS = ["camera", "frame", "knot", "pen", "ico", "swatch", "torus", "octa"];

function MainOrbit({ radius = 4 }) {
  const pal = useContext(PalCtx);
  const ring = useRef();
  useFrame((_, dt) => {
    ring.current.rotation.y += dt * 0.28 * motion.speed;
  });
  return (
    <group ref={ring}>
      {ITEMS.map((kind, i) => {
        const a = (i / ITEMS.length) * Math.PI * 2;
        return (
          <group
            key={kind}
            position={[Math.cos(a) * radius, Math.sin(i * 2.1) * 0.5, Math.sin(a) * radius]}
            rotation={[0, Math.PI / 2 - a, 0]}
          >
            <Float speed={2} rotationIntensity={0.2} floatIntensity={0.7}>
              <Item kind={kind} color={pal.colors[i % 3]} />
            </Float>
          </group>
        );
      })}
      {/* glowing track */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[radius, 0.012, 16, 220]} />
        <meshBasicMaterial color={pal.track} transparent opacity={0.55} />
      </mesh>
    </group>
  );
}

function BeadOrbit({ radius = 2.5, count = 14 }) {
  const pal = useContext(PalCtx);
  const ring = useRef();
  useFrame((_, dt) => {
    ring.current.rotation.y -= dt * 0.55 * motion.speed;
  });
  return (
    <group ref={ring} rotation={[0.25, 0, 0]}>
      {Array.from({ length: count }).map((_, i) => {
        const a = (i / count) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(a) * radius, 0, Math.sin(a) * radius]}>
            <sphereGeometry args={[i % 3 === 0 ? 0.1 : 0.06, 16, 16]} />
            <meshStandardMaterial
              color={pal.colors[i % 3]}
              emissive={pal.colors[i % 3]}
              emissiveIntensity={1.6}
            />
          </mesh>
        );
      })}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[radius, 0.008, 12, 160]} />
        <meshBasicMaterial color={pal.trackBeads} transparent opacity={0.4} />
      </mesh>
    </group>
  );
}

function CoreOrb() {
  const pal = useContext(PalCtx);
  return (
    <Float speed={2.2} rotationIntensity={0.5} floatIntensity={0.6}>
      <mesh>
        <icosahedronGeometry args={[1.2, 24]} />
        <MeshDistortMaterial
          color={pal.core}
          emissive={pal.coreGlow}
          emissiveIntensity={0.35}
          distort={0.45}
          speed={2}
          roughness={0.12}
          metalness={0.45}
          clearcoat={1}
          envMapIntensity={1.4}
        />
      </mesh>
    </Float>
  );
}

/* ------------------------------ scene ------------------------------ */

function Scene({ theme }) {
  const pal = PALETTES[theme];
  const group = useRef();
  const { viewport } = useThree();
  const s = THREE.MathUtils.clamp(Math.min(viewport.width, viewport.height) / 11.5, 0.45, 1);

  useFrame((_, dt) => {
    const g = group.current;
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, 0.42 - mouse.y * 0.16, 3, dt);
    g.rotation.z = THREE.MathUtils.damp(g.rotation.z, -0.26 + mouse.x * 0.1, 3, dt);
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, mouse.x * 0.25, 3, dt);
  });

  return (
    <>
      <ambientLight intensity={pal.ambient} />
      <pointLight position={[-6, 4, 5]} intensity={90} color={pal.lights[0]} />
      <pointLight position={[6, -3, 6]} intensity={80} color={pal.lights[1]} />
      <pointLight position={[0, 6, -4]} intensity={60} color={pal.lights[2]} />

      <Environment key={theme} resolution={256}>
        <Lightformer form="rect" intensity={4} color={pal.env[0]} position={[-5, 3, -2]} scale={[8, 4, 1]} />
        <Lightformer form="rect" intensity={3} color={pal.env[1]} position={[5, -1, 3]} scale={[6, 6, 1]} />
        <Lightformer form="ring" intensity={4} color={pal.env[2]} position={[0, 5, 5]} scale={5} />
        <Lightformer form="rect" intensity={2} color={pal.env[3]} position={[0, 0, 8]} scale={[10, 2, 1]} />
      </Environment>

      <group ref={group} scale={s} position={[0, 0.5, 0]} rotation={[0.42, 0, -0.26]}>
        <CoreOrb />
        <BeadOrbit />
        <MainOrbit />
      </group>

      <Sparkles count={90} scale={[14, 9, 8]} size={3} speed={0.4} color={pal.sparkle} opacity={0.8} />
    </>
  );
}

export default function Hero3D({ active = true }) {
  const theme = useTheme();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const onMove = (e) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const applyMotion = () => (motion.speed = mq.matches ? 0.15 : 1);
    applyMotion();
    window.addEventListener("pointermove", onMove);
    mq.addEventListener("change", applyMotion);
    return () => {
      window.removeEventListener("pointermove", onMove);
      mq.removeEventListener("change", applyMotion);
    };
  }, []);

  return (
    <div className={`h-full w-full transition-opacity duration-[1400ms] ${ready ? "opacity-100" : "opacity-0"}`}>
      <Canvas
        camera={{ position: [0, 0, 12], fov: 42 }}
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        frameloop={active ? "always" : "never"}
        onCreated={() => setReady(true)}
      >
        <PalCtx.Provider value={PALETTES[theme]}>
          <Scene theme={theme} />
        </PalCtx.Provider>
      </Canvas>
    </div>
  );
}
