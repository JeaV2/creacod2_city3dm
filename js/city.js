import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// Get the canvas element
const cityCanvas = document.getElementById('mid')

// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, cityCanvas.clientWidth / cityCanvas.clientHeight, 0.1, 1000);
const loader = new GLTFLoader();
const renderer = new THREE.WebGLRenderer();
renderer.setSize(cityCanvas.clientWidth, cityCanvas.clientHeight);
cityCanvas.appendChild(renderer.domElement);

// load the model
let model;
loader.load('../model/city.glb', function (gltf) {
    model = gltf.scene;
    scene.add(model);
}, undefined, function (error) {
    console.error(error);
});

// Set camera pos
camera.position.set(0, 20, 35);
camera.rotation.x = -0.7;

// City-friendly lighting
const hemiLight = new THREE.HemisphereLight(0x9cc9ff, 0x1b1b1b, 0.6);
scene.add(hemiLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 1.1);
dirLight.position.set(10, 20, 10);
dirLight.castShadow = false;
scene.add(dirLight);

const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
scene.add(ambientLight);

// Function to toggle wireframe mode on all mesh materials
function toggleWireframe() {
    // wait until model is loaded
    if (!model) return;
    model.traverse((child) => {
        if (child.isMesh && child.material) {
            child.material.wireframe = !child.material.wireframe;
        }
    });
}

// Glitch effect logic, just toggles wireframe mode rapidly lol
function triggerGlitch() {
    if (!model) {
        // Wait until model is loaded
        setTimeout(triggerGlitch, 500);
        return;
    }
    let glitchCount = 0;
    // 6, 8, 10, 12, or 14 toggles (always even), so it doesn't end in wireframe mode
    const maxGlitches = (Math.floor(Math.random() * 5) + 3) * 2; 
    
    function performGlitchToggle() {
        toggleWireframe();
        glitchCount++;
        
        if (glitchCount >= maxGlitches) {
            // Stay normal for 2-4 seconds before next glitch, so it's not constant and annoying
            setTimeout(triggerGlitch, 2000 + Math.random() * 2000);
        } else {
            // Schedule next toggle with a NEW random delay
            setTimeout(performGlitchToggle, randomGlitchDelay());
        }
    }
    
    // Start the first toggle
    performGlitchToggle();
}

// Random delay between 25ms and 200ms for glitch toggles, to keep it unpredictable
let randomGlitchDelay = () => 25 + Math.random() * 175;

// Start the glitch effect
triggerGlitch();

function animate() {
    // rotate the city slowly for a dynamic effect
    scene.rotation.y += 0.005;
    renderer.render(scene, camera)
}
renderer.setAnimationLoop(animate);