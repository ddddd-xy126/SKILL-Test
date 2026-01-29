
// WDP API 混入模板
import { addPOI, addWINDOWS, addParticle } from "@utilsWdpApi/entity";
import { splitBuildByName, customStatus, customFn } from "@utilsWdpApi/custom";
import { deleteObjs, deleteTypes, ClearByEids } from "@utilsWdpApi/delete";
import { setSceneWeather, setSceneTime } from "@utilsWdpApi/tool.js";
import { FocusByCustomId, FocusByPoints } from "@utilsWdpApi/camera";
import EnergyFlow from "../components/energy-flow.vue";
import toolCleanupMixin from "../../../../mixins/toolCleanupMixin";
import store from "@/store/index";
import { countSize } from "@/utils/countSize.js";

export default {
  mixins: [toolCleanupMixin],
  data() {
    return {
      // id对应方法
      toolHandlers: {
        1: this.powerEquipment,
        2: this.energyFlowOpen,
        3: this.dutyPerson,
        7: this.footerTool,
      },
      // id对应数据
      toolData: {
        1: {
          camera: {
            location: [
              113.71337817601409, 34.77260454653661, 94.63383082594711,
            ],
            pitch: -53.89999771118164,
            yaw: 173.16867065429688,
            distance: 0,
          },
          powerInfo: [
            {
              id: 1,
              location: [
                113.71288593940703, 34.77275274155799, 19.14459637095126,
              ],
              markerConfig: {
                markerNormalUrl: "monitor.png",
                markerActivateUrl: "monitor_active.png",
                markerSize: [40, 40],
              },
              info: {
                title: "AI摄像头",
              },
            },
            {
              id: 2,
              location: [113.71271735397187, 34.772466936833894, 19.137180759899394],
              markerConfig: {
                markerNormalUrl: "power_equipment.png",
                markerActivateUrl: "power_equipment_active.png",
                markerSize: [40, 40],
              },
              info: {
                title: "4#变电柜",
                markerConfig: {
                  markerNormalUrl: "power_equipment_device.png",
                  markerActivateUrl: "power_equipment_device_active.png",
                  markerSize: [40, 40],

                },
                isShow: false
              },
            },
            {
              id: 3,
              location: [113.71269687125994, 34.772583298301996, 19.12148231232381],
              markerConfig: {
                markerNormalUrl: "power_equipment.png",
                markerActivateUrl: "power_equipment_active.png",
                markerSize: [40, 40],
              },
              info: {
                title: "4#变电柜",
                markerConfig: {
                  markerNormalUrl: "power_equipment_device.png",
                  markerActivateUrl: "power_equipment_device_active.png",
                  markerSize: [100, 40],
                },
                isShow: false
              },
            },
          ],
        },
        2: {
          camera: {
            location: [113.72267849006319, 34.771699294589595, 1934.072950139263],
            pitch: -87.49873352050781,
            yaw: -116.0493392944336,
            distance: 0,
          },
        },

        3: {
          camera: {
            location: [
              113.71331332738409, 34.77259940099186, 98.97149919166296,
            ],
            pitch: -58.099365234375,
            yaw: 173.0006866455078,
            distance: 0,
          },
          markerConfig: {
            markerNormalUrl: "duty_person.png",
            markerActivateUrl: "duty_person_active.png",
            markerSize: [40, 40],
          },
          personInfo: [
            {
              location: [
                113.71287069784645, 34.77274618694148, 19.144575710594555,
              ],
              info: {
                name: "陈*生",
                workNumber: "wa1312321",
                phone: "183****3245",
              },
            },
            {
              location: [
                113.71294351653584, 34.772341108770725, 19.124246073492014,
              ],
              info: {
                name: "田*奇",
                workNumber: "wa312321 32",
                phone: "151****1234",
              },
            },
            {
              location: [
                113.71256589183406, 34.772300203350184, 19.117505390211,
              ],
              info: {
                name: "邹*雄",
                workNumber: "wa4857853",
                phone: "131****3224",
              },
            },
          ],
        },
        7: {
          poi: [113.71294020475327, 34.7723291765813, 19.125423440162322],
          camera: {
            location: [113.71318894344793, 34.7724093570489, 60.80889861541148],
            pitch: -56.899505615234375,
            yaw: 171.42559814453125,
            distance: 0,
          },
          footerToolData: [
            {
              id: 1,
              headerStatus: "紧急",
              title: "设备异常告警",
              warningNumber: "001515155295",
              warningType: "警示",
              warningLocations: "38防区",
              reporter: "系统自动上报",
              eventDetail:
                "15防区围栏处有人员试图翻阅，触发视频周界告警，系统已自动",
            },
          ],
        },
      },

      //对象存储
      toolObjs: {
        1: [],
        2: [],
        3: [],
        7: [],
      },
    };
  },

  methods: {
    // 关闭所有点位、窗口、特效等
    async closeAll(val) {
      console.log("关闭所有点位、窗口、特效等");

      this.$store.commit("isShowWindow", { isShow: false });
      // 通用清空方法，清空所有对象，清空所有类型,根据全局Eid删除window
      await this.performCommonCleanup();

      // 下方是定制api的删除
      // 关闭定制api
      let setDarkenStatus = store.state.setDarkenStatus;
      // console.log(setDarkenStatus,'setDarkenStatus1111111')
      if (setDarkenStatus.status && setDarkenStatus.apiFuncName !== "Demo_DarkenScence") {
        await customStatus(setDarkenStatus.apiFuncName, false);
        // 清空状态
        store.commit("setDarkenStatus", {});
      } else if (setDarkenStatus.status && !(
        this.activeItem &&
        val &&
        this.activeItem.id !== val.id &&
        [3, 7].includes(this.activeItem.id) &&
        [3, 7].includes(val.id)
      )) {
        await customStatus(setDarkenStatus.apiFuncName, false);
        // 清空状态
        store.commit("setDarkenStatus", {});
      }

      // 拆楼
      if (
        !(
          this.activeItem &&
          val &&
          this.activeItem.id !== val.id &&
          [1, 3, 7].includes(this.activeItem.id) &&
          [1, 3, 7].includes(val.id)
        )
      ) {
        await splitBuildByName("SH_HWLQH_F12", 10);
      }
      if (!val) {
        await splitBuildByName("SH_HWLQH_F12", 10);
        await customStatus(setDarkenStatus.apiFuncName, false);
        // 清空状态
        store.commit("setDarkenStatus", {});
      }
      // energyFlow
      this.isEnergyFlowVisible = false;

      if (!val || val.id !== 1 || val.id === 1 && !val.isActive) {
        await setSceneTime('8:30', false);
      }
      await customFn("NXGL_NLT", { "State": false });
      await customFn("Demo_Crystal", { "State": false });
      await customFn("NXGL_GDYCGJ", { "State": false });
    },
    async splitBuild(build_id, floor) {
      const res = await splitBuildByName(build_id, floor);
    },

    // 供电设备
    async powerEquipment(data, index) {
      // 聚焦
      await FocusByPoints(
        data.camera.location,
        data.camera.distance,
        data.camera.pitch,
        data.camera.yaw
      );
      // 拆楼
      await splitBuildByName("SH_HWLQH_F12", 3);
      // 加特效
      await customStatus("NXGL_GDSS", true);
      // 加poi点
      for (let i in data.powerInfo) {
        const power = data.powerInfo[i];
        // 添加POI
        const poiRes = await addPOI(
          [power.location],
          "powerEquipment",
          22,
          power.title,
          [power.info],
          power.markerConfig,
          "ground"
        );
        let poiObj = null;
        if (poiRes.success) {
          this.toolObjs[index].push(...poiRes.result.objects);
          poiObj = poiRes.result.objects[0];
        } else {
          console.error("添加供电设备POI失败:", poiRes);
        }

        // 绑定点击事件
        if (poiObj) {
          poiObj.onClick(async () => {
            console.log(power.info, "power");

            console.log(data.powerInfo[i], 'data.powerInfo[i]')
            // 使用Vue.set或this.$set来触发响应式更新
            this.$set(this.toolData[index].powerInfo[i], 'info', {
              ...this.toolData[index].powerInfo[i].info,
              isShow: !this.toolData[index].powerInfo[i].info.isShow
            });
            console.log(this.toolData[index].powerInfo, 'updated powerInfo')

            if (power.info.title == "AI摄像头") {
              await FocusByPoints(
                power.location,
                data.camera.distance + 120,
                -59.89999771118164,
                173.16867065429688
              );
              // 添加窗口
              const windowParams = {
                title: power.info.title,
                url: process.env.VUE_APP_WINDOW_VIDEO_BASE_URL,
                type: "type1",
                customParams: power.info,
              };
              const res = await addWINDOWS(
                power.location,
                poiObj.BasicInfoAtom.entityName,
                "myId" + i,
                [250, 190],
                power.location[2] + 1.7,
                windowParams
              );
              this.$store.commit("setWindowEid", res.result.object.Eid);
            } else {
              let labelBgImageUrl
              // console.log(power.info.isShow, 'power.info.isShow')
              if (power.info.isShow) {
                labelBgImageUrl = ""
              } else {
                labelBgImageUrl = "https://51world-1371713115.cos.ap-guangzhou.myqcloud.com/729/power_equipment_device.png"
              }
              const data = {
                "poiStyle": {
                  "labelBgImageUrl": labelBgImageUrl,
                  "labelBgSize": [countSize(90), countSize(29.65)],
                  "labelBgOffset": [countSize(25), countSize(40)]
                }
              }
              const res = await poiObj.Update(data)
              if (res.success) {
                console.log("用户更新label成功:", res);
              } else {
                console.error("用户更新label失败", res);
              }
            }
          });
        }
      }
    },
    async dutyPerson(data, index) {
      // 聚焦与拆楼
      console.log(data, "dutyPerson");
      await FocusByPoints(
        data.camera.location,
        data.camera.distance,
        data.camera.pitch,
        data.camera.yaw
      );
      await splitBuildByName("SH_HWLQH_F12", 3);
      await customStatus("Demo_DarkenScence", true);

      // 值班人员POI添加
      for (let i in data.personInfo) {
        const person = data.personInfo[i];
        // 添加POI
        const poiRes = await addPOI(
          [person.location],
          "dutyPerson",
          person.location[2],
          "值班人员",
          [person.info],
          data.markerConfig
        );
        let poiObj = null;
        if (poiRes.success) {
          this.toolObjs[index].push(...poiRes.result.objects);
          poiObj = poiRes.result.objects[0];
        } else {
          console.error("添加值班人员POI失败:", poiRes);
        }

        // 绑定点击事件
        if (poiObj) {
          console.log("poiObj321313321312312312321", poiObj);
          poiObj.onClick(async () => {
            await FocusByPoints(
              person.location,
              data.camera.distance + 90,
              -59.89999771118164,
              173.16867065429688
            );
            const customData = JSON.parse(poiObj.BasicInfoAtom.customData);
            // 添加窗口
            const windowParams = {
              title: `值班人员${Number(i) + 1}`,
              // url: process.env.VUE_APP_WINDOW_VIDEO_BASE_URL,
              type: "type3",
              bgType: "bg3",
              customParams: customData,
            };
            const res = await addWINDOWS(
              person.location,
              poiObj.BasicInfoAtom.entityName,
              "myId" + i,
              [290, 190],
              person.location[2] + 1.7,
              windowParams
            );
            this.$store.commit("setWindowEid", res.result.object.Eid);
          });
        }
      }
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

    async energyFlowOpen(data, index) {
      // this.isEnergyFlowVisible = true;
      // 聚焦
      await FocusByPoints(
        data.camera.location,
        data.camera.distance,
        data.camera.pitch,
        data.camera.yaw
      );
      setTimeout(async () => {
        await customFn("Demo_Crystal", { "State": true });
      }, 1000);

      // await customFn("NXGL_NLT", { "State": true });
      setTimeout(async () => {
        await customFn("NXGL_NLT", { "State": true });
      }, 1500);
    },

    // 底部预警
    async footerTool(data, index) {

      // 不同下标对应不同效果
      switch (index) {
        case 7:

          await splitBuildByName("SH_HWLQH_F12", 3);
          await FocusByPoints(
            data.camera.location,
            data.camera.distance,
            data.camera.pitch,
            data.camera.yaw
          );
          await customStatus("Demo_DarkenScence", true);
          setTimeout(async () => {
            await customFn("NXGL_GDYCGJ", { "State": true });
          }, 1500);
          break;
      }

      // 添加窗口
      const windowParams = {
        title: data.footerToolData[0].title,
        url: process.env.VUE_APP_WINDOW_VIDEO_BASE_URL,
        type: "type2",
        bgType: "bg2",
        customParams: { ...data.footerToolData[0], location: data.poi },
      };
      const res = await addWINDOWS(
        data.poi,
        data.footerToolData[0].title,
        Math.random(),
        [355, 220],
        data.poi[2] + 1.7,
        windowParams,
        [-120, 300]
      );
      this.$store.commit("setWindowEid", res.result.object.Eid);
      console.log("添加窗口成功:", res);
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


