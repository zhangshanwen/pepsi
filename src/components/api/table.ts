import {reactive, ref, onMounted} from "vue";
import {useI18n} from "vue-i18n";
import formatterApi from "./formatter";
import {confirmBox} from "./message_box";
// @ts-ignore
import type {FormInstance} from 'element-plus'

import {ElMessage} from 'element-plus'

const tableApi = (
        fetchPageApi: {
            (pagination: any, search: any | null): Promise<any>
        },
        createApi: { (form: any): Promise<any> } | null,
        editApi: { (form: any): Promise<any> } | null,
        deleteApi: { (form: any): Promise<any> } | null,
        visible: {
            save: boolean,
            delete: boolean,
        } | null,
        form: {
            id: number,
        } | null,
        search: object | null
    ) => {
        const t = useI18n().t
        const save_ref = ref<FormInstance>()
        const pagination = reactive({
            total: 0,
            page_index: 1,
            page_size: 20,
            page_size_array: [10, 20, 50, 100, 300, 1000],
            layout: 'total, sizes, prev, pager, next, jumper',
            sort: false,
            order: 'id',
            loading: false
        })
        const table_data = ref([]);


        const loadData = async () => {
            pagination.loading = true;
            fetchPageApi(pagination, search).then((res: any) => {
                table_data.value = res.data.list;
                pagination.total = res.data.pagination.total
            }).catch(() => {
            }).finally(() => {
                pagination.loading = false;
            });
        }
        const newData = async () => {
            // @ts-ignore
            save_ref.value.validate((valid: boolean) => {
                    if (valid) {
                        if (createApi) {
                            createApi(form).then((res: any) => {
                                ElMessage.success(t('i18n.success'))
                                // @ts-ignore
                                visible.save = false;
                                loadData();
                            }).catch();
                        }
                    }
                }
            )
        }
        const editData = async () => {
            if (editApi) {
                editApi(form).then((res: any) => {
                        ElMessage.success(t('i18n.success'))
                        // @ts-ignore
                        visible.save = false;
                        loadData();
                    }
                ).catch();
            }
        }
        const deleteOne = async () => {
            if (deleteApi) {
                deleteApi(form).then((res: any) => {
                        ElMessage.success(t('i18n.success'))
                        // @ts-ignore
                        visible.delete = false;
                        loadData();
                    }
                ).catch();
            }
        }
        const clickDeleteData = (operate_id: number) => {
            // @ts-ignore
            form.id = operate_id
            confirmBox(t, deleteOne, {
                message: t('i18n.delete')
            })
        }
        const handleSizeChange = async (page_size: number) => {
            pagination.page_size = page_size;
            await loadData();
        }
        // 上下分页
        const handleCurrentChange = async (page: number) => {
            pagination.page_index = page;
            await loadData();
        }
        onMounted(async () => {
            await loadData()
        })

        return {
            ...formatterApi(),

            t,
            save_ref,
            table_data,
            pagination,

            loadData,
            newData,
            editData,
            deleteOne,
            clickDeleteData,

            handleSizeChange,
            handleCurrentChange,
        }
    }
;

export default tableApi;
