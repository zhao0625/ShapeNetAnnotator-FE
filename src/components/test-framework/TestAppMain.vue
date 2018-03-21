<template>
  <!-- TODO 方案1，用container -->
  <el-container>
  <!--<el-container style="margin: 15px">-->
    <el-aside>
    <!--<el-aside width="300px">-->
      <!-- TODO 引入 对应component -->
      <test-app-sidebar></test-app-sidebar>
    </el-aside>
    <el-container>
      <el-header height="100px" style="margin: 5px">
        <!--<el-header>-->
        <!-- TODO 引入 对应component -->
        <test-app-header></test-app-header>
      </el-header>
      <el-main>
        <!-- TODO 引入 对应component -->
        <test-app-main-content></test-app-main-content>
      </el-main>
    </el-container>
  </el-container>
  <!-- TODO 方案2，用el-row和el-col，以及:gutter -->
</template>

<script>
import TestAppMainContent from '@/components/test-framework/TestAppMainContent'
import TestAppHeader from '@/components/test-framework/TestAppHeader'
import TestAppSidebar from '@/components/test-framework/TestAppSidebar'

export default {
  name: 'TestAppMain',
  data () {
    return {
      test: 'test'
    }
  },
  components: {
    TestAppMainContent: TestAppMainContent,
    TestAppHeader, // 简写
    TestAppSidebar
  }
}
</script>

<style scoped>

</style>
