import type { NextConfig } from "next";

function normalizeBasePath(value: string | undefined): string {
  if (!value || value === "/") {
    return "";
  }

  const withLeadingSlash = value.startsWith("/") ? value : `/${value}`;
  return withLeadingSlash.replace(/\/+$/, "");
}

function getGitHubPagesBasePath(): string {
  const repository = process.env.GITHUB_REPOSITORY;
  const repositoryOwner = process.env.GITHUB_REPOSITORY_OWNER;

  if (!repository) {
    return "";
  }

  const [, repositoryName = ""] = repository.split("/");
  const ownerName = (repositoryOwner || repository.split("/")[0] || "").toLowerCase();
  const normalizedRepositoryName = repositoryName.toLowerCase();

  if (!repositoryName || normalizedRepositoryName === `${ownerName}.github.io`) {
    return "";
  }

  return `/${repositoryName}`;
}

const basePath = normalizeBasePath(
  process.env.PRISM_BASE_PATH ||
  (process.env.GITHUB_ACTIONS === "true" ? getGitHubPagesBasePath() : undefined)
);

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  basePath,
  assetPrefix: basePath || undefined,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
  images: {
    unoptimized: true,
  },
  /* config options here */
  webpack: (config) => {
    config.module.rules.push({
      test: /\.bib$/,
      type: 'asset/source',
    });
    return config;
  },
};

export default nextConfig;
