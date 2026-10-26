"use client";

import { Component, Suspense, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { OrbitControls, Environment, Lightformer, ContactShadows, useGLTF, useProgress } from "@react-three/drei";
import * as THREE from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import { useTheme } from "@/components/useTheme";

/**
 * Generic 3D viewer. Give it a model from `models` in lib/content.js:
 *   { file: "/models/thing.glb" }   -> real file (glb, gltf, obj, stl, fbx; picked from the extension)
 *   { shape: "knot" }                -> built-in procedural demo (knot, gyro, crystal, vase)
 * Everything is auto-centred and auto-scaled, so any file size/unit works.
 */

const PALETTES = {
  dark: {
    colors: ["#8b5cf6", "#ec4899", "#fb923c"],
    ambient: 0.55,
    env: ["#8b5cf6", "#ec4899", "#fb923c", "#ffffff"],
    shadow: "#000000",
  },
  light: {
    colors: ["#2563eb", "#ec4899", "#f97316"],
    ambient: 0.95,
    env: ["#60a5fa", "#f472b6", "#fb923c", "#ffffff"],
    shadow: "#6d28d9",
  },
};

export const formatOf = (m) => {
  if (m.format) return m.format.toLowerCase();
  if (!m.file) return "procedural";
  return (m.file.split("?")[0].split(".").pop() || "").toLowerCase();
};

function Clay({ color, ...rest }) {
  return (
    <meshPhysicalMaterial color={color} metalness={0.45} roughness={0.22} clearcoat={1} clearcoatRoughness={0.1} envMapIntensity={1.3} {...rest} />
  );
}

/* --------------------------- procedural demos --------------------------- */

function Knot({ pal }) {
  return (
    <mesh>
      <torusKnotGeometry args={[1, 0.34, 220, 32]} />
      <Clay color={pal.colors[1]} />
    </mesh>
  );
}

function Gyro({ pal }) {
  const a = useRef();
  const b = useRef();
  const c = useRef();
  useFrame((_, dt) => {
    a.current.rotation.x += dt * 0.7;
    b.current.rotation.y += dt * 0.9;
    c.current.rotation.z += dt * 1.2;
  });
  return (
    <group>
      <mesh ref={a}>
        <torusGeometry args={[1.5, 0.07, 24, 120]} />
        <Clay color={pal.colors[0]} />
      </mesh>
      <mesh ref={b}>
        <torusGeometry args={[1.15, 0.07, 24, 120]} />
        <Clay color={pal.colors[1]} />
      </mesh>
      <mesh ref={c}>
        <torusGeometry args={[0.8, 0.07, 24, 120]} />
        <Clay color={pal.colors[2]} />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.38, 48, 48]} />
        <Clay color="#ffffff" emissive={pal.colors[1]} emissiveIntensity={0.35} />
      </mesh>
    </group>
  );
}

function Crystal({ pal }) {
  return (
    <group>
      <mesh>
        <icosahedronGeometry args={[1.2, 1]} />
        <Clay color={pal.colors[0]} flatShading transmission={0.2} />
      </mesh>
      <mesh rotation={[0.6, 0.4, 0]}>
        <octahedronGeometry args={[0.7, 0]} />
        <Clay color={pal.colors[2]} flatShading emissive={pal.colors[2]} emissiveIntensity={0.5} />
      </mesh>
    </group>
  );
}

function Vase({ pal }) {
  const points = useMemo(() => {
    const pts = [];
    for (let i = 0; i <= 40; i++) {
      const t = i / 40;
      const r = 0.45 + 0.55 * Math.sin(t * Math.PI * 0.95 + 0.25) * (1 - 0.35 * t) + 0.12 * Math.sin(t * 18);
      pts.push(new THREE.Vector2(Math.max(r, 0.06), t * 2.6 - 1.3));
    }
    return pts;
  }, []);
  return (
    <mesh>
      <latheGeometry args={[points, 96]} />
      <Clay color={pal.colors[2]} side={THREE.DoubleSide} />
    </mesh>
  );
}

const SHAPES = { knot: Knot, gyro: Gyro, crystal: Crystal, vase: Vase };

/* ------------------------------ file loaders ------------------------------ */

