'use client';

import React, { useState, useEffect } from 'react';
import { InlineMath, BlockMath } from 'react-katex';
import { ResponsiveContainer, AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ReferenceDot, Scatter } from 'recharts';

const InscribedRectangleViz: React.FC = () => {
  const [t, setT] = useState(1); // The x-coordinate of the right vertex of the rectangle

  // The parabola is y = 4 - x^2
  // Domain for t is 0 < t < 2
  // The vertices of the rectangle are (t, 0), (t, 4-t^2), (-t, 4-t^2), (-t, 0)
  // Width = 2t, Height = 4-t^2
  // Area = 2t * (4 - t^2) = 8t - 2t^3 (Wait, cubic function is Math II!)

  return null;
};
export default InscribedRectangleViz;
