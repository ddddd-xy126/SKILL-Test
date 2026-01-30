<template>
  <div class="box" v-if="ishow">

    <div class="box-top-header">
      <div>{{ datalist.title_1 }}</div>
      <div @click="myshow">x</div>
    </div>

    <div class="box-mid">
      <div class="data-box" v-for="(i, index) in datalist.data" :key="index">
        <div class="data-box-left">
          <span class="fond-1">{{ i.type }}</span>
          <span class="fond-2">{{ formatNumber(i.typeCount) }}</span>
        </div>
        <div class="data-box-right">
          <span class="fond-1">{{ i.kgce }}</span>
          <span class="fond-2">{{ formatNumber(i.count) }}</span>
        </div>
      </div>
    </div>

    <div class="box-bottom">
      <div class="box-bottom-left">
        <span style="margin-bottom: 1rem">{{ this.datalist.title_2 }}</span>
        <div class="sankey-container">
          <sankey :id="sankeyData.id" :dataList="sankeyData.datalist"></sankey>
        </div>
        <!-- 添加左下角和右下角装饰 -->
        <div class="corner-bl"></div>
        <div class="corner-br"></div>
      </div>
      <div class="box-bottom-right">
        <div>
          <span class="span">{{ this.datalist.title_3 }}</span>
        </div>
        <div class="box-bottom-right-data">
          <div class="data-box-left">
            <span class="fond-1">{{
              this.datalist.paidatalist.data.name_1
            }}</span><span class="fond-2">{{
                formatNumber(this.datalist.paidatalist.data.count_1)
              }}</span>
          </div>
          <div class="data-box-right">
            <span class="fond-1">{{
              this.datalist.paidatalist.data.name_2
            }}</span><span class="fond-2">{{
                formatNumber(this.datalist.paidatalist.data.count_2)
              }}</span>
          </div>
        </div>
        <div class="pai">
          <paIcahrts :id="paiChartsData.id" :data="paiChartsData" :images="dataimgae"></paIcahrts>
        </div>
        <!-- 添加左下角和右下角装饰 -->
        <div class="corner-bl"></div>
        <div class="corner-br"></div>
      </div>
    </div>

  </div>
