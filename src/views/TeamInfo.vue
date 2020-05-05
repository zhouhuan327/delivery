<template>
  <div class="teamInfo">
    <h1>Specialized团队</h1>
  </div>
</template>

<script>
export default {
  name: 'teamInfo',
  data() {
    return {}
  },
  created() {
    console.log('home')
  },
}
</script>

<style lang="scss" scoped>
.teamInfo {
  display: flex;
  justify-content: center;
  width: 100%;
  height: 100%;
  h1 {
    font-size: 25px;
    font-weight: bold;
  }
}
</style>
