import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.module.js';
import { ARButton } from 'https://unpkg.com/three@0.134.0/examples/jsm/webxr/ARButton.js';
import * as OC from 'https://unpkg.com/three@.134.0/examples/jsm/webxr/OrbitControls.js';

document.addEventListener('DOMContentLoaded', () => {
    const initialize = async () => {

        const supported = navigator.xr && await navigator.xr.isSessionSupported("immersive-ar");
        if (!supported) {
            arButton.textContent = "Not Supported";
            arButton.disabled = true;
            return;
        }

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera();

        const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
        scene.add(light);

        const reticleGeometry = new THREE.RingGeometry(0.15, 0.2, 32).rotateX(-Math.PI/2);
        const reticleMaterial = new THREE.MeshBasicMaterial();
        const reticle = new THREE.Mesh(reticleGeometry, reticleMaterial);
        reticle.matrixAutoUpdate = false;
        reticle.visible = false;
        scene.add(reticle);

        const renderer = new THREE.WebGLRenderer({alpha: true});
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.xr.enabled = true;
        document.body.appendChild(renderer.domElement);

        const arButton = ARButton.createButton(renderer, {requiredFeatures: ['hit-test'], optionalFeatures: ['dom-overlay'], domOverlay: {root: document.body}});
        document.body.appendChild(renderer.domElement);
        document.body.appendChild(arButton);


        const oc = new OC;
        const controller = renderer.xr.getController(0);
        scene.add(controller);
        controller.addEventListener('select', () => {
            const geometry = new THREE.BoxGeometry(0.06, 0.06, 0.06);
            const material = new THREE.MeshBasicMaterial({color: 0xffffff * Math.random()});
            const mesh = new THREE.Mesh(geometry, material);

            mesh.position.setFromMatrixPosition(reticle.matrix);
            mesh.scale.y = Math.random() * 2 + 1;
            scene.add(mesh);
        });

        renderer.xr.addEventListener("sessionstart", async () => {
            const session = renderer.xr.getSession();

            const viewerReferenceSpace = await session.requestReferenceSpace("viewer");
            const hitTestSource = await session.requestHitTestSource({space: viewerReferenceSpace});
            renderer.setAnimationLoop((timestamp, frame) => {
                if(!frame) return;
                const hitTestResults = frame.getHitTestResults(hitTestSource);
                if (hitTestResults.length > 0){
                    const hit = hitTestResults[0];
                    const referenceSpace = renderer.xr.getReferenceSpace();
                    const hitPose = hit.getPose(referenceSpace);
                    reticle.visible = true;
                    reticle.matrix.fromArray(hitPose.transform.matrix);
                } else {
                    reticle.visible = false;
                }

                renderer.render(scene, camera);
            });
        });
    }
    initialize();
})