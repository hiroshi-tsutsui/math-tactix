# System Wisdom Log - Math Tactix (v1.2)

## Principles
1.  **Localization First**: All UI text must use `locales/{lang}.json`. Hardcoded strings are technical debt.
2.  **Pedagogy Over Content**: Features must teach a concept (e.g., "Flux", "Void", "Entropy"), not just display math.
3.  **Modular Architecture**: Components should be self-contained but share the global `LanguageContext`.

## Cycle Log
- **2026-03-03**: Initialized Wisdom Log. Targeting Vectors (Void Scout) for localization refactor.
- **2026-03-03**: Refactored `app/vectors/page.tsx` to use `LanguageContext`. Replaced hardcoded strings with `t(...)` calls. Verified `locales/ja.json` and `locales/en.json` contain comprehensive keys for "Void Scout" (Vectors).
- **2026-03-03**: **Functions Module (Causality Engine) Localization**:
    - Refactored `app/functions/page.tsx` to use `t(...)` for all UI text.
    - Implemented dynamic level data fetching based on locale.
    - Removed hardcoded Japanese strings.
- **2026-03-03**: **Global UI Update**:
    - Modified `app/contexts/LanguageContext.tsx` to allow dynamic locale switching (removed forced 'ja').
    - Added a persistent Language Toggle button (JP/EN) to `app/components/XPBar.tsx`.
- **2026-03-03**: **Quadratics Module (Gravity Simulation) Localization**:
    - Refactored `app/quadratics/page.tsx` to use `LanguageContext`.
    - Migrated all hardcoded UI text and instructions to `locales/ja.json` and `locales/en.json`.
    - Ensured `QUESTIONS` array is generated inside the component to support dynamic translation of math instructions.
- **2026-03-03**: **Probability Module (Entropy) Localization**:
    - Refactored `app/probability/page.tsx` to use `LanguageContext`.
    - Implemented localization for "Monty Hall Game" and "Normal Distribution Simulator".
    - Added comprehensive keys to `locales/ja.json` and `locales/en.json`.
    - Ensured missions and UI labels are fully dynamic.
- **2026-03-03**: **Trigonometry Module (Harmonic Tuner/Famous Angles) Localization**:
    - Updated `locales/ja.json` and `locales/en.json` to match the "Famous Angles" (Unit Circle) UI.
    - Enhanced `LanguageContext.tsx` to support parameter interpolation (e.g., `{{angle}}`).
    - Refactored `app/trig/page.tsx` to use `useLanguage` and removed all hardcoded Japanese strings.
    - Validated dynamic mission titles like "Reproduce sin 60°".
- **2026-03-03**: **Matrices Module (Spatial Deformation) Localization**:
    - Refactored `app/matrices/page.tsx` to use `LanguageContext`.
    - Migrated all hardcoded UI text (Levels, Descriptions, Logs) to `locales/ja.json` and `locales/en.json`.
    - Implemented dynamic level data fetching (`getLevelData`) to switch text based on the active language.
    - Standardized UI keys (`analysis_title`, `mission_title`, `activity_log`, `red_arrow`, `green_arrow`).
