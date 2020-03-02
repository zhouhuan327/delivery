<template>
	<div class="route-graph">
		<div ref="mychart" class="chart" :style="{width:chartWidth,height:chartHeight}"></div>
	</div>
</template>

<script>
import echarts from 'echarts'
import { options } from './config/default.js'
export default {
	name: 'route-graph',
	data() {
		return {
			chartWidth: '1000px',
			chartHeight: '600px'
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

			chart.setOption(options)
		}
	},
	created() {},
	mounted() {
		this.drawGraph()
	}
}
</script>

<style lang="scss" scoped>
.route-graph {
}
</style>