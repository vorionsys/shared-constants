# Contributing to @vorionsys/shared-constants

Thank you for considering a contribution. This package is the single source of truth for the Vorion ecosystem — canonical trust tiers, domains, capabilities, rate limits, error codes, API versions, the product catalog, and UI themes. Because many other packages depend on these constants, changes here ripple outward. Scrutiny, counter-proposals, and well-tested fixes are welcome.

This repository is part of the BASIS open-standard footprint. BASIS is to AI-agent governance what OAuth is to delegated authorization — an open standard so an agent trusted by one system can be evaluated by another.

## What we accept

**Bug fixes.** Corrections to existing constants, helper functions, or type definitions are welcome directly as PRs with a reproduction and a regression test.

**New or extended constants.** Additions (new error codes, capabilities, themes, etc.) are welcome. Open an issue first for anything that changes the shape of an exported value, since downstream consumers rely on the current shape.

**Documentation, typos, clarifications.** Always welcome.

## What we do not accept without discussion

- **Breaking changes to exported values or types** (renaming a tier, changing a tier's score range, removing an error code) without an issue first and a version-bump plan. These constants are consumed across the ecosystem; a silent breaking change can quietly destabilize dependents.
- **Loosening a constraint** (for example, widening a rate limit or lowering a capability's tier gate) without documented reasoning. Tightening is lower-risk; loosening warrants discussion and, where it changes the public contract, a major version bump.

## Before you open a PR

- Read the [README](./README.md) to understand what each module exports.
- Open an issue to discuss anything that changes an exported shape. This avoids work on a direction that will not merge.
- Install dependencies: `npm install`.
- Typecheck: `npm run typecheck`.
- Build: `npm run build` and confirm it passes.
- Test: `npm test` (Vitest). Add or update tests that demonstrate the change — every module has a colocated `*.test.ts`.

These are the same steps CI runs (`.github/workflows/ci.yml`): typecheck, build, test.

## Commit style

Conventional commits are encouraged but not mandatory:

- `feat(tiers):` new or extended constant
- `fix(error-codes):` correct an existing value
- `docs:` documentation clarification
- `chore:` repository housekeeping
- `test:` add or update tests

## Reporting security issues

Do not open a public issue for security vulnerabilities. See [SECURITY.md](./SECURITY.md).

## Code of conduct

This project follows the [Contributor Covenant](./CODE_OF_CONDUCT.md). By participating you agree to uphold this code.

## License

By submitting a Contribution, you agree to license your work under the Apache License, Version 2.0 (the license this project carries). You retain copyright on your Contribution; the license grants us and all users the right to use, modify, and redistribute under the same terms.

## Who decides what merges

Vorion LLC maintains this repository and has final commit authority. Substantive disagreements about direction are resolved through the issue tracker with visible rationale. We do not operate a formal voting model; decisions are made by the maintainers with consideration for community input.

## Thanks

Every review, test, reproduction, and counter-argument improves the standard. If a constant is wrong somewhere, we want to know.
