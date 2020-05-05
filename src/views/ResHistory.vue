<template>
  <div class="res-history">
    <el-table
      :data="list"
      :default-sort="{ prop: 'createTime', order: 'descending' }"
      style="width: 100%;"
    >
      <el-table-column width="100" type="expand" label="计算参数">
        <template class="info-temp" slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="id">
              <span>{{ props.row.resultData.parama.id }}</span>
            </el-form-item>
            <el-form-item label="客户数">
              <span>{{ props.row.resultData.parama.n }}</span>
            </el-form-item>
            <el-form-item label="里程数">
              <span>{{ props.row.resultData.parama.maxroad }}</span>
            </el-form-item>
            <el-form-item label="车种类">
              <span>{{ props.row.resultData.parama.carTypes }}</span>
            </el-form-item>
            <el-form-item label="最高车速">
              <span>{{ props.row.resultData.parama.speed }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column label="地图" prop="sheetName"></el-table-column>
      <el-table-column
        label="创建时间"
        sortable
        prop="createTime"
      ></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            @click.native.prevent="showDetail(scope)"
            type="primary"
            size="small"
            plain
          >
            详情
          </el-button>
          <el-button
            @click.native.prevent="exportExcel(scope, list)"
            type="info"
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
    Graph,
  },
  data() {
    return {
      dialogVisible: false,
      list: [],
      selectedNow: {},
    }
  },
  created() {
    this.$axios('/getHistoryList').then((res) => {
      if (res.data.statu == 100) {
        const list = res.data.data
        // list.forEach((item) => {
        //   item.createTime = new Date(item.createTime)
        // })
        this.list = list
        console.log(this.list)
      } else {
        this.$message({
          message: res.data.msg,
          type: 'error',
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
      console.log(parama)
      exportResultExcel(calcResult, parama)
    },
  },
}
</script>

<style lang="scss" scoped>
.res-history {
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 30%;
  }
}
</style>