</template>
<script>
import sankey from "./energy-flow-sankey.vue";
import paIcahrts from "./energy-flow-paIcahrts.vue";
export default {
  name: "agnizeType",
  data() {
    return {
      dataimgae: [
        require("@/assets/images/center-left/3-1-energy.png"),
        require("@/assets/images/center-left/1-centerImg.png"),
      ],
    };
  },
  components: {
    paIcahrts,
    sankey,
  },
  methods: {
    myshow() {
      this.ishow = false;
    },
    // 格式化数字，添加千位分隔符
    formatNumber(num) {
      return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
  },
  props: {
    ishow: {
      type: Boolean,
      default: () => false,
    },
    datalist: {
      type: Object,
      default: () => {
        return {
          title_1: "能流分析",
          title_2: "能源流向分析",
          title_3: "设备损耗",
          data: [
            {
              type: "当日用电量(kwh)",
              typeCount: "10000",
              kgce: "拆标(kgce)",
              count: "10000",
            },
            {
              type: "当月用电量(kwh)",
              typeCount: "100000",
              kgce: "拆标(kgce)",
              count: "10000",
            },
            {
              type: "当年用电量(kwh)",
              typeCount: "10000",
              kgce: "拆标(kgce)",
              count: "10000",
            },
            {
              type: "当年发电量(kwh)",
              typeCount: "10000",
              kgce: "当年发电折标(kgce)",
              count: "10000",
            },
          ],
          paidatalist: {
            data: {
              name_1: "变压损耗(kwh)",
              count_1: "100000",
              name_2: "线路损耗(kwh)",
              count_2: "100000",
            },
          },
        };
      },
    },

    paiChartsData: {
      type: Object,
      default: () => {
        return {
          total: "全部用电",
          text: "回路占比",
          data: [
            {
              name: "B2冷水转换（1-3-4-1）",
              percent: 59.8,
            },
            {
              name: "B1固定式冷冻泵（1-3-5-1）",
              percent: 15.8,
            },
            {
              name: "B1冷水转换（1-3-45-1）",
              percent: 21.3,
            },
            {
              name: "B2固定式冷水泵（1-3-6-1）",
              percent: 3.0,
            },
          ],
        };
      },
    },

    sankeyData: {
      type: Object,
      default: () => {
        return {
          id: 102321,
          datalist: {
            data: [
              // 第一层 - 电源
              { name: "F14(2#进线)", depth: 0, itemStyle: { color: "#4E98F6" } },
              { name: "F19(1#进线)", depth: 0, itemStyle: { color: " #86DFEC" } },
              { name: "2-3#主变", depth: 1 },
              { name: "2-4#主变", depth: 1 },
              { name: "2-5#主变", depth: 1 },
              { name: "2-6#主变", depth: 1 },
              { name: "2-7#主变", depth: 1 },
              { name: "2-8#主变", depth: 1 },
              { name: "2-9#主变", depth: 1 },
              { name: "3-0#主变", depth: 1 },
              // { name: "3-1#主变", depth: 1 },
              // 第四层 - 用电设备
              {
                name: "1-2N3培训中心二层电源",
                itemStyle: { color: "#FF999C" },
                depth: 2,
              },
              {
                name: "1-2N2培训中心二层电源",
                itemStyle: { color: "#FF999C" },
                depth: 2,
              },
              {
                name: "1-3N3培训中心二层电源",
                itemStyle: { color: "#FF999C" },
                depth: 2,
              },
              { name: "1-N8庭院照明", itemStyle: { color: "#4E98F6" } },
              { name: "1-2NJJZ排烟风机", itemStyle: { color: "#86DFEC" } },
            ],
            links: [
              // 进线到主变
              { source: "F14(2#进线)", target: "2-3#主变", value: 100 },
              { source: "F14(2#进线)", target: "2-4#主变", value: 100 },
              { source: "F14(2#进线)", target: "2-5#主变", value: 100 },
              { source: "F14(2#进线)", target: "2-6#主变", value: 100 },
              { source: "F19(1#进线)", target: "2-7#主变", value: 100 },
              { source: "F19(1#进线)", target: "2-8#主变", value: 100 },

              { source: "F19(1#进线)", target: "2-9#主变", value: 100 },
              { source: "F19(1#进线)", target: "3-0#主变", value: 100 },
              { source: "F19(1#进线)", target: "3-1  #主变", value: 100 },
              // 主变到用电设备
              { source: "2-3#主变", target: "1-2N3培训中心二层电源", value: 30 },
              { source: "2-3#主变", target: "1-2N2培训中心二层电源", value: 40 },
              { source: "2-3#主变", target: "1-3N3培训中心二层电源", value: 90 },
              { source: "2-3#主变", target: "1-N8庭院照明", value: 25 },
              { source: "2-3#主变", target: "1-2NJJZ排烟风机", value: 25 },
            ],
          },
        };
      },
    },



  },
};
</script>
<style scoped lang="scss">
.box {
  box-sizing: border-box;
  position: absolute;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -40%);
  width: 52%;
  aspect-ratio: 2104 / 1030;
  display: flex;
  align-items: center;
  flex-direction: column;
  z-index: 1;
  padding: 0.5% 0.7% 1.2% 1%;
  color: #ffffff;
  background: url(~@images/window/bg_big.png) no-repeat center center;
  background-size: 100% 100%;
}

.box-top-header {
  padding-bottom: 0.5rem;
  font-size: var(--font-size-28);
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 0.1rem solid rgba(214, 224, 233, 0.384);
  padding-bottom: 0.8%;
  padding-top: 0.1%;
  // background-color: aqua;
}

.box-mid {
  width: 98%;
  display: flex;
  justify-content: space-between;
  align-items: center;

  // background-color: aqua;
  .data-box {
    padding: 2rem 0;
    display: flex;
    justify-content: flex-start;
    align-items: center;

    .data-box-left {
      display: flex;
      justify-content: space-between;
      flex-direction: column;
      margin-right: 3rem;

      .fond-1 {
        font-size: var(--font-size-24);
        color: rgb(169, 194, 206);
      }

      .fond-2 {
        font-size: var(--font-size-38);
        color: #ffffff;
        font-family: var(--font-family-primary-Bold);
      }
    }

    .data-box-right {
      position: relative;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      flex-direction: column;

      .fond-1 {
        font-size: var(--font-size-24);
        color: rgb(169, 194, 206);
      }

      .fond-2 {
        font-size: var(--font-size-38);
        color: #ffffff;
        font-family: var(--font-family-primary-Bold);
      }
    }

    .data-box-right::after {
      content: "";
      position: absolute;
      top: 1rem;
      left: 200%;
      height: 60%;
      width: 0.1px;
      border-right: rgba(192, 220, 231, 1) 0.1px solid;
    }
  }

  .data-box:last-child ::after {
    border: none;
  }
}

