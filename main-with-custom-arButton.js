import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r132/three.module.js';
import { ARButton } from 'https://unpkg.com/three@0.126.0/examples/jsm/webxr/ARButton.js';


document.addEventListener('DOMContentLoaded', () => {
    const initialize = async () => {
        const arButton =  document.querySelector("#ar-button");

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

        let currentSession = null;

        const start = async () => {
            currentSession = await navigator.xr.requestSession("immersive-ar", {optionalFeatures: ['dom-overlay'], domOverlay: {root: document.body}});

            renderer.xr.enabled = true;
            renderer.xr.setReferenceSpaceType('local');
            await renderer.xr.setSession(currentSession);

            arButton.textContent = "End";

            renderer.setAnimationLoop(() => {
                renderer.render(scene, camera);
            });
        }

        const end = async () => {
            currentSession.end();
            currentSession = null;
            arButton.textContent = "Start";
            renderer.clear();
            renderer.setAnimationLoop(null);
        }

        arButton.addEventListener("click", () => {
            if(currentSession) {
                console.log(currentSession);
                end();
            } else{
                console.log(currentSession);
                start();
            }

        })
    }
    initialize();
})