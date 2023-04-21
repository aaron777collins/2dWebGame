import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Stats from 'stats.js'

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)

const stats = new Stats();

window.addEventListener('resize', onWindowResize, false)
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    render()
}

function animate() {
    stats.begin();

    controls.update()

    render()
    stats.end();
    requestAnimationFrame(animate)
}

function render() {
    renderer.render(scene, camera)
}

function addHelpText() {
    const helpText = document.createElement('div');
    helpText.style.position = 'absolute';
    helpText.style.width = "100%";
    helpText.style.height = "100%";
    helpText.style.color = 'white';
    helpText.innerHTML = 'Use the mouse to rotate the camera';
    helpText.style.top = 50 + '%';
    helpText.style.left = 50 + '%';
    helpText.style.fontSize = 50 + 'px';
    helpText.style.textAlign = 'center';
    helpText.style.transform = 'translate(-50%, -50%)';
    document.body.appendChild(helpText);

    setTimeout(() => {
        helpText.style.display = 'none';
    }, 3000);

    helpText.addEventListener('click', () => {
        helpText.style.display = 'none';
    });
}

window.addEventListener("DOMContentLoaded", () => {

    // creating water scene

    // translate camera view the water at a 45 degree angle, offset by 1 unit
    camera.position.set(0, 5, 5);
    camera.lookAt(0, 0, 0);

    const waterGeometry = new THREE.PlaneGeometry(100, 100, 100, 100);
    const waterMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff, wireframe: true });
    const water = new THREE.Mesh(waterGeometry, waterMaterial);
    water.rotation.x = -Math.PI / 2;

    scene.add(water);

    // adding help text to the center of the screen that disappears
    addHelpText();

    // add fps counter in top left
    stats.showPanel(0);
    document.body.appendChild(stats.dom);



    animate();
});
