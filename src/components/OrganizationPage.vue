<template>
  <div class="organization-page-wrapper">
    <template v-for="repoGroup in org.groups" :key="repoGroup.repositories[0]">
      <repos-group :organization="org" :repoGroup="repoGroup"></repos-group>
      <menu-delimiter class="delimiter"></menu-delimiter>
    </template>
  </div>
</template>

<script>
import ReposGroup from "@/components/ReposGroup";
import MenuDelimiter from "@/components/MenuDelimiter";
import {GitOrganization} from "@/models/Git.model";

export default {
  name: 'OrganizationPage',
  props: {
    org: GitOrganization
  },
  components: {
    'repos-group': ReposGroup,
    'menu-delimiter': MenuDelimiter
  }
}
</script>
<style scoped>
</style>
