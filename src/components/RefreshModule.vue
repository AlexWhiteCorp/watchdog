<template>
  <div class="refresh-module-wrapper">
    <div v-if="isPaused" @click="resume"
         class="option-btn" title="Resume refreshing">
      <img class="option-btn-icon" src="buttons/play.png" alt="NotFound">
    </div>
    <div v-else @click="pause"
         class="option-btn" title="Pause refreshing">
      <img class="option-btn-icon" src="buttons/pause.png" alt="NotFound">
    </div>
  </div>
</template>

<script>
import GitHubService from "@/services/GitHubService";
import {isAllApproved} from "@/utils";

const REFRESH_DELAY = 5 * 60 * 1000
let config = null

export default {
  name: 'RefreshModule',
  data: function () {
    return {
      isPaused: false
    }
  },
  props: {
    'onRefreshScheduled': Function,
    'onPause': Function,
    'onRefreshed': Function
  },
  methods: {
    pause(e) {
      this.isPaused = true
      this.onPause()

      e.stopPropagation()
    },
    resume(e) {
      this.isPaused = false
      this.loadReposInfo()

      e.stopPropagation()
    },

    loadReposInfo: async function () {
      if(this.isPaused) {
        return
      }

      const organizations = await Promise.all(
          config.organizations.map(async (orgInfo) => {
            const githubService = await GitHubService.getInstance(orgInfo)
            return githubService.getOrganization(orgInfo)
          })
      )

      this.onRefreshed(organizations)
      this.updateAppIconStatus(organizations)

      this.onRefreshScheduled()
      setTimeout(() => {
        this.loadReposInfo()
      }, REFRESH_DELAY)
    },
    updateAppIconStatus(organizations) {
      if (!organizations || !organizations.length) {
        window.setAppIcon('BLACK')
      }

      if (isAllApproved(organizations)) {
        window.setAppIcon('BLACK')
      } else {
        window.setAppIcon('BLUE')
      }
    },
  },
  created() {
    window.loadConfigs((err, data) => {
      if (!err) {
        config = data
        this.loadReposInfo()
      } else {
        this.onRefreshed(null, err)
      }
    });
  }
}
</script>
<style scoped>
.refresh-module-wrapper {
}
</style>
