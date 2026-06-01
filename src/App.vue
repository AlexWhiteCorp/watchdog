<template>
  <main-menu></main-menu>
</template>

<script>
import MainMenu from "@/components/MainMenu";

export default {
  name: 'App',
  components: {
    'main-menu': MainMenu
  }
}
</script>

<style>
:root {
  --bg-canvas: #1c1c1e;
  --bg-canvas-highlight: linear-gradient(180deg, rgba(255, 255, 255, 0.06), transparent 80px);
  --bg-header: rgba(255, 255, 255, 0.04);
  --bg-popover: rgba(48, 48, 52, 0.72);
  --bg-hover: rgba(255, 255, 255, 0.08);
  --bg-selected: rgba(10, 132, 255, 0.85);
  --fg-primary: rgba(255, 255, 255, 0.92);
  --fg-secondary: rgba(255, 255, 255, 0.55);
  --fg-on-accent: #ffffff;
  --separator: rgba(255, 255, 255, 0.08);
  --radius-sm: 4px;
  --radius-md: 6px;
  --radius-lg: 10px;
  --font-stack: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI",
                system-ui, Helvetica, Arial, sans-serif;
  --shadow-popover: 0 12px 32px rgba(0, 0, 0, 0.45),
                    0 0 0 0.5px rgba(255, 255, 255, 0.08);
}

html, body {
  width: fit-content;
  height: fit-content;
  padding: 0;
  margin: 0;
  overflow: hidden;
  background: transparent;
}

#app {
  min-height: 500px;
  color: var(--fg-primary);
  font-family: var(--font-stack);
  font-size: 13px;
  letter-spacing: -0.01em;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: left;
}

.option-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 26px;
  max-width: 26px;
  min-height: 26px;
  max-height: 26px;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: background-color 0.08s ease-out;
}

.option-btn:hover {
  background: var(--bg-hover);
}

.option-btn-icon {
  height: 12px;
  margin: auto;
}
</style>
