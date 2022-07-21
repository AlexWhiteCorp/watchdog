<template>
  <div class="header-wrapper" ref="header">
    <div class="header-options header-options-left">
      <updates-center></updates-center>
    </div>
    <div class="header-title">
      <menu-item url="https://alexwhitecorp.github.io/watchdog">
        WatchDog
      </menu-item>
    </div>
    <div class="header-options header-options-right">
      <refresh-module :onRefreshScheduled="onRefreshScheduled"
                      :onRefreshed="onRefreshed$Proxy"
                      :onPause="onPause"></refresh-module>
    </div>
    <div ref="refresh-await-progress-bar" class="refresh-await-progress-bar"></div>
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
  computed: {
  },
  components: {
    'menu-item': MenuItem,
    'refresh-module': RefreshModule,
    'updates-center': UpdatesCenter
  },
  methods: {
    onRefreshed$Proxy: function (data) {
      this.$refs['refresh-await-progress-bar'].classList.remove('refresh-await-progress-bar-animation');
      this.onRefreshed(data)
    },
    onPause: function () {
      this.$refs['refresh-await-progress-bar'].classList.remove('refresh-await-progress-bar-animation');
    },
    onRefreshScheduled: function () {
      setTimeout(() => {
        this.$refs['refresh-await-progress-bar'].classList.add('refresh-await-progress-bar-animation');
      }, 200)
    }
  }
}
</script>
<style scoped>
.header-wrapper {
  display: grid;
  grid-template-columns: max-content auto 100px auto max-content;
  grid-template-areas: "options-left . title . options-right";
  position: relative;
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

.refresh-await-progress-bar {
  position: absolute;
  left: 0;
  bottom: 0;
  background: var(--main-font);
  opacity: 0.3;
  height: 1px;
  width: 0%;
}

.refresh-await-progress-bar-animation {
  -webkit-transition: width 300s ease-in-out;
  -moz-transition: width 300s ease-in-out;
  -o-transition: width 300s ease-in-out;
  transition: width 300s ease-in-out;

  width: 100%;
}
</style>
