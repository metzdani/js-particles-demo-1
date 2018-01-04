/**
 * 
 */
function Particle(pos, mass, index) {
	this.pos = pos;
	this.vel = new Vec2(0,0);
	this.force = new Vec2(0,0);
	this.mass = mass;
	this.neighbours = [];
	this.index = index;
}
function ParticleSystem(ctx) {
	
	var selectedIdx = -1;
	
	var particles = [];
	var dConst = 0.005;
	var easing = 0.9;
	var particleMass = 0.05;
	
	var xNum = 12;
	var yNum = 12;
	
	var width = ctx.canvas.width;
	var height = ctx.canvas.height;
	console.log(""+width+"x"+height);
	
	var jx = 0.5*width/xNum;
	var jy = 0.5*height/yNum;
	
	var py = 20;
	
	var idx=0;
	for (var y=0; y<yNum; y++) {
		var px = 20;
		for (var x=0; x<xNum; x++) {
			particles.push(new Particle(new Vec2(px, py), particleMass, idx++));
			px += jx;
		}
		py += jy;
	}
	
	function getParticle(x,y) {
		if (x<0 || y<0 || x>=xNum || y>=yNum) {
			return null;
		} else {
			return particles[y*xNum + x];
		}
	}
	
	var dtmp = new Vec2(0,0);
	for (var y=0; y<yNum; y++) {
		for (var x=0; x<xNum; x++) {
			var p  = getParticle(x, y);
			for (var xx=-2; xx<3; xx++) {
				for (var yy=-2; yy<3; yy++) {
					if (xx!=0 || yy!=0) {
						var npart = getParticle(x+xx, y+yy);
						if (npart!=null){
							dtmp.set(npart.pos).sub(p.pos);
							p.neighbours.push({
								p: getParticle(x+xx, y+yy),
								expDist: dtmp.length()
							});
						}
					}
				}
			}
		}
	}
	
	
	this.update = function(dt) {
		var tmp = new Vec2(0,0);
		for (var i=0; i<particles.length; i++) {
			if (i===selectedIdx) continue;
			var p = particles[i];
			var pp = p.pos;
			p.force.reset();
			for (var nn=0; nn<p.neighbours.length; nn++) {
				tmp.set(pp);
				var n = p.neighbours[nn];
				var np = n.p.pos;
				tmp.sub(np);
				var dist = tmp.length();
				var d = (dist-n.expDist) * dConst;
				p.force.sub(tmp.normalize().scale(d));
				
			}
			p.vel.add(p.force.scale(1/p.mass)).scale(easing);
		}
		
		if (selectedIdx>-1) {
			particles[selectedIdx].vel.x = 0;
			particles[selectedIdx].vel.y = 0;
		}
			
		for (var i=0; i<particles.length; i++) {
			var p = particles[i];
			p.pos.add(p.vel);
		}
	};
	
	this.render = function() {
		ctx.fillStyle = "#fff";
		ctx.strokeStyle = "#aaa";
		ctx.lineWidth = 0.5;
		for (var i=0; i<particles.length; i++) {
			drawParticle(particles[i]);
		}
		if (selectedIdx > -1) {
			ctx.fillStyle = "#257";
			for (var i=0; i<particles[selectedIdx].neighbours.length; i++) {
				drawParticle(particles[selectedIdx].neighbours[i].p);
			}
			ctx.fillStyle = "#12f";
			drawParticle(particles[selectedIdx]);
		}
		
	};
	
	function drawParticle(p) {
		var pos = p.pos;
		var rad = 5.0;
		if (!pos) return;
		var ns = p.neighbours;
		for (var j=0; j<ns.length; j++) {
			if (ns[j].p.index > p.index) {
				ctx.moveTo(pos.x, pos.y);
				ctx.lineTo(ns[j].p.pos.x, ns[j].p.pos.y, 0.1);
			}
		}
		ctx.stroke();
		
		ctx.beginPath();
		ctx.arc(pos.x, pos.y, rad, 0, 2*Math.PI);
		ctx.fill();
	}
	
	
	document.onmousedown = function(e) {
		selectedIdx = -1;
		var mPos = new Vec2(e.offsetX, e.offsetY);
		var tmp = new Vec2(0, 0);
		for (var i=0; i<particles.length; i++) {
			if(tmp.set(mPos).sub(particles[i].pos).length()<15) {
				selectedIdx = i;
				console.log(particles[i]);
				break;
			}
		}
	}
	
	document.onmouseup = function(e) {
		selectedIdx = -1;
	}
	
	document.onmousemove = function(e) {
		if (selectedIdx<0) return;
		particles[selectedIdx].pos.x = e.offsetX;
		particles[selectedIdx].pos.y = e.offsetY;
	}
	
}
