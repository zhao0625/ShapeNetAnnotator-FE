<template>
  <!-- TODO 动态 -->
  <el-steps :active="1" finish-status="success" align-center>
    <!--<el-steps :space="200" :active="1" finish-status="success" align-center>-->
    <el-step v-for="item in items_test" :key="item.step" :title="item.step" :description="'【描述前缀】' + item.description"></el-step>
    <!--TODO ":" = "v-bind:"-->
  </el-steps>
  <!-- TODO 完整风格 -->
  <!--<el-steps :active="2" align-center finish-status="success">-->
  <!--<el-step title="步骤1" description="这是一段很长很长很长的描述性文字"></el-step>-->
  <!--<el-step title="步骤2" description="这是一段很长很长很长的描述性文字"></el-step>-->
  <!--<el-step title="步骤3" description="这是一段很长很长很长的描述性文字"></el-step>-->
  <!--<el-step title="步骤4" description="这是一段很长很长很长的描述性文字"></el-step>-->
  <!--</el-steps>-->
  <!-- TODO 简洁风格，无法用description -->
  <!--<el-steps :active="1" finish-status="success" simple>-->
    <!--<el-step title="步骤 1" ></el-step>-->
    <!--<el-step title="步骤 2" ></el-step>-->
    <!--<el-step title="步骤 3" ></el-step>-->
  <!--</el-steps>-->
  <!-- TODO 旧 -->
  <!--<el-menu mode="horizontal" theme="dark" style="border:1px solid #a5b6c8;background:#eef3f7;border-radius: 10px; margin: 20px">-->
    <!--&lt;!&ndash; TODO Modifying &ndash;&gt;-->
    <!--<el-row :gutter="20">-->
      <!--<el-col :span="20">-->
        <!--<div class="title">-->
          <!--Part Hierarchy Annotator-->
        <!--</div>-->
      <!--</el-col>-->

      <!--&lt;!&ndash; TODO For Offset &ndash;&gt;-->
      <!--&lt;!&ndash;<el-col :span="16"></el-col>&ndash;&gt;-->

      <!--&lt;!&ndash; 6 + 2 + 16 = 24 ! &ndash;&gt;-->
      <!--<el-col :span="4">-->
        <!--&lt;!&ndash;<el-col :span="2" :offset="16">&ndash;&gt;-->
        <!--&lt;!&ndash; `:plain="true"` &ndash;&gt;-->

        <!--&lt;!&ndash;<el-button type="info" icon="search"&ndash;&gt;-->
        <!--&lt;!&ndash;style="margin-top: 22px; float: right; margin-right: 30px"&ndash;&gt;-->
        <!--&lt;!&ndash;@click="$router.push({&ndash;&gt;-->
        <!--&lt;!&ndash;name: 'Home'&ndash;&gt;-->
        <!--&lt;!&ndash;})"&ndash;&gt;-->
        <!--&lt;!&ndash;&gt;Search&ndash;&gt;-->
        <!--&lt;!&ndash;</el-button>&ndash;&gt;-->

        <!--<el-button type="info" icon="search"-->
                   <!--style="margin-top: 22px; float: right; margin-right: 30px"-->
        <!--&gt;测试按钮-->
        <!--</el-button>-->
      <!--</el-col>-->
    <!--</el-row>-->
  <!--</el-menu>-->
</template>

<script>
export default {
  name: 'TestAppHeader',
  data () {
    return {
      // TODO dynamic v-for
      itemsTest: [
        {
          step: '步骤1（e.g., AND）',
          description: '描述' + ' : ' + '测试！'
        },
        {
          step: '步骤2',
          description: '描述' + ' : ' + '测试！！'
        },
        {
          step: '步骤3',
          description: '描述' + ' : ' + '测试！？！'
        }
      ]
    }
  }
}
</script>

<style scoped>

</style>
