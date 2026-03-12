### v1.3.99: 放物線に内接する長方形の周の長さの最大化 (Maximizing Perimeter of Inscribed Rectangle) (2026-03-12)
- **Status**: **IMPLEMENTED**.
- **Action**: Added Level 48 "放物線に内接する長方形の周の長さ" (Perimeter of Rectangle Inscribed in a Parabola) to Math I Quadratic Functions (二次関数).
- **Visualization**: `InscribedPerimeterViz` implementation.
  - **Interactive Graphic**: Visualizes $y = 4 - x^2$ and dynamically draws an inscribed rectangle as the student adjusts the x-coordinate of the vertex $P(t, 4-t^2)$.
  - **Connecting Geometry to Algebra**: Explicitly shows how the geometric width ($2t$) and height ($4-t^2$) combine into the perimeter function $L = -2t^2 + 4t + 8$.
  - **Visualizing the Maximum**: Students can visually slide the rectangle to find the "sweet spot" where the perimeter is maximized, confirming the algebraic result of completing the square.
- **Learning Value**: "Maximization of inscribed shapes" is a notoriously difficult exam question because students struggle to set up the objective function. They often confuse whether to maximize area or perimeter. By visually expanding and shrinking the rectangle, the abstract setup phase becomes an obvious geometric task.
- **Next Step**: Polish existing Quadratics levels and move fully into Math I Numbers and Algebraic Expressions (数と式).

### v1.3.94: 命題の真偽と反例 (Truth of Propositions and Counterexamples) (2026-03-12)
- **Status**: **IMPLEMENTED**.
- **Action**: Added Level 10 "命題の真偽と反例" (Truth of Propositions and Counterexamples) to Sets and Logic (集合と命題).
- **Visualization**: `CounterexampleViz` implementation.
  - **Interactive Scenarios**: Students explore multiple core Math I scenarios (e.g., "$x>0 \implies x>2$", "Primes are odd", "$x^2=4 \implies x=2$").
  - **Visualizing Inclusion/Exclusion**: Clearly shows how a proposition is true *only if* the hypothesis (P) is completely enclosed inside the conclusion (Q).
  - **Highlighting the Counterexample**: Visually animates the specific element (the "Counterexample") that falls inside P but outside Q, flashing it on the screen.
- **Learning Value**: Math I students universally confuse "Why is this false?" when most cases are true (e.g., primes being odd except for 2). By visualizing the Sets P and Q as Venn diagrams, they geometrically understand that a single "rogue" element hanging outside the Q circle breaks the entire "P implies Q" logical chain. It shifts the concept from an abstract logic rule to an obvious physical geometry check.
- **Next Step**: Polish Math I Data Analysis (データの分析) or continue to expand Trigonometry limits.

### v1.3.87: Factoring by Substitution (置き換えによる因数分解) (2026-03-11)
- **Status**: **IMPLEMENTED**.
- **Action**: Added Level 21 "置き換えによる因数分解" (Factoring by Substitution) to Math I Numbers and Algebraic Expressions (数と式).
- **Visualization**: `FactoringSubstitutionViz` implementation.
  - **Interactive Step-by-Step Guidance**: Breaks down the complex algebraic manipulation of a 4th-degree-like polynomial into 5 distinct logical steps.
  - **Visualizing the Substitution**: Clearly highlights the shared term $x^2 - 3x$ and visually swaps it for a simpler variable $A$.
  - **Iterative Factoring**: Demonstrates how factoring $A^2 - 2A - 8$ simplifies the problem, followed by the crucial step of reversing the substitution to uncover the final factorized form.
- **Learning Value**: Math I students universally struggle with advanced factoring because they attempt to expand expressions blindly. By interactively forcing them to recognize the shared pattern and treating it as a single "block" before expanding, it transitions abstract grouping techniques into concrete, step-by-step puzzle-solving.
- **Next Step**: Polish Data Analysis (データの分析) or move into Linear Equation Word Problems (1次方程式の文章題).

### v1.3.85: Number of Integer Solutions in an Inequality (不等式の整数解の個数) (2026-03-11)
- **Status**: **IMPLEMENTED**.
- **Action**: Added Level 19 "不等式の整数解の個数" (Number of Integer Solutions) to Math I Numbers and Algebraic Expressions (数と式). Also fixed a critical issue where Levels 17 (絶対値の和と最小値) and 18 (連立不等式が解をもつ条件) were missing from the UI rendering logic, successfully activating all three levels.
- **Visualization**: `IntegerSolutionsInequalityViz` implementation.
  - **Interactive Number Line**: Students dynamically drag the upper bound parameter $a$ for the simultaneous inequality $x > 2$ and $x \le a$.
  - **Visualizing Integer Count**: Explicitly plots the integers on the number line. When an integer falls inside the valid range, it visually lights up and pulses.
  - **Solving the Boundary Trap**: Explains physically why the boundary values matter. If the target is exactly 3 integers (3, 4, 5), students can drag the slider to $a = 5$ (which includes 5 because it is $\le$) and $a = 5.9$ (which still only includes up to 5). Dragging it to $a = 6$ immediately includes a 4th integer, proving why the strict inequality $a < 6$ is necessary at the upper boundary.
- **Learning Value**: Math I students universally fall into the "Does it include the equal sign?" trap when dealing with integer solution counts. By turning the algebraic range into a physical "net" that scoops up integers, and explicitly highlighting the moment a new integer is caught on the boundary, the case-splitting logic becomes an undeniable physical fact rather than an abstract rule.
- **Next Step**: Polish existing levels or finalize Math I Sets and Logic (集合と命題).


# System Wisdom & Evolution Log (v1.3)

## Mission Statement
"Visual & Intuitive Math" - Empowering Japanese students to master Math I (数学I) through interactive visualization.
**NO SCI-FI.** **NO FLUFF.** **JUST MATH.**

## Evolution History
### v1.4.11: 針金を切って作る正方形の面積の和の最小化 (Wire Squares Area Minimization) (2026-03-12)
- **Status**: **IMPLEMENTED**.
- **Action**: Added Level 54 "針金を切って作る正方形の面積の和の最小化" (Minimizing the Sum of Areas of Two Squares from a Cut Wire) to Quadratic Functions (二次関数).
- **Visualization**: `WireSquaresViz` implementation.
  - **Interactive Cut Point**: Students adjust a slider representing the physical cut point along a wire.
  - **Dynamic Squares**: As the cut point moves, the two resulting squares dynamically scale up and down, displaying their side lengths and individual areas.
  - **Connecting Geometry to Algebra**: Explains step-by-step how the sum of the areas translates into a quadratic function.
  - **Visualizing the Minimum**: Visually highlights when the wire is cut exactly in half, producing two identical squares that together result in the lowest total area.
- **Learning Value**: This is the quintessential first "応用問題" (Application Word Problem) of quadratics for Math I students. Converting lengths into separate variables often leads to calculation errors or misunderstanding the domain. By seeing the literal squares expand and shrink, the geometric necessity of cutting it in half to minimize the squared area loss becomes physically obvious.
- **Next Step**: Continue focusing on core Math I topics such as Data Analysis (データの分析) or explore edge cases.


### v1.4.10: 壁を利用した長方形の面積の最大化 (Maximizing Rectangular Enclosure Area) (2026-03-12)
- **Status**: **IMPLEMENTED**.
- **Action**: Added Level 53 "壁を利用した長方形の面積の最大化" (Maximizing Area of a Rectangular Enclosure) to Quadratic Functions (二次関数).
- **Visualization**: `FenceEnclosureViz` implementation.
  - **Interactive Graphic**: Visualizes a 20m fence enclosing a rectangular area against a wall.
  - **Parameter Tuning**: Students can drag a slider to adjust the perpendicular side length $x$, watching the parallel side $20-2x$ dynamically update.
  - **Geometric Intuition**: Instantly shows how widening the enclosure simultaneously reduces its depth, enforcing the trade-off inherent in the objective function $S = x(20-2x)$. The quadratic graph syncs with the physical area, proving the vertex max.
- **Learning Value**: Math I students universally struggle with converting geometric word problems into algebraic equations. By dynamically stretching the shape and watching the calculated Area peak, the necessity of creating a quadratic equation and finding its vertex becomes physically obvious.
- **Next Step**: Polish existing chapters and refine remaining core Math I edge cases.

### v1.4.9: 円順列 (Circular Permutations) (2026-03-12)
- **Status**: **IMPLEMENTED**.
- **Action**: Added Level 8 "円順列" (Circular Permutations) to Probability (場合の数と確率).
- **Visualization**: `CircularPermutationViz` implementation.
  - **Interactive Graphic**: Students can toggle between "一列 (Linear)" and "円 (Circular)" modes for a set of $n$ distinct items.
  - **Dynamic Rotation**: In the "Circular" mode, students can physically click a rotate button to shift the elements around the circle, proving that $n$ distinct physical states map to the exact same relative circular arrangement.
  - **Formula Connection**: The explanation directly maps the visual of "divide by $n$ rotations" to the abstract formula $\frac{n!}{n} = (n-1)!$.
- **Learning Value**: Math A students frequently memorize $(n-1)!$ without understanding *why* the $-1$ is there. By switching between a straight line and a circle, and rotating the circle to show redundant states, the division by $n$ becomes a physical necessity to prevent overcounting, completely replacing rote memorization.
- **Next Step**: Continue expanding core Math A topics or explore Sets and Logic.


### v1.4.7: 箱ひげ図とヒストグラムの対応 (Box Plot and Histogram Relationship) (2026-03-12)
- **Status**: **IMPLEMENTED**.
- **Action**: Added Level 7 "箱ひげ図とヒストグラム" (Box Plot and Histogram) to Data Analysis (データの分析).
- **Visualization**: `HistogramBoxPlotViz` implementation.
  - **Interactive Graphic**: Visualizes a histogram with adjustable bin frequencies.
  - **Real-time Linkage**: A box plot sits directly below the histogram on the same x-axis. As students drag the histogram bars up or down to change the data distribution, the box plot dynamically updates its Min, Q1, Median, Q3, and Max.
  - **Visualizing Area = Percentile**: Explicitly links the accumulated area of the histogram to the quartiles using dashed vertical lines.
- **Learning Value**: The relationship between histogram shapes and box plots is a guaranteed topic on the Japanese Common Test (共通テスト). Students universally struggle because they look at the "height" of the box plot instead of understanding that the "width" of the box represents the spread of the middle 50% of the data. By dynamically reshaping the histogram to be right-skewed or left-skewed and watching the box stretch and compress, the student builds an undeniable physical intuition for density vs. spread.
- **Next Step**: Continue focusing on core Math I topics or expand into Data Analysis combined variance calculation.


### v1.4.6: 展開の工夫 (置き換え) (Expansion by Substitution) (2026-03-12)
- **Status**: **IMPLEMENTED**.
- **Action**: Added Level 31 "展開の工夫 (置き換え)" (Expansion by Substitution) to Math I Numbers and Algebraic Expressions (数と式).
- **Visualization**: `ExpansionSubstitutionViz` implementation.
  - **Interactive Step-by-Step Guidance**: Breaks down the extremely confusing expansion of $(x + y - z)(x - y + z)$ into 5 distinct logical steps.
  - **Visualizing the Bracket Rule**: Explicitly shows how grouping the latter two terms with a minus sign reveals the hidden common factor $(y-z)$.
  - **Substitution Logic**: Guides the student to replace the common "block" with a single letter $A$, turning a 9-term chaotic expansion into a trivial $(a+b)(a-b) = a^2 - b^2$ formula application.
