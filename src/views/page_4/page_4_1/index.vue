<style lang="scss" scoped>
// 公共样式
.box-main-content {
  width: 100%;
  height: 100%;
}

// 1530
// 左边加起来等于85
.content-left {
  .left-card {
    height: 23.8%;
  }

  .left-line {
    height: 21.1%;
  }

  .left-pie {
    height: 19.4%;

    .box-main-content {
      height: 100%;
    }
  }

  .left-bar {
    height: 20.7%;
  }
}

.content-right {
  .demand-forecast {
    height: 21.6%;
  }

  .water-category {
    height: 19.4%;
  }

  .gas-consume {
    height: 20.5%;
  }

  .operate-data {
    height: 23.5%;
  }
}

.header-tool-content{
  width: 100%;
  display: flex;
  justify-content: space-between;
}

</style>

<template>
  <Layout :aside="true" :headerTool="true" :footerTool="true" :main="true" leftTools="true"> 
    <template v-slot:aside-left>
      <div class="content-left">
        <Box class="left-card" :delayTime="100" position="left">
          <template v-slot:header>
            <h1>能耗数据概况</h1>
          </template>
          <div class="box-main-content">
            <leftCard :dataArr="cardData" />
          </div>
        </Box>

        <Box class="left-line" :delayTime="200" position="left">
          <template v-slot:header>
            <h1>实时用电监控</h1>
          </template>
          <div class="box-main-content">
            <electricityUsage :electricityUsageData="electricityUsageData" />
          </div>
        </Box>

        <Box class="left-pie" :delayTime="300" position="left">
          <template v-slot:header>
            <h1>分项用电统计</h1>
          </template>
          <div class="box-main-content">
            <electricityCom :electricityConData="electricityConsumption" />
          </div>
        </Box>

        <Box class="left-bar" :delayTime="400" position="left">
          <template v-slot:header>
            <h1>实时用水分析</h1>
          </template>
          <div class="box-main-content">
            <waterUsage :UsageData="waterUsageData" />
          </div>
        </Box>
      </div>
    </template>

    <energyFlow :ishow="isEnergyFlowVisible" />

    <template v-slot:aside-left-tools>
      <sideBarLeft
        :sideBarListData="sideBarListData"
        @selectItem="sideBarSelectItem"
      />
    </template>

    <template v-slot:aside-right>
      <div class="content-right">
        <Box class="demand-forecast" :delayTime="100" position="right">
          <template v-slot:header>
            <h1>需量预测</h1>
          </template>
          <div class="box-main-content">
            <demandForecast :demandForecastData="demandForecastData" />
          </div>
        </Box>

        <Box class="water-category" :delayTime="200" position="right">
          <template v-slot:header>
            <h1>年度用水分类统计</h1>
          </template>
          <div class="box-main-content">
            <waterCategory :electricityConData="waterCategoryData" />
          </div>
        </Box>

        <Box class="gas-consume" :delayTime="300" position="right">
          <template v-slot:header>
            <h1>用气统计</h1>
          </template>
          <div class="box-main-content">
            <gasUsage :UsageData="gasUsageData" />
          </div>
        </Box>

        <Box class="operate-data" :delayTime="400" position="right">
          <template v-slot:header>
            <h1>运行相关数据</h1>
          </template>
          <div class="box-main-content">
            <operateData
              :tableData="operateData.operateDataTable"
              :tableHeaders="operateData.operateDataHeader"
            />
          </div>
        </Box>
      </div>
    </template>
    <template v-slot:header-tool>
      <div class="header-tool-content">
        <HeaderItem
          v-for="item in headerToolsData"
          :key="item.id"
          :headerToolsItemData="item"
        />
      </div>
    </template>

    <template v-slot:footer-tool>
      <bottomBar
        :footerToolsData="footerToolsData"
        :footerToolHeaderName="footerToolHeaderName"
        :footerToolHeaderEn="footerToolHeaderEn"
        @footerSelectItem="footerSelectItem"
      />
    </template>
  </Layout>
</template>

<script>
import Layout from "@/layout/index.vue";
import Box from "@/layout/box.vue";
// 分项用电统计
import electricityCom from "./components/electricity-com.vue";
// 年度用水分类统计
import waterCategory from "./components/electricity-com.vue";

import leftCard from "./components/left-card.vue";
// 实时用电监控
import electricityUsage from "./components/electricity-usage.vue";
// 实时用水分析
import waterUsage from "./components/water-analysis.vue";
// 用气统计
import gasUsage from "./components/water-analysis.vue";
// 运行相关数据
import operateData from "@components/table/tableBase.vue";
// 需量预测
import demandForecast from "./components/demand-forecast.vue";

import { _getSecurityListAPI } from "@utilsApi/test.js";