.box-bottom {
  width: 98%;
  display: flex;
  align-items: center;

  .box-bottom-left {
    margin-right: 1rem;
    border: 0.2rem solid rgba(214, 224, 233, 0.384);
    background-color: rgba(0, 16, 30, 0.6);
    padding: 1rem;
    height: 100%;
    width: 72%;
    position: relative;

    span {
      font-size: var(--font-size-28);
      display: inline-block;
      padding: 0.3rem 1rem;
      color: #f7f3f3;
      background-color: rgba(112, 182, 240, 0.384);
    }

    // 右上角装饰
    &::before {
      content: "";
      position: absolute;
      top: -0.2rem;
      right: -0.1rem;
      height: 0.3rem;
      width: 0.3rem;
      background-color: rgba(192, 220, 231, 0.8);
    }

    // 左上角装饰
    &::after {
      content: "";
      position: absolute;
      top: -0.2rem;
      left: -0.1rem;
      height: 0.3rem;
      width: 0.3rem;
      background-color: rgba(192, 220, 231, 0.8);
    }

    // 左下角装饰
    .corner-bl {
      content: "";
      position: absolute;
      bottom: -0.2rem;
      left: -0.1rem;
      height: 0.3rem;
      width: 0.3rem;
      background-color: rgba(192, 220, 231, 0.8);
    }

    // 右下角装饰
    .corner-br {
      content: "";
      position: absolute;
      bottom: -0.2rem;
      right: -0.1rem;
      height: 0.3rem;
      width: 0.3rem;
      background-color: rgba(192, 220, 231, 0.8);
    }
  }

  .box-bottom-right {
    border: 0.2rem solid rgba(214, 224, 233, 0.384);
    background-color: rgba(0, 16, 30, 0.6);
    height: 100%;
    width: 28%;
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    position: relative;

    // 右上角装饰
    &::before {
      content: "";
      position: absolute;
      top: -0.2rem;
      right: -0.1rem;
      height: 0.3rem;
      width: 0.3rem;
      background-color: rgba(192, 220, 231, 0.8);
    }

    // 左上角装饰
    &::after {
      content: "";
      position: absolute;
      top: -0.2rem;
      left: -0.1rem;
      height: 0.3rem;
      width: 0.3rem;
      background-color: rgba(192, 220, 231, 0.8);
    }

    // 左下角和右下角装饰
    .corner-bl,
    .corner-br {
      content: "";
      position: absolute;
      height: 0.3rem;
      width: 0.3rem;
      background-color: rgba(192, 220, 231, 0.8);
    }

    .corner-bl {
      bottom: -0.2rem;
      left: -0.1rem;
    }

    .corner-br {
      bottom: -0.2rem;
      right: -0.1rem;
    }

    .span {
      font-size: var(--font-size-28);
      display: inline-block;
      padding: 0.3rem 1rem;
      color: #f7f3f3;
      background-color: rgba(112, 182, 240, 0.384);
    }

    .box-bottom-right-data {
      margin-top: 1.5rem;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      padding: 0 3%;
      // background-color: #fff;

      .data-box-left {
        position: relative;
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        flex-direction: column;

        // background-color: #fff;
        .fond-1 {
          font-size: var(--font-size-24);
          color: rgb(169, 194, 206);
        }

        .fond-2 {
          font-size: var(--font-size-38);
          color: #ffffff;
          font-family: var(--font-family-primary-Bold);
        }
      }

      .data-box-right {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        flex-direction: column;

        .fond-1 {
          font-size: var(--font-size-24);
          color: rgb(169, 194, 206);
        }

        .fond-2 {
          font-size: var(--font-size-38);
          color: #ffffff;
          font-family: var(--font-family-primary-Bold);
        }
      }

      .data-box-left ::after {
        content: "";
        position: absolute;
        left: 79%;
        height: 50%;
        width: 0.1px;
        border-right: #bac7d6 0.1px solid;
        margin-left: 90%;
      }
    }

    .pai {
      margin-top: 1rem;
      width: 100%;
      aspect-ratio: 2.4/2.2;
      z-index: 1000;
    }
  }
}
</style>
