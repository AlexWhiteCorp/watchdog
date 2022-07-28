<template>
  <div v-if="repoGroup && repoGroup.repositories.length" class="repos-group">
    <template v-for="repo in repoGroup.repositories" :key="repo.getName()">
      <repo-item :organization="organization" :repo="repo"></repo-item>
    </template>
  </div>
  <div v-else style="text-align: center">Loading repositories...</div>
</template>

<script>
import RepoItem from "@/components/RepoItem";
import {GitOrganization, RepositoriesGroup} from "@/models/Git.model";

export default {
  name: 'ReposGroup',
  components: {
    'repo-item': RepoItem
  },
  props: {
    organization: GitOrganization,
    repoGroup: RepositoriesGroup
  }
}
</script>
<style scoped>
  .repos-group {
    padding: 5px 0;
  }
</style>
