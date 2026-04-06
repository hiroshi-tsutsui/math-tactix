import re

with open('app/probability/page.tsx', 'r') as f:
    content = f.read()

# Fix the end part
match = re.search(r'\{level === 7 && \(\s*<main.*?CombinationRepetitionViz />\s*</main>\s*\).*?\}', content, flags=re.DOTALL)
if match:
    pass

# A simpler way, find "level === 7" section and replace everything after it
end_pattern = r'\{level === 7 && \([\s\S]*'
replacement = """{level === 7 && (
          <main className="flex-1 overflow-y-auto bg-white dark:bg-slate-900 p-6">
              <CombinationRepetitionViz />
          </main>
      )}
      {level === 8 && (
          <main className="flex-1 overflow-y-auto bg-white dark:bg-slate-900 p-6">
              <CircularPermutationViz />
          </main>
      )}
    </div>
  );
}
"""
content = re.sub(end_pattern, replacement, content)

with open('app/probability/page.tsx', 'w') as f:
    f.write(content)
