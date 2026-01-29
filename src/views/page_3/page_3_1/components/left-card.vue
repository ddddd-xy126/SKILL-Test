<style scoped>
.card {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    gap: var(--font-size-14);
}

.card-base-item {
    width: calc(50% - var(--font-size-16));
    /* 两列，减去间距 */
}
</style>
<template>
    <div class="card">
        <div class="card-base-item" v-for="(item, index) in dataArr" :key="index">
            <baseCard :data="item" />
        </div>
    </div>
</template>

<script>
import baseCard from '@/components/card/baseCard.vue';
export default {
    name: 'LeftCard',
    components: {
        baseCard
    },
    props: {
        dataArr: {
            type: Array,
            required: true
        }
    }
};
</script>