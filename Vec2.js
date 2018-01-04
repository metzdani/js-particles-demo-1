function Vec2(x,y) {
	this.x = x;
	this.y = y;
}
Vec2.prototype.set = function(src) {
	this.x = src.x;
	this.y = src.y;
	return this;
}
Vec2.prototype.reset = function() {
	this.x = 0;
	this.y = 0;
}
Vec2.prototype.add = function(other) {
	this.x += other.x;
	this.y += other.y;
	return this;
};
Vec2.prototype.sub = function(other) {
	this.x -= other.x;
	this.y -= other.y;
	return this;
};
Vec2.prototype.scale = function(flt) {
	this.x *= flt;
	this.y *= flt;
	return this;
};
Vec2.prototype.normalize = function() {
	var l = 1.0/this.length();
	this.x *= l;
	this.y *= l;
	return this;
};
Vec2.prototype.length = function() {
	return Math.sqrt(this.x*this.x + this.y*this.y);
}
Vec2.prototype.rotate = function(around, angle) {
	var toOrigin = new Vec2(this.x-around.x, this.y-around.y);
	var sna = Math.sin(angle);
	var csa = Math.cos(angle);
	this.x = csa*toOrigin.x - sna*toOrigin.y + around.x;
	this.y = sna*toOrigin.x + csa*toOrigin.y + around.y;
	return this;
};
Vec2.prototype.toString = function() {
	return "Vec2("+this.x+","+this.y+")";
};