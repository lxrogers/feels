var container, stats;
var scene, renderer;

var raycaster;
var mouse;

var PI2 = Math.PI * 2;

var particles = [];

var last_intersect;

var programFill = function ( context ) {
	if (Math.random() < .01) return;
	context.beginPath();
	context.arc( 0, 0, 0.5, 0, PI2, true );
	context.fill();
};

var screen_geo = new THREE.PlaneGeometry(10000, 10000);
var screen_mesh = new THREE.Mesh(screen_geo, new THREE.MeshBasicMaterial);

var screen_intersect;
var INTERSECTED;

init();
animate();


//-------------- INITIALIZATION FUNCTIONS --------------//
function init() {
	container = document.getElementById("container");

	myCamera = new Camera();
	scene = new THREE.Scene();

	myCamera._camera.lookAt( scene.position );

	initRenderer();
	
	raycaster = new THREE.Raycaster();
	mouse = new THREE.Vector2();
	initDocumentAndWindow();

	setInterval(interval, 20);
}

function initParticles(particle_data) {
	for ( var i = 0; i < particle_data.length; i ++ ) {
		var particle = new Particle(particle_data[i].color, particle_data[i].reason);
		scene.add(particle._sprite);
		particles.push(particle);
	}

	addMyParticle();
}

function initRenderer() {
	renderer = new THREE.CanvasRenderer();
	renderer.setClearColor( 0x000000 );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	container.appendChild( renderer.domElement );
}

function initDocumentAndWindow() {
	document.addEventListener( 'mousemove', visMouseMove, false );
	window.addEventListener( 'resize', onWindowResize, false );
}

//---------------- ADDING NEW PARTICLES --------------//
function addParticle(color, reason) {
	var newParticle = new Particle(color, reason, true);
	particles.push(newParticle);
	scene.add(newParticle._sprite);
}

//---------------- MY PARTICLE --------------------//
var MY_PARTICLE;
function addMyParticle() {
	console.log("new my particle")
	var myParticle = new Particle(0, "");
	myParticle.setPosition(0,0,500);
	myParticle.setScale(17);

	scene.add( myParticle._sprite );
	MY_PARTICLE = myParticle;
}

function submitMyParticle(text) {
	MY_PARTICLE.setRandomVelocity();
	MY_PARTICLE.reason = text;
	particles.push(MY_PARTICLE);
	
	setTimeout(
		function() {
			openFeel(MY_PARTICLE._sprite);
		}, 500
	)
}

//----------- INTERVAL FUNCTIONS ------------------//
function intervalParticles() {
	for (var i = 0; i < particles.length; i++) {
		var particle = particles[i];	
		particle.interval();
	}
}

function interval() {
	myCamera.interval();
	intervalParticles();
}

//---------- WINDOW & DOCUMENT CONTROLS --------------//
function onWindowResize() {
	myCamera.onWindowResize();

	placeMyParticle();
	scaleMyParticle();
	centerReasonText();

	renderer.setSize( window.innerWidth, window.innerHeight );
}

function visMouseMove( event ) {
	event.preventDefault();
	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
}

function openFeel(sprite) {
	myCamera.setTarget(sprite, showReasonText);

	var reason = sprite.particle.reason;
	hideReasonText(function() {
		changeReasonText(reason);
	});
}

function visMouseDown (e) {
	if (last_intersect) {
		openFeel(last_intersect)
	}
	else {
		hideReasonText();
		myCamera.zoomOut();
	}
}

// -------------------- ANIMATION -------------///
function animate() {
	requestAnimationFrame( animate );
	render();
}

function intersectParticles() {
	raycaster.setFromCamera( mouse, myCamera._camera );

	var intersects = raycaster.intersectObjects( scene.children );

	if ( intersects.length > 0 ) {
		if ( INTERSECTED != intersects[0].object ) {
			if ( INTERSECTED ) INTERSECTED.material.opacity = .9//INTERSECTED.material.program = programFill;

			INTERSECTED = intersects[0].object;
			INTERSECTED.material.opacity = 1;
			//INTERSECTED.material.program = programFill;
		}
	} else {
		if ( INTERSECTED ) INTERSECTED.material.opacity = .9//INTERSECTED.material.program = programFill;
		INTERSECTED = null;
	}

	last_intersect = INTERSECTED;
}

function render() {
	myCamera._camera.updateMatrixWorld();
	intersectParticles();
	renderer.render( scene, myCamera._camera );
}

// -------------------- UTILS ------------------//
function get3DPoint(leftPercent, topPercent) {
	var x = leftPercent * 2 - 1;
	var y = - topPercent * 2 + 1;
	var point = new THREE.Vector2(x, y);
	raycaster.setFromCamera(point, myCamera._camera);

	var screenIntersects = raycaster.intersectObject(screen_mesh, false);

	if (screenIntersects.length > 0) {
		screen_intersect = screenIntersects[0];
		return {'x': screen_intersect.point.x, 'y': screen_intersect.point.y}
	}
	else {
		console.log("doesn't intersect")
	}
}
