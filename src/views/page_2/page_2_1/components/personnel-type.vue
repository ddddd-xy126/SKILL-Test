<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
<template>
  <div class="container">
    <personType :option="chartOption" width="100%" ratio="338/141" />
  </div>
</template>
<script>
import { pieLeadOption } from "@/types/echarts/pie.js";
import personType from "@components/echarts/index.vue";
export default {
  components: {
    personType,
  },
  props: {
    personnelTypeData: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      colors: {
        员工: "#86E0ED",
        访客: "#FFFFFF",
        安保: "#2195E0",
      },
      imgs: {
        总人数: require("@/assets/images/center-left/1-personTotal.png"),
      },
    };
  },
  computed: {
    chartOption() {

      return pieLeadOption(
        this.personnelTypeData,
        this.colors,
        this.imgs,
        true
      );
    },
  },
};
</script>
