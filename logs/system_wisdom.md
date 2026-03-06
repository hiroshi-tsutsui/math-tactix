# System Wisdom Log - Math Tactix (v1.3)

## Principles
1.  **Localization First**: All UI text must use `locales/{lang}.json`. Hardcoded strings are technical debt.
2.  **Pedagogy Over Content**: Features must teach a concept (e.g., "二次関数", "平方完成"), not just display math.
3.  **Modular Architecture**: Components should be self-contained but share the global `LanguageContext`.
4.  **Resilient UX**: Error boundaries and 404 pages must handle failures gracefully.
5.  **NO SCI-FI**: Use standard Japanese educational terms (e.g., "学習ログ" instead of "Kernel Log").

## Cycle Log
- **2026-03-06 (Cycle 16)**: **COSINE RULE & RE-ALIGNMENT (v1.5.1)**:
    - **Target**: Trigonometric Ratios (三角比) - Mathematics I.
    - **Action**: Corrected module structure and added missing Level 5.
    - **Implementation**:
        - Added **Level 5**: Cosine Rule Visualization (余弦定理).
        - **Visual**: Triangle with fixed sides $b=10, c=14$ and variable angle $A$.
        - **Logic**: Real-time calculation of $a^2 = b^2 + c^2 - 2bc \cos A$.
        - **Overlay**: Displays the formula and values dynamically.
        - **Refactor**: Moved "Practice Quiz" to **Level 6**.
    - **Educational Value**: Visualizes the generalized Pythagorean theorem. Students can see how the term $-2bc \cos A$ adjusts the side length $a$ as angle $A$ changes.
    - **Build Status**: `npm run build` PASSED.

- **2026-03-06 (Cycle 15)**: **COEFFICIENT ANALYSIS (v1.5.0)**:
    - **Target**: Quadratic Functions (二次関数) - Mathematics I.
    - **Implementation**:
        - Added **Level 10**: Coefficient Analysis (係数とグラフ).
        - **Visual**: Displays a random parabola (e.g., $y = ax^2 + bx + c$).
        - **Interactive**: Users must determine the signs (+, 0, -) of $a, b, c$ and Discriminant $D$.
        - **Logic**: Real-time validation of user inputs against generated graph properties.
        - **Refactor**: Moved "Final Exam" to **Level 14** to accommodate intermediate levels (11-13) defined in localization.
        - **Educational Value**: Connects algebraic coefficients directly to geometric features (opening direction, axis position, y-intercept, x-intercepts).
    - **Build Status**: `npm run build` PASSED.

- **2026-03-05 (Cycle 13)**: **COSINE RULE (v1.4.3)**:
    - **Target**: Trigonometric Ratios (三角比) - Mathematics I.
    - **Implementation**:
        - Added **Level 4**: Cosine Rule Visualization (余弦定理).
        - **Visual**: Triangle with side lengths $a, b, c$ and angle $A$.
        - **Logic**: Real-time calculation of $a^2$ vs $b^2 + c^2 - 2bc \cos A$.
        - **Educational Value**: Visually proves the generalized Pythagorean theorem.
        - **Localization**: Added Japanese text for Levels 3 & 4 in `locales/ja.json`.
    - **Build Status**: `npm run build` PASSED.

- **2026-03-05 (Cycle 14)**: **TRIANGLE AREA (v1.4.4)**:
    - **Target**: Trigonometric Ratios (三角比) - Mathematics I.
    - **Implementation**:
        - Added **Level 5**: Triangle Area Visualization (三角形の面積).
        - **Visual**: Highlights two sides ($b, c$) and the included angle ($A$). Drops a perpendicular height line ($h = b \sin A$).
        - **Logic**: Real-time calculation of $S = \frac{1}{2}bc \sin A$.
        - **Educational Value**: Visually demonstrates *why* the sine function is used to find the area (it calculates the height).
        - **Localization**: Added Japanese text for Level 5 in `locales/ja.json`.
    - **Build Status**: `npm run build` PASSED.

- **2026-03-05 (Cycle 12)**: **SINE RULE (v1.4.2)**:
    - **Target**: Trigonometric Ratios (三角比) - Mathematics I.
    - **Implementation**:
        - Added **Level 3**: Sine Rule Visualization (正弦定理).
        - **Visual**: Triangle inscribed in a Circumcircle (Radius $R$).
        - **Interactive**: Users manipulate vertices A, B, C on the circle.
        - **Logic**: Real-time calculation of $\frac{a}{\sin A}, \frac{b}{\sin B}, \frac{c}{\sin C}$ and comparison with Diameter $2R$.
        - **Educational Value**: Visually proves that the ratio of a side to its opposite angle's sine is constant and equal to the diameter of the circumcircle.
    - **Build Status**: `npm run build` PASSED.

