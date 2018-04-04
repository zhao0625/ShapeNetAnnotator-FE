<template>
  <div id="app">
    <!-- TODO Shared Menu -->
    <!--:default-active="activeIndex2"
      @select="handleSelect"-->
    <el-menu
      class="el-menu-demo"
      mode="horizontal"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b"
      style="margin: 1px"
      :default-active="'3'"
    >
      <el-menu-item index="1">System: User Login</el-menu-item>
      <el-menu-item index="2">System: Annotation List</el-menu-item>
      <el-menu-item index="3" :disabled="false">Part Hierarchy Annotator</el-menu-item>
      <el-menu-item index="4">Instruction Video</el-menu-item>
      <!--<el-submenu index="2">-->
        <!--<template slot="title">我的工作台</template>-->
        <!--<el-menu-item index="2-1">选项1</el-menu-item>-->
        <!--<el-menu-item index="2-2">选项2</el-menu-item>-->
        <!--<el-menu-item index="2-3">选项3</el-menu-item>-->
        <!--<el-submenu index="2-4">-->
          <!--<template slot="title">选项4</template>-->
          <!--<el-menu-item index="2-4-1">选项1</el-menu-item>-->
          <!--<el-menu-item index="2-4-2">选项2</el-menu-item>-->
          <!--<el-menu-item index="2-4-3">选项3</el-menu-item>-->
        <!--</el-submenu>-->
      <!--</el-submenu>-->
    </el-menu>
    <!-- TODO router-view: render entrance (default) -->
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
  // components: {
  //   TestAnnotatorPage1Main1
  // }
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
  /* TODO system margin */
  margin: 1px;
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

/*.side-menu {*/
  /*background-color: white;*/
  /*margin-top: 30px;*/
/*}*/

/*.el-row {*/
  /*margin-bottom: 20px;*/
/*}*/

/*.el-col {*/
  /*border-radius: 4px;*/
/*}*/

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

/*.row-bg {*/
  /*padding: 10px 0;*/
  /*background-color: #f9fafc;*/
/*}*/
</style>
