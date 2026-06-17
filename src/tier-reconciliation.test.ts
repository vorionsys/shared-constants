// SPDX-License-Identifier: Apache-2.0
// Copyright 2024-2026 Vorion LLC

import { describe, it, expect } from 'vitest';
import { TrustTier, TIER_THRESHOLDS, ALL_TIERS } from './tiers.js';
import {
  CarLegacyTier,
  CAR_LEGACY_TIERS,
  CAR_TO_T,
  T_TO_CAR,
  carTierToTrustTier,
  trustTierToCarTier,
  OBS_MAXTIER,
  toT,
  effectiveTier,
  trustLabel,
  obsLabel,
  carLegacyLabel,
} from './tier-reconciliation.js';

// -----------------------------------------------------------------------------
// (a) NO-DRIFT: this repo's TIER_THRESHOLDS must equal the basis-spec
//     TRUST_TIERS golden, tier-by-tier. Any future drift of tiers.ts from the
//     normative spec (TrustSpec@1.0.0, canonical.ts sha256:16 = a317432384f30744)
//     fails CI here.
// -----------------------------------------------------------------------------

describe('no-drift: shared-constants T0-T7 === basis-spec TRUST_TIERS golden', () => {
  // Frozen golden, verbatim from basis-spec/packages/basis/src/canonical.ts
  // TRUST_TIERS bounds, in T0..T7 order.
  const GOLDEN_BOUNDS: ReadonlyArray<readonly [number, number]> = [
    [0, 199],
    [200, 349],
    [350, 499],
    [500, 649],
    [650, 799],
    [800, 875],
    [876, 950],
    [951, 1000],
  ];

  it('has exactly 8 tiers to compare', () => {
    expect(ALL_TIERS).toHaveLength(8);
    expect(GOLDEN_BOUNDS).toHaveLength(8);
  });

  it('TIER_THRESHOLDS min/max are byte-identical to the basis-spec golden, tier-by-tier', () => {
    for (const tier of ALL_TIERS) {
      const t = TIER_THRESHOLDS[tier];
      const [min, max] = GOLDEN_BOUNDS[tier];
      expect([t.min, t.max]).toEqual([min, max]);
    }
  });

  it('T0-T7 partition is contiguous and exhaustive over [0,1000]', () => {
    for (let i = 0; i < GOLDEN_BOUNDS.length; i++) {
      const [min, max] = GOLDEN_BOUNDS[i];
      if (i === 0) {
        expect(min).toBe(0);
      } else {
        expect(min).toBe(GOLDEN_BOUNDS[i - 1][1] + 1);
      }
      expect(max).toBeGreaterThanOrEqual(min);
    }
    expect(GOLDEN_BOUNDS[7][1]).toBe(1000);
  });
});

// -----------------------------------------------------------------------------
// (b) PROJECTION MONOTONIC: CAR->T = [0,1,3,5,6], strictly increasing.
// -----------------------------------------------------------------------------

describe('frozen projection: CAR-5 -> T0-T7', () => {
  it('CAR->T sequence is exactly [0,1,3,5,6]', () => {
    const seq = CAR_LEGACY_TIERS.map((c) => CAR_TO_T[c] as number);
    expect(seq).toEqual([0, 1, 3, 5, 6]);
  });

  it('CAR->T is strictly increasing (monotonic in CAR ordinal order)', () => {
    const seq = CAR_LEGACY_TIERS.map((c) => CAR_TO_T[c] as number);
    for (let i = 1; i < seq.length; i++) {
      expect(seq[i]).toBeGreaterThan(seq[i - 1]);
    }
  });

  it('carTierToTrustTier matches the CAR_TO_T map', () => {
    for (const c of CAR_LEGACY_TIERS) {
      expect(carTierToTrustTier(c)).toBe(CAR_TO_T[c]);
    }
    expect(carTierToTrustTier(CarLegacyTier.VERIFIED)).toBe(TrustTier.T3_MONITORED);
    expect(carTierToTrustTier(CarLegacyTier.PRIVILEGED)).toBe(TrustTier.T6_CERTIFIED);
  });
});

// -----------------------------------------------------------------------------
// (c) ROUND-TRIP CAR->T->CAR is identity (stable).
// -----------------------------------------------------------------------------

describe('round-trip CAR->T->CAR is identity', () => {
  it('every CAR level survives CAR->T->CAR unchanged', () => {
    for (const c of CAR_LEGACY_TIERS) {
      expect(trustTierToCarTier(carTierToTrustTier(c))).toBe(c);
    }
  });
});

// -----------------------------------------------------------------------------
// (d) T->CAR->T rounds DOWN (no over-grant; conservative coarsening).
// -----------------------------------------------------------------------------

describe('coarsening T->CAR->T always rounds DOWN (no over-grant)', () => {
  it('T->CAR->T never increases the tier index', () => {
    for (const tier of ALL_TIERS) {
      const coarsened = carTierToTrustTier(trustTierToCarTier(tier));
      expect(coarsened).toBeLessThanOrEqual(tier);
    }
  });

  it('T_TO_CAR has an entry for every tier', () => {
    for (const tier of ALL_TIERS) {
      expect(T_TO_CAR[tier]).toBeDefined();
    }
  });
});

// -----------------------------------------------------------------------------
// (e) effectiveTier: the 5 fail-closed / min cases from tier-reconcile-verify.mjs.
// -----------------------------------------------------------------------------

