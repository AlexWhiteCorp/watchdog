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
  --background: #303E4D;
  --panel: #2C3849;
  --main-font: #FFFFFF;
}

html, body {
  width: fit-content;
  height: fit-content;
  padding: 0;
  margin: 0;
  overflow: hidden;
}

#app {
  min-height: 500px;
  color: var(--main-font);
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: left;
}

.option-btn {
  display: flex;
  min-width: 30px;
  max-width: 30px;
  min-height: 30px;
  max-height: 30px;
  cursor: pointer;
}

.option-btn-icon {
  height: 12px;
  margin: auto;
}
</style>
