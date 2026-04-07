"use client";

import React, { useState, useRef, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Line, Text } from '@react-three/drei';
import { Vector3, Quaternion } from 'three';
import 'katex/dist/katex.min.css';
import MathDisplay from '@/app/lib/components/MathDisplay';
import HintButton from '../../components/HintButton';

// --- 3D Sub-components ---

interface AxisProps {
  direction: [number, number, number];
  color: string;
  label: string;
}

function Axis({ direction, color, label }: AxisProps) {
  const len = 4;
  const end: [number, number, number] = [
    direction[0] * len,
    direction[1] * len,
    direction[2] * len,
  ];
  const negEnd: [number, number, number] = [
    -direction[0] * len,
    -direction[1] * len,
    -direction[2] * len,
  ];
  const labelPos: [number, number, number] = [
    direction[0] * (len + 0.4),
    direction[1] * (len + 0.4),
    direction[2] * (len + 0.4),
  ];

  return (
    <group>
      <Line points={[negEnd, end]} color={color} lineWidth={1.5} />
      <Text position={labelPos} fontSize={0.35} color={color} anchorX="center" anchorY="middle">
        {label}
      </Text>
    </group>
  );
}

interface GridPlaneProps {
  size: number;
}

function GridPlane({ size }: GridPlaneProps) {
  const lines: [number, number, number][][] = [];
  for (let i = -size; i <= size; i++) {
    lines.push([[i, 0, -size], [i, 0, size]]);
    lines.push([[-size, 0, i], [size, 0, i]]);
  }
  return (
    <group>
      {lines.map((pts, idx) => (
        <Line key={idx} points={pts} color="#94a3b8" lineWidth={0.5} opacity={0.3} transparent />
      ))}
    </group>
  );
}

interface VectorArrowProps {
  from: [number, number, number];
  to: [number, number, number];
  color: string;
  label: string;
}

function VectorArrow({ from, to, color, label }: VectorArrowProps) {
  const computed = useMemo(() => {
    const dir = new Vector3(to[0] - from[0], to[1] - from[1], to[2] - from[2]);
    const len = dir.length();
    if (len < 0.001) return null;

    const nd = dir.clone().normalize();
    const shaftLen = Math.max(0, len - 0.3);

    const midPos: [number, number, number] = [
      from[0] + nd.x * shaftLen / 2,
      from[1] + nd.y * shaftLen / 2,
      from[2] + nd.z * shaftLen / 2,
    ];

    const q = new Quaternion();
    q.setFromUnitVectors(new Vector3(0, 1, 0), nd);
    const qArr: [number, number, number, number] = [q.x, q.y, q.z, q.w];

    const cPos: [number, number, number] = [
      from[0] + nd.x * (shaftLen + 0.15),
      from[1] + nd.y * (shaftLen + 0.15),
      from[2] + nd.z * (shaftLen + 0.15),
    ];

    const lPos: [number, number, number] = [
      (from[0] + to[0]) / 2 + 0.3,
      (from[1] + to[1]) / 2 + 0.3,
      (from[2] + to[2]) / 2 + 0.3,
    ];

    return { shaftLen, midPos, qArr, cPos, lPos };
  }, [from, to]);

  if (!computed) return null;
  const { shaftLen, midPos, qArr, cPos, lPos } = computed;

  return (
    <group>
      {/* Shaft */}
      <mesh position={midPos} quaternion={qArr}>
        <cylinderGeometry args={[0.04, 0.04, shaftLen, 8]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Cone (arrowhead) */}
      <mesh position={cPos} quaternion={qArr}>
        <coneGeometry args={[0.12, 0.3, 8]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Label */}
      <Text position={lPos} fontSize={0.3} color={color} anchorX="center" anchorY="middle">
        {label}
      </Text>
    </group>
  );
}

interface SceneProps {
  a: [number, number, number];
  b: [number, number, number];
}

