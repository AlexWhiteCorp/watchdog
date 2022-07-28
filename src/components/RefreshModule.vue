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
import {isAllApproved} from "@/utils/gitUtils";
import GitServiceFactory from "@/services/GitServiceFactory";
import {OrganizationConfig} from "@/models/Config.model";
import ModelMapper from "@/utils/ModelMapper";

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
    'onRefreshed': Function
  },
  methods: {
    pause(e) {
      this.isPaused = true

      e.stopPropagation()
    },
    resume(e) {
      this.isPaused = false
      this.loadReposInfo()

      e.stopPropagation()
    },

    loadReposInfo: async function () {
      if (this.isPaused) {
        return
      }

      const organizations = await Promise.all(
          config.organizations.map(async (orgInfo) => {
            const gitService = await GitServiceFactory.getInstance(orgInfo)
            return gitService.getOrganization(orgInfo)
          })
      )

      this.onRefreshed(organizations)
      this.updateAppIconStatus(organizations)

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
        config = {
          organizations: data.organizations.map(org => ModelMapper.map(org, OrganizationConfig)),
          ...config
        }
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
