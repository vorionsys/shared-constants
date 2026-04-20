// SPDX-License-Identifier: Apache-2.0
// Copyright 2024-2026 Vorion LLC

import { describe, it, expect } from 'vitest';
import {
  ECOSYSTEM_STRIP,
  SOCIAL_LINKS,
  getEcosystemLinksForSite,
} from './ecosystem-nav';

describe('ecosystem-nav', () => {
  describe('ECOSYSTEM_STRIP', () => {
    it('should have all expected ecosystem sites', () => {
      const labels = ECOSYSTEM_STRIP.map((l) => l.label);
      expect(labels).toContain('Home');
      expect(labels).toContain('Docs');
      expect(labels).toContain('Demo');
      expect(labels).toContain('Learn');
      expect(labels).toContain('Platform');
      expect(labels).toContain('GitHub');
      expect(labels).toContain('Discord');
    });

    it('should have valid URLs for all links', () => {
      for (const link of ECOSYSTEM_STRIP) {
        expect(() => new URL(link.href)).not.toThrow();
      }
    });

    it('should mark all links as external', () => {
      for (const link of ECOSYSTEM_STRIP) {
        expect(link.external).toBe(true);
      }
    });

    it('should use HTTPS for all links', () => {
      for (const link of ECOSYSTEM_STRIP) {
        expect(link.href).toMatch(/^https:\/\//);
      }
    });

    it('should use canonical Discord URL', () => {
      const discordLink = ECOSYSTEM_STRIP.find((l) => l.label === 'Discord');
      expect(discordLink?.href).toBe('https://discord.gg/k9tHbNvcX');
    });

    it('should have unique labels', () => {
      const labels = ECOSYSTEM_STRIP.map((l) => l.label);
      expect(new Set(labels).size).toBe(labels.length);
    });

    it('should have unique URLs', () => {
      const hrefs = ECOSYSTEM_STRIP.map((l) => l.href);
      expect(new Set(hrefs).size).toBe(hrefs.length);
    });
  });

  describe('SOCIAL_LINKS', () => {
    it('should have all expected social platforms', () => {
      expect(SOCIAL_LINKS).toHaveProperty('github');
      expect(SOCIAL_LINKS).toHaveProperty('discord');
      expect(SOCIAL_LINKS).toHaveProperty('twitter');
      expect(SOCIAL_LINKS).toHaveProperty('linkedin');
      expect(SOCIAL_LINKS).toHaveProperty('email');
    });

    it('should use canonical Discord URL', () => {
      expect(SOCIAL_LINKS.discord).toBe('https://discord.gg/k9tHbNvcX');
    });
  });

  describe('getEcosystemLinksForSite', () => {
    it('should exclude the current domain', () => {
      const links = getEcosystemLinksForSite('vorion.org');
      const labels = links.map((l) => l.label);
      expect(labels).not.toContain('Home');
      expect(labels).toContain('Docs');
      expect(labels).toContain('Discord');
    });

    it('should exclude learn.vorion.org when on that domain', () => {
      const links = getEcosystemLinksForSite('learn.vorion.org');
      const labels = links.map((l) => l.label);
      expect(labels).not.toContain('Learn');
      expect(labels).toContain('Home');
    });

    it('should return all links for unknown domain', () => {
      const links = getEcosystemLinksForSite('example.com');
      expect(links.length).toBe(ECOSYSTEM_STRIP.length);
    });

    it('should return all links for empty domain', () => {
      const links = getEcosystemLinksForSite('');
      expect(links.length).toBe(ECOSYSTEM_STRIP.length);
    });
  });
});
