<!-- src/components/Layout.vue -->
<template>
  <transition :name="`slide-${position}`">
    <div
      class="box"
      v-if="isShow"
      :style="{ 'margin-bottom': footerBoxStyle['margin-bottom'] || '14%' }"
    >
      <div class="header-container">
        <header
          class="box-header"
          :style="{ width: footerBoxStyle['width'] || '45%' }"
        >
          <!-- 头部内容 -->
          <slot name="header"></slot>
        </header>

        <header class="box-header-en">
          <!-- 头部副标题内容 -->
          <slot name="header-en"></slot>
        </header>

        <header class="box-header-right">
          <!-- 头部右侧内容 -->
          <slot name="header-right"></slot>
        </header>
      </div>

      <div class="line">
        <span class="icon"></span>
        <span class="icon"></span>
        <span class="icon"></span>
      </div>

      <main class="box-main">
        <!-- 主内容区域 -->
        <div class="box-tag" v-if="tag !== ''">
          <span class="tag">{{ tag }}</span>
        </div>
        <span class="icon1"></span>
        <span class="icon2"></span>
        <span class="icon3"></span>
        <span class="icon4"></span>

        <slot></slot>
      </main>
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    tag: {
      type: String,
      default: "",
    },

    delayTime: {
      type: Number,
      default: 0,
    },
    position: {
      type: String,
      default: "",
    },
    footerBoxStyle: {
      type: Object,
      default: () => ({}),
    },
  },
  name: "box",

  data() {
    return {
      isShow: false,
    };
  },

  mounted() {
    setTimeout(() => {
      this.isShow = true;
    }, this.delayTime);
  },
};
</script>

<style lang="scss" scoped>
.box {
  width: 100%;
  margin-bottom: 14%;

  .header-container {
    display: flex;
    justify-content: flex-start;
    align-items: flex-end;
    position: relative;

    .box-header {
      margin-left: 2rem;
      margin-right: 3%;
      width: 45%;
      background: var(--box-title-color);
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 0.75% 0;
    }
  }
}

.box-main {
  background-color: var(--box-content-color);
  border: var(--box-content-border);
  padding: 4% 3%;
  position: relative;
  height: 100%;
  .icon1,
  .icon2,
  .icon3,
  .icon4 {
    position: absolute;
    width: 2px;
    height: 2px;
    background-color: var(--box-content-icon-color);
  }
  .icon1 {
    top: -2px;
    left: -2px;
  }
  .icon2 {
    top: -2px;
    right: -2px;
  }
  .icon3 {
    bottom: -2px;
    left: -2px;
  }
  .icon4 {
    bottom: -2px;
    right: -2px;
  }

  .box-tag {
    position: absolute;
    top: -1px;
    right: -1px;
    background: var(--box-tag-background);
    border: var(--box-tag-border);
    padding: 2% 4.5%;
  }
}

.line {
  width: 100%;
  height: 1px;
  background-color: var(--box-content-line);
  opacity: 1;
  margin-top: 1.5%;
  margin-bottom: 1.5%;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .icon {
    width: 3px;
    height: 3px;
    background-color: var(--box-content-icon-color);
  }
}

.box-main-content {
  overflow-y: scroll;
  overflow-x: hidden;
  max-height: 100%;
}

//动画过渡
// 定义从左到右的动画
.slide-left-enter-active,
.slide-left-leave-active {
  transition: all 0.3s ease;
}

.slide-left-enter {
  transform: translateX(-100%);
}

.slide-left-enter-to {
  transform: translateX(0);
}

.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.3s ease;
}

.slide-right-enter {
  transform: translateX(100%);
}

.slide-right-enter-to {
  transform: translateX(0);
}
</style>
