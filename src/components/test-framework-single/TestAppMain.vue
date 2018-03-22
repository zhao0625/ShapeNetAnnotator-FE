<template>
  <!-- TODO 方案1，用container -->
  <el-container>
    <!--<el-container style="margin: 15px">-->
    <el-aside>
      <!--<el-aside width="300px">-->
      <!-- TODO aside （暂时放树形控件） -->
      <!-- 用个card给包装一下 -->
      <el-card class="box-card">
        <el-input
          placeholder="（输入关键字进行过滤）"
          v-model="filterText">
        </el-input>
        <!-- TODO 树形 控件 -->
        <!-- TODO （node key原来是指的每个item的名字？！） -->
        <!-- 不给 show-checkbox=true -->
        <el-tree
          node-key="id"
          class="filter-tree"
          :data="testHierarchy['children']"
          default-expand-all
          :filter-node-method="filterNode"
          ref="treeTest">
        </el-tree>
      </el-card>
    </el-aside>
    <el-container>
      <el-header style="margin: 5px">
        <!--<el-header height="100px">-->
        <!-- TODO header -->
        <!-- TODO 动态 -->
        <el-steps :active="activeStep" finish-status="success" align-center>
          <!--<el-steps :space="200" :active="1" finish-status="success" align-center>-->
          <el-step v-for="item in itemsGenerateTest" :key="item.step" :title="item.step + ' -- ' + item.type"
                   :description="'【描述前缀】' + item.description">
          </el-step>
          <!--TODO ":" = "v-bind:"-->
        </el-steps>
      </el-header>
      <el-main>
        <!-- TODO main content -->
        <el-row v-bind:gutter="20">
          <!-- TODO 主界面部分：左右2:1分栏 -->
          <el-col :span="12">
            <!--<el-col :span="16">-->
            <!-- TODO 主区域 动态载入component-->
            <!-- 标签页 换掉type="card" -->
            <el-tabs v-model="editableTabsValue2" type="border-card" closable @tab-remove="removeTabTest">
              <el-tab-pane
                v-for="(item, index) in editableTabs2"
                :key="item.name"
                :label="item.title"
                :name="item.name"
              >
                <component :is="currentHeaderView"></component>
                {{index}} - {{item.content}}
              </el-tab-pane>
            </el-tabs>
          </el-col>
          <el-col :span="12">
            <!--<el-col :span="8">-->
            <!-- 用个card给包装一下 -->
            <el-card class="box-card">
              <!-- TODO （下一步暂时放在这） -->
              <el-button style="margin-top: 12px;" @click="nextStep">下一步</el-button>
              <!-- TODO 测试：关于标签页 -->
              <el-button size="small" @click="addTabTest(editableTabsValue2)">
                add tab
              </el-button>
              <!-- TODO 穿梭框 -->
              <!--<el-transfer-->
              <!--filterable-->
              <!--:filter-method="filterMethod"-->
              <!--filter-placeholder="（搜索）"-->
              <!--v-model="vModelValue"-->
              <!--:data="currentLevelTransfer">-->
              <!--</el-transfer>-->
              <!-- TODO 测试：多选/单选框 + hover popup -->
              <el-popover
                ref="popoverTest"
                placement="right"
                width="400"
                trigger="hover">
                <el-table :data="gridData">
                  <el-table-column width="150" property="date" label="日期"></el-table-column>
                  <el-table-column width="100" property="name" label="姓名"></el-table-column>
                  <el-table-column width="300" property="address" label="地址"></el-table-column>
                </el-table>
              </el-popover>
              <!--<el-checkbox-group v-model="checkboxGroupTest">-->
                <!--<el-checkbox v-for="item in checkboxGroupVFor"-->
                             <!--:key="item.label" :label="item.label"-->
                             <!--v-popover:popoverTest></el-checkbox>-->
              <!--</el-checkbox-group>-->
              <br/>
              <!-- TODO v-for hover testing -->
              <!--<el-button v-popover:popoverInsideTest-->
              <!--v-for='item in buttonPopupTest' :key="item">-->
              <!--<el-popover ref="popoverInsideTest" placement="right" trigger="hover">-->
              <!--{{item.content}}-->
              <!--</el-popover>-->
              <!--预计hover:{{item.content}}-->
              <!--</el-button>-->
              <!-- TODO （成功1） -->
              <div class="msg-add" v-for="item in buttonPopupTest" :key="item">
                <el-popover placement="top" trigger="hover">
                  弹出内容：{{item.content}}
                  <el-button slot="reference" icon="edit" class="edit-btn">按钮内容：{{item.content}}</el-button>
                </el-popover>
              </div>
              <br/>
              <!-- TODO 再结合多选框-->
              <!--<el-checkbox-group>-->
              <!--<el-checkbox-group v-model="checkboxGroupTest">-->
                <div class="msg-add" v-for="item in buttonPopupTest" :key="item">
                  <el-popover placement="top" trigger="hover">
                    弹出内容：{{item.content}}
                    <!--<el-button slot="reference" icon="edit" class="edit-btn">按钮内容：{{item.content}}</el-button>-->
                    <el-checkbox slot="reference" v-model="item.vModel">checkbox内容：{{item.content}}</el-checkbox>
                  </el-popover>
                </div>
              <!--</el-checkbox-group>-->
              <br/>
              <!--<el-button v-popover:popoverTest>hover 激活 test</el-button>-->
              <!--<el-checkbox label="备选项1" border></el-checkbox><br/>-->
              <!--<el-checkbox label="备选项2" border disabled></el-checkbox><br/>-->
              <!--<el-checkbox label="备选项3" border></el-checkbox><br/>-->
              <!--<el-checkbox label="备选项4" border></el-checkbox>-->
              <!-- TODO 另一按钮 -->
              <el-button round type="primary" style="margin-top: 12px;" @click="annotateNextPart">Annotate当前Part
              </el-button>
            </el-card>
          </el-col>
        </el-row>
      </el-main>
    </el-container>
  </el-container>
  <!-- TODO 方案2，用el-row和el-col，以及:gutter -->
