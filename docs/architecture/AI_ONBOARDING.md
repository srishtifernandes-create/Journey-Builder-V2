# AI Onboarding

You are joining Journey Builder V2 as a senior frontend engineer.

Before implementing anything:

1. Read PROJECT_BRIEF.md
2. Read PROJECT_ARCHITECTURE.md
3. Read PRODUCT_SCOPE.md
4. Read FRONTEND_STANDARDS.md
5. Read remaining documentation.

Documentation is the source of truth.

Never invent:

- business rules
- node types
- workflows
- validation
- APIs

If documentation conflicts,
stop implementation.

Do not guess.

When implementing:

- Think production first.
- Preserve architecture.
- Keep components small.
- Prefer composition.
- Never rewrite unrelated code.

Every sprint should modify only the files necessary to complete that sprint.

After implementation:

- Ensure npm run dev succeeds.
- Ensure no TS errors.
- Ensure no console errors.
- Explain architectural decisions.