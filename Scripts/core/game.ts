/// <reference path="_reference.ts"/>

// MAIN GAME FILE

// THREEJS Aliases
import Scene = Physijs.Scene;
import Renderer = THREE.WebGLRenderer;
import PerspectiveCamera = THREE.PerspectiveCamera;
import BoxGeometry = THREE.BoxGeometry;
import CubeGeometry = THREE.CubeGeometry;
import PlaneGeometry = THREE.PlaneGeometry;
import SphereGeometry = THREE.SphereGeometry;
import Geometry = THREE.Geometry;
import AxisHelper = THREE.AxisHelper;
import LambertMaterial = THREE.MeshLambertMaterial;
import MeshBasicMaterial = THREE.MeshBasicMaterial;
import Material = THREE.Material;
import Mesh = THREE.Mesh;
import Object3D = THREE.Object3D;
import SpotLight = THREE.SpotLight;
import PointLight = THREE.PointLight;
import AmbientLight = THREE.AmbientLight;
import Control = objects.Control;
import GUI = dat.GUI;
import Color = THREE.Color;
import Vector3 = THREE.Vector3;
import Face3 = THREE.Face3;
import Point = objects.Point;
import CScreen = config.Screen;
import Clock = THREE.Clock;
import LineBasicMaterial = THREE.LineBasicMaterial;
import Line = THREE.Line;
import Textur = THREE.Texture;


//Custom Game Objects
import gameObject = objects.gameObject;
import PhongMaterial = THREE.MeshPhongMaterial;

// Setup a Web Worker for Physijs
Physijs.scripts.worker = "/Scripts/lib/Physijs/physijs_worker.js";
Physijs.scripts.ammo = "/Scripts/lib/Physijs/examples/js/ammo.js";