- **Learning Value**: Math I students universally hit a wall when presented with complex polynomials involving 4 terms that seem to have no direct commonality. They blindly expand everything and get lost in signs. By breaking down the process of "creating a common block by factoring out a minus sign", the student learns pattern recognition over brute force calculation.
- **Next Step**: Continue focusing on core Math I topics such as Data Analysis (データの分析) or expand into Linear Inequalities word problems.


### v1.4.4: 2次関数の最大・最小の応用 (動点問題) (2026-03-12)
- **Status**: **IMPLEMENTED**.
- **Action**: Added Level 51 "2次関数の最大・最小の応用 (動点と面積)" (Max/Min Application: Moving Points and Area) to Quadratic Functions (二次関数).
- **Visualization**: `MovingPointAreaViz` implementation.
  - **Interactive Graphic**: Visualizes a right triangle ABC where two points P and Q move simultaneously along the edges.
  - **Parameter Tuning**: Students can drag a slider to advance time $t$ and watch points P and Q move.
  - **Geometric Intuition**: Shows the resulting triangle $\triangle PCQ$, calculates its side lengths dynamically, and connects the physical area to the quadratic function $S = -t^2 + 6t$.
- **Learning Value**: Math I students universally struggle with "Moving Point" problems (動点問題) because visualizing the shapes changing over time while simultaneously formulating the algebraic expression is overwhelming. By linking the time slider to the physical area and the quadratic equation, students can see the peak (vertex) of the area function coincide with the geometric maximum.
- **Next Step**: Polish Data Analysis or finalize Math I chapters.

### v1.4.2: 平方根の大小比較 (Comparing Square Roots) (2026-03-12)
- **Status**: **IMPLEMENTED**.
- **Action**: Added Level 29 "平方根の大小比較" (Comparison of Square Roots) to Math I Numbers and Algebraic Expressions (数と式).
- **Visualization**: `RootComparisonViz` implementation.
  - **Interactive Graphic**: Visualizes the comparison of two sums of square roots (e.g., $\sqrt{a} + \sqrt{b}$ vs $\sqrt{c} + \sqrt{d}$).
  - **Parameter Tuning**: Students can adjust the values of $a, b, c, d$ dynamically.
  - **Logic Unveiling**: When the integer sum parts ($a+b$ and $c+d$) are equal, the component mathematically and visually demonstrates that comparing the squares directly simplifies to comparing the product terms ($2\sqrt{ab}$ and $2\sqrt{cd}$). 
- **Learning Value**: "Which is larger, $\sqrt{5} + \sqrt{6}$ or $\sqrt{3} + \sqrt{8}$?" is a notoriously common trap problem on Math I tests. Students often try to estimate the decimals (e.g., $\sqrt{5} \approx 2.23$) and make arithmetic errors. By clearly juxtaposing the expanded squared forms, the student internalizes the core principle that "squaring positive values preserves their inequality".
- **Next Step**: Polish Math I Data Analysis or expand further into remaining Numbers and Algebraic Expressions test-patterns.

### v1.3.101: 展開の工夫 (組み合わせ) (Expansion by Grouping) (2026-03-11)
- **Status**: **IMPLEMENTED**.
- **Action**: Added Level 28 "展開の工夫 (組み合わせ)" (Expansion by Grouping) to Math I Numbers and Algebraic Expressions (数と式).
- **Visualization**: `ExpansionGroupingViz` implementation.
  - **Interactive Step-by-Step Guidance**: Breaks down the expansion of $(x+1)(x+2)(x+3)(x+4)$ into 5 logical steps.
  - **Visual Highlighting**: Explicitly highlights the pairs $(x+1)(x+4)$ and $(x+2)(x+3)$ and shows that their constant sums are identical ($1+4=5$, $2+3=5$).
  - **Substitution Visualization**: Explains the logic of substituting $A = x^2 + 5x$ to prevent exploding terms, and then cleanly reversing the substitution.
- **Learning Value**: Math I students universally blindly expand 4-term products, resulting in massive arithmetic errors. By visually separating the "pairing phase" from the "expansion phase", students realize that looking ahead for shared components ($x^2 + 5x$) is vastly superior to brute force.
- **Next Step**: Polish Data Analysis or continue to Trigonometry.


### v1.3.100: 不等式の性質と式の値の範囲 (Properties of Inequalities and Range of Values) (2026-03-12)
- **Status**: **IMPLEMENTED**.
- **Action**: Added Level 27 "不等式の性質と式の値の範囲" (Properties of Inequalities and Range of Values) to Math I Numbers and Algebraic Expressions (数と式).
- **Visualization**: `InequalityRangeViz` implementation.
  - **Interactive Operation Selection**: Students can select addition ($x+y$), subtraction ($x-y$), multiplication ($xy$), or division ($x/y$).
  - **Visualizing the Logic**: Dynamically explains *why* the minimum value of $x-y$ is calculated by subtracting the *maximum* possible $y$ from the *minimum* possible $x$.
  - **Color-Coded Feedback**: Uses red warnings for subtraction and purple warnings for division to explicitly highlight the classic "trap" of subtracting/dividing minimum by minimum.
- **Learning Value**: Math I students universally fall for the trap of calculating $1-2 < x-y < 3-4$ when given $1<x<3$ and $2<y<4$. By explicitly separating the operations and putting big, colored warnings on the logic of "making a number smaller by taking away the biggest chunk", the abstract calculation rule is firmly grounded in physical logic.
- **Next Step**: Continue focusing on core Math I topics such as Data Analysis (データの分析) or expand into Linear Inequalities word problems.

### v1.3.98: 平方根と絶対値の文字式簡約化 (Simplification of Square Roots and Absolute Values) (2026-03-12)
- **Status**: **IMPLEMENTED**.
- **Action**: Added Level 26 "平方根と絶対値 (文字式の簡約化)" (Simplification of Square Roots and Absolute Values) to Math I Numbers and Algebraic Expressions (数と式).
- **Visualization**: `RootAbsoluteSimplificationViz` implementation.
  - **Interactive Number Line**: Students dynamically drag the value of $x$ across the number line.
  - **Visualizing the Domain**: The number line explicitly splits into 3 colored zones ($x < 2$, $2 \le x < 5$, $x \ge 5$).
  - **Case Splitting Logic**: As $x$ moves across the boundaries, the absolute values $|x-2|$ and $|x-5|$ dynamically "flip" their signs, visually proving why the final simplified expression changes from $-2x+7$ to $3$ to $2x-7$.
- **Learning Value**: Math I students universally fall for the trap of simplifying $\sqrt{(x-2)^2} + \sqrt{(x-5)^2}$ blindly into $2x-7$. By forcing them to slide $x$ and watch the terms react to being positive or negative, the abstract necessity of case splitting becomes an undeniable physical boundary check.
- **Next Step**: Continue focusing on core Math I topics such as Data Analysis (データの分析) or expand into Linear Inequalities word problems.


### v1.3.97: 度数分布表と代表値 (Frequency Distribution Table and Representative Values) (2026-03-12)
- **Status**: **IMPLEMENTED**.
- **Action**: Added Level 6 "度数分布表と代表値" (Frequency Distribution Table and Representative Values) to Data Analysis (データの分析).
- **Visualization**: `FrequencyTableViz` implementation.
  - **Interactive Histogram**: Students can drag the height of each frequency bin up and down interactively.
  - **Real-time Table Mapping**: The frequency distribution table updates its values simultaneously.
  - **Visualizing Mean and Median**: A vertical red line dynamically moves to show the exact mean (calculated via class marks), and the median class is vividly highlighted in purple.
- **Learning Value**: Math I students often memorize the formula for the mean from a frequency table without connecting the "class mark $\times$ frequency" to the physical center of mass of the histogram. By dragging the bars and watching the mean line shift and the median class jump, the abstract calculation is anchored to geometric intuition.
- **Next Step**: Polish Data Analysis or continue to Math I Numbers and Algebraic Expressions (数と式).


### v1.3.95: 1次方程式 ax = b の解の分類 (Solution of Linear Equation ax = b) (2026-03-12)
- **Status**: **IMPLEMENTED**.
- **Action**: Added Level 24 "1次方程式 ax = b の解の分類" (Classification of Solutions for Linear Equation ax = b) to Math I Numbers and Algebraic Expressions (数と式).
- **Visualization**: `LinearEquationCasesViz` implementation.
  - **Interactive Graphic**: Visualizes $y = ax$ (a line passing through the origin) and $y = b$ (a horizontal line) on a 2D plane.
  - **Parameter Tuning**: Students can adjust the slope $a$ and the height $b$ using sliders.
  - **Dynamic Case Logic**:
    - When $a 
eq 0$: Visually confirms the two lines intersect at exactly one point ($x = b/a$).
    - When $a = 0, b = 0$: The lines perfectly overlap on the x-axis, visually proving "Infinite solutions" (すべての実数).
    - When $a = 0, b 
eq 0$: The lines are strictly parallel, visually proving "No solution" (解なし/不能).
- **Learning Value**: Math I students universally blindly divide by $a$ when solving $ax = b$, completely forgetting to check if $a = 0$. By splitting the equation into two linear graphs, the algebraic trap of dividing by zero is transformed into an obvious geometric observation about parallel vs overlapping lines.
- **Next Step**: Continue focusing on core Math I topics such as Data Analysis or Trigonometry.



### v1.3.93: 次数下げによる高次式の値 (2026-03-12)
- **Status**: **IMPLEMENTED**.
- **Action**: Added Level 23 "次数下げによる高次式の値" (Higher Degree Value by Degree Reduction) to Math I Numbers and Algebraic Expressions (数と式).
- **Visualization**: `HigherDegreeValueViz` implementation.
  - **Interactive Step-by-Step Guidance**: Breaks down the complex algebraic manipulation of substituting an irrational number like $x = (1 + \sqrt{5})/2$ into a 3rd or 4th-degree polynomial.
  - **Visualizing the Degree Reduction**: Shows how creating a quadratic equation ($x^2 - x - 1 = 0$) allows the student to use polynomial long division. The remainder becomes the simplified expression, dropping the degree massively.
- **Learning Value**: Math I students universally struggle with "value of higher degree expressions" because they try to brute-force plug the irrational number into $x^3$ and $x^4$. By visually separating the "divisor = 0" part, they intuitively grasp that the quotient is annihilated, leaving only a simple linear remainder to evaluate.
- **Next Step**: Polish existing levels or finalize Math I Sets and Logic (集合と命題).


### v1.3.92: Combinations with Repetition (重複組合せ) (2026-03-12)
- **Status**: **IMPLEMENTED**.
- **Action**: Added Level 7 "重複組合せ (nHr)" (Combinations with Repetition) to Probability (場合の数と確率).
- **Visualization**: `CombinationRepetitionViz` implementation.
  - **Interactive Bins and Balls**: Students adjust the number of items (balls) $n$ and categories (bins) $r$ using sliders.
  - **Visualizing the Formula**: Explicitly maps the abstract formula $_{n+r-1}C_{n}$ to the physical arrangement of $n$ balls and $r-1$ dividers in a single row.
  - **Real-time Equation Mapping**: Shows how the arrangement of balls and dividers directly maps to the integer solutions of the equation $x_1 + x_2 + \dots + x_r = n$, displaying the grouped sums visually below the arrangement.
- **Learning Value**: Math A students frequently memorize the $nHr$ formula blindly and forget whether to add or subtract 1. By visually dropping $n$ balls and $r-1$ dividers into slots, the total number of slots $(n+r-1)$ becomes physically obvious, completely eliminating the need to memorize the abstract formula.
- **Next Step**: Continue expanding Math A probability or transition into advanced Math I Data Analysis.

