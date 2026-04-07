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
      <mesh position={midPos} quaternion={qArr}>
        <cylinderGeometry args={[0.04, 0.04, shaftLen, 8]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={cPos} quaternion={qArr}>
        <coneGeometry args={[0.12, 0.3, 8]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <Text position={lPos} fontSize={0.3} color={color} anchorX="center" anchorY="middle">
        {label}
      </Text>
    </group>
  );
}

interface ParallelogramProps {
  a: [number, number, number];
  b: [number, number, number];
}

function Parallelogram({ a, b }: ParallelogramProps) {
  const vertices = useMemo(() => {
    return new Float32Array([
      0, 0, 0,
      a[0], a[1], a[2],
      a[0] + b[0], a[1] + b[1], a[2] + b[2],
      0, 0, 0,
      a[0] + b[0], a[1] + b[1], a[2] + b[2],
      b[0], b[1], b[2],
    ]);
  }, [a, b]);

  return (
    <mesh>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[vertices, 3]}
        />
      </bufferGeometry>
      <meshStandardMaterial color="#fbbf24" opacity={0.2} transparent side={2} />
    </mesh>
  );
}

interface SceneProps {
  a: [number, number, number];
  b: [number, number, number];
  cross: [number, number, number];
  showParallelogram: boolean;
}

function Scene({ a, b, cross, showParallelogram }: SceneProps) {
  const controlsRef = useRef<React.ComponentRef<typeof OrbitControls>>(null);
  const crossMag = Math.sqrt(cross[0] ** 2 + cross[1] ** 2 + cross[2] ** 2);

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 10, 5]} intensity={0.8} />
      <OrbitControls ref={controlsRef} enableDamping dampingFactor={0.1} />

      <GridPlane size={3} />
      <Axis direction={[1, 0, 0]} color="#ef4444" label="x" />
      <Axis direction={[0, 1, 0]} color="#22c55e" label="y" />
      <Axis direction={[0, 0, 1]} color="#3b82f6" label="z" />

      <VectorArrow from={[0, 0, 0]} to={a} color="#3b82f6" label="a" />
      <VectorArrow from={[0, 0, 0]} to={b} color="#22c55e" label="b" />
      {crossMag > 0.001 && (
        <VectorArrow from={[0, 0, 0]} to={cross} color="#ef4444" label="a×b" />
      )}
      {showParallelogram && (
        <Parallelogram a={a} b={b} />
      )}
    </>
  );
}

// --- Main Component ---

