<template>
  <div class="menu-navbar">
    <div v-if="items.length > 1" class="nav-btn menu-navbar-prev" @click="prevItem">⬅</div>
    <menu-item class="menu-navbar-curr-org" :url="onItemTitleClick(currItem)">
      {{ getItemTitle(currItem) }}
    </menu-item>
    <div v-if="items.length > 1" class="nav-btn menu-navbar-next" @click="nextItem">⬅</div>
  </div>
</template>

<script>
import MenuItem from "@/components/MenuItem";

export default {
  name: 'MenuNavbar',
  props: {
    items: Array,
    getItemTitle: Function,
    onItemTitleClick: Function,
    onActiveItemChanged: Function
  },
  data: function () {
    return {
      currItemIndex: 0
    }
  },
  components: {
    'menu-item': MenuItem
  },
  computed: {
    currItem: function () {
      return this.items[this.currItemIndex]
    }
  },
  methods: {
    prevItem: function (e) {
      this.currItemIndex--
      if (this.currItemIndex < 0) {
        this.currItemIndex = this.items.length - 1
      }
      this.setActiveItem()

      e.stopPropagation()
    },
    nextItem: function (e) {
      this.currItemIndex++
      if (this.currItemIndex >= this.items.length) {
        this.currItemIndex = 0
      }
      this.setActiveItem()

      e.stopPropagation()
    },
    setActiveItem: function () {
      this.onActiveItemChanged(this.currItemIndex)
    }
  },
  created() {
    this.setActiveItem()
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
  line-height: 28px;
  margin: 2px 4px;
  border-radius: var(--radius-md);
  color: var(--fg-secondary);
  font-size: 14px;
  transition: background-color 0.08s ease-out, color 0.08s ease-out;
}

.nav-btn:hover {
  background: var(--bg-hover);
  color: var(--fg-primary);
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
  font-weight: 600;
  line-height: 28px;
  letter-spacing: -0.01em;
}
</style>
