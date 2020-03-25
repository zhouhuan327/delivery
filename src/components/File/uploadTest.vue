<template>
  <div class="upload">
    <el-row class="bar">
      <el-button
        class="file"
        size="medium"
        icon="el-icon-upload"
        :loading="isLoading"
        type="primary"
      >
        导入Excel
        <input type="file" id="excel-file" @change="updateFile" />
      </el-button>
    </el-row>
    <el-row>
      <el-col :span="20">
        <el-table :data="tableData" border height="450" :show-header="true">
          <el-table-column prop="name" label="客户点" width="150">
          </el-table-column>
          <el-table-column prop="x" label="横坐标x(km)" width="180">
          </el-table-column>
          <el-table-column prop="y" label="纵坐标y(km)" width="180">
          </el-table-column>
          <el-table-column prop="qt" label="需求量q(t)" width="200">
          </el-table-column>
          <el-table-column label="操作" width="120">
            <template slot-scope="scope">
              <el-button
                @click.native.prevent="deleteRow(scope.$index, tableData)"
                type="text"
                size="small"
              >
                移除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import XLSX from 'xlsx'
export default {
  name: '',
  data() {
    return {
      isLoading: false,
      tableData: []
    }
  },
  methods: {
    updateFile(ev) {
      this.isLoading = true
      const sheets = []
      let files = ev.target.files[0]
      let reader = new FileReader()
      reader.onload = e => {
        let data = e.target.result //=> return ArrayBuffer
        let wb = XLSX.read(data, { type: 'array' })
        console.log('wb: ', wb)
        wb.SheetNames.forEach((item, index) => {
          let jsonData = XLSX.utils.sheet_to_json(
            wb.Sheets[wb.SheetNames[index]]
          )
          sheets.push({
            SheetName: item,
            data: jsonData
          })
        })

        console.log('sheets: ', sheets)

        this.tableData = this.formatterSheets(sheets[0].data)
      }
      reader.readAsArrayBuffer(files)
      setTimeout(() => (this.isLoading = false), 500)
    },
    formatterSheets(data) {
      return data.map(item => {
        return {
          name: item['客户点'],
          x: item['横坐标'],
          y: item['纵坐标'],
          qt: item['需求量']
        }
      })
    },
    deleteRow(index, rows) {
      rows.splice(index, 1)
    }
  }
}
</script>

<style lang="scss" scoped>
.upload {
  .bar {
    margin-bottom: 10px;
  }
  .file {
    position: relative;
    cursor: pointer;
  }
  .file input {
    position: absolute;
    right: 0;
    top: 0;
    opacity: 0;
    width: 100%;
    height: 100%;
    cursor: pointer;
  }
}
</style>
