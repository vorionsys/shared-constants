// SPDX-License-Identifier: Apache-2.0
// Copyright 2024-2026 Vorion LLC

/**
 * @vorionsys/shared-constants - Tier Reconciliation
 *
 * The single place where every legacy trust encoding meets the canonical
 * T0-T7 lattice and is reconciled into one totally-ordered tier index.
 *
 * Three encodings exist on disk; this module reconciles them:
 *
 *  1. CANONICAL trust lattice `T0-T7` (score space 0-1000) - the `TrustTier`
 *     enum in `./tiers`. Normative source is
 *     `basis-spec/packages/basis/src/canonical.ts -> TRUST_TIERS`, pinned
 *     `TrustSpec@1.0.0` (canonical.ts sha256:16 = a317432384f30744).
 *     `./tiers.ts` is the byte-identical lock-step binding
 *     (tiers.ts sha256:16 = 894888e7e43a4343).
 *
 *  2. CAR-5 LEGACY trust levels (`UNKNOWN..PRIVILEGED`) - a coarse 5-value
 *     surface encoding (car-spec OpenAPI). NOT a competing lattice; it is
 *     reconciled by a FROZEN, conservative floor-projection onto T0-T7 (so a
 *     claim can never over-grant) and is deprecated on the API surface.
 *
 *  3. The ORTHOGONAL observation/assurance axis
 *     (`BLACK_BOX..VERIFIED_BOX`) - NOT a trust tier. It composes as a
 *     *ceiling* on the trust tier, never as a tier value.
 *
 * `effectiveTier` is computed in the T-index space and FAILS CLOSED to T0
 * on any unverified / unmappable / unknown-observation input.
 *
 * Name collisions across axes (`VERIFIED`, `TRUSTED`) are resolved by
 * namespacing: `trust:T5`, `obs:VERIFIED_BOX`, `car-legacy:VERIFIED`.
 *
 * @see https://basis.vorion.org/tiers
 */

import { TrustTier } from './tiers';

// =============================================================================
// CAR-5 LEGACY TRUST LEVELS
// =============================================================================

/**
 * The CAR-5 legacy trust-level encoding (car-spec OpenAPI surface).
 *
 * This is a coarse, identity-verification-flavored 5-value string encoding.
 * It is LEGACY and projects onto the canonical T0-T7 lattice (see
 * {@link CAR_TO_T}); it is NOT a competing lattice.
 *
 * NOTE: distinct from `CARCategory` in `./car-categories` (the agent
 * *classification* taxonomy GOV/RSN/...). These do not alias.
 */
export enum CarLegacyTier {
  UNKNOWN = 'UNKNOWN',
  BASIC = 'BASIC',
  VERIFIED = 'VERIFIED',
  TRUSTED = 'TRUSTED',
  PRIVILEGED = 'PRIVILEGED',
}

/**
 * The CAR-5 levels in ordinal order (least to most trusted).
 */
export const CAR_LEGACY_TIERS: readonly CarLegacyTier[] = [
  CarLegacyTier.UNKNOWN,
  CarLegacyTier.BASIC,
  CarLegacyTier.VERIFIED,
  CarLegacyTier.TRUSTED,
  CarLegacyTier.PRIVILEGED,
] as const;

// =============================================================================
// FROZEN CAR-5 <-> T0-T7 PROJECTION
// =============================================================================

/**
 * FROZEN, conservative floor-projection: CAR-5 level -> canonical T tier.
 *
 * Each coarse CAR band maps to the LOWEST T-tier it guarantees, so a CAR
 * claim can never inflate above what it actually attests. Coarsening
 * (T->CAR->T) therefore always rounds DOWN - the safe direction for `min()`.
 *
 * Rationale (pinned `TrustSpec@1.0.0`):
 *   UNKNOWN    -> T0  no verification
 *   BASIC      -> T1  read-only, monitored
 *   VERIFIED   -> T3  CT-ID is *required from T3*; "identity verified" aligns
 *   TRUSTED    -> T5  = T5_TRUSTED, "cross-system operations"
 *   PRIVILEGED -> T6  T7 Autonomy needs VERIFIED_BOX, NOT grantable by an
 *                     identity-class label alone
 *
 * This table is FROZEN: changing it is a versioned, governed spec event,
 * never an ad-hoc edit.
 */
