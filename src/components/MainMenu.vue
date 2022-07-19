<template>
  <div id="app" class="main-wrapper" :class="winPossRelatedStyles"
       ref="app" @click="hideMenu">
    <div class="main-menu">
      <menu-header></menu-header>

      <template v-if="organizations && organizations.length">
        <menu-navbar v-if="!isBottomPosition()"
                     :items="organizations"
                     :getItemTitle="getItemTitle"
                     :onItemTitleClick="onItemTitleClick"
                     :onActiveItemChanged="onItemChange"></menu-navbar>
        <menu-delimiter></menu-delimiter>
        <organization-page v-if="currOrg && !currOrg.credsError" :org="currOrg"></organization-page>
        <menu-navbar v-if="isBottomPosition()"
                     :items="organizations"
                     :getItemTitle="getItemTitle"
                     :onItemTitleClick="onItemTitleClick"
                     :onActiveItemChanged="onItemChange"></menu-navbar>
      </template>

      <menu-item v-else-if="!errMsg" class="menu-item-default">Loading info...</menu-item>
      <menu-item v-if="errMsg" class="menu-item-default">{{ errMsg }}</menu-item>
      <menu-item v-if="currOrg && currOrg.credsError" class="menu-item-default">
        Can't load repositories. <br>
        Your access token is not valid or expired <br>
        Check your token and reload app
      </menu-item>
      <menu-item @click="quit" class="menu-item-default menu-item-quit">Quit</menu-item>
    </div>
  </div>
</template>

<script>
import MenuHeader from "@/components/MainMenuHeader";
import MenuItem from "@/components/MenuItem";
import OrganizationPage from "@/components/OrganizationPage";
import MenuDelimiter from "@/components/MenuDelimiter";
import MenuNavbar from "@/components/MenuNavbar";
import GitHubService from "@/services/GitHubService";
import {isAllApproved, isMac, isWindows} from "@/utils";

const GITHUB_URL = 'https://github.com/'

export default {
  name: 'App',
  data: function () {
    return {
      organizations: [],
      currOrgIndex: 0,
      errMsg: null,
      trayPosition: isWindows() ? 'BOTTOM_RIGHT' : (isMac() ? 'TOP_RIGHT' : null)
    }
  },
  components: {
    'menu-header': MenuHeader,
    'menu-item': MenuItem,
    'menu-navbar': MenuNavbar,
    'organization-page': OrganizationPage,
    'menu-delimiter': MenuDelimiter
  },
  computed: {
    winPossRelatedStyles() {
      if(this.isBottomPosition()) {
        return 'window-position-bottom'
      }

      return ''
    },
    currOrg() {
      if(this.organizations && this.organizations.length) {
        return this.organizations[this.currOrgIndex]
      }

      return null
    }
  },
  methods: {
    isBottomPosition: function () {
      return this.trayPosition === 'BOTTOM_RIGHT'
    },
    /*Nav Bar*/
    getItemTitle: function (item) {
      return item.organization
    },
    onItemTitleClick: function (item) {
      return GITHUB_URL + item.organization
    },
    onItemChange: function (currOrgIndex) {
      this.currOrgIndex = currOrgIndex
      this.resizeWindow()
    },
    /*Nav Bar*/
    loadReposInfo: async function (config) {
      const organizations = await Promise.all(
          config.organizations.map(async (orgInfo) => {
            const githubService = await GitHubService.getInstance(orgInfo)
            return githubService.getOrganization(orgInfo)
          })
      )

      this.organizations = []
      this.organizations = organizations
      this.updateAppIconStatus()

      setTimeout(() => {
        this.loadReposInfo(config)
      }, 30 * 1000)
    },
    updateAppIconStatus: function () {
      if (!this.organizations || !this.organizations.length) {
        window.setAppIcon('BLACK')
      }

      if (isAllApproved(this.organizations)) {
        window.setAppIcon('BLACK')
      } else {
        window.setAppIcon('BLUE')
      }
    },

    resizeWindow: function () {
      const bounds = this.$el.getBoundingClientRect()
      window.setSize(bounds.width, bounds.height, 500)
    },
    hideMenu: function () {
      window.hideWindow()
    },
    quit: function (e) {
      e.stopPropagation()
      window.quitApp()
    }
  },
  updated() {
    this.resizeWindow()
  },
  mounted() {
    setTimeout(() => {
      window.getTrayPosition()
          .then(pos => {
            this.trayPosition = pos
          })
    }, 200)

    window.loadConfigs((err, data) => {
      if (!err) {
        this.loadReposInfo(data)
      } else {
        this.errMsg = err
      }
    });
  }
}
</script>
<style scoped>
.main-wrapper {
  display: grid;
  grid-template-columns: 350px auto;
  grid-template-rows: max-content;
  grid-template-areas: "repo-info main-menu";
}

.window-position-bottom {
  grid-template-rows: auto max-content;
  grid-template-areas: ". ." "repo-info main-menu";
}

.main-menu {
  grid-area: main-menu;
  background-color: var(--background);
}

.menu-item-default {
  text-align: center;
}

.menu-item-quit {
  font-size: 13px;
  line-height: 13px
}
</style>
