<template>
  <div v-if="repo" class="menu-item-wrapper" :ref="repo.getName()"
       @mouseover="onMouseOver"
       @mouseleave="onMouseLeave"
       @click="showRepoInfo = false">
    <menu-item class="menu-item-title-wrapper" :url="repo.html_url" title="Click to open in Browser">
      <div v-if="totalPRs" class="repo-stat"
           title="approved PRs/total opened PRs">({{ approvedPRs }}/{{totalPRs}})</div>
      <div class="repo-name" >{{ title }}</div>
    </menu-item>
    <template v-if="!repo.notFound && repo.pullRequests.length !== 0" >
      <repo-menu v-if="showRepoInfo" :organization="organization" :repo="repo"></repo-menu>
    </template>
  </div>
</template>

<script>
import RepoMenu from "@/components/RepoMenu";
import MenuItem from "@/components/MenuItem";

export default {
  name: 'RepoItem',
  props: {
    organization: Object,
    repo: Object
  },
  components: {
    'repo-menu': RepoMenu,
    'menu-item': MenuItem
  },
  data: function () {
    return {
      showRepoInfo: false,
      mouseLeave: true
    }
  },
  computed: {
    title: function () {
      if(!this.repo.notFound) {
        return this.repo.getName()
      }

      return this.repo.getName() + ' [Not Found]'
    },
    totalPRs: function () {
      return this.repo.pullRequests.length
    },
    approvedPRs: function () {
      return this.repo.pullRequests
          .filter(pr => pr.isApproved())
          .length
    }
  },
  methods: {
    onMouseOver: function () {
      this.mouseLeave = false
      setTimeout(() => {
        if(!this.mouseLeave) {
          this.showRepoInfo = true
        }
      }, 150)
    },
    onMouseLeave: function () {
      this.showRepoInfo = false
      this.mouseLeave = true
    }
  }
}
</script>
<style scoped>
.menu-item-wrapper {
  position: relative;
}

.menu-item-title-wrapper {
  display: grid;
  grid-template-areas: "stat name";
  grid-template-columns: 40px auto;
  padding: 2px 10px;
  cursor: default;

  font-size: 14px;
}

.menu-item-title-wrapper:hover {
  background: var(--panel);
}

.repo-stat {
  grid-area: stat;
}

.repo-name {
  grid-area: name;
  cursor: pointer;

  white-space: nowrap;
}
</style>
