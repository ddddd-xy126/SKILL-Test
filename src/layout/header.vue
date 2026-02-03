<!-- src/layout/header.vue -->
<template>
    <div class="header">

        <div class="left">
            <customWeather />
            <div class="line"></div>
            <customDate />
        </div>

        <h1 class="logo">{{ logoText }}</h1>
        <div class="right">
            <selections />
        </div>
    </div>
</template>
<script>

import NavItem from "@components/header/navItem-header.vue"

import customWeather from "@components/header/setting/weather.vue"
import customDate from "@components/header/setting/date.vue"
import selections from "@components/header/setting/selections.vue"

import { mapState } from "vuex";
import { addPOI } from "@utilsWdpApi/entity"
export default {
    name: 'Header',
    components: {
        NavItem, customWeather, customDate, selections
    },
    data() {
        return {
            logoText: "练秋湖智慧管理平台",

            navList: [
                {
                    name: "综合安防",
                    id: 1,
                    isActive: true,
                    path: "/page_1",
                    // bgImg: require('@images/nav/icon_1.png')
                },
                {
                    name: "便捷通行",
                    id: 2,
                    isActive: false,
                    path: "/page_2",
                    // bgImg: require('@images/nav/icon_2.png')
                },
                {
                    name: "能效管理",
                    id: 3,
                    isActive: false,
                    path: "/page_3",
                    // bgImg: require('@images/nav/icon_3.png')
                },
                {
                    name: "设施管理",
                    id: 4,
                    isActive: false,
                    path: "/page_4",
                    // bgImg: require('@images/nav/icon_4.png')
                },

                {
                    name: "综合态势",
                    id: 5,
                    isActive: true,
                    path: "/page_5",
                    // bgImg: require('@images/nav/icon_1.png')
                },
                {
                    name: "环境空间",
                    id: 6,
                    isActive: false,
                    path: "/page_6",
                    // bgImg: require('@images/nav/icon_2.png')
                },
                {
                    name: "资产管理",
                    id: 7,
                    isActive: false,
                    path: "/page_7",
                    // bgImg: require('@images/nav/icon_3.png')
                },
                {
                    name: "办公会议",
                    id: 8,
                    isActive: false,
                    path: "/page_8",
                    // bgImg: require('@images/nav/icon_4.png')
                },
                {
                    name: "网络体验",
                    id: 9,
                    isActive: false,
                    path: "/page_9",
                    // bgImg: require('@images/nav/icon_4.png')
                }
            ],

            currentNav: {
                id: null
            }
        }
    },

    mounted() {
        //通过当前路由地址匹配当前导航选中状态
        const matchedRoutes = this.$route.matched;
        if (matchedRoutes.length > 1) {
            const firstLevelRouteName = matchedRoutes[1].path;
            this.navList.forEach((e) => {
                e.path === firstLevelRouteName ? e.isActive = true : e.isActive = false;
            })
        }
    },
    computed: {
        ...mapState(["isSceneAlready"])
    },

    methods: {

        jumpNav(route) {

            if (!this.currentNav.id || this.currentNav.id !== route.id) {
                this.navList = this.navList.map(item => ({
                    ...item,
                    isActive: item.id === route.id
                }));

                this.$router.push(route.path);

                this.currentNav = route

                if (this.isSceneAlready) {
                    if (route.id == 1) {
                        addPOI()
                    }
                }
            }
        }
    }

};
</script>

<style lang="scss" scoped>
.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 100%;
    padding: 0% 2% 2% 1%; 
    .logo {
        width: 18%;
        font-family: var(--font-family-primary-Medium);
        background: linear-gradient(180deg, #FFFFFF 37%, #2D9ADE 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        text-shadow: none;
    }


    .right {
        width: 12.42%;
    }

    .left {
        width: 12.42%;
        // background-color: rgb(156, 156, 156);
        display: flex;
        justify-content: space-between;
        align-items: center;


        .line {
            width: 0.2rem;
            height: 4rem;
            background-color: var(--box-content-line);
        }
    }
}
</style>