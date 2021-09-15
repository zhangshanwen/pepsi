<template>
    <div class="error-page">
        <div class="error-code">4<span>0</span>4</div>
        <div class="error-desc">{{t('i18n.not_found')}}</div>
        <div class="error-handle">
            <el-button round type="primary" size="large" @click="goHome">{{t('i18n.go_home')}}</el-button>
            <el-button round class="error-btn" type="primary" size="large" @click="goBack">{{t('i18n.go_back')}}</el-button>
        </div>
    </div>
</template>

<script lang="ts">
    import {useRouter} from "vue-router"
    import {useI18n} from "vue-i18n"

    export default {
        setup() {
            const router = useRouter()
            const t = useI18n().t
            const goBack = () => {
                router.go(-1)
            }
            const goHome = () => {
                router.push("/");
            }
            return {
                t,

                goBack,
                goHome,


            }

        }
    }
</script>


<style scoped lang="sass">
    .error-page
        display: flex
        justify-content: center
        align-items: center
        flex-direction: column
        width: 100%
        height: 100%
        background: #f3f3f3
        box-sizing: border-box


        .error-code
            line-height: 1
            font-size: 250px
            font-weight: bolder
            color: #f02d2d

            span
                color: #00a854


        .error-desc
            font-size: 30px
            color: #777


        .error-handle
            margin-top: 30px
            padding-bottom: 200px


        .error-btn
            margin-left: 100px

</style>

