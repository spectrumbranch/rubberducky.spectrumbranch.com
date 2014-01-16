// MAIN

// FLAGS
var SHOW_AXES = false;
var SHOW_CONTROLS = true;


// standard global variables
var container, scene, camera, renderer, controls, stats;

var onRenderFcts = [];
	
//var keyboard = new THREEx.KeyboardState();
//var clock = new THREE.Clock();

var STEVE = {};
init();
animate();




function updateSteve() {
	if (STEVE) {
		if (!STEVE.FRAME) {
			STEVE.FRAME = 0;
			STEVE.period = 166;
			STEVE.rate = 0.01;
			//console.log('steve init')
		}
		//STEVE.theSteve = theSteve;
		//STEVE.steveGeometry = steveGeometry;
		//STEVE.steveMaterial = steveMaterial;
		if (STEVE.FRAME < 1*STEVE.period) {
			//console.log('_______1')
			//STEVE.theSteve.applyMatrix( new THREE.Matrix4().makeRotationY(-Math.PI / 2) );
			STEVE.theSteve.rotation.y -= STEVE.rate;
		} else if (STEVE.FRAME < 2*STEVE.period) {
			//console.log('_______2')
			//STEVE.theSteve.applyMatrix( new THREE.Matrix4().makeRotationY(+Math.PI / 2) );
			STEVE.theSteve.rotation.y += STEVE.rate;
		} else if (STEVE.FRAME < 3*STEVE.period) {
			//console.log('_______3')
			//STEVE.theSteve.applyMatrix( new THREE.Matrix4().makeRotationY(+Math.PI / 2) );
			STEVE.theSteve.rotation.y += STEVE.rate;
		} else if (STEVE.FRAME < 4*STEVE.period) {
			//console.log('_______4')
			//STEVE.theSteve.applyMatrix( new THREE.Matrix4().makeRotationY(-Math.PI / 2) );
			STEVE.theSteve.rotation.y -= STEVE.rate;
		} else if (STEVE.FRAME = 5*STEVE.period-1) {
			//console.log('_______5')
			STEVE.FRAME = 0;
		}
		
		STEVE.FRAME++;
	}
}

function createText() {
	// Font with textures applied:
	var chromeTexture = THREE.ImageUtils.loadTexture( 'images/concert_floor.png' );
	chromeTexture.wrapS = chromeTexture.wrapT = THREE.RepeatWrapping;
	chromeTexture.repeat.set( 0.5, 0.5 );
	var chromeMaterial = new THREE.MeshBasicMaterial( { map: chromeTexture } );
	
	var brickTexture = THREE.ImageUtils.loadTexture( 'images/concert_wall.png' );
	brickTexture.wrapS = brickTexture.wrapT = THREE.RepeatWrapping;
	brickTexture.repeat.set( 0.05, 0.05 );
	var brickMaterial = new THREE.MeshBasicMaterial( { map: brickTexture } );
	
	var materialArray = [ brickMaterial, chromeMaterial ];
	//1
	var textGeom = new THREE.TextGeometry( "Happy Birthday Steve!", 
	{
		size: 30, height: 4, curveSegments: 3,
		font: "helvetiker", weight: "bold", style: "normal",
		bevelThickness: 2, bevelSize: 1, bevelEnabled: true,
		material: 0, extrudeMaterial: 1
	});
	
	var textMaterial = new THREE.MeshFaceMaterial(materialArray);
	var textMesh = new THREE.Mesh(textGeom, textMaterial );
	
	textGeom.computeBoundingBox();
	var textWidth = textGeom.boundingBox.max.x - textGeom.boundingBox.min.x;
	
	textMesh.scale.set(2,2,2);
	textMesh.position.set( -0.5 * textWidth - 200, 300, 900 );
	textMesh.rotation.x = -Math.PI / 4;
	scene.add(textMesh);
	
	//2
	var secondTextGeom = new THREE.TextGeometry( "With love from Chris and Ash!!", 
	{
		size: 30, height: 4, curveSegments: 3,
		font: "helvetiker", weight: "bold", style: "normal",
		bevelThickness: 2, bevelSize: 1, bevelEnabled: true,
		material: 0, extrudeMaterial: 1
	});
	
	var secondTextMaterial = new THREE.MeshFaceMaterial(materialArray);
	var secondTextMesh = new THREE.Mesh(secondTextGeom, secondTextMaterial );
	
	secondTextGeom.computeBoundingBox();
	var secondTextWidth = secondTextGeom.boundingBox.max.x - secondTextGeom.boundingBox.min.x;
	
	secondTextMesh.scale.set(1,1,1);
	secondTextMesh.position.set( -0.5 * secondTextWidth , 300, 1000 );
	secondTextMesh.rotation.x = -Math.PI / 4;
	scene.add(secondTextMesh);
}

