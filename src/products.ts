// SPDX-License-Identifier: Apache-2.0
// Copyright 2024-2026 Vorion LLC

/**
 * @vorionsys/shared-constants - Product Definitions
 *
 * Single source of truth for all Vorion ecosystem products
 * Used for consistent product references across all sites
 *
 * @see https://vorion.org
 */

// =============================================================================
// PRODUCT CATEGORIES
// =============================================================================

export enum ProductCategory {
  /** Open source standards and specifications */
  OPEN_SOURCE = 'open_source',

  /** Commercial SaaS products */
  COMMERCIAL = 'commercial',

  /** Developer tools and SDKs */
  DEVELOPER_TOOLS = 'developer_tools',

  /** Educational platforms */
  EDUCATION = 'education',
}

// =============================================================================
// PRODUCT STATUS
// =============================================================================

export enum ProductStatus {
  /** In active development, not yet released */
  DEVELOPMENT = 'development',

  /** Released as alpha/preview */
  ALPHA = 'alpha',

  /** Released as beta */
  BETA = 'beta',

  /** Generally available */
  GA = 'ga',

  /** Deprecated, still supported */
  DEPRECATED = 'deprecated',

  /** End of life, no longer supported */
  EOL = 'eol',
}

// =============================================================================
// PRODUCT DEFINITIONS
// =============================================================================

export interface ProductDefinition {
  /** Unique product identifier */
  id: string;

  /** Human-readable name */
  name: string;

  /** Short description */
  description: string;

  /** Product category */
  category: ProductCategory;

  /** Current status */
  status: ProductStatus;

  /** Primary website URL */
  url: string;

  /** Documentation URL */
  docsUrl?: string;

  /** GitHub repository URL */
  repoUrl?: string;

  /** NPM package name */
  npmPackage?: string;

  /** Parent organization */
  organization: 'vorion' | 'agentanchor';

  /** Version (semver) */
  version?: string;
}

// =============================================================================
// VORION OPEN SOURCE PRODUCTS
// =============================================================================

