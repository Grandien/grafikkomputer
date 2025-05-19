// Wait for the DOM to be fully loaded
window.addEventListener('DOMContentLoaded', () => {
    // Get the canvas element
    const canvas = document.getElementById("renderCanvas");
    // Create the Babylon engine
    const engine = new BABYLON.Engine(canvas, true);

    // Your createScene function from earlier:
    var createScene = function () {
        const scene = new BABYLON.Scene(engine);

        // Kamera
        const camera = new BABYLON.ArcRotateCamera("camera", 0, Math.PI / 3, 15, new BABYLON.Vector3(0, 1, 5), scene);
        camera.attachControl(canvas, true);

        // Cahaya
        const light = new BABYLON.DirectionalLight("dirLight", new BABYLON.Vector3(-1, -2, -1), scene);
        light.position = new BABYLON.Vector3(10, 10, 10);

        // Bayangan
        const shadowGenerator = new BABYLON.ShadowGenerator(1024, light);
        shadowGenerator.useBlurExponentialShadowMap = true;
        shadowGenerator.blurKernel = 16;

        // Bola
        const sphere = BABYLON.MeshBuilder.CreateSphere("sphere", { diameter: 2 }, scene);
        sphere.position.y = 1;
        shadowGenerator.addShadowCaster(sphere);

        // Material
        const sphereMat = new BABYLON.StandardMaterial("mat", scene);
        sphereMat.diffuseColor = new BABYLON.Color3(0.2, 0.6, 1);
        sphere.material = sphereMat;

        // Tanah
        const ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 20, height: 100 }, scene);
        ground.receiveShadows = true;

        // Kontrol gerakan
        let keys = {
            forward: false,
            backward: false,
            left: false,
            right: false,
            jump: false
        };

        let jumpVelocity = 0;
        let isJumping = false;
        const gravity = -0.02;
        const speed = 0.15;

        // Keyboard event
        window.addEventListener("keydown", (evt) => {
            switch (evt.code) {
                case "KeyW":
                    keys.forward = true;
                    break;
                case "KeyS":
                    keys.backward = true;
                    break;
                case "KeyA":
                    keys.left = true;
                    break;
                case "KeyD":
                    keys.right = true;
                    break;
                case "Space":
                    if (!isJumping) {
                        isJumping = true;
                        jumpVelocity = 0.4; // tinggi lompatan
                    }
                    break;
            }
        });

        window.addEventListener("keyup", (evt) => {
            switch (evt.code) {
                case "KeyW":
                    keys.forward = false;
                    break;
                case "KeyS":
                    keys.backward = false;
                    break;
                case "KeyA":
                    keys.left = false;
                    break;
                case "KeyD":
                    keys.right = false;
                    break;
            }
        });

        // Animasi utama
        scene.onBeforeRenderObservable.add(() => {
            // Gerakan horizontal
            if (keys.forward) {
                sphere.position.z += speed;
            }
            if (keys.backward) {
                sphere.position.z -= speed;
            }
            if (keys.left) {
                sphere.position.x -= speed;
            }
            if (keys.right) {
                sphere.position.x += speed;
            }

            // Loncat
            if (isJumping) {
                jumpVelocity += gravity;
                sphere.position.y += jumpVelocity;

                // Kembali ke tanah
                if (sphere.position.y <= 1) {
                    sphere.position.y = 1;
                    isJumping = false;
                    jumpVelocity = 0;
                }
            }
        });

        return scene;
    };

    // Create the scene
    const scene = createScene();

    // Start the render loop
    engine.runRenderLoop(() => {
        scene.render();
    });

    // Resize the engine if the window changes size
    window.addEventListener("resize", () => {
        engine.resize();
    });
});
