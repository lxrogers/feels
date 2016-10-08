
var COLORS = [ 0xDA95ED, 0x95EDC9, 0xff4d4d, 0xffff80 ]

var Particle = function(color, reason, isIntro) {
	this._sprite = new THREE.Sprite( 
			new THREE.SpriteCanvasMaterial( 
				{ 
					color: COLORS[color], 
					opacity: .90,
					program: programFill 

				} ) 
		);
	this.reason = reason;
	this._sprite.particle = this;
	this.intro = isIntro;
	this.setRandomVelocity();
	this.setRandomScale();
	this.setRandomPosition();
	
	if (isIntro) {
		this._sprite.position.y = 300;
		this.introZOffset = 500;
		this.introZTarget = this._sprite.position.z;
		this._sprite.position.z = this.introZTarget + this.introZOffset;
	}
}

Particle.prototype.setRandomScale = function() {
	 this.setScale(Math.random() * 20 + 10);
}

Particle.prototype.setRandomPosition = function() {
	this._sprite.position.x = Math.random() * 1600 - 800;
	this._sprite.position.y = Math.random() * 800 - 400;
	this._sprite.position.z = Math.random() * 400 - 400;
}

Particle.prototype.setRandomVelocity = function() {
	this.xVel = Math.random() * .16 - .08;
	this.yVel = Math.random() * -.2 -.1;
	this.zVel = 0;
}

Particle.prototype.setPosition = function(x, y , z) {
	this._sprite.position.x = x;
	this._sprite.position.y = y;
	this._sprite.position.z = z;
}

Particle.prototype.setScale = function(scale) {
	this._sprite.scale.x = this._sprite.scale.y = scale;
}

Particle.prototype.introInterval = function() {
	this._sprite.position.z = this.introZTarget + this.introZOffset;
	this.introZOffset *= .9;
	if (this.introZOffset < 1) {
		this.intro = false;
	}
	
}

Particle.prototype.interval = function() {
	if (this.intro) {
		this.introInterval();
	}
	else {
		this._sprite.position.x += this.xVel;
		this._sprite.position.y += this.yVel;
		this._sprite.position.z += this.zVel;	
	}
}

Particle.prototype.setColor = function(color) {
	this._sprite.material.color.setHex(COLORS[parseInt(color)]);
}