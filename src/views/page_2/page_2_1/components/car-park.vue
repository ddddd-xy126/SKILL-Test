<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 var(--font-size-20);
  .alarmTotal {
    // background-color: antiquewhite;
    padding: 0 var(--font-size-20);
    background-size: cover;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: var(--font-size-64);

    .left {
      margin-top: var(--font-size-10);
      display: flex;
      align-items: center;
      img {
        width: var(--font-size-40);
        aspect-ratio: 1/1;
        vertical-align: middle; 
      }
      .left_text { 
        margin-left: var(--font-size-20);
        font-size: var(--font-size-32);
        line-height: var(--font-size-40); 
        vertical-align: middle;
      }
    }
    .right {
      margin-top: var(--font-size-10);
      .right_text {
        font-size: var(--font-size-50);
        font-family: var(--font-family-primary-Bold);
        margin-right: var(--font-size-20);
      }
    }
  }
  .progress-container {
    flex: 1;
    padding: var(--font-size-50) 0;
    width: 95%;
  }
}
</style>

<template>
  <div class="container">
    <div class="alarmTotal" :style="carTotalStyle">
      <div class="left">
        <img :src="titleIconImg" />
        <span class="left_text">车位总数</span>
      </div>
      <div class="right">
        <span class="right_text">{{ parkNumberTotal }}</span>
        <span>个</span>
      </div>
    </div>
    <div class="progress-container">
      <ProgressBar
        :data-list="dataList"
        :status-colors="statusColors"
        :status-images="statusImages"
        :isShowIcon="false"
      />
    </div>
  </div>
</template>

<script>
// 引入图表框架
import Annular from "@components/echarts/index.vue";
// 引入图表option配置
import { baseGaugeOption } from "@/types/echarts/gauge";
import ProgressBar from "@/components/progressBar/index.vue";
export default {
  name: "carPark",
  components: {
    Annular,
    ProgressBar,
  },
  props: {
    carParkData: {
      type: Object,
      default: () => {},
    },
    parkNumberTotal: {
      type: Number,
      default: 0,
    },
    titleBgImg: {
      type: String,
      default: "",
    },
    titleIconImg: {
      type: String,
      default: "",
    },
    // 数据列表
    dataList: {
      type: Array,
      default: () => [],
    },
    // 状态对应的颜色配置
    statusColors: {
      type: Object,
      default: () => ({
        占用中: "rgb(205, 214, 241)",
        空闲中: "rgb(134, 224, 237)",
        紧急: "rgb(254, 197, 81)",
        一般: "rgb(254, 197, 81)",
      }),
    },
    // 状态对应的图片配置
    statusImages: {
      type: Object,
      default: () => ({
        占用中: require("@/assets/images/progress/1.png"),
        空闲中: require("@/assets/images/progress/2.png"),
        紧急: require("@/assets/images/progress/3.png"),
        一般: require("@/assets/images/progress/2.png"),
      }),
    },
  },
  computed: {
    carTotalStyle() {
      return {
        "background-image": this.titleBgImg
          ? `url(${this.titleBgImg})`
          : "none",
      };
    },
  },
  data() {
    return {};
  },
  mounted() {
    
  },
  methods: {
    // option配置
    gaugeOption(optionData) {
      //传入颜色,数据,文字等参数
      return baseGaugeOption(optionData);
    },
  },
};
</script>
