<style scoped lang="scss">
.container {
  width: 100%;
  height: 100%;
}
</style>

<template>
  <div class="container">
    <echarts-base class="echarts-base" :option="option" :width="width" :ratio="ratio" />
  </div>
</template>

<script>
import echartsBase from "@/components/echarts/index.vue";
import { smoothLineOption } from "@/types/echarts/line.js";

export default {
  name: "LineChart",
  components: { echartsBase },
  props: {
    width: { type: String, default: "100%" },
    ratio: { type: String, default: "338 / 200" },
    appClosureRateData: {
      type: Object,
      required: true,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      option: null,
    };
  },
  created() {
    const { xData, yData, ySet } = this.appClosureRateData;
    this.option = smoothLineOption(xData, yData, ySet);
  },
};
</script>
