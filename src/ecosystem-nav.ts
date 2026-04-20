// SPDX-License-Identifier: Apache-2.0
// Copyright 2024-2026 Vorion LLC

/**
 * @vorionsys/shared-constants - Ecosystem Navigation
 *
 * Canonical navigation data for the universal ecosystem strip.
 * Every Vorion property (vorion.org, basis.vorion.org, learn.vorion.org,
 * cognigate.dev, marketing subdomains) should render this strip so users
 * can navigate the ecosystem with one click from any surface.
 *
 * IMPORTANT: When adding or removing a site from the ecosystem, update
 * this file — it is the single source of truth for cross-site navigation.
 *
 * @see https://vorion.org (reference implementation in Header.tsx)
 */

// =============================================================================
// ECOSYSTEM STRIP LINKS
// =============================================================================

export interface EcosystemLink {
  /** Short display label (≤10 chars recommended) */
  label: string;
  /** Full URL — absolute for external sites, relative for same-site */
  href: string;
  /** True if link opens in new tab (cross-domain) */
  external?: boolean;
  /** Short description for tooltips / accessibility */
  description?: string;
}

/**
 * Primary ecosystem strip — the "top rail" shown across all Vorion sites.
 * Each entry is a first-class citizen of the ecosystem.
 *
 * Order matters — this is the display order left-to-right.
 */
export const ECOSYSTEM_STRIP: readonly EcosystemLink[] = [
  {
    label: 'Home',
    href: 'https://vorion.org',
    external: true,
    description: 'Vorion — Governance for the Autonomous Age',
  },
  {
    label: 'Docs',
    href: 'https://basis.vorion.org',
    external: true,
    description: 'BASIS — The Open Standard for AI Agent Governance',
  },
  {
    label: 'Demo',
    href: 'https://aurais.net',
    external: true,
    description: 'Aurais — Live governed AI agents in production',
  },
  {
    label: 'Learn',
    href: 'https://learn.vorion.org',
    external: true,
    description: 'Kaizen — Interactive AI governance education',
  },
  {
    label: 'Platform',
    href: 'https://agentanchorai.com',
    external: true,
    description: 'AgentAnchor — Enterprise governance platform',
  },
  {
    label: 'GitHub',
    href: 'https://github.com/vorionsys/vorion',
    external: true,
    description: 'Source code, issues, and contributions',
  },
  {
    label: 'Discord',
    href: 'https://discord.gg/k9tHbNvcX',
    external: true,
    description: 'Join the Vorion community',
  },
] as const;

/**
 * Social links used in footers and contact sections.
 */
export const SOCIAL_LINKS = {
  github: 'https://github.com/vorionsys',
  discord: 'https://discord.gg/k9tHbNvcX',
  twitter: 'https://x.com/VorionUS',
  linkedin: 'https://linkedin.com/company/vorion',
  email: 'mailto:hello@vorion.org',
} as const;

/**
 * Helper: filters the ecosystem strip to exclude the current site,
 * so the active site doesn't link to itself.
 *
 * @param currentDomain The hostname of the current site (e.g. 'vorion.org')
 * @returns Filtered ecosystem links excluding links to the current domain
 *
 * @example
 * ```ts
 * // On learn.vorion.org, exclude the "Learn" link
 * const links = getEcosystemLinksForSite('learn.vorion.org');
 * ```
 */
export function getEcosystemLinksForSite(currentDomain: string): EcosystemLink[] {
  return ECOSYSTEM_STRIP.filter((link) => {
    try {
      const url = new URL(link.href);
      return url.hostname !== currentDomain;
    } catch {
      // Relative URLs — always include
      return true;
    }
  });
}

// =============================================================================
// TYPE EXPORTS
// =============================================================================

export type SocialPlatform = keyof typeof SOCIAL_LINKS;
