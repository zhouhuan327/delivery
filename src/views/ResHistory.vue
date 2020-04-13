<template>
  <div class="res-history">
    <el-table :data="list" style="width: 100%;">
      <el-table-column label="地图" prop="sheetName"></el-table-column>
      <el-table-column label="创建时间" prop="createTime"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            @click.native.prevent="showDetail(scope)"
            type="text"
            size="small"
          >
            详情
          </el-button>
          <el-button
            @click.native.prevent="exportExcel(scope, list)"
            type="text"
            size="small"
          >
            导出
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :visible.sync="dialogVisible" width="70%">
      <Graph :gData="selectedNow"></Graph>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogVisible = false">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Graph from '@/components/RouteGraph/Graph'
import { exportResultExcel } from '@/utils/ExcelTool'
export default {
  name: 'res-history',
  components: {
    Graph
  },
  data() {
    return {
      dialogVisible: false,
      list: null,
      selectedNow: {}
    }
  },
  created() {
    this.$axios('getHistoryList').then(res => {
      if (res.data.statu == 100) {
        this.list = res.data.data
        console.log(this.list)
      } else {
        this.$message({
          message: res.data.msg,
          type: 'error'
        })
      }
    })
  },
  methods: {
    showDetail(scope) {
      this.dialogVisible = true
      const copy = JSON.parse(JSON.stringify(scope.row.resultData.graphData))
      this.selectedNow = copy
      console.log(this.selectedNow)
    },
    exportExcel(scope) {
      let calcResult = scope.row.resultData.calcResult
      let parama = scope.row.resultData.parama
      exportResultExcel(calcResult, parama)
    }
  }
}
</script>

<style lang="scss" scoped>
.res-history {
}
</style>
