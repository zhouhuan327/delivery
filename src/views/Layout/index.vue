<template>
	<div class="layout">
		<!-- 头部 -->
		<LayoutHeader />

		<!-- 内容 -->
		<Content>
			<SideBar slot="sidebar" />
			<BreadCrumb slot="breadcrumb" />
			<router-view slot="content"></router-view>
		</Content>
	</div>
</template>

<script>
import LayoutHeader from './LayoutHeader'
import Content from './Content'
import SideBar from './SideBar'
import BreadCrumb from '@/components/BreadCrumb/breadcrumb'
export default {
	components: {
		LayoutHeader,
		Content,
		SideBar,
		BreadCrumb
	},
	data() {
		return {}
	},
	created() {
		this.$store.dispatch('init')
		console.log(this.$store.getters.getroutes)
	}
}
</script>

<style lang="scss" scoped>
.layout {
	width: 100%;
	height: 100%;
	margin: 0 auto;
	background: #f5f7f9;
}
</style>