function createSpotLight(lightColor, posx,posy,posz, rotx, roty, rotz, lightLength, hasControls) {

	//set defaults
	var defaults = {
		lightColor: 'white',
		rotationX: -Math.PI / 2,
		rotationY: 0,
		rotationZ: 0,
		cylinderHeight: 20,
		hasControls: false
	};
	
	var color;
	if (!!lightColor) {
		color = lightColor;
	} else {
		color = defaults.lightColor;
	}
	
	var cylinderHeight;
	if (!!lightLength) {
		cylinderHeight = lightLength;
	} else {
		cylinderHeight = defaults.cylinderHeight;
	}
	
	var showControls;
	if (!!hasControls) {
		showControls = hasControls;
	} else {
		showControls = defaults.hasControls;
	}
	
	var rotationX;
	if (!!rotx) {
		rotationX = rotx;
	} else {
		rotationX = defaults.rotationX;
	}
	
	var rotationY;
	if (!!roty) {
		rotationY = roty;
	} else {
		rotationY = defaults.rotationY;
	}
	
	var rotationZ;
	if (!!rotz) {
		rotationZ = rotz;
	} else {
		rotationZ = defaults.rotationZ;
	}
	
	//////////////////////////////////////////////////////////////////////////////////
	//		add a volumetric spotlight					//
	//////////////////////////////////////////////////////////////////////////////////

	
	// add spot light
	var spotlightScale = 35;
	var geometry	= new THREE.CylinderGeometry( 0.1, 1.5, cylinderHeight, 32*2, 20, true);
	geometry.applyMatrix( new THREE.Matrix4().makeTranslation( 0, -geometry.height/2, 0 ) );
	
	
	if (rotationX !== 0) {
		geometry.applyMatrix( new THREE.Matrix4().makeRotationX(rotationX) );
	}
	if (rotationY !== 0) {
		geometry.applyMatrix( new THREE.Matrix4().makeRotationY(rotationY) );
	}
	if (rotationZ !== 0) {
		geometry.applyMatrix( new THREE.Matrix4().makeRotationZ(rotationZ) );
	}
	
	
	var material = new THREEx.VolumetricSpotLightMaterial()
	var mesh = new THREE.Mesh( geometry, material );
	mesh.position.set(posx,posy,posz)
	mesh.scale.set(spotlightScale,spotlightScale,spotlightScale);
	mesh.lookAt(new THREE.Vector3(0, 0, 0))
	material.uniforms.lightColor.value.set(color)
	material.uniforms.spotPosition.value = mesh.position	
	scene.add( mesh );

	
	
	//////////////////////////////////////////////////////////////////////////////////
	//		link it with a spotLight					//
	//////////////////////////////////////////////////////////////////////////////////
	
	var spotLight	= new THREE.SpotLight()
	spotLight.position	= mesh.position
	spotLight.color		= mesh.material.uniforms.lightColor.value
	spotLight.exponent	= 10
	spotLight.angle		= Math.PI/3;
	spotLight.intensity	= 1
	scene.add( spotLight )
	renderer.shadowMapEnabled	= true
	
	

	onRenderFcts.push(function() {
		//spotLight.position	= mesh.position;
		var target = new THREE.Vector3(mesh.position.x, 0, mesh.position.z);
		mesh.lookAt(target)
		spotLight.target.position.copy(target)
	});

	var light	= spotLight
	light.castShadow	= true
	light.shadowCameraNear	= 0.01
	light.shadowCameraFar	= 15
	light.shadowCameraFov	= 45

	light.shadowCameraLeft	= -8
	light.shadowCameraRight	=  8
	light.shadowCameraTop	=  8
	light.shadowCameraBottom= -8

	// light.shadowCameraVisible = true

	light.shadowBias	= 0.0
	light.shadowDarkness	= 0.5
	light.shadowMapWidth	= 1024
	light.shadowMapHeight	= 1024
	
	// create a small sphere to show position of light
	var lightbulb = new THREE.Mesh( 
		new THREE.SphereGeometry( 10, 16, 8 ), 
		new THREE.MeshBasicMaterial( { color: 0x000000 } )
	);
	scene.add( lightbulb );
	lightbulb.position = light.position;


	if (SHOW_CONTROLS && showControls) {
		// add a DAT.Gui for fine tuning
		new THREEx.addVolumetricSpotlightMaterial2DatGui(material);
	}
}

