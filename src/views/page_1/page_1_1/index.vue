<style lang="scss" scoped>
// 公共样式
.box-main-content {
  width: 100%;
  height: 100%;
}

//最好加起来等于87
// 1540
.content-left {
  .park-target-quantity-left {
    height: 19.3%;
  }

  .alarm-status-left {
    height: 18.7%;
  }

  .alarm-trend-left {
    height: 19.8%;
  }

  .security-alarm-left {
    height: 27.2%;
  }
}

.content-right {
  .camera-status-right {
    height: 13.2%;

    .box-main-content {
      display: flex;
      align-items: center;

      .progress {
        height: 80%;
      }
    }
  }

  .camera-distribution-right {
    height: 21.5%;
  }

  .patrol-statistics-right {
    height: 24.2%;

    .box-main-content {
      display: flex;

      .patrol-item {
        flex: 1;
      }
    }
  }

  .app-closure-rate-right {
    height: 26.1%;
  }
}

.header-tool-content {
  width: 100%;
  display: flex;
  justify-content: space-between;
}
</style>

<template>
  <Layout :aside="true" :headerTool="true" :footerTool="true" :main="true" leftTools="true">
    <template v-slot:aside-left>
      <div class="content-left">
        <Box class="park-target-quantity-left" :delayTime="100" position="left">
          <template v-slot:header>
            <h1 class="box-header-txt">园区目标数量</h1>
          </template>

          <div class="box-main-content">
            <ParkTarget :parkTargetData="parkTargetData" />
          </div>
        </Box>

        <Box class="alarm-status-left" :delayTime="200" position="left">
          <template v-slot:header>
            <h1>告警状态统计</h1>
          </template>
          <div class="box-main-content">
            <alarmStatus :alarmData="alarmData" />
          </div>
        </Box>

        <Box class="alarm-trend-left" :delayTime="300" position="left">
          <template v-slot:header>
            <h1>告警趋势</h1>
          </template>
          <div class="box-main-content">
            <alarmTrend :alarmTrendData="alarmTrendData.optionData" :ratio="alarmTrendData.ratio" />
          </div>
        </Box>

        <Box class="security-alarm-left" :delayTime="400" position="left">
          <template v-slot:header>
            <h1>安防告警统计</h1>
          </template>
          <div class="box-main-content">
            <alarmTable :tableData="securityAlarmList" :tableHeaders="securityAlarmHeaders" />
          </div>
        </Box>
      </div>
    </template>

    <template v-slot:aside-left-tools>
      <sideBarLeft ref="sideBarLeft" :sideBarListData="sideBarListData" @selectItem="sideBarSelectItem" />
    </template>

    <transition name="wdp-fade-slide2" appear>
      <webType2 v-if="isShowWebTwo.isShow && aiBotWindowId === 8" :config="isShowWebTwo.config" />
    </transition>
    <transition name="wdp-fade-slide1" appear>
      <webType1 v-if="isShowWebTwo.isShow && aiBotWindowId === 1" :config="isShowWebTwo.config" />
    </transition>

    <template v-slot:aside-right>
      <div class="content-right">
        <Box class="camera-status-right" :delayTime="100" position="right">
          <template v-slot:header>
            <h1>摄像头状态</h1>
          </template>
          <div class="box-main-content">
            <ProgressBar class="progress" :title="cameraStatusData.title" :icon-image="cameraStatusData.iconImage"
              :progress-background-image="cameraStatusData.backgroundImage" :data-list="cameraStatusData.dataList"
              :status-colors="cameraStatusData.statusColors" :status-images="cameraStatusData.statusImages"
              :default-color="cameraStatusData.defaultColor" :default-image="cameraStatusData.defaultImage" />
          </div>
        </Box>

        <Box class="camera-distribution-right" :delayTime="200" position="right">
          <template v-slot:header>
            <h1>摄像头分布</h1>
          </template>
          <div class="box-main-content">
            <cameraDistribution :cameraDistriData="cameraDistriData" />
          </div>
        </Box>

        <Box class="patrol-statistics-right" :delayTime="300" position="right">
          <template v-slot:header>
            <h1>巡更统计</h1>
          </template>
          <div class="box-main-content">
            <div class="patrol-item" v-for="(item, key) in patrolData" :key="key">
              <!-- 循环键值对,item值，key健 -->
              <patrolStatistics :totalData="item" :id="item.id" />
            </div>
          </div>
        </Box>

        <Box class="app-closure-rate-right" :delayTime="400" position="right">
          <template v-slot:header>
            <h1>APP关闭率统计</h1>
          </template>
          <div class="box-main-content">
            <appClosureRate :appClosureRateData="appClosureRateData.optionData" :ratio="appClosureRateData.ratio" />
          </div>
        </Box>
      </div>
    </template>

    <template v-slot:header-tool>
      <div class="header-tool-content">
        <HeaderItem v-for="item in headerToolsData" :key="item.id" :headerToolsItemData="item" />
      </div>
    </template>

    <template v-slot:footer-tool>
      <bottomBar :footerToolsData="footerToolsData" :footerToolHeaderName="footerToolHeaderName"
        :footerToolHeaderEn="footerToolHeaderEn" @footerSelectItem="footerSelectItem" />
    </template>
  </Layout>
