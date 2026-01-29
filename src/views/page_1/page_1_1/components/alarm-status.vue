<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  .alarmTotal {
    // background-color: antiquewhite;
    background-image: url("~@images/zhaf/title_bg.png");
    background-size: cover;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: var(--font-size-64);
    padding: 0 var(--font-size-20);
    .left {
      display: flex;
      align-items: center;
      img{
        width: var(--font-size-34);
        aspect-ratio: 1/1;
      }
      .left_text {
        margin-left: var(--font-size-20);
        font-size: var(--font-size-32);
      }
    }
    .right {
      .right_text {
        font-size: var(--font-size-50);
        font-family: var(--font-family-primary-Bold);
        margin-right: var(--font-size-20);
      }
    }
  }
  .threeAnnular {
    flex: 1;
    width: 100%;
   
    display: flex;
    .annular{
        display: flex;
        align-items: space-between;
        justify-content: center;
        // background-color: antiquewhite;
        flex: 1;
    } 
  }
}
</style>

<template>
  <div class="container">
    <div class="alarmTotal">
      <div class="left">
        <img src="@/assets/images/zhaf/alarmIcon.png" alt="alarmIcon" />
        <span class="left_text">告警总数</span>
      </div>
      <div class="right">
        <span class="right_text">{{alarmData.alarmNumberTotal}}</span>
        <span>件</span>
      </div>
    </div>
    <div class="threeAnnular">
      <Annular class="annular"
        v-for="item in alarmData.GaugeOption"
        :key="item.id"
        :option="gaugeOption(item)"
      />
    </div>
  </div>
</template>

<script>
// 引入图表框架
import Annular from "@components/echarts/index.vue";
// 引入图表option配置
import { baseGaugeOption } from "@/types/echarts/gauge";
export default {
  name: "alarmStatus",
  components: {
    Annular,
  },
  props: {
    alarmData:{
      type:Object,
      required:true,
      default:()=>{{}}
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
