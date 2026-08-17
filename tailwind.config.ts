import type { Config } from "tailwindcss";
import forms from "@tailwindcss/forms";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        canvas: "var(--color-canvas)",
        surface: "var(--color-surface)",
        primary: "var(--color-primary)",
        text: "var(--color-text)",
        muted: "var(--color-text-muted)",
        danger: "var(--color-danger)",
        border: "var(--color-border)",
      },
      borderRadius: { control: "var(--radius-control)", card: "var(--radius-card)" },
      boxShadow: { card: "var(--shadow-card)" },
      zIndex: { toast: "var(--z-toast)", modal: "var(--z-modal)" },
    },
  },
  plugins: [forms],
} satisfies Config;