function createSkybox() {
	//Skybox
	var imagePrefix = "images/concert_";
	var directions  = ["wall", "wall", "floor", "floor", "wall", "wall"];
	var imageSuffix = ".png";
	var skyGeometry = new THREE.CubeGeometry( 1024, 1024, 2048 );	
	
	
	var wallMapHeight = THREE.ImageUtils.loadTexture( "images/concert_wall_bump.png" );
	wallMapHeight.anisotropy = 4;
	wallMapHeight.repeat.set( 0.998, 0.998 );
	wallMapHeight.offset.set( 0.001, 0.001 )
	wallMapHeight.wrapS = wallMapHeight.wrapT = THREE.RepeatWrapping;
	wallMapHeight.format = THREE.RGBFormat;

	var floorMapHeight = THREE.ImageUtils.loadTexture( "images/concert_floor_bump.png" );
	floorMapHeight.anisotropy = 4;
	floorMapHeight.repeat.set( 0.998, 0.998 );
	floorMapHeight.offset.set( 0.001, 0.001 )
	floorMapHeight.wrapS = floorMapHeight.wrapT = THREE.RepeatWrapping;
	floorMapHeight.format = THREE.RGBFormat;

	
	var materialArray = [];
	for (var i = 0; i < 6; i++) {
		if (directions[i] == 'wall') {
			materialArray.push( new THREE.MeshPhongMaterial({
				map: THREE.ImageUtils.loadTexture( imagePrefix + directions[i] + imageSuffix ),
				side: THREE.BackSide,
				specular: 0x333333,
				shininess: 25,
				bumpMap: wallMapHeight,
				bumpScale: 26,
				metal: false
			}));
		} else {
			materialArray.push( new THREE.MeshPhongMaterial({
				map: THREE.ImageUtils.loadTexture( imagePrefix + directions[i] + imageSuffix ),
				side: THREE.BackSide,
				specular: 0x333333,
				shininess: 50,
				bumpMap: floorMapHeight,
				bumpScale: 26,
				metal: true
			}));
		}
		
	}
	var skyMaterial = new THREE.MeshFaceMaterial( materialArray );

	//skybox
	var skyBox = new THREE.Mesh( skyGeometry, skyMaterial );
	skyBox.position.y = +510;
	scene.add( skyBox );
}

