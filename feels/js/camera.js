// SUPER CAMERA CLASS

var EXPO_FACTOR = .85;
var ZOOM_DISTANCE = 250;

var Camera = function() {
	this._camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 10000 );
	this._camera.position.set( 0, 0, ZOOM_DISTANCE );

	this._lock = false;
	this._xVel = 0;
	this._yVel = 0;
	this._zVel = 0;

}

Camera.prototype.setTarget = function(target, callback) {
	this._lock = false;
	this._targetRef = target;
	this._animating = true;
	this._animationFinishedCallback = callback;
}

Camera.prototype.stopIfFinished = function() {
	if (Math.abs(this._camera.position.x - this._targetRef.position.x) < 2 &&
			Math.abs(this._camera.position.y - this._targetRef.position.y) < 2 &&
			Math.abs(this._camera.position.z - this._targetRef.position.z - ZOOM_DISTANCE) < 2) { // this part is broken
				this._animating = false;
				this._lock = true;
				if (this._animationFinishedCallback) {
					this._animationFinishedCallback()
				};
		}
}

Camera.prototype.zoomOriginal = function(callback) {
	this.setTarget(
			{
				position : {
					x : 0,
					y : 0,
					z : 0,
			 	}
			}, callback
		);
}

Camera.prototype.zoomOut = function() {
	this.setTarget(
			{
				position : {
					x : this._camera.position.x,
					y : this._camera.position.y,
					z : this._camera.position.z,
			 	}, 
				zoomOut : true
			}
		);
}

Camera.prototype.onWindowResize = function() {
	this._camera.aspect = window.innerWidth / window.innerHeight;
	this._camera.updateProjectionMatrix();
}

Camera.prototype.scroll = function(delta) {
	this._lock = false;
	this._yVel = delta * .5;
}

Camera.prototype.interval = function() {
	if (this._animating) {
		this._camera.position.x = EXPO_FACTOR * this._camera.position.x + (1 - EXPO_FACTOR) * this._targetRef.position.x;
		this._camera.position.y = EXPO_FACTOR * this._camera.position.y + (1 - EXPO_FACTOR) * this._targetRef.position.y;
		this._camera.position.z = EXPO_FACTOR * this._camera.position.z + (1 - EXPO_FACTOR) * (this._targetRef.position.z + ZOOM_DISTANCE);
		this.stopIfFinished();
	}
	else if (this._lock) {
		this._camera.position.x = this._targetRef.position.x;
		this._camera.position.y = this._targetRef.position.y;
		this._camera.position.z = this._targetRef.position.z + ZOOM_DISTANCE;
	}
	else {
		this._camera.position.x += this._xVel;
		this._camera.position.y += this._yVel;
		this._camera.position.z += this._zVel;
	}

	this._xVel *= .95;
	this._yVel *= .95;
	this._zVel *= .95;
}

