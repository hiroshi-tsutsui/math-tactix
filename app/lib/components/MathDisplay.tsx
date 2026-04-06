"use client";

import React, { useRef, useEffect } from 'react';
import katex from 'katex';

interface MathDisplayProps {
  tex: string;
  className?: string;
  displayMode?: boolean;
}

const MathDisplay = ({ tex, className = "", displayMode = false }: MathDisplayProps) => {
  const containerRef = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (containerRef.current) {
      katex.render(tex, containerRef.current, { throwOnError: false, displayMode });
    }
  }, [tex, displayMode]);
  return <span ref={containerRef} className={className} />;
};

export default MathDisplay;