### v1.3.90: Shortest Paths Probability Visualization (最短経路の数) (2026-03-11)
- **Status**: **IMPLEMENTED**.
- **Action**: Fully wired and implemented Level 6 "最短経路の数 (Shortest Paths)" in Probability (場合の数と確率). The component `ShortestPathViz` was imported but never rendered.
- **Visualization**: `ShortestPathViz` implementation.
  - **Interactive Grid**: Visualizes a 2D grid pathfinding problem where students can change the grid size using an interactive slider.
  - **Obstacle Placement**: By clicking on any intersection, students can toggle a roadblock (×), and the dynamic programming table recalculates the number of valid paths instantly.
  - **Real-time Combinatorics**: Explains the pathfinding using both combinatorics (e.g. `_{w+h}C_w`) when no obstacles exist, and additive logic (left + bottom) when obstacles break the pure formula.
- **Learning Value**: Math A students frequently memorize the combination formula for shortest paths but freeze when a test question introduces an impassable pond or intersection. By interactively dropping a roadblock and watching the downstream path counts plummet, students geometrically grasp the addition rule that underlines the combinatorics.
- **Next Step**: Continue expanding core Math A topics or transition to Trigonometry (図形と計量) missing modules like Sine Rule.

### v1.3.88: 1次不等式の文章題 (食塩水・濃度) (2026-03-11)
- **Status**: **IMPLEMENTED**.
- **Action**: Added Level 22 "1次不等式の文章題 (食塩水・濃度)" (Word Problem of Linear Inequality - Salt Water) to Math I Numbers and Algebraic Expressions (数と式). Also fully bound Levels 20 and 21 into the UI array to ensure visibility.
- **Visualization**: `SaltWaterInequalityViz` implementation.
  - **Interactive Graphic**: A visual beaker showing the proportion of salt (fixed) vs water (increasing as water is added).
  - **Dynamic Tracking**: As the user slides the amount of added water, the total weight and the concentration percentage update in real time.
  - **Visual Threshold**: When the concentration drops below the 10% target, the UI gives explicit visual feedback ("条件クリア"), linking the physical addition of water to solving the rational inequality.
- **Learning Value**: Math I students universally struggle with "salt water" problems because the abstract rational expression $\frac{20}{100+x}$ masks the physical reality that adding water only increases the denominator. By watching the beaker fill up and the concentration dynamically thin out, this classic test word problem turns into an obvious visual relationship.
- **Next Step**: Polish Math I Data Analysis (データの分析) or expand into Sets and Logic (集合と命題).


### v1.3.86: Absolute Value Inequalities with Case Splitting (絶対値を含む不等式 (場合分け)) (2026-03-11)
- **Status**: **IMPLEMENTED**.
- **Action**: Added Level 20 "絶対値を含む不等式 (場合分け)" (Absolute Value Inequalities with Case Splitting) to Math I Numbers and Algebraic Expressions (数と式).
- **Visualization**: `AbsoluteInequalityCaseSplitViz` implementation.
  - **Interactive Graphic**: Visualizes the equation $|x - a| < bx + c$ dynamically.
  - **Case Splitting**: Explicitly maps the two cases ($x \ge a$ and $x < a$) to the two algebraic equations representing the left and right arms of the V-shape.
- **Learning Value**: Math I students frequently memorize the procedure for case-splitting but forget to check whether their final answer actually satisfies the initial condition (e.g. $x \ge a$). The visual representation clearly connects the algebraic case splitting to the geometric "arms" of the absolute value function.
- **Next Step**: Continue exploring edge cases in Math I Numbers (e.g. integer solutions on a restricted domain) or transition to Math I Data Analysis.

### v1.3.84: Condition for Solutions in Simultaneous Inequalities (連立不等式が解をもつ条件) (2026-03-11)
- **Status**: **IMPLEMENTED**.
- **Action**: Added Level 18 "連立不等式が解をもつ条件" (Condition for Solutions in Simultaneous Inequalities) to Math I Numbers and Algebraic Expressions (数と式).
- **Visualization**: `ConditionForSimultaneousInequalitiesViz` implementation.
  - **Interactive Ranges**: The visualization features a fixed blue range ($-2 < x < 3$) and a moving red range ($x > a$).
  - **Visualizing Overlap**: As the student adjusts the parameter $a$, the overlapping region is dynamically highlighted in purple.
  - **Logical Boundary Checking**: Explicitly shows why $a < 3$ guarantees an overlap, and visually proves that at $a=3$, both ranges have open circles (excluding the boundary), meaning the overlap instantly vanishes.
- **Learning Value**: Math I students universally stumble on "Does it include the boundary?" (i.e. should it be $a < 3$ or $a le 3$?). When dealing with open circles ($<$), the visualizer clearly shows that sitting directly on top of another open circle does not create a shared point, replacing an abstract rule with obvious physical geometry.
- **Next Step**: Continue exploring edge cases in Math I Numbers (e.g. integer solutions on a restricted domain) or transition to Math II logic.


### v1.3.82: Graph of Sum of Absolute Values (絶対値の和のグラフと最小値) (2026-03-11)
- **Status**: **IMPLEMENTED**.
- **Action**: Added Level 17 "絶対値の和と最小値 (メジアン)" (Graph of Sum of Absolute Values and its Minimum) to Math I Numbers and Algebraic Expressions (数と式).
- **Visualization**: `SumOfAbsoluteValuesViz` implementation.
  - **Interactive Piecewise Graph**: Visualizes the bucket-like shape of $y = \sum |x - a_i|$ dynamically.
  - **Movable Points**: Students can drag the individual absolute value centers $a_i$ along the x-axis and instantly watch the bucket graph morph and stretch.
  - **Visual Proof of the Median**: Clearly demonstrates why an odd number of absolute values (e.g., 3 or 5) has a sharp minimum precisely at the median $x$ value, and why an even number creates a flat "plateau" at the bottom where the minimum spans the entire interval between the two middle values.
- **Learning Value**: This is a classic, high-level Math I exam problem. Students usually solve it by performing tedious, error-prone case splitting (場合分け) across 4 or 6 intervals. By seeing the physical graph and understanding that the slope changes by $\pm 1$ at every $a_i$, they can instantly find the minimum just by looking for the median point, bypassing pages of algebra.
- **Next Step**: Continue exploring edge cases in Math I Numbers or move to advanced Data Analysis concepts.


### v1.3.80: 3項の分母の有理化 (Rationalizing 3-Term Denominators) (2026-03-11)
- **Status**: **IMPLEMENTED**.
- **Action**: Added Level 16 "3項の分母の有理化" (Rationalizing 3-Term Denominators) to Math I Numbers and Algebraic Expressions (数と式).
- **Visualization**: `ThreeTermsRationalizationViz` implementation.
  - **Step-by-Step Focus**: Breaks down the extremely error-prone procedure of rationalizing $1 / (1 + \sqrt{2} + \sqrt{3})$ into 5 distinct logical steps.
  - **Visual Grouping**: Explicitly shows the "grouping" of two terms $(1 + \sqrt{2})$ using brackets, guiding the student to treat it as a single block $A$.
  - **Iterative Rationalization**: Clearly demonstrates why one application of the conjugate is not enough, and visualizes the second rationalization step.
- **Learning Value**: Math I students universally stumble when presented with 3 terms in the denominator because they try to rationalize all at once or group the wrong terms. By breaking it into an interactive linear flow and highlighting the "block" substitution, this tedious algebraic nightmare becomes a predictable, 2-stage process.
- **Next Step**: Continue exploring edge cases in Math I Numbers or move to advanced Sets and Logic (集合と命題).

### v1.3.78: Bi-quadratic Factoring (Difference of Squares) (複二次式の因数分解) (2026-03-11)
- **Status**: **IMPLEMENTED**.
- **Action**: Added Level 15 "複二次式の因数分解 (平方の差)" (Bi-quadratic Factoring: Difference of Squares) to Math I Numbers and Algebraic Expressions (数と式).
- **Visualization**: `BiQuadraticFactoringViz` implementation.
  - **Step-by-Step Logic**: Breaks down the infamous $x^4+x^2+1$ factoring into 7 interactive steps.
  - **Visual Highlighting**: Explicitly highlights the substitution failure ($X^2+X+1$) and the pivot to "focusing on the ends" to force $(x^2+1)^2$.
  - **Creating the Difference**: Visually proves why adding $+x^2$ and subtracting $-x^2$ perfectly transforms the expression into $A^2 - B^2$.
- **Learning Value**: Math I students hit a massive wall with this specific problem type because they cannot see *why* someone would think to add and subtract $x^2$ out of thin air. By walking them through the "ideal shape vs reality" comparison, the addition of $x^2$ becomes a logical necessity rather than a memorized magic trick.
- **Next Step**: Continue exploring complex factorization techniques or refine 1D linear inequalities.

### v1.3.76: Parametric Linear Inequalities (文字係数の1次不等式) (2026-03-11)
- **Status**: **IMPLEMENTED**.
- **Action**: Added Level 14 "文字係数の1次不等式" (Parametric Linear Inequalities) to Math I Numbers and Algebraic Expressions (数と式). Also fixed the rendering pipeline for Levels 12 and 13.
- **Visualization**: `ParametricLinearInequalityViz` implementation.
  - **Interactive Sliders**: Students adjust the parameters $a$ and $b$ for the inequality $ax > b$.
  - **Visual Case Splitting**: Explicitly checks the sign of $a$. When $a < 0$, it explicitly shows the inequality sign flipping. When $a = 0$, it visually highlights the evaluation of $0 > b$ to decide between "All Real Numbers" (すべての実数) or "No Solution" (解なし).
- **Learning Value**: Math I students universally fall for the trap of carelessly dividing by $a$ without splitting cases into $a>0$, $a=0$, and $a<0$. By sliding $a$ across the number line and watching the solution dynamically snap to different formats (and watching the inequality sign physically flip), the abstract requirement of "場合分け" (case splitting) becomes an undeniable physical boundary check.
- **Next Step**: Continue exploring edge cases in Math I Numbers (e.g., Fractional Absolute Values) or move to Data Analysis.

### v1.3.75: Absolute Value Equations with Case Splitting (絶対値を含む方程式の場合分け) (2026-03-11)
- **Status**: **IMPLEMENTED**.
- **Action**: Added Level 13 "絶対値を含む方程式 (場合分け)" (Absolute Value Equations with Case Splitting) to Math I Numbers and Algebraic Expressions (数と式).
- **Visualization**: `AbsoluteCaseSplitViz` implementation.
  - **Interactive Graphic**: Visualizes $y = |x - a|$ (the V-shaped absolute value graph) and $y = bx + c$ (a linear graph) simultaneously.
  - **Case Splitting**: Explicitly maps the two cases ($x \ge a$ and $x < a$) to the two algebraic equations representing the left and right arms of the V-shape.
  - **Extraneous Solutions (不適)**: When the algebraic intersection of the straight line and one of the "ghost" extension lines (the dotted lines continuing past the V vertex) falls outside the valid case domain, it explicitly marks it as "不適 (Extraneous)".
- **Learning Value**: Math I students frequently memorize the procedure for case-splitting but forget to check whether their final answer actually satisfies the initial condition (e.g. $x \ge 2$). By visually displaying the algebraic "ghost line" crossing the right-hand side in a region where the absolute value graph doesn't actually exist, the concept of an extraneous solution becomes an obvious physical fact rather than a forgotten checkpoint.
- **Next Step**: Polish existing levels or move to advanced 1D inequalities.


