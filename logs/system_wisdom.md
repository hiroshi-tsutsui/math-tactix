
# System Wisdom & Evolution Log (v1.3)

## Mission Statement
"Visual & Intuitive Math" - Empowering Japanese students to master Math I (数学I) through interactive visualization.
**NO SCI-FI.** **NO FLUFF.** **JUST MATH.**

## Evolution History

### v1.3.34: Size Comparison of Two Quadratic Functions (2026-03-10)
- **Status**: **IMPLEMENTED**.
- **Action**: Added Level 36 "2つの2次関数の大小" (Size Comparison of Two Parabolas) to Quadratics.
- **Visualization**: `TwoParabolasSizeViz` implementation (Canvas-based).
  - **Interactive Toggles**: Students can toggle between two classic mathematical conditions: "For any x, f(x) > g(x)" vs "For any x1, x2, f(x1) > g(x2)".
  - **Dynamic Parabolas**: Two parabolas f(x) [opening up] and g(x) [opening down] can be shifted vertically using sliders.
  - **Visual Proof**: In the "same x" mode, vertical distances are highlighted showing the gap between the functions. In the "any x1, x2" mode, horizontal boundary lines are drawn at the minimum of f(x) and maximum of g(x), shading the "safe zone" between them.
- **Learning Value**: This is one of the most notoriously confusing concepts in Math I (数学I). The linguistic difference between "任意のx" (for any x) and "任意のx1, x2" (for any x1, x2) completely changes the algebraic approach (Discriminant D < 0 vs comparing Min/Max). The visualization makes the geometric distinction instantly obvious, turning a confusing word problem into a simple boundary check.
- **Next Step**: Polish Math I Data Analysis or expand further into Math I Trigonometry.


### v1.3.33: Tangent from External Point Visualization (2026-03-10)
- **Status**: **IMPLEMENTED**.
- **Action**: Added Level 35 "放物線外の点から引いた接線" (Tangent from an External Point) to Quadratics.
- **Visualization**: `ExternalTangentViz` implementation (Canvas-based).
  - **Interactive Graphic**: Visualizes $y = x^2$ and a fixed external point P(p, q).
  - **Parameter Tuning**: Students can adjust the coordinates of point P and the slope $m$ of a line passing through P.
  - **Real-time Tangency Check**: Vividly highlights the line in yellow when the slope $m$ matches the exact theoretical slope that makes the discriminant $D = 0$, explicitly calculating and displaying the discriminant's zero-points.
- **Learning Value**: Often taught algebraically by setting up $y - q = m(x - p)$ and solving $D=0$. Students lose track of what the two solutions for $m$ represent. By physically rotating the line around point P, they intuitively see that there are exactly two "grazing" slopes that touch the parabola.
- **Next Step**: Polish existing Quadratics levels or explore more Math I topics.


### v1.3.31: Triangle Area Maximization on Parabola (2026-03-10)
- **Status**: **IMPLEMENTED**.
- **Action**: Added Level 34 "放物線上の三角形の面積最大化" (Maximizing Triangle Area on a Parabola) to Quadratics.
- **Visualization**: `TriangleAreaViz` implementation (Canvas-based).
  - **Interactive Graphic**: Visualizes $y = x^2$ and two fixed points A(-1, 1) and B(2, 4) on it.
  - **Dynamic Point Tracking**: Students slide a parameter $t$ to move point $P(t, t^2)$ along the arc between A and B.
  - **Real-time Area Calculation**: Dynamically shades the triangle PAB, calculates its area, and displays the tangent line at P.
  - **Visualizing the Maximum**: Graphically demonstrates that the area is maximized when the tangent at P is exactly parallel to the line segment AB.
- **Learning Value**: This is a classic, high-frequency problem in Japanese university entrance exams. It beautifully links algebra (derivative/slope) with geometry (triangle altitude). The interactive visualization replaces the tedious algebraic manipulation of finding the distance between a point and a line with a clear geometric intuition.
- **Next Step**: Polish existing Quadratics levels, finalize Math I Data Analysis, or explore Trigonometry (図形と計量) further.


