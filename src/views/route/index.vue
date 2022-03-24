<template>
    <div>
        <div class="contain">
            <el-button round type="primary" @click="loadData()">{{t('i18n.refresh')}}</el-button>
            <el-divider></el-divider>
            <el-table
                    v-loading="loading"
                    :data="table_data"
                    border
                    stripe
                    highlight-current-row
                    header-cell-class-name="table-header-class"
                    style="width:100%">
                <el-table-column :label="t('field.index')"
                                 align="center">
                    <template #default="scope">
                        <p>{{scope.$index+1}}</p>
                    </template>
                </el-table-column>
                <el-table-column :label="t('field.path')"
                                 property="path"
                                 align="center">
                </el-table-column>

                <el-table-column :label="t('field.method')"
                                 property="method"
                                 align="center">
                </el-table-column>
                <el-table-column :label="t('field.created_time')"
                                 property="created_time"
                                 :formatter="formatterTime"
                                 align="center">
                </el-table-column>
            </el-table>
        </div>
    </div>


</template>

<script>
    import {getRoutes} from '../../api/route';
    import allTableApi from '../../components/api/all_table'

    export default {
        name: 'Route',
        setup() {
            return {
                ...allTableApi(getRoutes)
            }
        },
    };
</script>

<style scoped lang="sass">

    .contain
        background: #fff
        padding: 10px
        margin-bottom: 20px



</style>



