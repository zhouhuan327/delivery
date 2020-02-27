<template>
	<el-breadcrumb class="breadcrumb" separator="/">
		<transition-group name="breadcrumb">
			<el-breadcrumb-item
				v-for="(item,index) in breadCrumbItems"
				:key="item+index"
				:to="{path:item.path}"
			>{{item.title}}</el-breadcrumb-item>
		</transition-group>
	</el-breadcrumb>
</template>

<script>
export default {
	name: 'breadcrumb',
	data() {
		return {
			breadCrumbItems: []
		}
	},
	created() {
		this.initBreadCrumbItems(this.$route)
	},
	watch: {
		$route(route) {
			this.initBreadCrumbItems(route)
		}
	},
	methods: {
		initBreadCrumbItems(router) {
			let breadCrumbItems = [
				{
					path: '/',
					name: '首页'
				}
			]
			for (const index in router.matched) {
				if (
					router.matched[index].meta &&
					router.matched[index].meta.title
				) {
					breadCrumbItems.push({
						path: router.matched[index].path
							? router.matched[index].path
							: '/',
						title: router.matched[index].meta.title
					})
				}
			}
			this.breadCrumbItems = breadCrumbItems
		}
	}
}
</script>

<style lang="scss" scoped>
</style>