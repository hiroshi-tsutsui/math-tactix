# System Wisdom (Math Tactix)

## Core Philosophy
- **User First:** Japanese middle/high school students preparing for exams.
- **Visual Intuition:** Math shouldn't just be formulas; it should be seen.
- **No Sci-Fi:** Educational credibility is paramount. Use standard terminology (e.g., "二次関数", "学習ログ").
- **Platform:** Next.js (App Router), Tailwind CSS, TypeScript.

## Evolution Log

### v1.3 - 2026-03-07
- **Feature:** Added "Vertex Form Conversion" (平方完成) generator.
- **Tech:** Modularized problem generation logic (`app/quadratics/utils/vertex-form-generator.ts`).
- **Pedagogy:** Focus on the procedural step of completing the square.
- **UX:** Added step-by-step explanations for correct answers in Tactics Mode.
- **Status:** Build successful. Ready for deployment.

### v1.4 - 2026-03-07
- **Feature:** Implemented Visual Feedback for Quadratic Functions (Tactics Mode).
- **Tech:** Created reusable `QuadraticGraph` component (Canvas-based).
- **Pedagogy:** Reinforces the connection between the algebraic form (Standard Form) and the geometric graph (Vertex, Opening direction).
- **UX:** Dynamic graph rendering based on problem parameters.
- **Status:** Build successful.

### v1.5 - 2026-03-07
- **Feature:** Added "Max/Min on Closed Interval" (定義域のある最大値・最小値) problems.
- **Tech:** 
  - Created `app/quadratics/utils/max-min-generator.ts`.
  - Enhanced `QuadraticGraph` to support domain shading and target point highlighting.
- **Pedagogy:** Visualizing the relationship between the vertex position and the domain boundaries is crucial for understanding max/min problems.
- **UX:** Blue shading for the domain, Red/Blue dots for Max/Min points.
- **Status:** Build successful.
