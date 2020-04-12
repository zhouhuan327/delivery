<template>
  <div class="node-list">
    <el-table
      :data="list"
      style="width: 100%;"
      :default-sort="{ prop: 'id', order: 'descending' }"
    >
      <el-table-column prop="id" label="id" sortable width="180">
      </el-table-column>
      <el-table-column prop="sheetName" label="数据名" width="180">
      </el-table-column>
      <el-table-column prop="type" label="类型" width="180">
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.type === 'coodinate' ? 'primary' : 'success'"
            close-transition
            >{{ scope.row.type === 'coodinate' ? '坐标' : '距离' }}</el-tag
          >
        </template>
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
          <el-button
            @click.native.prevent="deleteRow(scope, list)"
            type="text"
            size="small"
          >
            删除
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
import XLSX from 'xlsx'
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
        this.disInfo.disData.forEach((item, index) => {
          item.name = index
        })
        let temp = []
        let qt = this.disInfo.qtdata
        temp.push({ ...qt })
        this.tempqt = temp

        this.isShowDisDialog = true
      }
      console.log(this.disInfo)
    },
    deleteRow(scope, row) {
      console.log(scope)
      this.$alert('确定吗确定吗', '删除', {
        confirmButtonText: '确定',
        callback: () => {
          const item = {
            id: scope.row.id
          }
          this.$axios.post('/deleteNode', item).then(res => {
            if (res.data.statu == 100) {
              this.$message({
                message: res.data.msg,
                type: 'success'
              })
            }
          })
          let i
          this.list.forEach((item, index) => {
            if (item.id == scope.row.id) {
              i = index
            }
          })

          row.splice(i, 1)
        }
      })
    },
    exportExcel(scope) {
      console.log('export data row', scope.row)
      if (scope.row.type == 'coodinate') {
        let data = scope.row.cooData
        let table = []
        table.push({
          A: '客户点',
          B: '横坐标',
          C: '纵坐标',
          D: '需求量'
        })
        data.forEach(item => {
          table.push({
            A: item.name,
            B: item.x,
            C: item.y,
            D: item.qt
          })
        })
        const wb = XLSX.utils.book_new()
        const ws = XLSX.utils.json_to_sheet(table, {
          header: ['A', 'B', 'C', 'D'],
          skipHeader: true
        })
        ws['!cols'] = [
          { width: 10 },
          { width: 10 },
          { width: 10 },
          { width: 10 }
        ]

        //sheet写入book
        XLSX.utils.book_append_sheet(wb, ws, 'file')
        //输出
        const name = scope.row.sheetName + new Date().toDateString()
        XLSX.writeFile(wb, name + '.xlsx')
      } else if (scope.row.type == 'distance') {
        let data = scope.row.disData
        data.forEach((item, index) => (item.name = index))
        let table = []
        let headerObj = {}
        //根据数据长度动态生成表头
        data.forEach((item, index) => {
          if (index == 0) {
            headerObj['name'] = String(index)
          }
          headerObj[index] = String(index)
        })
        // console.log('headerObj', headerObj)
        table.push(headerObj)
        data.forEach(row => {
          table.push(row)
        })

        let headerArr = Object.keys(headerObj)
        headerArr.pop()
        headerArr.unshift('name')
        // console.log('headerArr', headerArr)
        const wb = XLSX.utils.book_new()
        const ws = XLSX.utils.json_to_sheet(table, {
          header: headerArr,
          skipHeader: true
        })
        //sheet写入book
        const sheetName = '距离'
        XLSX.utils.book_append_sheet(wb, ws, sheetName)
        wb.Sheets[sheetName].A1.v = 'name'

        //TODO 需求量放到表2
        let qttable = []
        let qtheader = {}
        let qtdata = {}
        let temp = scope.row.qtdata
        temp.unshift(0)
        temp.forEach((item, index) => {
          qtheader[index] = index
          qtdata[index] = item
        })
        qttable.push(qtheader)
        qttable.push(qtdata)
        const ws2 = XLSX.utils.json_to_sheet(qttable, {
          header: Object.keys(qtheader),
          skipHeader: true
        })
        XLSX.utils.book_append_sheet(wb, ws2, '需求量')
        const fileName = scope.row.sheetName + new Date().toDateString()
        XLSX.writeFile(wb, fileName + '.xlsx')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.node-list {
}
</style>
