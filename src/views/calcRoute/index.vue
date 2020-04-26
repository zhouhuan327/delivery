<template>
  <div class="calcRoute">
    <el-form
      :model="parama"
      :inline="true"
      label-width="100px"
      label-position="right"
      :rules="rules"
      ref="form"
    >
      <el-row>
        <p class="divide-line">地图配置</p>
        <el-tooltip
          class="item"
          effect="dark"
          content="选择地图数据集,数据详情可在'地图管理'查看"
          placement="top"
        >
          <el-form-item v-popover:popover-data label="地图数据" prop="id">
            <el-select
              @change="setCount"
              v-model="parama.id"
              placeholder="请选择节点数据"
            >
              <el-option
                v-for="item in optionList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
                <el-row>
                  <el-col :span="4">
                    {{ item.id }}
                  </el-col>
                  <el-col :span="12">
                    {{ item.name }}
                  </el-col>
                  <el-col style="float: right; margin-right: 10px;" :span="4">
                    <template v-if="item.type == 'coodinate'">
                      <el-tag type="primary">坐标</el-tag>
                    </template>
                    <template v-if="item.type == 'distance'">
                      <el-tag type="success">距离</el-tag>
                    </template>
                  </el-col>
                </el-row>
              </el-option>
            </el-select>
          </el-form-item>
        </el-tooltip>
        <el-form-item label="客户数">
          <el-input v-model="parama.n" disabled></el-input>
        </el-form-item>
      </el-row>
      <p class="divide-line">车辆配置</p>
      <el-row>
        <!-- <el-form-item label="车数量" prop="m">
          <el-input v-model.number="parama.m" style="width:150px"></el-input>
        </el-form-item> -->
        <el-form-item label="大车载货量" prop="q">
          <el-input v-model="parama.q" style="width:150px"></el-input>
        </el-form-item>
        <el-form-item label="小车载货量" prop="smallq">
          <el-input v-model="parama.smallq" style="width:150px"></el-input>
        </el-form-item>
        <el-form-item label="里程上限" prop="maxroad">
          <el-input v-model="parama.maxroad" style="width:150px"></el-input>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="时间窗">
          <el-input style="width:150px"></el-input>
        </el-form-item>
        <el-form-item label="排气量">
          <el-input style="width:150px"></el-input>
        </el-form-item>
      </el-row>
      <!-- <el-row>
        <p class="divide-line">参数配置</p>
        <el-form-item label="种群规模" prop="sizepop">
          <el-input v-model.number="parama.sizepop"></el-input>
        </el-form-item>
        <el-form-item label="迭代次数" prop="maxgen">
          <el-input v-model.number="parama.maxgen"></el-input>
        </el-form-item>
      </el-row> -->
      <!-- <el-row>
        <el-form-item label="模型">
          <el-radio-group v-model="parama.model">
            <el-radio label="局部最优解"></el-radio>
            <el-radio label="全局最优解"></el-radio>
          </el-radio-group>
        </el-form-item>
      </el-row> -->
      <!-- <el-row>
        <el-form-item label="考虑配送时间">
          <el-switch v-model="parama.isTime"></el-switch>
        </el-form-item>
        <transition name="fade-transform">
          <div style="display: inline-block;" v-show="parama.isTime">
            <el-form-item label="平均速度">
              <el-input></el-input>
            </el-form-item>
            <el-form-item label="卸货速度">
              <el-input></el-input>
            </el-form-item>
            <el-form-item label="最长时间">
              <el-input></el-input>
            </el-form-item>
          </div>
        </transition>
      </el-row> -->
    </el-form>
    <el-row class="mb20">
      <el-button size="small" @click="setDefault" round>生成参数</el-button>
    </el-row>
    <el-row class="mb40">
      <el-button
        size="medium"
        type="primary"
        icon="el-icon-edit"
        :loading="isLoading"
        plain
        @click="startCalc"
        >开始计算</el-button
      >
      <transition name="fade-transform">
        <el-button
          v-show="isShowDetailBtn"
          size="medium"
          type="info"
          icon="el-icon-tickets"
          plain
          @click="showGraphDialog"
          >查看结果</el-button
        >
      </transition>
    </el-row>
    <el-row>
      <el-col :span="17">
        <el-progress
          v-show="isStartCalc"
          :text-inside="true"
          :stroke-width="15"
          :percentage="calcPercentage"
          :format="progressDone"
        ></el-progress>
      </el-col>
    </el-row>

    <el-dialog :visible.sync="dialogVisible" width="70%">
      <div class="dialog-header" slot="title">
        <el-tooltip
          class="item"
          effect="dark"
          content="保存计算结果"
          placement="top"
        >
          <el-button size="small" @click="saveResult" type="primary" plain
            >保存结果</el-button
          >
        </el-tooltip>
        <el-button
          :loading="isLoadingExport"
          size="small"
          @click="exportExcel"
          type="primary"
          plain
          >导出为Excel</el-button
        >
      </div>
      <Graph :gData="graphData"></Graph>
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
  name: 'calcRoute',
  components: {
    Graph,
  },
  data() {
    const zeroCheck = (rule, value, callback) => {
      if (value == 0) {
        return callback(new Error('不能为0'))
      } else {
        callback()
      }
    }
    return {
      isLoadingExport: false,
      isStartCalc: false,
      isShowDetailBtn: false,
      dialogVisible: false,
      parama: {
        id: null, // 节点ID
        n: 0, //客户数，
        q: null, //大车载货量
        smallq: 6,
        maxroad: null, //最大里程数
        isTime: false,
        model: '',
      },
      rules: {
        id: [{ required: true, message: '请选择地图数据', trigger: 'change' }],
        // m: [
        //   { required: true, message: '请输入车数量', trigger: 'change' },
        //   {
        //     pattern: /^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/,
        //     message: '请输入合法的数字',
        //     trigger: 'change',
        //   },
        //   { validator: zeroCheck, trigger: 'change' },
        // ],
        q: [
          { required: true, message: '请输入大车载货量', trigger: 'change' },
          {
            pattern: /^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/,
            message: '请输入合法的数字，最多两位小数',
            trigger: 'change',
          },
          { validator: zeroCheck, trigger: 'change' },
        ],
        smallq: [
          { required: true, message: '请输入小车载货量', trigger: 'change' },
          {
            pattern: /^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/,
            message: '请输入合法的数字，最多两位小数',
            trigger: 'change',
          },
          { validator: zeroCheck, trigger: 'change' },
        ],
        maxroad: [
          { required: true, message: '请输最大里程数', trigger: 'change' },
          {
            pattern: /^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/,
            message: '请输入合法的数字，最多两位小数',
            trigger: 'change',
          },
          { validator: zeroCheck, trigger: 'change' },
        ],
        // sizepop: [
        //   { required: true, message: '请输种群规模', trigger: 'change' },
        //   { validator: zeroCheck, trigger: 'change' },
        // ],
        // maxgen: [
        //   { required: true, message: '请输迭代次数', trigger: 'change' },
        //   { validator: zeroCheck, trigger: 'change' },
        // ],
      },
      optionList: [],
      isLoading: false,
      calcResult: {}, //处理后的计算结果
      graphData: {},
      calcPercentage: 1,
    }
  },
  created() {
    this.$axios('/getNodeList').then((res) => {
      if (res.data.statu == 100) {
        const list = res.data.data
        console.log('getList', list)
        const optionList = []
        list.forEach((item) => {
          let count =
            item.cooData.length == 0 ? item.disData.length : item.cooData.length
          let data = item.cooData.length == 0 ? item.disData : item.cooData
          optionList.push({
            id: item.id,
            name: item.sheetName,
            type: item.type,
            count: count,
            data: data,
          })
        })
        this.optionList = optionList
      }
    })

    //进度条测试
  },
  watch: {
    parama: {
      deep: true,
      handler() {
        this.isShowDetailBtn = false
      },
    },
  },
  methods: {
    startCalc() {
      console.log('传入的', this.parama)
      this.$refs['form'].validate((valid) => {
        if (valid && this.carCheck()) {
          this.isLoading = true
          this.isShowDetailBtn = false
          //进度条部分
          const m = 20
          this.calcPercentage = 0
          this.isStartCalc = true
          let time = (m * m) / 20
          let interval
          const after90 = () => {
            this.calcPercentage += 1
            if (this.calcPercentage >= 97) {
              clearInterval(interval)
            }
          }
          const after70 = () => {
            this.calcPercentage += 1
            if (this.calcPercentage > 75) {
              clearInterval(interval)
              interval = setInterval(after90, 800)
            }
          }
          const after50 = () => {
            this.calcPercentage += 1
            if (this.calcPercentage > 75) {
              clearInterval(interval)
              interval = setInterval(after70, 600)
            }
          }
          interval = setInterval(() => {
            this.calcPercentage += 1
            if (this.calcPercentage > 50) {
              clearInterval(interval)
              interval = setInterval(after50, 400)
            }
          }, 200)
          //开始计算
          this.$axios
            .post('/calc', this.parama)
            .then((res) => {
              if (res.data.statu == 100) {
                this.$message({
                  message: res.data.msg,
                  type: 'success',
                })
                clearInterval(interval)
                this.calcPercentage = 100
                this.isLoading = false
                console.log('计算结果', res.data)
                this.setGraphData(res.data.data) //处理路径
                this.isShowDetailBtn = true
              } else {
                this.$message({
                  message: res.data.msg,
                  type: 'error',
                })
                this.isLoading = false
              }
            })
            .catch((error) => {
              this.isLoading = false
              console.log(error)
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    setGraphData(data) {
      // 处理载货量和行驶距离
      let exInfo = []
      let tempdis = data.distance
      let tempwei = data.weight
      tempdis.forEach((item, index) => {
        exInfo.push({
          name: `车${index + 1}`,
          distance: item.toFixed(3),
          weight: tempwei[index].toFixed(3),
        })
      })
      this.graphData.exInfo = exInfo
      let route = data.route
      let res = []
      let temp = []
      for (let i = 0; i < route.length; i++) {
        temp.push(route[i])
        if (route[i + 1] == 0) {
          temp.push(route[i + 1])
          res.push(temp)
          temp = []
        }
      }
      exInfo.forEach((item, index) => {
        item.route = res[index]
      })
      // 处理后的计算结果
      this.calcResult.route = res
      this.calcResult.distance = data.distance
      this.calcResult.weight = data.weight

      let link = []
      res.forEach((item, index) => {
        let smallWeight = this.parama.smallq
        let carType = exInfo[index].weight <= smallWeight ? 'small' : 'big'
        link.push({
          name: `车${index + 1}`,
          value: item,
          index: index,
          carType: carType,
        })
      })
      this.graphData.link = link
      const deepCopy = JSON.parse(JSON.stringify(this.graphData))
      this.graphData = deepCopy
      console.log(' this.graphData', this.graphData)
    },
    setCount(id) {
      this.optionList.forEach((item) => {
        if (item.id == id) {
          this.parama.n = item.count - 1
          this.graphData.data = item.data
          this.graphData.type = item.type
        }
      })
    },
    showGraphDialog() {
      this.dialogVisible = true
    },
    setDefault() {
      this.parama.q = 8
      this.parama.smallq = this.parama.q / 2
      this.parama.maxroad = this.getRamdon(40, 70)
    },
    getRamdon(start, end, fixed = 0) {
      let differ = end - start
      let random = Math.random()
      return (start + differ * random).toFixed(fixed)
    },
    saveResult() {
      let result = {}
      result.calcResult = this.calcResult
      result.parama = this.parama
      result.graphData = this.graphData
      let sheetName = ''
      this.optionList.forEach((item) => {
        if (item.id == result.parama.id) {
          sheetName = item.name
        }
      })
      let postData = {
        resultData: result,
        createTime: '',
        sheetName: sheetName,
      }
      console.log(postData)
      this.$axios.post('/addHistory', postData).then((res) => {
        if (res.data.statu == 100) {
          this.$message({
            message: res.data.msg,
            type: 'success',
          })
        } else {
          this.$message({
            message: res.data.msg,
            type: 'error',
          })
        }
      })
    },
    async exportExcel() {
      this.isLoadingExport = true
      let calcResult = this.calcResult
      let parama = this.parama
      await exportResultExcel(calcResult, parama)
      this.isLoadingExport = false
    },
    carCheck() {
      let kehushu = this.parama.n //客户数，
      let carnum = this.parama.m
      if (kehushu != 0 && carnum > kehushu) {
        this.$message({
          type: 'error',
          message: '车数量不能大于客户数',
        })
        return false
      }
      return true
    },
    progressDone(per) {
      return per === 100 ? '计算完成' : `${per}%`
    },
  },
}
</script>

<style lang="scss" scoped>
.calcRoute {
  .divide-line {
    position: relative;
    display: block;
    font-size: 14px;
    color: #8e8a8ad1;
    margin-left: 10px;
    user-select: none;
    margin-bottom: 20px;
    &::after {
      content: '';
      position: absolute;
      width: 60%;
      height: 1px;
      background: #f0e3e373;
      top: 50%;
      margin-left: 10px;
    }
  }
  .dialog-header {
    text-align: right;
    padding-right: 40px;
  }
}
</style>
