# System Wisdom & Evolution Log (v1.3)

## Mission Statement
"Visual & Intuitive Math" - Empowering Japanese students to master Math I (数学I) through interactive visualization.
**NO SCI-FI.** **NO FLUFF.** **JUST MATH.**

## Evolution History

### v1.3.6: Level 12 Restoration & Stabilization (2026-03-08)
- **Fix**: Restored Level 12 "Completing the Square" (平方完成).
  - The feature was documented in v1.3.5 but the UI integration was missing in `page.tsx`.
  - Re-implemented `CompletingSquareViz` and `completing-square-generator` to ensure stability.
  - Validated build pipeline.
- **Current State**: Quadratic Functions module now fully supports:
  - Level 12: Completing the Square (Foundation)
  - Level 13: Roots Location (Analysis)
  - Level 14: Moving Domain (Max/Min)
  - Level 15: Definite Inequality (Absolute)
  - Level 16: Coefficient Determination
  - Level 17: Parametric Inequality (New)
  - Level 18: Graph Transformation (Geometric)
- **Next Step**: Expand into "Linear-Quadratic Systems" (Intersection/Tangency).

### v1.3.5: Comprehensive Quadratic Visualization Suite (2026-03-08)
- **Feature Additions**:
  - **Level 12: Completing the Square (平方完成)**: Implemented step-by-step visualization (`CompletingSquareViz`). Students can see the transformation from $ax^2+bx+c$ to $a(x-p)^2+q$.
  - **Level 18: Graph Transformation (グラフの移動)**: Implemented `GraphTransformationViz`. Interactive sliders for translation $(p, q)$ and toggles for symmetry (x-axis, y-axis, origin).
  - **Level 17: Parametric Inequality (文字係数の2次不等式)**: Reactivated level with `ParametricInequalityViz`.
- **Fixes**:
  - **Level 14: Moving Domain**: Switched to correct `MovingDomainViz` component. Fixed issue where it was using inequality logic.
- **Philosophy**: "Visual Foundation". By visualizing the algebraic process (Completing the Square) and geometric transformation (Graph Move), students gain intuition that connects calculation to graph shape.

### v1.3.2: Roots Location Visualization (2026-03-07)
- **Feature Upgrade**: Enhanced Level 13 "Location of Roots" (解の配置).
  - Added real-time visual indicators (OK/NG) for the three critical conditions:
    1. **Discriminant** ($D>0$)
    2. **Axis Position** (軸の位置)
    3. **Boundary Value** ($f(0)$)
  - Visualization now explicitly shows the "Green Zone" (target region) on the graph.
- **Learning Effect**: Students can interactively adjust $m$ and see *exactly* which condition fails, reinforcing the "Three Conditions" strategy for roots location problems.

### v1.3.1: Quadratic Functions Refinement (2026-03-07)
- **Feature Correction**: Fixed Level 14 "Moving Domain Max/Min" (定義域が動く最大・最小).
  - Previously linked to Inequality logic (Bug).
  - Implemented correct `MovingDomainViz` using Canvas to visualize how the domain $[a, a+2]$ slides over the parabola.
  - Interactive slider for parameter $a$ with real-time Max/Min point highlighting.
- **New Level**: Added Level 17 "Parametric Inequality" (文字係数の2次不等式).
  - Preserved the existing inequality visualization logic but moved it to its own proper level.
- **Philosophy**: Reinforced "Visual Intuition". Students can now *see* why the max/min changes as the domain moves relative to the vertex.

### v1.3: Quadratic Functions Expansion (2026-03-07)
- **Problem Types Added**:
  - **Quadratic Inequality (二次不等式)**: Visualizing the solution range relative to the x-axis.
  - **Coefficient Determination (係数決定)**: Finding the function from vertex and point.
- **Philosophy**: Shifted from "Game/SF" to "Reference Book/Drill" style.
- **Value**: Directly addresses common stumbling blocks in Math I (inequalities and function determination).