</template>

<script>
import Layout from "@/layout/index.vue";
import Box from "@/layout/box.vue";
// 告警状态模块
import alarmStatus from "./components/alarm-status.vue";
// 安防告警模块
import ParkTarget from "./components/park-target.vue";
// 使用公共progressBar组件替代cameraStatus
import ProgressBar from "@/components/progressBar/index.vue";
// 摄像头分布
import cameraDistribution from "./components/camera-distribution.vue";
// 巡更统计
import patrolStatistics from "./components/patrol-statistics.vue";
// 告警趋势
import alarmTrend from "./components/alarm-trend.vue";
// app关闭率
import appClosureRate from "./components/app-closure-rate.vue";
import bottomBar from "@/components/bottomBar.vue";

import alarmTable from "@components/table/tableBase.vue";

import { _getArticlesListAPI, _getSecurityListAPI } from "@utilsApi/test.js";
import { defaultSimpleColumn } from "@/types/defaultData.js";

// 左侧边工具栏按钮
import sideBarLeft from "@/components/sideBarLeft.vue";

// 导入 WDP API 混入
import wdpapiMixin from "./mixins/wdpapi.js";

// 导入headerTool
import HeaderItem from "@components/toolBar/headerTool.vue";

import webType2 from "@view/wdpWindow/components/webType2.vue";
import { mapState } from "vuex";

import { resetCamera } from "@utilsWdpApi/camera";

import webType1 from "@/views/wdpWindow/components/webType1.vue";

