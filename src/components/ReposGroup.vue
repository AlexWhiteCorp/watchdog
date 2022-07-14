<template>
  <div v-if="repos && repos.length" class="repos-group">
    <template v-for="repo in repos" :key="repo.getName()">
      <repo-item :organization="organization" :repo="repo"></repo-item>
    </template>
  </div>
  <div v-else>Loading repositories...</div>
</template>

<script>
import RepoItem from "@/components/RepoItem";

export default {
  name: 'ReposGroup',
  components: {
    'repo-item': RepoItem
  },
  props: {
    organization: Object,
    repos: Array
  }
}
</script>
<style scoped>
  .repos-group {
    padding: 5px 0;
  }
</style>
