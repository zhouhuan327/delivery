<template>
  <div class="Home">
    <Graph />
  </div>
</template>

<script>
import Graph from '@/components/RouteGraph/index2'
export default {
  name: 'Home',
  data() {
    return {}
  },
  components: {
    Graph,
  },
}
</script>

<style lang="scss" scoped>
.Home {
}
</style>
