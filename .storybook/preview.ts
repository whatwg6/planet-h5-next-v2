import type { Preview } from "@storybook/react-vite";
import "../src/shared/styles/global.css";

const preview: Preview = {
  parameters: {
    a11y: { test: "todo" },
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } },
    viewport: { defaultViewport: "mobile1" },
  },
};

export default preview;