function createFloor() {
	// FLOOR
	var floorTexture = new THREE.ImageUtils.loadTexture( 'images/concert_floor.png' );
	floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping; 
	var floorMaterial = new THREE.MeshPhongMaterial( { map: floorTexture, side: THREE.DoubleSide } );
	var floorGeometry = new THREE.PlaneGeometry(1024, 2048, 10, 10);
	var floor = new THREE.Mesh(floorGeometry, floorMaterial);
	floor.position.y = -0.5;
	floor.rotation.x = Math.PI / 2;
	scene.add(floor);
}

function createAxes() {
	if (SHOW_AXES) {
		// axes
		var axes = new THREE.AxisHelper(100);
		scene.add( axes );
	}
}

function createSpheres() {

	// Spheres
	//   Note: a standard flat rectangular image will look distorted,
	//   a "spherical projection" image will look "normal".
	

	var sphereGeom =  new THREE.SphereGeometry( 40, 32, 16 ); 

	// basic moon
	var moonTexture = THREE.ImageUtils.loadTexture( 'images/checkerboard.jpg' );
	var moonMaterial = new THREE.MeshPhongMaterial( { map: moonTexture } );
	var moon = new THREE.Mesh( sphereGeom.clone(), moonMaterial );
	moon.position.set(-100, 50, 0);
	scene.add( moon );	
	
	// shaded moon -- side away from light picks up AmbientLight's color.
	var moonTexture = THREE.ImageUtils.loadTexture( 'images/checkerboard.jpg' );
	var moonMaterial = new THREE.MeshPhongMaterial( { map: moonTexture } );
	var moon = new THREE.Mesh( sphereGeom.clone(), moonMaterial );
	moon.position.set(0, 50, 0);
	scene.add( moon );		
	
	// colored moon
	var moonTexture = THREE.ImageUtils.loadTexture( 'images/checkerboard.jpg' );
	var moonMaterial = new THREE.MeshPhongMaterial( { map: moonTexture, color: 0xff8800, ambient: 0x0000ff } );
	var moon = new THREE.Mesh( sphereGeom.clone(), moonMaterial );
	moon.position.set(100, 50, 0);
	scene.add( moon );	
	
}

function createAmbientLight() {
	var light2 = new THREE.AmbientLight(0x333333);//(0x444444);
	scene.add(light2);
}

function createStats() {
	// STATS
	//stats = new Stats();
	//stats.domElement.style.position = 'absolute';
	//stats.domElement.style.bottom = '0px';
	//stats.domElement.style.zIndex = 100;
	//container.appendChild( stats.domElement );
}

