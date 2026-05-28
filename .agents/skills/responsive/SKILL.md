---
name: responsive
description: Audit and fix responsive behavior after all features are complete.
---

## Purpose

Audit and fix responsive behavior after all features are complete.

## Scope

- Test 375px, 768px, 1024px, and 1440px widths.
- Fix layout overflow.
- Keep forecast cards horizontally scrollable on mobile.
- Keep forecast cards in a row on desktop.
- Keep touch targets at least 44px tall.
- Keep card padding at 24px mobile and 32px desktop.
- Verify temperature text uses `clamp()`.
- Verify background covers the viewport.

## Rules

- Do not add new app functionality.
- Do not change API behavior.
- Preserve the design system.
- Use mobile-first CSS.

## Review

After fixing, read `skills/review/SKILL.md` and report PASS, WARN, or FAIL.
