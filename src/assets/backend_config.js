const host = 'http://localhost';
const port = 3000;
const url = host + ':' + port;
const serverUrlTest = 'http://daerduo.stanford.edu:8080';

module.exports = {
  // host
  remoteHost: host,
  remotePort: port,
  // APIs: annotation
  GET_ALL_ANNOTATION: url + '/annotation/get_all_annotations/',
  get_anno_info: '/annotation/get_info',
  save_anno_json: '/annotation/save_json',
  get_anno_json: '/annotation/get_json',
  save_anno_snapshot: '/annotation/save_snapshot',
  update_anno_version: '/annotation/update_version',
  get_anno_obj_list: '/annotation/get_obj_list',
  save_anno_obj_list: '/annotation/save_obj_list',
  // APIs: files
  get_original_part: '/file/original-part',
  get_remesh_part: '/file/remesh-part',
  get_new_part: '/file/new-part',
  get_original_scene_graph: '/file/original-scene-graph',
  get_remesh_cut_json: '/file/remesh-cut-output-json',
  // APIs: remesh
  request_remesh: '/remesh',
  submit_remesh: '/submit_remesh_cut',
  // // APIs: annotation
  // GET_ALL_ANNOTATION: url + '/annotation/get_all_annotations/',
  // get_anno_info: serverUrlTest + '/annotation/get_info',
  // save_anno_json: serverUrlTest + '/annotation/save_json',
  // get_anno_json: serverUrlTest + '/annotation/get_json',
  // save_anno_snapshot: serverUrlTest + '/annotation/save_snapshot',
  // update_anno_version: serverUrlTest + '/annotation/update_version',
  // get_anno_obj_list: serverUrlTest + '/annotation/get_obj_list',
  // save_anno_obj_list: serverUrlTest + '/annotation/save_obj_list',
  // // APIs: files
  // get_original_part: serverUrlTest + '/file/original-part',
  // get_remesh_part: serverUrlTest + '/file/remesh-part',
  // get_new_part: serverUrlTest + '/file/new-part',
  // get_original_scene_graph: serverUrlTest + '/file/original-scene-graph',
  // get_remesh_cut_json: serverUrlTest + '/file/remesh-cut-output-json',
  // // APIs: remesh
  // request_remesh: serverUrlTest + '/remesh',
  // submit_remesh: serverUrlTest + '/submit_remesh_cut',
  // TODO testing
  SERVER_URL_TESTING: serverUrlTest
};