export default {
  name: "FrontEndIndex",
  // 添加混入
  mixins: [wdpapiMixin],
  components: {
    Layout,
    Box,
    alarmStatus,
    ParkTarget,
    ProgressBar, // 替换cameraStatus
    cameraDistribution,
    patrolStatistics,
    alarmTrend,
    appClosureRate,
    alarmTable,
    sideBarLeft,
    HeaderItem,
    webType2,
    webType1,
    bottomBar,
  },
  data() {
    return {
      // 底部工具栏header名
      footerToolHeaderName: "综合安防事件列表",
      // 底部工具栏header英文
      footerToolHeaderEn: "COMPREHENSIVE SECURITY INCIDENT LIST",

      //左侧边工具栏按钮
      sideBarListData: [
        {
          id: 1,
          icon: require("@/assets/images/sideBarLeft/1/1.png"),
          name: "AI机器人",
          isActive: false,
        },
        {
          id: 2,
          icon: require("@/assets/images/sideBarLeft/1/2.png"),
          isActive: false,
          name: "视频周界",
        },
        {
          id: 3,
          icon: require("@/assets/images/sideBarLeft/1/3.png"),
          isActive: false,
          name: "安保人员",
        },

        {
          id: 4,
          icon: require("@/assets/images/sideBarLeft/1/4.png"),
          isActive: false,
          name: "安保岗亭",
        },
        {
          id: 5,
          icon: require("@/assets/images/sideBarLeft/1/5.png"),
          isActive: false,
          name: "人形闸机",
        },

        {
          id: 6,
          icon: require("@/assets/images/sideBarLeft/1/6.png"),
          isActive: false,
          name: "人员热力",
        },
      ],
      // 顶部工具栏按钮
      headerToolsData: [
        {
          id: 1,
          icon: require("@/assets/images/headerTool/2-1.png"),
          title: "实时在园目标数量",
          content: "18125",
        },
        {
          id: 2,
          icon: require("@/assets/images/headerTool/0-2.png"),
          title: "预警目标数量",
          content: "15.9",
        },
        {
          id: 3,
          icon: require("@/assets/images/headerTool/0-3.png"),
          title: "用水总量（m³）",
          content: "611",
        },
        {
          id: 4,
          icon: require("@/assets/images/headerTool/0-4.png"),
          title: "用气总量（m³）",
          content: "24573",
        },
      ],
      footerToolsData: [
        {
          id: 7,
          status: 2,
          icon: require("@/assets/images/footerTool/1-1.png"),
          title: "视频周界预警",
          time: "2025-07-03 14:42:54",
          position: "26防区",
          desc: "26防区围栏处有人员试图翻越，触发视频周界告警",
          isActive: false,
        },
        {
          id: 8,
          status: 2,
          icon: require("@/assets/images/footerTool/1-2.png"),
          title: "机器人巡更告警",
          time: "2024-10-17 14:42:54",
          position: "18防区",
          desc: "18防区周边发现人员危险行为，触发告警",
          isActive: false,
        },
      ],

      securityAlarmList: [],
      securityAlarmHeaders: {},
      defaultSimpleColumnData: {},
      parkTargetData: {
        text: "园区目标数量",
        orientation: "vertical",
        data: [
          {
            date: "06:00",
            values: [
              { name: "已完成", value: 100 },
              { name: "处理中", value: 150 },
            ],
          },
          {
            date: "09:00",
            values: [
              { name: "已完成", value: 3500 },
              { name: "处理中", value: 800 },
            ],
          },
          {
            date: "12:00",
            values: [
              { name: "已完成", value: 3800 },
              { name: "处理中", value: 1400 },
            ],
          },
          {
            date: "15:00",
            values: [
              { name: "已完成", value: 2900 },
              { name: "处理中", value: 800 },
            ],
          },
          {
            date: "18:00",
            values: [
              { name: "已完成", value: 2800 },
              { name: "处理中", value: 2000 },
            ],
          },
          {
            date: "21:00",
            values: [
              { name: "已完成", value: 500 },
              { name: "处理中", value: 1200 },
            ],
          },
        ],
        yAxisConfig: {
          max: 4000,
          interval: 1000,
        },
      },
      cameraStatusData: {
        title: "摄像头",
        iconImage: require("@/assets/images/img/camera_status.png"),
        backgroundImage: "url(~@images/zhts/bg.png)",
        dataList: [
          { status: "使用中", value: 130, percent: 60 },
          { status: "空闲中", value: 70, percent: 35 },
        ],
        statusColors: {
          使用中: "rgb(205, 214, 241)",
          空闲中: "rgb(134, 224, 237)",
        },
        statusImages: {
          使用中: require("@/assets/images/progress/1.png"),
          空闲中: require("@/assets/images/progress/2.png"),
        },
        defaultColor: "rgb(134, 224, 237)",
        defaultImage: require("@/assets/images/progress/2.png"),
      },
      cameraDistriData: {
        text: "摄像头统计", // 图表标题
        orientation: "vertical",
        data: [
          {
            name: "A1层",
            value: 400,
          },
          {
            name: "A2层",
            value: 1000,
          },
          {
            name: "A3层",
            value: 2400,
          },
          {
            name: "B1层",
            value: 3100,
          },
          {
            name: "B2层",
            value: 800,
          },
          {
            name: "C1层",
            value: 800,
          },
          {
            name: "C2层",
            value: 800,
          },
          {
            name: "环道",
            value: 800,
          },
        ],
        color: "#2195E0",
      },
      patrolData: {
        // 机器人巡更
        machinePatrol: {
          text: "已执行",
          subtext: "机器人巡更",
          data: [
            { name: "总次数", value: 19 },
            { name: "已执行", value: 11 },
          ],
        },
        //视频巡更
        videoPatrol: {
          text: "已执行",
          subtext: "视频巡更",
          data: [
            { name: "总次数", value: 156 },
            { name: "已执行", value: 11 },
          ],
        },
      },
      alarmData: {
        // 告警统计
        alarmNumberTotal: 156,
        GaugeOption: [
          {
            color: "#FEC551",
            data: {
              value: 6,
              total: 156,
            },
            text: "待处理",
          },
          {
            color: "#86E0ED",
            data: {
              value: 63,
              total: 156,
            },
            text: "处理中",
          },
          {
            color: "#2195E0",
            data: {
              value: 87,
              total: 156,
            },
            text: "已完成",
          },
        ],
      },
      alarmTrendData: {
        optionData: {
          xData: ["8-27", "8-28", "8-29", "8-30", "8-31", "9-1", "9-2"],
          yData: [
            {
              name: "告警趋势",
              data: [7, 5, 4, 3, 5, 3, 11],
              color: "#2195E0",
            },
          ],
          ySet: {
            min: 0,
            max: 12,
            interval: 3,
          },
        },
      },
      appClosureRateData: {
        optionData: {
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
              name: "app关闭率统计",
              data: [60, 78, 56, 77, 56, 70, 90, 66, 70, 80, 60, 70],
              color: "#86E0ED",
            },
          ],
          ySet: {
            min: 0,
            max: 100,
            interval: 25,
          },
        },
      },
    };
  },
  computed: {
    ...mapState(["isShowWebTwo", "isShowWindow", 'aiBotWindowId']),
  },
  async mounted() {
    this.getDefaultSimpleColumn();
    this.getSecurityListAPI();
  },

  methods: {
    async getSecurityListAPI() {
      const res = await _getSecurityListAPI();
      this.securityAlarmList = res.data;
      if (res.data.length > 0) {
        this.securityAlarmHeaders = res.data[0].headers;
        // 最优雅的版本：使用reduce一次性转换
        const widthMap = {
          position: "70%",
          type: "60%",
          time: "70%",
          status: "70%",
        };

        this.securityAlarmHeaders = Object.entries(
          this.securityAlarmHeaders
        ).reduce((acc, [key, value]) => {
          acc[key] = widthMap[key]
            ? { [key]: value, width: widthMap[key] }
            : value;
          return acc;
        }, {});
      }
    },

    getDefaultSimpleColumn() {
      this.defaultSimpleColumnData = defaultSimpleColumn();
    },

    isConnect51world(trag) {
      //通过vuex,通知views/index，将scene变量置为true。
      this.$store.commit("isShowScene", trag);
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
      await this.closeAll();
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
      } else {
        resetCamera();
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
