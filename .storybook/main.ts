import type { StorybookConfig } from '@storybook/react-vite';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

const config: StorybookConfig = {
  // MDX glob removed — all docs are TSX-based stories (Introduction.stories.tsx,
  // DesignTokens.stories.tsx). Keeping .mdx here would cause build failures if
  // any legacy .mdx file with old Storybook 7/8 imports (Meta from addon-docs)
  // exists in git history and gets checked out in CI.
  "stories": [
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  "addons": [
    "@chromatic-com/storybook",
    "@storybook/addon-vitest",
    "@storybook/addon-a11y",
    "@storybook/addon-themes",
    "@storybook/addon-docs",
    "@storybook/addon-onboarding",
    "@storybook/addon-mcp"
  ],
  "framework": "@storybook/react-vite",
  async viteFinal(config) {
    if (!config.resolve) config.resolve = {};
    if (!config.resolve.alias) config.resolve.alias = {};
    (config.resolve.alias as any)["@ui"] = path.resolve(process.cwd(), "src/components/ui");

    // Tailwind v4: inject the Vite plugin so @theme blocks are compiled into
    // proper CSS custom properties and all utility classes are generated.
    if (!config.plugins) config.plugins = [];
    config.plugins.unshift(tailwindcss());

    // Tailwind v4 uses the @theme at-rule which LightningCSS does not recognise.
    // Switch to esbuild so the production build doesn't fail on unknown at-rules.
    config.build = {
      ...config.build,
      cssMinify: 'esbuild' as const,
    };

    return config;
  }
};
export default config;