- **2026-03-05 (Cycle 11)**: **UNIT CIRCLE (v1.4.1)**:
    - **Target**: Trigonometric Ratios (三角比) - Mathematics I.
    - **Implementation**:
        - Added **Level 2**: Interactive Unit Circle (単位円).
        - **Concept**: Extended definition from "Triangle Ratios" to "Circle Coordinates".
        - **Visual**: Users manipulate a point on the Unit Circle (r=1).
        - **Logic**: Handles angles $0^\circ \le \theta \le 180^\circ$. Shows $\cos \theta = x$ and $\sin \theta = y$.
        - **UI**: Added Level Selector (Step 1 / Step 2) in the header.
        - **Localization**: Added Japanese text for "Unit Circle and Obtuse Angles".
    - **Educational Value**: Bridges the gap between "Geometry" (Triangle) and "Analysis" (Functions), crucial for understanding why $\cos 120^\circ = -0.5$.
    - **Build Status**: `npm run build` PASSED.

- **2026-03-05 (Cycle 10)**: **TRIGONOMETRY GENESIS (v1.4.0)**:
    - **Target**: Trigonometric Ratios (三角比) - Mathematics I.
    - **Implementation**:
        - Created **New Module**: `app/trig_ratios/` (Math I focus).
        - **Level 1**: Interactive Right Triangle (SOH CAH TOA).
        - **Visual**: Draggable vertex changes angle $\theta$ (5°-85°). Real-time updates of $\sin, \cos, \tan$ values.
        - **UI**: Color-coded sides (Hypotenuse=Green, Opposite=Red, Adjacent=Blue) to match ratio formulas.
        - **Integration**: Added to `modules_ja.json` and `locales/ja.json`.
    - **Educational Value**: Visualizes *why* ratios are constant for a given angle, regardless of triangle size (similarity).
    - **Build Status**: `npm run build` PASSED.

- **2026-03-05 (Cycle 9)**: **FULL LOCALIZATION & TACTICS EXPANSION (v1.3.8)**:
    - **Target**: Quadratic Functions (二次関数) - Completion & Exam.
    - **Status**: Implemented missing localization for Levels 10-13 and expanded Tactics Mode.
    - **Implementation**:
        - **Localized**: Added Japanese text for:
            - Level 10: Coefficient Analysis (係数とグラフ).
            - Level 11: Floating/Sinking (2次不等式の解なし/すべて).
            - Level 12: Roots Placement (解の配置問題).
            - Level 13: Moving Domain (動く定義域).
        - **Tactics Mode**: Added 3 new questions:
            - Q4: Intersection Count ($D > 0$).
            - Q5: Inequality Solution ($x^2 - 4 > 0$).
            - Q6: Max Value with fixed domain.
    - **Educational Value**: The module now fully covers the standard "Math I" Quadratic Functions curriculum, from basic graphs to advanced "Moving Domain" problems.
    - **Build Status**: `npm run build` PASSED.

- **2026-03-05 (Cycle 8)**: **TRANSLATION (v1.3.7)**:
    - **Target**: Quadratic Functions (二次関数) - グラフの平行移動 (Graph Translation).
    - **Implementation**:
        - Added **Level 9**: Interactive Graph Translation ($y = f(x-p) + q$).
        - **Visual**: Users must shift the blue graph ($y=2x^2$) to match the red target graph ($y=2(x-1)^2+1$).
        - **UI**: Sliders for $p$ (horizontal) and $q$ (vertical).
        - **Logic**: Visualizes the transformation $y - q = f(x - p)$.
        - Renamed previous "Final Exam" to Level 10.
    - **Educational Value**: Reinforces the concept that replacing $x$ with $(x-p)$ shifts right, and adding $q$ shifts up.
    - **Build Status**: `npm run build` PASSED.

- **2026-03-05 (Cycle 7)**: **DETERMINATION (v1.3.6)**:
    - **Target**: Quadratic Functions (二次関数) - 2次関数の決定 (Determining Quadratic Functions).
    - **Implementation**:
        - Added **Level 8**: Interactive Determination Visualization.
        - **Scenario**: Given Vertex $(2, 1)$ and Point $A(4, 5)$, find coefficient $a$.
        - **Visual**: Shows a dashed line from the parabola to point A when aligned.
        - **UI**: Slider for $a$ (0.1 to 2.0). Success when $a=1.0$.
        - Renamed previous "Final Exam" to Level 9.
    - **Educational Value**: Helps students visualize *why* plugging in a point determines the shape (aperture) of the parabola once the vertex is fixed.
    - **Build Status**: `npm run build` PASSED.