export const CAR_TO_T: Readonly<Record<CarLegacyTier, TrustTier>> = {
  [CarLegacyTier.UNKNOWN]: TrustTier.T0_SANDBOX,
  [CarLegacyTier.BASIC]: TrustTier.T1_OBSERVED,
  [CarLegacyTier.VERIFIED]: TrustTier.T3_MONITORED,
  [CarLegacyTier.TRUSTED]: TrustTier.T5_TRUSTED,
  [CarLegacyTier.PRIVILEGED]: TrustTier.T6_CERTIFIED,
} as const;

/**
 * Inverse projection: canonical T tier -> CAR-5 level, for legacy API
 * consumers. Each T maps to the CAR band whose floor it meets.
 *
 *   T0       -> UNKNOWN
 *   T1, T2   -> BASIC
 *   T3, T4   -> VERIFIED
 *   T5       -> TRUSTED
 *   T6, T7   -> PRIVILEGED
 *
 * Round-trip `CAR->T->CAR` is identity (stable); `T->CAR->T` rounds DOWN
 * (lossy-safe, no over-grant).
 */
export const T_TO_CAR: Readonly<Record<TrustTier, CarLegacyTier>> = {
  [TrustTier.T0_SANDBOX]: CarLegacyTier.UNKNOWN,
  [TrustTier.T1_OBSERVED]: CarLegacyTier.BASIC,
  [TrustTier.T2_PROVISIONAL]: CarLegacyTier.BASIC,
  [TrustTier.T3_MONITORED]: CarLegacyTier.VERIFIED,
  [TrustTier.T4_STANDARD]: CarLegacyTier.VERIFIED,
  [TrustTier.T5_TRUSTED]: CarLegacyTier.TRUSTED,
  [TrustTier.T6_CERTIFIED]: CarLegacyTier.PRIVILEGED,
  [TrustTier.T7_AUTONOMOUS]: CarLegacyTier.PRIVILEGED,
} as const;

/**
 * Project a CAR-5 legacy level onto the canonical T tier (floor projection).
 */
export function carTierToTrustTier(car: CarLegacyTier): TrustTier {
  return CAR_TO_T[car];
}

/**
 * Project a canonical T tier back onto a CAR-5 legacy level (for legacy API
 * consumers). Lossy-safe: rounds DOWN, never over-grants.
 */
export function trustTierToCarTier(tier: TrustTier): CarLegacyTier {
  return T_TO_CAR[tier];
}

// =============================================================================
// ORTHOGONAL OBSERVATION / ASSURANCE AXIS
// =============================================================================

/**
 * The observation/assurance axis (mirrors basis-spec `OBSERVATION_TIERS`,
 * pinned `TrustSpec@1.0.0`). This is how much internal-state visibility the
 * operator has - it is ORTHOGONAL to trust and only ever CAPS the trust tier.
 * It is never itself a trust tier.
 */
export type ObservationTier =
  | 'BLACK_BOX'
  | 'GRAY_BOX'
  | 'WHITE_BOX'
  | 'ATTESTED_BOX'
  | 'VERIFIED_BOX';

/**
 * Ceiling map: observation level -> maximum achievable trust tier.
 * Mirrors basis-spec `OBSERVATION_TIERS[*].maxTier` (pinned `TrustSpec@1.0.0`).
 *
 *   BLACK_BOX    -> T3  I/O only
 *   GRAY_BOX     -> T4  I/O + logs
 *   WHITE_BOX    -> T6  full code access
 *   ATTESTED_BOX -> T6  TEE-verified execution
 *   VERIFIED_BOX -> T7  TEE + interpretability stack
 *
 * HONEST CEILING: TEE verifiers are STUBS today, so anything resting on
 * "the runtime ran the committed code" caps at WHITE_BOX (T6) in practice -
 * ATTESTED_BOX / VERIFIED_BOX are unreachable until a real TPMQuoteVerifier
 * lands. The map below records the *spec* ceilings; runtime policy should
 * additionally clamp via `localCeiling` until attestation is real.
 */
export const OBS_MAXTIER: Readonly<Record<ObservationTier, TrustTier>> = {
  BLACK_BOX: TrustTier.T3_MONITORED,
  GRAY_BOX: TrustTier.T4_STANDARD,
  WHITE_BOX: TrustTier.T6_CERTIFIED,
  ATTESTED_BOX: TrustTier.T6_CERTIFIED,
  VERIFIED_BOX: TrustTier.T7_AUTONOMOUS,
} as const;

