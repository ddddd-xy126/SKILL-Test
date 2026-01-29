<template>
  <div class="container">
    <div class="barchart">
      <columnChart
        :option="chartOption"
        width="100%"
        ratio="338/159"
      />
    </div>
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
    cameraDistriData: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {};
  },
  computed: {
    chartOption() {
      return baseBarOption(
        this.cameraDistriData.data,
        this.cameraDistriData.text,
        this.cameraDistriData.unit,
        this.cameraDistriData.orientation,
        this.cameraDistriData.color
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
  .barchart {
    width: 100%;
    height: 100%;
    // background-color: rgb(164, 158, 150);
  }
}
</style>
