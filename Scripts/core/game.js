/// <reference path="_reference.ts"/>
// MAIN GAME FILE
// THREEJS Aliases
var Scene = Physijs.Scene;
var Renderer = THREE.WebGLRenderer;
var PerspectiveCamera = THREE.PerspectiveCamera;
var BoxGeometry = THREE.BoxGeometry;
var CubeGeometry = THREE.CubeGeometry;
var PlaneGeometry = THREE.PlaneGeometry;
var SphereGeometry = THREE.SphereGeometry;
var Geometry = THREE.Geometry;
var AxisHelper = THREE.AxisHelper;
var LambertMaterial = THREE.MeshLambertMaterial;
var MeshBasicMaterial = THREE.MeshBasicMaterial;
var Material = THREE.Material;
var Mesh = THREE.Mesh;
var Object3D = THREE.Object3D;
var SpotLight = THREE.SpotLight;
var PointLight = THREE.PointLight;
var AmbientLight = THREE.AmbientLight;
var Control = objects.Control;
var GUI = dat.GUI;
var Color = THREE.Color;
var Vector3 = THREE.Vector3;
var Face3 = THREE.Face3;
var Point = objects.Point;
var CScreen = config.Screen;
var Clock = THREE.Clock;
var LineBasicMaterial = THREE.LineBasicMaterial;
var Line = THREE.Line;
//Custom Game Objects
var gameObject = objects.gameObject;
// Setup a Web Worker for Physijs
Physijs.scripts.worker = "/Scripts/lib/Physijs/physijs_worker.js";
Physijs.scripts.ammo = "/Scripts/lib/Physijs/examples/js/ammo.js";
// setup an IIFE structure (Immediately Invoked Function Expression)
var game = (function () {
    // declare game objects
    var havePointerLock;
    var element;
    var scene = new Scene(); // Instantiate Scene Object
    var renderer;
    var camera;
    var control;
    var gui;
    var stats;
    var blocker;
    var instructions;
    var spotLight;
    var groundGeometry;
    var groundMaterial;
    var ground;
    var clock;
    var playerGeometry;
    var playerMaterial;
    var player;
    var sphereGeometry;
    var sphereMaterial;
    var sphere;
    var keyboardControls;
    var isgrounded;
    var velocity = new Vector3(0, 0, 0);
    var prevtime = 0;
    var obstical;
    var obsticalGeometry;
    var obsticalMaterial;
    var b = 0;
    var _pointer = Point;
    var ambient;
    var mouseControls;
    var directionLineMaterial;
    var directionLineGeometry;
    var directionLine;
    var random = function Randome(low, high) {
        return Math.random() * (high - low) + low;
    };
    function randomIntInc(low, high) {
        return Math.floor(Math.random() * (high - low + 1) + low);
    }
    var numbers = new Array(10);
    for (var i = 0; i < numbers.length; i++) {
        numbers[i] = randomIntInc(1, 10);
    }
    function init() {
        // Create to HTMLElements
        blocker = document.getElementById("blocker");
        instructions = document.getElementById("instructions");
        //check to see if pointerlock is supported
        havePointerLock = 'pointerLockElement' in document ||
            'mozPointerLockElement' in document ||
            'webkitPointerLockElement' in document;
        keyboardControls = new objects.KeyboardControls();
        mouseControls = new objects.MouseControls();
        if (havePointerLock) {
            element = document.body;
            instructions.addEventListener('click', function () {
                // Ask the user for pointer lock
                console.log("Requesting PointerLock");
                element.requestPointerLock = element.requestPointerLock ||
                    element.mozRequestPointerLock ||
                    element.webkitRequestPointerLock;
                element.requestPointerLock();
            });
            document.addEventListener('pointerlockchange', pointerLockChange);
            document.addEventListener('mozpointerlockchange', pointerLockChange);
            document.addEventListener('webkitpointerlockchange', pointerLockChange);
            document.addEventListener('pointerlockerror', pointerLockError);
            document.addEventListener('mozpointerlockerror', pointerLockError);
            document.addEventListener('webkitpointerlockerror', pointerLockError);
        }
        // Scene changes for Physijs
        scene.name = "Main";
        scene.fog = new THREE.Fog(0xffffff, 100, 750);
        setInterval(function () { scene.setGravity(new THREE.Vector3(randomIntInc(-20, 20), randomIntInc(-15, 5) /*-10*/, randomIntInc(-20, 20))); console.log(randomIntInc); /*alert("Hello");*/ }, console.log("someyt"), 3000);
        // console.log("safasf"+ scene.setGravity.call);
        scene.addEventListener('update', function () {
            scene.simulate(undefined, 2);
        });
        // setup a THREE.JS Clock object
        clock = new Clock();
        setupRenderer(); // setup the default renderer
        setupCamera(); // setup the camera
        // Spot Light
        spotLight = new SpotLight(0xffffff);
        spotLight.position.set(20, 40, -15);
        spotLight.castShadow = true;
        spotLight.intensity = 2;
        spotLight.lookAt(new Vector3(0, 0, 0));
        spotLight.shadowCameraNear = 2;
        spotLight.shadowCameraFar = 200;
        spotLight.shadowCameraLeft = -5;
        spotLight.shadowCameraRight = 5;
        spotLight.shadowCameraTop = 5;
        spotLight.shadowCameraBottom = -5;
        spotLight.shadowMapWidth = 2048;
        spotLight.shadowMapHeight = 2048;
        spotLight.shadowDarkness = 0.5;
        spotLight.name = "Spot Light";
        scene.add(spotLight);
        console.log("Added spotLight to scene");
        ambient = new AmbientLight(0xffffff);
        //  ambient.castShadow = true;
        ambient.getWorldScale;
        ambient.position.set(20, 40, -15);
        //   ambient.shadowDarkness = 1;
        ambient.scale.set(1000, 1000, 1000);
        scene.add(ambient);
        // Burnt Ground
        groundGeometry = new BoxGeometry(3200, 1, 3200);
        ground = new Physijs.ConvexMesh(groundGeometry, groundMaterial, 0);
        groundMaterial = Physijs.createMaterial(new LambertMaterial({ color: 0xe75d14 }), 0.4, 0);
        ground.receiveShadow = true;
        ground.name = "Ground";
        scene.add(ground);
        console.log("Added Burnt Ground to scene");
        // Player Object
        playerGeometry = new BoxGeometry(2, 2, 2);
        playerMaterial = Physijs.createMaterial(new LambertMaterial({ color: 0x00ff00 }), 0.4, 0);
        player = new Physijs.BoxMesh(playerGeometry, playerMaterial, 0.2);
        // player.position.set(0, 30, 10);
        player.receiveShadow = true;
        player.castShadow = true;
        player.name = "Player";
        player.rotation.x = 0;
        player.position.set(randomIntInc(3, 5), randomIntInc(3, 5), randomIntInc(3, 5));
        scene.add(player);
        player.add(camera);
        // setInterval(function(){ camera.lookAt(ground.position); console.log("ewfewf");  /*alert("Hello");*/ }, 1);
        console.log("Added Player to Scene  " + player.position.y);
        normal();
        diferentsize();
        player.addEventListener('collision', function (event) {
            if (event.name === "Ground") {
                console.log("player hit the ground");
                isgrounded = true;
            }
            if (event.name === "Sphere") {
                console.log("player hit the sphere");
                isgrounded = false;
            }
        });
        // Sphere Object
        sphereGeometry = new SphereGeometry(2, 32, 32);
        sphereMaterial = Physijs.createMaterial(new LambertMaterial({ color: 0x00ff00 }), 0.4, 0);
        sphere = new Physijs.SphereMesh(sphereGeometry, sphereMaterial, 1);
        sphere.position.set(0, 60, 10);
        sphere.receiveShadow = true;
        sphere.castShadow = true;
        sphere.name = "Sphere";
        scene.add(sphere);
        console.log("Added Sphere to Scene");
        // add controls
        gui = new GUI();
        control = new Control();
        addControl(control);
        // Add framerate stats
        addStatsObject();
        console.log("Added Stats to scene...");
        document.body.appendChild(renderer.domElement);
        gameLoop(); // render the scene	
        scene.simulate();
        window.addEventListener('resize', onWindowResize, false);
    }
    //PointerLockChange Event Handler
    function pointerLockChange(event) {
        if (document.pointerLockElement === element) {
            keyboardControls.enable = true;
            mouseControls.enabled = true;
            // enable our mouse and keyboard controls
            blocker.style.display = 'none';
        }
        else {
            // disable our mouse and keyboard controls
            keyboardControls.enable = false;
            mouseControls.enabled = false;
            blocker.style.display = '-webkit-box';
            blocker.style.display = '-moz-box';
            blocker.style.display = 'box';
            instructions.style.display = '';
            console.log("PointerLock disabled");
        }
    }
    //PointerLockError Event Handler
    function pointerLockError(event) {
        instructions.style.display = '';
        console.log("PointerLock Error Detected!!");
    }
    // Window Resize Event Handler
    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
    function addControl(controlObject) {
        /* ENTER CODE for the GUI CONTROL HERE */
    }
    // Add Frame Rate Stats to the Scene
    function addStatsObject() {
        stats = new Stats();
        stats.setMode(0);
        stats.domElement.style.position = 'absolute';
        stats.domElement.style.left = '0px';
        stats.domElement.style.top = '0px';
        document.body.appendChild(stats.domElement);
    }
    // Setup main game loop
    function gameLoop() {
        stats.update();
        checkcontrols();
        //   obstical.quaternion.set(1,1,1,1);
        player.rotation.x = 0;
        player.rotation.y = 0;
        player.rotation.z = 0;
        // render using requestAnimationFrame
        requestAnimationFrame(gameLoop);
        // render the scene
        renderer.render(scene, camera);
    }
    function checkcontrols() {
        if (keyboardControls.enable) {
            velocity = new Vector3();
            var time = performance.now();
            var delta = 1; // (time-prevtime) / 1000
            if (isgrounded) {
                var direction = new Vector3(0, 0, 0);
                if (keyboardControls.moveForward) {
                    console.log("Moving Forward");
                    velocity.z -= 4 * delta;
                }
                if (keyboardControls.moveLeft) {
                    console.log("Moving left");
                    velocity.x -= 4 * delta;
                }
                if (keyboardControls.moveBackward) {
                    console.log("Moving Backward");
                    velocity.z += 4 * delta;
                }
                if (keyboardControls.moveRight) {
                    console.log("Moving Right");
                    velocity.x += 4 * delta;
                }
                if (keyboardControls.shift) {
                    console.log("shiy");
                }
                if (keyboardControls.jump) {
                    console.log("Jumping");
                    camera.lookAt(ground.position);
                    velocity.y += 20.0 * delta;
                    if (player.position.y > 4) {
                    }
                }
                player.setDamping(0.7, 0.1);
                // Changing player's rotation
                player.setAngularVelocity(new Vector3(0, mouseControls.yaw, 0));
                direction.addVectors(direction, velocity);
                direction.applyQuaternion(player.quaternion);
                if (Math.abs(player.getLinearVelocity().x) < 20 && Math.abs(player.getLinearVelocity().y) < 10) {
                    player.applyCentralForce(direction);
                }
                console.log(velocity.x);
                cameraLook();
            }
            mouseControls.pitch = 0;
            mouseControls.yaw = 0;
            prevtime = time;
        }
        else {
            player.setAngularVelocity(new Vector3(0, 0, 0));
        }
        //  player.applyCentralForce(velocity);
    }
    // Camera Look function
    function cameraLook() {
        var zenith = THREE.Math.degToRad(90);
        var nadir = THREE.Math.degToRad(-90);
        var cameraPitch = camera.rotation.x + mouseControls.pitch;
        // Constrain the Camera Pitch
        camera.rotation.x = THREE.Math.clamp(cameraPitch, nadir, zenith);
    }
    // Setup default renderer
    function setupRenderer() {
        renderer = new Renderer({ antialias: true });
        renderer.setClearColor(0x404040, 1.0);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(CScreen.WIDTH, CScreen.HEIGHT);
        renderer.shadowMap.enabled = true;
        console.log("Finished setting up Renderer...");
    }
    // Setup main camera for the scene
    function setupCamera() {
        camera = new PerspectiveCamera(35, config.Screen.RATIO, 0.1, 100);
        //  camera.position.set(0, 10, 30);
        //  camera.lookAt(new Vector3(0, 0, 0));
        console.log("Finished setting up Camera...");
    }
    var normal = function Normal() {
        for (var i = 0; i < 30; i++) {
            obsticalGeometry = new BoxGeometry(2, 2, 2);
            obstical = new Physijs.BoxMesh(obsticalGeometry, obsticalMaterial, 0);
            // obsticalMaterial = Physijs.createMaterial(new LambertMaterial({color: 0xffffff}), 0.4, 0);   
            obstical.receiveShadow = true;
            obstical.castShadow = true;
            //   obstical.name = "obstical";
            obstical.position.set(randomIntInc(-1, 40), randomIntInc(-1, 25), randomIntInc(-1, 50));
            scene.add(obstical);
        }
    };
    var diferentsize = function Diferentsize() {
        for (var i = 0; i < 100; i++) {
            obsticalGeometry = new BoxGeometry(randomIntInc(1, 10), randomIntInc(1, 10), randomIntInc(1, 10));
            obstical = new Physijs.BoxMesh(obsticalGeometry, obsticalMaterial, 0);
            //  obsticalMaterial = Physijs.createMaterial(new LambertMaterial({color: 0xffffff}), 0.4, 0);   
            // player.position.set(0, 30, 10);
            obstical.receiveShadow = true;
            obstical.castShadow = true;
            //   obstical.name = "obstical";
            obstical.position.set(randomIntInc(-50, 50), randomIntInc(-10, 50), randomIntInc(-50, 50));
            scene.add(obstical);
        }
    };
    window.onload = init;
    return {
        scene: scene
    };
})();
//# sourceMappingURL=game.js.map