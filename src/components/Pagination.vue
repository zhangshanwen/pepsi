<template>

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
</template>

<script lang="ts">
import {defineComponent} from 'vue'


export default defineComponent({
  name: 'Pagination',
  props: {
    pagination: {
      type: Object,
      default() {
        return {
          total: 0,
          page_index: 1,
          page_size: 20,
          page_size_array: [10, 20, 50, 100, 300, 1000],
          layout: 'total, sizes, prev, pager, next, jumper',
          sort: false,
          order: 'id',
          loading: false
        }
      },

    },
    loadData: {
      type: Function, required: true
    }

  },
  setup(props) {
    const handleCurrentChange = async (page: number) => {
      props.pagination.page_index = page;
      await props.loadData();
    }
    const handleSizeChange = async (page_size: number) => {
      props.pagination.page_size = page_size;
      await props.loadData();
    }
    return {
      handleCurrentChange,
      handleSizeChange
    }
  }
})


</script>