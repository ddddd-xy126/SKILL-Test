<style lang="scss" scoped>
.box-main-content {
  height: 100%;
  width: 100%;
}

// 1470
.content-left {
  .flow-statistics {
    height: 26.5%;
  }

  .event {
    height: 21.9%;

    .box-main-content {
      height: 100%;
      // background-color: rgba(255,255,255,0.5);
    }
  }

  .type-statistics {
    height: 20.2%;

    .box-main-content {
      height: 100%;
      // background-color: rgba(255,255,255,0.5);
    }
  }

  .pass-tatistics {
    height: 16.4%;

    .box-main-content {
      height: 100%;
    }
  }
}

.content-right {
  .car-flow {
    height: 22.5%;
  }

  .car-event {
    height: 21.9%;
  }

  .car-time {
    height: 25.4%;
  }

  .car-manage {
    height: 15.2%;
  }
}

.header-tool-content{
  width: 100%;
  display: flex;
  justify-content: space-between;
}
</style>

<template>
  <Layout :aside="true" :headerTool="true" :footerTool="true">
    <template v-slot:aside-left>
      <div class="content-left">
        <Box class="flow-statistics" :delayTime="100" position="left">
          <template v-slot:header>
            <h1>人员通行流量统计</h1>
          </template>
          <div class="chart-container">
            <personnelFlow :personnelFlowData="personnelFlowData.optionData" />
          </div>
        </Box>

        <Box class="event" :delayTime="200" position="left">
          <template v-slot:header>
            <h1>人员通行事件</h1>
          </template>
          <div class="box-main-content">
            <personEvent :data="personEventData"></personEvent>
          </div>
        </Box>

        <Box class="type-statistics" :delayTime="300" position="left">
          <template v-slot:header>
            <h1>人员类型统计</h1>
          </template>
          <div class="box-main-content">
            <personnelType :personnelTypeData="personnelTypeData" />
          </div>
        </Box>

        <Box class="pass-tatistics" :delayTime="400" position="left">
          <template v-slot:header>
            <h1>人员通行类型统计</h1>
          </template>
          <div class="box-main-content">
            <personnelFlowStatus :personnelFlowStatusData="personnelFlowStatusData" />
          </div>
        </Box>
      </div>
    </template>

    <template v-slot:aside-left-tools>
      <sideBarLeft :sideBarListData="sideBarListData" @selectItem="sideBarSelectItem" />
    </template>

    <template v-slot:aside-right>
      <div class="content-right">
        <Box class="car-flow" :delayTime="100" position="right">
          <template v-slot:header>
            <h1>车辆通行流量统计</h1>
          </template>
          <div class="box-main-content">
            <carFlow :xData="carFlowData.xData" :yData="carFlowData.yData" />
          </div>
        </Box>

        <Box class="car-event" :delayTime="200" position="right">
          <template v-slot:header>
            <h1>车辆通行事件</h1>
          </template>
          <div class="box-main-content">
            <CarEvent :data="carnEventData"></CarEvent>
          </div>
        </Box>

        <Box class="car-time" :delayTime="300" position="right">
          <template v-slot:header>
            <h1>单次停车时长统计</h1>
          </template>
          <div class="box-main-content">
            <carPassTime :carPassTime="carPassData" />
          </div>
        </Box>

        <Box class="car-manage" :delayTime="400" position="right">
          <template v-slot:header>
            <h1>停车位管理</h1>
          </template>
          <div class="box-main-content">
            <carPark :parkNumberTotal="carParkData.parkNumberTotal" :titleIconImg="carParkData.titleIconImg"
              :dataList="carParkData.dataList" :statusColors="carParkData.statusColors"
              :statusImages="carParkData.statusImages" :titleBgImg="carParkData.titleBgImg" />
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
import PersonEvent from "@components/cartList/eventCart.vue";
import CarEvent from "@components/cartList/eventCart.vue";
// 人员通行流量统计
import personnelFlow from "./components/personnel-flow.vue";
import carFlow from "./components/car-flow.vue";
import personnelFlowStatus from "./components/personnel-flow-status.vue";
import personnelType from "./components/personnel-type.vue";
// 停车位管理
import carPark from "./components/car-park.vue";

import carPassTime from "./components/carPass-time.vue";

import sideBarLeft from "@/components/sideBarLeft.vue";

// 导入headerTool
import HeaderItem from "@components/toolBar/headerTool.vue";

