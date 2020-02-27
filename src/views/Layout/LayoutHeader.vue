<template>
	<div class="layout-header">
		<el-row>
			<el-col :xs="12" :sm="12" :md="14" :lg="16" :xl="18">
				<div class="system-info">
					<img class="logo" src="@/assets/logo.png" alt />
					<span class="title">配送路线优化</span>
				</div>
			</el-col>
			<el-col :xs="12" :sm="12" :md="10" :lg="8" :xl="6">
				<el-dropdown class="system-user">
					<span class="userinfo-inner">
						<img class="logo" src="@/assets/logo.png" alt />
						某用户
					</span>
					<el-dropdown-menu slot="dropdown">
						<el-dropdown-item command="usercenter">个人中心</el-dropdown-item>
						<el-dropdown-item divided command="logout">注销登录</el-dropdown-item>
					</el-dropdown-menu>
				</el-dropdown>
			</el-col>
		</el-row>
	</div>
</template>

<script>
export default {
	name: 'layout-header',
	data() {
		return {}
	}
}
</script>

<style lang="scss" scoped>
.layout-header {
	background: #495060;
	line-height: 64px;
	height: 64px;
}

.system-info {
	text-align: left;

	.logo {
		// position: absolute;
		// top: 50%;
		// transform: translateY(-50%);
		width: 60px;
		height: 60px;
		margin-left: 10px;
		border-radius: 50px;

		display: inline-block;
		vertical-align: middle;
		line-height: initial;
	}

	.title {
		font-size: 18px;
		font-weight: bold;
		color: azure;
		line-height: 64px;

		@media screen and (max-width: 400px) {
			font-size: 15px !important;
		}
	}
}

.system-user {
	text-align: right;
	float: right;
	padding-right: 16px;

	.userinfo-inner {
		color: #fff;
		font-size: 16px;
		cursor: pointer;

		img {
			width: 40px;
			height: 40px;
			border-radius: 20px;
			margin: 10px 0px 10px 10px;
			float: right;
		}
	}
}
</style>