export const VORION_PRODUCTS: Record<string, ProductDefinition> = {
  basis: {
    id: 'basis',
    name: 'BASIS',
    description: 'Blockchain Agent Safety & Identity Standard - Open framework for AI agent governance',
    category: ProductCategory.OPEN_SOURCE,
    status: ProductStatus.GA,
    url: 'https://basis.vorion.org',
    docsUrl: 'https://basis.vorion.org/docs',
    repoUrl: 'https://github.com/vorionsys/vorion/tree/main/packages/basis',
    npmPackage: '@vorionsys/basis',
    organization: 'vorion',
    version: '1.0.0',
  },

  carId: {
    id: 'car-id',
    name: 'CAR ID',
    description: 'Categorical Agentic Registry - Universal agent identification system',
    category: ProductCategory.OPEN_SOURCE,
    status: ProductStatus.GA,
    url: 'https://carid.vorion.org',
    docsUrl: 'https://carid.vorion.org/docs',
    repoUrl: 'https://github.com/vorionsys/vorion/tree/main/packages/car-spec',
    npmPackage: '@vorionsys/car-spec',
    organization: 'vorion',
    version: '1.0.0',
  },

  atsf: {
    id: 'atsf',
    name: 'ATSF',
    description: 'Agent Trust & Safety Framework - Comprehensive safety evaluation system',
    category: ProductCategory.OPEN_SOURCE,
    status: ProductStatus.BETA,
    url: 'https://atsf.vorion.org',
    docsUrl: 'https://atsf.vorion.org/docs',
    repoUrl: 'https://github.com/vorionsys/vorion/tree/main/packages/atsf-core',
    npmPackage: '@vorionsys/atsf-core',
    organization: 'vorion',
    version: '0.9.0',
  },

  kaizen: {
    id: 'kaizen',
    name: 'Kaizen',
    description: 'Interactive AI Learning Experience - Educational platform for agentic AI',
    category: ProductCategory.EDUCATION,
    status: ProductStatus.BETA,
    url: 'https://learn.vorion.org',
    docsUrl: 'https://learn.vorion.org/docs',
    repoUrl: 'https://github.com/vorionsys/vorion/tree/main/kaizen',
    organization: 'vorion',
  },

  kaizenStudio: {
    id: 'kaizen-studio',
    name: 'Kaizen Studio',
    description: 'Interactive AI learning studio - hands-on agentic AI experiments',
    category: ProductCategory.EDUCATION,
    status: ProductStatus.BETA,
    url: 'https://kaizen.vorion.org',
    repoUrl: 'https://github.com/vorionsys/vorion/tree/main/kaizen',
    organization: 'vorion',
  },

  proofPlane: {
    id: 'proof-plane',
    name: 'Proof Plane',
    description: 'Cryptographic proof layer for agent attestations and verifiable execution',
    category: ProductCategory.OPEN_SOURCE,
    status: ProductStatus.BETA,
    url: 'https://vorion.org/proof-plane',
    repoUrl: 'https://github.com/vorionsys/vorion/tree/main/packages/proof-plane',
    npmPackage: '@vorionsys/proof-plane',
    organization: 'vorion',
    version: '0.5.0',
  },

  contracts: {
    id: 'contracts',
    name: 'Vorion Contracts',
    description: 'Smart contracts for on-chain agent governance and attestations',
    category: ProductCategory.OPEN_SOURCE,
    status: ProductStatus.BETA,
    url: 'https://vorion.org/contracts',
    repoUrl: 'https://github.com/vorionsys/vorion/tree/main/packages/contracts',
    npmPackage: '@vorionsys/contracts',
    organization: 'vorion',
  },

  council: {
    id: 'council',
    name: 'Council',
    description: 'Multi-agent orchestration pipeline with 17-step governance, compliance, QA, and cost tracking',
    category: ProductCategory.OPEN_SOURCE,
    status: ProductStatus.BETA,
    url: 'https://vorion.org/council',
    repoUrl: 'https://github.com/vorionsys/vorion/tree/main/packages/council',
    npmPackage: '@vorionsys/council',
    organization: 'vorion',
    version: '0.9.0',
  },

  a3i: {
    id: 'a3i',
    name: 'A3I',
    description: 'Agent orchestrator — intent lifecycle, authorization, execution, trust signals, and proof recording',
    category: ProductCategory.OPEN_SOURCE,
    status: ProductStatus.BETA,
    url: 'https://vorion.org/a3i',
    repoUrl: 'https://github.com/vorionsys/vorion/tree/main/packages/a3i',
    npmPackage: '@vorionsys/a3i',
    organization: 'vorion',
    version: '0.9.0',
  },

  aiGateway: {
    id: 'ai-gateway',
    name: 'AI Gateway',
    description: 'Multi-provider LLM gateway with routing, fallback, carbon tracking, and cost accounting',
    category: ProductCategory.OPEN_SOURCE,
    status: ProductStatus.BETA,
    url: 'https://vorion.org/ai-gateway',
    repoUrl: 'https://github.com/vorionsys/vorion/tree/main/packages/ai-gateway',
    npmPackage: '@vorionsys/ai-gateway',
    organization: 'vorion',
    version: '0.9.0',
  },

  runtime: {
    id: 'runtime',
    name: 'Runtime',
    description: 'TrustFacade, IntentPipeline, ProofCommitter, and SQLite-backed trust stores',
    category: ProductCategory.OPEN_SOURCE,
    status: ProductStatus.BETA,
    url: 'https://vorion.org/runtime',
    repoUrl: 'https://github.com/vorionsys/vorion/tree/main/packages/runtime',
    npmPackage: '@vorionsys/runtime',
    organization: 'vorion',
    version: '0.9.0',
  },

  platformCore: {
    id: 'platform-core',
    name: 'Platform Core',
    description: 'Trust engine, enforce, proof, governance, and persistence service layer',
    category: ProductCategory.OPEN_SOURCE,
    status: ProductStatus.BETA,
    url: 'https://vorion.org/platform-core',
    repoUrl: 'https://github.com/vorionsys/vorion/tree/main/packages/platform-core',
    npmPackage: '@vorionsys/platform-core',
    organization: 'vorion',
    version: '0.9.0',
  },

  n8nNodesCognigate: {
    id: 'n8n-nodes-cognigate',
    name: 'n8n Cognigate Nodes',
    description: 'No-code governance orchestration — 8 Cognigate API resources for n8n workflows',
    category: ProductCategory.DEVELOPER_TOOLS,
    status: ProductStatus.BETA,
    url: 'https://vorion.org/n8n',
    repoUrl: 'https://github.com/vorionsys/vorion/tree/main/packages/n8n-nodes-cognigate',
    npmPackage: '@vorionsys/n8n-nodes-cognigate',
    organization: 'vorion',
    version: '0.5.0',
  },
} as const;

