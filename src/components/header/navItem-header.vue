<style lang="scss" scoped>
.nav-item-container {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  cursor: pointer;
}

.bgImg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.right {
  background-size: 100% 100%;
  padding: 7%;
  // width: 69.3%;
  height: 100%;
  z-index: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  span {
    color: #b5cad4;
    font-family: var(--font-family-primary-Regular);
    font-size: var(--font-size-32);
  }
  &:hover{
     h2 {
      color: rgba($color: #ffffff, $alpha: 1);
      font-family: var(--font-family-primary-Bold);
    }
    span {
    color: rgba($color: #ffffff, $alpha: 1);
      font-family: var(--font-family-primary-Regular);
      font-size: var(--font-size-32);
    }
  }
  &.active {
    h2 {
      color: rgba($color: #ffffff, $alpha: 1);
      font-family: var(--font-family-primary-Bold);
    }
    span {
    color: rgba($color: #ffffff, $alpha: 1);
      font-family: var(--font-family-primary-Regular);
      font-size: var(--font-size-32);
    }
  }
}
</style>

<template>
  <div class="nav-item-container" @click="navClickEvent(item)">
    <!-- <div :class="`left${item.isActive ? ' active' : ''}`">
            <img :src="item.icon" alt="">
        </div> -->

    <div :class="`right${item.isActive ? ' active' : ''}`">
      <span>{{ item.name }}</span>
    </div>

    <img class="bgImg" :src="getImgURL(item.id, item.isActive)" alt="" />
  </div>
</template>

<script>
export default {
  name: "FrontEndNavItem",
  props: {
    item: {
      type: Object,
      default: () => {
        return {
          name: "-",
          id: 1,
          isActive: false,
          path: "",
        };
      },
    },
  },
  data() {
    return {};
  },

  mounted() {},

  methods: {
    navClickEvent(e) {
      this.$emit("jumpNav", e);
    },

    getImgURL(id, isActive) {
      if (id >= 1 && id <= 4) {
        return require(`@images/nav/HW-NAV-left${
          isActive ? "-Pre" : "-Nor"
        }.png`);
      } else if (id >= 6 && id <= 9) {
        return require(`@images/nav/HW-NAV-right${
          isActive ? "-Pre" : "-Nor"
        }.png`);
      } else {
        return require(`@images/nav/HW-NAV-mid${
          isActive ? "-Pre" : "-Nor"
        }.png`);
      }
    },
  },
};
</script>
