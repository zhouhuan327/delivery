<template>
  <div class="calcRoute">
    <el-form
      :model="parama"
      :inline="true"
      label-width="100px"
      label-position="right"
    >
      <el-row>
        <el-form-item label="数据">
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
                    <el-tag type="success">坐标</el-tag>
                  </template>
                  <template v-if="item.type == 'distance'">
                    <el-tag type="info">距离</el-tag>
                  </template>
                </el-col>
              </el-row>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="客户数">
          <el-input v-model="parama.n" disabled></el-input>
        </el-form-item>
        <el-form-item label="车数量">
          <el-input v-model.number="parama.m"></el-input>
        </el-form-item>
      </el-row>

      <el-form-item label="载重上限">
        <el-input v-model.number="parama.q"></el-input>
      </el-form-item>
      <el-form-item label="最大里程数">
        <el-input v-model.number="parama.maxroad"></el-input>
      </el-form-item>
      <el-form-item label="种群规模">
        <el-input v-model.number="parama.sizepop"></el-input>
      </el-form-item>
      <el-form-item label="迭代次数">
        <el-input v-model.number="parama.maxgen"></el-input>
      </el-form-item>
      <el-row>
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
      </el-row>
      <el-row>
        <el-form-item label="模型">
          <el-radio-group v-model="parama.model">
            <el-radio label="局部最优解"></el-radio>
            <el-radio label="全局最优解"></el-radio>
          </el-radio-group>
        </el-form-item>
      </el-row>
    </el-form>
    <el-button size="small" @click="default_coo" round>坐标默认值</el-button>
    <el-button size="mini" @click="default_dis" round>距离默认值</el-button>
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
    <el-dialog :visible.sync="dialogVisible" width="70%">
      <Graph :gData="graphData"></Graph>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Graph from '@/components/RouteGraph/Graph'
export default {
  name: 'calcRoute',
  components: {
    Graph,
  },
  data() {
    return {
      isShowDetailBtn: false,
      dialogVisible: false,
      parama: {
        id: '', // 节点ID
        n: 0, //客户数，
        m: null, //车数量
        q: null, //载重上限
        maxroad: null, //最大里程数
        sizepop: null, //种群规模
        maxgen: null, //迭代次数
        isTime: false,
        model: '',
      },
      optionList: [],
      isLoading: false,
      graphData: {},
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
  },
  methods: {
    startCalc() {
      this.isLoading = true
      console.log('传入的', this.parama)
      this.$axios
        .post('/calc', this.parama)
        .then((res) => {
          if (res.data.statu == 100) {
            this.$message({
              message: res.data.msg,
              type: 'success',
            })
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
    },
    setGraphData(data) {
      // 处理载货量和行驶距离
      let exInfo = []
      let tempdis = data.distance
      let tempwei = data.weight
      tempdis.forEach((item, index) => {
        exInfo.push({
          name: `车${index + 1}`,
          distance: Math.floor(item),
          weight: Math.floor(tempwei[index]),
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
      let link = []
      res.forEach((item, index) => {
        link.push({
          name: `车${index + 1}`,
          value: item,
          index: index,
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
    default_coo() {
      this.parama.m = 5
      this.parama.q = 8
      this.parama.maxroad = 50
      this.parama.sizepop = 100
      this.parama.maxgen = 100
    },
    default_dis() {
      this.parama.m = 3
      this.parama.q = 8
      this.parama.maxroad = 50
      this.parama.sizepop = 50
      this.parama.maxgen = 100
    },
  },
}
</script>

<style lang="scss" scoped>
.calcRoute {
}
</style>
