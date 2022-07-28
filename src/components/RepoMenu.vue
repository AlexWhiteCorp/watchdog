<template>
  <div class="repo-menu-wrapper">
    <template v-for="(pr, i) in repo.getPullRequests()" :key="pr.getId()">
      <menu-item :url="pr.getUrl()">
        <pull-request :org="organization" :pr="pr"></pull-request>
      </menu-item>
      <menu-delimiter v-if="i !== repo.getPullRequests().length - 1" class="delimiter"></menu-delimiter>
    </template>
  </div>
</template>

<script>
import MenuItem from "@/components/MenuItem";
import PullRequest from "@/components/PullRequest";
import Delimiter from "@/components/MenuDelimiter";
import {GitOrganization, GitRepository} from "@/models/Git.model";

export default {
  name: 'RepoMenu',
  props: {
    organization: GitOrganization,
    repo: GitRepository
  },
  components: {
    'menu-item': MenuItem,
    'pull-request': PullRequest,
    'menu-delimiter': Delimiter
  },
  mounted() {
    const windowHeight = window.innerHeight
    const elBottom = this.$el.getBoundingClientRect().bottom
    if(elBottom > windowHeight) {
      const diff = elBottom - windowHeight;
      this.$el.style.top = -(diff + 5) + 'px'
    }
  }
}
</script>
<style scoped>
.repo-menu-wrapper {
  position: absolute;
  right: calc(100% - 10px);
  top: -5px;
  background: var(--background);
  width: fit-content;
  border: 1px solid var(--panel);
}
</style>
