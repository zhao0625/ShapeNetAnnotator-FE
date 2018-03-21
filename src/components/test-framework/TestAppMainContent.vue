<template>
  <el-row v-bind:gutter="20">
    <el-col :span="16">
      <component :is="currentHeaderView"></component>
    </el-col>
    <el-col :span="8">
      8
    </el-col>
  </el-row>
</template>

<script>
import TestOrComponent from '@/components/test-framework/dynamic-aog/TestOrComponent'
import TestAndComponent from '@/components/test-framework/dynamic-aog/TestAndComponent'

export default {
  name: 'TestAppMainContent',
  data () {
    return {
      // TODO dynamic component
      currentHeaderView: 'TestOrComponent'
    }
  },
  components: {
    TestOrComponent: TestOrComponent,
    TestAndComponent
  }
}
</script>

<style scoped>

</style>
