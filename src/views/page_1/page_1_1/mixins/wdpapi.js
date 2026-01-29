// WDP API 混入模板
import { addPOI, addRange, addWINDOWS } from "@utilsWdpApi/entity";
import { deleteObjs } from "@utilsWdpApi/delete";
import { FocusByCustomId, FocusByPoints, setCameraViewshed } from "@utilsWdpApi/camera";
import {
  customStatus,
  customFn,
  splitBuildByName,
  spawnEffect,
  aiBotRoute,
} from "@utilsWdpApi/custom";
import { mapState } from "vuex";
import store from "../../../../store/index";
import toolCleanupMixin from "../../../../mixins/toolCleanupMixin";

export default {
  mixins: [toolCleanupMixin],
  data() {
    return {
      // id对应方法
      toolHandlers: {
        1: this.aiBot,
        2: this.videoPerimeter,
        3: this.securityPersonnel,
        4: this.securityBooth,
        5: this.personGate,
        6: this.heatMap,
        7: this.footerVideo,
        8: this.footerAI,
      },
      // id对应数据
      toolData: {
        1: {
          point: [
            [113.714452608383, 34.77145141753328, 42.71300854531253],
            [113.71183429011548, 34.77245016912414, 28.90433318660411],
            [113.71368798265868, 34.773881968867656, 27.831635551406272],
          ],
          markerConfig: {
            markerNormalUrl: [
              "aiBot_icon.png",
              "aiBot_icon.png",
              "aiBot_icon.png",
            ],
            markerActivateUrl: [
              "aiBot_icon.png",
              "aiBot_icon.png",
              "aiBot_icon.png",
            ],
          },
          data: [
            {
              title: "AI机器人巡检画面1",
              url: "ws://localhost:9999",
            },
            {
              title: "AI机器人巡检画面2",
              url: "ws://localhost:9999",
            },
            {
              title: "AI机器人巡检画面3",
              url: "ws://localhost:9999",
            },
          ],
        },
        2: {
          data: [
            [113.7181691618882, 34.76834500864765, 0],
            [113.71923078076577, 34.768742507115263, 0],
            [113.72014550397768, 34.76912891466737, 0],
            [113.72116424584908, 34.769516804041416, 0],
            [113.72224815522945, 34.769960796861149, 0],
            [113.72327382786585, 34.770459754778621, 0],
            [113.7247192343206, 34.771050850376191, 0],
            [113.7257204808454, 34.771390045125855, 0],
            [113.72653049958473, 34.771721000602398, 0],
            [113.72756569457155, 34.772087171545628, 0],
            [113.72852453134021, 34.772479022527584, 0],
            [113.72987607240469, 34.773027111851633, 0],
            [113.73067926409421, 34.773346108365033, 0],
            [113.7316855015878, 34.773752361620751, 0],
            [113.73280140190539, 34.774185459941449, 0],
            [113.73408311006432, 34.774706953724483, 0],
            [113.73559072679764, 34.775317095489527, 0],
            [113.73593878495129, 34.776019216555227, 0],
            [113.73471086853669, 34.776756876753986, 0],
            [113.73353634542822, 34.777307424217042, 0],
            [113.73219543558497, 34.777845111011501, 0],
            [113.73114967668823, 34.778248349158886, 0],
            [113.72975140290765, 34.778808974211771, 0],
            [113.72872182111767, 34.779214151500703, 0],
            [113.72758874482645, 34.779786975468845, 0],
            [113.72656408173023, 34.779418757527402, 0],
            [113.72520385735791, 34.778921672626673, 0],
            [113.7241259508571, 34.778490662187437, 0],
            [113.72306740100991, 34.778120303320073, 0],
            [113.72137157443707, 34.777523822257912, 0],
            [113.72003295382012, 34.777022806235834, 0],
            [113.71886906504248, 34.776592789972298, 0],
            [113.71781788658291, 34.776207686120721, 0],
            [113.71691212197646, 34.775884874099383, 0],
            [113.71609427838392, 34.775572821286048, 0],
            [113.7152077033423, 34.775254153015112, 0],
            [113.71424863482329, 34.774905430889866, 0],
            [113.71317556925506, 34.774515719001286, 0],
            [113.71220829089735, 34.774162265052816, 0],
            [113.71108989837167, 34.773733402063016, 0],
            [113.70993242247275, 34.773308718633864, 0],
            [113.70891794872392, 34.77291176937198, 0],
            [113.70921008206007, 34.772320904439411, 0],
            [113.70964434518804, 34.771523540524832, 0],
            [113.71020427315392, 34.770731933836913, 0],
            [113.71068769492534, 34.770025573030878, 0],
            [113.71112759626148, 34.76932182456644, 0],
            [113.71154376611833, 34.76848718793665, 0],
            [113.71196946337601, 34.76761138405579, 0],
            [113.71239955876059, 34.766783693396285, 0],
            [113.71324827299874, 34.765959699154223, 0],
            [113.71438538753155, 34.766480630553005, 0],
            [113.71528843318161, 34.766953845131283, 0],
            [113.71625293506365, 34.767455266412036, 0],
            [113.71725066083079, 34.767945693046748, 0],
          ],
          markerConfig: {
            markerNormalUrl: "monitor.png",
            markerActivateUrl: "monitor_active.png",
          },
        },
        3: {
          data: [
            [113.71040586290705, 34.771306128804, 0],
            [113.71331380622433, 34.77082552300058, 0],
            [113.71243645425815, 34.7736691975844, 0],
          ],
          personnelInfoArray: [
            {
              name: "王鑫",
              workNumber: "89898989889",
              phone: "1898173333",
            },
            {
              name: "王乐乐",
              workNumber: "89898989889",
              phone: "1898173333",
            },
            {
              name: "王佳佳",
              workNumber: "89898989889",
              phone: "1898173333",
            },
          ],
          markerConfig: {
            markerNormalUrl: "security_personnel.png",
            markerActivateUrl: "security_personnel_active.png",
          },
        },
        4: {
          data: [[113.71128657197166, 34.771501127933334, 11.573811884531251]],
          boothInfoArray: [
            {
              name: "江某辉",
              workNumber: "755090027",
              phone: "135****0548",
              headerTag: "大门形象岗",
            },
          ],
          markerConfig: {
            markerNormalUrl: "security_booth.png",
            markerActivateUrl: "security_booth_active.png",
          },
        },
        5: {
          location: [[113.71276078327969, 34.772362149093965, 8]],
          markerConfig: {
            markerNormalUrl: "person_gate_normal.png",
            markerActivateUrl: "person_gate_active.png",
          },
        },
        6: {
          camera: {
            location: [
              113.71264585869423, 34.77252307670317, 97.51298896991864,
            ],
            pitch: -83.4582290649414,
            yaw: -7.131307125091553,
            distance: 10,
          },
        },
        7: {
          poi: [113.71548223634232, 34.77485783976573, 4.213086786875],
          markerNormalUrl: "monitor_red.png",
          footerData: {
            headerStatus: "紧急",
            title: "视频周界预警",
            warningNumber: "001515155295",
            warningType: "周界",
            warningLocations: "26防区",
            reporter: "系统自动上报",
            eventDetail:
              "26防区围栏处有人员试图翻阅，触发视频周界告警，系统已自动",
          },
        },
        8: {
          footerData: {
            headerStatus: "紧急",
            pathNumber: 0,
            title: "机器人巡检预警",
            warningNumber: "001515155296",
            warningType: "巡检",
            warningLocations: "16防区",
            reporter: "24号机器人",
            eventDetail:
              "16防区围栏处有人员试图翻阅，触发视频巡检告警，系统已自动",
          },
        },
      },
      //类型存储
      toolTypes: {
        2: [],
        5: [],
        7: [],
        8: [],
      },

      //对象存储
      toolObjs: {
        1: [],
        2: [],
        3: [],
        4: [],
        5: [],
        7: [],
        8: [],
      },

      aiBotStatus: {
        runningId: null,
      },

      App: null,
    };
  },
  computed: {
    ...mapState(["isShowWebTwo", "isShowWindow"]),
  },
  methods: {
    // 关闭所有点位、窗口、特效等
    async closeAll() {
      console.log("关闭所有点位、窗口、特效等");
      this.$store.commit("setAiBotWindowId", 0);

      // 通用清空方法，清空所有对象，清空所有类型,根据全局Eid删除window
      await this.performCommonCleanup();

      // 下方是定制api的删除
      // 关闭定制api
      let setDarkenStatus = store.state.setDarkenStatus;
      // console.log(setDarkenStatus,'setDarkenStatus1111111')
      if (setDarkenStatus.status) {

        if (["ZHAF_AIJQR_DarkenScence", 'ZHAF_HeatMap_Person', 'ZHAF_AFGT_DarkenBuilding', 'ZHAF_SPZJ'].includes(setDarkenStatus.apiFuncName)) {
          setTimeout(async () => {
            await customStatus(setDarkenStatus.apiFuncName, false);
            // 清空状态
            store.commit("setDarkenStatus", {});
          }, 300);
        } else {
          await customStatus(setDarkenStatus.apiFuncName, false);
          // 清空状态
          store.commit("setDarkenStatus", {});
        }

      }

      this.$store.commit("isShowWindow", { isShow: false });

      if (this.aiBotStatus.runningId) {
        await aiBotRoute(this.aiBotStatus.runningId, "Stop", 1);
        this.aiBotStatus.runningId = null;
      }

      // 关闭视频周界预警特效
      const poi = this.toolData[7].poi;
      await spawnEffect("ZHAF_SPZJYJ_SpawnEffect", "1", "delete", poi, "1");

      // 关闭机器人巡更告警
      if (
        store.state.aiBotRouteState !== "Stop" &&
        store.state.aiBotRouteState !== null
      ) {
        await aiBotRoute(1, "Stop", 1);
      }
      this.$store.commit("isShowWebTwo", { isShow: false });

      // 关闭人员热力拆楼
      await splitBuildByName("SH_HWLQH_F12", 10);
    },

    async aiBot(data, index) {
      for (let i in data.point) {
        const poiRes = await addPOI(
          [data.point[i]],
          "point",
          3,
          "起始点",
          null,
          {
            markerNormalUrl: data.markerConfig.markerNormalUrl[i],
            markerActivateUrl: data.markerConfig.markerActivateUrl[i],
            markerSize: [117, 30],
          }
        );
        let poiObj = null;
        if (poiRes.success) {
          this.toolObjs[index].push(...poiRes.result.objects);
          poiObj = poiRes.result.objects[0];
          console.log("起始点POI添加成功:", poiObj);
        } else {
          console.error("POI添加失败:", poiRes.message);
        }

        // 点击poi点击事件
        if (poiObj) {
          poiObj.onClick(async (ev) => {
            deleteObjs(this.toolObjs[index]);
            this.toolObjs[index] = [];

            await customStatus("ZHAF_AIJQR_DarkenScence", false);
            this.$store.commit("setDarkenStatus", {});

            const res = await aiBotRoute(Number(i) + 1, "Play", 1);

            if (res.success) {
              setTimeout(() => {
                this.$store.commit("isShowWebTwo", {
                  isShow: true,
                  config: data.data[i],
                });
                this.$store.commit("setAiBotWindowId", index);
              }, 500);
            }

            this.aiBotStatus.runningId = Number(i) + 1;
          });
        }
      }
      await FocusByPoints(
        [113.71463434452468, 34.76917732076074, 344.2126019869769],
        0,
        -45.900001525878906,
        -103.20000457763672
      );
      // 飞过去再压暗
      setTimeout(async () => {
        await customStatus("ZHAF_AIJQR_DarkenScence", true);
      }, 1000);
    },

    async poiAndRange(data, index, type = "video") {
      const poiData = data.data;
      console.log(poiData, type, data.markerConfig, "poiData");
      //添加poi点位的返回结果
      const poiResult = await addPOI(
        poiData,
        type,
        3,
        "摄像头",
        null,
        data.markerConfig
      );
      const resultTypesList = this.toolTypes[index];
      const resultObjsList = this.toolObjs[index];
      if (poiResult.success) {
        console.log(poiResult, "poi添加成功");
        resultTypesList.push("Poi");
        resultObjsList.push(...poiResult.result.objects);
        poiResult.result.objects.forEach(async (ev, i) => {
          //  为每个poi点位添加点击回调事件
          ev.onClick(async () => {
            // 聚焦
            await FocusByPoints(poiData[i], 100, -69.037109375, 176.19281005859375);
            // 添加可视域
            await setCameraViewshed(poiData[i]);
            // 添加窗口
            const windowParams = {
              title: `AI摄像头${Number(i) + 1}`,
              url: process.env.VUE_APP_WINDOW_VIDEO_BASE_URL,
              type: "type1",
            };
            const windowRes = await addWINDOWS(
              poiData[i],
              `AI摄像头${Number(i) + 1}`,
              i,
              [250, 190],
              poiData[i] + 1.7,
              windowParams
            );
            // windowObj = windowRes.result.object;
            this.$store.commit("setWindowEid", windowRes.result.object.Eid);
            console.log(windowRes, "添加窗口成功");
          });
        });
      } else {
        console.error("POI添加失败:", poiResult.message);
      }

      const rangeResult = await addRange(data);
      if (rangeResult.success) {
        resultTypesList.push("Range");
        resultObjsList.push(rangeResult.result.object);
      } else {
        console.error("区域轮廓添加失败:", rangeResult.message);
      }

      return {
        success: poiResult.success && rangeResult.success,
        poiResult,
      };
    },
    async videoPerimeter(data, index) {
      const { poiResult, success } = await this.poiAndRange(
        data,
        index,
        "videoWarning"
      );
      if (success) {
        // // 都成功则调用聚焦操作
        const location = [
          113.72618008676687, 34.76500457249732, 1026.517224103171,
        ];
        await FocusByPoints(
          location,
          0,
          -44.299659729003906,
          -116.39997100830078
        );
        setTimeout(async () => {
          await customStatus("ZHAF_SPZJ", true);
        }, 1000);
      }
    },
    // 安保人员
    async securityPersonnel(data, index) {
      const poiData = data.data;
      const personInfoData = data.personnelInfoArray;
      const markerConfig = data.markerConfig;

      //添加poi点位的返回结果
      const poiResult = await addPOI(
        poiData,
        "person",
        3,
        "安防人员",
        personInfoData,
        markerConfig
      );
      const resultObjsList = this.toolObjs[index];
      if (poiResult.success) {
        console.log("POI添加成功312313131:", poiResult);
        resultObjsList.push(...poiResult.result.objects);
        if (poiData.length > 1) {
          let customId = [];
          poiResult.result.objects.forEach((ev) => {
            customId.push(ev.BasicInfoAtom.customId);
          });
          FocusByCustomId(
            customId,
            -179.3999786376953,
            -37.45000076293945,
            0.5
          );
        } else if (poiData.length === 1) {
          FocusByPoints(
            poiData[0],
            300,
            -37.45000076293945,
            -179.3999786376953
          );
        }
      } else {
        console.error("POI添加失败:", poiResult.message);
      }

      this.toolObjs[index].forEach((e, i) => {
        e.onClick(async (ev) => {
          // 第二个参distance,第三个参pitch，第四个参yaw
          await FocusByPoints(
            poiData[i],
            300,
            -37.45000076293945,
            -179.3999786376953
          );

          const customData = JSON.parse(e.BasicInfoAtom.customData);
          const windowParams = {
            title: e.BasicInfoAtom.entityName,
            type: "type3",
            bgType: "bg3",
            customParams: customData,
          };
          const res = await addWINDOWS(
            poiData[i],
            e.BasicInfoAtom.entityName,
            1,
            [290, 190],
            poiData[i][2] + 1.7,
            windowParams
          );
          this.$store.commit("setWindowEid", res.result.object.Eid);
          console.log(res, "添加窗口成功");
        });
      });
    },
    // 安保岗亭
    async securityBooth(data, index) {
      const poiData = data.data;
      const boothInfoData = data.boothInfoArray;
      const markerConfig = data.markerConfig;

      //添加poi点位的返回结果
      const poiResult = await addPOI(
        poiData,
        "securityBooth",
        0,
        "安保岗亭",
        boothInfoData,
        markerConfig,
      );
      const resultObjsList = this.toolObjs[index];
      if (poiResult.success) {
        console.log("POI添加成功312313131:", poiResult);
        resultObjsList.push(...poiResult.result.objects);

        // 安防岗亭压暗

        if (poiData.length > 1) {
          let customId = [];
          poiResult.result.objects.forEach((ev) => {
            customId.push(ev.BasicInfoAtom.customId);
          });
          FocusByCustomId(customId);
        } else if (poiData.length === 1) {
          // 聚焦到该点
          const res = await FocusByPoints(
            poiData[0],
            80,
            -31.69999885559082,
            23.65000343322754
          );
          if (res.success) {
            setTimeout(() => {
              customStatus("ZHAF_AFGT_DarkenBuilding", true);
            }, 1000);
          }
        }
      } else {
        console.error("POI添加失败:", poiResult.message);
      }

      this.toolObjs[index].forEach((e, i) => {
        e.onClick(async (ev) => {
          const customData = JSON.parse(e.BasicInfoAtom.customData);
          const windowParams = {
            title: e.BasicInfoAtom.entityName,
            type: "type3",
            bgType: "bg3",
            customParams: customData,
          };
          // // wdpapi-window-type3-20250828
          const res = await addWINDOWS(
            poiData[i],
            e.BasicInfoAtom.entityName,
            1,
            [290, 190],
            poiData[i][2] + 1.7,
            windowParams,
          );
          this.$store.commit("setWindowEid", res.result.object.Eid);
        });
      });
    },

    async personGate(data, index) {
      const poiResult = await addPOI(
        data.location,
        "person",
        9.2,
        "人形闸机",
        null,
        data.markerConfig,
        "ground"
      );
      const resultObjsList = this.toolObjs[index];
      const toolData = this.toolData[index];
      if (poiResult.success) {
        console.log("POI添加成功555555:", poiResult);
        resultObjsList.push(...poiResult.result.objects);
        console.log(resultObjsList, "对象存储成功");
      } else {
        console.error("POI添加失败:", poiResult.message);
      }
      FocusByPoints(
        data.location[0],
        300,
        -48.20018005371094,
        -126.79940032958984
      );
      this.toolObjs[index].forEach((e, i) => {
        e.onClick(async (ev) => {
          await FocusByPoints(
            [113.7127782231797, 34.77232219134414, 9.07726443427377],
            0,
            -18.150001525878906,
            -107.30000305175781
          );
          // wdpapi-window-type1-20250828
          const windowParams = {
            title: e.BasicInfoAtom.entityName,
            url: process.env.VUE_APP_WINDOW_VIDEO_BASE_URL,
            type: "type1",
            customParams: {},
          };
          const res = await addWINDOWS(
            data.location[0],
            "人形闸机",
            Math.random(),
            [250, 190],
            data.location[i][2] + 1.7,
            windowParams,
            [23, -60]
          );
          this.$store.commit("setWindowEid", res.result.object.Eid);
          console.log(res, "添加窗口成功");
        });
      });
    },

    async heatMap(data, index) {
      // console.log(data,'人员热力数据')
      // 聚焦
      await FocusByPoints(
        data.camera.location,
        data.camera.distance,
        data.camera.pitch,
        data.camera.yaw
      );
      // 拆楼
      await splitBuildByName("SH_HWLQH_F12", 2);
      // 开启人员热力
      // console.log('ZHAF_HeatMap_Person', '人员热力')
      setTimeout(async () => {
        await customStatus("ZHAF_HeatMap_Person", true);
      }, 1000);
    },

    async footerVideo(data, index) {
      const poiResult = await addPOI(
        [data.poi],
        "warning",
        6,
        "视频周界预警",
        data.footerData,
        {
          markerNormalUrl: data.markerNormalUrl,
          markerActivateUrl: data.markerNormalUrl,
        }
      );
      if (poiResult.success) {
        console.log(poiResult, "poi添加成功");
        this.toolObjs[index].push(...poiResult.result.objects);
      } else {
        console.error("POI添加失败:", poiResult.message);
      }
      await spawnEffect(
        "ZHAF_SPZJYJ_SpawnEffect",
        "1",
        "create",
        data.poi,
        "1"
      );

      // 聚焦
      FocusByPoints(data.poi, 100, -39.15047073364258, 107.80027770996094);

      // 封装添加窗口逻辑
      const openWindow = async () => {
        // wdpapi-window-type2-20250828
        const windowParams = {
          title: data.footerData.title,
          url: process.env.VUE_APP_WINDOW_VIDEO_BASE_URL,
          type: "type2",
          bgType: "bg2",
          customParams: { ...data.footerData },
        };
        const res = await addWINDOWS(
          data.poi,
          data.footerData.title,
          Math.random(),
          [355, 220],
          data.poi[2] + 1.7,
          windowParams,
          [-170, 280]
        );
        this.$store.commit("setWindowEid", res.result.object.Eid);
        console.log("添加窗口成功:", res);
      };

      // 首次自动打开窗口
      await openWindow();

      this.toolObjs[index].forEach((e) => {
        e.onClick(openWindow);
      });
    },

    async footerAI(data, index) {
      const res = await aiBotRoute(1, "Play", 1);

      await customStatus("ZHAF_JQRXGGJ_HighlightRobot", true);
      if (res.success) {
        // 暂停
        await aiBotRoute(1, "Pause", 1);
        setTimeout(() => {
          this.$store.commit("isShowWebTwo", {
            isShow: true,
            config: data.footerData,
          });
          this.$store.commit("setAiBotWindowId", index);
        }, 500);
      }
    },
  },
  mounted() { },

  beforeDestroy() { },
};