// setup an IIFE structure (Immediately Invoked Function Expression)
var game = (() => {

    // declare game objects
    var havePointerLock: boolean;
    var element: any;
    var scene: Scene = new Scene(); // Instantiate Scene Object
    var renderer: Renderer;
    var camera: PerspectiveCamera;
    var control: Control;
    var gui: GUI;
    var stats: Stats;
    var blocker: HTMLElement;
    var instructions: HTMLElement;
    var spotLight: SpotLight;
    var groundGeometry: CubeGeometry;

    var ground: Physijs.Mesh;
    var clock: Clock;
    var playerGeometry: CubeGeometry;
    var playerMaterial: Physijs.Material;
    var player: Physijs.Mesh;
    var sphereGeometry: SphereGeometry;
    var sphereMaterial: Physijs.Material;
    var sphere: Physijs.Mesh;
    var keyboardControls: objects.KeyboardControls;
    var isgrounded : boolean;
    var velocity : Vector3 = new Vector3(0,0,0) ;
    var prevtime : number =0;
    var obstical: Physijs.Mesh;
    var obsticalGeometry: CubeGeometry;
    var obsticalMaterial: Physijs.Material;
     var b : number = 0;
     var _pointer = Point;
     var ambient : AmbientLight;
         var mouseControls: objects.MouseControls;
    var directionLineMaterial: LineBasicMaterial;
    var directionLineGeometry: Geometry;
    var directionLine: Line;
     var isparkor : boolean = false;
       var timerB : boolean;
       
           var groundPhysicMaterial: Physijs.Material;
     var groundMaterial: PhongMaterial;

       // textur
       var groundtextur : Textur;
       var groundTextureN: Textur;
       
    var goaltextur : Textur;
    var goalTextureN: Textur;
    var goal: Physijs.Mesh;
    var goalGeometry: CubeGeometry;
    var goalMaterial: PhongMaterial;      
    var deathPlaneGeometry: CubeGeometry;
    var deathPlaneMaterial: Physijs.Material;
    var deathPlane: Physijs.Mesh;
     var goalPhysicMaterial: Physijs.Material;
    
    
    var assets: createjs.LoadQueue;
    var canvas: HTMLElement;
    var stage: createjs.Stage;
        var scoreLabel: createjs.Text;
    var livesLabel: createjs.Text;
    var scoreValue: number;
    var livesValue: number;
    var windx : number;
      var windy : number;
        var windz : number;
    
        var manifest = [
        { id: "land", src: "../../Assets/audio/Land.wav" },
        { id: "hit", src: "../../Assets/audio/hit.wav" },
        { id: "coin", src: "../../Assets/audio/coin.mp3" },
        { id: "jump", src: "../../Assets/audio/Jump.wav" },
        { id: "over", src: "../../Assets/audio/gameover.mp3" }
    ];
    
      function preload(): void {
        assets = new createjs.LoadQueue();
        assets.installPlugin(createjs.Sound);
        assets.on("complete", init, this);
        assets.loadManifest(manifest);
    }
      function setupCanvas(): void {
        canvas = document.getElementById("canvas");
        canvas.setAttribute("width", config.Screen.WIDTH.toString());
        canvas.setAttribute("height", (config.Screen.HEIGHT * 0.1).toString());
        canvas.style.backgroundColor = "#000000";
        stage = new createjs.Stage(canvas);
    }
    
    function setupScoreboard(): void {
        // initialize  score and lives values
        scoreValue = 0;
        livesValue = 5;

        // Add Lives Label
        livesLabel = new createjs.Text(
            "LIVES: " + livesValue,
            "40px Consolas",
            "#ffffff"
        );
        livesLabel.x = config.Screen.WIDTH * 0.1;
        livesLabel.y = (config.Screen.HEIGHT * 0.15) * 0.20;
        stage.addChild(livesLabel);
        console.log("Added Lives Label to stage");

        // Add Score Label
        scoreLabel = new createjs.Text(
            "Wind: " + windx ,  //randomIntInc(-20, 20),    // scoreValue,
            "40px Consolas",
            "#ffffff"
        );
        scoreLabel.x = config.Screen.WIDTH * 0.35;
        scoreLabel.y = (config.Screen.HEIGHT * 0.15) * 0.20;
        stage.addChild(scoreLabel);
        console.log("Added Score Label to stage");
    }
       
 // var assets : createjs.LoadQue
     
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
        
        setupCanvas();

        setupScoreboard();
        
        
        //check to see if pointerlock is supported
        havePointerLock = 'pointerLockElement' in document ||
            'mozPointerLockElement' in document ||
            'webkitPointerLockElement' in document;
            
            
            
        keyboardControls = new objects.KeyboardControls();
        mouseControls = new objects.MouseControls();
        
        if (havePointerLock) {
        
            element = document.body;
        
            instructions.addEventListener('click', () => {
                
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
        scene.fog = new THREE.Fog(0xffffff, 100 , 750);
        
     //  setInterval(function(){   scene.setGravity(new THREE.Vector3(windx, randomIntInc(-15, 5)/*-10*/, randomIntInc(-20, 20))); /*alert("Hello");*/ },100000);
scene.setGravity(new THREE.Vector3(windx,windy,windz));
     // console.log("safasf"+ scene.setGravity.call);
        scene.addEventListener('update', () => {
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
      //  scene.add(spotLight);
        console.log("Added spotLight to scene");
        ambient = new AmbientLight(0xffffff);
      //  ambient.castShadow = true;
        ambient.getWorldScale;
       ambient.position.set(0, 40, -0);
     //   ambient.shadowDarkness = 1;
      //  ambient.scale.set(10,10,10);
        scene.add(ambient);
        
        // Burnt Ground
        groundtextur = new THREE.TextureLoader().load('../../Assets/images/floor.jpg');
        groundtextur.wrapS = THREE.RepeatWrapping;
        groundtextur.wrapS = THREE.RepeatWrapping;
        groundtextur.repeat.set(1,1);
        
        groundTextureN = new THREE.TextureLoader().load('../../Assets/images/floorN.png');
        groundTextureN.wrapS = THREE.RepeatWrapping;
        groundTextureN.wrapS = THREE.RepeatWrapping;
        groundTextureN.repeat.set(2,2);
        
        
        
        groundMaterial = new PhongMaterial();
        groundMaterial.map = groundtextur;
        groundMaterial.bumpMap = groundTextureN;
        groundMaterial.bumpScale = 0.2;
        groundGeometry = new BoxGeometry(32, 1, 32);
        groundPhysicMaterial = Physijs.createMaterial(groundMaterial, 0, 0);// new LambertMaterial({ color: 0xe75d14 })
      
         ground = new Physijs.ConvexMesh(groundGeometry, groundPhysicMaterial, 0);
         ground.receiveShadow = true;
  //  ground.rotation.x = 47;
        ground.name = "Ground";
        scene.add(ground);
        console.log("Added Burnt Ground to scene");
 
        // Player Object
     playerGeometry = new BoxGeometry(2, 2, 2);
        playerMaterial = Physijs.createMaterial(new LambertMaterial({color: 0x00ff00}), 0.4, 0);   
        player = new Physijs.BoxMesh(playerGeometry, playerMaterial,0.2);
      // player.position.set(0, 30, 10);
      player.receiveShadow = true;
        player.castShadow = true;
        player.name = "Player";
       
   //  player.rotation.x =0;
         player.position.set(randomIntInc(3, 5), randomIntInc(3, 5), randomIntInc(3, 5));
        scene.add(player);
        player.add(camera);
        
        // setInterval(function(){ camera.lookAt(ground.position); console.log("ewfewf");  /*alert("Hello");*/ }, 1);

        console.log("Added Player to Scene  "  +  player.position.y);
     normal();
     diferentsize();
        addDeathPlane();
        goals();
        
    
        player.addEventListener('collision', (event) => {
           if(event.name === "Ground") {
           createjs.Sound.play("land");
              isparkor=false;
               isgrounded = true;              
           }
        //   else isgrounded = false;
           if(event.name === "Sphere") {
               console.log("player hit the sphere");
               isgrounded = false;
               
           }
           if(event.name === "obstical")
           { 
               isparkor = true;   
           }
           if(event.name === "DeathPlane") {
                createjs.Sound.play("hit");
                livesValue--;
                livesLabel.text = "LIVES: " + livesValue;
                scene.remove(player);
                player.position.set(0, 30, 10);
                scene.add(player);
           if (livesValue <= 0)
           {
             createjs.Sound.play("over");
             
               scene.remove(player);}
           
            }
      if(event.name === "goal") {
           createjs.Sound.play("over");
           livesValue =0;
           livesLabel.text = "LIVES: " + livesValue;
           
           if (livesValue <= 0)
           {createjs.Sound.play("over"); scene.remove(player);}
                
           }
         
        });
                       if (timerB = false)
              {
                    setTimeout(function(){  isparkor = false,console.log("is false", timerB.valueOf) }, 10000);   
              }
     if (isgrounded = false)
              {
          }
             setInterval(function(){  if (isgrounded = false)
              {
              isgrounded = true; 
             }    
             else isgrounded = true;
                 console.log("is grouded", isgrounded) }, 5000);
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
      function setCenter ( geometry:Geometry ): Vector3 {

		geometry.computeBoundingBox();

		var bb = geometry.boundingBox;

		var offset = new THREE.Vector3();

		offset.addVectors( bb.min, bb.max );
		offset.multiplyScalar( -0.5 );

		geometry.applyMatrix( new THREE.Matrix4().makeTranslation( offset.x, offset.y, offset.z ) );
		geometry.computeBoundingBox();

		return offset;
	}
    
    
    function addDeathPlane():void {
        deathPlaneGeometry = new BoxGeometry(100, 1, 100);
        deathPlaneMaterial = Physijs.createMaterial(new MeshBasicMaterial({color: 0xff0000}), 0.4, 0.6);
       
        deathPlane =  new Physijs.BoxMesh(deathPlaneGeometry, deathPlaneMaterial, 0);
        deathPlane.position.set(0, -10, 0);
        deathPlane.name = "DeathPlane";
        scene.add(deathPlane);
}
    
    //PointerLockChange Event Handler
    function pointerLockChange(event): void {
        if (document.pointerLockElement === element) {
           keyboardControls.enable = true;
            mouseControls.enabled = true;
            // enable our mouse and keyboard controls
            blocker.style.display = 'none';
        } else {
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
    function pointerLockError(event): void {
        instructions.style.display = '';
        console.log("PointerLock Error Detected!!");
    }
    
    // Window Resize Event Handler
    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        
          canvas.style.width = "100%";
        livesLabel.x = config.Screen.WIDTH * 0.1;
        livesLabel.y = (config.Screen.HEIGHT * 0.15) * 0.20;
        scoreLabel.x = config.Screen.WIDTH * 0.8;
        scoreLabel.y = (config.Screen.HEIGHT * 0.15) * 0.20;
        stage.update();
    }

    function addControl(controlObject: Control): void {
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
 setInterval(function() {windx = randomIntInc(-10,10) }, 10000); 
  setInterval(function() {windy = randomIntInc(-15,-1) }, 10000); 
   setInterval(function() {windz = randomIntInc(-10,10) }, 10000); 
         
    // Setup main game loop
    function gameLoop(): void {
        stats.update();
         checkcontrols();
             scoreLabel.text = "wind x:"+ windx + "   wind y:"+ windy +  "  wind z: "+ windz; //windx
        scene.setGravity(new THREE.Vector3(windx,windy,windz));
   
   //   obstical.quaternion.set(1,1,1,1);
           
    //  player.rotation.x = 0;
     //       player.rotation.y = 0;
     //     player.rotation.z = 0;
    
        // render using requestAnimationFrame
        requestAnimationFrame(gameLoop);
       stage.update();
        // render the scene
        renderer.render(scene, camera);
    }
    
    function  checkcontrols(): void {
        if(keyboardControls.enable){
           velocity = new Vector3();
            var time : number = performance.now();
           
            var delta : number = 1// (time-prevtime) / 1000
            if (isgrounded) {
                var direction = new Vector3(0, 0, 0);
                if (keyboardControls.moveForward) {
                    console.log("Moving Forward");
                    velocity.z -= 4  * delta;
                }
                if (keyboardControls.moveLeft) {
                    console.log("Moving left");
                    velocity.x -= 4  * delta;
                }
                if (keyboardControls.moveBackward) {
                    console.log("Moving Backward");
                    velocity.z += 4  * delta;
                }
                if (keyboardControls.moveRight) {
                    console.log("Moving Right");
                    velocity.x += 4  * delta;
                }
                if (keyboardControls.shift) {
                    if(isparkor){              
                         velocity.y += 2  * delta;
                  
                     setTimeout(function(){  isparkor = false , timerB = false;   createjs.Sound.play("jump"); console.log("it :"+ timerB  + isparkor); }, 3000);
                       }
                   // velocity.x * 2 * delta;  velocity.y * 2 * delta; camera.lookAt(ground.position); obstical.position.x = 5; //obstical.position.set(1,1,1);  //  velocity.y = velocity.y  + 10;
                }
                if (keyboardControls.jump) {
                    console.log("Jumping");
                   //  camera.lookAt(ground.position);
               velocity.y += 20.0  * delta;
                    setTimeout(function(){ isgrounded = false; console.log("it : "+ isgrounded); }, 100);    
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
         
        }
        cameraLook();
           mouseControls.pitch = 0;
            mouseControls.yaw = 0;
            prevtime = time;
    }
     else {
            player.setAngularVelocity(new Vector3(0, 0, 0));
            player.setAngularFactor(new Vector3(0,0,0));
        }

  //  player.applyCentralForce(velocity);
    }
    // Camera Look function
    function cameraLook():void {
        var zenith: number = THREE.Math.degToRad(90);
        var nadir: number = THREE.Math.degToRad(-90);
        
        var cameraPitch:number = camera.rotation.x + mouseControls.pitch;
        
         // Constrain the Camera Pitch
        camera.rotation.x = THREE.Math.clamp(cameraPitch, nadir, zenith);
        
    }
    // Setup default renderer
    function setupRenderer(): void {
        renderer = new Renderer({ antialias: true });
        renderer.setClearColor(0x404040, 1.0);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(CScreen.WIDTH, CScreen.HEIGHT);
        renderer.shadowMap.enabled = true;
        console.log("Finished setting up Renderer...");
       
     
        	
    }

    // Setup main camera for the scene
    function setupCamera(): void {
        camera = new PerspectiveCamera(35, config.Screen.RATIO, 0.1, 100);
      //  camera.position.set(0, 10, 30);
      //  camera.lookAt(new Vector3(0, 0, 0));
        console.log("Finished setting up Camera...");
        
    }
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    

       var normal = function Normal() {
        
        for (var i = 0; i < 20; i++) {
          obsticalGeometry = new BoxGeometry(2, 2, 2);
            obstical = new Physijs.BoxMesh(obsticalGeometry, obsticalMaterial,0);
       obstical.name="obstical";
       // obsticalMaterial = Physijs.createMaterial(new LambertMaterial({color: 0xffffff}), 0.4, 0);   
        obstical.receiveShadow = true;
        obstical.castShadow = true;
     //   obstical.name = "obstical";
         obstical.position.set(randomIntInc(-20, 20), randomIntInc(-1, 15), randomIntInc(-1, 20));
        scene.add(obstical);
             
        }   
       }
  var diferentsize = function Diferentsize() {
        
        for (var i = 0; i < 10; i++) {
          obsticalGeometry = new BoxGeometry(randomIntInc(1,10),randomIntInc(1,10),randomIntInc(1,10));
               obstical = new Physijs.BoxMesh(obsticalGeometry, obsticalMaterial,0);
      //  obsticalMaterial = Physijs.createMaterial(new LambertMaterial({color: 0xffffff}), 0.4, 0);   
       obstical.name="obstical";
      // player.position.set(0, 30, 10);
      obstical.receiveShadow = true;
        obstical.castShadow = true;
     //   obstical.name = "obstical";
         obstical.position.set(randomIntInc(-20, 20), randomIntInc(-1, 25), randomIntInc(-20, 20));
        scene.add(obstical);
           
      //  console.log("Added Player to Scene  "  +  obstical.position.y);
        }   
       }
       
  var goals = function goalss() {

      for (var i = 0; i < 5; i++) {
          
        goaltextur = new THREE.TextureLoader().load('../../Assets/images/wall.jpg');
        goaltextur.wrapS = THREE.RepeatWrapping;
        goaltextur.wrapS = THREE.RepeatWrapping;
        goaltextur.repeat.set(1,1);
        
        goalTextureN = new THREE.TextureLoader().load('../../Assets/images/wall.png');
        goalTextureN.wrapS = THREE.RepeatWrapping;
        goalTextureN.wrapS = THREE.RepeatWrapping;
        goalTextureN.repeat.set(2,2);
        
        
       
        goalMaterial = new PhongMaterial();
        goalMaterial.map = goaltextur;
        goalMaterial.bumpMap = goalTextureN;
        goalMaterial.bumpScale = 0.2;
        goalPhysicMaterial = Physijs.createMaterial(groundMaterial, 0, 0);// new LambertMaterial({ color: 0xe75d14 })
      
     
          goalGeometry = new BoxGeometry(randomIntInc(5, 10), randomIntInc(5, 10), randomIntInc(5, 10));
          goal = new Physijs.BoxMesh(goalGeometry, goalMaterial, -0.1);
          //  obsticalMaterial = Physijs.createMaterial(new LambertMaterial({color: 0xffffff}), 0.4, 0);   
          goal.name = "goal";
          goal.position.set(randomIntInc(-30, 30), randomIntInc(20, 30), randomIntInc(-30, 30));
          scene.add(goal);
          
        
           
          //  console.log("Added Player to Scene  "  +  obstical.position.y);
      }
  }
     
    window.onload = preload; //init;

    return {
        scene: scene
    }

})();





/*  
        // Sphere Object
        sphereGeometry = new SphereGeometry(2, 32, 32);
        sphereMaterial = Physijs.createMaterial(new LambertMaterial({color: 0x00ff00}), 0.4, 0);
        sphere = new Physijs.SphereMesh(sphereGeometry, sphereMaterial, 1);
        sphere.position.set(0, 60, 10);
        sphere.receiveShadow = true;
        sphere.castShadow = true;
        sphere.name = "Sphere";
        scene.add(sphere);
        console.log("Added Sphere to Scene");
        */

       