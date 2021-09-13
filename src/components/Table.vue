<template>
    <div>
        <div class="contain">
            <el-button type="primary" @click="loadData()">{{t('i18n.search')}}</el-button>
            <el-button type="primary" @click="clickNewData()">{{t('i18n.new')}}</el-button>
            <el-divider></el-divider>
            <el-table
                    v-loading="pagination.loading"
                    :data="table_data"
                    border
                    stripe
                    highlight-current-row
                    header-cell-class-name="table-header-class"
                    style="width:100%">
                <el-table-column v-for="field in fields" :label=`t('field.${field.field}')`
                                 :property="field.field"
                                 :formatter="field.formatter?field.formatter:null"
                                 align="center">
                    <template #default="scope" v-if="field.operate">
                        <el-button type="text" v-for="button in field.buttons"
                                   @click="button.method(scope.row)">
                            {{t(field.name)}}
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-row>
                <el-col :span="24">
                    <div class="pagination">
                        <el-pagination
                                v-if='pagination.total > 0'
                                :page-sizes="pagination.page_size_array"
                                :page-size="pagination.page_size"
                                :layout="pagination.layout"
                                :total="pagination.total"
                                :current-page='pagination.page_index'
                                @current-change='handleCurrentChange'
                                @size-change='handleSizeChange'>
                        </el-pagination>
                    </div>
                </el-col>
            </el-row>
        </div>
    </div>


</template>

<script lang="ts">
    import {defineComponent} from "vue"
    import {useI18n} from "vue-i18n";

    export default defineComponent({
        name: 'Table',
        props: ['fields', 'table_data', 'loadData', 'pagination', 'form',
            'clickNewData', 'handleCurrentChange', 'handleSizeChange'],
        setup() {
            const t = useI18n().t
            return {
                t
            }
        }
    });


</script>

<style scoped>

    .contain {
        background: #fff;
        padding: 10px;
        margin-bottom: 20px;
    }


</style>



