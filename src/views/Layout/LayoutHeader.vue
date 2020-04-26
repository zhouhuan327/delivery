<template>
  <div class="layout-header">
    <el-row>
      <el-col :xs="12" :sm="12" :md="14" :lg="16" :xl="18">
        <div class="system-info">
          <img class="logo" src="@/assets/logo.png" alt />
          <span class="title">配送路线优化系统</span>
        </div>
      </el-col>
      <el-col v-show="false" :xs="12" :sm="12" :md="10" :lg="8" :xl="6">
        <el-dropdown class="system-user">
          <span class="userinfo-inner">
            <!-- <i class="iconfont icon-TEAMNETWORK"></i> -->
            Specialized
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="usercenter"
              >不知道写啥的</el-dropdown-item
            >
            <el-dropdown-item divided command="logout"
              >下拉菜单</el-dropdown-item
            >
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
  },
}
</script>

<style lang="scss" scoped>
.layout-header {
  background: #495060;
  line-height: 54px;
  height: 54px;
}

.system-info {
  text-align: left;
  padding-left: 10px;
  .logo {
    width: 30px;
    height: 30px;
    margin-left: 10px;
    border-radius: 50px;
    display: inline-block;
    vertical-align: middle;
    line-height: initial;
    margin-right: 5px;
  }
  .title {
    display: inline-block;
    vertical-align: middle;
    font-size: 18px;
    font-weight: bold;
    color: azure;

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
  }
}
</style>