// =============================================================================
// toT() - THE SINGLE MEETING POINT FOR EVERY ENCODING (FAIL-CLOSED)
// =============================================================================

/**
 * Any claim shape accepted by {@link toT}:
 *  - a numeric tier index 0..7
 *  - a `T#` / `#` string ("T3", "3")
 *  - a CAR-5 legacy value ("VERIFIED", ...) projected via {@link CAR_TO_T}
 */
export type TierClaim = number | string | CarLegacyTier | null | undefined;

/**
 * Project any claim onto the canonical T-index.
 *
 * Accepts a numeric 0..7, a `T#`/`#` string, or a CAR-5 legacy value.
 * ANYTHING unmappable (out of range, garbage string, null/undefined) maps
 * to T0 - FAIL CLOSED. This is the single place every encoding meets.
 */
export function toT(claim: TierClaim): TrustTier {
  if (claim == null) return TrustTier.T0_SANDBOX;

  // numeric tier index 0..7
  if (typeof claim === 'number') {
    if (Number.isInteger(claim) && claim >= 0 && claim <= 7) {
      return claim as TrustTier;
    }
    return TrustTier.T0_SANDBOX; // out of range / non-integer -> fail closed
  }

  if (typeof claim === 'string') {
    const normalized = claim.toUpperCase().trim();

    // CAR-5 legacy value
    if (normalized in CAR_TO_T) {
      return CAR_TO_T[normalized as CarLegacyTier];
    }

    // 'T#' / '#' string
    const match = /^T?([0-7])$/.exec(normalized);
    if (match) {
      return Number(match[1]) as TrustTier;
    }
  }

  return TrustTier.T0_SANDBOX; // unmappable -> fail closed
}

// =============================================================================
// effectiveTier() - min() ACROSS EVERY AXIS, FAIL-CLOSED
// =============================================================================

/**
 * Inputs to {@link effectiveTier}. Every numeric field is in the T-index
 * space (0..7) once projected; the observation field is the orthogonal axis.
 */
export interface EffectiveTierInput {
  /** The claimed tier (numeric, `T#`/`#` string, or CAR-5 legacy value). */
  readonly claimed: TierClaim;
  /** The independently recomputed tier (same accepted shapes). */
  readonly recomputed: TierClaim;
  /** The orthogonal observation/assurance level (caps the trust tier). */
  readonly observation: ObservationTier | string;
  /** Local policy ceiling (T-index). Defaults to T7 (no extra clamp). */
  readonly localCeiling?: TrustTier | number;
  /** Whether the claim was actually verified. Unverified => T0. */
  readonly verified?: boolean;
}

/**
 * The canonical reconciliation:
 *
 *   effectiveTier = verified
 *     ? min( toT(claimed), toT(recomputed), OBS_MAXTIER[observation], localCeiling )
 *     : T0
 *
 * FAILS CLOSED to T0 on:
 *  - `verified === false`            (unverifiable => least privilege)
 *  - unknown observation level       (not in OBS_MAXTIER)
 *  - any unmappable claim            (toT -> T0)
 *
 * This is the only place the three encodings are combined, and it fails
 * closed everywhere.
 */
export function effectiveTier({
  claimed,
  recomputed,
  observation,
  localCeiling = TrustTier.T7_AUTONOMOUS,
  verified = true,
}: EffectiveTierInput): TrustTier {
  if (!verified) return TrustTier.T0_SANDBOX; // unverifiable -> least privilege

  // unknown observation level -> fail closed to T0
  const obsCap =
    observation in OBS_MAXTIER
      ? OBS_MAXTIER[observation as ObservationTier]
      : TrustTier.T0_SANDBOX;

  return Math.min(
    toT(claimed),
    toT(recomputed),
    obsCap,
    localCeiling,
  ) as TrustTier;
}

// =============================================================================
// NAMESPACED LABEL HELPERS (values across axes never alias)
// =============================================================================

/** Namespaced label for a canonical trust tier, e.g. `trust:T5`. */
export function trustLabel(tier: TrustTier): string {
  return `trust:T${tier}`;
}

/** Namespaced label for an observation level, e.g. `obs:VERIFIED_BOX`. */
export function obsLabel(observation: ObservationTier): string {
  return `obs:${observation}`;
}

/** Namespaced label for a CAR-5 legacy level, e.g. `car-legacy:VERIFIED`. */
export function carLegacyLabel(car: CarLegacyTier): string {
  return `car-legacy:${car}`;
}
