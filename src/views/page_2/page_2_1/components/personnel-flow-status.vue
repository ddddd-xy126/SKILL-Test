<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100%;
  box-sizing: border-box;

  .threeAnnular {
    height: 100%;
    width: 100%;
    display: flex;

    .annular {
      display: flex;
      align-items: space-between;
      justify-content: center;
      flex: 1;
    }
  }
}
</style>

<template>
  <div class="container">
    <div class="threeAnnular">
      <!-- 参数待改 -->
      <Annular class="annular" v-for="item in personnelFlowStatusData.GaugeOption" :key="item.id"
        :option="gaugeOption(item)" />
    </div>
  </div>
</template>

<script>
// 引入图表框架
import Annular from "@components/echarts/index.vue";
// 引入图表option配置
import { baseGaugeOption } from "@/types/echarts/gauge";
export default {
  name: "personnelFlowStatus",
  components: {
    Annular,
  },
  props: {
    personnelFlowStatusData: {
      type: Object,
      required: true,
      default: () => { { } }
    }
  },
  computed: {},
  data() {
    return {
    };
  },
  mounted() {
  },
  methods: {
    // option配置
    gaugeOption(optionData) {
      //传入颜色,数据,文字等参数
      //   console.log(optionData);
      return baseGaugeOption(optionData);
    },
  },
};
</script>