describe('effectiveTier = min(...) + observation ceiling, FAIL-CLOSED', () => {
  it('min(T5 claim, T4 recomp, BLACK_BOX->T3) = T3', () => {
    expect(
      effectiveTier({ claimed: 'TRUSTED', recomputed: 4, observation: 'BLACK_BOX' }),
    ).toBe(TrustTier.T3_MONITORED);
  });

  it('unverified claim fails closed to T0', () => {
    expect(
      effectiveTier({
        claimed: 7,
        recomputed: 7,
        observation: 'VERIFIED_BOX',
        verified: false,
      }),
    ).toBe(TrustTier.T0_SANDBOX);
  });

  it('unknown observation tier fails closed to T0', () => {
    expect(
      effectiveTier({ claimed: 'PRIVILEGED', recomputed: 6, observation: 'NONSENSE' }),
    ).toBe(TrustTier.T0_SANDBOX);
  });

  it('honest happy path min(T6, T7, WHITE_BOX->T6) = T6', () => {
    expect(
      effectiveTier({ claimed: 'PRIVILEGED', recomputed: 7, observation: 'WHITE_BOX' }),
    ).toBe(TrustTier.T6_CERTIFIED);
  });

  it('unmappable claim fails closed (does not inflate)', () => {
    expect(
      effectiveTier({ claimed: 'SUPER_ADMIN', recomputed: 5, observation: 'GRAY_BOX' }),
    ).toBe(TrustTier.T0_SANDBOX);
  });
});

// -----------------------------------------------------------------------------
// toT() unit coverage: numeric, 'T#'/'#' string, CAR legacy, fail-closed.
// -----------------------------------------------------------------------------

describe('toT() projects every encoding, fails closed to T0', () => {
  it('accepts a numeric 0..7', () => {
    expect(toT(0)).toBe(TrustTier.T0_SANDBOX);
    expect(toT(5)).toBe(TrustTier.T5_TRUSTED);
    expect(toT(7)).toBe(TrustTier.T7_AUTONOMOUS);
  });

  it("accepts 'T#' and '#' strings (case/whitespace insensitive)", () => {
    expect(toT('T3')).toBe(TrustTier.T3_MONITORED);
    expect(toT('3')).toBe(TrustTier.T3_MONITORED);
    expect(toT('  t6 ')).toBe(TrustTier.T6_CERTIFIED);
  });

  it('accepts CAR-5 legacy values via the frozen projection', () => {
    expect(toT('UNKNOWN')).toBe(TrustTier.T0_SANDBOX);
    expect(toT('VERIFIED')).toBe(TrustTier.T3_MONITORED);
    expect(toT('PRIVILEGED')).toBe(TrustTier.T6_CERTIFIED);
    expect(toT(CarLegacyTier.TRUSTED)).toBe(TrustTier.T5_TRUSTED);
  });

  it('fails closed to T0 on unmappable / out-of-range / nullish input', () => {
    expect(toT(null)).toBe(TrustTier.T0_SANDBOX);
    expect(toT(undefined)).toBe(TrustTier.T0_SANDBOX);
    expect(toT(8)).toBe(TrustTier.T0_SANDBOX);
    expect(toT(-1)).toBe(TrustTier.T0_SANDBOX);
    expect(toT(3.5)).toBe(TrustTier.T0_SANDBOX);
    expect(toT('T8')).toBe(TrustTier.T0_SANDBOX);
    expect(toT('SUPER_ADMIN')).toBe(TrustTier.T0_SANDBOX);
    expect(toT('')).toBe(TrustTier.T0_SANDBOX);
  });
});

// -----------------------------------------------------------------------------
// OBS_MAXTIER mirrors basis-spec OBSERVATION_TIERS (TEE stubs => WHITE_BOX/T6).
// -----------------------------------------------------------------------------

describe('OBS_MAXTIER observation ceiling map', () => {
  it('matches the pinned TrustSpec@1.0.0 ceilings', () => {
    expect(OBS_MAXTIER.BLACK_BOX).toBe(TrustTier.T3_MONITORED);
    expect(OBS_MAXTIER.GRAY_BOX).toBe(TrustTier.T4_STANDARD);
    expect(OBS_MAXTIER.WHITE_BOX).toBe(TrustTier.T6_CERTIFIED);
    expect(OBS_MAXTIER.ATTESTED_BOX).toBe(TrustTier.T6_CERTIFIED);
    expect(OBS_MAXTIER.VERIFIED_BOX).toBe(TrustTier.T7_AUTONOMOUS);
  });
});

// -----------------------------------------------------------------------------
// Namespaced labels never alias across axes.
// -----------------------------------------------------------------------------

describe('namespaced label helpers prevent cross-axis aliasing', () => {
  it('trust / obs / car-legacy labels are distinct even when the bare name collides', () => {
    expect(trustLabel(TrustTier.T5_TRUSTED)).toBe('trust:T5');
    expect(obsLabel('VERIFIED_BOX')).toBe('obs:VERIFIED_BOX');
    expect(carLegacyLabel(CarLegacyTier.VERIFIED)).toBe('car-legacy:VERIFIED');
    expect(carLegacyLabel(CarLegacyTier.TRUSTED)).toBe('car-legacy:TRUSTED');

    // 'VERIFIED' (car-legacy) vs 'VERIFIED_BOX' (obs) vs T5 'Trusted' must not alias
    const labels = new Set([
      trustLabel(TrustTier.T5_TRUSTED),
      obsLabel('VERIFIED_BOX'),
      carLegacyLabel(CarLegacyTier.VERIFIED),
      carLegacyLabel(CarLegacyTier.TRUSTED),
    ]);
    expect(labels.size).toBe(4);
  });
});
