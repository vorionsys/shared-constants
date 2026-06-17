# Security Policy

## Reporting a vulnerability

Report security issues **privately** — not through public GitHub issues or discussions.

**Preferred:** Use GitHub's private vulnerability reporting for this repository:
[**Report a vulnerability**](https://github.com/vorionsys/shared-constants/security/advisories/new)
(GitHub → the repository → **Security** tab → **Report a vulnerability**). This keeps the report private, tracked, and attributable.

**Secondary:** You may also email **security@vorion.org**.

> Reviewer note: as of this writing, `security@vorion.org` has **not** been confirmed as a monitored inbox with a response SLA. Confirm the inbox is monitored and an SLA is published before relying on email as the primary channel. Until then, prefer GitHub private vulnerability reporting.

Include:
- Affected package and version (`@vorionsys/shared-constants`)
- Reproduction steps or a minimal test case
- Your assessment of severity and impact
- Whether you intend to disclose publicly, and on what timeline

## Scope

In-scope:

- Flaws in the package that could mislead a consumer into an insecure configuration — for example, a tier whose declared score range or capability gate does not match its documented meaning, or an error code mapped to a misleading HTTP status.
- Build or packaging issues that could allow the published artifact to differ from the source in this repository.

Out-of-scope:

- Vulnerabilities in dependencies (report those to the upstream project; we will update once a fix is available).
- Issues in consumers of this library — report those to the respective product teams.
- This package contains constants and pure helper functions; it does not perform authentication, signing, or network I/O. Reports must identify a concrete way the published constants or helpers lead to a security-relevant outcome.

## Supported versions

Until v1.0.0 of the public API contract, expect to track the latest release; older versions are not maintained. We will document a longer-term support window once the contract stabilizes.

## Disclosure

We prefer coordinated disclosure. After we acknowledge and have a fix in progress, we will agree on a public disclosure date. Attribution to the reporter is included unless you request anonymity. If a reported issue is already being exploited, we may publish immediately without waiting for a coordinated date.

## PGP

Not offered at this time. If you require encrypted communication, ask and we will arrange.
