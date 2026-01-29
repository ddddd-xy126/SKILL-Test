<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
<template>
  <div class="container">
    <pieLeadChart :option="chartOption" width="100%" ratio="339/141" />
  </div>
</template>
<script>
import { pieLeadOption } from "@/types/echarts/pie.js";
import pieLeadChart from "@components/echarts/index.vue";
export default {
  components: {
    pieLeadChart,
  },
  props: {
    electricityConData: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      colors: {
        // 分项用电统计
        公共设备: "#2195E0",
        充电桩: "#86E0ED",
        用户设备: "#DBF5FF",
        照明插座: "#FEC551",
        // 年度用水分类统计
        生活用水: "#2195E0",
        生产用水: "#86E0ED",
        景观绿化: "#DBF5FF",
      },
      imgs: {
        // 分项用电统计
        总能耗: require("@/assets/images/center-left/3-1-energy.png"),
        // 年度用水分类统计
        年度用水: require("@/assets/images/nxgl/waterCategoryIcon.png"),
      },
    };
  },
  computed: {
    chartOption() {
      return pieLeadOption(this.electricityConData, this.colors, this.imgs,true);
    },
  },
};
</script>
