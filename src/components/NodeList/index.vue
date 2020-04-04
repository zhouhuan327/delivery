<template>
  <div class="node-list">
    <el-table
      :data="list"
      style="width: 100%"
      :default-sort="{ prop: 'id', order: 'descending' }"
    >
      <el-table-column prop="id" label="id" sortable width="180">
      </el-table-column>
      <el-table-column prop="sheetName" label="数据名" width="180">
      </el-table-column>
      <el-table-column
        prop="type"
        label="类型"
        :formatter="formatterType"
        width="180"
      >
      </el-table-column>
      <el-table-column label="节点数量" width="180" :formatter="formatterCount">
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间"> </el-table-column>
      <el-table-column label="" width="180">
        <template slot-scope="scope">
          <el-button
            @click.native.prevent="showDetail(scope)"
            type="text"
            size="small"
          >
            详情
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="坐标信息" :visible.sync="isShowCooDialog">
      <el-table
        class="table"
        :data="CooInfo"
        :key="CooInfo.sheetName"
        height="350"
        highlight-current-row
      >
        <el-table-column prop="name" label="客户点"> </el-table-column>
        <el-table-column prop="x" label="横坐标x(km)"> </el-table-column>
        <el-table-column prop="y" label="纵坐标y(km)"> </el-table-column>
        <el-table-column prop="qt" label="需求量q(t)"> </el-table-column>
        <!-- <el-table-column label="操作" width="120">
          <template slot-scope="scope">
            <el-button
              @click.native.prevent="deleteRow(scope.$index, tableData)"
              type="text"
              size="small"
            >
              移除
            </el-button>
          </template>
        </el-table-column> -->
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isShowCooDialog = false">确定</el-button>
      </span>
    </el-dialog>
    <el-dialog width="70%" title="关系信息" :visible.sync="isShowDisDialog">
      <el-table
        class="table"
        :data="disInfo.disData"
        :key="disInfo.sheetName"
        height="350"
        highlight-current-row
      >
        <el-table-column prop="name" label="name"> </el-table-column>
        <template v-for="(item, index) in disInfo.disData">
          <el-table-column
            :key="index"
            :prop="String(index)"
            :label="String(index)"
          >
          </el-table-column>
        </template>
      </el-table>
      <!-- 各点的需求 -->
      <el-table
        :data="tempqt"
        :key="disInfo.sheetName + 1"
        highlight-current-row
      >
        <el-table-column prop="需求量" label="配送点/需求量"></el-table-column>
        <template v-for="(item, index) in tempqt[0]">
          <el-table-column
            :key="index"
            :prop="String(index)"
            :label="String(Number(index) + 1)"
          >
          </el-table-column>
        </template>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button
          @click="
            isShowDisDialog = false
            CooInfo = []
          "
          >确定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: '',
  data() {
    return {
      list: [],
      isShowCooDialog: false,
      isShowDisDialog: false,
      CooInfo: [],
      disInfo: {},
      tempqt: []
    }
  },
  created() {
    this.$axios('/getNodeList').then(res => {
      if (res.data.statu == 100) {
        this.list = res.data.data
        console.log(res)
      }
    })
  },
  methods: {
    formatterType(row) {
      if (row.type == 'coodinate') {
        return '节点'
      } else if (row.type == 'distance') {
        return '关系'
      }
    },
    formatterCount(row) {
      if (row.type == 'coodinate') {
        return row.cooData.length
      } else if (row.type == 'distance') {
        return row.disData.length
      }
    },
    showDetail(scope) {
      if (scope.row.type == 'coodinate') {
        this.isShowCooDialog = true
        this.CooInfo = scope.row.cooData
      } else if (scope.row.type == 'distance') {
        this.disInfo = scope.row
        let temp = []
        let qt = this.disInfo.qtdata
        temp.push({ ...qt })
        this.tempqt = temp

        this.isShowDisDialog = true
      }
      console.log(this.disInfo)
    }
  }
}
</script>

<style lang="scss" scoped>
.node-list {
}
</style>
