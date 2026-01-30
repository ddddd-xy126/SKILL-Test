<!-- src/components/Layout.vue -->
<template>
  <div class="layout">
    <header class="layout-header" v-if="header">
      <!-- 头部内容 -->
      <slot name="header"></slot>
    </header>

    <!-- 头部工具 -->
    <div class="header-tool" v-if="headerTool">
      <slot name="header-tool"></slot>
    </div>

    <aside class="layout-aside-left" v-if="aside">
      <!-- 侧边栏内容 -->
      <slot name="aside-left"></slot>
    </aside>

    <aside class="layout-aside-left-tools" v-if="leftTools">
      <!-- 侧边栏内容 -->
      <slot name="aside-left-tools"></slot>
    </aside>

    <aside class="layout-aside-right-tools" v-if="rightTools">
      <!-- 侧边栏内容 -->
      <slot name="aside-right-tools"></slot>
    </aside>

    <aside class="layout-aside-right" v-if="aside">
      <!-- 侧边栏内容 -->
      <slot name="aside-right"></slot>
    </aside>

    <main class="layout-main" v-if="main">
      <!-- 主内容区域 -->
      <slot></slot>
    </main>

    <main class="layout-scene" v-if="scene">
      <!-- UE场景 -->
      <slot name="scene"></slot>
    </main>

    <img class="masktem" src="@images/mask.png" alt=""  />
    <img class="bgtem" src="@images/bgtem.png" alt="" v-if="main" />

    <!-- 底部工具 -->
    <div class="footer-tool" v-if="footerTool">
      <slot name="footer-tool"></slot>
    </div>

    <footer class="layout-footer" v-if="footer">
      <!-- 底部内容 -->
      <slot name="footer"></slot>
    </footer>
  </div>
</template>

<script>
export default {
  props: {
    header: {
      type: Boolean,
      default: false,
    },
    footer: {
      type: Boolean,
      default: false,
    },
    main: {
      type: Boolean,
      default: false,
    },
    aside: {
      type: Boolean,
      default: false,
    },
    scene: {
      type: Boolean,
      default: false,
    },
    leftTools: {
      type: Boolean,
      default: false,
    },
    rightTools: {
      type: Boolean,
      default: false,
    },
    headerTool: {
      type: Boolean,
      default: false,
    },
    footerTool: {
      type: Boolean,
      default: false,
    },
  },
  name: "Layout",

  watch: {
    // isShowScene(newVal) {
    //   this.scene = newVal;
    // }
  },
};
</script>

<style lang="scss" scoped>
.layout {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;

  img {
    position: absolute;

    left: 0;

    pointer-events: none;
    /* 关键属性 */

    &.masktem {
      top: 0;
      width: 100%;
      height: 100%;
    }

    &.bgtem {
      bottom: 0.9rem;
      margin-left: 0.6rem;
      width: calc(100% - 1.2rem);
      aspect-ratio: 19 / 10;
    }
  }
}

.layout-header {
  // background-color: aqua;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  aspect-ratio: 960 / 47;
  z-index: 2;
}
.header-tool {
  position: absolute;
  top: 9%;
  left: 50%;
  transform: translateX(-50%);
  width: 42%;
  z-index: 2;
}
.footer-tool {
  position: absolute;
  bottom: 8%;
  left: 50%;
  transform: translateX(-50%);
  width: 42%;
  z-index: 2;
}
.layout-footer {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding-bottom: 4.6%;
  z-index: 2;
}

.layout-aside-left,
.layout-aside-right {
  position: absolute;
  top: 8.5%;
  width: 19%;
  height: 89%;
  // width: 18.5%;
  // height: 90%;
  z-index: 1;
}

.layout-aside-left-tools {
  position: absolute;
  left: 22%;
  bottom: 8%;
  z-index: 1;
  display: flex;
  flex-direction: column;

  .btn {
    margin-bottom: 15%;
  }
}

.layout-aside-right-tools {
  position: absolute;
  right: 22%;
  bottom: 8%;
  z-index: 1;
  display: flex;
  flex-direction: column;

  .btn {
    margin-bottom: 15%;
  }
}

.layout-aside-left {
  left: 0;
}

.layout-aside-right {
  right: 0;
}

.layout-main,
.layout-scene {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

// .layout-main {
//   display: flex;
//   justify-content: center;
//   align-items: center;
// }

// .content-left,
// .content-right,
.content-header,
.content-footer,
.content-scene {
  position: absolute;
  top: 0;
  left: 0;

  width: 100%;
  height: 100%;
}

.content-left,
.content-right {
  position: absolute;
  top: 0;
  width: 100%;
  height: 93.3%;

}

.content-left {
  left: 7%;
  // margin-left: 7%;
}

.content-right {
  right: 7%;
  // margin-right: 7%;
}

.content-footer {
  display: flex;
  justify-content: center;
  align-items: center;
}

.content-scene {
  height: 100%;
}
</style>