// 导入 WDP API 混入
import wdpapiMixin from "./mixins/wdpapi.js";
import { resetCamera } from "@utilsWdpApi/camera";
import { mapState } from 'vuex';
import bottomBar from "@/components/bottomBar.vue";

export default {
  name: "FrontEndIndex",
  // 添加混入
  mixins: [wdpapiMixin],
  components: {
    Layout,
    Box,
    PersonEvent,
    CarEvent,
    personnelFlow,
    carFlow,
    personnelFlowStatus,
    personnelType,
    carPassTime,
    carPark,
    sideBarLeft,
    HeaderItem,
    bottomBar
  },
  data() {
    return {
      //左侧边工具栏按钮
      sideBarListData: [
        {
          id: 1,
          icon: require("@/assets/images/sideBarLeft/2/1.png"),
          name: "车辆闸机",
          isActive: false,
        },
        {
          id: 2,
          icon: require("@/assets/images/sideBarLeft/2/2.png"),
          name: "车位统计",
          isActive: false,
        },
        {
          id: 3,
          icon: require("@/assets/images/sideBarLeft/2/3.png"),
          name: "班车信息",
          isActive: false,
        },
      ],

      // 顶部工具栏按钮
      headerToolsData: [
        {
          id: 1,
          icon: require("@/assets/images/headerTool/2-1.png"),
          title: "园区总人数",
          content: "20067",
        },
        {
          id: 2,
          icon: require("@/assets/images/headerTool/2-2.png"),
          title: "剩余车位数",
          content: "856",
        },
        {
          id: 3,
          icon: require("@/assets/images/headerTool/2-3.png"),
          title: "员工无感通过率",
          content: "99.1%",
        },
        {
          id: 4,
          icon: require("@/assets/images/headerTool/2-4.png"),
          title: "平均人脸识别时长",
          content: "0.8s",
        },
      ],

       // 底部工具栏header名
      footerToolHeaderName: "便捷通行事件列表",
      // 底部工具栏header英文
      footerToolHeaderEn: "LIST OF CONVENIENT PASSAGE EVENTS",
      // 底部工具栏数据
      footerToolsData: [
        {
          id: 7,
          isActive:false,
          status: 2,
          icon: require("@/assets/images/footerTool/2-1.png"),
          title: "人员警示列表告警",
          time: "2025-07-03 14:42:54",
          position: "52防区",
          desc: "闸机处又警示列表人员试图同行,触发人脸识别...",
        },
        {
          id: 8,
          isActive:false,
          status: 2,
          icon: require("@/assets/images/footerTool/2-2.png"),
          title: "车辆警示列表告警",
          time: "2024-10-17 14:42:54",
          position: "15防区",
          desc: "15防区检测到警示车辆出现，触发告警，系统已",
        },
      ],
      personnelTypeData: {
        total: "16",
        text: "总人数",
        data: [
          {
            name: "员工",
            value: 1037,
            percent: 76,
          },
          {
            name: "访客",
            value: 106,
            percent: 4,
          },
          {
            name: "安保",
            value: 43,
            percent: 20,
          },
        ],
      },

      // 人员通行事件
      personEventData: [
        {
          img: require("@/assets/images/cartList/head.png"),
          name: "罗x",
          phone: "00500001",
          date: "2025-07-07 10:15:16",
          way: "手机",
        },
        {
          img: require("@/assets/images/cartList/head.png"),
          name: "张xx",
          phone: "00500002",
          date: "2025-07-07 10:15:16",
          way: "电脑",
        },
        {
          img: require("@/assets/images/cartList/head.png"),
          name: "李xx",
          phone: "00500003",
          date: "2025-07-07 10:15:16",
          way: "平板",
        },
        {
          img: require("@/assets/images/cartList/head.png"),
          name: "王xx",
          phone: "00500004",
          date: "2025-07-07 10:15:16",
          way: "工卡",
        },
        {
          img: require("@/assets/images/cartList/head.png"),
          name: "赵xx",
          phone: "00500005",
          date: "2025-07-07 10:15:16",
          way: "人脸",
        },
        {
          img: require("@/assets/images/cartList/head.png"),
          name: "钱xx",
          phone: "00500006",
          date: "2025-07-07 10:15:16",
          way: "手机",
        },
        {
          img: require("@/assets/images/cartList/head.png"),
          name: "孙xx",
          phone: "00500007",
          date: "2025-07-07 10:15:16",
          way: "平板",
        },
      ],

      // 車輛通行事件
      carnEventData: [
        {
          img: require("@/assets/images/cartList/car.png"),
          carId: "川AAF4417",
          date: "2025-07-07 10:15:16",
        },
        {
          img: require("@/assets/images/cartList/car.png"),
          carId: "川AAF4418",
          date: "2025-07-07 10:15:16",
        },
        {
          img: require("@/assets/images/cartList/car.png"),
          carId: "川AAF4419",
          date: "2025-07-07 10:15:16",
        },
      ],

      //人員通行流量統計
      personnelFlowData: {
        optionData: {
          xData: ["06:00", "09:00", "12:00", "15:00", "18:00", "21:00"],
          yData: [
            {
              name: "出园",
              data: [10000, 20000, 40000, 10000, 20000, 15000],
            },
            {
              name: "入园",
              data: [30000, 20000, 30000, 10000, 50000, 11000],
            },
          ],
          ySet: {
            min: 0,
            max: 50000,
            interval: 10000,
          },
        },
      },

      carFlowData: {
        xData: ["06:00", "09:00", "12:00", "15:00", "18:00", "21:00"],
        yData: [
          {
            name: "出园",
            data: [1000, 2000, 1000, 1000, 2000, 2500],
            color: "#FEC551",
          },
          {
            name: "入园",
            data: [4000, 2000, 3000, 1000, 2000, 3100],
            color: "#2195E0",
          },
        ],
      },

      personnelFlowStatusData: {
        // 告警统计
        GaugeOption: [
          {
            color: "#FEC551",
            data: {
              value: 4366,
              total: 20002,
            },
            text: "待处理",
          },
          {
            color: "#86E0ED",
            data: {
              value: 8371,
              total: 20002,
            },
            text: "处理中",
          },
          {
            color: "#2195E0",
            data: {
              value: 5809,
              total: 18000,
            },
            text: "已完成",
          },
        ],
      },

      carPassData: {
        // 告警统计
        GaugeOption: [
          {
            color: "#FEC551",
            data: {
              value: 4366,
              total: 20002,
            },
            text: "待处理",
          },
          {
            color: "#86E0ED",
            data: {
              value: 8371,
              total: 20002,
            },
            text: "处理中",
          },
          {
            color: "#2195E0",
            data: {
              value: 5809,
              total: 18000,
            },
            text: "已完成",
          },
          {
            color: "#FEC551",
            data: {
              value: 4366,
              total: 20002,
            },
            text: "待处理",
          },
          {
            color: "#86E0ED",
            data: {
              value: 8371,
              total: 20002,
            },
            text: "处理中",
          },
          {
            color: "#2195E0",
            data: {
              value: 5809,
              total: 18000,
            },
            text: "已完成",
          },
        ],
      },

      // 人员通行类型
      personnelPassTypeData: {
        // 告警统计
        alarmNumberTotal: 156,
        GaugeOption: [
          {
            id: 1,
            color: "#FEC551",
            data: {
              value: 4366,
              total: 17826,
            },
            text: "人臉",
          },
          {
            id: 2,
            color: "#86E0ED",
            data: {
              value: 63,
              total: 17826,
            },
            text: "工卡",
          },
          {
            id: 3,
            color: "#2195E0",
            data: {
              value: 87,
              total: 17826,
            },
            text: "手機",
          },
        ],
      },

      // 停车位管理数据
      carParkData: {
        parkNumberTotal: 12809,
        titleBgImg: require("@/assets/images/bjtx/title_bg.png"),
        titleIconImg: require("@/assets/images/bjtx/carIcon.png"),
        dataList: [
          { status: "占用中", value: 1097, percent: 53 },
          { status: "空闲中", value: 965, percent: 47 },
        ],
        statusColors: {
          占用中: "rgb(205, 214, 241)",
          空闲中: "rgb(134, 224, 237)",
        },
        statusImages: {
          占用中: require("@/assets/images/progress/1.png"),
          空闲中: require("@/assets/images/progress/2.png"),
        },
      },
    };
  },

  mounted() { },
  computed: {
    ...mapState(['trackPath']),
  },
  async beforeDestroy() {
    // 清除所有工具对象
    // 清除所有
    await this.closeAll();
    await resetCamera();
  },
  methods: {
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
      console.log("点击侧栏", this.footerToolsData);


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
      }
    },


  }
};
</script>
