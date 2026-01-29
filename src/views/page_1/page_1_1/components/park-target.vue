<!-- 2 -->
<template>
  <div class="container">
    <div class="multiBar">
      <multiBar
        :option="chartOption"
        width="100%"
        ratio="338/139"
      />
    </div>
  </div>
</template>

<script>
import { MultiBarOption } from "@/types/echarts/bar.js";
import multiBar from "@components/echarts/index.vue";

export default {
  components: {
    multiBar,
  },
  props: {
    parkTargetData: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      colors: ["#2195E0", "#86E0ED"],
    };
  },
  computed: {
    chartOption() {
      return MultiBarOption(
        this.parkTargetData.data,
        this.colors,
        this.parkTargetData.text,
        this.parkTargetData.orientation,
        this.parkTargetData.yAxisConfig,
        false
      );
    },
  },
  mounted() {},
};
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100%;
  display: flex;
  .multiBar {
    width: 100%;
    height: 100%;
  }
}
</style>
