<template>
  <el-container>
    <el-aside style="background: white;" width="20%">
      <!-- TODO Hierarchy Tree -->
      <el-card class="box-card">
        <!-- TODO Hover to show hierarchy tree -->
        <el-popover placement="right" trigger="hover" width="300">
          <el-button slot="reference" type="primary" round style="margin-bottom: 15px">
            Hover to Preview Hierarchy
          </el-button>
          <!-- filtering -->
          <el-input
            placeholder="Search"
            v-model="filterHierarchyText"
            style="margin-bottom: 10px;">
          </el-input>
          <!-- tree element: accordion mode + check strictly + don't expand when clicking + highlight -->
          <!-- node-key is generated 'key' because 'wn30synsetkey' sometimes is 'undefined' -->
          <el-tree
            ref="treeRef" node-key="key" class="filter-tree"
            :props="treeProps" :data="hierarchyTree" :filter-node-method="filterHierarchyNode"
            show-checkbox check-strictly accordion highlight-current :expand-on-click-node="false"
          >
            <span class="custom-tree-node" slot-scope="{node, data}">
              <span>{{ node.label }}</span>
              <span>
                <el-popover placement="top" trigger="hover">
                  [ Information ] <br>
                  {{ node.label }}:&nbsp;
                  {{ node.data['gloss'] !== 'undefined' ? node.data['gloss'] : 'No description.'}}
                  <el-button slot="reference" icon="edit" type="text" class="edit-btn">info</el-button>
                </el-popover>
              </span>
            </span>
          </el-tree>
        </el-popover>
        <!-- filtering -->
        <el-input
          placeholder="Search"
          v-model="filterAnnotatingHierarchyText"
          style="margin-bottom: 10px;">
        </el-input>
        <!-- tree element: check strictly + don't expand when clicking + highlight -->
        <!-- node-key is generated 'key' because 'wn30synsetkey' sometimes is 'undefined' -->
        <el-tree
          ref="treeAnnotatingRef" node-key="key" class="filter-tree"
          :props="treeProps" :data="hierarchyTreeAnnotatingRoot['nodes']" :filter-node-method="filterAnnotatingHierarchyNode"
          show-checkbox check-strictly highlight-current :expand-on-click-node="false"
          empty-text="Please add a node from right pane."
        >
          <span class="custom-tree-node" slot-scope="{node, data}">
            <span>{{ node.label }}</span>
            <span>
              <!--<el-button-->
                <!--type="text" size="mini"-->
                <!--@click="() => {-->
                <!--toLog(node);-->
                <!--}"-->
              <!--&gt;Log</el-button>-->
              <el-button :type="node.data['key'] === visitingQueue[0]['key'] ? 'warning' : 'text'" icon="el-icon-edit" size="mini"
                         @click="goToNode(node)"></el-button>
              <el-button
                type="text" size="mini"
                @click="() => {deleteNode(node);}">Del</el-button>
              <el-popover placement="top" trigger="hover">
                [ Information ] <br>
                {{ node.label }}:&nbsp;
                {{ node.data['gloss'] !== 'undefined' ? node.data['gloss'] : 'No description.'}}
                <el-button slot="reference" size="mini"
                           icon="edit" type="text" class="edit-btn">info</el-button>
              </el-popover>
            </span>
          </span>
        </el-tree>
      </el-card>
    </el-aside>
    <el-container>
      <!-- TODO header -->
      <el-header style="margin: 1px; background: white;" height="auto">
        <el-card>
          <el-steps :active="currentLevel" finish-status="success" align-center>
            <el-step v-for="item in hierarchySteps" :key="item.step" :title="item.step"
                     :description="'[Description]: ' + item.description">
            </el-step>
          </el-steps>
        </el-card>
      </el-header>
      <!-- TODO main content -->
      <el-main>
        <el-row :gutter="20">
          <!-- TODO Main Area - 16:8 -->
          <el-col :span="16" style="background: white;">
            <!-- TODO Renderer Area (no tab pane now) -->
            <el-tabs type="border-card">
              <el-tab-pane label="Renderer 1">
                <div id="rendered-div" ref="render_area"></div>
              </el-tab-pane>
              <el-tab-pane label="Preview Only">
                <h1>Testing Now</h1>
              </el-tab-pane>
            </el-tabs>
          </el-col>
          <el-col :span="8" style="background: white;">
            <!-- TODO Operation Area -->
            <el-card class="el-card">
              <el-button-group style="margin-bottom: 10px">
                <el-button type="primary" icon="el-icon-arrow-left"
                           :disabled="backStack.length === 0" @click="lastStep">
                  Last Step: L
                </el-button>
                <el-button type="primary" @click="nextStep">
                  Next Step: N<i class="el-icon-arrow-right el-icon--right"></i>
                </el-button>
              </el-button-group>
              <!--<br/>-->
              <!--<el-button type="success" round style="margin-bottom: 10px">Show All/Chose Nodes</el-button>-->
              <!--<el-button type="primary" round-->
                         <!--:loading="requestingRemesh" @click="requestRemesh">Segment Part-->
              <!--</el-button>-->
            </el-card>
            <!-- TODO Q&A Area -->
            <el-card class="box-card">
              <!-- TODO rating -->
              <template v-if="visitingQueue.length !== 0">
                Please rate the current node and choose next node(s) below.
                <!--<el-rate v-model="(clickNode === null ? visitingQueue[0] : clickNode)['vModelRate']"-->
                <el-rate v-model="visitingQueue[0]['vModelRate']"
                         :colors="['#99A9BF', '#F7BA2A', '#FF9900']"
                ></el-rate>
              </template>
              <!-- TODO finish (removing this template will cause error (undefined) in following v-for) -->
              <template v-if="visitingQueue.length === 0">
                You finished the annotation! Please submit or review the annotation.<br>
                <el-button type="success" round style="margin-top: 10px"
                           @click="() => {submitFinalResult();}"
                >
                  Submit the Annotation
                </el-button>
              </template>
              <!-- TODO OR -->
              <template v-else-if="visitingQueue[0]['questionType'] === 'OR'">
                Name: {{visitingQueue[0]['text']}}<br>
                Type: {{visitingQueue[0]['questionType']}}<br>
                <div v-for="item in visitingQueue[0]['nodes']"
                     :key="item['key']">
                  <el-popover placement="left" trigger="hover" width="300">
                    <!--<span slot="reference" style="float: left">--><!--</span>-->
                    <el-button slot="reference"
                               type="text" icon="el-icon-edit" size="small"
                               :disabled="visitingQueue[0]['vModelChoseNodeKey'] !== '0'"
                               @click="() => {nextOrStep(item); $message('Next part: ' + item.text);}">
                      [Part] {{item['text']}}
                    </el-button>
                    [Description]:&nbsp;
                    <div style="word-wrap: break-word;">
                      {{item['gloss']}}
                    </div>
                    <img :src="'/static/test-description-figures/test.png'" width="300px">
                  </el-popover>
                </div>
              </template>
              <!-- TODO AND -->
              <template v-else-if="visitingQueue[0]['questionType'] === 'AND'">
                Name: {{visitingQueue[0]['text']}}<br>
                Type: {{visitingQueue[0]['questionType']}}<br>
                <div v-for="item in visitingQueue[0]['nodes']" :key="item['key']">
                  <el-popover placement="left" trigger="hover" width="300">
                    <div slot="reference">
                      [#]{{item['text']}}:
                      <el-input-number controls-position="right" :min="0" :max="10" size="mini"
                                       v-model="item['vModelNumber']"></el-input-number>
                    </div>
                    [Description]:&nbsp;
                    <div style="word-wrap: break-word;">
                      {{item['gloss']}}<br>
                    </div>
                    <img :src="'/static/test-description-figures/test.png'" height="300px">
                  </el-popover>
                </div>
              </template>
              <!-- TODO LEAF -->
              <template v-else-if="visitingQueue[0]['questionType'] === 'LEAF'">
                Name: {{visitingQueue[0]['text']}}<br>
                Type: {{visitingQueue[0]['questionType']}}<br>
                Please choose the corresponding parts in the renderer.<br>
                You can cut the part by clicking [1] and submit it by clicking [2].<br>
                <el-button type="primary" round :disabled="allow_part_cutting"
                           :loading="requestingRemesh" @click="requestRemesh" style="margin-top: 5px; margin-bottom: 5px">[1] Segment Selected Part(s)
                </el-button><br>
                <el-button type="success" round :disabled="!allow_part_cutting"
                           :loading="requestingRemesh" @click="submitPartCuttingResult" style="margin-top: 5px; margin-bottom: 5px">[2] Submit Parts Cutting
                </el-button><br>
              </template>
              <template v-else>
                Error: no type!
                <br>
              </template>
            </el-card>
          </el-col>
        </el-row>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import Axios from 'axios';
import $ from 'jquery'; // locally import jQuery
import * as THREE from 'three';
import ObjMtlLoader from 'obj-mtl-loader';
import threeOrbitControls from 'three-orbit-controls';
// import qs from 'qs';

const Graph = require('@/assets/library/graph_new');
// const request = require('request');

const conf = require('@/assets/backend_config');
// import backendConfig from '@/assets/backend_config';

// block some eslint rules for this file
/* eslint-disable camelcase */
/* eslint-disable one-var */
// eslint-disable-next-line no-extend-native
Set.prototype.union = function (setB) {
  const union = new Set(this);
  for (let elem of setB) {
    union.add(elem);
  }
  return union;
};

export default {
  name: 'Main',
  created: function () {
    // TODO some initialization
    console.log('[ created. ]');
    // TODO instruction (before beginning the loading)
    const testing = true; // TODO testing single page
    if (!testing && this.$route.params['username'] === undefined) {
      this.$router.push({
        name: 'Login',
        params: {}
      });
    } else {
      const instruction =
        'Instruction: <br>' +
        '&nbsp;&nbsp;Please follow the right side (Q&A) panel to annotate the model. You can rate the node and add "other" node if the hierarchy cannot precisely describe the model.<br>' +
        'Important Keys:<br>' +
        '--Normal Mode:<br>' +
        '----[S]: select a part<br>' +
        '--Cutting Mode:<br>' +
        '----[S]: select a point to construct a boundary<br>' +
        '----[C]: cut the part along the boundary<br>' +
        '----[B]: submit the cutting result (or the button)<br>' +
        '----[.]:<br>';
      console.log('instruction - ', instruction);
      this.$alert(instruction, 'Instruction', {
        confirmButtonText: 'confirm',
        dangerouslyUseHTMLString: true
      });
    }
  },
  mounted: function () {
    // TODO request some resources from backend
    console.log('[ mounted: requesting resources from backend ]');
    // TODO print all params
    console.log('[ params (if is from GET): ]', this.$route.params);
    // TODO loading & animation (close after Axios obj files request)
    const loading = this.$loading({lock: true, text: 'Loading Resource ...'});
    this.initLoad();
    loading.close(); // setTimeout(() => { loading.close(); }, 2000);
  },
  data () {
    return {
      // TODO Initialization (from $router.push())
      // username: this.$route.params['username'],
      // model_id: this.$route.params['model_id'],
      // model_cat: this.$route.params['model_cat'],
      // anno_id: this.$route.params['anno_id'],
      // anno_version: this.$route.params['anno_version'],
      // allow_edit: this.$route.params['allow_edit'] === 'true',
      // load_parent_anno: this.$route.params['load_parent_anno'] === 'true',
      // TODO for testing
      username: 'linfeng',
      model_id: 'c04f515b688f9d97fff16555386d173d',
      model_cat: 'Chair',
      anno_id: 56,
      anno_version: 2,
      allow_edit: true,
      load_parent_anno: true, // TODO test: don't load parent annotation
      // TODO Data: Hierarchy Tree
      hierarchyTree: [],
      hierarchyTreeRoot: {},
      hierarchyDepth: 0,
      hierarchyMinDepth: 99,
      treeProps: { // set the name of label and children
        label: 'text',
        children: 'nodes'
      },
      filterHierarchyText: '', // same name with a 'watch' method
      filterAnnotatingHierarchyText: '', // for annotating hierarchy
      switchShowAll: true,
      clickNode: null, // TODO clicked node
      // TODO Data: User Annotated Hierarchy Tree
      hierarchyTreeAnnotatingRoot: {},
      // TODO Data: Progress Steps
      visitingQueue: [], // TODO for BFS / DFS
      backStack: [], // TODO for going back
      hierarchySteps: [],
      currentLevel: 0,
      // TODO Data: Q & A - AND / OR / LEAF
      requestingRemesh: false,
      // TODO Data: THREE (don't write renderer-related variables here)
      allow_part_cutting: false,
      allow_select_part_cut: false,
      allow_select_boundary: false
    };
  },
  methods: {
    // TODO init
    initLoad () {
      // TODO init render
      this.initRender();
      // TODO key press
      $(document).keypress(this.processKeyPress);
      // TODO load annotation info
      // this.loadAnnoInfo();
      // TODO load obj files & parent annotation
      this.loadAllObj(this.anno_version && this.load_parent_anno);
      // TODO load hierarchy tree & init progress step
      this.loadHierarchy();
    },
    processKeyPress (event) {
      if (event.keyCode === 87 || event.keyCode === 119) {
        // W/w --> toggle wireframe on/off
        this.wireframeSwitch = !this.wireframeSwitch;
        this.toggleWireframe();
      } else if (event.keyCode === 82 || event.keyCode === 114) {
        // R/r --> toggle camera resetRender
        this.resetRender();
      } else if (event.keyCode === 83 || event.keyCode === 115) {
        // S/s--> select part/point
        if (this.allow_part_click) {
          this.processPartSelect();
        }
        if (this.allow_part_cutting && this.allow_select_boundary) {
          // this.switch_submit_part_cutting = 0;
          this.processRemeshPointClick();
        }
        if (this.allow_part_cutting && this.allow_select_part_cut) {
          // this.switch_submit_part_cutting = 0;
          this.processRemeshPartSelect();
        }
      } else if (event.keyCode === 77 || event.keyCode === 109) {
        // M/m --> request remesh the current set of selected parts
        if (!this.allow_part_cutting && this.allow_part_click) {
          this.requestRemesh();
        }
      //   if (this.allow_part_cutting && !this.allow_part_click) {
      //     this.undo_current_remeshing();
      //   }
      // } else if (event.keyCode === 68 || event.keyCode === 100) {
      //   // D/d --> delete point/last part cut (for remeshed part cutting only)
      //   if (this.allow_part_cutting && this.allow_select_boundary) {
      //     this.switch_submit_part_cutting = 0;
      //     this.process_remesh_point_delete();
      //   }
      } else if (event.keyCode === 67 || event.keyCode === 99) {
        // C/c --> process a part cut (for remeshed part cutting only)
        if (this.allow_part_cutting) {
          this.processPartCut();
        }
      // } else if (event.keyCode === 85 || event.keyCode === 117) {
      //   // U/u --> process a part cut undo (for remeshed part cutting only)
      //   if (this.allow_part_cutting) {
      //     this.process_part_cut_undo();
      //   }
      } else if (event.keyCode === 88 || event.keyCode === 120) {
        // X/x --> delete the current boundary (for remeshed part cutting only)
        if (this.allow_part_cutting) {
          this.deleteBoundary();
        }
      } else if (event.keyCode === 91 || event.keyCode === 123) {
        // [/{ --> select the previous boundary edge (for remeshed part cutting only)
        if (this.allow_part_cutting) {
          this.selectPreviousSegment();
        }
      } else if (event.keyCode === 93 || event.keyCode === 125) {
        // ]/} --> select/generate the next boundary edge (for remeshed part cutting only)
        if (this.allow_part_cutting) {
          this.selectNextSegment();
        }
      } else if (event.keyCode === 66 || event.keyCode === 98) {
        // B --> submit cutting result
        if (this.allow_part_cutting) {
          this.submitPartCuttingResult();
        }
      }
    },
    initRender () {
      console.log('[ initiating render ... ]');
      this.sizeSetting = {
        width: window.innerWidth / 2.2,
        height: window.innerHeight / 2.2,
        ratio: window.innerWidth / window.innerHeight
      };
      // init: THREE.js variables (much overhead if in data())
      this.scene = new THREE.Scene();
      this.OrbitControls = threeOrbitControls(THREE); // const OrbitControls = require('three-orbit-controls')(THREE);

      this.camera = new THREE.PerspectiveCamera(75, this.sizeSetting.ratio, 0.1, 1000);
      this.camera.position.set(-1, 1, -1);
      this.camera.lookAt(new THREE.Vector3(0, 0, 0));

      this.renderer = new THREE.WebGLRenderer({
        preserveDrawingBuffer: true
      });
      this.renderer.setPixelRatio(window.devicePixelRatio);
      this.renderer.setSize(this.sizeSetting.width, this.sizeSetting.height);
      document.getElementById('rendered-div').appendChild(this.renderer.domElement);

      // others
      this.amb_light = new THREE.AmbientLight(0x404040);
      this.amb_light.intensity = 2;
      this.scene.add(this.amb_light);

      this.light1 = new THREE.PointLight(0xFFFFFF);
      this.light1.position.set(1, 5, 1);
      this.scene.add(this.light1);

      this.light2 = new THREE.PointLight(0xFFFFFF);
      this.light2.position.set(1, -5, 1);
      this.scene.add(this.light2);

      // setup controls
      this.controls = new this.OrbitControls(this.camera, this.renderer.domElement);
      this.controls.minDistance = 0;
      this.controls.maxDistance = 15;
      this.controls.enablePan = true;
      this.controls.maxPolarAngle = Math.PI;
      this.controls.addEventListener('change', this.render);

      // listen to UI interactions
      this.renderer.domElement.addEventListener('mousemove', () => {
        // offset relative to the renderer
        this.mouse_x = ((event.offsetX) / this.renderer.domElement.clientWidth) * 2 - 1;
        this.mouse_y = -((event.offsetY) / this.renderer.domElement.clientHeight) * 2 + 1;
        // hover during part cutting
        if (this.allow_part_cutting && this.allow_select_part_cut) {
          this.processRemeshPartHover();
        }
      });
      this.render();

      // the current model
      this.remeshed_part = null;
      this.scene_graph = null;

      // raycaster and mouse interactions
      this.mouse_x = null;
      this.mouse_y = null;
      this.mouse_mesh_selection_on = false;

      this.allow_part_click = false;

      this.current_part_color = 0xFF00000;
      this.default_part_color = 0xD3D3D3;

      this.current_remesh_part_id = null;

      this.selected_part_ids = new Set();
      this.selected_part_objs = new Set();

      // for edge boundary cutting a part
      this.current_remesh_obj = null;
      this.map = null;
      this.edge2faces = null;
      this.cut_edge_set = null;
      this.faceid_2_part_seg_id = null;
      this.num_part_cut = null;
      this.part_colors = null;
      this.faceid_2_current_part_seg_id = null;

      // this.switch_submit_part_cutting = 0;

      this.switch_load_part_hier_template = false;

      this.seg_id_2_boundary_segments = [];
      this.current_segment_id = null;

      this.current_num_obj_loaded = 0;

      this.seg_id_2_part_seg_color = [];
      this.seg_id_2_current_part_seg_color = [];

      this.color_segment_normal = 'yellow';
      this.color_segment_highlight = 'blue';
      this.segment_sphere_radius = 0.004;

      this.bg_color_remesh = 0xADD8E6;
      this.bg_color_normal = 0x000000;

      this.renderer.setClearColor(new THREE.Color(this.bg_color_normal));
    },
    // TODO load: annotation info
    loadAnnoInfo () { // TODO for testing (corresponding to Model ID 'c04f515b688f9d97fff16555386d173d')
      const url = conf.SERVER_URL_TESTING + conf.get_anno_info + '/' + '56';
      Axios.get(url, {})
        .then(response => {
          console.log('[ load anno info (test) ]', response);
        }).catch(error => {
          console.log(error);
        })
    },
    // TODO load: hierarchy tree & progress
    loadHierarchy () {
      const file_path = '/static/part-hier-templates/' + this.model_cat + '.json';
      $.getJSON(file_path, json => {
        this.hierarchyTree = json;
        this.hierarchyTreeRoot = {
          wn30synsetkey: 'not_apply',
          text: 'root',
          nodes: json
        };
        console.log('[ load hierarchy (from local /static) ] hierarchy: ', this.hierarchyTree);
        // following init
        this.processHierarchy();
        this.loadAnnotatedHierarchy(this.anno_version && this.load_parent_anno);
        this.initProgressSteps();
      }); // Axios.get('/static/part-hier-templates/' + this.model_cat + '.json').then(response => { this.hierarchyTree = response.data; });
    },
    processHierarchy () { // compute depth / assign key / ...
      let key = 0;
      let maxDepth = 0;
      let minDepth = 99;
      this.hierarchyTreeRoot['depth'] = 0;
      let queue = [this.hierarchyTreeRoot];
      while (queue.length !== 0) {
        let part = queue.shift();
        part['key'] = String(key++); // compute key (wn30synsetkey may be 'undefined')
        part['disabled'] = true;
        this.$set(part, 'vModelRate', 5); // TODO rate (default: 5 stars)
        // init v-model (root (depth = 0) = OR) & "other" nodes
        if (part['depth'] % 2 === 0) { // OR
          part['questionType'] = 'OR';
          // [!] Vue.js cannot detect directly adding a key -> need this.$set()
          this.$set(part, 'vModelNumber', 0); // AND: number of current parts
          this.$set(part, 'vModelChoseNodeKey', '0'); // OR: type of next node
          // "other" sub-type
          if (part['nodes'] !== undefined) {
            part['nodes'].push({
              key: String(key++),
              questionType: 'AND',
              text: 'other_AND',
              wn30synsetkey: 'not_apply_other',
              gloss: 'user added other sub-type'
            });
          }
        } else { // AND
          part['questionType'] = 'AND';
          // "other" sub-part OR
          if (part['nodes'] !== undefined) {
            part['nodes'].push({
              key: String(key++),
              questionType: 'OR',
              text: 'other_OR',
              wn30synsetkey: 'not_apply_other',
              gloss: 'user added other sub-part',
              vModelNumber: 0,
              vModelChoseNodeKey: '0'
            });
          }
        }
        // depth & LEAF node
        if (part['nodes'] !== undefined) {
          part['nodes'].forEach(child => {
            child['depth'] = part['depth'] + 1;
            queue.push(child);
            maxDepth = Math.max(child['depth'], maxDepth);
          })
        } else if (part['wn30synsetkey'] !== 'not_apply_other') {
          part['questionType'] = 'LEAF';
          minDepth = Math.min(part['depth'], minDepth);
        }
      }
      this.hierarchyDepth = maxDepth;
      this.hierarchyMinDepth = minDepth;
      console.log('[ process hierarchy ] [ root / (max/min) depth: ]', this.hierarchyTreeRoot, maxDepth, minDepth);
    },
    loadAnnotatedHierarchy (if_load_parent) { // TODO
      // TODO testing !
      if_load_parent = false;

      if (if_load_parent) {
        // TODO
      } else {
        // deep copy
        this.hierarchyTreeAnnotatingRoot = JSON.parse(JSON.stringify(this.hierarchyTreeRoot));
        this.visitingQueue.push(this.hierarchyTreeAnnotatingRoot);
      }
    },
    initProgressSteps () {
      const initDepth = Math.max(this.hierarchyMinDepth, 3); // at least show 3 steps initially
      let result = [];
      for (let i = 1; i <= initDepth; i++) {
        result.push({
          step: 'Level ' + i,
          description: '(waiting for this level of hierarchy)',
          type: '(waiting)'
        });
      }
      result[initDepth - 1]['step'] += '...';
      result[initDepth - 1]['description'] = '(waiting for this and following levels of hierarchy)';
      this.hierarchySteps = result;
      console.log('[ init progress steps ]', this.hierarchySteps, this.visitingQueue);
    },
    // TODO load: obj files
    loadAllObj (if_load_parent) {
      if (!if_load_parent) {
        console.log('[ loading original scene graph and obj files ... ]');
        const scene_graph_url =
            conf.SERVER_URL_TESTING + conf.get_original_scene_graph + '/' +
            this.model_cat + '-' + this.model_id;
        Axios.get(scene_graph_url, {})
          .then(response => {
            console.log('[ scene_graph_json ]', response);
            const scene_graph_json = response.data;
            // load leaf node obj files
            for (let key in scene_graph_json) { // reading json by 'for ... in ...'
              if (key !== 'root' && scene_graph_json[key].length === 0) {
                this.loadObj('original', Number(key) + 1); // offset
              }
            }
          })
          .catch(error => {
            console.log('[ loading original scene graph and obj files: ] error: ', error);
          });
      } else {
        console.log('[ loading parent annotation and obj files ... ]');
        const scene_graph_url =
            conf.SERVER_URL_TESTING + conf.get_anno_obj_list + '/' +
            this.anno_id + '-' + this.anno_version;
        Axios.get(scene_graph_url, {})
          .then(response => {
            console.log('[ parent_scene_graph_json ]', response);
            const parent_scene_graph_json = response.data;
            // load parent annotation leaf nodes
            for (let key of parent_scene_graph_json) {
              const part_name_split = key.split('-');
              const part_type = part_name_split[0];
              const part_id = part_name_split[1];
              this.loadObj(part_type, part_id);
            }
          })
          .catch(error => {
            console.log('[ loading parent annotation and obj files: ] error: ', error);
          });
      }
    },
    loadObj (part_type, part_id) {
      let file_path = conf.SERVER_URL_TESTING;
      // let file_path = conf.remoteHost + ':' + conf.remotePort;
      if (part_type === 'original') {
        file_path += conf.get_original_part + '/' + this.model_cat + '-' +
            this.model_id + '-' + part_id;
      } else if (part_type === 'new') {
        file_path += conf.get_new_part + '/' + this.anno_id + '-' + part_id;
      } else if (part_type === 'remesh') {
        file_path += conf.get_remesh_part + '/' + this.anno_id + '-' + part_id;
        console.log('[ load obj: remesh file ]', file_path);
      } else {
        console.error('[Load OBJ] part type ' + part_type + ' is not valid!');
        return;
      }

      // console.log('[ loading obj ] from: ', file_path);
      const objMtlLoader = new ObjMtlLoader();
      objMtlLoader.load(file_path, (err, result) => { // use '=>' to bind 'this'
        if (err) {
          console.log('[ load obj ] error! ', file_path);
        }

        let vertices = result.vertices;
        let faces = result.faces;
        let geometry = new THREE.Geometry();
        // load vertex
        for (let i = 0; i < vertices.length; ++i) {
          const vertex = new THREE.Vector3(vertices[i][0], vertices[i][1], vertices[i][2]);
          geometry.vertices.push(vertex);
        }
        // load face
        for (let i = 0; i < faces.length; ++i) {
          for (let j = 1; j <= faces[i].indices.length - 2; ++j) {
            let face = new THREE.Face3(faces[i].indices[0] - 1, faces[i].indices[j] - 1, faces[i].indices[j + 1] - 1);
            face.faceid = i;
            geometry.faces.push(face);
          }
        }
        geometry.computeFaceNormals();
        geometry.computeVertexNormals();

        // material
        const opacMaterial = new THREE.MeshPhongMaterial({
          transparent: true,
          opacity: 0.5,
          color: this.default_part_color,
          vertexColors: THREE.VertexColors,
          side: THREE.DoubleSide
        });
        const solidMaterial = new THREE.MeshPhongMaterial({
          transparent: false,
          color: this.default_part_color,
          vertexColors: THREE.VertexColors,
          side: THREE.DoubleSide
        });
        const mesh = new THREE.Mesh(geometry, [solidMaterial, opacMaterial]);
        mesh.part_id = part_id;
        mesh.part_type = part_type;
        mesh.is_part_mesh = true;
        mesh.url = file_path; // not used?
        mesh.part_select = false;

        this.scene.add(mesh);
        // console.log('vertex number: ', mesh.geometry.vertices.length);
        // console.log('face number: ', mesh.geometry.faces.length);

        if (part_type === 'original' || part_type === 'new') {
          this.renderer.setClearColor(new THREE.Color(this.bg_color_normal));
          this.render();
        } else if (part_type === 'remesh') {
          this.allow_part_click = false;
          this.allow_part_cutting = true;
          this.allow_select_boundary = true;
          // during remeshing: hide all other parts & show only current part
          this.scene.children.forEach(child => {
            if (child.type === 'Mesh' && child.part_type !== 'remesh') {
              child.visible = false;
            }
          });
          // other
          mesh.visible = true;
          mesh.center_offset = mesh.geometry.center();
          // init part segmentation & compute meta information
          this.current_remesh_obj = mesh;
          this.num_part_cut = 0;
          this.part_colors = [];
          this.faceid_2_part_seg_id = [];
          for (let i = 0; i < mesh.geometry.faces.length; ++i) {
            this.faceid_2_part_seg_id[i] = 0;
          }
          this.computeMeshMetaInfo(mesh.geometry);
          // render
          this.renderer.setClearColor(new THREE.Color(this.bg_color_remesh));
          this.render();
        }
        ++this.current_num_obj_loaded;
        console.log('[ current_num_obj_loaded: ]', this.current_num_obj_loaded);
      });
    },
    computeMeshMetaInfo (geom) {
      console.log('[ compute mesh meta information ... ]');
      this.map = {};
      this.edge2faces = {};
      for (let i = 0; i < geom.vertices.length; ++i) {
        this.map[i] = {};
      }

      const get_edge_name = function (x, y) {
        if (x < y) return x + '-' + y; else return y + '-' + x;
      };
      const get_edge_len = function (x, y) {
        const x_diff = geom.vertices[x].a - geom.vertices[y].a;
        const y_diff = geom.vertices[x].b - geom.vertices[y].b;
        const z_diff = geom.vertices[x].c - geom.vertices[y].c;
        return Math.sqrt(Math.pow(x_diff, 2) + Math.pow(y_diff, 2) + Math.pow(z_diff, 2));
      };
      const process_edge = (x, y, i) => {
        const edge = get_edge_name(x, y);
        if (edge in this.edge2faces) {
          this.edge2faces[edge].push(i);
        } else {
          this.edge2faces[edge] = [i];
        }

        const edge_dist = get_edge_len(x, y);
        this.map[x][y] = edge_dist;
        this.map[y][x] = edge_dist;
      };

      for (let i = 0; i < geom.faces.length; ++i) { // edge to face id (i)
        process_edge(geom.faces[i].a, geom.faces[i].b, i);
        process_edge(geom.faces[i].b, geom.faces[i].c, i);
        process_edge(geom.faces[i].c, geom.faces[i].a, i);
      }
    },
    // TODO render & snapshot
    render () {
      this.renderer.render(this.scene, this.camera);
    },
    resetRender () {
      // TODO reset width & height
      this.controls.reset();
      this.render();
    },
    getSnapshot () {
      this.resetRender();
      try {
        return this.renderer.domElement.toDataURL('image/jpeg');
        // this.snapshot = this.renderer.domElement.toDataURL('image/jpeg');
        // console.log('[ get snapshot ] got snapshot!');
      } catch (error) {
        console.log('[ get snapshot ] error:', error);
      }
    },
    // TODO Q&A
    goToNode (choseNode) { // TODO
      console.log('[ go to node: ]', choseNode);
      // remove
    },
    nextOrStep (chosePart) {
      console.log('[ next OR step ] chose part: ', chosePart);
      this.$message({
        message: 'Going to next question',
        type: 'success'
      });
      this.allow_part_click = false;
      // TODO if: "other"
      if (chosePart['text'] === 'other_AND') {
        this.$prompt('Please type the name of "other type" you chose:', 'Name of other type', {
          confirmButtonText: 'Confirm',
          cancelButtonText: 'Cancel',
          inputPattern: /^[a-zA-Z][a-zA-Z0-9_]{2,30}$/,
          inputErrorMessage: 'The length of name should be greater than 2 and less than 30. It can only contain letters and "_".'
        }).then(({value}) => {
          chosePart['text'] = value;
          this.$set(chosePart, 'nodes', [
            {
              key: chosePart['key'] + '-L',
              depth: chosePart['depth'] + 1,
              questionType: 'LEAF',
              text: 'other_leaf',
              wn30synsetkey: 'not_apply_other',
              gloss: 'user added other leaf node',
              vModelNumber: 0,
              disabled: true
            },
            {
              key: chosePart['key'] + '-A',
              depth: chosePart['depth'] + 1,
              questionType: 'AND', // AND-AND
              text: 'other_AND',
              wn30synsetkey: 'not_apply_other',
              gloss: 'user added other AND node',
              vModelNumber: 0,
              // vModelChoseNodeKey: '0',
              disabled: true
            }
          ]);
        });
      }
      // visiting queue & stack
      let parentPart = this.visitingQueue.shift();
      this.backStack.push(parentPart);
      this.visitingQueue.push(chosePart);
      parentPart['nodes'] = [chosePart];
      parentPart['vModelChoseNodeKey'] = chosePart['key'];
      // hierarchy tree
      let checkedKeys = this.$refs.treeRef.getCheckedKeys();
      checkedKeys.push(chosePart['key']);
      this.$refs.treeRef.setCheckedKeys(checkedKeys);
      let checkedAnnotatingTreeKeys = this.$refs.treeAnnotatingRef.getCheckedKeys();
      checkedAnnotatingTreeKeys.push(chosePart['key']);
      this.$refs.treeAnnotatingRef.setCheckedKeys(checkedAnnotatingTreeKeys);
      this.expandAllAnnotatingNodes();
      // progress step & hierarchy
      this.updateStepStatus();
    },
    nextStep () {
      let parentPart = this.visitingQueue[0];
      console.log('[ next step ] visiting part: ', parentPart);
      this.$message({
        message: 'Going to next question',
        type: 'success'
      });

      if (this.allow_part_cutting) {
        this.$message({
          message: 'Please submit part cutting result by the button below!',
          type: 'warning'
        });
        return;
      }

      if (parentPart['questionType'] === 'OR') {
        this.$message({
          message: 'Please choose from following types (buttons)!',
          type: 'warning'
        });
      } else if (parentPart['questionType'] === 'AND') {
        // visiting queue & stack
        parentPart = this.visitingQueue.shift();
        this.backStack.push(parentPart);
        // hierarchy tree
        let choseNodes = [];
        let checkedKeys = this.$refs.treeRef.getCheckedKeys();
        let checkedAnnotatingTreeKeys = this.$refs.treeAnnotatingRef.getCheckedKeys();
        for (let node of parentPart['nodes']) {
          for (let i = 0; i < node['vModelNumber']; ++i) {
            let newNode;
            if (!node['text'].startsWith('other_')) {
              newNode = JSON.parse(JSON.stringify(node));
              newNode['key'] += '-' + String(i + 1);
              newNode['text'] += ' - ' + String(i + 1);
              // TODO if: other
            } else if (node['questionType'] === 'LEAF') {
              newNode = {
                key: node['key'] + '-' + String(i + 1),
                depth: node['depth'],
                questionType: 'LEAF',
                text: node['text'] + ' - ' + String(i + 1),
                wn30synsetkey: 'not_apply_other',
                vModelNumber: 0,
                vModelRate: 5,
                disabled: true
              }
            } else {
              newNode = {
                key: node['key'] + '-' + String(i + 1),
                depth: node['depth'],
                questionType: 'AND',
                text: node['text'] + ' - ' + String(i + 1),
                wn30synsetkey: 'not_apply_other',
                vModelNumber: 0,
                vModelRate: 5,
                disabled: true,
                nodes: [
                  {
                    key: node['key'] + '-' + String(i + 1) + '-L',
                    depth: node['depth'] + 1,
                    questionType: 'LEAF',
                    text: 'other_leaf',
                    wn30synsetkey: 'not_apply_other',
                    gloss: 'user added other leaf node',
                    vModelNumber: 0,
                    vModelRate: 5,
                    disabled: true
                  },
                  {
                    key: node['key'] + ' - ' + String(i + 1) + '-A',
                    depth: node['depth'] + 1,
                    questionType: 'AND', // AND-AND
                    text: 'other_AND',
                    wn30synsetkey: 'not_apply_other',
                    gloss: 'user added other AND node',
                    vModelNumber: 0,
                    // vModelChoseNodeKey: '0',
                    vModelRate: 5,
                    disabled: true
                  }
                ]
              };
            }
            choseNodes.push(newNode);
            // check
            if (i === 0) { checkedKeys.push(node['key']); }
            checkedAnnotatingTreeKeys.push(newNode['key']);
          }
        }
        if (choseNodes.length === 0) {
          this.$message({
            message: 'Please choose at least one parts.',
            type: 'warning'
          });
          this.visitingQueue.unshift(parentPart);
          return;
        }
        parentPart['nodes'] = choseNodes;
        this.$refs.treeRef.setCheckedKeys(checkedKeys); // check
        this.$refs.treeAnnotatingRef.setCheckedKeys(checkedAnnotatingTreeKeys); // TODO not working !!!
        this.expandAllAnnotatingNodes();
        // visiting queue & progress step & hierarchy
        this.visitingQueue = this.visitingQueue.concat(choseNodes); // push all parts of AND node to the queue
        this.updateStepStatus();
      } else if (parentPart['questionType'] === 'LEAF') {
        // annotating
        if (this.annotatePart(parentPart)) {
          // visiting queue & stack
          parentPart = this.visitingQueue.shift();
          this.backStack.push(parentPart);
          this.allow_part_click = false; // after finish
        }
        // visiting queue & hierarchy
        this.updateStepStatus();
      }
    },
    updateStepStatus () {
      // current level
      const nextPart = this.visitingQueue[0];
      this.currentLevel = nextPart['depth']; // BFS / currentLevel is monotonically increasing
      const content = {
        step: 'Level ' + this.currentLevel, // key / same as the 'step' in initProgressSteps ()
        description: nextPart['text'] + ': ' + nextPart['gloss'],
        type: nextPart['questionType']
      };
      if (this.hierarchySteps.length >= this.currentLevel) {
        this.hierarchySteps[this.currentLevel - 1] = content;
      } else {
        this.hierarchySteps.push(content);
      }
      // hierarchy tree
      this.collapseDetailedNodes();
      // annotation
      if (nextPart['questionType'] === 'LEAF') {
        this.allow_part_click = true;
      }
    },
    lastStep () { // TODO (consider "annotated")
      this.$confirm('(still in developing!) Do you want to go to the last step? You current step cannot be recovered.', 'Last Step', {
        type: 'warning',
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel'
      }).then(() => {
        // // this.visitingQueue.unshift(this.backStack.pop());
        // let lastNode = this.backStack.pop();
        // if (lastNode['questionType'] === 'AND') {
        //   // TODO
        // } else if (lastNode['questionType'] === 'OR') {
        //   // TODO
        // } else if (lastNode['questionType'] === 'LEAF') {
        //   // TODO
        // }
        this.$message({
          type: 'info',
          message: '(still in developing!) Go to the last step'
        });
      })
    },
    getDescription () { // TODO get description figures from the server
    },
    // TODO editing hierarchy
    deleteNode (node) { // TODO
      if (node['vModelNumber'] === 0) {
        this.$confirm('Do you want to delete this node?', 'Confirm: Delete', {
          cancelButtonText: 'Cancel',
          confirmButtonText: 'Confirm'
        }).then(() => {
          // TODO
        });
      } else {
        this.$message({
          message: 'Cannot delete the node.',
          type: 'warning'
        });
      }
    },
    // TODO segmentation: operating & processing
    resetPartColor () {
      console.log('[ init part color (part_lick_init) ]');
      for (let obj of this.selected_part_objs) {
        obj.part_select = false;
        for (let mat of obj.material) {
          if (obj.assigned_color === undefined) {
            mat.color.setHex(this.default_part_color);
          } else {
            mat.color.set(obj.assigned_color);
          }
        }
      }
      this.render();
      this.selected_part_ids = new Set();
      this.selected_part_objs = new Set();
    },
    annotatePart (annotatedPart) {
      if (this.selected_part_ids.size === 0) {
        this.$message('Please annotate at least one part.');
        return false;
      } else {
        this.$set(annotatedPart, 'parts_ids', this.selected_part_ids);
        this.$set(annotatedPart, 'parts_objs', this.selected_part_objs);
        // random color
        let r = Math.floor(Math.random() * 256);
        let g = Math.floor(Math.random() * 256);
        let b = Math.floor(Math.random() * 256);
        if (r > g && r > b) {
          const tmp = r;
          r = g;
          g = tmp;
        }
        const random_color = 'rgb(' + r + ',' + g + ',' + b + ')';
        // const hex_color = '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
        for (let obj of this.selected_part_objs) {
          obj.assigned_color = random_color;
        }
        this.resetPartColor();
        // hierarchy tree
        let checkedKeys = this.$refs.treeRef.getCheckedKeys();
        let checkedAnnotatingTreeKeys = this.$refs.treeAnnotatingRef.getCheckedKeys();
        checkedKeys.push(annotatedPart['key']);
        checkedAnnotatingTreeKeys.push(annotatedPart['key']);
        this.$refs.treeRef.setCheckedKeys(checkedKeys);
        this.$refs.treeAnnotatingRef.setCheckedKeys(checkedAnnotatingTreeKeys); // TODO
        return true;
      }
    },
    processPartSelect () {
      console.log('[ process part select ] point: ' + this.mouse_x + ',' + this.mouse_y);
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(new THREE.Vector2(this.mouse_x, this.mouse_y), this.camera);
      const intersects = raycaster.intersectObjects(this.scene.children);
      for (let intersect of intersects) {
        if (intersect.object instanceof THREE.Mesh) {
          const selected_part = intersect.object;
          if (selected_part.assigned_color === undefined) { // haven't annotated before
            selected_part.part_select = !selected_part.part_select;
            if (selected_part.part_select) {
              this.selected_part_ids.add(selected_part.part_type + '-' + selected_part.part_id);
              this.selected_part_objs.add(selected_part);
              for (let mat of selected_part.material) {
                mat.color.setHex(this.current_part_color);
              }
            } else {
              this.selected_part_ids.delete(selected_part.part_type + '-' + selected_part.part_id);
              this.selected_part_objs.delete(selected_part);
              for (let mat of selected_part.material) {
                mat.color.setHex(this.default_part_color);
              }
            }
            this.render();
          }
          break;
        }
      }
    },
    processRemeshPointClick () {
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(new THREE.Vector2(this.mouse_x, this.mouse_y), this.camera);

      const intersects = raycaster.intersectObjects([this.current_remesh_obj]);
      for (let intersect of intersects) {
        if (intersect.object instanceof THREE.Mesh) {
          // get the clicked face and nearest vertex
          const nearest_vertex = this.findNearestVertex(intersects[0].face, intersects[0].point);
          const sphere = this.renderSinglePoint(nearest_vertex);
          sphere.vertex_id = nearest_vertex;

          // create a new boundary segment when nothing exists
          if (this.seg_id_2_boundary_segments.length === 0) {
            this.current_segment_id = 0;
            this.seg_id_2_boundary_segments[0] = this.initSegment();
          }

          const current_segment = this.seg_id_2_boundary_segments[this.current_segment_id];
          console.log('[ process remesh point click ] current segment: ' + this.current_segment_id + '/' + this.seg_id_2_boundary_segments.length);

          // update the path each time when adding a new point:
          // loop all the O(n) segment and find the best segment to add the point by minimizing the total change of the distance
          if (current_segment.clicked_vertex.length === 0) {
            current_segment.clicked_vertex[0] = nearest_vertex;
            current_segment.vertex_sphere[0] = sphere;
            current_segment.segment[0] = [];
            current_segment.segment_line[0] = null;
            current_segment.segment_distance[0] = 0;
          } else {
            let p1, p2, dj_res1, dj_res2, dist_diff, dj_dist1, dj_dist2,
              min_i, min_dist = null, min_dist1, min_dist2, min_seg1, min_seg2;
            for (let i = 0; i < current_segment.clicked_vertex.length; ++i) {
              p1 = current_segment.clicked_vertex.slice(i)[0];
              p2 = current_segment.clicked_vertex.slice((i + 1) % current_segment.clicked_vertex.length)[0];
              dj_res1 = this.findVertexShortestPathByDj(p1, nearest_vertex);
              dj_res2 = this.findVertexShortestPathByDj(nearest_vertex, p2);
              dj_dist1 = this.computeSegmentLength(dj_res1);
              dj_dist2 = this.computeSegmentLength(dj_res2);
              dist_diff = dj_dist1 + dj_dist2 - current_segment.segment_distance[i];
              if (min_dist === null || min_dist > dist_diff) {
                min_dist = dist_diff;
                min_i = i;
                min_seg1 = dj_res1;
                min_seg2 = dj_res2;
                min_dist1 = dj_dist1;
                min_dist2 = dj_dist2;
              }
            }

            current_segment.clicked_vertex.splice(min_i + 1, 0, nearest_vertex);
            current_segment.vertex_sphere.splice(min_i + 1, 0, sphere);
            current_segment.segment.splice(min_i, 1, min_seg1);
            current_segment.segment.splice(min_i + 1, 0, min_seg2);
            current_segment.segment_distance.splice(min_i, 1, min_dist1);
            current_segment.segment_distance.splice(min_i + 1, 0, min_dist2);

            if (current_segment.segment_line[min_i] instanceof THREE.Line) {
              this.scene.remove(current_segment.segment_line[min_i]);
            }
            const line1 = this.renderPath(min_seg1);
            current_segment.segment_line.splice(min_i, 1, line1);
            const line2 = this.renderPath(min_seg2);
            current_segment.segment_line.splice(min_i + 1, 0, line2);

            console.log('[ remesh point click ] vertex: ' + current_segment.clicked_vertex);
            console.log('[ remesh point click ] face: ' + current_segment.segment_distance);
          }
          break;
        }
      }
    },
    processRemeshPointDelete () {
      // TODO
    },
    processRemeshPartSelect () {
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(new THREE.Vector2(this.mouse_x, this.mouse_y), this.camera);

      const intersects = raycaster.intersectObjects([this.current_remesh_obj]);
      for (let intersect of intersects) {
        if (intersect.object instanceof THREE.Mesh) {
          let select_seg_id = null;
          if (this.faceid_2_part_seg_id[intersect.face.faceid] === 0) {
            select_seg_id = this.faceid_2_current_part_seg_id[intersect.face.faceid];
          }
          if (select_seg_id !== null) {
            ++this.num_part_cut;
            const geom = this.current_remesh_obj.geometry;
            let has_non_assigned_face = false;
            for (let i = 0; i < geom.faces.length; ++i) {
              if (this.faceid_2_part_seg_id[i] === 0) {
                if (this.faceid_2_current_part_seg_id[i] === select_seg_id) {
                  geom.faces[i].materialIndex = 0;
                  this.faceid_2_part_seg_id[i] = this.num_part_cut;
                  this.seg_id_2_part_seg_color[i] = this.seg_id_2_current_part_seg_color[select_seg_id];
                } else {
                  geom.faces[i].color.setHex(this.default_part_color);
                  geom.faces[i].materialIndex = 0;
                  has_non_assigned_face = true;
                }
              }
            }
            geom.colorsNeedUpdate = true;
            geom.groupsNeedUpdate = true;
            this.render();

            if (has_non_assigned_face) {
              this.allow_select_boundary = true;
            } else {
              this.allow_select_boundary = false;
              this.$notify({
                type: 'success',
                title: 'Success: cut the part',
                message: 'You have finished the cutting for this part. Please press B to submit.'
              });
            }
            this.allow_select_part_cut = false;
          }
          break;
        }
      }
    },
    processRemeshPartHover () {
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(new THREE.Vector2(this.mouse_x, this.mouse_y), this.camera);
      const intersects = raycaster.intersectObjects([this.current_remesh_obj]);
      for (let intersect of intersects) {
        if (intersect.object instanceof THREE.Mesh) {
          const select_seg_id = this.faceid_2_current_part_seg_id[intersect.face.faceid];
          const geom = this.current_remesh_obj.geometry;
          for (let i = 0; i < geom.faces.length; ++i) {
            if (this.faceid_2_part_seg_id[i] === 0) {
              if (this.faceid_2_current_part_seg_id[i] === select_seg_id) {
                geom.faces[i].materialIndex = 0;
              } else {
                geom.faces[i].materialIndex = 1;
              }
            }
          }
          geom.groupsNeedUpdate = true;
          break;
        }
      }
      this.render();
    },
    processPartCut () {
      const geom = this.current_remesh_obj.geometry;
      console.log('[ cutting the remeshed part ]');

      // get a set of edges drawn by users
      this.cut_edge_set = new Set();
      for (let segment of this.seg_id_2_boundary_segments) {
        let v1, v2, small, big, edge;
        for (let data of segment.segment) {
          for (let i = 0; i < data.length - 1; ++i) {
            v1 = data[i];
            v2 = data[i + 1];
            small = Math.min(v1, v2);
            big = Math.max(v1, v2);
            edge = small + '-' + big;
            this.cut_edge_set.add(edge);
          }
        }
      }

      // find connected components
      this.faceid_2_current_part_seg_id = [];
      for (let i = 0; i < geom.faces.length; ++i) {
        this.faceid_2_current_part_seg_id[i] = 0;
      }
      // search
      const get_edge_name = (x, y) => {
        if (x < y) {
          return x + '-' + y;
        } else {
          return y + '-' + x;
        }
      };
      let current_part_id = 0, queue, cur, face, edge_list;
      for (let i = 0; i < geom.faces.length; ++i) {
        if (this.faceid_2_part_seg_id[i] === 0 && this.faceid_2_current_part_seg_id[i] === 0) {
          ++current_part_id;
          console.log('[ cutting the remeshed part ] start from: ' + i + ' ' + current_part_id);
          queue = [];
          queue.push(i);
          this.faceid_2_current_part_seg_id[i] = current_part_id;
          while (queue.length > 0) {
            cur = queue.shift();
            face = geom.faces[cur];
            let v1 = face.a;
            let v2 = face.b;
            let v3 = face.c;
            edge_list = [get_edge_name(v1, v2), get_edge_name(v1, v3), get_edge_name(v2, v3)];
            for (let edge of edge_list) {
              if (!this.cut_edge_set.has(edge)) {
                for (let item of this.edge2faces[edge]) {
                  if (item !== cur && this.faceid_2_part_seg_id[item] === 0 && this.faceid_2_current_part_seg_id[item] === 0) {
                    queue.push(item);
                    this.faceid_2_current_part_seg_id[item] = current_part_id;
                  }
                }
              }
            }
          }
        }
      }

      console.log('[ cutting the remeshed part ] #total part: ' + current_part_id);

      this.allow_select_boundary = false;
      this.allow_select_part_cut = true;
      this.deleteAllBoundary();

      // render all new parts in alpha mode and wait for user to pick one
      // render selected part cuts in solid mode
      // user can use mouse to hoover over a part and make it solid
      // press S/s to select one and only one part as the part cutting result
      this.seg_id_2_current_part_seg_color = [];
      for (let i = 0; i < current_part_id; ++i) {
        this.seg_id_2_current_part_seg_color[i + 1] = 'rgb(' + (Math.floor(Math.random() * 256)) + ',' +
          (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ')';
      }
      for (let i = 0; i < geom.faces.length; ++i) {
        if (this.faceid_2_part_seg_id[i] === 0) {
          geom.faces[i].color.set(this.seg_id_2_current_part_seg_color[this.faceid_2_current_part_seg_id[i]]);
          geom.faces[i].materialIndex = 1;
        } else {
          geom.faces[i].color.set(this.seg_id_2_part_seg_color[this.faceid_2_part_seg_id[i]]);
          geom.faces[i].materialIndex = 0;
        }
      }
      geom.colorsNeedUpdate = true;
      geom.groupsNeedUpdate = true;
      this.render();
    },
    undoPartCut () {
      // TODO 1175
    },
    // helper
    toggleWireframe () {
      this.scene.children.forEach(child => {
        if (child.type === 'Mesh' && child.is_part_mesh) {
          for (let mat of child.material) {
            mat.wireframe = this.wireframeSwitch;
          }
        }
      });
      this.render();
    },
    initSegment () {
      return {
        clicked_vertex: [],
        vertex_sphere: [],
        segment: [],
        segment_line: [],
        segment_distance: []
      };
    },
    renderSinglePoint (vertex) {
      const geom = this.current_remesh_obj.geometry;
      console.log('[ render point ]: ' + geom.vertices[vertex].x + ',' + geom.vertices[vertex].y + ',' + geom.vertices[vertex].z);
      const geometry = new THREE.SphereGeometry(this.segment_sphere_radius, 32, 32);
      geometry.translate(geom.vertices[vertex].x, geom.vertices[vertex].y, geom.vertices[vertex].z);
      const material = new THREE.MeshPhongMaterial({color: this.color_segment_highlight});
      const sphere = new THREE.Mesh(geometry, material);
      sphere.is_part_mesh = false;
      this.scene.add(sphere);
      this.render();
      return sphere;
    },
    renderPath (vertices_path) {
      console.log('[ render path ]', vertices_path);
      const geom = this.current_remesh_obj.geometry;
      const geometry_line = new THREE.Geometry();
      for (let vertex of vertices_path) {
        geometry_line.vertices.push(new THREE.Vector3(geom.vertices[vertex].x, geom.vertices[vertex].y, geom.vertices[vertex].z));
      }
      const material_line = new THREE.LineBasicMaterial({color: this.color_segment_highlight, opacity: 1, linewidth: 10});
      const line = new THREE.Line(geometry_line, material_line);
      this.scene.add(line);
      this.render();
      return line;
    },
    findNearestVertex (face, point) {
      let min_dist = 1000;
      let min_vertex;
      let vertex;
      const geom = this.current_remesh_obj.geometry;
      const face_list = [face.a, face.b, face.c];
      for (let i = 0; i < 3; ++i) {
        vertex = face_list[i];
        const coord = geom.vertices[vertex];
        const dist = Math.pow(coord.x - point.x, 2) + Math.pow(coord.y - point.y, 2) + Math.pow(coord.z - point.z, 2);
        if (dist < min_dist) {
          min_dist = dist;
          min_vertex = vertex;
        }
      }
      return min_vertex;
    },
    findVertexShortestPathByDj (source, destination) {
      const graph = new Graph(this.map);
      return graph.findShortestPath(source.toString(), destination.toString());
    },
    computeSegmentLength (vertices_path) {
      const geom = this.current_remesh_obj.geometry;
      let total = 0;
      for (let i = 0; i < vertices_path.length - 1; ++i) {
        const x_diff = geom.vertices[vertices_path[i]].x - geom.vertices[vertices_path[i + 1]].x;
        const y_diff = geom.vertices[vertices_path[i]].y - geom.vertices[vertices_path[i + 1]].y;
        const z_diff = geom.vertices[vertices_path[i]].z - geom.vertices[vertices_path[i + 1]].z;
        total += Math.sqrt(Math.pow(x_diff, 2) + Math.pow(y_diff, 2) + Math.pow(z_diff, 2));
      }
      return total;
    },
    deleteAllBoundary () {
      const t = this.seg_id_2_boundary_segments.length;
      for (let i = 0; i < t; ++i) {
        this.current_segment_id = 0;
        this.deleteBoundary();
      }
      this.current_segment_id = null;
      this.seg_id_2_boundary_segments = [];
    },
    deleteBoundary () { // remove the current path/segment/boundary
      // de-render all points
      const current_segment = this.seg_id_2_boundary_segments[this.current_segment_id];
      for (let point of current_segment.vertex_sphere) {
        this.scene.remove(point);
      }
      // de-render all lines
      for (let line of current_segment.segment_line) {
        if (line !== null) {
          this.scene.remove(line);
        }
      }

      this.seg_id_2_boundary_segments.splice(this.current_segment_id, 1);
      if (this.seg_id_2_boundary_segments.length > 0) {
        this.current_segment_id = 0;
        this.highlightSegment();
      } else {
        this.seg_id_2_boundary_segments[0] = this.initSegment();
        this.current_segment_id = 0;
      }
    },
    selectNextSegment () {
      if (this.current_segment_id !== null) {
        if (this.seg_id_2_boundary_segments[this.current_segment_id].clicked_vertex.length > 0) {
          this.deHighlightSegment();
          ++this.current_segment_id;
          if (this.current_segment_id === this.seg_id_2_boundary_segments.length) {
            this.seg_id_2_boundary_segments.push(this.initSegment());
          }
          this.highlightSegment();
        }
      }
      console.log('[ select next seg ]', this.current_segment_id + '/' + this.seg_id_2_boundary_segments.length);
    },
    selectPreviousSegment () {
      if (this.current_segment_id !== null && this.current_segment_id > 0) {
        this.deHighlightSegment();
        --this.current_segment_id;
        this.highlightSegment();
      }
      console.log('[ select previous seg ]', this.current_segment_id + '/' + this.seg_id_2_boundary_segments.length);
    },
    highlightSegment () {
      if (this.current_segment_id !== null) {
        const current_segment = this.seg_id_2_boundary_segments[this.current_segment_id];
        for (let point of current_segment.vertex_sphere) {
          point.material.color.set(this.color_segment_highlight);
        }
        for (let line of current_segment.segment_line) {
          line.material.color.set(this.color_segment_highlight);
        }
        this.render();
      }
    },
    deHighlightSegment () {
      if (this.current_segment_id !== null) {
        const current_segment = this.seg_id_2_boundary_segments[this.current_segment_id];
        for (let point of current_segment.vertex_sphere) {
          point.material.color.set(this.color_segment_normal);
        }
        for (let line of current_segment.segment_line) {
          line.material.color.set(this.color_segment_normal);
        }
        this.render();
      }
    },
    // TODO segmentation: request & submit (remesh)
    requestRemesh () {
      this.requestingRemesh = true;
      console.log('[ requesting remesh from server ... ]');
      if (this.selected_part_ids.size === 0) {
        this.$message({
          message: 'Please select some parts before requesting for remeshing!',
          type: 'warning'
        });
      } else {
        let part_list_str = this.model_cat + '_' + this.model_id + '_' + this.anno_id + '_';
        this.selected_part_ids.forEach(part_id => {
          part_list_str += part_id + '_';
        });
        part_list_str = part_list_str.slice(0, -1);
        console.log('[ requesting remeshing ] selected_part_ids / part_list_str: ', this.selected_part_ids, part_list_str);
        this.$notify.info({
          title: 'Please wait',
          message: 'Requesting remeshing from the server.'
        });
        Axios.get(conf.SERVER_URL_TESTING + conf.request_remesh + '/' + part_list_str, {})
          .then(response => {
            this.current_remesh_part_id = response.data;
            this.loadObj('remesh', this.current_remesh_part_id);
            this.$notify({
              title: 'Successful',
              message: 'Requested remeshing from the server.',
              type: 'success'
            });
            this.requestingRemesh = false;
          }).catch(error => {
            this.handleAnnotatorError(error);
          });
      }
    },
    undoRemesh () {
      // TODO
    },
    submitPartCuttingResult () { // merge: submit & to server
      if (this.num_part_cut === 0) {
        this.$message({
          type: 'warning',
          message: 'You didn\'t cut the part. Please cut at least one part or cancel.'
        });
        return;
      } else {
        let geom = this.current_remesh_obj.geometry;
        // if some faces are not assigned
        let has_non_assigned_face = false;
        let color = 'rgb(' + (Math.floor(Math.random() * 256)) + ',' +
          (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ')';
        for (let i = 0; i <= geom.faces.length; ++i) {
          if (this.faceid_2_part_seg_id[i] === 0) {
            has_non_assigned_face = true;
            this.faceid_2_part_seg_id[i] = this.num_part_cut + 1;
            geom.faces[i].color.set(color);
            geom.faces[i].materialIndex = 0;
          }
        }
        geom.colorsNeedUpdate = true;
        geom.groupsNeedUpdate = true;
        this.render();
        if (has_non_assigned_face) {
          this.$notify.info({
            title: 'Creating a new part',
            message: 'A new part was automatically created for the remaining part.'
          });
          this.num_part_cut++;
          this.allow_select_boundary = false;
        }
      }
      // confirm
      this.$confirm('Do you want to submit the part cutting?', 'Confirmation', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'info'
      }).then(() => {
        // send request
        const url = conf.SERVER_URL_TESTING + conf.submit_remesh + '/' + this.anno_id + '-' + this.current_remesh_part_id;
        const data = new FormData();
        data.append('Content-Disposition', 'form-data; name="data"');
        data.append('Content-Type', 'application/json');
        data.append('data', JSON.stringify(this.faceid_2_part_seg_id));
        Axios({
          method: 'post',
          url,
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          data: data
        }).then(response => {
          console.log('[ part cutting response ]', response);
          this.loadNewParts();
        }).catch(error => this.handleAnnotatorError(error));
        // scene
        this.scene.remove(this.current_remesh_obj);
        this.current_remesh_obj = null;
        this.allow_part_cutting = false;
        this.allow_part_click = true;
        this.scene.children.forEach(child => {
          if (child.type === 'Mesh' && child.part_type !== 'remesh') {
            child.visible = true;
          }
        });
        this.resetRender();
      });
    },
    loadNewParts () {
      const file_path = conf.SERVER_URL_TESTING + conf.get_remesh_cut_json + '/' + this.anno_id + '-' + this.current_remesh_part_id;
      console.log('[ load remesh cut output JSON]: ', file_path);
      Axios.get(file_path, {})
        .then(response => {
          // remove the old parts
          const to_delete = [];
          for (let child of this.scene.children) {
            if (this.selected_part_ids.has(child.part_type + '-' + child.part_id)) {
              to_delete.push(child);
            }
          }
          for (let child of to_delete) {
            this.scene.remove(child);
          }
          this.render();
          this.selected_part_ids = new Set();

          // load new parts
          for (let item of response.data) {
            this.loadObj('new', item);
          }

          this.$message({
            type: 'success',
            message: 'Your new parts are available now!'
          });
        }).catch(error => this.handleAnnotatorError(error));
    },
    // TODO save
    submitFinalResult () { // TODO (format!)
      const update_json_data = new FormData();
      update_json_data.append('Content-Disposition', 'form-data; name="data"');
      update_json_data.append('Content-Type', 'application/json');
      update_json_data.append('data', JSON.stringify({anno_id: this.anno_id, anno_version: this.anno_version}));
      Axios({
        method: 'post',
        url: conf.SERVER_URL_TESTING + conf.update_anno_version,
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        data: update_json_data
        // save anno info:
      }).then(response => {
        console.log('[ updated anno info. ] response: ', response);
        const out_json_data = new FormData();
        out_json_data.append('Content-Disposition', 'form-data; name="data"');
        out_json_data.append('Content-Type', 'application/json');
        out_json_data.append('data', JSON.stringify({
          data: JSON.stringify(this.hierarchyTreeAnnotatingRoot), // TODO need to consider the format!
          anno_id: this.anno_id,
          anno_version: this.anno_version
        }));
        // return for the next 'then'
        return Axios({
          method: 'post',
          url: conf.SERVER_URL_TESTING + conf.save_anno_json,
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          data: out_json_data
        });
        // save anno json:
      }).then(response => {
        console.log('[ updated anno json. ] response: ', response);
        const img_json_data = new FormData();
        img_json_data.append('Content-Disposition', 'form-data; name="data"');
        img_json_data.append('Content-Type', 'application/json');
        img_json_data.append('data', JSON.stringify({
          img: this.getSnapshot(),
          anno_id: this.anno_id,
          anno_version: this.anno_version
        }));
        // return for the next 'then'
        return Axios({
          method: 'post',
          url: conf.SERVER_URL_TESTING + conf.save_anno_snapshot,
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          data: img_json_data
        });
        // save current obj list:
      }).then(response => {
        console.log('[ updated snapshot. ] response: ', response);
        const cur_obj_data = new FormData();
        cur_obj_data.append('Content-Disposition', 'form-data; name="data"');
        cur_obj_data.append('Content-Type', 'application/json');
        cur_obj_data.append('data', JSON.stringify({
          data: JSON.stringify(this.getCurrentSceneObjList()),
          anno_id: this.anno_id,
          anno_version: this.anno_version
        }));
        // return for the next 'then'
        return Axios({
          method: 'post',
          url: conf.SERVER_URL_TESTING + conf.save_anno_obj_list,
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          data: cur_obj_data
        });
      }).then(response => {
        console.log('[ saved anno obj list. ] response: ', response);
      }).catch(error => this.handleAnnotatorError(error));

      this.$notify({
        title: 'Please wait',
        message: 'Submitting the results to the server.',
        type: 'success'
      });
    },
    getCurrentSceneObjList () {
      let res = [];
      for (let obj of this.scene.children) {
        if (obj.type === 'Mesh' && obj.is_part_mesh && obj.part_type !== 'remesh') {
          res.push(obj.part_type + '-' + obj.part_id);
        }
      }
      return res;
    },
    saveHierarchy () {
    },
    saveObj () {
    },
    // TODO other operations
    filterHierarchyNode: function (value, data) {
      if (!value) return true;
      return data.text.indexOf(value) !== -1;
    },
    filterAnnotatingHierarchyNode: function (value, data) {
      if (!value) return true;
      return data.text.indexOf(value) !== -1;
    },
    expandAllAnnotatingNodes () {
      for (let node of this.$refs.treeAnnotatingRef.store._getAllNodes()) {
        node.expanded = true;
      }
    },
    collapseDetailedNodes () {
      for (let node of this.$refs.treeAnnotatingRef.store._getAllNodes()) {
        if (node.data['depth'] > this.currentLevel) {
          node.expanded = false;
        }
      }
    },
    switchShowAllNodes () {
      if (this.switchShowAll) {
        this.switchShowAll = !this.switchShowAll;
        // TODO this.$refs.treeRef.store._getAllNodes() = [] here ?!
        // for (let node of this.$refs.treeRef.store._getAllNodes()) {
        //   node.visible = false;
        // }
      } else {
      }
    },
    // TODO other: handle error & diagnose
    handleAnnotatorError (error) {
      this.$alert('Annotator Error: ' + error, 'Error', {
        confirmButtonText: 'Close',
        callback: action => {
          this.$message(`Action: ${action}`);
          this.$router.push({
            name: 'Login',
            params: {
              username: this.username // go back to annotation list
            }
          })
        }
      });
    },
    toLog (to_log) {
      console.log(to_log);
    }
  },
  watch: {
    // TODO watch: tree filtering
    filterHierarchyText (value) { // same name with a data() variable
      this.$refs.treeRef.filter(value);
      // recover / collapse all nodes if no filtering value
      if (!value) {
        for (let node of this.$refs.treeRef.store._getAllNodes()) {
          node.expanded = false; // if (node.data['depth'] === 1) { node.expanded = false; }
          // node.visible = false;
        }
      }
    },
    filterAnnotatingHierarchyText (value) { // same name with a data() variable
      this.$refs.treeAnnotatingRef.filter(value);
      this.collapseDetailedNodes();
    },
    '$route' (to, from) { // Test
      // this.getParams();
    }
  },
  components: {}
}
</script>

<style scoped>
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
</style>
