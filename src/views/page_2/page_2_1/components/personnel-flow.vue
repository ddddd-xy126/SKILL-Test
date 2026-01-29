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
    ratio: { type: String, default: "338 / 204" },
    personnelFlowData: {
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
      colors: ['#2195E0', '#86E0ED', '#FEC551']
    };
  },
  created() {
    const { xData, yData, ySet } = this.personnelFlowData;
    this.option = smoothLineOption(xData, yData, ySet, this.colors);
  },
};
</script>