</template>

<script>
import TestOrComponent from '@/components/test-framework-single/dynamic-aog/TestOrComponent'
import TestAndComponent from '@/components/test-framework-single/dynamic-aog/TestAndComponent'
import TestFinishing from '@/components/test-framework-single/dynamic-aog/TestFinishing'
// let outVue = this

export default {
  name: 'TestAppMain',
  data () {
    const generateHierarchy = _ => {
      return {
        name: 'root',
        description: 'root!',
        type: 'AND',
        children: [
          {
            name: 'part 1',
            description: 'des 1',
            type: 'AND',
            vModel: [],
            children: [
              {
                name: 'part 1 1',
                description: 'des 1 1',
                type: 'AND',
                vModel: [],
                children: [
                  {
                    name: 'part 1 1 1',
                    description: 'des 1 1 1'
                  }, {
                    name: 'part 1 1 2',
                    description: 'des 1 1 2'
                  }
                ]
              }, {
                name: 'part 1 2',
                description: 'des 1 2',
                type: 'OR',
                vModel: [],
                children: [
                  {
                    name: 'part 1 2 1',
                    description: 'des 1 2 1',
                    type: 'AND',
                    vModel: [],
                    children: [
                      {
                        name: 'part 1 2 1 1',
                        description: 'des 1 2 1 1'
                      },
                      {
                        name: 'part 1 2 1 2',
                        description: 'des 1 2 1 2'
                      }
                    ]
                  }, {
                    name: 'part 1 2 2',
                    description: 'des 1 2 2'
                  }
                ]
              }
            ]
          }, {
            name: 'part 2',
            description: 'des 2',
            type: 'AND',
            vModel: [],
            children: [
              {
                name: 'part 2 1',
                description: 'des 2 1',
                type: 'AND',
                vModel: [],
                children: [
                  {
                    name: 'part 2 1 1',
                    description: 'des 2 1 1'
                  }, {
                    name: 'part 2 1 2',
                    description: 'des 2 1 2'
                  }
                ]
              }, {
                name: 'part 2 2',
                description: 'des 2 2',
                type: 'AND',
                vModel: [],
                children: [
                  {
                    name: 'part 2 2 1',
                    description: 'des 2 2 1'
                  }, {
                    name: 'part 2 2 2',
                    description: 'des 2 2 2'
                  }
                ]
              }
            ]
          }
        ]
      }
    };
      // TODO compute depth
    const computeDepth = _ => {
      let maxDepth = 0;
      let root = generateHierarchy();
      root['depth'] = 0;
      let queue = [root];
      while (queue.length !== 0) {
        let part = queue.shift();
        if (part['children'] !== undefined) {
          part['children'].forEach(function (child) {
            child['depth'] = part['depth'] + 1;
            queue.push(child);
            if (child['depth'] > maxDepth) { // max() ??
              maxDepth = child['depth']
            }
          })
        }
      }
      console.log(root);
      console.log(maxDepth);
      return maxDepth
    };
    const generateHierarchyWithDepth = _ => {
      let root = generateHierarchy();
      root['depth'] = 0;
      let id = 1; // TODO 树形控件需要，root的第一个child为1
      let queue = [root];
      while (queue.length !== 0) {
        let part = queue.shift();
        part['id'] = id++;
        part['label'] = part['name'] + '：(简述)' + part['description'];
        if (part['children'] !== undefined) {
          part['children'].forEach(function (child) {
            child['depth'] = part['depth'] + 1;
            queue.push(child)
          })
        }
      }
      return root
    };
      // TODO initial progress
    const initialProgress = _ => {
      let result = [];
      let hierarchy = generateHierarchy();
      let depth = computeDepth();
      result.push({
        step: 'step 1!',
        description: hierarchy['description'],
        type: hierarchy['type']
      });
      for (let i = 2; i <= depth; i++) {
        let current = {};
        current['step'] = 'step ' + i;
        current['description'] = 'waiting for this level of hierarchy...';
        current['type'] = 'waiting...';
        result.push(current)
      }
      console.log(result);
      return result
    };
      // TODO initial level transfer
    const initialTransfer = _ => {
      let result = [];
      for (let child of generateHierarchy()['children']) {
        result.push({
          key: child['name'], // TODO 可否 字符串？
          label: child['name']
        })
      }
      console.log('！！');
      console.log(result);
      return result
    };

      // TODO 默认return
    return {
      // TODO dynamic component
      currentHeaderView: 'TestAndComponent',
      // TODO 步骤条
      activeStep: 0,
      // TODO dynamic v-for
      itemsTest: [
        {
          step: '步骤1',
          description: '描述' + ' : ' + '测试！',
          type: 'OR'
        },
        {
          step: '步骤2',
          description: '描述' + ' : ' + '测试！！',
          type: 'AND'
        },
        {
          step: '步骤3',
          description: '描述' + ' : ' + '测试！？！',
          type: 'AND'
        },
        {
          step: '最后一层',
          description: '描述' + ' : ' + '完成',
          type: 'OR'
        }
      ],
      itemsGenerateTest: initialProgress(),
      // TODO 测试hierarchy
      testHierarchy: generateHierarchyWithDepth(),
      // testHierarchy: this.generateHierarchy(),
      testHierarchyDepth: computeDepth(),
      // TODO 穿梭框 当前 绑定（key？）
      vModelValue: ['part 1'],
      currentLevelTransfer: initialTransfer(),
      // TODO 维护访问队列（！！！）
      visitingQueue: [generateHierarchyWithDepth()],
      // TODO 标签页 测试
      editableTabsValue2: '2',
      editableTabs2: [{
        title: 'Tab 1',
        name: '1',
        content: 'Tab 1 content'
      }, {
        title: 'Tab 2',
        name: '2',
        content: 'Tab 2 content'
      }],
      tabIndex: 2,
      // TODO 多选框 test
      checkboxGroupTest: [],
      checkboxGroupVFor: [
        {
          label: 'test 1',
          vModel: true
        },
        {
          label: 'test 2',
          vModel: false
        },
        {
          label: 'test 123',
          vModel: false
        }
      ],
      // TODO v-for & 多选框 + hover展示按钮
      buttonPopupTest: [
        {
          content: 'pop up 1',
          vModel: false
        },
        {
          content: 'pop up 2',
          vModel: true
        }
      ]
    }
  },
  components: {
    TestOrComponent: TestOrComponent,
    TestAndComponent,
    TestFinishing
  },
  methods: {
    nextStepOld () {
      // TODO 允许循环 for test
      if (this.activeStep++ >= this.testHierarchyDepth) {
        this.activeStep = 0
      }

      // TODO 如果不是完成了最后一步
      if (this.itemsTest[this.activeStep] !== undefined) {
        if (this.itemsTest[this.activeStep].type === 'OR') {
          this.currentHeaderView = 'TestOrComponent'
        } else if (this.itemsTest[this.activeStep].type === 'AND') {
          this.currentHeaderView = 'TestAndComponent'
        }
      } else {
        this.currentHeaderView = 'TestFinishing'
      }
    },
    nextStep () {
      // TODO 允许循环 for test
      if (this.activeStep >= this.testHierarchyDepth) {
        this.activeStep = 0
      }
      // TODO 如果没选，应该无反应
      if (this.vModelValue.length === 0) return;
      // TODO 更新 v-model选中项 到 目前hierarchy
      let visitingPart = this.visitingQueue.shift();
      visitingPart['vModel'] = this.vModelValue; // TODO 没更新上？中间可能某一步被隐copy了
      // TODO 存入 选中项s 到 queue -- BFS
      for (const partName of this.vModelValue) {
        // this.vModelValue.forEach(function (partName) {
        for (let child of visitingPart['children']) {
          if (partName === child['name']) {
            this.visitingQueue.push(child) // 应该是因为 用forEach涉及到this的scope问题
          }
        }
      }
      // TODO 刷新 目前步骤 到当前项的深度，以及description等
      let nextPart = this.visitingQueue[0];
      this.activeStep = nextPart['depth'];
      this.itemsGenerateTest[nextPart['depth']] = {
        step: 'step ' + (nextPart['depth'] + 1), // 这是key，不能变啊？！
        description: nextPart['description'],
        type: nextPart['type']
      };

      // TODO 刷新 transfer框的 v-model 到当前part的children
      this.vModelValue = nextPart['vModelValue']; // 应该是空
      this.currentLevelTransfer = [];
      if (nextPart['children'] === undefined) return; // TODO 如果没有children就跳过；还有毛病
      for (let child of nextPart['children']) {
        this.currentLevelTransfer.push({
          key: child['name'],
          label: child['name']
        })
      }

      // TODO 刷新左侧树形控件
      // TODO test
      this.testHierarchy['children'][0]['disabled'] = true;
      this.$refs.treeTest.setCheckedKeys([2]);
      console.log('【get】', this.$refs.treeTest.getCheckedKeys());
      // this.$refs.treeTest.setCheckedKeys(this.$refs.treeTest.getCheckedKeys() !== [] ? this.$refs.tree.getCheckedKeys().push(nextPart['id']) : nextPart['id'])
      this.$refs.treeTest.setCheckedKeys(this.$refs.treeTest.getCheckedKeys().push(nextPart['id']));
      nextPart['disabled'] = true;
      console.log('nextPart', nextPart);
      console.log(this.$refs.treeTest);
      this.$refs.treeTest.updateKeyChildren(nextPart['id'], nextPart);
      console.log('目前hier', this.testHierarchy);
      // this.$refs.treeTest.$forceUpdate()

      // TODO 更新view；如果不是完成了最后一步
      if (this.itemsGenerateTest[this.activeStep] !== undefined) {
        if (nextPart['type'] === 'OR') {
          this.currentHeaderView = 'TestOrComponent'
        } else if (nextPart['type'] === 'AND') {
          this.currentHeaderView = 'TestAndComponent'
        }
      } else {
        this.currentHeaderView = 'TestFinishing'
      }
    },
    // deprecated
    annotateNextPart () {
      const checkedKeys = this.$refs.treeTest.getCheckedKeys();
      let updated = this.visitingQueue[0];
      updated['disabled'] = true;
      console.log('this.visitingQueue[0][\'id\']', this.visitingQueue[0]);
      // this.$refs.treeTest.updateKeyChildren(this.visitingQueue[0]['id'], updated)
      console.log('checked key!!', checkedKeys.push(this.visitingQueue[0]['id']))
      // this.$refs.treeTest.setCheckedKeys(checkedKeys.push(this.visitingQueue[0]['id']))
      // this.visitingQueue[0]['disabled'] = true
    },
    // TODO 标签页 测试
    addTabTest (targetName) {
      let newTabName = ++this.tabIndex + '';
      this.editableTabs2.push({
        title: 'New Tab',
        name: newTabName,
        content: 'New Tab content'
      });
      this.editableTabsValue2 = newTabName
    },
    removeTabTest (targetName) {
      let tabs = this.editableTabs2;
      let activeName = this.editableTabsValue2;
      if (activeName === targetName) {
        tabs.forEach((tab, index) => {
          if (tab.name === targetName) {
            let nextTab = tabs[index + 1] || tabs[index - 1];
            if (nextTab) {
              activeName = nextTab.name
            }
          }
        })
      }
      this.editableTabsValue2 = activeName;
      this.editableTabs2 = tabs.filter(tab => tab.name !== targetName)
    }
  }
}
// TODO data()中 不能直接调用这里的方法？
// generateHierarchy () {
// }
</script>

<style scoped>

</style>
