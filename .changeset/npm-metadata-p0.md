---
"@vorionsys/shared-constants": major
---

BREAKING: Remove the `manifest` export (`MANIFEST`, `getTestCountDisplay`, `getCoverageDisplay`, `getComplianceStatus`, `isComplianceSubmitted`, `getManifestAgeDays`, and the `ProjectManifest` / `TestMetrics` / `ComplianceEntry` / `ReleaseInfo` / `PostureInfo` types). Project-claim metrics no longer belong in the shared-constants surface; consumers should source release/compliance metrics from their own manifest.

Added: `tier-reconciliation` module (`effectiveTier`, `carTierToTrustTier`, `trustTierToCarTier`, CAR-5 legacy ↔ T0–T7 maps, observation-tier ceiling helpers).

Also: enable npm provenance attestation + trusted-publisher (OIDC) configuration and correct package metadata (homepage, bugs, author, files).

Trust tiers, thresholds, and all other exports are unchanged.
