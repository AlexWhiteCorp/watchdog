<template>
  <div class="menu-navbar">
    <div class="nav-btn menu-navbar-prev" @click="prevOrg">⬅</div>
    <menu-item class="menu-navbar-curr-org"
               :url="getOrgUrl(currOrg.organization)">
      {{ currOrg.organization }}
    </menu-item>
    <div class="nav-btn menu-navbar-next" @click="nextOrg">⬅</div>
  </div>
</template>

<script>
import MenuItem from "@/components/MenuItem";

const GITHUB_URL = 'https://github.com/'

export default {
  name: 'MenuNavbar',
  props: {
    organizations: Array,
    onOrgChange: Function
  },
  data: function () {
    return {
      currOrgIndex: 0
    }
  },
  components: {
    'menu-item': MenuItem
  },
  computed: {
    currOrg: function () {
      return this.organizations[this.currOrgIndex]
    }
  },
  methods: {
    getOrgUrl: function (org) {
      return GITHUB_URL + org
    },
    prevOrg: function (e) {
      this.currOrgIndex--
      if (this.currOrgIndex < 0) {
        this.currOrgIndex = this.organizations.length - 1
      }
      this.updateOrg()

      e.stopPropagation()
    },
    nextOrg: function (e) {
      this.currOrgIndex++
      if (this.currOrgIndex >= this.organizations.length) {
        this.currOrgIndex = 0
      }
      this.updateOrg()

      e.stopPropagation()
    },
    updateOrg: function () {
      this.onOrgChange(this.organizations[this.currOrgIndex])
    }
  },
  created() {
    this.updateOrg()
  }
}
</script>
<style scoped>
.menu-navbar {
  display: grid;
  grid-template-areas: "prev org next";
  grid-template-columns: 50px auto 50px;
}

.nav-btn {
  cursor: pointer;

  text-align: center;
  line-height: 33px;
}

.nav-btn:hover {
  background: var(--panel);
}

.menu-navbar-prev {
  grid-area: prev;
}

.menu-navbar-next {
  grid-area: next;
  /*mirror arrow symbol*/
  -ms-transform: scale(-1, 1);
  transform: scale(-1, 1);
}

.menu-navbar-curr-org {
  grid-area: org;

  text-align: center;
}
</style>
