<template>
  <div class="repo-menu-wrapper">
    <template v-for="(pr, i) in repo.pullRequests" :key="pr.number">
      <menu-item :url="pr.html_url">
        <pull-request :org="organization" :pr="pr"></pull-request>
      </menu-item>
      <menu-delimiter v-if="i !== repo.pullRequests.length - 1" class="delimiter"></menu-delimiter>
    </template>
  </div>
</template>

<script>
import MenuItem from "@/components/MenuItem";
import PullRequest from "@/components/PullRequest";
import Delimiter from "@/components/MenuDelimiter";
import {GHRepo} from "@/models/GitHubModels";

export default {
  name: 'RepoMenu',
  props: {
    organization: Object,
    repo: GHRepo
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
