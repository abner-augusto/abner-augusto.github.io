import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 20;

const renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement)
window.addEventListener( 'resize', onWindowResize );


const sphereRadius = 10;
const colors = [0xf80726, 0xf3e60c, 0x2722dd, 0x07f884];
const particleSpacing = 0.2;

const geometry = new THREE.BufferGeometry();

const particleCount = 1000;
const positions = new Float32Array(particleCount * 3);
const colorsAttribute = new Float32Array(particleCount * 3);
const sizes = new Float32Array(particleCount);

const directions = new Array(particleCount);

for (let i = 0; i < particleCount; i++) {
    directions[i] = Math.random() < 0.5 ? -1 : 1;
  }

function randomSphere(samples, variationAmount) {
    const points = [];
    const phi = Math.PI * (3 - Math.sqrt(5)); 
  
    for (let i = 0; i < samples; i++) {
      const y = 1 - (i / (samples - 1)) * 2; 
      const radius = Math.sqrt(1 - y * y); 
  
      const theta = phi * i; 
  
      const x = Math.cos(theta) * radius;
      const z = Math.sin(theta) * radius;
  
      const xVariation = (Math.random() - 0.5) * variationAmount;
      const yVariation = (Math.random() - 0.5) * variationAmount;
  
      const newX = x + xVariation;
      const newY = y + yVariation;

      const size = Math.random() * (2 - 0.5) + 0.5;
      sizes[i] = size;
  
      points.push([newX, newY, z]);
    }
  
    return points;
  }

const points = randomSphere(particleCount, particleSpacing);

for (let i = 0; i < particleCount; i++) {
  const [x, y, z] = points[i];

  const scaledX = x * sphereRadius;
  const scaledY = y * sphereRadius;
  const scaledZ = z * sphereRadius;

  positions[i * 3] = scaledX;
  positions[i * 3 + 1] = scaledY;
  positions[i * 3 + 2] = scaledZ;

  const color = colors[Math.floor(Math.random() * colors.length)];
  colorsAttribute[i * 3] = ((color >> 16) & 255) / 255; // Red
  colorsAttribute[i * 3 + 1] = ((color >> 8) & 255) / 255; // Green
  colorsAttribute[i * 3 + 2] = (color & 255) / 255; // Blue
}

// Set attributes on the buffer geometry
geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
geometry.setAttribute('color', new THREE.BufferAttribute(colorsAttribute, 3));
geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

// Create material
const material = new THREE.PointsMaterial({ 
    vertexColors: true,
    blending: THREE.AdditiveBlending,
    transparent: true,
    opacity: 1,
    depthWrite: false,
    sizeAttenuation: true,
    alphaMap: new THREE.TextureLoader().load('circle.png'),
    map: new THREE.TextureLoader().load('circle.png'),
    transparent: true,
    size: .8,

});

// Create particle system
const particles = new THREE.Points(geometry, material);

// Add particles to the scene
scene.add(particles);

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );
    composer.setSize( window.innerWidth, window.innerHeight );

}

// Render the scene
function animate() {
    requestAnimationFrame(() => animate());

    particles.rotation.y += 0.001;

    renderer.render(scene, camera);
  }
  
  animate();