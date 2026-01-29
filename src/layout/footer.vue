<!-- src/layout/header.vue -->
<template>
  <div class="header">
    <!-- <h1 class="logo">{{ logoText }}</h1> -->
    <div class="nav">
      <NavItem
        v-for="item in navList"
        :key="item.id"
        :item="item"
        @jumpNav="jumpNav"
      ></NavItem>
    </div>
    <!-- <h1 class="tools">
            <Setting />
        </h1> -->
  </div>
</template>
<script>
import NavItem from "@components/header/navItem-header.vue";
import Setting from "@components/header/setting/index.vue";
import { mapState } from "vuex";
import { addPOI } from "@utilsWdpApi/entity";
export default {
  name: "Header",
  components: {
    NavItem,
    Setting,
  },
  data() {
    return {
      logoText: "XXXXXX矿山操作系统",

      navList: [
        {
          name: "综合安防",
          id: 1,
          isActive: true,
          path: "/page_1",
          // bgImg: require('@images/nav/icon_1.png')
        },
        {
          name: "便捷通行",
          id: 2,
          isActive: false,
          path: "/page_2",
          // bgImg: require('@images/nav/icon_2.png')
        },
        {
          name: "能效管理",
          id: 3,
          isActive: false,
          path: "/page_3",
          // bgImg: require('@images/nav/icon_3.png')
        },
      ],
      currentNav: {
        id: null,
      },
    };
  },

  mounted() {
    //通过当前路由地址匹配当前导航选中状态
    const matchedRoutes = this.$route.matched;
    if (matchedRoutes.length > 1) {
      const firstLevelRouteName = matchedRoutes[1].path;
      this.navList.forEach((e) => {
        e.path === firstLevelRouteName
          ? (e.isActive = true)
          : (e.isActive = false);
      });
    }
  },
  computed: {
    ...mapState(["isSceneAlready"]),
  },

  methods: {
    jumpNav(route) {
      if (!this.currentNav.id || this.currentNav.id !== route.id) {
        this.navList = this.navList.map((item) => ({
          ...item,
          isActive: item.id === route.id,
        }));

        this.$router.push(route.path);

        this.currentNav = route;

        if (this.isSceneAlready) {
          if (route.id == 1) {
            addPOI();
          }
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.header {
  position: absolute;
  bottom: 40%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  // padding: 1% 1.5%;

  .nav {
    color: #b5cad4;
    font-family: var(--font-family-primary-Regular);
    width: 57%;
    // max-width: 1862.6px;
    max-width: 2227px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 0.5%;
    // gap: 0.1%;

    div {
      width: 11.2%;
      // aspect-ratio: 208 / 64;
      aspect-ratio: 250 / 58;
      /* 直接指定宽高比 */
      margin-right: -0.7%;
    }
  }
}
</style>
