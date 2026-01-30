<template>
  <div class="container">
    <echarts
      :option="option"
      :ratio="'2/1'"
      :width="'100%'"
    ></echarts>
  </div>
</template>
<script>
import echarts from "@/components/echarts/index.vue";
import { biscSankey } from "@/types/echarts/sankey";
export default {
  components: {
    echarts,
  },
  data() {
    return {
      option: null,
    };
  },
  props: {
    id: { type: [String, Number], default: 2 },
    width: { type: String, default: "100%" },
    ratio: { type: String, default: "1" },
    dataList: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },

  methods: {},
  created() {
    this.option = biscSankey(this.dataList);
  },
};
</script>

<style scoped lang="scss">
.container {
  width: 100%;
  height: 100%;
}
</style>