<template>
  <div class="delimiter"></div>
</template>

<script>
export default {
  name: 'MenuDelimiter'
}
</script>
<style scoped>
.delimiter {
  width: 100%;
  min-height: 1px;
  max-height: 1px;
  background: linear-gradient(to right, transparent, var(--main-font), transparent);;
}
</style>
