<template>
  <div id="test-div">
    <!--<canvas id="test-canvas"></canvas>-->
  </div>
</template>

<script>
import * as THREE from 'three'

export default {
  name: 'TestAndComponent',
  methods: {
    init: function () {
      this.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 10);
      this.camera.position.z = 1;

      this.scene = new THREE.Scene();

      const geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
      const material = new THREE.MeshNormalMaterial();

      this.mesh = new THREE.Mesh(geometry, material);
      this.scene.add(this.mesh);

      this.renderer = new THREE.WebGLRenderer({antialias: true});
      // TODO control the size of the canvas
      const RATIO = 2.7;
      this.renderer.setSize(window.innerWidth / RATIO, window.innerHeight / RATIO);
      document.getElementById('test-div').appendChild(this.renderer.domElement)
    },
    animate: function () {
      requestAnimationFrame(this.animate);
      this.mesh.rotation.x += 0.01;
      this.mesh.rotation.y += 0.02;
      this.renderer.render(this.scene, this.camera)
    }
  },
  mounted () {
    this.init();
    this.animate()
  }
}
</script>

<style scoped>

</style>