import sideBarLeft from "@/components/sideBarLeft.vue";

import HeaderItem from "@components/toolBar/headerTool.vue";
import energyFlow from "./components/energy-flow.vue";

import bottomBar from "@/components/bottomBar.vue";

// 导入 WDP API 混入
import wdpapiMixin from "./mixins/wdpapi.js";
import { ClearByEids } from "@utilsWdpApi/delete";
import { resetCamera } from "@utilsWdpApi/camera";

export default {
  name: "FrontEndIndex",
  mixins: [wdpapiMixin],
  components: {
    Layout,
    Box,
    electricityCom,
    leftCard,
    electricityUsage,
    waterUsage,
    gasUsage,
    operateData,
    waterCategory,
    demandForecast,
    sideBarLeft,
    HeaderItem,
    energyFlow,
    bottomBar,
  },
  data() {
    return {
      isEnergyFlowVisible: false,
      //左侧边工具栏按钮
      sideBarListData: [
        {
          id: 1,
          icon: require("@/assets/images/sideBarLeft/3/1.png"),
          name: "供电设备",
          isActive: false,
        },
        {
          id: 2,
          icon: require("@/assets/images/sideBarLeft/3/2.png"),
          name: "能 流 图",
          isActive: false,
        },
        {
          id: 3,
          icon: require("@/assets/images/sideBarLeft/3/3.png"),
          name: "值班人员",
          isActive: false,
        },
      ],

      // 顶部工具栏按钮
      headerToolsData: [
        {
          id: 1,
          icon: require("@/assets/images/headerTool/1-1.png"),
          title: "用电总量",
          content: "224,212,876",
        },
        {
          id: 2,
          icon: require("@/assets/images/headerTool/1-2.png"),
          title: "同比节能（%）",
          content: "15.9",
        },
        {
          id: 3,
          icon: require("@/assets/images/headerTool/1-3.png"),
          title: "用水总量（m³）",
          content: "2,683,963",
        },
        {
          id: 4,
          icon: require("@/assets/images/headerTool/3-4.png"),
          title: "用气总量（m³）",
          content: "273,610",
        },
      ],
      // 底部工具栏header名
      footerToolHeaderName: "能效管理事件列表",
      // 底部工具栏header英文
      footerToolHeaderEn: "LIST OF ENERGY EFFICIENCY MANAGEMENT EVENTS",

      footerToolsData: [
        {
          id: 7,
          isActive: false,
          status: 2,
          icon: require("@/assets/images/footerTool/3-1.png"),
          title: "供电异常告警",
          time: "2024-10-17 14:42:54",
          position: "38防区",
          desc: "38防区监测供电异常，触发告警，系统已留存信息",
        },
      ],

      // 需量预测
      demandForecastData: {
        xData: [
          "1月",
          "2月",
          "3月",
          "4月",
          "5月",
          "6月",
          "7月",
          "8月",
          "9月",
          "10月",
          "11月",
          "12月",
        ],
        yData: [
          {
            name: "实际需量",
            data: [1300, 1200, 1310, 1190, 1210, 1000, 900, 1230, 1200],
            color: "#86E0ED",
          },
          {
            name: "预测需量",
            data: [1190, 1210, 1000],
            color: "#FEC551",
          },
          {
            name: "申报需量",
            data: 2500,
            color: "rgba(234, 95, 118, 0.6)",
          },
        ],
        ySet: {
          min: 0,
          max: 2500,
          interval: 500,
        },
      },
      // 年度用水分类统计
      waterCategoryData: {
        unit: "m³",
        text: "年度用水",
        data: [
          {
            name: "生活用水",
            value: 2400,
            percent: 29.97,
          },
          {
            name: "生产用水",
            value: 2009,
            percent: 25.09,
          },
          {
            name: "景观绿化",
            value: 4598,
            percent: 44.94,
          },
        ],
      },
      // 分项用电统计
      electricityConsumption: {
        unit: "kwh",
        total: "1",
        text: "总能耗",
        data: [
          {
            name: "公共设备",
            value: 12342,
            percent: 49.84,
          },
          {
            name: "充电桩",
            value: 29321,
            percent: 5.81,
          },
          {
            name: "用户设备",
            value: 126147,
            percent: 25.01,
          },
          {
            name: "照明插座",
            value: 97538,
            percent: 19.34,
          },
        ],
      },
      cardData: [
        {
          title: "本日用电总能耗",
          number: 16186046,
          unit: "kWh",
          trend: "up",
          percentage: 10,
        },
        {
          title: "年度用电总能耗",
          number: 251362,
          unit: "kWh",
          trend: "down",
          percentage: 5,
        },
        {
          title: "充电桩",
          number: 29321,
          unit: "kWh",
          trend: "up",
          percentage: 15,
        },
        {
          title: "用户设备",
          number: 126147,
          unit: "kWh",
          trend: "down",
          percentage: 8,
        },
        {
          title: "照明插座",
          number: 97538,
          unit: "kWh",
          trend: "up",
          percentage: 12,
        },
        {
          title: "未知",
          number: 1234,
          unit: "xxx",
          trend: "up",
          percentage: 10,
        },
      ],
      // 实时用电监控
      electricityUsageData: {
        optionData: {
          xData: [
            "00:00",
            "00:30",
            "01:00",
            "01:30",
            "02:00",
            "02:30",
            "03:00",
            "03:30",
          ],
          yData: [
            {
              name: "实际值",
              data: [1300, 1200, 1310, 1190, 1210, 1000, 900, 1230],
              color: "#4E98F6",
            },
            {
              name: "均值",
              data: [900, 400, 600, 700, 300, 1000, 1200, 1100],
              color: "#FEC551",
            },
          ],
          ySet: {
            min: 0,
            max: 1600,
            interval: 400,
          },
        },
      },
      // 实时用水分析
      waterUsageData: {
        text: "实时用水分析",
        orientation: "vertical",
        unit: "单位：km³",
        data: [
          {
            name: "表#1",
            value: 200,
          },
          {
            name: "表#2",
            value: 500,
          },
          {
            name: "表#3",
            value: 1200,
          },
          {
            name: "表#4",
            value: 1600,
          },
          {
            name: "表#5",
            value: 1600,
          },
          {
            name: "表#6",
            value: 200,
          },
        ],
        color: "#2195E0",
        yAxisConfig: {
          min: 0,
          max: 2000,
          interval: 500,
        },
      },
      // 用气分析
      gasUsageData: {
        text: "用气分析",
        orientation: "vertical",
        unit: "单位：m³",
        data: [
          {
            name: "表#1",
            value: 24,
          },
          {
            name: "表#2",
            value: 30,
          },
          {
            name: "表#3",
            value: 90,
          },
          {
            name: "表#4",
            value: 140,
          },
          {
            name: "表#5",
            value: 150,
          },
          {
            name: "表#6",
            value: 30,
          },
        ],
        color: "#FEC551",
        yAxisConfig: {
          min: 0,
          max: 180,
          interval: 30,
        },
      },
      // 运行相关数据
      operateData: {
        operateDataTable: [],
        operateDataHeader: {},
      },
    };
  },

  mounted() {
    this.getSecurityListAPI();
  },

  methods: {
    async getSecurityListAPI() {
      const res = await _getSecurityListAPI();
      this.operateData.operateDataTable = res.data;
      if (res.data.length > 0) {
        this.operateData.operateDataHeader = res.data[0].headers;
        // 最优雅的版本：使用reduce一次性转换
        const widthMap = {
          position: "70%",
          type: "60%",
          time: "70%",
          status: "70%",
        };

        this.operateData.operateDataHeader = Object.entries(
          this.operateData.operateDataHeader
        ).reduce((acc, [key, value]) => {
          acc[key] = widthMap[key]
            ? { [key]: value, width: widthMap[key] }
            : value;
          return acc;
        }, {});
      }
      console.log(this.operateData, "@@@@@@@@");
    },

    // 底部工具栏互斥逻辑
    async footerSelectItem(val) {
      // 侧边栏全部置为false - 使用重新赋值确保响应式更新
      this.sideBarListData = this.sideBarListData.map((item) => ({
        ...item,
        isActive: false,
      }));
      await this.toolsSelectItem(val)
    },
    // 侧边栏点击处理方法
    async sideBarSelectItem(val) {
      // 重置底部工具栏的 isActive 状态
      this.footerToolsData = this.footerToolsData.map((item) => ({
        ...item,
        isActive: false,
      }));

      // 调用通用的工具选择方法
      await this.toolsSelectItem(val);
    },

    //点击侧栏后的执行方法
    async toolsSelectItem(val) {
      console.log("取消激活状态,走关闭方法");
      await this.closeAll(val);
      // 如果点击的是相同的按钮则镜头回正
      if (val.isResetCamera) {
        await resetCamera();
      }
      // 清除固定types
      if (val.isActive) {
        console.log("激活状态，执行对应方法", val.isActive);
        // 激活状态：执行对应的处理方法
        const handlerMethod = this.toolHandlers[val.id];
        if (handlerMethod) {
          await handlerMethod(this.toolData[val.id], val.id);
        }
        this.activeItem = val;
      }
    },
  },

  async beforeDestroy() {
    // 清除所有
    await this.closeAll();
    await resetCamera();
  },
};
</script>
