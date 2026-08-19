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
        "background-base": "var(--color-background-base)",
        "background-component": "var(--color-background-component)",
        "background-container": "var(--color-background-container)",
        "content-primary": "var(--color-content-primary)",
        "content-secondary": "var(--color-content-secondary)",
        "content-tertiary": "var(--color-content-tertiary)",
        "content-disabled": "var(--color-content-disabled)",
        "brand-foreground": "var(--color-brand-foreground)",
        "brand-transparent": "var(--color-brand-transparent)",
        "container-border": "var(--color-container-border)",
      },
      borderRadius: { control: "var(--radius-control)", card: "var(--radius-card)" },
      boxShadow: { card: "var(--shadow-card)" },
      zIndex: { toast: "var(--z-toast)", modal: "var(--z-modal)" },
    },
  },
  plugins: [forms],
} satisfies Config;