const CrossProductViz: React.FC = () => {
  const [ax, setAx] = useState(1);
  const [ay, setAy] = useState(0);
  const [az, setAz] = useState(0);
  const [bx, setBx] = useState(0);
  const [by, setBy] = useState(1);
  const [bz, setBz] = useState(0);
  const [showParallelogram, setShowParallelogram] = useState(true);

  // Cross product calculation
  const crossX = ay * bz - az * by;
  const crossY = az * bx - ax * bz;
  const crossZ = ax * by - ay * bx;

  const magA = Math.sqrt(ax * ax + ay * ay + az * az);
  const magB = Math.sqrt(bx * bx + by * by + bz * bz);
  const crossMag = Math.sqrt(crossX * crossX + crossY * crossY + crossZ * crossZ);

  // sinθ = |a×b| / (|a||b|)
  const sinTheta = magA > 0 && magB > 0 ? crossMag / (magA * magB) : 0;
  const thetaDeg = Math.asin(Math.max(-1, Math.min(1, sinTheta))) * (180 / Math.PI);

  // Parallel check
  const isParallel = crossMag < 0.001;

  // Dot product for full angle
  const dot = ax * bx + ay * by + az * bz;
  const cosTheta = magA > 0 && magB > 0 ? dot / (magA * magB) : 1;
  const fullAngleDeg = Math.acos(Math.max(-1, Math.min(1, cosTheta))) * (180 / Math.PI);

  const aVec: [number, number, number] = [ax, ay, az];
  const bVec: [number, number, number] = [bx, by, bz];
  const crossVec: [number, number, number] = [crossX, crossY, crossZ];

  return (
    <div className="space-y-6">
      {/* 3D Canvas */}
      <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div style={{ height: '400px' }}>
          <Canvas camera={{ position: [5, 4, 5], fov: 50 }}>
            <Scene a={aVec} b={bVec} cross={crossVec} showParallelogram={showParallelogram} />
          </Canvas>
        </div>
        <div className="text-center text-xs text-slate-400 dark:text-slate-500 py-2">
          ドラッグで視点回転 / スクロールでズーム
        </div>
      </div>

      {/* Sliders */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Vector a */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-xl p-4 space-y-3">
          <h4 className="font-bold text-blue-700 dark:text-blue-400 text-sm">
            <MathDisplay tex="\\vec{a}" className="mr-1" /> の成分
          </h4>
          {([
            { label: 'x', value: ax, setter: setAx },
            { label: 'y', value: ay, setter: setAy },
            { label: 'z', value: az, setter: setAz },
          ] as const).map(({ label, value, setter }) => (
            <div key={label} className="flex items-center gap-2">
              <span className="text-xs font-bold w-10 text-slate-600 dark:text-slate-300">{label} = {value}</span>
              <input
                type="range"
                min={-3}
                max={3}
                step={0.5}
                value={value}
                onChange={(e) => setter(Number(e.target.value))}
                className="flex-1"
              />
            </div>
          ))}
        </div>

        {/* Vector b */}
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-xl p-4 space-y-3">
          <h4 className="font-bold text-green-700 dark:text-green-400 text-sm">
            <MathDisplay tex="\\vec{b}" className="mr-1" /> の成分
          </h4>
          {([
            { label: 'x', value: bx, setter: setBx },
            { label: 'y', value: by, setter: setBy },
            { label: 'z', value: bz, setter: setBz },
          ] as const).map(({ label, value, setter }) => (
            <div key={label} className="flex items-center gap-2">
              <span className="text-xs font-bold w-10 text-slate-600 dark:text-slate-300">{label} = {value}</span>
              <input
                type="range"
                min={-3}
                max={3}
                step={0.5}
                value={value}
                onChange={(e) => setter(Number(e.target.value))}
                className="flex-1"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Display options */}
      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 cursor-pointer">
          <input
            type="checkbox"
            checked={showParallelogram}
            onChange={(e) => setShowParallelogram(e.target.checked)}
            className="w-4 h-4 rounded"
          />
          平行四辺形を表示
        </label>
      </div>

      {/* Calculations */}
      <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 space-y-4">
        <h4 className="font-bold text-sm text-slate-700 dark:text-slate-300 mb-3">リアルタイム計算</h4>

        <div className="space-y-4 text-sm">
          {/* Cross product components */}
          <div>
            <div className="text-xs font-bold text-red-600 dark:text-red-400 mb-2">外積の成分</div>
            <MathDisplay
              tex={`\\vec{a} \\times \\vec{b} = \\begin{pmatrix} ${ay} \\cdot ${bz} - ${az} \\cdot ${by} \\\\ ${az} \\cdot ${bx} - ${ax} \\cdot ${bz} \\\\ ${ax} \\cdot ${by} - ${ay} \\cdot ${bx} \\end{pmatrix} = \\begin{pmatrix} ${crossX.toFixed(1)} \\\\ ${crossY.toFixed(1)} \\\\ ${crossZ.toFixed(1)} \\end{pmatrix}`}
              displayMode
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Magnitude of cross product */}
            <div>
              <div className="text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">外積の大きさ (= 平行四辺形の面積)</div>
              <MathDisplay
                tex={`|\\vec{a} \\times \\vec{b}| = \\sqrt{${crossX.toFixed(1)}^2 + ${crossY.toFixed(1)}^2 + ${crossZ.toFixed(1)}^2} \\approx ${crossMag.toFixed(3)}`}
              />
            </div>

            {/* Angle */}
            <div>
              <div className="text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">なす角</div>
              <MathDisplay
                tex={magA > 0 && magB > 0
                  ? `\\theta \\approx ${fullAngleDeg.toFixed(1)}^\\circ`
                  : `\\theta = \\text{undefined (zero vector)}`
                }
              />
            </div>
          </div>

          {/* sinθ relation */}
          <div>
            <div className="text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">sinθ との関係</div>
            <MathDisplay
              tex={magA > 0 && magB > 0
                ? `|\\vec{a} \\times \\vec{b}| = |\\vec{a}||\\vec{b}|\\sin\\theta = ${magA.toFixed(2)} \\times ${magB.toFixed(2)} \\times \\sin ${fullAngleDeg.toFixed(1)}^\\circ \\approx ${crossMag.toFixed(3)}`
                : `|\\vec{a} \\times \\vec{b}| = 0`
              }
            />
          </div>
        </div>

        {/* Parallel status */}
        <div className="flex gap-3 flex-wrap">
          {isParallel && magA > 0 && magB > 0 && (
            <span className="text-xs font-bold px-3 py-1 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-700 rounded-full">
              平行 (parallel): a x b = 0
            </span>
          )}
          {(magA < 0.001 || magB < 0.001) && (
            <span className="text-xs font-bold px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-600 rounded-full">
              零ベクトルが含まれています
            </span>
          )}
        </div>
      </div>

      {/* Info box */}
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-xl p-4 text-sm text-red-800 dark:text-red-300">
        <p className="font-bold mb-1">外積（ベクトル積）</p>
        <MathDisplay tex="\\vec{a} \\times \\vec{b} = (a_y b_z - a_z b_y,\\; a_z b_x - a_x b_z,\\; a_x b_y - a_y b_x)" displayMode />
        <p className="mt-2">外積は2つのベクトル両方に垂直なベクトルです。その大きさは2つのベクトルが張る平行四辺形の面積に等しく、右手の法則で向きが決まります。</p>
      </div>

      <HintButton hints={[
        { step: 1, text: '外積 a×b は両ベクトルに垂直な方向を向きます。赤い矢印が a(青) と b(緑) の両方に直交しているのを確認しましょう。' },
        { step: 2, text: '成分計算: (ay*bz - az*by, az*bx - ax*bz, ax*by - ay*bx) — 各成分は他の2成分のたすき掛けです。' },
        { step: 3, text: '|a×b| = |a||b|sinθ は2つのベクトルが張る平行四辺形の面積です。黄色い面がその平行四辺形です。' },
        { step: 4, text: 'a×b = 0（零ベクトル）⟺ a∥b（平行条件）。スライダーで a と b を平行にして確認しましょう。' },
      ]} />
    </div>
  );
};

export default CrossProductViz;
