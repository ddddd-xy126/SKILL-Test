<!-- 1 -->
<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
 
  .piechart {
    // background-color: aliceblue;
    flex: 1;
    // width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    // background-color: antiquewhite;
    img {
      width: 40%;
      aspect-ratio: 163/46;
    }
    .text {
      margin-top: 3%;
      .text_1{
        color: #C3CEE2;
        font-family: var(--font-family-primary-Regular);
      }
      .text_2{
        margin-left: 1rem;
        color: #fff;
        font-family: var(--font-family-primary-Bold);
      }
      
    }
  }
}
</style>
<template>
  <div class="container">
    <div class="piechart">
      <gaugeChart :option="chartOption" width="70%" ratio="1/1" />
      <img
        :src="subImgs[totalData.subtext]"
        :alt="totalData.subtext"
        v-if="totalData.subtext && subImgs[totalData.subtext]"
      />
      <div class="text" v-for="item in totalData.data" :key="item.name">
        <span class="text_1">{{ item.name }}</span>
        <span class="text_2">{{ item.value }}</span>
      </div>
    </div>
  </div>
</template>
<script>
import { ImgbgGaugeOption } from "@/types/echarts/gauge.js";

import gaugeChart from "@components/echarts/index.vue";
export default {
  components: {
    gaugeChart,
  },
  props: {
    totalData: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      colors: {
        机器人巡更: "#2195E0",
        视频巡更: "#86E0ED",
      },
      imgs: {
        机器人巡更: require("@/assets/images/zhaf/robot.png"),
        视频巡更: require("@/assets/images/zhaf/car.png"),
      },
      subImgs: {
        机器人巡更: require("@/assets/images/zhaf/机器人巡更.png"),
        视频巡更: require("@/assets/images/zhaf/视频巡更.png"),
      },
    };
  },
  computed: {
    chartOption() {
      return ImgbgGaugeOption(this.totalData, this.colors, this.imgs, true);
    },
  },
  created() {
  },
};
</script>
