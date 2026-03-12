with open('logs/system_wisdom.md', 'r') as f:
    content = f.read()

new_entry = """### v1.4.9: 円順列 (Circular Permutations) (2026-03-12)
- **Status**: **IMPLEMENTED**.
- **Action**: Added Level 8 "円順列" (Circular Permutations) to Probability (場合の数と確率).
- **Visualization**: `CircularPermutationViz` implementation.
  - **Interactive Graphic**: Students can toggle between "一列 (Linear)" and "円 (Circular)" modes for a set of $n$ distinct items.
  - **Dynamic Rotation**: In the "Circular" mode, students can physically click a rotate button to shift the elements around the circle, proving that $n$ distinct physical states map to the exact same relative circular arrangement.
  - **Formula Connection**: The explanation directly maps the visual of "divide by $n$ rotations" to the abstract formula $\\frac{n!}{n} = (n-1)!$.
- **Learning Value**: Math A students frequently memorize $(n-1)!$ without understanding *why* the $-1$ is there. By switching between a straight line and a circle, and rotating the circle to show redundant states, the division by $n$ becomes a physical necessity to prevent overcounting, completely replacing rote memorization.
- **Next Step**: Continue expanding core Math A topics or explore Sets and Logic.

"""

parts = content.split('## Evolution History\n')
new_content = parts[0] + '## Evolution History\n\n' + new_entry + parts[1]

with open('logs/system_wisdom.md', 'w') as f:
    f.write(new_content)
