import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'

THREE.ColorManagement.enabled = false

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const particleTexture = textureLoader.load('/textures/particles/2.png')

/**
 * Particles
 */

// Geometry - params: radius, width segments, height segments
const particlesGeometry = new THREE.SphereGeometry(1, 32, 32)

// Material
const particlesMaterial = new THREE.PointsMaterial({
  size: 0.02,
  sizeAttenuation: true, // creates perspective
  alphaMap: particleTexture,
})

particlesMaterial.color = new THREE.Color('#ff88cc')
particlesMaterial.transparent = true

// Points
const particles = new THREE.Points(particlesGeometry, particlesMaterial)
// scene.add(particles)

/**
 * Custom Particles
 */
const particlesGeometry2 = new THREE.BufferGeometry()
const count = 20000

const positions = new Float32Array(count * 3)
const colors = new Float32Array(count * 3)

for (let i = 0; i < count * 3; i++) {
  positions[i] = (Math.random() - 0.5) * 10
  colors[i] = Math.random()
}

particlesGeometry2.setAttribute(
  'position',
  new THREE.BufferAttribute(positions, 3)
)

particlesGeometry2.setAttribute('color', new THREE.BufferAttribute(colors, 3))

// Material
const particlesMaterial2 = new THREE.PointsMaterial({
  size: 0.1,
  sizeAttenuation: true, // creates perspective
  alphaMap: particleTexture,
})

// particlesMaterial2.color = new THREE.Color('#ff88cc')
particlesMaterial2.transparent = true
// By default the GPU try to draw the invisible pixels (with alpha 0).
// We want to not even render it.
// particlesMaterial2.alphaTest = 0.001
// particlesMaterial2.depthTest = false
particlesMaterial2.depthWrite = false
// particlesMaterial2.blending = THREE.AdditiveBlending // can impact performance
particlesMaterial2.vertexColors = true

// Points
const particles2 = new THREE.Points(particlesGeometry2, particlesMaterial2)
scene.add(particles2)

// cube
// const cube = new THREE.Mesh(
//   new THREE.BoxGeometry(),
//   new THREE.MeshBasicMaterial()
// )

// scene.add(cube)
/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}

window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight

  // Update camera
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  // Update renderer
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
)
camera.position.z = 3
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
})
renderer.outputColorSpace = THREE.LinearSRGBColorSpace
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
  const elapsedTime = clock.getElapsedTime() * 0.2

  // Update controls
  controls.update()

  // Update ALL particles
  //   particles2.rotation.y = elapsedTime
  //   particles2.position.y = elapsedTime
  for (let i = 0; i < count; i++) {
    const i3 = i * 3
    const x = particlesGeometry2.attributes.position.array[i3 + 0]
    particlesGeometry2.attributes.position.array[i3 + 1] = Math.sin(
      elapsedTime * x * 2
    ) // y
    //   console.log(particlesGeometry2.attributes.position.array)
  }

  particlesGeometry2.attributes.position.needsUpdate = true

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()