### v1.3.74: Factoring by Lowest Degree Variable (最低次数の文字について整理する因数分解) (2026-03-11)
- **Status**: **IMPLEMENTED**.
- **Action**: Added Level 12 "最低次数の文字で整理する因数分解" (Factoring by Lowest Degree Variable) to Math I Numbers and Algebraic Expressions (数と式).
- **Visualization**: `FactoringLowestDegreeViz` implementation.
  - **Interactive Step-by-Step**: Breaks down the complex factorization of polynomials with multiple variables (e.g., $x^2 + xy - x + y - 2$) into 5 logical steps.
  - **Visual Highlighting**: Explicitly highlights the lowest degree variable ($y$) and visually separates the terms containing $y$ from the rest.
  - **Guided Flow**: Shows the process of factoring out $y$, then factoring the remaining quadratic $x^2 - x - 2$, and finally pulling out the common binomial factor $(x+1)$.
- **Learning Value**: Math I students universally hit a wall with multi-variable factorization. They try to apply the quadratic formula or tasukigake blindly to the entire expression. By forcing the visual isolation of the lowest degree variable, the abstract algorithm becomes a concrete, color-coded matching game.
- **Next Step**: Continue exploring edge cases in Math I Numbers (e.g., fractional expressions) or move fully to Data Analysis.

### v1.3.73: Necessary and Sufficient Conditions Number Line (必要条件と十分条件の数直線) (2026-03-11)
- **Status**: **IMPLEMENTED**.
- **Action**: Added Level 8 "必要条件・十分条件と数直線" (Necessary and Sufficient Conditions with Number Lines) to Sets and Logic (集合と命題). Also permanently fixed the `math_i_numbers` `page.tsx` file corruption that duplicated tasukigake and swallowed the Bench Word Problem component.
- **Visualization**: `ConditionNumberLineViz` implementation.
  - **Interactive Ranges**: Students slide the parameter $a$ which controls the boundaries of Condition P ($|x - a| < 2$).
  - **Dynamic Overlap**: The component visually tracks whether the moving range P is entirely inside the fixed range Q ($0 < x < 5$) or vice versa.
  - **Real-time Truth Value**: The text explicitly links the geometric inclusion (P is completely inside Q) to the logical statement "P is a sufficient condition for Q" (P ⊂ Q).
- **Learning Value**: Math I students universally struggle with necessary/sufficient condition problems that involve inequalities. They try to algebraically solve the inequalities without realizing it's fundamentally a geometric "does this box fit inside that box?" problem. By dragging the range and watching the condition flip from "None" to "Sufficient" to "Necessary", the logical terminology maps perfectly to physical containment.
- **Next Step**: Polish Data Analysis or continue to Trigonometry.


### v1.3.72: Max/Min Number of Elements in a Set (集合の要素の最大・最小) (2026-03-11)
- **Status**: **IMPLEMENTED**.
- **Action**: Added Level 7 "集合の要素の最大・最小" (Max/Min Number of Elements in a Set) to Sets and Logic (集合と命題).
- **Visualization**: `SetMaxMinViz` implementation.
  - **Interactive Bars**: Visualizes the Universal set $U$, Set $A$, and Set $B$ as lengths.
  - **Visualizing Overlap limits**: The student can physically slide Set $B$ across the universe $U$. If they slide it entirely inside $A$, the overlap hits the theoretical maximum $\min(n(A), n(B))$. If they try to pull it as far away from $A$ as possible, the physical boundary of $U$ forces an overlap, visually proving the theoretical minimum $\max(0, n(A) + n(B) - n(U))$.
- **Learning Value**: Math I students universally fail these "max/min element" problems because they memorize the abstract formulas without seeing that it's literally just "sliding two blocks inside a box until they hit the edges." By visually preventing the blocks from leaving the universe, the minimal forced overlap calculation becomes a trivial geometric deduction.
- **Next Step**: Continue exploring Sets and Logic or expand into Data Analysis.

### v1.3.71: Linear Inequality Word Problem (1次不等式の文章題 - 長椅子) (2026-03-11)
- **Status**: **IMPLEMENTED**.
- **Action**: Added Level 11 "1次不等式の文章題 (過不足)" (Word Problem of Linear Inequality) to Math I Numbers and Algebraic Expressions (数と式).
- **Visualization**: `BenchWordProblemViz` implementation.
  - **Interactive Benches**: Students slide the number of benches.
  - **Visualizing Allocation**: Dynamically fills the benches with 5 students each, showing the leftover students or empty seats visually.
  - **Connecting to Inequalities**: Real-time evaluation of the two boundary conditions (last bench is empty, second to last has 1 to 5 students). It explicitly shows why the inequality $5(x-2) < 4x+5 \le 5(x-1)$ must hold.
- **Learning Value**: Math I students universally struggle with the "Long Bench Problem". They often blindly memorize the inequality formulation without understanding the physical reality of the "second to last bench". By visually dropping students into the seats and dynamically highlighting which conditions are met, the abstract inequality formulation becomes a concrete counting exercise.
- **Next Step**: Polish existing levels or expand further into Sets and Logic.

### v1.3.70: Geometric Meaning of 3-Term Square Expansion (3項の平方の展開公式) (2026-03-11)
- **Status**: **IMPLEMENTED**.
- **Action**: Added Level 10 "3項の平方の展開公式" (Expansion Formula of 3 Terms Squared) to Math I Numbers and Algebraic Expressions (数と式).
- **Visualization**: `ThreeTermsSquareViz` implementation.
  - **Interactive Area Model**: Students adjust the side lengths $a$, $b$, and $c$ of a large square divided into a $3 \times 3$ grid.
  - **Visualizing the Terms**: Dynamically scales the 9 resulting rectangles. The 3 squares ($a^2, b^2, c^2$) are color-coded along the diagonal.
  - **Connecting to the Formula**: The 6 remaining rectangles visually group into 3 pairs of identical rectangles ($2ab, 2bc, 2ca$), geometrically proving the algebraic expansion formula $(a+b+c)^2 = a^2+b^2+c^2+2ab+2bc+2ca$.
- **Learning Value**: Math I students frequently memorize this long expansion formula mechanically and drop terms (usually writing just $a^2+b^2+c^2$). By visualizing the literal $3 \times 3$ area grid, it becomes obvious that there are exactly 9 pieces in total, and that the cross-terms naturally form pairs.
- **Next Step**: Continue exploring core Math I topics such as 1D Inequalities or expand into Sets and Logic.


### v1.3.69: Integer and Fractional Parts of Irrational Numbers (無理数の整数部分と小数部分) (2026-03-11)
- **Status**: **IMPLEMENTED**.
- **Action**: Added Level 9 "無理数の整数部分と小数部分" (Integer and Fractional Parts of Irrational Numbers) to Math I Numbers and Algebraic Expressions (数と式).
- **Visualization**: `IntegerFractionalPartViz` implementation.
  - **Interactive Number Line**: Students adjust the value of $n$ for $\sqrt{n}$.
  - **Visualizing the Gap**: The exact position of $\sqrt{n}$ is plotted between two perfect squares.
  - **Defining the Fractional Part**: Explicitly visualizes the fractional part $b$ not as a raw decimal, but as the literal geometric "gap" between $\sqrt{n}$ and its floor integer $a$. It forces the understanding of the algebraic identity $b = \sqrt{n} - a$.
- **Learning Value**: Math I students universally stumble when asked to compute expressions like $a^2 + ab + b^2$ given the fractional part of an irrational number. They fail to understand that $b$ is simply the remainder after subtracting the integer part. By visualizing this remainder geometrically as a line segment, the formula $b = \text{original} - \text{integer}$ becomes completely intuitive.
- **Next Step**: Continue exploring edge cases in Math I Numbers (e.g., Absolute Value equations with external variables) or move to Math I Data Analysis.


### v1.3.68: Repeating Decimals to Fractions (循環小数と分数) (2026-03-11)
- **Status**: **IMPLEMENTED**.
- **Action**: Added Level 8 "循環小数と分数" (Repeating Decimals and Fractions) to Math I Numbers and Algebraic Expressions (数と式).
- **Visualization**: `RepeatingDecimalViz` implementation.
  - **Interactive Shifting**: Students adjust the repeating digits and the length of the cycle.
  - **Visualizing the Alignment**: Dynamically multiplies by 10 or 100 to explicitly align the infinite decimal parts vertically.
  - **Canceling Infinity**: Visually subtracts the two equations to show how the "infinite tail" perfectly cancels out, leaving a clean integer equation $99x = 12$.
- **Learning Value**: Math I students often mechanically memorize "put 99 in the denominator for two repeating digits". By visually stacking the aligned decimals, they intuitively understand *why* the subtraction method works to eliminate the infinite repeating part.
- **Next Step**: Continue focusing on remaining Math I Number topics or move to 1D inequalities.


### v1.3.67: Absolute Value of Square Root Visualization (平方根と絶対値) (2026-03-11)
- **Status**: **IMPLEMENTED**.
- **Action**: Added Level 7 "平方根と絶対値 (√a² = |a|)" to Math I Numbers and Algebraic Expressions (数と式).
- **Visualization**: `RootAbsoluteViz` implementation.
  - **Interactive Check**: Students slide the value of $a$ between negative and positive values.
  - **Dynamic Step-by-Step**: Explicitly shows the intermediate calculation $\sqrt{(-5)^2} = \sqrt{25} = 5$.
  - **Feedback Matching**: When $a$ drops below 0, it dynamically explains why it is mathematically invalid to just pull it out as $-5$ and justifies placing the minus sign in front to make it positive.
- **Learning Value**: Math I students universally fall for the trap of writing $\sqrt{a^2} = a$, completely ignoring that the $\sqrt{\quad}$ symbol strictly denotes the principal (non-negative) root. By manually dragging the value below zero and watching the computation explicitly enforce positivity via absolute value, the abstract rule $\sqrt{a^2} = |a|$ becomes a physically obvious necessity.
- **Next Step**: Polish existing levels or expand further into test-style generation.


### v1.3.66: Rationalization of Denominators (分母の有理化) (2026-03-11)
- **Status**: **IMPLEMENTED**.
- **Action**: Added Level 6 "分母の有理化" (Rationalizing the Denominator) to Math I Numbers and Algebraic Expressions (数と式).
- **Visualization**: `RationalizationViz` implementation.
  - **Interactive Step-by-Step**: Students choose the numerator and two square roots for the denominator using sliders.
  - **Visualizing Conjugate Multiplication**: Clearly animates multiplying both numerator and denominator by the conjugate $\sqrt{a} - \sqrt{b}$.
  - **Applying the Formula**: Explicitly shows how $(x+y)(x-y) = x^2 - y^2$ translates to $(\sqrt{a})^2 - (\sqrt{b})^2 = a - b$, removing the root entirely.
- **Learning Value**: Math I students often memorize "just flip the sign and multiply" without realizing they are explicitly using the difference of squares formula to cancel out the middle cross-terms. This breaks down the mechanical procedure into distinct, logical steps.
- **Next Step**: Continue focusing on core Math I topics such as Data Analysis or Trigonometry.

### v1.3.65: Quadratic Formula Geometric Meaning (解の公式とグラフの関係) (2026-03-11)
- **Status**: **IMPLEMENTED**.
- **Action**: Added Level 47 "解の公式の視覚化" (Visualizing the Quadratic Formula) to Quadratic Functions (二次関数).
- **Visualization**: `QuadraticFormulaViz` implementation (Canvas-based).
  - **Interactive Parabola**: Students can adjust coefficients $a, b, c$ and instantly see the parabola update.
  - **Visual Formula Breakdown**: Dynamically displays the quadratic formula $x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}$ and visually decomposes it.
  - **Geometric Mapping**: Explicitly draws the axis of symmetry ($x = -b/2a$) and visually marks the distance from the axis to the two roots ($d = \sqrt{D}/|2a|$).
  - **Discriminant Feedback**: When $D < 0$, the roots vanish visually, and the distance calculation explicitly notes "No real roots".
