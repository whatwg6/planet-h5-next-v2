import type { VitePluginSvgrOptions } from "vite-plugin-svgr";

export const svgrOptions = {
  include: "**/*.svg?react",
  svgrOptions: {
    icon: true,
    plugins: ["@svgr/plugin-svgo", "@svgr/plugin-jsx"],
    svgoConfig: {
      plugins: [
        {
          name: "preset-default",
          params: { overrides: { removeViewBox: false } },
        },
        {
          name: "convertColors",
          params: { currentColor: true },
        },
        {
          name: "removeAttrs",
          params: { attrs: ["fill-opacity", "stroke-opacity"] },
        },
      ],
    },
  },
} satisfies VitePluginSvgrOptions;
