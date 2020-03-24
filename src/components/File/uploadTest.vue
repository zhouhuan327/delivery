<template>
  <div class="upload">
    <el-row>
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
  </div>
</template>

<script>
import XLSX from 'xlsx'
export default {
  name: '',
  data() {
    return {
      isLoading: false
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
      }
      reader.readAsArrayBuffer(files)
      setTimeout(() => (this.isLoading = false), 500)
    }
  }
}
</script>

<style lang="scss" scoped>
.upload {
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