- **Learning Value**: Math I students blindly memorize the quadratic formula and view it purely algebraically. They often fail to connect the $\pm$ sign to the geometric reality of "left and right distance from the center axis". By visually pulling the formula apart and anchoring it to the physical graph, students realize that the quadratic formula is just $x = \text{Axis} \pm \text{Distance}$.
- **Next Step**: Continue focusing on core Math I topics such as Data Analysis (データの分析) or expand into Trigonometry (図形と計量).


### v1.3.64: Symmetric Polynomials Value Visualization (対称式の値) (2026-03-11)
- **Status**: **IMPLEMENTED**.
- **Action**: Added Level 5 "対称式の値 (基本定理)" (Symmetric Polynomials) to Math I Numbers and Algebraic Expressions (数と式).
- **Visualization**: `SymmetricPolynomialsViz` implementation.
  - **Area Model**: Students can dynamically adjust the values of $x$ and $y$ using sliders.
  - **Visual Proof**: Shows the target expression $x^2 + y^2$ physically embedded as two smaller squares within a larger square of size $(x+y)^2$.
  - **Interactive Subtraction**: Students click a button to "pull away" the two $xy$ rectangles from the larger $(x+y)^2$ square, revealing the geometric proof of $x^2 + y^2 = (x+y)^2 - 2xy$.
- **Learning Value**: Math I students memorize $x^2 + y^2 = (x+y)^2 - 2xy$ algebraically, which leads to confusion with $x^3+y^3$ or dropping the minus sign. Visualizing the areas makes it undeniable that the whole $(x+y)^2$ box contains extra rectangles that must be removed.
- **Next Step**: Continue expanding Math I topics or refine Data Analysis.


### v1.3.63: Tasukigake (Cross Multiplication Method) Visualization (2026-03-10)
- **Status**: **IMPLEMENTED**.
- **Action**: Added Level 4 "たすき掛け (因数分解)" (Tasukigake / Cross Multiplication Method) to Math I Numbers and Algebraic Expressions (数と式).
- **Visualization**: `TasukigakeViz` implementation.
  - **Interactive Cross Grid**: Students dynamically adjust the factors $p, q, r, s$ using sliders.
  - **Visual Linkage**: Instantly shows the cross multiplication ($ps$ and $qr$) and sums them up to match the $b$ coefficient in $ax^2 + bx + c$.
  - **Color-Coded Feedback**: Emphasizes the $a, b, c$ components in distinct colors, explicitly matching the expanded terms.
- **Learning Value**: Math I students rely heavily on "たすき掛け" for factorization, but it often becomes a blind arithmetic puzzle. By physically adjusting the factors and watching the cross-products shift, the algebra becomes an obvious geometric matching game.
- **Next Step**: Polish Math I Numbers and Algebraic Expressions (数と式) further, or move on to Linear Inequalities.

### v1.3.62: Absolute Value Equations and Inequalities (絶対値を含む方程式・不等式) (2026-03-11)
- **Status**: **IMPLEMENTED**.
- **Action**: Added Level 2 "絶対値を含む方程式・不等式" to Math I Numbers and Algebraic Expressions (数と式).
- **Visualization**: `AbsoluteValueViz` implementation.
  - **Focus on Distance**: Students interactively adjust the center point $a$ and distance $c$.
  - **Dynamic Highlights**: Toggle between $=, <, >$ visually highlights the valid range on a number line, mapping algebraically abstract inequalities directly to geometric distance.
- **Learning Value**: Math I students frequently confuse $|x-a| < c$ (inside range) and $|x-a| > c$ (outside range). By showing the distance graphically, they intuitively understand why the solutions split into two inequalities or form a single continuous interval.
- **Next Step**: Continue expanding Math I topics or refine test-generation logic.


### v1.3.61: Double Radicals Visualization (二重根号の視覚化) (2026-03-11)
- **Status**: **IMPLEMENTED**.
- **Action**: Created `math_i_numbers` module (数と式) and added Level 1 "二重根号を外す" (Removing Double Radicals).
- **Visualization**: `DoubleRadicalViz` implementation.
  - **Focus on Expansion**: Students visually expand $(\sqrt{a} + \sqrt{b})^2$ as areas of a square.
  - **Connecting to Radicals**: By mapping the $(a+b)$ to the integer part and $2\sqrt{ab}$ to the radical part, taking the outer square root becomes an obvious geometric length calculation.
- **Learning Value**: Math I students memorize $\sqrt{(a+b) + 2\sqrt{ab}}$ without seeing it as reversing a perfect square expansion. Visualizing the areas makes it concrete.
- **Next Step**: Polish Math I Numbers and Algebraic Expressions (数と式).

### v1.3.60: Condition for Both Roots in a Specific Interval (2解が特定の区間にある条件) (2026-03-11)
- **Status**: **IMPLEMENTED**.
- **Action**: Added Level 46 "2つの解が特定の区間にある条件" (Both roots inside a specific interval) to Quadratic Functions (二次関数). Also fixed missing UI binding for Level 45 "Domain Always Positive" (特定の区間で常に正・負となる条件).
- **Visualization**: `BothRootsBetweenViz` implementation (Canvas-based).
  - **Interactive Graphic**: Visualizes $f(x) = x^2 - 2ax + a + 2$ defined strictly with roots inside the interval $0 < x < 3$.
  - **Dynamic Checks**: Visualizes the 3 critical conditions for "Roots Location" (解の配置) problems: Discriminant ($D ge 0$), Axis Location ($0 < a < 3$), and Boundary Values ($f(0) > 0, f(3) > 0$).
  - **Learning Value**: Math I students universally struggle with "Location of Roots" (解の配置) problems. This is arguably the most complex standard problem in Quadratics. By interactively moving the parabola and explicitly watching the three physical conditions light up green when satisfied, the abstract case-splitting turns into obvious visual geometry.
- **Next Step**: The Quadratic Functions (二次関数) module is complete up to Level 46. Move to Math I Numbers and Algebraic Expressions (数と式) or finalize edge cases in Probability.

### v1.3.57: Domain-Specific Always Positive/Negative Condition (特定の区間で常に正・負となる条件) (2026-03-11)
- **Status**: **IMPLEMENTED**.
- **Action**: Added Level 45 "特定の区間で常に正・負となる条件" (Conditions for Always Positive/Negative in a Specific Domain) to Quadratic Functions (二次関数). Also successfully bound Level 44 "一方だけが実数解をもつ条件" into the page.tsx UI.
- **Visualization**: `DomainAlwaysPositiveViz` implementation (Canvas-based).
  - **Interactive Graphic**: Visualizes $f(x) = x^2 - 2ax + a + 2$ defined strictly on the interval $[0, 2]$.
  - **Dynamic Case Logic**: As students slide the parameter $a$, the vertex moves. The visualization automatically identifies whether the vertex is to the left of 0, inside the interval, or to the right of 2, and displays the literal value of the minimum on the interval.
  - **Condition Validation**: Highlights the region above the x-axis in green and explicitly checks if the minimum value stays strictly above 0.
- **Learning Value**: Math I students universally struggle with "Absolute Inequalities on a Restricted Domain". They memorize $D < 0$ for "always positive" but forget that on a restricted domain, the graph can dip below the x-axis *outside* the domain and still be perfectly valid. By sliding the parabola and explicitly tracking the lowest point *inside the blue box*, the case-splitting (場合分け) logic becomes an undeniable physical boundary check.
- **Next Step**: The Quadratic Functions (二次関数) module is now essentially complete as a comprehensive visual encyclopedia of all exam patterns. Next cycle should aggressively shift focus to Math I "Numbers and Algebraic Expressions" (数と式) or "Data Analysis" (データの分析).


### v1.3.56: One Real Root Condition Visualization (一方だけが実数解をもつ条件) (2026-03-11)
- **Status**: **IMPLEMENTED**.
- **Action**: Added Level 44 "一方だけが実数解をもつ条件" (Condition for Exactly One Real Root) to Quadratic Functions (二次関数).
- **Visualization**: `OneRealRootConditionViz` implementation (Canvas-based).
  - **Focus on Discriminants**: Students adjust the parameter $p$ and visually see how the two equations $x^2 + px + 1 = 0$ and $x^2 + x + p = 0$ independently change.
  - **Visualizing Roots**: The canvas clearly shows when one parabola crosses the x-axis while the other "floats" above it.
  - **Dynamic Checks**: Calculates and displays the signs of both discriminants $D_1$ and $D_2$ in real-time.
- **Learning Value**: "Exactly one equation has real roots" problems notoriously trip up Math I students because the logical condition $(D_1 \ge 0 \text{ AND } D_2 < 0) \text{ OR } (D_1 < 0 \text{ AND } D_2 \ge 0)$ is long and prone to careless interval calculation errors. Seeing the two parabolas simultaneously forces the student to connect the algebraic interval of $p$ to the physical reality of the graphs intersecting the axis.
- **Next Step**: Polish existing Quadratics levels and move fully into Math I Numbers and Algebraic Expressions (数と式) or Data Analysis refinement.


### v1.3.55: Profit Maximization Word Problem (利益の最大化の応用) (2026-03-11)
- **Status**: **IMPLEMENTED**.
- **Action**: Added Level 43 "利益の最大化 (文章題)" (Profit Maximization) to Quadratic Functions (二次関数).
- **Visualization**: `ProfitMaximizationViz` implementation.
  - **Focus on Word Problem**: Students dynamically adjust the number of price increases (x) using a slider.
  - **Real-time Equations**: Visually displays the dynamically calculated Price ($100 + 10x$), Sales ($1000 - 50x$), and Total Profit.
  - **Parabolic Insight**: Displays the profit parabola on a canvas, matching the student's current position to the vertex (maximum profit).
- **Learning Value**: Math I students often struggle with word problems because translating text into equations ($y = (100+10x)(1000-50x)$) is abstract. By interactively linking the price slider to the visual geometry of a parabola and seeing the profit literally peak, it grounds the algebraic model in a concrete real-world scenario.
- **Next Step**: Continue expanding Math I topics or refine word problem variations.

### v1.3.54: Roots with Different Signs Visualization (異符号の解) (2026-03-11)
- **Status**: **IMPLEMENTED**.
- **Action**: Added Level 42 "異符号の解" (Roots with Different Signs) to Quadratic Functions (二次関数). Fixed missing switch case issues for Level 41.
- **Visualization**: `DifferentSignsViz` implementation.
  - **Focus on y-intercept**: Students adjust parameter $m$ and see that as long as $f(0) < 0$, the parabola naturally opens upwards and crosses the x-axis on both positive and negative sides.
  - **Redundant Conditions**: Visually demonstrates why checking the discriminant ($D>0$) or the axis is unnecessary when $f(0) < 0$ and $a > 0$.
- **Learning Value**: Math I students often over-complicate "different signs" problems by calculating $D>0$, sum of roots, and product of roots. By visually proving that pulling the y-intercept below 0 forces the parabola to cross the x-axis twice with different signs, the required calculation simplifies to just one condition.
- **Next Step**: Continue expanding Math I topics (Trigonometry or Numbers & Algebraic Expressions).

### v1.3.54: Translation of Parabola Determination (放物線の平行移動の決定) (2026-03-11)
- **Status**: **IMPLEMENTED**.
- **Action**: Added Level 41 "放物線の平行移動の決定" (Determining Parabola Translation) to Quadratic Functions (二次関数).
- **Visualization**: `TranslationDeterminationViz` implementation.
  - **Interactive Graphic**: Visualizes a moving parabola and a target parabola on a grid.
  - **Parameter Tuning**: Students can adjust the x-translation ($p$) and y-translation ($q$) using sliders.
  - **Visual Match**: The moving parabola turns green when it perfectly overlaps the target, proving the vertex translation $p = -3, q = -3$.
