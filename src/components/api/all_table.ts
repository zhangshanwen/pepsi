import {reactive, ref, onMounted} from "vue";
import {useI18n} from "vue-i18n";
import formatterApi from './formatter'

const allTableApi = (
    fetchPageApi: {
        (): Promise<any>
    },
    ) => {
        const t = useI18n().t
        const table_data = ref([]);
        const loading = ref(false);

        const loadData = async () => {
            loading.value = true
            fetchPageApi().then((res: any) => {
                table_data.value = res.data.list;
            }).catch(() => {
            }).finally(() => {
                loading.value = false;
            });
        }
        onMounted(async () => {
            await loadData()
        })
        return {
            ...formatterApi(),
            t,
            loading,
            table_data,

            loadData,

        }
    }
;

export default allTableApi;