function Scene({ a, b }: SceneProps) {
  const controlsRef = useRef<React.ComponentRef<typeof OrbitControls>>(null);

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 10, 5]} intensity={0.8} />
      <OrbitControls ref={controlsRef} enableDamping dampingFactor={0.1} />

      <GridPlane size={3} />
      <Axis direction={[1, 0, 0]} color="#ef4444" label="x" />
      <Axis direction={[0, 1, 0]} color="#22c55e" label="y" />
      <Axis direction={[0, 0, 1]} color="#3b82f6" label="z" />

      <VectorArrow from={[0, 0, 0]} to={a} color="#f59e0b" label="a" />
      <VectorArrow from={[0, 0, 0]} to={b} color="#8b5cf6" label="b" />
    </>
  );
}

// --- Main Component ---

const SpaceVectorViz: React.FC = () => {
  const [ax, setAx] = useState(2);
  const [ay, setAy] = useState(1);
  const [az, setAz] = useState(1);
  const [bx, setBx] = useState(1);
  const [by, setBy] = useState(2);
  const [bz, setBz] = useState(-1);

  // Calculations
  const magA = Math.sqrt(ax * ax + ay * ay + az * az);
  const magB = Math.sqrt(bx * bx + by * by + bz * bz);
  const dot = ax * bx + ay * by + az * bz;
  const cosTheta = magA > 0 && magB > 0 ? dot / (magA * magB) : 0;
  const thetaDeg = Math.acos(Math.max(-1, Math.min(1, cosTheta))) * (180 / Math.PI);

  // Parallel check: a x b = 0
  const crossX = ay * bz - az * by;
  const crossY = az * bx - ax * bz;
  const crossZ = ax * by - ay * bx;
  const isParallel = Math.abs(crossX) < 0.001 && Math.abs(crossY) < 0.001 && Math.abs(crossZ) < 0.001;

  const aVec: [number, number, number] = [ax, ay, az];
  const bVec: [number, number, number] = [bx, by, bz];

  return (
    <div className="space-y-6">
      {/* 3D Canvas */}
      <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div style={{ height: '400px' }}>
          <Canvas camera={{ position: [5, 4, 5], fov: 50 }}>
            <Scene a={aVec} b={bVec} />
          </Canvas>
        </div>
        <div className="text-center text-xs text-slate-400 dark:text-slate-500 py-2">
          ドラッグで視点回転 / スクロールでズーム
        </div>
      </div>

      {/* Sliders */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Vector a */}
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-xl p-4 space-y-3">
          <h4 className="font-bold text-amber-700 dark:text-amber-400 text-sm">
            <MathDisplay tex="\\vec{a}" className="mr-1" /> の成分
          </h4>
          {([
            { label: 'x', value: ax, setter: setAx, color: 'accent-red-500' },
            { label: 'y', value: ay, setter: setAy, color: 'accent-green-500' },
            { label: 'z', value: az, setter: setAz, color: 'accent-blue-500' },
          ] as const).map(({ label, value, setter, color }) => (
            <div key={label} className="flex items-center gap-2">
              <span className="text-xs font-bold w-10 text-slate-600 dark:text-slate-300">{label} = {value}</span>
              <input
                type="range"
                min={-3}
                max={3}
                step={0.5}
                value={value}
                onChange={(e) => setter(Number(e.target.value))}
                className={`flex-1 ${color}`}
              />
            </div>
          ))}
        </div>

        {/* Vector b */}
        <div className="bg-violet-50 dark:bg-violet-900/20 border border-violet-200 dark:border-violet-700 rounded-xl p-4 space-y-3">
          <h4 className="font-bold text-violet-700 dark:text-violet-400 text-sm">
            <MathDisplay tex="\\vec{b}" className="mr-1" /> の成分
          </h4>
          {([
            { label: 'x', value: bx, setter: setBx, color: 'accent-red-500' },
            { label: 'y', value: by, setter: setBy, color: 'accent-green-500' },
            { label: 'z', value: bz, setter: setBz, color: 'accent-blue-500' },
          ] as const).map(({ label, value, setter, color }) => (
            <div key={label} className="flex items-center gap-2">
              <span className="text-xs font-bold w-10 text-slate-600 dark:text-slate-300">{label} = {value}</span>
              <input
                type="range"
                min={-3}
                max={3}
                step={0.5}
                value={value}
                onChange={(e) => setter(Number(e.target.value))}
                className={`flex-1 ${color}`}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Calculations */}
      <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 space-y-4">
        <h4 className="font-bold text-sm text-slate-700 dark:text-slate-300 mb-3">リアルタイム計算</h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-amber-600 dark:text-amber-400 font-bold text-xs">|a|</span>
              <MathDisplay
                tex={`\\sqrt{${ax}^2+${ay}^2+${az}^2} = \\sqrt{${(ax * ax + ay * ay + az * az).toFixed(1)}} \\approx ${magA.toFixed(3)}`}
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-violet-600 dark:text-violet-400 font-bold text-xs">|b|</span>
              <MathDisplay
                tex={`\\sqrt{${bx}^2+${by}^2+${bz}^2} = \\sqrt{${(bx * bx + by * by + bz * bz).toFixed(1)}} \\approx ${magB.toFixed(3)}`}
              />
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-slate-600 dark:text-slate-400 font-bold text-xs">a . b</span>
              <MathDisplay
                tex={`${ax}\\cdot${bx}+${ay}\\cdot${by}+${az}\\cdot${bz} = ${dot.toFixed(1)}`}
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-600 dark:text-slate-400 font-bold text-xs">theta</span>
              <MathDisplay
                tex={magA > 0 && magB > 0
                  ? `\\cos\\theta = \\frac{${dot.toFixed(1)}}{${magA.toFixed(2)}\\times${magB.toFixed(2)}} \\approx ${cosTheta.toFixed(3)},\\quad \\theta \\approx ${thetaDeg.toFixed(1)}^\\circ`
                  : `\\theta = \\text{undefined (zero vector)}`
                }
              />
            </div>
          </div>
        </div>

        {/* Parallel / Perpendicular status */}
        <div className="flex gap-3 flex-wrap">
          {isParallel && magA > 0 && magB > 0 && (
            <span className="text-xs font-bold px-3 py-1 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-700 rounded-full">
              平行 (parallel)
            </span>
          )}
          {Math.abs(dot) < 0.001 && magA > 0 && magB > 0 && (
            <span className="text-xs font-bold px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-700 rounded-full">
              垂直 (perpendicular)
            </span>
          )}
        </div>
      </div>

      {/* Info box */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-xl p-4 text-sm text-blue-800 dark:text-blue-300">
        <p className="font-bold mb-1">空間ベクトルの内積</p>
        <MathDisplay tex="\\vec{a}\\cdot\\vec{b} = a_x b_x + a_y b_y + a_z b_z = |\\vec{a}||\\vec{b}|\\cos\\theta" displayMode />
        <p className="mt-2">2次元の内積を3次元に拡張したものです。z 成分が加わっても計算の構造は同じです。</p>
      </div>

      <HintButton hints={[
        { step: 1, text: '空間ベクトルは (x, y, z) の3成分で表されます。2次元ベクトルに z 成分が追加された形です。' },
        { step: 2, text: '大きさは |a| = sqrt(ax^2 + ay^2 + az^2) です。三平方の定理を2回使うイメージです。' },
        { step: 3, text: '内積 a . b = ax*bx + ay*by + az*bz です。内積が 0 なら直交（垂直）です。' },
        { step: 4, text: '平行条件は外積 a x b = 0（零ベクトル）です。成分の比が一致する場合に平行になります。' },
      ]} />
    </div>
  );
};

export default SpaceVectorViz;
