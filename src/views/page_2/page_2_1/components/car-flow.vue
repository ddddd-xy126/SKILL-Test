<style scoped lang="scss">
.container {
  width: 100%;
  .chartsList {
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>

<template>
  <div class="container">
    <div class="chartsList">
      <echarts-base :option="option" :width="width" :ratio="ratio" />
    </div>
  </div>

</template>

<script>
import echartsBase from '@/components/echarts/index.vue'
import { baseLineOption } from '@/types/echarts/line.js'

export default {
  name: 'LineChart',
  components: { echartsBase },
  props: {
    width: { type: String, default: '100%' },
    ratio: { type: String, default: '338 / 168' },
    xData: { type: Array, default: () => [] },
    yData: { type: Array, default: () => [] },
  },
  data () {
    return {
      option: null,
    }
  },
  created() {
    if (this.xData.length && this.yData.length) {
      this.option = baseLineOption(this.xData, this.yData)
    } else {
      this.option = baseLineOption(null, null, true)
    }
  }
}
</script>