- **2026-03-05 (Cycle 6)**: **TACTICAL EXERCISES (v1.3.5)**:
    - **Target**: Quadratic Functions (二次関数) - 総合演習 (Comprehensive Exercises).
    - **Implementation**:
        - Expanded **Tactics Mode**: Added real-world exam-style questions (Center Test / Common Test style basics).
        - **New Questions**:
            - Intersection problems (find k for 2 points).
            - Inequality problems (integer solutions).
            - Max/Min problems with parameters.
        - **Feedback Engine**: Enhanced explanation for wrong answers (e.g., "Hint: Check the discriminant").
    - **Educational Value**: Bridges the gap between "Visual Understanding" (Learn Mode) and "Test Solving" (Tactics Mode).
    - **Build Status**: `npm run build` PASSED.

- **2026-03-05 (Cycle 5)**: **INTERSECTION (v1.3.4)**:
    - **Target**: Quadratic Functions (二次関数) - 放物線と直線の共有点 (Intersection of Parabola and Line).
    - **Implementation**:
        - Added **Level 7**: Interactive Intersection Visualization ($y = 0.5x^2$ vs $y = mx + k$).
        - **Visual**: Users can control slope ($m$) and intercept ($k$) of the line.
        - **Logic**: Real-time calculation of Discriminant ($D = m^2 + 2k$) to determine intersection status (2 points, 1 point, or none).
        - **Feedback**: Displays status "異なる2点で交わる", "接する", "共有点なし" based on $D$.
        - Renamed previous "Final Exam" to Level 8.
    - **Educational Value**: Visually connects the geometric concept of intersection to the algebraic concept of the Discriminant.
    - **Build Status**: `npm run build` PASSED.

- **2026-03-05 (Cycle 4)**: **INEQUALITIES (v1.3.3)**:
    - **Target**: Quadratic Functions (二次関数) - 2次不等式 (Quadratic Inequalities).
    - **Implementation**:
        - Added **Level 6**: Interactive Inequality Visualization ($x^2 - 4 > 0$ vs $x^2 - 4 < 0$).
        - **Visual**: Highlights the region on the x-axis corresponding to the part of the parabola above/below the axis.
        - **UI**: Buttons to toggle between $> 0$ and $< 0$. Shows the solution set ($x < -2, 2 < x$ vs $-2 < x < 2$).
        - Renamed previous "Final Exam" to Level 7.
    - **Educational Value**: Directly connects the graph's vertical position (y-value) to the horizontal solution set (x-range), a key concept often missed by students.
    - **Build Status**: `npm run build` PASSED.

- **2026-03-04 (Cycle 3)**: **DOMAIN & RANGE (v1.3.2)**:
    - **Target**: Quadratic Functions (二次関数) - 定義域と最大・最小 (Domain & Range).
    - **Implementation**:
        - Added **Level 5**: Domain Restrictions & Max/Min Analysis.
        - **Interactive Canvas**: Added shaded region for domain ($x_1 \le x \le x_2$).
        - **Visual cues**: Blue dot for Min, Red dot for Max. Automatically updates based on vertex position relative to domain.
        - **UI**: Added sliders for Domain Start/End and Axis Position.
        - Renamed previous "Bridge" level to Level 6 (Final Exam).
    - **Educational Value**: Helping students visualize the "Vertex vs Boundary" logic for finding max/min values, a common stumbling block in Math I.
    - **Build Status**: `npm run build` PASSED.

- **2026-03-04 (Cycle 2)**: **DISCRIMINANT (v1.3.1)**:
    - **Target**: Quadratic Functions (二次関数) - 判別式 (Discriminant).
    - **Implementation**:
        - Added **Level 4**: Interactive Discriminant Visualization ($D = b^2 - 4ac$).
        - Users can manipulate coefficients $a, b, c$ via sliders.
        - Real-time calculation of $D$ and root visualization (Green dots for $D > 0$).
        - Renamed previous "Bridge" level to Level 5.
    - **Educational Value**: Visual proof of how coefficients affect the existence of real roots.
    - **Build Status**: `npm run build` PASSED.

- **2026-03-04**: **RE-ALIGNMENT (v1.3)**:
    - **Policy Shift**: Stopped Dark Mode/Sci-Fi development. Pivoted to "Math I" (Mathematics I) curriculum focus.
    - **Target**: Quadratic Functions (二次関数).
    - **Action**: Removed "Gravity Simulation" branding. Replaced with "二次関数 (Quadratic Functions)".
    - **Implementation**:
        - Updated `app/quadratics/page.tsx` to remove game-like terminology.
        - Refined "Completing the Square" visualization (Levels 2 & 3) to be more educational.
        - Renamed badge display from "Gravity Master" to "Quadratics Master".
    - **Localization**: Updated `locales/ja.json` with standard math terms (e.g., "頂点の移動", "平方完成").
    - **Build Status**: `npm run build` PASSED.