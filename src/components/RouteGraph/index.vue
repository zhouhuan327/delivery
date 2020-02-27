<template>
	<div class="route-graph">
		<div ref="mychart" class="chart" :style="{width:chartWidth,height:chartHeight}"></div>
	</div>
</template>

<script>
import { data2 } from './testdata.js'
import echart from 'echart'
export default {
	name: 'route-graph',
	data() {
		return {
			chartWidth: '500px',
			chartHeight: '500px'
		}
	},
	components: {},
	methods: {
		drawGraph() {
			let chart = echart.init(this.$refs.mychart)
		}
	},
	created() {
		console.log(data2)
	}
}
</script>

<style lang="scss" scoped>
.route-graph {
}
</style>