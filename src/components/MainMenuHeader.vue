<template>
  <div class="header-wrapper" ref="header">
    <div class="header-options header-options-left">
      <updates-center></updates-center>
    </div>
    <div class="header-title">
      <menu-item url="https://github.com/AlexWhiteCorp/gh-watchdog">
        WatchDog
      </menu-item>
    </div>
    <div class="header-options header-options-right">
      <refresh-module :onRefreshed="onRefreshed"></refresh-module>
    </div>
  </div>
</template>

<script>
import MenuItem from "@/components/MenuItem";
import RefreshModule from "@/components/RefreshModule";
import UpdatesCenter from "@/components/UpdatesCenter";

export default {
  name: 'MainMenuHeader',
  props: {
    'onRefreshed': Function
  },
  components: {
    'menu-item': MenuItem,
    'refresh-module': RefreshModule,
    'updates-center': UpdatesCenter
  }
}
</script>
<style scoped>
.header-wrapper {
  display: grid;
  grid-template-columns: max-content auto 100px auto max-content;
  grid-template-areas: "options-left . title . options-right";
  background: var(--panel);
}

.header-title {
  grid-area: title;

  text-align: center;
  font-weight: bold;
  font-size: 16px;
}

.header-options {
  width: fit-content;
  min-width: 70px;
  margin-left: auto;
}

.header-options-left {
  grid-area: options-left;
  margin-left: 10px;
}

.header-options-right {
  grid-area: options-right;
  display: flex;
  flex-direction: row-reverse;
  margin-right: 10px;
}
</style>