// =============================================================================
// AGENT ANCHOR COMMERCIAL PRODUCTS
// =============================================================================

export const AGENTANCHOR_PRODUCTS: Record<string, ProductDefinition> = {
  cognigate: {
    id: 'cognigate',
    name: 'Cognigate',
    description: 'AI Governance API - Reference implementation of BASIS runtime',
    category: ProductCategory.COMMERCIAL,
    status: ProductStatus.GA,
    url: 'https://cognigate.dev',
    docsUrl: 'https://cognigate.dev/docs',
    npmPackage: '@vorionsys/cognigate',
    organization: 'agentanchor',
    version: '1.0.0',
  },

  trust: {
    id: 'trust',
    name: 'Agent Anchor Trust',
    description: 'Trust verification and certification platform for AI agents',
    category: ProductCategory.COMMERCIAL,
    status: ProductStatus.GA,
    url: 'https://trust.agentanchorai.com',
    docsUrl: 'https://trust.agentanchorai.com/docs',
    organization: 'agentanchor',
  },

  logic: {
    id: 'logic',
    name: 'Agent Anchor Logic',
    description: 'Policy engine and governance logic for enterprise AI',
    category: ProductCategory.COMMERCIAL,
    status: ProductStatus.BETA,
    url: 'https://logic.agentanchorai.com',
    docsUrl: 'https://logic.agentanchorai.com/docs',
    organization: 'agentanchor',
  },

  platform: {
    id: 'platform',
    name: 'Agent Anchor Platform',
    description: 'Enterprise AI governance dashboard and management console',
    category: ProductCategory.COMMERCIAL,
    status: ProductStatus.GA,
    url: 'https://agentanchorai.com',
    docsUrl: 'https://agentanchorai.com/docs',
    organization: 'agentanchor',
  },
} as const;

// =============================================================================
// ALL PRODUCTS
// =============================================================================

export const ALL_PRODUCTS = {
  vorion: VORION_PRODUCTS,
  agentAnchor: AGENTANCHOR_PRODUCTS,
} as const;

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Get a product by its ID
 */
export function getProduct(productId: string): ProductDefinition | undefined {
  return (
    VORION_PRODUCTS[productId] ||
    AGENTANCHOR_PRODUCTS[productId]
  );
}

/**
 * Get all products by category
 */
export function getProductsByCategory(category: ProductCategory): ProductDefinition[] {
  const allProducts = [...Object.values(VORION_PRODUCTS), ...Object.values(AGENTANCHOR_PRODUCTS)];
  return allProducts.filter(p => p.category === category);
}

/**
 * Get all products by status
 */
export function getProductsByStatus(status: ProductStatus): ProductDefinition[] {
  const allProducts = [...Object.values(VORION_PRODUCTS), ...Object.values(AGENTANCHOR_PRODUCTS)];
  return allProducts.filter(p => p.status === status);
}

/**
 * Get all products by organization
 */
export function getProductsByOrganization(org: 'vorion' | 'agentanchor'): ProductDefinition[] {
  return org === 'vorion'
    ? Object.values(VORION_PRODUCTS)
    : Object.values(AGENTANCHOR_PRODUCTS);
}
