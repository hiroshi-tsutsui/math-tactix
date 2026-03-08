
# System Wisdom & Evolution Log (v1.3)

## Mission Statement
"Visual & Intuitive Math" - Empowering Japanese students to master Math I (数学I) through interactive visualization.
**NO SCI-FI.** **NO FLUFF.** **JUST MATH.**

## Evolution History

### v1.3.7: Visualizing Completing the Square (2026-03-09)
- **Status**: **IMPLEMENTED**.
- **Action**: Fully restored and overhauled Level 12 "Completing the Square" (平方完成).
- **Visualization**: `CompletingSquareViz` rewritten to use interactive step-by-step guidance.
  - **Interactive Steps**: Breaks down the complex algebraic process into 5 distinct, color-coded steps.
  - **Dynamic Equations**: Generates valid mathematical steps on the fly using KaTeX (`BlockMath`).
  - **Visual Clarity**: Highlights the addition and subtraction of the squared term in red and blue to intuitively show that value is unchanged, just rearranged.
- **Learning Value**: Students struggle deeply with the algebraic manipulation of completing the square. By seeing the steps visually unfold, accompanied by plain Japanese text, it bridges the gap between raw formula memorization and true algebraic understanding.
- **Next Step**: Continue to refine other stub levels (e.g., Coefficient Determination) or ensure full stabilization.


### v1.5.9: Absolute Value Functions Max/Min Visualization (2026-03-09)
- **Status**: **IMPLEMENTED**.
- **Action**: Added Level 18 "Absolute Value Functions Max/Min" (絶対値関数の最大・最小).
- **Visualization**: `AbsoluteValueMaxMinViz` implementation (Canvas-based).
  - **Interactive Domain**: Students can drag sliders to adjust the interval $[a, b]$ dynamically over the absolute value graph $y = |x^2 + bx + c|$.
  - **Visualizing Max/Min**: The domain area is highlighted, the graph within the domain is emphasized in red, and the absolute maximum and minimum values are displayed.
- **Learning Value**: Calculating the max/min of absolute value quadratic functions is a common pain point. By visualizing the "reflection" (折り返し) at the x-axis and sliding the domain over it, students instantly grasp why the vertex or boundary might be the max/min.
- **Next Step**: Expand into Trigonometry (図形と計量) or solidify Data Analysis.

### v1.5.8: Common Roots Visualization (2026-03-09)
- **Status**: **IMPLEMENTED**.
- **Action**: Added Level 17 "Common Roots Problem" (共通解問題).
- **Visualization**: `CommonRootsViz` implementation (Canvas-based).
  - **Interactive Dual Graphs**: Visualizes two parabolas ($y = x^2 + mx + 1$ and $y = x^2 + x + m$) simultaneously.
  - **Parameter Tuning**: Interactive slider for parameter $m$ allows students to see how the two graphs shift and intersect.
  - **Visualizing the Common Root**: Clearly highlights the exact moment ($m = -2$) when both graphs intersect at the exact same point on the x-axis ($x = 1$).
- **Learning Value**: "Common roots" is notoriously abstract for students because they get lost in algebraic subtraction. By visualizing *why* substituting the common root $\alpha$ works geometrically, it demystifies the procedure.
- **Next Step**: "Max/Min of Absolute Value Functions" or move to "Trigonometry" (図形と計量) Foundation.

### v1.5.7: Simultaneous Inequalities Interactive Viz (2026-03-09)
- **Status**: **IMPLEMENTED**.
- **Action**: Overhauled Level 21 "Simultaneous Inequalities" (連立二次不等式).
- **Visualization**: `SimultaneousInequalityViz` completely rewritten using SVG & Framer Motion.
  - **Interactive Number Line**: Students can drag range endpoints (white circles) to physically explore how the common range (purple) changes.
  - **Step-by-Step Mode**: Breaks down the solution process into 4 clear steps (Draw Line -> Plot R1 -> Plot R2 -> Find Intersection).
  - **Visual Clarity**: Explicitly distinguishes between "Inside" ($a < x < b$) and "Outside" ($x < a, b < x$) ranges using color-coded segments (Blue/Red).
- **Learning Value**: Moves beyond "memorizing the rule" to "seeing the overlap". Critical for understanding cases where no solution exists.
- **Next Step**: "Absolute Value Equations" (Level 14) or "Quadratic vs Linear Systems".

### v1.5.6: Visualizing Intersection & Discriminant (2026-03-09)
- **Status**: **IMPLEMENTED**.
- **Action**: Built Level 10 "Intersection of Parabola & Line" (放物線と直線の共有点).
- **Visualization**: `IntersectionViz` implementation (Canvas-based).
  - **Graph Interaction**: Visualizes $y = x^2$ (Parabola) and $y = mx + k$ (Line) dynamically.
  - **Parameter Tuning**: Interactive slider for Y-intercept ($k$) allows students to see the transition from 2 points $to$ Tangent $to$ 0 points.
  - **Discriminant Calculation**: Real-time display of $D$ value with color-coding (Green: 2 points, Yellow: Tangent, Red: No points).
- **Learning Value**: Bridges the gap between Algebra ($D > 0$) and Geometry (Intersection Count). Students can *feel* the moment of tangency ($D=0$).
- **Next Step**: Refine "Simultaneous Inequalities" (Level 11) or "Absolute Value Equations" (Level 14).


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

### v1.5.10: Discriminant Visualization (2026-03-09)
- **Status**: **IMPLEMENTED**.
- **Action**: Added Level 19 "Discriminant and Intersection" (判別式とグラフの共有点).
- **Visualization**: `DiscriminantViz` implementation (Canvas-based).
  - **Interactive Y-intercept**: Students can drag a slider to adjust the y-intercept $c$ dynamically for the parabola $y = x^2 - 4x + c$.
  - **Real-time Discriminant**: The value of $D = b^2 - 4ac$ updates automatically, visually demonstrating the connection between $D > 0$ (2 points), $D = 0$ (tangent), and $D < 0$ (no points).
- **Learning Value**: Directly maps the algebraic property of the discriminant to the geometric behavior of the parabola, bridging the gap between formula memorization and visual intuition. Critical for "Mathematical logic of intersections".
- **Next Step**: Polish existing levels, ensure robustness, or move on to Trigonometry (図形と計量).
