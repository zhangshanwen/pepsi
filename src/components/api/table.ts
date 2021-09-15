import {reactive, ref, onMounted} from "vue";
import {useI18n} from "vue-i18n";
import formatterApi from "./formatter";
import {confirmBox} from "./message_box";

import {ElMessage} from 'element-plus'

const tableApi = (
    fetchPageApi: {
        (pagination: any): Promise<any>
    },
    createApi: { (form: any): Promise<any> },
    editApi: { (form: any): Promise<any> },
    deleteApi: { (form: any): Promise<any> },
    visible: {
        save: boolean,
        delete: boolean,
    },
    form: {
        id: number,
    }
    ) => {
        const t = useI18n().t

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
            fetchPageApi(pagination).then((res: any) => {
                table_data.value = res.data.list;
                pagination.total = res.data.pagination.total
            }).catch(() => {
            }).finally(() => {
                pagination.loading = false;
            });
        }
        const newData = async () => {
            createApi(form).then((res: any) => {
                ElMessage.success(t('i18n.success'))
                visible.save = false;
                loadData();
            }).catch();
        }
        const editData = async () => {
            editApi(form).then((res: any) => {
                    ElMessage.success(t('i18n.success'))
                    visible.save = false;
                    loadData();
                }
            ).catch();
        }
        const deleteOne = async () => {
            deleteApi(form).then((res: any) => {
                    ElMessage.success(t('i18n.success'))
                    visible.delete = false;
                    loadData();
                }
            ).catch();
        }
        const clickDeleteData = (operate_id: number) => {
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