- **Learning Value**: Math I students often confuse the signs when translating graphs or trying to find the translation vector between two equations. By explicitly sliding the graph to match, it trains them to always compare the vertices visually before calculating.
- **Next Step**: Continue exploring core Math I topics such as Trigonometry (図形と計量) or Numbers and Algebraic Expressions.


### v1.3.54: Cyclic Quadrilateral Visualization (円に内接する四角形) (2026-03-11)
- **Status**: **IMPLEMENTED**.
- **Action**: Added Level 13 "円に内接する四角形" (Cyclic Quadrilateral) to Math I Trigonometry (図形と計量), pushing the Quiz to Level 14.
- **Visualization**: `CyclicQuadrilateralViz` implementation.
  - **Interactive Circle**: Students can drag 4 points (A, B, C, D) around a circle.
  - **Real-time Geometric Check**: Dynamically calculates and displays the interior angles B and D, explicitly showing that their sum is exactly 180° regardless of point positions.
  - **Visualizing Cosine Rule Application**: Derives the diagonal length AC by simultaneously applying the Cosine Rule from △ABC and △ADC. It explicitly shows how $\cos D = -\cos B$, linking the abstract formula substitution to the visual geometry of the shared diagonal.
- **Learning Value**: Math I students universally struggle with "Cyclic Quadrilaterals" because it requires applying the Cosine Rule twice and solving a simultaneous equation using the $\cos(180^\circ - \theta) = -\cos\theta$ property. By dragging the points and watching the numbers balance out perfectly, it demystifies the algebraic trick and solidifies the geometric intuition.
- **Next Step**: Continue to explore high-impact Math I exam topics, such as Number Theory or further Data Analysis.

### v1.3.52: At Least One Positive Root Visualization (少なくとも1つの正の解) (2026-03-11)
- **Status**: **IMPLEMENTED**.
- **Action**: Added Level 40 "少なくとも1つの正の解をもつ条件" (At least one positive root condition) to Quadratic Functions (二次関数).
- **Visualization**: `AtLeastOnePositiveRootViz` implementation (Interactive parameter slider).
  - **Dynamic Equations**: Students adjust parameter $m$ for the equation $x^2 - 2mx + m + 2 = 0$.
  - **Visual Case Splitting**: The UI visually categorizes the scenario into "Two positive roots" vs "One positive and one non-positive root". 
  - **Condition Checking**: Real-time validation checks for $D/4 \ge 0$, Axis $> 0$, and $f(0)$ conditions, turning green when the requirements are met. The positive x-axis is vividly highlighted when the condition is successfully cleared.
- **Learning Value**: Math I students universally struggle with "解の配置" (Location of roots) problems that require multiple case splits (場合分け). "At least one positive root" is a classic exam trap where students forget the case where one root is positive and the other is negative or zero. By interactively dragging the parabola across the axes and watching the conditions light up, this complex algebraic case-splitting becomes an obvious geometric observation.
- **Next Step**: Polish Data Analysis or continue to Trigonometry.

### v1.3.51: Two Variable Max/Min (Independent Variables) Visualization (2026-03-11)
- **Status**: **IMPLEMENTED**.
- **Action**: Added Level 39 "2変数関数の最大・最小 (独立変数)" (Max/Min of Two Independent Variables) to Quadratic Functions (二次関数).
- **Visualization**: `IndependentVariablesViz` implementation (Dual-slider 1D variables).
  - **Interactive Independence**: Students can adjust the value of $x$ and $y$ completely independently using two separate sliders.
  - **Visualizing the Sum**: Shows how the total value $z$ is simply the sum of the two independent parabolas ($f(x) + g(y)$).
  - **Geometric Proof**: By seeing the independent "displacements" visually, students intuitively grasp why $z$ hits its minimum *only* when $x$ and $y$ simultaneously hit their respective vertex minimums.
- **Learning Value**: Math I students are often confused by "2変数関数" (functions of two variables). They try to substitute one variable for the other, even when there is no constraint equation (like $x+y=4$). This visualization physically enforces the idea that "no constraint = completely independent movement", making the strategy of "completing the square twice" an obvious visual necessity rather than a memorized trick.
- **Next Step**: Continue focusing on core Math I topics such as Data Analysis or Trigonometry.


### v1.3.50: Space Geometry Surveying Fix & Heron's Formula (2026-03-10)
- **Status**: **IMPLEMENTED**.
- **Action**: Restored the rendering logic for Level 11 "空間図形・測量" (Surveying) which was accidentally hidden, and added Level 12 "ヘロンの公式" (Heron's Formula) to Math I Trigonometry (図形と計量). Bumped Quiz to Level 13.
- **Visualization**: `HeronsFormulaViz` implementation.
  - **Interactive Triangle**: Students can dynamically adjust all three sides (`a, b, c`) using sliders.
  - **Real-time Geometric Check**: Visually enforces the triangle inequality (`a+b>c`, etc.) and displays a "Triangle not possible" error when violated.
  - **Visual Calculation**: Explicitly shows the "half-perimeter" `s` and directly links it to the calculation steps of the formula `S = √[s(s-a)(s-b)(s-c)]`.
- **Learning Value**: Math I students often memorize Heron's formula but fail to recognize when it is invalid (e.g. side lengths that don't close a triangle). By visually reconstructing the triangle from the 3 sides dynamically, it forces the understanding that the formula only works when the geometry actually exists.
- **Next Step**: Polish Data Analysis or continue expanding core Math I and Math A topics.

### v1.3.49: Moving Right Edge Domain Visualization (定義域の右端が動く最大・最小) (2026-03-10)
- **Status**: **IMPLEMENTED**.
- **Action**: Added Level 38 "定義域の右端が動く最大・最小" (Moving Right Edge Domain Max/Min) to Quadratic Functions (二次関数).
- **Visualization**: `MovingRightEdgeViz` component.
  - **Interactive Domain**: The domain is $[0, a]$, and students drag a slider to stretch the domain by moving the right edge $a$.
  - **Min/Max Modes**: Toggles explicitly between finding the Minimum and finding the Maximum.
  - **Dynamic Case Logic**:
    - For Minimum: Visualizes the 2 cases (Is $a$ left or right of the axis $x=2$?).
    - For Maximum: Visually introduces the critical "Center of Domain" concept ($x = a/2$). Draws the center line and dynamically explains the 3 cases depending on whether the center is left, equal, or right of the axis.
- **Learning Value**: Math I students hit a massive wall with "moving domain" max/min problems because they struggle to visualize *why* the maximum flips when the domain stretches past a certain point. By dynamically displaying the "center of the domain" line and watching it cross the axis, the student builds a physical, geometric intuition for the 3-case split, transforming abstract algebra into obvious visual facts.
- **Next Step**: Polish existing Quadratics levels and move fully into Math I Numbers and Algebraic Expressions (数と式) or Data Analysis refinement.


### v1.3.45: Independent Trials Probability Visualization (2026-03-10)
- **Status**: **IMPLEMENTED**.
- **Action**: Added Level 4 "反復試行の確率" (Independent Trials Probability) to Probability (場合の数と確率). Note: A previous uncommitted broken build for Heron's Formula was reverted to stabilize the main branch.
- **Visualization**: `IndependentTrialsViz` implementation (Canvas-based Grid).
  - **Interactive Simulation**: Students can adjust the total number of trials $n$, the target number of successes $r$, and the probability of success $p$.
  - **Grid Navigation**: Visualizes the $2^n$ possible paths as a geometric grid where the x-axis represents successes and the y-axis represents failures.
  - **Path Highlighting**: Explicitly highlights the node $(r, n-r)$ and displays the combinatorial count $_nC_r$ alongside the probability formula $_nC_r \times p^r \times (1-p)^{n-r}$.
- **Learning Value**: Math A students frequently memorize the formula blindly without understanding the combinatorial $_nC_r$ component. By physically mapping the sequence of successes and failures onto a grid, the formula's origin (number of paths $\times$ probability of one path) becomes a self-evident geometric property.
- **Next Step**: Polish Data Analysis or restore Trigonometry's Heron Formula with proper types.

### v1.3.44: Space Geometry and Surveying Visualization (2026-03-10)
- **Status**: **IMPLEMENTED**.
- **Action**: Added Level 11 "空間図形・測量" (Space Geometry and Surveying) to Math I Trigonometry (図形と計量), bumping Quiz to Level 12.
- **Visualization**: `SurveyingViz` implementation (Canvas-based).
  - **Interactive Graphic**: Visualizes a classic surveying problem where the height of a tower $h$ is found using two observation points A and B on the same straight line.
  - **Dynamic Parameters**: Students can adjust the distance $d$ between points A and B, and the angles of elevation $\alpha$ and $\beta$.
  - **Real-time Geometric Calculation**: Graphically traces the lines of sight from both observers to the tower's top and explicitly displays the derived height formula dynamically $h / \tan \alpha - h / \tan \beta = d$.
