<template>
    <echarts :option="option" :ratio="'1/1'" :width="'100%'"></echarts>
</template>
<script>
import echarts from "@/components/echarts/index.vue"
import { pieDownOption } from "@/types/echarts/pie"
export default {
    components: {
        echarts
    },
    data() {
        return {
            option: null,
            colorList: ['#2195E0', '#86E0ED', '#DBF5FF', '#FEC551']
        }
    },
    props: {
        images: { type: Array, default: [] },
        id: { type: [String, Number], default: 2 },
        width: { type: String, default: '100%' },
        ratio: { type: String, default: '1' },
        data: {
            type: Object,
            default: () => {
                return {
                    id: 11,
                    total: "100",
                    text: "报警事件总数",
                    data: [
                        {
                            name: "火灾报警",
                            percent: 33,
                        },
                        {
                            name: "入侵报警",
                            percent: 33,
                        },
                        {
                            name: "其他报警",
                            percent: 33,
                        },
                    ],
                }
            }
        }
    },

    async created() {
        this.option = pieDownOption(this.data, this.colorList, this.images)
    },
}
</script>
