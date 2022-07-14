<template>
  <div id="app" class="main-wrapper" :class="winPossRelatedStyles"
       ref="app" @click="hideMenu">
    <div class="main-menu">
      <menu-header></menu-header>

      <template v-if="organizations && organizations.length">
        <menu-navbar :organizations="organizations" :onOrgChange="onOrgChange"></menu-navbar>
        <menu-delimiter></menu-delimiter>
        <organization-page v-if="currOrg && !currOrg.credsError" :org="currOrg"></organization-page>
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
import {isAllApproved} from "@/utils";

const services = {}

export default {
  name: 'App',
  data: function () {
    return {
      organizations: [],
      currOrg: null,
      errMsg: null
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
      if(window.isTrayBottom()) {
        return 'window-position-bottom'
      }

      return ''
    }
  },
  methods: {
    onOrgChange: function (currOrg) {
      this.currOrg = currOrg
      this.resizeWindow()
    },
    loadReposInfo: async function (config) {
      const organizations = await Promise.all(
          config.organizations.map(async (orgInfo) => {
            const githubService = await this.getGHService(orgInfo)
            console.log(githubService.authUser)
            if (githubService.authUser) {
              const repos = await Promise.all(
                  orgInfo.groups.map(reposGroup =>
                      githubService.getRepos(orgInfo.organization, reposGroup)
                  )
              )

              return {
                organization: orgInfo.organization,
                user: githubService.authUser,
                repositories: repos,
                credsError: false
              }
            } else {
              return {
                organization: orgInfo.organization,
                credsError: true
              }
            }
          })
      )

      this.organizations = []
      setTimeout(() => {
        this.organizations = organizations

        this.updateAppIconStatus()
      }, 100)

      setTimeout(() => {
        this.loadReposInfo(config)
      }, 5 * 60 * 1000)
    },
    getGHService: async function (orgInfo) {
      let githubService = services[orgInfo.organization]
      if (githubService === undefined) {
        githubService = new GitHubService(orgInfo.access_token)

        try {
          const authUser = await githubService.getSelfUser()
          githubService.authUser = authUser

          githubService.addPRFilter((pr) => pr.title.indexOf('Bump') === -1)
          githubService.addPRFilter((pr) => !pr.draft)
          githubService.addPRFilter((pr) => pr.isOwner(authUser.login) || pr.isReviewer(authUser.login))
        } catch (e) {
          githubService.authUser = null
        }

        services[orgInfo.organization] = githubService
      }

      return githubService
    },
    resizeWindow: function () {
      const bounds = this.$el.getBoundingClientRect()
      window.setSize(bounds.width, bounds.height, 500)
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
    hideMenu: function () {
      window.hideWindow()
    },
    quit: function () {
      window.quitApp()
    },
  },
  updated() {
    this.resizeWindow()
  },
  mounted() {
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
