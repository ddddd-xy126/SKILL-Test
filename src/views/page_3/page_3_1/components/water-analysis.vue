<template>
  <div class="container">
    <columnChart :option="chartOption" width="100%" ratio="339/141" />
  </div>
</template>

<script>
import { baseBarOption } from "@/types/echarts/bar.js";
import columnChart from "@components/echarts/index.vue";

export default {
  components: {
    columnChart,
  },
  props: {
    UsageData: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {};
  },
  computed: {
    chartOption() {
      const { data, text, unit, orientation, yAxisConfig, color } =
        this.UsageData;
      return baseBarOption(data, text, unit, orientation, yAxisConfig, color);
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
}
</style>