function createCubes() {
	// Cubes
	//   Note: when using a single image, it will appear on each of the faces.
	//   Six different images (one per face) may be used if desired.
	
	
	
	
	//
	// THE STAGE
	//
	var materialArray = [];
	
	var imagePrefix = "images/concert_";
	var directions  = ["wall", "wall", "floor", "floor", "wall", "wall"];
	var imageSuffix = ".png";
	
	var wallMapHeight = THREE.ImageUtils.loadTexture( "images/concert_wall_bump.png" );
	wallMapHeight.anisotropy = 4;
	wallMapHeight.repeat.set( 0.998, 0.998 );
	wallMapHeight.offset.set( 0.001, 0.001 )
	wallMapHeight.wrapS = wallMapHeight.wrapT = THREE.RepeatWrapping;
	wallMapHeight.format = THREE.RGBFormat;

	var floorMapHeight = THREE.ImageUtils.loadTexture( "images/concert_floor_bump.png" );
	floorMapHeight.anisotropy = 4;
	floorMapHeight.repeat.set( 0.998, 0.998 );
	floorMapHeight.offset.set( 0.001, 0.001 )
	floorMapHeight.wrapS = floorMapHeight.wrapT = THREE.RepeatWrapping;
	floorMapHeight.format = THREE.RGBFormat;
	
	for (var i = 0; i < 6; i++) {
		if (directions[i] == 'wall') {
			materialArray.push( new THREE.MeshPhongMaterial({
				map: THREE.ImageUtils.loadTexture( imagePrefix + directions[i] + imageSuffix ),
				specular: 0x333333,
				shininess: 25,
				bumpMap: wallMapHeight,
				bumpScale: 26,
				metal: false
			}));
		} else {
			materialArray.push( new THREE.MeshPhongMaterial({
				map: THREE.ImageUtils.loadTexture( imagePrefix + directions[i] + imageSuffix ),
				specular: 0x333333,
				shininess: 50,
				bumpMap: floorMapHeight,
				bumpScale: 26,
				metal: true
			}));
		}
	}
	var stageMaterial = new THREE.MeshFaceMaterial(materialArray);
	
	var stageGeometry = new THREE.CubeGeometry( 1024, 200, 600, 1, 1, 1 );
	var theStage = new THREE.Mesh( stageGeometry, stageMaterial );
	theStage.position.set(0, 100, -718);
	scene.add( theStage );
	

	
	
	
	//
	// CRATES
	//
	
	var crateGeometry = new THREE.CubeGeometry(100, 100, 100);
	
	var crateTexture = new THREE.ImageUtils.loadTexture( 'images/crate.gif' );
	var crateMaterial = new THREE.MeshPhongMaterial({ map: crateTexture });
	
	for (var i = -4; i < 5; i++) {
		var crate = new THREE.Mesh(crateGeometry.clone(), crateMaterial);
		//magic numbers just for steve
		crate.position.set(112*i , 50, -360);
		scene.add( crate );
	}
	
	
	
	//
	// STEVE
	//
	
	var steveMaterialArray = [];
	
	var steveGeometry = new THREE.CubeGeometry(100, 100, 100);
	
	
	var steveImagePrefix = "images/steve-";
	var steveDirections  = ["1", "2", "", "", "3", ""];
	var steveImageSuffix = ".png";
	
	for (var i = 0; i < 6; i++) {
		if (steveDirections[i] == '') {
			steveMaterialArray.push( new THREE.MeshPhongMaterial({
				specular: 0x333333,
				shininess: 25,
				metal: false
			}));
		} else {
			steveMaterialArray.push( new THREE.MeshPhongMaterial({
				map: THREE.ImageUtils.loadTexture( steveImagePrefix + steveDirections[i] + steveImageSuffix ),
				specular: 0x333333,
				shininess: 24,
				metal: true //steve is always metal
			}));
		}
	}
	
	var steveMaterial = new THREE.MeshFaceMaterial(steveMaterialArray);

	var steveGeometry = new THREE.CubeGeometry( 400, 400, 400, 1, 1, 1 );
	var theSteve = new THREE.Mesh( steveGeometry, steveMaterial );
	theSteve.position.set(0, 500, -600);
	
	STEVE.theSteve = theSteve;
	STEVE.steveGeometry = steveGeometry;
	STEVE.steveMaterial = steveMaterial;
	scene.add( theSteve );
	
	
	
}

