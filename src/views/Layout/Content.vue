<template>
	<el-container :class="classObj()" class="layout-content">
		<!-- 左侧菜单 -->
		<slot name="sidebar"></slot>

		<!-- 右侧 -->
		<el-main>
			<!-- 面包屑 -->
			<div class="top">
				<i @click="handleCollapse" class="iconfont icon-cebianlan"></i>
				<slot name="breadcrumb"></slot>
			</div>
			<!-- 页面内容 -->
			<div class="content">
				<transition name="fade-transform" mode="out-in">
					<slot name="content"></slot>
				</transition>
			</div>
		</el-main>
	</el-container>
</template>

<script>
export default {
	data() {
		return {}
	},
	methods: {
		handleCollapse() {
			this.$store.dispatch('setSideBar', !this.$store.getters.getSideBar)
		},
		classObj() {
			return {
				hideSidebar: this.$store.getters.getSideBar,
				openSidebar: !this.$store.getters.getSideBar
			}
		}
	}
}
</script>

<style lang="scss" scoped>
.layout-content {
	position: relative;
	width: 100%;
	height: 100%;

	.el-main {
		padding: 0;
		width: 100%;
		position: relative;
		overflow: hidden;

		.top {
			background: #fff;
			height: 54px;
			border-right: none;
			border-bottom: 1px solid #e6e6e6;
			display: flex;
			align-items: center;

			i {
				font-size: 20px;
				cursor: pointer;
				padding-left: 16px;
				padding-right: 16px;
			}

			.breadcrumb {
				padding-left: 16px;
			}
		}

		.content {
			padding: 10px;
			height: calc(100% - 54px);
			box-sizing: border-box;
		}
	}
}
</style>