### v1.3.28: De Morgan's Laws Visualization (2026-03-10)
- **Status**: **IMPLEMENTED**.
- **Action**: Added Level 1 "ド・モルガンの法則" (De Morgan's Laws) to Sets and Logic (集合と命題).
- **Visualization**: `DeMorgansViz` implementation (Canvas-based Venn Diagrams).
  - **Interactive Regions**: Students can toggle between $A \cup B$, $A \cap B$, and their complements.
  - **Visual Proof**: Dynamically colors the regions to visually prove that $\overline{A \cup B} = \overline{A} \cap \overline{B}$ and $\overline{A \cap B} = \overline{A} \cup \overline{B}$.
- **Learning Value**: Often memorized as an abstract string manipulation ("flip the cup to a cap"). Visualizing the areas makes it obvious why the negation forces the intersection of the individual negations.
- **Next Step**: Expand Sets and Logic to "Necessary and Sufficient Conditions" (必要条件と十分条件) or polish Data Analysis.


### v1.3.27: Positional Relationship of Two Parabolas (2026-03-10)
- **Status**: **IMPLEMENTED**.
- **Action**: Added Level 33 "2つの放物線の位置関係と接線" (Positional Relationship and Tangency of Two Parabolas) to Quadratics.
- **Visualization**: `TwoParabolasViz` implementation (Canvas-based).
  - **Interactive Parameter Tuning**: Students can adjust the constant $k$ in $y = -x^2 + 2x + k$.
  - **Real-time Intersection**: Dynamically visualizes the two parabolas $y = x^2$ and $y = -x^2 + 2x + k$.
  - **Discriminant Connection**: Automatically calculates the discriminant $D/4$ of the difference equation $2x^2 - 2x - k = 0$.
  - **Visualizing Tangency**: Vividly highlights the intersections and clearly marks the exact moment ($k = -0.5$) when the two graphs are tangent ($D = 0$), turning yellow to indicate tangency.
- **Learning Value**: Often appears in university entrance exams. It transforms an abstract algebraic operation (setting equations equal and solving for $D=0$) into a direct geometric intuition ("sliding the parabola until it exactly touches").
- **Next Step**: Continue to refine Math I Data Analysis or expand into Sets and Logic (集合と命題).


### v1.3.26: Hypothesis Testing Concept (仮説検定の考え方) (2026-03-10)
- **Status**: **IMPLEMENTED**.
- **Action**: Added Level 4 "仮説検定の考え方" (Hypothesis Testing Concept) to Data Analysis (データの分析).
- **Visualization**: `HypothesisTestingViz` implementation (Coin Toss Simulator & Binomial Distribution).
  - **Interactive Simulation**: Students simulate coin tosses (1 by 1 or 10 at once) to see if a coin is biased (e.g., getting 9 heads out of 10).
  - **Real-time Distribution**: Draws a dynamic histogram of the binomial distribution $B(10, 0.5)$.
  - **P-Value Visualized**: Highlights the probability of the observed extreme event (9 or 10 heads) and compares it dynamically to the 5% significance level.
- **Learning Value**: Math I newly includes "Hypothesis Testing Concept". This is notoriously difficult to grasp through text alone. Visualizing the *distribution of what is normal* allows students to intuitively see why getting 9 heads is "too rare to be a coincidence," seamlessly introducing the p-value concept.
- **Next Step**: Continue to refine other topics like Math I Trigonometry.


### v1.3.25: Parabola Vertex Locus Visualization (2026-03-10)
- **Status**: **IMPLEMENTED**.
- **Action**: Added Level 32 "放物線の頂点の軌跡" (Locus of Parabola Vertex) to Quadratics.
- **Visualization**: `VertexLocusViz` implementation (Canvas-based).
  - **Interactive Graphic**: Visualizes $y = x^2 - 2px + p$ and its vertex.
  - **Parameter Tuning**: Students can adjust the parameter $p$ using a slider to shift the parabola.
  - **Locus Tracing**: Dynamically traces the path of the vertex on the curve $y = -x^2 + x$, leaving a red dotted locus.
- **Learning Value**: Often taught purely algebraically ($X=p, Y=-p^2+p \Rightarrow Y=-X^2+X$), students fail to see that a single point moving in space creates a shape. This visualizer grounds the abstract parameter elimination technique into a physical geometry engine. Students see *why* substituting $p$ creates the bounding envelope.
- **Next Step**: Polish Trigonometry (図形と計量) or introduce Data Analysis edge cases.

### v1.3.24: Intersection Distance Visualization (2026-03-09)
- **Status**: **IMPLEMENTED**.
- **Action**: Added Level 31 "放物線と直線の交点間の距離" (Distance between intersections of a parabola and a line) to Quadratics.
- **Visualization**: `IntersectionDistanceViz` implementation (Canvas-based).
  - **Interactive Graphic**: Visualizes $y = x^2$ and $y = mx + n$.
  - **Parameter Tuning**: Students can adjust the slope $m$ and y-intercept $n$ of the line using sliders.
  - **Distance Calculation**: Dynamically highlights the line segment between the two intersection points in red and displays the calculated distance. Connects this distance to the formula $L = \frac{\sqrt{D}}{|a|} \sqrt{1 + m^2}$.
- **Learning Value**: The intersection distance formula is notoriously difficult to memorize and visually grasp. Students often blindly memorize the $\sqrt{1+m^2}$ part without understanding that it comes directly from the Pythagorean theorem on the line's slope. By interactively moving the line and watching the segment stretch or shrink as it approaches tangency, the geometric origin of the formula becomes clear.
- **Next Step**: Continue focusing on core Math I topics such as Trigonometry (図形と計量) or expand Data Analysis.

### v1.3.23: Symmetry and Formulas Visualization (180° - θ) (2026-03-09)
- **Status**: **IMPLEMENTED**.
- **Action**: Added Level 8 "対称性と公式 (180° - θ)" (Symmetry and Formulas) to Math I Trigonometry (図形と計量).
- **Visualization**: Dual-triangle reflection on the Unit Circle.
  - **Interactive Symmetry**: Students adjust the angle $\theta$ and simultaneously see the triangle for $180^\circ - \theta$ dynamically mirrored across the y-axis.
  - **Visualizing Identities**: Clearly highlights that the height ($y$-coordinate, $\sin$) is identical, while the width ($x$-coordinate, $\cos$) is mirrored negatively.
- **Learning Value**: The formulas $\sin(180^\circ - \theta) = \sin\theta$ and $\cos(180^\circ - \theta) = -\cos\theta$ are frequently memorized blindly by high school students, leading to errors under pressure. By seeing the physical reflection on the unit circle, the abstract formulas turn into an obvious geometric property.
- **Next Step**: Continue expanding Math I Trigonometry (e.g., Space Geometry Applications) or polish Data Analysis.



### v1.3.22: Box Plot & Data Dispersion Visualization (2026-03-09)
- **Status**: **IMPLEMENTED**.
- **Action**: Added Level 3 "箱ひげ図とデータの散らばり" (Box Plots and Data Dispersion) to Data Analysis (データの分析).
- **Visualization**: `BoxPlotViz` implementation (1D interactive dot plot with overlaid Box Plot).
  - **Interactive Data Points**: Students can freely add, delete, and drag individual data points horizontally.
  - **Real-time Metrics**: Automatically calculates and graphically draws the Min, Q1, Median, Q3, Max, and Interquartile Range (IQR).
  - **Visual Whiskers and Box**: The Box and Whiskers update instantly to reflect changes in the data distribution.
- **Learning Value**: Box Plots can be highly abstract for students. They usually memorize the mechanical calculation of Q1, Q2, and Q3 without understanding *what* the box represents. By dynamically altering the data and seeing the box stretch, contract, or shift, students gain an intuitive grasp of data dispersion, skewness, and the robustness of the median.
- **Next Step**: Polish UI/UX or expand into Math I Trigonometry (図形と計量) now that Data Analysis levels 1-3 are robust.

### v1.3.21: Variance and Standard Deviation Visualization (2026-03-09)
- **Status**: **IMPLEMENTED**.
- **Action**: Added Level 2 "分散と標準偏差" (Variance and Standard Deviation) to Data Analysis (データの分析).
- **Visualization**: `VarianceViz` implementation (1D interactive dot plot).
  - **Interactive Data Points**: Students can drag individual data values on a 1D dot plot to manipulate the dataset.
  - **Real-time Metrics**: Visualizes the mean as a central line, and draws the "deviation" (偏差) as squares whose areas represent the squared deviations. The average of these areas dynamically shows the Variance (分散), and the side length shows the Standard Deviation (標準偏差).
- **Learning Value**: Variance is often just a memorized formula. By visualizing the squared deviations as literal squares on the screen, students geometrically *feel* why outliers exponentially increase the variance, connecting the algebra to visual spread.
- **Next Step**: Expand to Level 3 "箱ひげ図とデータの散らばり" (Box Plots and Data Dispersion).

### v1.3.20: Coefficient Signs Visualization (2026-03-09)
- **Status**: **IMPLEMENTED**.
- **Action**: Added Level 30 "係数の符号とグラフ" (Coefficient Signs and Graph) to Quadratics. Fixed a lingering bug where `sign_of_roots` and `absolute_graph_line` generators were merged.
- **Visualization**: `CoefficientSignsViz` implementation (Canvas-based).
  - **Interactive Sliders**: Students can adjust coefficients $a, b, c$.
  - **Real-time Graphing**: Dynamically visualizes the parabola and specifically highlights the y-intercept, the axis of symmetry $x = -b/2a$, and the point $f(1)$.
  - **Dynamic Sign Indicators**: Displays whether $a, b, c, b^2-4ac, a+b+c$ are positive, zero, or negative in real-time.
- **Learning Value**: A staple problem in university exams where students must deduce signs from a given graph. This reverses the flow: students adjust the signs to see *how* the graph shapes, building concrete intuition. $a+b+c$ corresponds to $f(1)$, and $b$ shifts the axis based on the sign of $a$.
- **Next Step**: Polish Data Analysis (データの分析) Level 3 "Box Plots" or move to Trigonometry (図形と計量).


### v1.3.19: Multiple Absolute Value Functions Visualization (2026-03-09)
- **Status**: **IMPLEMENTED**.
- **Action**: Added Level 29 "複数の絶対値を含む関数" (Functions with Multiple Absolute Values) to Quadratics.
- **Visualization**: `MultipleAbsoluteViz` implementation (Canvas-based).
  - **Interactive Parameter Tuning**: Students can adjust the two boundary points $a, b$ for $y = |x - a| + |x - b|$ and slide the horizontal line $y = k$.
  - **Visualizing Intersections**: Vividly highlights the intersections, showing how the equation $|x - a| + |x - b| = k$ can have 0, 2, or infinite solutions depending on whether $k$ is below, above, or exactly equal to the "bottom" height of the bucket-shaped graph.
- **Learning Value**: Often appears in advanced university entrance exams. It transforms a highly complex case-by-case algebraic breakdown (x < a, a <= x <= b, b < x) into a direct, instant geometric intuition ("it's just a bucket and a line").
- **Next Step**: Move strictly into Math I Trigonometry (図形と計量) or expand Data Analysis.

### v1.3.18: Absolute Value Graph & Line Intersections (2026-03-09)
- **Status**: **IMPLEMENTED**.
- **Action**: Added Level 28 "絶対値グラフと直線の共有点" (Intersections of Absolute Value Graph and Line) to Quadratics.
- **Visualization**: `AbsoluteGraphLineViz` implementation (Canvas-based).
  - **Interactive Graphic**: Visualizes $y = |x^2 - 4|$ and $y = x + k$.
  - **Parameter Tuning**: Students can slide $k$ to move the line vertically.
  - **Learning Value**: Often appears in university exams. Students struggle to geometrically visualize how the line intersects the "folded" (absolute value) part of the parabola. Adjusting $k$ lets them instantly see when the number of solutions changes (0 -> 1 -> 2 -> 3 -> 4).
- **Next Step**: Expand into Math I Trigonometry (図形と計量) or Data Analysis.

### v1.3.17: Sign of Real Roots Visualization (2026-03-09)
- **Status**: **IMPLEMENTED**.
- **Action**: Added Level 27 "2次方程式の実数解の符号" (Sign of Real Roots) to Quadratics. Also patched UI rendering for Levels 24-26 left over from previous cycles.
- **Visualization**: `SignOfRootsViz` implementation (Canvas-based).
  - **Interactive Parameter Tuning**: Students can adjust parameter `m` for $x^2 + mx + m + 3 = 0$.
  - **3 Conditions Checks**: Visually checks $D > 0$, $\alpha+\beta > 0$, and $\alpha\beta > 0$.
  - **Real-time Graphing**: Highlights the positive domain and $y$-intercept dynamically.
- **Learning Value**: Often students just memorize the 3 formulas. By seeing the parabola move and explicitly watching the three conditions toggle between checkmarks and crosses, they geometrically understand *why* the product of roots restricts the $y$-intercept and the sum of roots restricts the axis.
- **Next Step**: Polish Data Analysis (データの分析) or Trigonometry (図形と計量).

### v1.3.14: Determination of Quadratic Inequalities (2026-03-09)
- **Status**: **IMPLEMENTED**.
- **Action**: Added Level 24 "2次不等式の決定" (Determination of Quadratic Inequalities) to Quadratics.
- **Visualization**: `InequalityCoefficientViz` implementation (Canvas-based).
  - **Interactive Graphic**: Visualizes the target green/red region for the inequality `> 0` and renders the student's parabola dynamically based on their inputs for coefficients `a` and `b`.
  - **Real-time Feedback**: Connects the shape of the graph (upward/downward opening) directly to the sign of `a` and the roots to `b`.
- **Learning Value**: Test problems often ask "find a, b if the solution is -1 < x < 2". Students usually try to plug values blindly. This visualizer forces them to "see" that if the solution is bounded (inside), the parabola MUST be opening downward (`a < 0`). This turns an algebraic puzzle into a geometric certainty.
- **Next Step**: Polish UI/UX or expand into Math I Trigonometry (図形と計量) or Data Analysis.


### v1.3.13: Segment Cut from X-Axis Visualization (2026-03-09)
- **Status**: **IMPLEMENTED**.
- **Action**: Added Level 23 "x軸から切り取る線分の長さ" (Segment Length from X-Axis) to Quadratics.
- **Visualization**: `SegmentLengthViz` implementation (Canvas-based).
  - **Interactive Parameter Tuning**: Students can adjust the y-intercept $c$ using a slider for the parabola $y = x^2 - 4x + c$.
  - **Real-time Segment Highlight**: The line segment cut from the x-axis is vividly highlighted in red, with its exact length $L$ displayed dynamically as the parabola translates vertically.
- **Learning Value**: Calculating the length $L = \beta - \alpha$ is algebraically taught as $\sqrt{D}/|a|$ or by using the quadratic formula. The visualizer grounds this algebraically heavy calculation in physical geometry. Students instantly see that moving the parabola down (decreasing $c$) widens the segment, linking the algebraic equation to geometric distance.
- **Next Step**: Expand into Math I Trigonometry (図形と計量) or Data Analysis (データの分析).

### v1.3.11: Common Roots Visualization (2026-03-09)
- **Status**: **IMPLEMENTED**.
- **Action**: Added Level 18 "共通解問題" (Common Roots) to Quadratics.
- **Visualization**: `CommonRootsViz` implementation (Canvas-based).
  - **Interactive Dual Graphs**: Visualizes two parabolas ($y = x^2 + mx + 1$ and $y = x^2 + x + m$) simultaneously.
  - **Parameter Tuning**: Interactive slider for parameter $m$ allows students to see how the two graphs shift and intersect.
  - **Visualizing the Common Root**: Clearly highlights the exact moment ($m = -2$) when both graphs intersect at the exact same point on the x-axis ($x = 1$).
- **Learning Value**: "Common roots" is notoriously abstract for students because they get lost in algebraic subtraction. By visualizing *why* substituting the common root $\alpha$ works geometrically, it demystifies the procedure.
- **Next Step**: Polish existing levels, ensure robustness, or move on to Trigonometry (図形と計量).

### v1.3.10: Conditional Max/Min Visualization (2026-03-09)
- **Status**: **IMPLEMENTED**.
- **Action**: Added Level 21 "条件付き最大・最小" (Conditional Max/Min of Two Variables) to Quadratics.
- **Visualization**: `ConditionalMaxMinViz` implementation (Canvas-based).
  - **Interactive Constraints**: Visualizes the constraint line $x + y = 4$ and the objective function $x^2 + y^2 = k$ as an expanding circle.
  - **Real-time Tangency**: Students slide the value of $k$ to find the exact moment the circle is tangent to the line, geometrically representing the minimum value.
  - **Learning Value**: Often taught purely algebraically (substituting $y = 4-x$ into $x^2+y^2$), students lose track of what they are solving. The geometric approach builds deep intuition for why a unique minimum exists and how it corresponds to the shortest distance.
- **Next Step**: Expand into Math I Trigonometry (図形と計量) or Data Analysis.


### v1.3.8: Interactive Determination of Quadratic Functions (2026-03-09)
- **Status**: **IMPLEMENTED**.
- **Action**: Completely overhauled Level 16 "Determination of Quadratic Functions" (二次関数の決定).
- **Visualization**: `DeterminationViz` rewritten to be fully interactive.
  - **Interactive Sliders**: Added sliders for students to manually adjust parameters (a, p, q or a, b, c depending on the problem type) and "fit" their own parabola to the given points.
  - **Real-time Feedback**: The graph updates instantly as sliders move, visually demonstrating the geometric role of each coefficient (e.g., how 'a' changes the width, 'p'/'q' shift the vertex).
  - **Problem Types Covered**: Vertex + Point, Axis + 2 Points, x-intercepts + Point, and 3 Random Points.
- **Learning Value**: Shifted from passive observation to active geometric construction. Students can now *feel* why setting up the equation $y = a(x-p)^2+q$ is the fastest path when the vertex is known, reinforcing algebraic intuition before calculation.
- **Next Step**: Expand into Math I Trigonometry (図形と計量) or refine advanced calculus concepts.


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

### v1.3.9: Fixed Domain Max/Min Visualization (2026-03-09)
- **Status**: **IMPLEMENTED**.
- **Action**: Added Level 20 "二次関数の最大・最小 (基礎)" (Quadratic Functions Max/Min on Fixed Domain).
- **Visualization**: `MaxMinViz` implementation (Canvas-based).
  - **Static Definition**: Visualizes the given parabola and highlights the specific interval (domain) on the x-axis.
  - **Dynamic Highlight**: Emphasizes the part of the parabola that falls strictly within the domain.
  - **Max/Min Targeting**: Automatically calculates and visually pinpoints the maximum or minimum value, explaining whether it occurs at the vertex or at one of the domain boundaries.
- **Learning Value**: Bridges the gap between "Completing the Square" and "Moving Domain/Axis" problems. Students often struggle to visually grasp why a vertex *might not* be the min/max if it falls outside the domain. This visualization explicitly trains that visual check.
- **Next Step**: Expand into Math I Trigonometry (図形と計量) now that Quadratics is thoroughly robust, or add minor QoL improvements.

### v1.3.12: Max/Min by Substitution Visualization (2026-03-09)
- **Status**: **IMPLEMENTED**.
- **Action**: Added Level 22 "置き換えによる最大・最小" (Max/Min by Substitution) to Quadratics.
- **Visualization**: `SubstitutionMaxMinViz` implementation (Canvas-based dual graphs).
  - **Interactive Dual Graphs**: Visualizes $t = x^2 - 2ax$ on the left and $y = t^2 - 2bt + c$ on the right simultaneously.
  - **Domain Synchronization**: As students slide the original variable $x$, they see how $t$ moves within its restricted range, which in turn acts as the domain for finding the max/min of $y$.
- **Learning Value**: "Max/Min by substitution" is one of the biggest hurdles in Math I. Students often substitute successfully but forget to restrict the domain of the new variable $t$. By showing the two graphs side-by-side, students visually experience *why* $t$ has a limited range and how that dictates the final answer for $y$.
- **Next Step**: Move on to Math I Trigonometry (図形と計量) or Data Analysis.

### v1.5.10: Discriminant Visualization (2026-03-09)
- **Status**: **IMPLEMENTED**.
- **Action**: Added Level 19 "Discriminant and Intersection" (判別式とグラフの共有点).
- **Visualization**: `DiscriminantViz` implementation (Canvas-based).
  - **Interactive Y-intercept**: Students can drag a slider to adjust the y-intercept $c$ dynamically for the parabola $y = x^2 - 4x + c$.
  - **Real-time Discriminant**: The value of $D = b^2 - 4ac$ updates automatically, visually demonstrating the connection between $D > 0$ (2 points), $D = 0$ (tangent), and $D < 0$ (no points).
- **Learning Value**: Directly maps the algebraic property of the discriminant to the geometric behavior of the parabola, bridging the gap between formula memorization and visual intuition. Critical for "Mathematical logic of intersections".

### v1.3.15: Correlation Coefficient Visualization (2026-03-09)
- **Status**: **IMPLEMENTED**.
- **Action**: Added Level 1 "相関関係と相関係数" (Correlation and Correlation Coefficient) to Data Analysis (データの分析).
- **Visualization**: `ScatterPlotViz` implementation (Canvas-based).
  - **Interactive Scatter Plot**: Students can drag data points on a 2D plane to manually alter the shape of the data distribution.
  - **Real-time Coefficient Calculation**: The correlation coefficient $r$ updates instantly as points move, visually bridging the algebraic formula to the shape of the scatter plot (positive, negative, or no correlation).
- **Learning Value**: Calculating the correlation coefficient is highly algebraic and tedious. This visualization completely removes the calculation burden, forcing students to intuitively grasp how outliers and grouping affect the $r$ value—a frequent intuitive trap in exams.
- **Next Step**: Expand to Level 2 "分散と標準偏差" (Variance and Standard Deviation) in Data Analysis.

### v1.3.16: Variance and Standard Deviation Visualization (2026-03-09)
- **Status**: **IMPLEMENTED**.
- **Action**: Added Level 2 "分散と標準偏差" (Variance and Standard Deviation) to Data Analysis (データの分析).
- **Visualization**: `VarianceViz` implementation (Canvas-based).
  - **Interactive Data Points**: Students can drag individual data values on a 1D dot plot to manipulate the dataset.
  - **Real-time Metrics**: Visualizes the mean as a central line, and draws the "deviation" (偏差) as squares whose areas represent the squared deviations. The average of these areas dynamically shows the Variance (分散), and the side length shows the Standard Deviation (標準偏差).
- **Learning Value**: Variance is often just a memorized formula ($\frac{1}{n}\sum(x_i - \bar{x})^2$). By visualizing the squared deviations as literal squares on the screen, students geometrically *feel* why outliers exponentially increase the variance, connecting the algebra to visual spread.
- **Next Step**: Expand to Level 3 "箱ひげ図とデータの散らばり" (Box Plots and Data Dispersion) or refine Trigonometry (図形と計量).

### v1.3.29: Necessary and Sufficient Conditions Visualization (2026-03-10)
- **Status**: **IMPLEMENTED**.
- **Action**: Added Level 2 "必要条件と十分条件" (Necessary and Sufficient Conditions) to Sets and Logic (集合と命題).
- **Visualization**: `NecessarySufficientViz` implementation.
  - **Interactive Scenarios**: Students can cycle through multiple classic scenarios (e.g., $x=2$ vs $x^2=4$, $x>0$ vs $x>1$).
  - **Visualizing Inclusion**: Dynamically visualizes the sets P and Q as nested circles, making it obvious which set is "inside" the other.
  - **Clarifying Terminology**: Clearly links the geometric inclusion (P is inside Q) to the terminology (P is sufficient for Q, Q is necessary for P).
- **Learning Value**: The terminology of "necessary" and "sufficient" is extremely confusing for high school students because it sounds abstract in natural language. By reducing the problem to "Which circle is inside which?", it turns a linguistic puzzle into a trivial geometric observation.
- **Next Step**: Polish Data Analysis or move to Quadratic Function systems.

### v1.3.30: Contrapositive Visualization (2026-03-10)
- **Status**: **IMPLEMENTED**.
- **Action**: Added Level 3 "逆・裏・対偶" (Converse, Inverse, Contrapositive) to Sets and Logic (集合と命題).
- **Visualization**: \`ContrapositiveViz\` implementation.
  - **Interactive Scenarios**: Students can cycle through "Original", "Converse", "Inverse", and "Contrapositive".
  - **Visualizing Inclusion**: Shows that if $P \implies Q$ (P is inside Q), then $\overline{Q} \implies \overline{P}$ (the outside of Q is inside the outside of P).
  - **Logical Equivalence**: Turns the abstract rule "Contrapositive is always true if the original is true" into a concrete visual proof about sets and their complements.
- **Learning Value**: Math I logic often trips students up on why the contrapositive holds while the converse and inverse do not. By grounding the logic in Venn diagrams (where "not P" is just the outer region), the truth value becomes instantly obvious rather than a memorized rule.
- **Next Step**: Polish existing logic levels or continue expanding Data Analysis.

### v1.3.32: Data Transformation Visualization (2026-03-10)
- **Status**: **IMPLEMENTED**.
- **Action**: Added Level 5 "データの変換" (Data Transformation) to Data Analysis (データの分析).
- **Visualization**: `DataTransformViz` implementation (Canvas-based).
  - **Interactive Sliders**: Students can dynamically adjust parameters $a$ (scale) and $b$ (shift) for the transformation $y = ax + b$.
  - **Visualizing Transformation**: Instantly shows the original data (blue dots) alongside the transformed data (orange dots) on parallel axes.
  - **Real-time Statistics Update**: Explicitly calculates and displays how the mean ($\bar{y} = a\bar{x} + b$), variance ($s_y^2 = a^2s_x^2$), and standard deviation ($s_y = |a|s_x$) react to scaling and shifting.
- **Learning Value**: Often taught purely through abstract formulas, students struggle to remember why adding $b$ doesn't change the variance. By interactively shifting and scaling the points and watching the "spread" indicator widen or slide, the geometric meaning behind the data transformation formulas becomes obvious.
- **Next Step**: Polish existing data analysis levels or focus strictly on Math I Trigonometry.
