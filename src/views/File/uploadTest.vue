<template>
  <div class="upload">
    <el-row class="bar">
      <el-button @click="isShowDialog = true" size="medium" type="primary" plain
        >导入Excel</el-button
      >
      <el-button @click="showForm" size="medium" type="primary" plain
        >手动录入</el-button
      >
    </el-row>
    <el-row class="content">
      <div v-show="isShowForm" class="form-table">
        <el-form
          label-position="left"
          ref="coo-form"
          :model="formData"
          label-width="80px"
          :rules="rules"
          :inline="true"
          class="mb10"
        >
          <el-form-item label="客户点" prop="name">
            <el-input
              style="width:130px"
              v-model="formData.name"
              disabled
            ></el-input>
          </el-form-item>

          <el-form-item label="需求量" prop="qt">
            <el-input style="width:120px" v-model="formData.qt">
              <i slot="suffix" style="font-style:normal" class="danwei">T</i>
            </el-input>
          </el-form-item>

          <el-form-item label="横坐标" prop="x">
            <el-input style="width:120px" v-model="formData.x"> </el-input>
          </el-form-item>

          <el-form-item label="纵坐标" prop="y">
            <el-input style="width:120px" v-model="formData.y"> </el-input>
          </el-form-item>
          <el-form-item label="时间窗">
            <el-input style="width:120px" v-model="formData.timeWindow">
              <i slot="suffix" style="font-style:normal" class="danwei">h</i>
            </el-input>
          </el-form-item>

          <el-button @click="insertData" type="primary" plain>插入</el-button>
        </el-form>
        <el-table
          class="table"
          :data="formTableData"
          height="350"
          highlight-current-row
        >
          <el-table-column prop="name" label="客户点"> </el-table-column>
          <el-table-column prop="x" label="横坐标x(km)"> </el-table-column>
          <el-table-column prop="y" label="纵坐标y(km)"> </el-table-column>
          <el-table-column prop="qt" label="需求量q(t)"> </el-table-column>
          <el-table-column prop="timeWindow" label="时间窗(h)">
          </el-table-column>
          <el-table-column label="操作" width="120">
            <template slot-scope="scope">
              <el-button
                @click.native.prevent="deleteRow1(scope.$index, formTableData)"
                type="text"
                size="small"
              >
                移除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-row>
          <el-col :span="20">
            <el-button @click="isShowSubmit = true" type="primary"
              >保存</el-button
            >
            <el-button type="primary" @click="reset('coo-form')"
              >重置</el-button
            >
          </el-col>
        </el-row>
      </div>
      <el-col :span="20">
        <!-- 节点 -->
        <div v-show="isShowCoo">
          <template v-for="tableData in tableDataCoo">
            <span class="table-title" :key="tableData.sheetName + 1">
              <i class="el-icon-edit-outline"></i>
              {{ tableData.sheetName }}
            </span>
            <el-table
              class="table"
              :data="tableData.cooData"
              :key="tableData.sheetName"
              height="350"
              highlight-current-row
            >
              <el-table-column prop="name" label="客户点"> </el-table-column>
              <el-table-column prop="x" label="横坐标x(km)"> </el-table-column>
              <el-table-column prop="y" label="纵坐标y(km)"> </el-table-column>
              <el-table-column prop="qt" label="需求量q(t)"> </el-table-column>
              <el-table-column label="操作" width="120">
                <template slot-scope="scope">
                  <el-button
                    @click.native.prevent="deleteRow2(scope.$index, tableData)"
                    type="text"
                    size="small"
                  >
                    移除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </template>
          <el-button class="primary" @click="submitCoo" plain
            >保存节点</el-button
          >
        </div>

        <!-- 距离 -->
        <div v-show="isShowDis">
          <template v-show="isShownDis" v-for="tableData in tableDataDis">
            <span class="table-title" :key="tableData.sheetName + 1">
              <i class="el-icon-edit-outline"></i>
              {{ tableData.sheetName }}
            </span>
            <el-table
              class="table"
              :data="tableData.disData"
              :key="tableData.sheetName"
              height="350"
              highlight-current-row
            >
              <el-table-column prop="name" label="name"> </el-table-column>
              <template v-for="(item, index) in tableData.disData">
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
              :data="tableData.qtdata"
              :key="tableData.qtdata[0].name"
              highlight-current-row
            >
              <el-table-column
                prop="需求量"
                label="配送点/需求量"
              ></el-table-column>
              <template v-for="(item, index) in tableData.qtdata[0]">
                <el-table-column
                  :key="index"
                  :prop="String(index)"
                  :label="String(Number(index) + 1)"
                >
                </el-table-column>
              </template>
            </el-table>
          </template>
          <el-button @click="submitDis" class="primary" plain
            >保存距离</el-button
          >
        </div>
      </el-col>
    </el-row>

    <el-dialog
      title="请选择导入的类型(按照格式)"
      :visible.sync="isShowDialog"
      width="50%"
      center
    >
      <el-row class="format-img">
        <el-col :span="12">
          <el-button
            class="file"
            size="medium"
            :loading="isLoading"
            plain
            type="primary"
          >
            <input type="file" id="excel-file" @change="uploadFromCoodinate" />
            <span>坐标节点</span>
          </el-button>
          <img src="../../assets/coodinate.jpg" alt="" />
          <el-button @click="downloadTemp('coodinate')" type="text"
            >模版下载</el-button
          >
        </el-col>
        <el-col :span="12">
          <el-button
            class="file"
            size="medium"
            :loading="isLoading"
            plain
            type="primary"
          >
            <input type="file" id="excel-file" @change="uploadFromDistance" />
            <span>距离节点</span>
          </el-button>
          <img src="../../assets/distance.jpg" alt="" />
          <el-button @click="downloadTemp('distance')" type="text"
            >模板下载</el-button
          >
        </el-col>
      </el-row>

      <span slot="footer" class="dialog-footer">
        <el-button @click="isShowDialog = false">取 消</el-button>
        <!-- <el-button type="primary" @click="isShowDialog = false"
          >确 定</el-button
        > -->
      </span>
    </el-dialog>
    <el-dialog title="请填写地图名称" :visible.sync="isShowSubmit" width="30%">
      <el-form :model="dataName" :inline="true">
        <el-form-item label="地图名称" prop="name">
          <el-input v-model="dataName.name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isShowSubmit = false">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
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
      isLoading: false,
      isShowDialog: false, //类型选择Dialog
      OriginExcel: null, //导入的excel的原始数据
      tableDataCoo: [], // 要展示坐标数据，
      isShowCoo: false,
      tableDataDis: [], // 要展示的距离数据
      isShowDis: false,
      formData: {
        name: 0,
        x: null,
        y: null,
        qt: null,
        timeWindow: null,
      },
      rules: {
        name: [
          {
            required: true,
            message: '请输入客户点的名称',
            trigger: 'blur',
          },
        ],
        qt: [
          {
            required: true,
            message: '请输入需求量',
            trigger: 'blur',
          },
          {
            pattern: /^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/,
            message: '请输入合法的数字，最多两位小数',
            trigger: 'change',
          },
        ],
        x: [
          {
            required: true,
            message: '请输入横坐标x',
            trigger: 'blur',
          },
          {
            pattern: /^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/,
            message: '请输入合法的数字，最多两位小数',
            trigger: 'change',
          },
        ],
        y: [
          {
            required: true,
            message: '请输入纵坐标y',
            trigger: 'blur',
          },
          {
            pattern: /^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/,
            message: '请输入合法的数字，最多两位小数',
            trigger: 'change',
          },
        ],
      },
      formTableData: [],
      isShowForm: true, //手动输入的表格
      isShowSubmit: false,
      dataName: {
        name: '',
      },
    }
  },
  created() {
    // this.$axios('/getNode').then(res => {
    //   console.log(res)
    // })
  },
  methods: {
    uploadFromCoodinate(ev) {
      //初始化table
      this.tableDataCoo = []
      this.tableDataDis = []
      this.isShowCoo = true
      this.isShowDis = false
      this.isLoading = true
      const sheets = []
      let files = ev.target.files[0]
      let reader = new FileReader()
      reader.onload = (e) => {
        let data = e.target.result //=> return ArrayBuffer
        let wb = XLSX.read(data, { type: 'array' })
        // this.OriginExcel = JSON.parse(JSON.stringify(wb))
        wb.SheetNames.forEach((item, index) => {
          let jsonData = XLSX.utils.sheet_to_json(
            wb.Sheets[wb.SheetNames[index]]
          )
          sheets.push({
            SheetName: item,
            data: jsonData,
            type: 'coodinate',
          })
        })
        this.isShowForm = false
        this.tableDataCoo = sheets.map((item) => {
          return {
            sheetName: item.SheetName,
            cooData: this.formatterSheets(item.data),
            disData: [],
            qtdata: [],
            type: item.type,
          }
        })
        console.log('coo final', this.tableDataCoo)
        ev.target.value = '' //解决onchange只触发一次的问题
      }
      reader.readAsArrayBuffer(files)

      this.isShowDialog = false
      setTimeout(() => (this.isLoading = false), 500)
    },
    uploadFromDistance(ev) {
      //初始化table
      this.tableDataCoo = []
      this.tableDataDis = []
      this.isShowCoo = false
      this.isShowDis = true
      const sheets = []
      let files = ev.target.files[0]
      let reader = new FileReader()
      reader.onload = (e) => {
        let data = e.target.result //=> return ArrayBuffer
        let wb = XLSX.read(data, { type: 'array' })
        this.OriginExcel = JSON.parse(JSON.stringify(wb))

        wb.SheetNames.forEach((item, index) => {
          let jsonData = XLSX.utils.sheet_to_json(
            wb.Sheets[wb.SheetNames[index]]
          )
          let distanceData = []
          let qtdata = []
          jsonData.some((item) => {
            if (item.name == 'T') {
              return true
            }
            distanceData.push(item)
          })

          qtdata.push(jsonData[jsonData.length - 1])
          delete qtdata[0].name
          sheets.push({
            sheetName: item,
            disData: distanceData,
            cooData: [],
            qtdata: qtdata,
            type: 'distance',
          })
        })
        this.tableDataDis = sheets
        console.log('distance final', this.tableDataDis)
        ev.target.value = '' //解决onchange只触发一次的问题
      }
      this.isShowForm = false
      reader.readAsArrayBuffer(files)
      this.isShowDialog = false
    },
    formatterSheets(data) {
      return data.map((item) => {
        return {
          name: item['客户点'],
          x: item['横坐标'],
          y: item['纵坐标'],
          qt: item['需求量'],
        }
      })
    },
    deleteRow1(index, rows) {
      console.log(rows)
      rows.splice(index, 1)
    },
    deleteRow2(index, rows) {
      if (rows.type == 'coodinate') {
        rows.cooData.splice(index, 1)
      } else {
        rows.disData.splice(index, 1)
      }
    },
    showForm() {
      this.tableDataCoo = []
      this.tableDataDis = []
      this.isShowCoo = false
      this.isShowDis = false
      this.isShowForm = true
    },
    insertData() {
      this.$refs['coo-form'].validate((valid) => {
        if (valid) {
          //判断name是否重复
          let isRepeat = false
          this.formTableData.forEach((item) => {
            if (item.name == this.formData.name) {
              isRepeat = true
              this.$message.error(`客户点${this.formData.name}已存在`)
              return
            }
          })
          if (!isRepeat) {
            //防止表单和表格数据绑定
            const copy = JSON.parse(JSON.stringify(this.formData))
            this.formTableData.push(copy)

            let next = ++this.formData.name
            // form reset
            this.formData.name = next
            this.formData.qt = null
            this.formData.x = null
            this.formData.y = null
          }
        } else {
          this.$message({
            message: '该项选都为必填项',
            type: 'warning',
          })
          return false
        }
      })
    },
    reset(formName) {
      this.$refs[formName].resetFields()
      // 重置输入的坐标表
      this.formTableData = []
    },
    submitForm() {
      if (this.formTableData.length == 0 || this.dataName.name == '') {
        this.$message({
          message: '数据或数据名不能为空',
          type: 'warning',
        })
      } else {
        let obj = {
          sheetName: this.dataName.name,
          type: 'coodinate',
          disData: [],
          cooData: this.formTableData,
          qtdata: [],
        }
        let arr = []
        arr.push(obj)
        this.$axios.post('/addNode', arr).then((res) => {
          if (res.data.statu == 100) {
            this.$message({
              message: res.data.msg,
              type: 'success',
            })
            this.isShowSubmit = false
            this.dataName.name = null
            this.$refs['coo-form'].resetFields()
            // 重置输入的坐标表
            this.formTableData = []
          } else {
            this.$message({
              message: res.data.msg,
              type: 'error',
            })
          }
        })
      }
    },
    submitCoo() {
      const data = JSON.parse(JSON.stringify(this.tableDataCoo))
      this.$axios.post('/addNode', data).then((res) => {
        console.log(res.data)
        if (res.data.statu == 100) {
          this.$message({
            message: '保存成功',
            type: 'success',
          })
        } else {
          this.$message({
            message: '保存失败' + res.data.msg,
            type: 'error',
          })
        }
      })
    },
    submitDis() {
      const data = JSON.parse(JSON.stringify(this.tableDataDis))
      data.forEach((item) => {
        let distanceArray = []
        let qtArray = []
        item.disData.forEach((distance) => {
          let temp = Object.values(distance)
          temp.pop()
          distanceArray.push(temp)
        })
        item.qtdata.forEach((qt) => {
          qtArray = Object.values(qt)
        })
        item.disData = distanceArray
        item.qtdata = qtArray
        item.wb = this.OriginExcel
      })
      this.$axios.post('/addNode', data).then((res) => {
        console.log(res.data)
        if (res.data.statu == 100) {
          this.$message({
            message: '保存成功',
            type: 'success',
          })
        } else {
          this.$message({
            message: '保存失败' + res.data.msg,
            type: 'error',
          })
        }
      })
    },
    downloadTemp(type) {
      let template = []
      let wb
      let filename
      this.$axios('/getTemp').then((res) => {
        if (res.data.statu == 100) {
          template = res.data.data
          template.forEach((item) => {
            if (item.type == type) {
              wb = item.data
            }
          })
          if (type == 'coodinate') {
            filename = '坐标数据模板'
          } else if (type == 'distance') {
            filename = '距离数据模板'
          }
          XLSX.writeFile(wb, filename + '.xlsx')
        } else {
          this.$message({
            message: res.data.msg,
            type: 'error',
          })
        }
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.upload {
  .bar {
    margin-bottom: 20px;
  }
  .content {
    min-height: 60vh;
  }
  .table-title {
    display: inline-block;
    margin: 5px;
    font-weight: bold;
    cursor: pointer;
  }
  .table {
    margin-bottom: 20px;
  }
  .file {
    position: relative;
    cursor: pointer;
    input {
      position: absolute;
      left: 0;
      top: 0;
      opacity: 0;
      width: 100%;
      height: 100%;
      cursor: pointer;
    }
  }
  .format-img {
    text-align: center;
    img {
      width: 80%;
      height: 30%;
      margin-top: 10px;
    }
    button {
      width: 60%;
    }
  }
}
</style>
