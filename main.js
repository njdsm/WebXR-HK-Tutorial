import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r132/three.module.js';
import { ARButton } from 'https://unpkg.com/three@0.132.0/examples/jsm/webxr/ARButton.js';


document.addEventListener('DOMContentLoaded', () => {
    const initialize = async () => {

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera();

        const renderer = new THREE.WebGLRenderer({alpha: true});
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        document.body.appendChild(renderer.domElement);

        const geometry = new THREE.BoxGeometry(0.06, 0.06, 0.06);
        const material = new THREE.MeshBasicMaterial({color: 0x00ff00});
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(0, 0, -0.3);
        scene.add(mesh);

        const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
        scene.add(light);

        renderer.xr.enabled = true;
        renderer.setAnimationLoop(() => {
            renderer.render(scene, camera);
        });

        const controller = renderer.xr.getController(0);
        scene.add(controller);

        const events = document.querySelector("#events");

        
        controller.addEventListener("select", () => {
            const geometry = new THREE.BoxGeometry(0.06, 0.06, 0.06);
            const material = new THREE.MeshBasicMaterial({color: 0xffffff * Math.random()});
            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.applyMatrix4(controller.matrixWorld);
            mesh.quaternion.setFromRotationMatrix(controller.matrixWorld);
            scene.add(mesh);
            
        });

        const arButton = ARButton.createButton(renderer, {optionalFeatures: ['dom-overlay'], domOverlay: {root: document.body}});
        document.body.appendChild(renderer.domElement);
        document.body.appendChild(arButton);
    }
    initialize();
})