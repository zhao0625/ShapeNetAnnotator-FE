<template>
  <div id="app">
    <!--<img src="./assets/logo.png">-->
    <!-- TODO 公共菜单-->
    <el-menu
      :default-active="activeIndex2"
      class="el-menu-demo"
      mode="horizontal"
      @select="handleSelect"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b"
      style="margin: 15px"
    >
      <el-menu-item index="1">System 首页</el-menu-item>
      <el-submenu index="2">
        <template slot="title">我的工作台</template>
        <el-menu-item index="2-1">选项1</el-menu-item>
        <el-menu-item index="2-2">选项2</el-menu-item>
        <el-menu-item index="2-3">选项3</el-menu-item>
        <el-submenu index="2-4">
          <template slot="title">选项4</template>
          <el-menu-item index="2-4-1">选项1</el-menu-item>
          <el-menu-item index="2-4-2">选项2</el-menu-item>
          <el-menu-item index="2-4-3">选项3</el-menu-item>
        </el-submenu>
      </el-submenu>
      <el-menu-item index="3" disabled>消息中心</el-menu-item>
      <el-menu-item index="4"><a href="https://www.ele.me" target="_blank">订单管理</a></el-menu-item>
    </el-menu>
    <!-- TODO router-view 渲染入口 (default) -->
    <router-view/>
    <!-- TODO 测试 自定义组件 另一种方式 （固定）-->
    <!--<test-annotator-page1-main1></test-annotator-page1-main1>-->
    <!--<TestAnnotatorPage1Main1></TestAnnotatorPage1Main1>-->
  </div>
</template>

<script>
import TestAnnotatorPage1Main1 from './components/TestAnnotatorPage1Main1'

export default {
  name: 'App',
  components: {
    TestAnnotatorPage1Main1
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  /*color: #2c3e50;*/
  /*margin-top: 60px;*/
  /* TODO 整体最外层 margin */
  margin: 10px;
  /*margin-bottom: 15px;*/
}

.title {
  font-size: 30px;
  /*padding-top: 14px;*/
  padding-top: 18px;
  /*padding-bottom: 15px;*/
  padding-left: 40px;
  color: black;
  text-align: left;
}

/*.top-menu {*/
/*!*margin-bottom: 5px;*!*/
/*}*/

.side-menu {
  /*background-color: white;*/
  margin-top: 30px;
}

.el-row {
  margin-bottom: 20px;
}

.el-col {
  border-radius: 4px;
}

.bg-purple-dark {
  background: #99a9bf;
}

.bg-purple {
  background: #d3dce6;
}

.bg-purple-light {
  background: #e5e9f2;
}

/*.grid-step {*/
/*border-radius: 4px;*/
/*min-height: 16px;*/
/*}*/

.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
</style>
