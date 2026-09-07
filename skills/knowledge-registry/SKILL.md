---
name: knowledge-registry
description: Use when an investigation is wasted by a misread data model, a confusing legacy behavior, or a non-obvious gotcha - and when writing code near one. Maintains a living registry of the traps that have burned past investigations (easy-to-misread models, misleading names, load-bearing quirks) so the same mistake never costs time twice. Read the relevant entry before diving into a known-treacherous area; add an entry whenever a surprise costs real time. Triggers on "this burned me before", confusing or legacy behavior, a field/status that doesn't mean what it says, repeated investigations into the same area.
---

# knowledge-registry

Every codebase has a handful of places that mean something other than what they look like. The cost isn't the first investigation. It's the fifth person, or the same agent next week, re-deriving the same gotcha from scratch.

## Rule

Keep a registry of the traps. Each entry records three things: what's misleading, what it actually does, and how to work with it safely. Before working in a known-treacherous area, read its entry. When a surprise costs you real time, write the entry so it never costs anyone that time again.

## What earns an entry

- A model, field, or status that doesn't mean what its name implies.
- A "catch-all" default that quietly masks several distinct states.
- Behavior that's correct but counterintuitive, and therefore easy to "fix" into a bug.
- Anything that has burned an investigation more than once.

## Navigate by name, not line number

Reference code by symbol or method name. Line numbers drift and turn a registry stale within a sprint; the meaning it captures outlives the layout.

This is an error-registry discipline. It's what lets an agent, or a new engineer, skip the traps you already paid for instead of paying for them again.
