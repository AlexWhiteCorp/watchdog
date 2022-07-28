<template>
  <div class="refresh-module-wrapper">
    <div v-if="isNewVersionAvailable" @click="onButtonClick"
        class="option-btn" title="New version available. Click to visit download page">
      <img class="option-btn-icon icon" src="buttons/update.png" alt="NotFound">
    </div>
  </div>
</template>

<script>
import UpdateService from "@/services/UpdateService";

const DOWNLOAD_URL = 'https://alexwhitecorp.github.io/watchdog/#download'

const CHECK_DELAY = 60 * 60 * 1000

export default {
  name: 'UpdateModule',
  data: function () {
    return {
      isNewVersionAvailable: false
    }
  },
  methods: {
    onButtonClick() {
      window.openInBrowser(DOWNLOAD_URL)
    },
    checkUpdates() {
      UpdateService.checkUpdates()
          .then(isNewVersionAvailable => {
            this.isNewVersionAvailable = isNewVersionAvailable

            if(isNewVersionAvailable) {
              window.showNotification('', 'New version available!')
            } else {
              setTimeout(() => {
                this.checkUpdates()
              }, CHECK_DELAY)
            }
          })
    }
  },
  created() {
    this.checkUpdates()
  }
}
</script>
<style scoped>
.icon {
  height: 16px;
}
</style>