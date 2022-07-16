<template>
  <div class="menu-item-wrapper" @click="openInBrowser">
    <slot></slot>
  </div>
</template>
<script>
export default {
  name: 'MenuItem',
  props: {
    url: String
  },
  methods: {
    openInBrowser: function () {
      if(this.url) {
        window.openInBrowser(this.url)
      }
    }
  }
}
</script>
<style scoped>
.menu-item-wrapper {
  padding: 5px 15px;
  cursor: pointer;

  font-size: 14px;
}

.menu-item-wrapper:hover {
  background: var(--panel);
}
</style>
