<template>
  <div v-if="repoGroup && repoGroup.repositories.length" class="repos-group">
    <template v-for="repo in repoGroup.repositories" :key="repo.getName()">
      <repo-item :organization="organization" :repo="repo"></repo-item>
    </template>
  </div>
  <div v-else class="repos-group-empty">Loading repositories...</div>
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
    padding: 4px 0;
  }

  .repos-group-empty {
    text-align: center;
    color: var(--fg-secondary);
    padding: 8px 12px;
    font-size: 12px;
  }
</style>
