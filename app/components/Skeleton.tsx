"use client";

import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'rect' | 'circle';
  width?: string | number;
  height?: string | number;
}

export default function Skeleton({ 
  className = "", 
  variant = 'rect', 
  width, 
  height 
}: SkeletonProps) {
  const baseStyles = "animate-pulse bg-gray-700/50 rounded";
  
  const variantStyles = {
    text: "h-4 w-3/4 rounded-full",
    rect: "h-32 w-full",
    circle: "h-12 w-12 rounded-full",
  };

  const style = {
    width,
    height,
  };

  return (
    <div 
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      style={style}
      role="status"
      aria-label="Loading..."
    />
  );
}