function createChibis() {
	var group = new THREE.Object3D();
	var imagePrefix = 'images/chibis/';
	var chibis = [
		{
			texture: 'steve-caitlyn.png',
			posx: 100,
			posy: 124,
			posz: 100,
			scalex: 256,
			scaley: 256,
			scalez: 1
		},
		{
			texture: 'steve-dean.png',
			posx: -100,
			posy: 124,
			posz: 200,
			scalex: 128,
			scaley: 256,
			scalez: 1
		},
		{
			texture: 'steve-finn.png',
			posx: -20,
			posy: 96,
			posz: 400,
			scalex: 256,
			scaley: 256,
			scalez: 1
		},
		{
			texture: 'steve-jake.png',
			posx: 120,
			posy: 64,
			posz: 400,
			scalex: 196,
			scaley: 196,
			scalez: 1
		},
		{
			texture: 'steve-lsp.png',
			posx: -240,
			posy: 96,
			posz: 280,
			scalex: 196,
			scaley: 196,
			scalez: 1
		},
		{
			texture: 'steve-marceline.png',
			posx: 360,
			posy: 96,
			posz: 560,
			scalex: 196,
			scaley: 196,
			scalez: 1
		},
		{
			texture: 'steve-sam.png',
			posx: -300,
			posy: 96,
			posz: 560,
			scalex: 98,
			scaley: 196,
			scalez: 1
		},
		{
			texture: 'malocopter.png',
			posx: 420,
			posy: 96,
			posz: 200,
			scalex: 127,
			scaley: 162,
			scalez: 1
		}
	];
	
	for (var i = 0; i < chibis.length; i++) {
		var exampleMap = THREE.ImageUtils.loadTexture(imagePrefix + chibis[i].texture);
		var exampleMaterial = new THREE.SpriteMaterial( { map: exampleMap, useScreenCoordinates: true, color: 0xffffff, fog: true } );
		var exampleSprite = new THREE.Sprite( exampleMaterial );
		exampleSprite.position.set(chibis[i].posx, chibis[i].posy, chibis[i].posz);
		exampleSprite.scale.set(chibis[i].scalex, chibis[i].scaley, chibis[i].scalez);
		
		group.add( exampleSprite );
	}
	
	
	
	
	
	scene.add( group );
}

function init() {
	// SCENE
	scene = new THREE.Scene();
	// CAMERA
	var SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;
	var VIEW_ANGLE = 45, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 0.3, FAR = 20000;
	camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);
	scene.add(camera);
	scene.fog = new THREE.FogExp2( 0x9999ff, 0.00025 );
	
	camera.position.set(0,560,560);
	//camera.position.set(0,600,200);
	
	camera.lookAt(scene.position)
	//camera.lookAt(0, 500, -600);
	
	// RENDERER
	if ( Detector.webgl ) {
		renderer = new THREE.WebGLRenderer( {antialias:true} );
	} else {
		renderer = new THREE.CanvasRenderer(); 
	}
	
	renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
	// must enable shadows on the renderer 
	renderer.shadowMapEnabled = true;
	container = document.getElementById( 'ThreeJS' );
	container.appendChild( renderer.domElement );
	// EVENTS
	THREEx.WindowResize(renderer, camera);
	THREEx.FullScreen.bindKey({ charCode : 'm'.charCodeAt(0) });
	// CONTROLS
	controls = new THREE.OrbitControls( camera, renderer.domElement );
	//hackers set zoom!
	for (var i=0; i < 23; i++) {
		controls.zoomIn();
	}
	
	createStats();
	
	createSpotLight('#b244e1',0,1000,-600, -Math.PI / 2, undefined,undefined,undefined, false);
	createSpotLight('#4c71eb',-400,1000,-600, -Math.PI * 2/3, undefined,undefined,undefined, false);
	createSpotLight('#4c71eb',400,1000,-600, -Math.PI * 1/3, undefined,undefined,undefined, false);
	//createSpotLight('white',200,200,200, -Math.PI / 2, undefined,undefined,undefined, true);
	
	//createSpotLight('white',-400,1000,700, -Math.PI / 2 - 50, Math.PI * 1/3,undefined,undefined, false);

	createFloor();

	
	createChibis();
	
	
	createAxes();
	
	createSkybox();
	
	//createSpheres();

	createAmbientLight();

	
	createCubes();
	
	createText()
}

function animate() {
    requestAnimationFrame( animate );
	render();		
	update();
}

function update() {
	//if ( keyboard.pressed("z") ) 
	//{ 
	//	// do something
	//}
	
	controls.update();
	updateSteve();
	//stats.update();

}

function render() {
	for (var fn in onRenderFcts) {
		onRenderFcts[fn]();
	}
	renderer.render( scene, camera );
}

//Thanks to this guy for the brick/floor textures: http://opengameart.org/content/new-england-textures-i