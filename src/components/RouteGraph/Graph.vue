<template>
  <div class="route-graph">
    <el-row class="bar">
      <el-col :span="3">
        <p class="title">配送路线图</p>
      </el-col>
      <el-col :span="20">
        <div class="route-check">
          <el-checkbox-group
            @change="changeOption"
            v-model="checkedRoute"
            size="small"
          >
            <el-checkbox-button
              class="route-btn"
              v-for="item in linkData"
              :label="item"
              :key="item.index"
            >
              <div class="route-btn-content">
                <i
                  :style="{ color: item.color }"
                  class="color-block iconfont "
                  :class="
                    item.carType == 'small' ? 'icon-xiaoche' : 'icon-dache'
                  "
                ></i>
                <span class="color-block-name">{{ item.name }}</span>
              </div></el-checkbox-button
            >
          </el-checkbox-group>
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="16"
        ><div id="chart" ref="mychart" class="chart"></div>
        <p v-show="graphData.type == 'distance'" class="tip">
          *由距离展示的路径图中，配送点位置不代表真实位置
        </p>
      </el-col>
      <el-col :span="8">
        <span><i class="iconfont icon-xiaoche"></i>小车</span>
        <span style="margin-left:10px"
          ><i class="iconfont icon-dache"></i>大车</span
        >
        <template v-for="item in exInfo">
          <el-card :key="item.name" class="box-card">
            <p>{{ item.name }}</p>
            <p>行驶路程:{{ item.distance }}</p>
            <p>载货量:{{ item.weight }}</p>
          </el-card>
        </template>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import echarts from 'echarts'
import { getCooOptions, getDisOptions } from './config/final.js'
const colorMap = [
  '#c23531',
  '#3C93DD',
  '#61a0a8',
  '#d48265',
  '#91c7ae',
  '#6e7074'
]
export default {
  name: 'route-graph',
  props: ['gData'],
  data() {
    return {
      graphData: this.gData,
      links: [], //选中的小车的路线
      checkedRoute: [], // checkbox
      nodeData: [],
      linkData: [],
      exInfo: [],
      option: {} //!配置项
    }
  },
  mounted() {
    // console.log('prop', this.graphData)
    this.initData()
  },
  watch: {
    gData: {
      // immediate: true,
      handler(newV) {
        this.links = []
        this.linkData = []
        this.nodeData = []
        this.checkedRoute = []
        this.graphData = newV
        this.initData()
        console.log('watch监听:', newV)
      }
      // deep: true
    }
  },
  components: {},
  methods: {
    initData() {
      if (this.graphData.type == 'coodinate') {
        this.nodeData = this.graphData.data //坐标
        this.option = getCooOptions //! 坐标的配置项
      } else if (this.graphData.type == 'distance') {
        this.layout = 'force'
        let distanceNodeData = []
        this.graphData.data.forEach((item, index) => {
          distanceNodeData.push({
            name: index + ''
          })
        })
        this.nodeData = distanceNodeData
        this.option = getDisOptions //! 引力图的配置项
      }
      this.linkData = this.graphData.link // 路径
      this.linkData.forEach(item => (item.color = this.chooseColor(item.index)))
      this.exInfo = this.graphData.exInfo // 车信息
      this.checkedRoute.push(this.linkData[0]) //选中的路径
      this.links = this.formatterLinks(this.linkData[0].value, colorMap[0]) //第一辆车的路径
      this.drawGraph()
    },

    drawGraph() {
      let chart = echarts.init(document.getElementById('chart'))
      if (chart == undefined) {
        console.log(`echarts init dom is failed`)
        return
      }
      const getOption = this.option
      const options = getOption(this.nodeData, this.links)
      chart.setOption(options)
    },
    formatterLinks(arr, color) {
      let res = []
      arr.forEach((item, index) => {
        if (index < arr.length - 1) {
          res.push({
            source: item,
            target: arr[index + 1],
            label: {
              show: false,
              fontSize: 13
            },
            lineStyle: {
              color: color
            }
          })
        }
      })
      return res
    },
    changeOption() {
      // console.log('选中的', this.checkedRoute)
      let newlinks = []
      this.checkedRoute.forEach(item => {
        const data = this.formatterLinks(
          item.value,
          this.chooseColor(item.index)
        )
        newlinks = data.concat(newlinks)
      })
      this.links = newlinks
      this.drawGraph()
      // console.log('转换后', newlinks)
    },
    chooseColor(index) {
      let len = colorMap.length
      let i = 0
      if (index <= len - 1) {
        i = index
      } else {
        i = index % len
      }
      return colorMap[i]
    }
  }
}
</script>

<style lang="scss">
.route-graph {
  .bar {
    display: flex;
    align-items: center;
    height: 50px;
    .title {
      font-size: 17px;
      font-weight: bold;
      padding-left: 10px;
    }
  }
  .chart {
    height: 70vh;
  }
  .tip {
    text-align: center;
    color: #8e8a8ad1;
  }
  .box-card {
    margin-bottom: 5px;
    p {
      margin-bottom: 5px;
    }
  }
  .route-btn {
    .route-btn-content {
      display: flex;
      font-size: 13px;
      .color-block {
        // width: 18px;
        // height: 12px;
        // border-radius: 4px;
        // background: gray;
        margin-right: 10px;
        color: gray;
      }
    }
  }
  .el-checkbox-button {
    margin: 2px;
    .el-checkbox-button__inner {
      border: none;
      border-radius: 10px;
      color: gray;
    }
  }
  .el-checkbox-button.is-focus {
    .el-checkbox-button__inner {
      border: none;
    }
  }
  .el-checkbox-button.is-checked {
    .el-checkbox-button__inner {
      background-color: #bfcbd9;
      color: black;
      font-weight: bold;
    }
  }
}
</style>
