<template>
  <div class="route-graph">
    <el-row class="bar">
      <el-col :span="4"><span class="title">配送路线图</span></el-col>
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
              <i class="el-icon-setting"></i>
              {{ item.name }}</el-checkbox-button
            >
          </el-checkbox-group>
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="16"><div ref="mychart" class="chart"></div></el-col>
      <el-col :span="8">
        <p>route info here</p>
        <p>route info here</p>
        <p>route info here</p>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import echarts from 'echarts'
import getOptions from './config/plan2.js'
const colorMap = [
  '#c23531',
  '#3C93DD',
  '#61a0a8',
  '#d48265',
  '#91c7ae',
  '#6e7074'
]
const testlink = [
  { name: '车1', value: [1, 6, 5, 4, 3, 2, 1], index: 0 },
  { name: '车2', value: [1, 10, 1, 6, 5, 4, 3, 1], index: 1 },
  { name: '车3', value: [1, 9, 8, 7, 1], index: 2 },
  { name: '车4', value: [1, 10, 9, 8, 1], index: 3 }
]
export default {
  name: 'route-graph',
  data() {
    return {
      links: [],
      checkedRoute: [testlink[0]],
      linkData: testlink
    }
  },
  components: {},
  methods: {
    drawGraph() {
      let chart = echarts.init(this.$refs.mychart)
      if (chart == undefined) {
        console.log(`echarts init dom is failed`)
        return
      }
      const options = getOptions(this.links)
      chart.setOption(options)
    },
    formatterLinks(arr, color) {
      let res = []
      arr.forEach((item, index) => {
        if (index < arr.length - 1) {
          res.push({
            source: item - 1,
            target: arr[index + 1] - 1,
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
    changeOption(e) {
      console.log('选中的', this.checkedRoute)
      let newlinks = []
      this.checkedRoute.forEach(item => {
        const data = this.formatterLinks(item.value, colorMap[item.index])
        newlinks = data.concat(newlinks)
      })
      this.links = newlinks
      this.drawGraph()
      console.log('转换后', newlinks)
    }
  },
  created() {},
  mounted() {
    this.links = this.formatterLinks(this.linkData[0].value)
    this.drawGraph()
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
  .el-checkbox-button {
    margin: 2px;
    .el-checkbox-button__inner {
      border-radius: 10px;
    }
  }
  .el-checkbox-button.is-focus {
    .el-checkbox-button__inner {
      border: none;
    }
  }
  .el-checkbox-button.is-checked {
    .el-checkbox-button__inner {
      // btn color
    }
  }
}
</style>
