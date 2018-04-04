<template>
  <el-col>
    <el-row :gutter="30">
      <el-col :span="16">
        <h1>Welcome to ShapeNet++ Annotator Server</h1>
      </el-col>
      <el-col :span="8">
        <el-button type="success" round style="alignment: center"
                   @click="annotateNew()">Annotate New Model
        </el-button>
        <el-button type="primary" round style="alignment: center"
                   @click="annotateTest()">(Annotate: local testing)
        </el-button>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <!--<el-col :span="6">-->
      <!--Aside-->
      <!--</el-col>-->
      <el-col :span="24">
        <!-- TODO Table -->
        <el-table
          :data="listData"
          border
          style="width: 100%">
          <!--fixed-->
          <el-table-column
            prop="anno_id"
            label="ID"
            width="50">
          </el-table-column>
          <el-table-column
            prop="version"
            label="Ver"
            width="50">
          </el-table-column>
          <el-table-column
            prop="model_id"
            label="Model ID"
            width="300">
          </el-table-column>
          <el-table-column
            prop="model_cat"
            label="Category"
            width="150">
          </el-table-column>
          <!--fixed="right"-->
          <el-table-column
            label="Operations"
            width="300">
            <template slot-scope="scope">
              <el-button type='primary' size="small"
                         @click="view(scope.row)">View
              </el-button>
              <el-button type='primary' size="small"
                         @click="modify(scope.row)">Modify
              </el-button>
              <el-button type="danger" size="small"
                         @click="deleteAnno(scope.row)">Delete
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
  </el-col>
</template>

<script>
import Axios from 'axios';

const conf = require('@/assets/backend_config');

export default {
  name: 'MainList',
  created () {
    // this.getAnnoList();
  },
  mounted () {
    // TODO Load worker's annotations
    this.getAnnoList();
  },
  data () {
    console.log('[ data loading ]');
    return {
      // TODO Worker information - testing
      // username: this.$route.params['username'],
      username: 'linfeng',
      // TODO Worker's Annotation List (add default data for react)
      listData: [{
        anno_id: 0,
        model_id: 0,
        model_cat: 0,
        version: 0
      }]
    }
  },
  methods: {
    getAnnoList: function () {
      Axios.get(conf.GET_ALL_ANNOTATION + this.username, {})
        .then(response => { // use '=>' to use 'this'
          this.listData = response.data['anno_list'];
          console.log('[ list data ]', this.listData);
        })
    },
    annotateNew: function () {
      this.$message('annotating new model ...');
      Axios.get('http://localhost:3000/annotation/get_new_model/' + this.username, {})
        .then(response => {
          this.getAnnoList(); // get new annotation list
          console.log('[ new annotation ID: ]', response.data);

          this.$router.push({
            name: 'Main',
            params: {
              username: this.username,
              // model_id: TODO ?
              anno_id: response.data, // anno id returned
              allow_edit: true
            }
          })
        })
    },
    annotateTest: function () {
      this.$message('annotate local testing!');

      this.$router.push({
        name: 'Main',
        params: {
          username: this.username,
          model_id: 'c04f515b688f9d97fff16555386d173d',
          model_cat: '03001627', // 'Chair'
          anno_id: 56, // anno id returned
          version: 2, // TODO testing: don't load parent annotation
          allow_edit: true,
          load_parent_anno: true
        }
      });
    },
    // TODO Button
    modify: function (row) {
      console.log(row);
      this.$router.push({
        name: 'Main',
        params: {
          username: this.username,
          model_id: row.model_id,
          model_cat: row.model_cat,
          anno_id: row.anno_id,
          anno_version: row.version,
          allow_edit: true,
          load_parent_anno: true
        }
      });
    },
    view: function (row) {
      console.log(row);
      this.$router.push({
        name: 'Main',
        params: {
          username: this.username,
          model_id: row.model_id,
          model_cat: row.model_cat,
          anno_id: row.anno_id,
          anno_version: row.version,
          allow_edit: false,
          load_parent_anno: true
        }
      });
    },
    deleteAnno: function (row) { // 'delete' is a keyword
      console.log(row);
      this.$confirm('This annotation will be deleted and cannot be recovered. Confirm?', 'Delete the annotation' + row.anno_id, {
        confirmButtonText: 'confirm',
        cancelButtonText: 'cancel'
      }).then(() => {
        Axios.get('http://localhost:3000/annotation/delete/' + row.anno_id);
        this.getAnnoList();
        this.$message({
          type: 'success',
          message: 'Annotation Deleted!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: 'Canceled.'
        })
      });
    }
  }
}
</script>

<style scoped>

</style>
