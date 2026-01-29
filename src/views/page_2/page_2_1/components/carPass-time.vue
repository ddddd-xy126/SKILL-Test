<template>
  <div class="container">
    <div class="item" v-for="item in carPassTime.GaugeOption" :key="item.id">
      <Annular width="100%" ratio="126/109" :option="gaugeOption(item)" />
    </div>
  </div>
</template>

<script>
// 引入图表框架
import Annular from "@components/echarts/index.vue";
// 引入图表option配置
import { baseGaugeOption } from "@/types/echarts/gauge";

export default {
  name: "carPassTime",
  components: {
    Annular,
  },
  props: {
    carPassTime: {
      type: Object,
      required: true,
      default: () => ({})
    }
  },
  mounted() {
  },
  methods: {
    // option配置
    gaugeOption(optionData) {
      // 传入颜色,数据,文字等参数
      return baseGaugeOption(optionData, false, false);   // isShowLegend = false
    },
  },
};
</script>

<style lang="scss" scoped>

.container {
  // background-color: rgba(255,255,255,0.5);
  height: 100%;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: stretch;
  // gap: 0px;

  .item {
    flex:0 0 calc(33.333% - 1px);
    // background-color: aliceblue;
  }
}
</style>
