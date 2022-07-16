<template>
  <div class="organization-page-wrapper">
    <template v-for="repoGroup in org.repositories" :key="repoGroup[0]">
      <repos-group :organization="org" :repos="repoGroup"></repos-group>
      <menu-delimiter class="delimiter"></menu-delimiter>
    </template>
  </div>
</template>

<script>
import ReposGroup from "@/components/ReposGroup";
import MenuDelimiter from "@/components/MenuDelimiter";

export default {
  name: 'OrganizationPage',
  props: {
    org: Object
  },
  components: {
    'repos-group': ReposGroup,
    'menu-delimiter': MenuDelimiter
  }
}
</script>
<style scoped>
</style>