function GLTFModel({ url }) {
  const { scene } = useGLTF(url);
  const obj = useMemo(() => scene.clone(true), [scene]);
  return <primitive object={obj} />;
}

function OBJModel({ url, pal }) {
  const src = useLoader(OBJLoader, url);
  const obj = useMemo(() => {
    const o = src.clone(true);
    // OBJ has no PBR materials: give untextured meshes a nice glossy one
    o.traverse((n) => {
      if (n.isMesh && !(n.material && n.material.map)) n.material = new THREE.MeshPhysicalMaterial({ color: pal.colors[1], metalness: 0.4, roughness: 0.25, clearcoat: 1 });
    });
    return o;
  }, [src, pal]);
  return <primitive object={obj} />;
}

function STLModel({ url, pal }) {
  const geo = useLoader(STLLoader, url);
  useMemo(() => {
    if (!geo.attributes.normal) geo.computeVertexNormals();
  }, [geo]);
  return (
    <mesh geometry={geo}>
      <Clay color={pal.colors[1]} />
    </mesh>
  );
}

function FBXModel({ url }) {
  const src = useLoader(FBXLoader, url);
  const obj = useMemo(() => src.clone(true), [src]);
  return <primitive object={obj} />;
}

function ModelBody({ model, pal }) {
  const fmt = formatOf(model);
  if (!model.file) {
    const Shape = SHAPES[model.shape] || Knot;
    return <Shape pal={pal} />;
  }
  if (fmt === "glb" || fmt === "gltf") return <GLTFModel url={model.file} />;
  if (fmt === "obj") return <OBJModel url={model.file} pal={pal} />;
  if (fmt === "stl") return <STLModel url={model.file} pal={pal} />;
  if (fmt === "fbx") return <FBXModel url={model.file} />;
  throw new Error(`Unsupported 3D format ".${fmt}" (use glb, gltf, obj, stl or fbx)`);
}

/* ------------------------- centre + scale to fit ------------------------- */

const TARGET = 3.1; // the longest side of any model becomes this many units

function Fit({ children, wireframe, onFloor }) {
  const outer = useRef();
  const inner = useRef();

  useLayoutEffect(() => {
    const o = outer.current;
    const i = inner.current;
    o.scale.setScalar(1);
    i.position.set(0, 0, 0);
    i.updateWorldMatrix(true, true);
    const box = new THREE.Box3().setFromObject(i);
    if (box.isEmpty()) return;
    const size = box.getSize(new THREE.Vector3());
    const c = box.getCenter(new THREE.Vector3());
    const s = TARGET / Math.max(size.x, size.y, size.z, 1e-6);
    o.scale.setScalar(s);
    i.position.set(-c.x, -c.y, -c.z);
    onFloor(-(size.y * s) / 2 - 0.15);
  }, [children, onFloor]);

  // wireframe switch touches every material on the model
  useEffect(() => {
    const mats = [];
    inner.current.traverse((n) => {
      if (!n.isMesh) return;
      (Array.isArray(n.material) ? n.material : [n.material]).forEach((m) => m && mats.push(m));
    });
    mats.forEach((m) => {
      m.wireframe = wireframe;
      m.needsUpdate = true;
    });
    return () => mats.forEach((m) => (m.wireframe = false));
  }, [wireframe, children]);

  return (
    <group ref={outer}>
      <group ref={inner}>{children}</group>
    </group>
  );
}

/* --------------------------------- scene --------------------------------- */

const BASE_CAM = new THREE.Vector3(0, 1.4, 6.8);

