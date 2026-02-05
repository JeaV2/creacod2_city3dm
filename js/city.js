import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const cityCanvas = document.getElementById('mid')

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, cityCanvas.clientWidth / cityCanvas.clientHeight, 0.1, 1000);
const loader = new GLTFLoader();

const renderer = new THREE.WebGLRenderer();
renderer.setSize(cityCanvas.clientWidth, cityCanvas.clientHeight);
cityCanvas.appendChild(renderer.domElement);

loader.load('../model/city.glb', function (gltf) {
    scene.add(gltf.scene);
}, undefined, function (error) {
    console.error(error);
});

camera.position.z = 35;
camera.rotation.x = -0.3;
camera.position.y = 10;

// City-friendly lighting
const hemiLight = new THREE.HemisphereLight(0x9cc9ff, 0x1b1b1b, 0.6);
scene.add(hemiLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 1.1);
dirLight.position.set(10, 20, 10);
dirLight.castShadow = false;
scene.add(dirLight);

const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
scene.add(ambientLight);

// scene.position.y = 25;

function animate() {
    // rotate the city slowly for a dynamic effect
    scene.rotation.y += 0.005;
    renderer.render(scene, camera)
}
renderer.setAnimationLoop(animate);