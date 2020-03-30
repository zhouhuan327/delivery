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
        >
          <el-form-item label="客户点" prop="name">
            <el-input v-model="formData.name"></el-input>
          </el-form-item>

          <el-form-item label="需求量" prop="qt">
            <el-input
              v-model.number="formData.qt"
              placeholder="q(t)"
            ></el-input>
          </el-form-item>

          <el-form-item label="横坐标" prop="x">
            <el-input
              v-model.number="formData.x"
              placeholder="横坐标x(km)"
            ></el-input>
          </el-form-item>

          <el-form-item label="纵坐标" prop="y">
            <el-input
              v-model.number="formData.y"
              placeholder="纵坐标y(km)"
            ></el-input>
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
          <el-table-column label="操作" width="120">
            <template slot-scope="scope">
              <el-button
                @click.native.prevent="deleteRow(scope.$index, formTableData)"
                type="text"
                size="small"
              >
                移除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-col :span="20">
        <template v-for="tableData in tableDatas">
          <span class="table-title" :key="tableData.SheetName + 1">
            <i class="el-icon-edit-outline"></i>
            {{ tableData.SheetName }}
          </span>
          <el-table
            class="table"
            :data="tableData.data"
            :key="tableData.SheetName"
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
                  @click.native.prevent="deleteRow(scope.$index, tableData)"
                  type="text"
                  size="small"
                >
                  移除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="20">
        <el-button type="primary">保存</el-button>
        <el-button type="primary" @click="reset('coo-form')">重置</el-button>
      </el-col>
    </el-row>

    <el-dialog
      title="请选择导入的类型"
      :visible.sync="isShowDialog"
      width="30%"
      center
    >
      <el-button
        class="file"
        size="medium"
        :loading="isLoading"
        plain
        type="primary"
      >
        <input type="file" id="excel-file" @change="uploadFromCoodinate" />
        <span>坐标</span>
      </el-button>

      <el-button
        class="file"
        size="medium"
        :loading="isLoading"
        plain
        type="primary"
      >
        <input type="file" id="excel-file" @change="uploadFromDistance" />
        <span>距离</span>
      </el-button>

      <span slot="footer" class="dialog-footer">
        <el-button @click="isShowDialog = false">取 消</el-button>
        <el-button type="primary" @click="isShowDialog = false"
          >确 定</el-button
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
      isLoading: false,
      isShowDialog: false,
      tableDatas: [], //导入excel时的表格数据
      isShowForm: true, //手动输入的表格
      formData: {
        name: 1,
        x: null,
        y: null,
        qt: null
      },
      rules: {
        name: [
          {
            required: true,
            message: '请输入客户点的名称',
            trigger: 'blur'
          }
        ],
        qt: [
          {
            required: true,
            message: '请输入需求量',
            trigger: 'blur'
          },
          {
            type: 'number',
            message: '请输入数字'
          }
        ],
        x: [
          {
            required: true,
            type: 'number',
            message: '请输入横坐标x',
            trigger: 'blur'
          },
          {
            type: 'number',
            message: '请输入数字'
          }
        ],
        y: [
          {
            required: true,
            type: 'number',
            message: '请输入纵坐标y',
            trigger: 'blur'
          },
          {
            type: 'number',
            message: '请输入数字'
          }
        ]
      },
      formTableData: []
    }
  },
  methods: {
    uploadFromCoodinate(ev) {
      this.tableDatas = []
      this.isLoading = true
      const sheets = []
      let files = ev.target.files[0]
      let reader = new FileReader()
      reader.onload = e => {
        let data = e.target.result //=> return ArrayBuffer
        let wb = XLSX.read(data, { type: 'array' })
        // console.log('wb: ', wb)
        wb.SheetNames.forEach((item, index) => {
          let jsonData = XLSX.utils.sheet_to_json(
            wb.Sheets[wb.SheetNames[index]]
          )
          sheets.push({
            SheetName: item,
            data: jsonData
          })
        })
        this.isShowForm = false
        this.tableDatas = sheets.map(item => {
          return {
            SheetName: item.SheetName,
            data: this.formatterSheets(item.data)
          }
        })
        console.log(this.tableDatas)
        ev.target.value = '' //解决onchange只触发一次的问题
        // this.tableData = this.formatterSheets(sheets[0].data)
      }
      reader.readAsArrayBuffer(files)
      this.isShowDialog = false
      setTimeout(() => (this.isLoading = false), 500)
    },
    uploadFromDistance(ev) {},
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
    },
    showForm() {
      this.tableDatas = []
      this.isShowForm = true
    },
    insertData() {
      this.$refs['coo-form'].validate(valid => {
        if (valid) {
          //判断name是否重复
          let isRepeat = false
          this.formTableData.forEach(item => {
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
            type: 'warning'
          })
          return false
        }
      })
    },
    reset(formName) {
      this.$refs[formName].resetFields()
      // 重置输入的坐标表
      this.formTableData = []
    }
  }
}
</script>

<style lang="scss" scoped>
.upload {
  .bar {
    margin-bottom: 10px;
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
      cursor: pointer;
    }
  }
}
</style>