- **Learning Value**: Surveying problems often overwhelm Math I students because extracting a 2D triangle from a 3D real-world scenario (or deriving the formula algebraically by eliminating the distance $x$) is unintuitive. By letting the student stretch the distance between observers and dynamically changing the elevation angles, the formula's reliance on the difference in tangents becomes a tangible, visual experience rather than a memorized equation.
- **Next Step**: Polish Trigonometry further (e.g., Heron's Formula) or revisit Quadratics for edge-case test questions.


### v1.3.43: Angle Bisector and Area Visualization (2026-03-10)
- **Status**: **IMPLEMENTED**.
- **Action**: Added Level 10 "角の二等分線" (Angle Bisector) to Math I Trigonometry (図形と計量), bumping Quiz to Level 11.
- **Visualization**: `AngleBisectorViz` implementation (Canvas-based).
  - **Interactive Triangle**: Students can adjust the lengths of side $b$ (AC) and side $c$ (AB), as well as the included angle $A$.
  - **Visualizing the Bisector**: Dynamically draws the angle bisector AD, splitting the triangle into two smaller triangles (ABD and ACD).
  - **Connecting to Area**: Explicitly connects the length of the bisector $x$ to the area conservation formula $\triangle ABC = \triangle ABD + \triangle ACD$.
- **Learning Value**: Finding the length of an angle bisector using the area ratio is a classic high-frequency problem in Math I. Without a visual, students blindly memorize the formula $x = \frac{2bc \cos(A/2)}{b+c}$. By interactively changing the sides and angle, students physically see how the overall area splits exactly into the two sub-triangles sharing the height $x$, grounding the algebraic manipulation in geometric reality.
- **Next Step**: Continue focusing on core Math I topics such as Data Analysis or expand further into Sets and Logic.


### v1.3.42: Trigonometric Equations and Inequalities Visualization (2026-03-10)
- **Status**: **IMPLEMENTED**.
- **Action**: Added Level 9 "三角方程式・不等式" (Trigonometric Equations and Inequalities) to Math I Trigonometry (図形と計量), bumping the Quiz to Level 10.
- **Visualization**: `TrigEqIneqViz` implementation (Canvas-based Unit Circle).
  - **Interactive Toggles**: Students can toggle between $\sin\theta$ (y-axis) and $\cos\theta$ (x-axis), and choose between equation ($=$) or inequalities ($\ge, \le$).
  - **Dynamic Thresholding**: A slider controls the constant $k$ (from -1 to 1). The target line ($y=k$ or $x=k$) moves dynamically across the unit circle.
  - **Visual Arc Highlighting**: Vividly highlights the continuous valid angle range (purple arc) along the upper half of the unit circle ($0^\circ \le \theta \le 180^\circ$).
- **Learning Value**: Solving trigonometric equations and inequalities is a massive hurdle in Math I exams because students get lost between substituting algebraic values and remembering the angular domain. By physically dragging the boundary line and watching the valid arc stretch, shrink, or split, the algebraic inequality $\sin\theta \ge \frac{1}{2}$ becomes an undeniable geometric fact ("the part of the circle above the line").
- **Next Step**: Polish Trigonometry further (e.g., Space Geometry) or expand into advanced Sets and Logic (集合と命題).

### v1.3.41: Moving Axis Max/Min Visualization (軸が動く最大・最小) (2026-03-10)
- **Status**: **IMPLEMENTED**.
- **Action**: Created `MovingAxisViz` component in Quadratics (二次関数) for the classic "Fixed Domain, Moving Axis" problem.
- **Visualization**: `MovingAxisViz` implementation (Canvas-based).
  - **Interactive Graphic**: Visualizes $y = (x - a)^2 - 1$ passing through a fixed domain $0 \le x \le 2$.
  - **Parameter Tuning**: Students slide the axis parameter $a$.
  - **Real-time Case Splitting**: The UI dynamically updates the text and highlights to track the Minimum (3 cases) and Maximum (3 cases) relative to the domain center ($x=1$).
- **Learning Value**: This is arguably the most notorious "wall" in Math I Quadratics. Students struggle to simultaneously visualize the parabola moving and the boundaries standing still. By sliding $a$ interactively, the case-splits ("Is the axis left of 0?", "Is it right of 1?") become blindingly obvious geometric facts rather than memorized algebra.


### v1.3.40: Symmetry and Formulas (90° - θ) Visualization (2026-03-10)
- **Status**: **IMPLEMENTED**.
- **Action**: Upgraded Level 8 "対称性と公式 (180° - θ)" in Math I Trigonometry (図形と計量) to include "90° - θ" (Complementary Angles).
- **Visualization**: Enhanced `TrigPage` Level 8 implementation.
  - **Interactive Toggle**: Added a clean toggle to switch between "180° - θ" (Supplementary) and "90° - θ" (Complementary).
  - **Visual Proof**: For "90° - θ", draws the $y = x$ reflection line and dynamically mirrors the angle to prove that $x$ and $y$ coordinates swap.
  - **Real-time Formulas**: Automatically updates the overlay to show $\sin(90^\circ-\theta) = \cos\theta$ and $\cos(90^\circ-\theta) = \sin\theta$.
- **Learning Value**: Math I students frequently confuse the signs and the flipping of sine/cosine in the "90° - θ" formulas. By visualizing the literal $y = x$ reflection, it replaces memorization with geometric certainty ("the triangle just flips on its side").


### v1.3.39: Difference Function Visualization (2つのグラフの差の関数) (2026-03-10)
- **Status**: **IMPLEMENTED**.
- **Action**: Added Level 37 "2つのグラフの差の関数" (Difference Function of Two Graphs) to Quadratics.
- **Visualization**: `DifferenceFunctionViz` implementation (Canvas-based dual graphs).
  - **Interactive Dual Graphs**: Visualizes $f(x)$ (Parabola) and $g(x)$ (Line) on the top canvas, and their difference function $h(x) = f(x) - g(x)$ on the bottom canvas simultaneously.
  - **Real-time Linkage**: As students slide the parameters $a$ (parabola width), $m$ (line slope), and $k$ (line intercept), the intersections of $f(x)$ and $g(x)$ dynamically track exactly to the x-intercepts of $h(x)$.
  - **Visualizing the Intersection**: Draws vertical dashed tracking lines that explicitly connect the top intersections to the bottom roots, proving geometrically that $f(x) = g(x) \iff f(x) - g(x) = 0$.
- **Learning Value**: "Difference functions" are the conceptual backbone for solving quadratic inequalities, intersection problems, and ultimately Math II integration. Students often manipulate $f(x) - g(x)$ purely algebraically without realizing they are creating a new "flat" world where the intersection line becomes the new x-axis. By splitting the screen and showing both worlds reacting perfectly in sync, this abstract algebraic trick becomes an undeniable geometric reality.
- **Next Step**: Polish existing data analysis levels or focus strictly on Math I Trigonometry.


### v1.3.38: Probability & Permutations Visualization (場合の数と確率) (2026-03-10)
- **Status**: **IMPLEMENTED**.
- **Action**: Completely rewrote the `probability` module to focus on Math A standard topics, removing all previous "Sci-Fi/Monty Hall" concepts. Added Level 1 "順列" (Permutations), Level 2 "組合せ" (Combinations), and Level 3 "条件付き確率" (Conditional Probability).
- **Visualization**: `ProbabilityViz` implementation.
  - **Interactive Selection**: For Permutations and Combinations, students use a slider to choose $r$ from $n$ items.
  - **Visual Distinction**: Permutations show distinct slotted boxes (order matters), while Combinations show a dashed grouping box (order doesn't matter).
  - **Venn Diagram Overlay**: For Conditional Probability, a dynamic Venn Diagram visualizes $P(A|B)$ by explicitly focusing on the intersection relative to the restricted "B" universe.
- **Learning Value**: Math A students often confuse $_nP_r$ and $_nC_r$. By visually distinguishing "Slots" vs "Groups", the intuition behind dividing by $r!$ becomes clear. The Conditional Probability visualizer enforces the idea that the denominator changes from "Universe" to "Event B".
- **Next Step**: Continue focusing on core Math A/I topics or refine existing Trigonometry levels.


### v1.3.37: Quadratic Inequalities and Sets Visualization (2026-03-10)
- **Status**: **IMPLEMENTED**.
- **Action**: Added Level 6 "連立不等式と集合" (Quadratic Inequalities and Sets) to Sets and Logic (集合と命題).
- **Visualization**: `QuadraticSetsViz` implementation.
  - **Interactive 1D Number Line**: Students can adjust the bounds for Set A (closed interval, ≤, ≥) and Set B (open interval, <, >).
  - **Toggle Inside/Outside**: Set B can easily be toggled between an "inside" range ($b_1 < x < b_2$) and an "outside" range ($x < b_1, b_2 < x$), which directly maps to the two forms of quadratic inequality solutions ($D>0, a>0$).
  - **Real-time Intersection**: The common region ($A \cap B$) is vividly highlighted in purple.
- **Learning Value**: Math I students often struggle with finding the integer solutions of simultaneous quadratic inequalities because they draw the number lines incorrectly. This visualizer forces them to physically drag the boundaries and visually see the overlapping region, reinforcing the difference between open (white dots) and closed (filled dots) intervals.
- **Next Step**: Continue focusing on core Math I topics such as Data Analysis or expand further into Trigonometry (図形と計量).


### v1.3.36: Proof by Contradiction Visualization (背理法の証明) (2026-03-10)
- **Status**: **IMPLEMENTED**.
- **Action**: Added Level 5 "背理法の証明" (Proof by Contradiction) to Sets and Logic (集合と命題). Also permanently fixed the missing \`SetElementsViz\` from a prior cron failure.
- **Visualization**: \`ContradictionViz\` implementation.
  - **Step-by-Step Logic Flow**: Students advance through the 6 classic steps of proving that $\sqrt{2}$ is irrational.
  - **Visual Emphasis**: Explicitly highlights the logical contradiction (p and q both being even) against the initial assumption (p and q being coprime).
  - **Color-Coded Feedback**: Uses red for the initial risky assumption and the final explosive contradiction, guiding the student emotionally through the logical trap.
- **Learning Value**: Math I students often memorize the $\sqrt{2}$ proof without understanding *why* they are squaring or assuming coprime fractions. Breaking it into a "next step" interactive narrative turns a wall of text into a logical story where the student springs the trap on the false assumption.
- **Next Step**: Continue refining existing modules or introduce advanced Math II concepts.

### v1.3.35: Set Elements Visualization (集合の要素の個数) (2026-03-10)
- **Status**: **IMPLEMENTED**.
- **Action**: Added Level 4 "集合の要素の個数" (Number of Elements in a Set) to Sets and Logic (集合と命題).
- **Visualization**: `SetElementsViz` implementation.
  - **Interactive Venn Diagram**: Students can adjust the number of elements in Set A, Set B, the Intersection, and the Universal Set using sliders.
  - **Visualizing the Formula**: Dynamically calculates and displays $n(A \cup B) = n(A) + n(B) - n(A \cap B)$.
  - **Preventing Double Counting**: The intersection area is explicitly shown and linked to why we subtract it once (because it's counted twice when adding A and B).
- **Learning Value**: Math I students often memorize the formula blindly and fail word problems when asking for "neither A nor B" or "only A". By visually attaching the numbers to physical areas on the Venn diagram, the formula becomes a trivial geometric area calculation.
- **Next Step**: Expand into Math I Trigonometry (図形と計量) or solidify Sets and Logic further.


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

### v1.3.46: Probability of Maximum Value (最大値の確率) (2026-03-10)
- **Status**: **IMPLEMENTED**.
- **Action**: Added Level 5 "最大値の確率" (Probability of Maximum/Minimum) to Probability (場合の数と確率). Also fixed missing explanations for Level 4 Independent Trials.
- **Visualization**: `MaxMinProbabilityViz` implementation (2D Grid for $n=2$ dice).
  - **Interactive Selection**: Students slide the target maximum value $k$ from 1 to 6.
  - **Grid Area Mapping**: The $6 \\times 6$ outcome space is visualized. It clearly highlights the "L-shaped" boundary of outcomes where the maximum die roll is exactly $k$.
  - **Visual Subtraction**: By showing the larger $k \\times k$ square (where max $\\le k$) and a grayed-out smaller $(k-1) \\times (k-1)$ square (where max $\\le k-1$), the L-shaped difference physically demonstrates the $k^2 - (k-1)^2$ formula.
- **Learning Value**: Math A students classically struggle with the "max/min probability" questions, often getting lost trying to enumerate cases (e.g. "one is 4, the other is 1,2,3, or both are 4"). By transforming the probability calculation into a literal area calculation of an L-shaped boundary on a grid, it turns algebraic case-splitting into obvious geometry.
- **Next Step**: Polish existing probability modules or begin work on Math I "Numbers and Algebraic Expressions" (数と式).

### v1.3.48: Moving Domain Maximum/Minimum Redesign (2026-03-10)
- **Status**: **IMPLEMENTED**.
- **Action**: Completely redesigned Level 3 "定義域が動く最大・最小" (Moving Domain Max/Min) in Quadratic Functions (二次関数).
- **Visualization**: `MovingDomainViz` update.
  - **Min/Max Toggle**: Added a toggle to switch between analyzing Minimum (最小値) and Maximum (最大値).
  - **Midpoint Visualization**: For Maximum, added a visual indicator for "定義域の中央" (Center of the Domain).
  - **Dynamic Case Logic**: Shows explicit real-time text explaining the 3-case split depending on whether the Axis is left/right of the Domain Center (for Max) or left/inside/right of the Domain (for Min).
- **Learning Value**: Math I students universally struggle with "Case Splitting" (場合分け) when the domain moves. Minimum is relatively intuitive, but Maximum requires comparing the axis to the *center* of the domain. By dynamically drawing the center line and highlighting the "farther edge" as the maximum point, it turns an abstract algebraic distance comparison into an immediate visual rule.
- **Next Step**: Continue aligning existing Quadratic Functions visualizations (like Coefficient Signs) with concrete problem generators for test-style exercises.

### v1.3.53: Different Signs Roots Visualization (異符号の解) (2026-03-11)
- **Status**: **IMPLEMENTED**.
- **Action**: Added Level 41 "異符号の解" (Roots with Different Signs) to Quadratic Functions (二次関数).
- **Visualization**: `DifferentSignsViz` implementation.
  - **Focus on y-intercept**: Students adjust parameter $m$ and see that as long as $f(0) < 0$, the parabola naturally opens upwards and crosses the x-axis on both positive and negative sides.
  - **Redundant Conditions**: Visually demonstrates why checking the discriminant ($D>0$) or the axis is unnecessary when $f(0) < 0$ and $a > 0$.
- **Learning Value**: Math I students often over-complicate "different signs" problems by calculating $D>0$, sum of roots, and product of roots. By visually proving that pulling the y-intercept below 0 forces the parabola to cross the x-axis twice with different signs, the required calculation simplifies to just one condition.
- **Next Step**: Continue expanding Math I topics (Trigonometry or Numbers & Algebraic Expressions).
- **Action**: Added Level 41 "異符号の解" (Roots with Different Signs) to Quadratic Functions (二次関数).

### v1.3.58: Fractional Completing the Square (分数の平方完成の視覚化) (2026-03-11)
- **Status**: **IMPLEMENTED**.
- **Action**: Added Level 46 "分数の平方完成" (Fractional Completing the Square) to Quadratic Functions (二次関数).
- **Visualization**: Enhanced `CompletingSquareViz` to support fractional coefficients (e.g. $a = 1/2, b = -3$).
  - **Focus on fractions**: Students often make mistakes factoring out fractions. Visualizes the exact division step intuitively.
- **Learning Value**: Math I students universally struggle with completing the square when fractions are involved. By interactively seeing the fraction pulled out of the linear term, calculation errors drop.
- **Next Step**: Polish existing Quadratics levels and move fully into Math I Numbers and Algebraic Expressions (数と式).


### v1.3.59: Double Radicals Visualization (二重根号の視覚化) (2026-03-11)
- **Status**: **IMPLEMENTED**.
- **Action**: Added Level 1 "二重根号を外す" (Removing Double Radicals) to Math I Numbers and Algebraic Expressions (数と式).
- **Visualization**: `DoubleRadicalViz` implementation.
  - **Focus on Expansion**: Students visually expand $(\sqrt{a} + \sqrt{b})^2$ as areas of a square.
  - **Connecting to Radicals**: By mapping the $(a+b)$ to the integer part and $2\sqrt{ab}$ to the radical part, taking the outer square root becomes an obvious geometric length calculation.
- **Learning Value**: Math I students memorize $\sqrt{(a+b) + 2\sqrt{ab}}$ without seeing it as reversing a perfect square expansion. Visualizing the areas makes it concrete.
- **Next Step**: Polish Math I Numbers and Algebraic Expressions (数と式).

### v1.3.68: Repeating Decimals to Fractions (循環小数と分数) (2026-03-11)
- **Status**: **IMPLEMENTED**.
- **Action**: Added Level 8 "循環小数と分数" (Repeating Decimals and Fractions) to Math I Numbers and Algebraic Expressions (数と式).
- **Visualization**: `RepeatingDecimalViz` implementation.
  - **Interactive Shifting**: Students adjust the repeating digits and the length of the cycle.
  - **Visualizing the Alignment**: Dynamically multiplies by 10 or 100 to explicitly align the infinite decimal parts vertically.
  - **Canceling Infinity**: Visually subtracts the two equations to show how the "infinite tail" perfectly cancels out, leaving a clean integer equation $99x = 12$.
- **Learning Value**: Math I students often mechanically memorize "put 99 in the denominator for two repeating digits". By visually stacking the aligned decimals, they intuitively understand *why* the subtraction method works to eliminate the infinite repeating part.
- **Next Step**: Continue focusing on remaining Math I Number topics or move to 1D inequalities.

### 2026-03-12 Update
- **Unit**: 数学I (二次関数)
- **Implementation**: 平方完成 (Completing the Square) のインタラクティブな視覚化・ステップバイステップ解説コンポーネント (`CompletingSquareViz.tsx`) を追加。
- **Value**: SF要素を排除し、テストに直結する数学的概念の直感的な理解を促進。生徒が係数(a,b,c)を操作しながら頂点座標の変化を確認可能に。

### v1.3.96: 対称式と交代式 (因数分解) (Alternating Polynomial Factorization) (2026-03-12)
- **Status**: **IMPLEMENTED**.
- **Action**: Added Level 25 "対称式と交代式 (因数分解)" (Symmetric and Alternating Polynomial Factorization) to Math I Numbers and Algebraic Expressions (数と式).
- **Visualization**: `AlternatingPolynomialViz` implementation.
  - **Interactive Step-by-Step Guidance**: Breaks down the extremely confusing expansion and refactoring of $a^2(b-c) + b^2(c-a) + c^2(a-b)$ into 5 distinct logical steps.
  - **Focus on the Lowest Degree Principle**: Visually isolates the variable $a$ and forces the grouping to reveal the hidden common factor $(b-c)$.
  - **Visualizing Cyclic Symmetry**: Explains the final step of pulling out a negative sign to achieve the aesthetic "cyclic order" (輪環の順: $a \\to b \\to c \\to a$), bridging the gap between a correct answer and the textbook's standard form.
- **Learning Value**: Math I students universally hit a wall when presented with complex polynomials involving 3 variables. They blindly expand everything and get lost in 9 terms. By forcing them to organize by a single letter (a), the chaos reduces to a simple quadratic equation $Aa^2 + Ba + C$. This visualization proves that "organizing by one variable" is not just a trick, but a systematic un-tangling method.
- **Next Step**: Continue focusing on core Math I topics such as Data Analysis (データの分析) or expand into Linear Inequalities word problems.


### v1.4.1: 直角三角形に内接する長方形の面積の最大値 (図形問題の応用) (2026-03-12)
- **Status**: **IMPLEMENTED**.
- **Action**: Added Level 50 "直角三角形に内接する長方形の面積の最大値" (Maximum area of an inscribed rectangle) to Quadratic Functions (二次関数).
- **Visualization**: `RightTriangleRectangleViz` implementation.
  - **Interactive Graphic**: Visualizes a right triangle and a dynamic inscribed rectangle.
  - **Parameter Tuning**: Students can drag a slider to adjust the width of the rectangle.
  - **Geometric Intuition**: Instantly shows how widening the rectangle simultaneously reduces its height, enforcing the trade-off inherent in the objective function $S = x(4-x)$.
- **Learning Value**: Math I students universally struggle with converting geometric text problems into an algebraic equation. By dynamically stretching the shape and watching the calculated Area peak and decline, the necessity of creating a quadratic equation and finding its vertex becomes physically obvious.
- **Next Step**: Polish Data Analysis or finalize remaining Math I chapters.

### v1.4.0: 2次不等式の解とグラフの関係 (Solutions of Quadratic Inequalities and Graphs) (2026-03-12)
- **Status**: **IMPLEMENTED**.
- **Action**: Added Level 49 "2次不等式の解とグラフの関係" (Solutions of Quadratic Inequalities and Graphs) to Quadratic Functions (二次関数).
- **Visualization**: `QuadraticInequalityGraphViz` implementation.
  - **Interactive Graphic**: Visualizes $ax^2 + bx + c > 0$ with interactive tuning of $D$ and $a$.
  - **Dynamic Highlights**: Shows the exact regions on the x-axis where the inequality holds true.
- **Learning Value**: Math I students routinely memorize the table of solutions based on Discriminant $D>0, D=0, D<0$. By connecting the inequality direction ($>$ or $<$) directly to the visual regions "above" or "below" the x-axis, students replace rote memorization with geometric certainty.
- **Next Step**: Polish Data Analysis or finalize remaining Math I chapters.

### v1.4.3: 式の値 (代入) (Evaluating Formulas by Substitution) (2026-03-12)
- **Status**: **IMPLEMENTED**.
- **Action**: Added Level 30 "式の値 (代入)" (Evaluating Formulas by Substitution) to Math I Numbers and Algebraic Expressions (数と式). Fixed UI rendering for Levels 27-29.
- **Visualization**: `FormulaValuesViz` implementation.
  - **Interactive Graphic**: Visualizes the process of substituting positive and negative integers into simple algebraic expressions like $a^2 - b$, $a + b^2$, and $a^2 + b^2$.
  - **Parameter Tuning**: Students can adjust the values of $a$ and $b$ dynamically using sliders.
  - **Visualizing the Bracket Rule**: Explicitly shows the application of parentheses `()` when substituting negative numbers. For instance, when $b = -3$, the expression visually morphs into $(-3)^2$ instead of $-3^2$, preventing the classic $-9$ vs $+9$ error.
- **Learning Value**: "Substituting negative numbers" is the #1 source of arithmetic errors in early Math I. Students blindly plug numbers without brackets, turning $(-3)^2$ into $-9$. By explicitly rendering the brackets in the visual breakdown ONLY when the number is negative, it builds the mental habit of "negative numbers always carry their own brackets".
- **Next Step**: Polish Math I Data Analysis or expand further into remaining Numbers and Algebraic Expressions test-patterns.

### v1.4.5: 放物線と直線の間の線分の長さの最大値 (Maximum Vertical Segment Length) (2026-03-12)
- **Status**: **IMPLEMENTED**.
- **Action**: Added Level 52 "放物線と直線の間の線分の長さの最大値" (Maximum Vertical Segment Length Between Parabola and Line) to Quadratic Functions (二次関数). Fixed missing UI bindings for Levels 49, 50, and 51 in the sidebar menu.
- **Visualization**: `VerticalSegmentMaxViz` implementation.
  - **Interactive Graphic**: Visualizes a parabola $y = -x^2 + 4x$ and a line $y = x$ intersecting at $x=0$ and $x=3$.
  - **Parameter Tuning**: Students slide the x-coordinate $t$ and watch the vertical segment PQ dynamically stretch and shrink between the two graphs.
  - **Geometric Intuition**: The length of the segment $L$ is explicitly shown as $L = (-t^2+4t) - t = -t^2+3t$. The visualization mathematically proves that finding the maximum vertical segment is literally just finding the vertex of this new "difference parabola". 
- **Learning Value**: Math I and II students universally struggle to visualize what $f(x) - g(x)$ actually represents geometrically. By dragging the line segment and watching the calculated length peak, the algebraic act of subtracting functions is directly anchored to physical distance.
- **Next Step**: Polish existing chapters and refine remaining core Math I edge cases.
### v1.4.6: 1次不等式の文章題 (食塩水・濃度) (Salt Water Inequalities) (2026-03-12)
- **Status**: **IMPLEMENTED**.
- **Action**: Added Level 22 "1次不等式の文章題 (食塩水・濃度)" (Salt Water Inequalities) to Math I Numbers and Algebraic Expressions (数と式).
- **Visualization**: `SaltWaterInequalityViz` implementation.
  - **Interactive Graphic**: Visualizes two beakers mixing into a third. Shows the exact ratio of water to salt in real-time as the slider moves.
  - **Parameter Tuning**: Students can adjust the amount of 20% salt water ($x$ g) to add to the 10% base.
  - **Dynamic Equation Binding**: The UI highlights the exact concentration, turning green when it enters the target 12% to 15% range, providing an immediate visual mapping between the mathematical inequality $0.12 \le \dots \le 0.15$ and the physical beaker.
- **Learning Value**: "Concentration word problems" are a major stumbling block in Math I. Students memorize formulas without understanding the physical reality of adding salt *and* water simultaneously. This visualizer grounds the abstract inequality in a tangible, liquid reality, preventing the common mistake of only adding $x$ to the numerator or denominator.
- **Next Step**: Continue refining Math I core edge cases or move to Data Analysis (データの分析).