function Rig({ interactive, zoom, auto, resetKey }) {
  const controls = useRef();
  const gl = useThree((s) => s.gl);
  const camera = useThree((s) => s.camera);
  const aspect = useThree((s) => s.size.width / Math.max(1, s.size.height));

  // narrow / portrait containers (phones, fullscreen on a phone) need the camera further back so nothing is cropped.
  // Runs again on every resize, which also keeps the framing correct after leaving fullscreen.
  const k = Math.max(1, 1.05 / aspect);
  useEffect(() => {
    camera.position.copy(BASE_CAM).multiplyScalar(k);
    camera.updateProjectionMatrix();
    const c = controls.current;
    if (c) {
      c.target.set(0, 0, 0);
      c.update();
      c.saveState();
    }
  }, [camera, k]);

  useEffect(() => {
    controls.current?.reset();
  }, [resetKey]);

  // while a phone is "locked", let a swipe scroll the page instead of being swallowed by the canvas
  useEffect(() => {
    gl.domElement.style.touchAction = interactive ? "none" : "pan-y";
  }, [gl, interactive]);

  return (
    <OrbitControls
      ref={controls}
      makeDefault
      enabled={interactive}
      enablePan={false}
      enableZoom={zoom}
      enableDamping
      dampingFactor={0.08}
      autoRotate={auto}
      autoRotateSpeed={1.4}
      minDistance={4 * k}
      maxDistance={11 * k}
      maxPolarAngle={Math.PI * 0.56}
    />
  );
}

function Scene({ model, theme, wireframe, ...rig }) {
  const pal = PALETTES[theme];
  const [floor, setFloor] = useState(-1.7);
  return (
    <>
      <ambientLight intensity={pal.ambient} />
      <directionalLight position={[4, 6, 5]} intensity={1.6} />
      <pointLight position={[-5, 2, -3]} intensity={40} color={pal.colors[0]} />
      <pointLight position={[5, -1, 4]} intensity={40} color={pal.colors[1]} />

      <Environment key={theme} resolution={256}>
        <Lightformer form="rect" intensity={4} color={pal.env[0]} position={[-5, 3, -2]} scale={[8, 4, 1]} />
        <Lightformer form="rect" intensity={3} color={pal.env[1]} position={[5, -1, 3]} scale={[6, 6, 1]} />
        <Lightformer form="ring" intensity={4} color={pal.env[2]} position={[0, 5, 5]} scale={5} />
        <Lightformer form="rect" intensity={2.5} color={pal.env[3]} position={[0, 0, 8]} scale={[10, 2, 1]} />
      </Environment>

      <Suspense fallback={null}>
        <Fit wireframe={wireframe} onFloor={setFloor}>
          <ModelBody model={model} pal={pal} />
        </Fit>
      </Suspense>

      <ContactShadows position={[0, floor, 0]} opacity={0.5} scale={9} blur={2.6} far={4} color={pal.shadow} />
      <Rig {...rig} />
    </>
  );
}

/* ------------------------------ wrapper bits ------------------------------ */

class Boundary extends Component {
  state = { err: null };
  static getDerivedStateFromError(err) {
    return { err };
  }
  render() {
    if (this.state.err) {
      return (
        <div className="flex h-full w-full flex-col items-center justify-center gap-2 p-6 text-center">
          <p className="font-display text-lg font-bold">{this.props.failTitle}</p>
          <p className="max-w-xs text-xs text-fg/60">{String(this.state.err.message || this.state.err)}</p>
        </div>
      );
    }
    return this.props.children;
  }
}

function Loader({ label }) {
  const { active, progress } = useProgress();
  if (!active) return null;
  return (
    <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-3">
      <div className="h-1.5 w-40 overflow-hidden rounded-full bg-fg/10">
        <div className="h-full rounded-full bg-gradient-to-r from-brand-violet via-brand-pink to-brand-orange transition-[width]" style={{ width: `${Math.max(progress, 6)}%` }} />
      </div>
      <p className="text-xs text-fg/60">
        {label} {Math.round(progress)}%
      </p>
    </div>
  );
}

export default function ModelViewer({ model, active = true, interactive = true, zoom = false, auto = true, wireframe = false, resetKey = 0, loadingLabel = "Loading", failTitle = "Couldn't load this model" }) {
  const theme = useTheme();
  return (
    <div className="relative h-full w-full">
      <Boundary key={model.slug} failTitle={failTitle}>
        <Canvas
          camera={{ position: [0, 1.4, 6.8], fov: 40 }}
          dpr={[1, 1.75]}
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
          frameloop={active ? "always" : "never"}
        >
          <Scene model={model} theme={theme} wireframe={wireframe} interactive={interactive} zoom={zoom} auto={auto} resetKey={resetKey} />
        </Canvas>
        <Loader label={loadingLabel} />
      </Boundary>
    </div>
  );
}
