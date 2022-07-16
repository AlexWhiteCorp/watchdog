<template>
  <div class="header-wrapper" ref="header">
    <div class="header-title">
      <menu-item url="https://github.com/AlexWhiteCorp/gh-watchdog">
        WatchDog
      </menu-item>
    </div>
  </div>
</template>

<script>
import MenuItem from "@/components/MenuItem";

export default {
  name: 'MainMenuHeader',
  components: {
    'menu-item': MenuItem
  }
}
</script>
<style scoped>
.header-wrapper {
  display: grid;
  grid-template-columns: auto 100px auto;
  grid-template-areas: ". title .";
  background: var(--panel);
}

.header-title {
  grid-area: title;

  text-align: center;
  font-weight: bold;
  font-size: 16px;
}
</style>
