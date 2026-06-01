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
  padding: 5px 10px;
  margin: 1px 6px;
  border-radius: var(--radius-md);
  cursor: pointer;
  font-size: 13px;
  transition: background-color 0.08s ease-out, color 0.08s ease-out;
}

.menu-item-wrapper:hover {
  background: var(--bg-selected);
  color: var(--fg-on-accent);
}
</style>
