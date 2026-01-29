// WDP API 混入模板
import { addPOI, addWINDOWS, addPath, addParticle } from "@utilsWdpApi/entity";
import { deleteTypes, deleteObjs } from "@utilsWdpApi/delete";
import { FocusByPoints } from "@utilsWdpApi/camera";
import store from "../../../../store/index";
import {
  splitBuildByName,
  customStatus,
  customFn,
  customWarningStatus,
} from "@utilsWdpApi/custom";
import toolCleanupMixin from "../../../../mixins/toolCleanupMixin";

export default {
  mixins: [toolCleanupMixin],
  data() {
    return {
      isBusPathOpen: false,
      // id对应方法
      toolHandlers: {
        1: this.carGate,
        2: this.parkStatistic,
        3: this.busMessage,
        7: this.footerTool,
        8: this.footerTool,
      },
      // id对应数据
      toolData: {
        1: {
          poi: [
            [113.72433240565438, 34.771076512364175, 5],
            [113.72431352962454, 34.771014179771534, 4],
          ],
          markerConfig: {
            markerNormalUrl: "carGate.png",
            markerActivateUrl: "carGate_active.png",
          },
          camera: {
            location: [
              113.72443959367573, 34.77086370859266, 12.445804496719896,
            ],
            pitch: -24.806760787963867,
            yaw: -115.24739837646484,
            distance: 0,
          },
        },
        2: {
          parkInfo: [
            {
              parkNumber: 12809,
              availablePark: 897,
            },
          ],
          markerConfig: {
            markerNormalUrl: "park.png",
            markerActivateUrl: "park_active.png",
          },
          poi: [[113.7138756242834,34.771716442608465,1.5629887307770776]],
          camera: {
            location: [
              113.71560497668416, 34.772617278268349, 457.60194168903189,
            ],
            pitch: -69.050094604492188,
            yaw: 177.96778869628906,
            distance: 0,
          },
        },
        3: {
          poi: [
            [113.71238032084851, 34.771620098821458, 0],
            // [113.71293418884632, 34.772053792018291, 0],
            // [113.71454094594665, 34.773838595660166, 0],
          ],
          camera: {
            location: [
              113.71532046501484, 34.77244700540372, 426.0482791445021,
            ],
            pitch: -66.64999389648438,
            yaw: -179.7812957763672,
            distance: 0,
          },
          markerConfig: {
            markerNormalUrl: "bus_message.png",
            markerActivateUrl: "bus_message_active.png",
          },
          busMessageData: [
            {
              name: "高峰线路1线",
              headerRight: "下一站：10分钟，5站",
              site: [
                "F12",
                "F9",
                "G20",
                "G4",
                "G20",
                "大道",
                "G1",
                "G4",
                "H1",
                "A9",
                "A5",
                "A3",
              ],
            },
            {
              name: "高峰线路2线",
              headerRight: "下一站：5分钟，3站",
              site: [
                "B6",
                "C4",
                "C6",
                "D3",
                "D10",
                "D7",
                "E11",
                "E4",
                "E8",
                "F2",
                "F12",
                "F9",
              ],
            },
            {
              name: "高峰线路3线",
              headerRight: "下一站：8分钟，4站",
              site: [
                "F12",
                "F9",
                "G20",
                "G4",
                "F9",
                "G20",
                "G1",
                "G4",
                "H1",
                "A9",
                "A5",
                "A3",
                "B1",
                "B11",
              ],
            },
          ],
        },
        7: [[113.71276020508644, 34.77236333438645, 9.027407896184505]],
        8: [[113.73217727915828, 34.774195865312926, 0]],
      },
      //类型存储
      toolTypes: {
        1: [],
        3: [],
        7: [],
        8: [],
      },

      //对象存储
      toolObjs: {
        1: [],
        2: [],
        3: [],
        7: [],
        8: [],
      },
      App: null,

      footerToolData: [
        {
          id: 1,
          isPath: true,
          headerStatus: "紧急",
          title: "人员警示列表告警",
          warningNumber: "001515155295",
          warningType: "警示",
          warningLocations: "52防区",
          reporter: "系统自动上报",
          eventDetail:
            "52防区围栏处有人员试图翻阅，触发视频周界告警，系统已自动",
        },
        {
          id: 2,
          isPath: true,
          headerStatus: "紧急",
          pathNumber: 0,
          title: "车辆警示列表告警",
          warningNumber: "001515155296",
          warningType: "巡检",
          warningLocations: "15防区",
          reporter: "系统自动上报",
          eventDetail:
            "15防区围栏处有人员试图翻阅，触发视频巡检告警，系统已自动",
        },
      ],
    };
  },

  methods: {
    // 关闭所有点位、窗口、特效等
    async closeAll() {
      this.isBusPathOpen = false;
      console.log("关闭所有点位、窗口、特效等");

      this.$store.commit("isShowWindow", { isShow: false });
      // 通用清空方法，清空所有对象，清空所有类型,根据全局Eid删除window
      await this.performCommonCleanup();

      // 下方是定制api的删除
      // 关闭定制api
      let setDarkenStatus = store.state.setDarkenStatus;
      // console.log(setDarkenStatus,'setDarkenStatus1111111')
      if (setDarkenStatus.status) {
        // console.log('!!!wozoula',setDarkenStatus)
        await customStatus(setDarkenStatus.apiFuncName, false);
        // 清空状态
        store.commit("setDarkenStatus", {});
      }

      // 取消车位统计拆楼
      await splitBuildByName("SH_HWLQH_F12", 10);

      // 关闭底部预警
      await customWarningStatus("BJTX_RYJSLB", "Effect", false);
      await customWarningStatus("BJTX_RYJSLB", "Road", false);
      await customWarningStatus("BJTX_CLJSLB", "Effect", false);
      await customWarningStatus("BJTX_CLJSLB", "Road", false);
    },

    // 车辆闸机
    async carGate(data, index) {
      const poiResult = await addPOI(
        data.poi,
        "car",
        0,
        "车辆闸机",
        null,
        data.markerConfig
      );
      if (poiResult.success) {
        this.toolObjs[index].push(...poiResult.result.objects);
        await FocusByPoints(
          data.camera.location,
          data.camera.distance,
          data.camera.pitch,
          data.camera.yaw
        );
        setTimeout(async () => {
          await customStatus("BJTX_CLZJ", true);
          // 全局存入当前点亮的按钮BJTX_CLZJ：false
          // store.commit("setDarkenStatus", {
          //   apiFuncName: "BJTX_CLZJ",
          //   status: true,
          // });
        }, 1000);
      } else {
        console.error("POI添加失败:", poiResult.message);
      }

      this.toolObjs[index].forEach((e, i) => {
        e.onClick(async (ev) => {
          await FocusByPoints(
            data.poi[i],
            25,
            data.camera.pitch,
            data.camera.yaw
          );
          const windowParams = {
            title: e.BasicInfoAtom.entityName,
            url: process.env.VUE_APP_WINDOW_VIDEO_BASE_URL,
            type: "type1",
            customParams: {},
          };
          const res = await addWINDOWS(
            data.poi[i],
            "车辆闸机",
            Math.random(),
            [250, 190],
            data.poi[i][2] + 1.7,
            windowParams
          );
          this.$store.commit("setWindowEid", res.result.object.Eid);
          console.log(res, "添加窗口成功");
        });
      });
    },

    // 车位统计
    async parkStatistic(data, index) {
      await FocusByPoints(
        data.camera.location,
        data.camera.distance,
        data.camera.pitch,
        data.camera.yaw
      );
      await splitBuildByName("SH_HWLQH_F12", 0);

      setTimeout(async () => {
        await customStatus("BJTX_CWTJ", true);
      }, 1000);
      // 加点
      // const poiResult = await addPOI(
      //   data.poi,
      //   "car",
      //   3,
      //   "停车场",
      //   data.parkInfo,
      //   data.markerConfig
      // );
      // if (poiResult.success) {
      //   this.toolObjs[index].push(...poiResult.result.objects);
      //   // 聚焦
      //   await FocusByPoints(
      //     data.camera.location,
      //     data.camera.distance,
      //     data.camera.pitch,
      //     data.camera.yaw
      //   );
      //   // 拆楼
      //   await splitBuildByName("SH_HWLQH_F12", 0);

      //   setTimeout(async () => {
      //     await customStatus("BJTX_CWTJ", true);
      //   }, 1000);
      // } else {
      //   console.error("POI添加失败:", poiResult.message);
      // }
      // this.toolObjs[index].forEach((e, i) => {
      //   e.onClick(async (ev) => {
      // await FocusByPoints(
      //   data.poi[0],
      //   500,
      //   data.camera.pitch,
      //   data.camera.yaw
      // );
      const windowParams = {
        title: "停车场",
        type: "type5",
        bgType: "bg5_2",
        isShowCloseBtn: 'false',
        customParams: { ...data.parkInfo[0] },
      };
      const res = await addWINDOWS(
        data.poi[0],
        "停车场",
        Math.random(),
        [300, 150],
        data.poi[0][2] + 1.7,
        windowParams
      );
      this.$store.commit("setWindowEid", res.result.object.Eid);
      console.log(res, "添加窗口成功");
      //   });
      // });
    },

    // 班车信息
    async busMessage(data, index) {
      // 添加poi
      const poiResult = await addPOI(
        data.poi,
        null,
        3,
        "班车信息",
        data.busMessageData,
        data.markerConfig
      );
      if (poiResult.success) {
        this.toolObjs[index].push(...poiResult.result.objects);
      } else {
        console.error("POI添加失败:", poiResult.message);
      }
      await FocusByPoints(
        data.camera.location,
        data.camera.distance,
        data.camera.pitch,
        data.camera.yaw
      );
      let pathObj = [];
      // 点击事件
      this.toolObjs[index].forEach((e, i) => {
        e.onClick(async (ev) => {
          this.deleteByObjs(pathObj);

          console.log(i, "班车路线");

          if (!this.isBusPathOpen ) {
            this.isBusPathOpen = true;
            await customStatus("BJTX_BCXX", true);
            await FocusByPoints(
              [113.71359746222505, 34.77260933857449, 504.56619150297774],
              0,
              -89,
              -174.68130493164062
            );
          }

          // 添加窗口
          const windowParams = {
            title: data.busMessageData[i].name,
            type: "type4",
            bgType: "bg4",
            customParams: data.busMessageData[i],
          };
          const res = await addWINDOWS(
            data.poi[i],
            data.busMessageData[i].name,
            Math.random(),
            [380, 130],
            data.poi[i][2] + 1.7,
            windowParams,
            [30, 35]
          );
          this.$store.commit("setWindowEid", res.result.object.Eid);
          console.log(res, "添加窗口成功");
        });
      });
    },

    // 底部预警
    async footerTool(data, index) {
      // 查找对应的id数据
      const footerData = this.footerToolData.find(
        (item) => item.id === index - 6
      );

      // 不同下标对应不同效果
      switch (index) {
        case 7:
          await customWarningStatus("BJTX_RYJSLB", "Effect", true);
          // 聚焦
          FocusByPoints(
            [113.71277612492064, 34.772338390828715, 8.7893773041649013],
            0,
            -27.600553512573242,
            -113.9010009765625
          );
          break;
        case 8:
          await customWarningStatus("BJTX_CLJSLB", "Effect", true);
          FocusByPoints([113.73226177024421, 34.774073388195944, 20.878434843961553], 0, -62.599910736083984, -114.05047607421875);
          break;
      }

      // 添加窗口
      const windowParams = {
        title: footerData.title,
        url: process.env.VUE_APP_WINDOW_VIDEO_BASE_URL,
        type: "type2",
        bgType: "bg2",
        customParams: { ...footerData, location: data[0] },
      };
      const res = await addWINDOWS(
        data[0],
        footerData.title,
        Math.random(),
        [355, 220],
        data[0][2] + (index === 7 ? 0.2 : 2),
        windowParams,
        [-150, 200]
      );
      this.$store.commit("setWindowEid", res.result.object.Eid);
      console.log("添加窗口成功:", res);
    },

    async deleteByTypes(types) {
      try {
        const res = await deleteTypes(types);
        if (res.success) {
          console.log("删除操作成功:", res);
        } else {
          console.error("删除操作失败:", res);
        }
      } catch (error) {
        console.error("删除操作失败:", error);
      }
    },

    async deleteByObjs(objs) {
      const res = await deleteObjs(objs);
      if (res.success) {
        console.log("删除对象操作成功:", res);
      } else {
        console.error("删除对象操作失败:", res);
      }
    },
  },
  mounted() { },

  beforeDestroy() { },
};
