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
	
	initParticles();
	initNeighbourhood();
	initEventHandlers();

	function initParticles(){
		var idx=0;
		for (var y=0; y<yNum; y++) {
			var px = 20;
			for (var x=0; x<xNum; x++) {
				particles.push(new Particle(new Vec2(px, py), particleMass, idx++));
				px += jx;
			}
			py += jy;
		}
	}
	
	function initNeighbourhood() {
		for (var y=0; y<yNum; y++) {
			for (var x=0; x<xNum; x++) {
				var p  = getParticle(x, y);
				p.neighbours = getNeighbourhood(p, x, y);
			}
		}
	}
	
	function getParticle(x,y) {
		if (x<0 || y<0 || x>=xNum || y>=yNum) {
			return null;
		} else {
			return particles[y*xNum + x];
		}
	}
	
	function getNeighbourhood(p,x,y) {
		var dtmp = new Vec2(0,0);
		var ret = [];
		for (var xx=-2; xx<3; xx++) {
			for (var yy=-2; yy<3; yy++) {
				if (xx==0 && yy==0) continue; 
				var npart = getParticle(x+xx, y+yy);
				if (npart==null) continue;
				dtmp.set(npart.pos).sub(p.pos);
				ret.push({
					p: getParticle(x+xx, y+yy),
					expDist: dtmp.length()
				});
			}
		}
		return ret;
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
				var d = (n.expDist-dist) * dConst;
				p.force.add(tmp.normalize().scale(d));
				
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
		
	function initEventHandlers() {
		document.addEventListener('mousedown', function(e) {
			var mPos = new Vec2(e.offsetX, e.offsetY);
			dragStart(mPos);
		});
		
		document.addEventListener('touchstart', function(e) {
			var mPos = new Vec2(e.touches[0].clientX, e.touches[0].clientY);
			dragStart(mPos);
		});
		
		document.addEventListener('mouseup', dragStop);
		document.addEventListener('touchend', dragStop);
		
		document.addEventListener('mousemove', function(e){
			drag(e.offsetX, e.offsetY);
		});
		
		document.addEventListener('touchmove', function(e){
			drag(e.touches[0].clientX, e.touches[0].clientY);
		});
	}
	
	function dragStart(mPos) {
		selectedIdx = -1;
		var tmp = new Vec2(0, 0);
		for (var i=0; i<particles.length; i++) {
			if(tmp.set(mPos).sub(particles[i].pos).length()<15) {
				selectedIdx = i;
				console.log(particles[i]);
				break;
			}
		}
	}
	
	function dragStop(mPos) {
		selectedIdx = -1;
	}
	
	function drag(x,y) {
		if (selectedIdx<0) return;
		particles[selectedIdx].pos.x = x;
		particles[selectedIdx].pos.y = y;
	}
	
}
