	
window.onload = function() {
	var canvas = document.getElementById("canvas");
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	var ctx = canvas.getContext("2d");
	requestAnimationFrame(render);
	var lastFrame = performance.now();
	
	var system = new ParticleSystem(ctx);
	
	function render() {
		var now = performance.now();
		var dt = now - lastFrame;
		ctx.clearRect(0,0,canvas.width,canvas.height);
		
		system.update();
		system.render();
		
		drawDebug(lastFrame, performance.now());
		lastFrame = performance.now();
		requestAnimationFrame(render);
	}
	
	function drawDebug(lastFrame, now) {
		var fps = 1000/(now-lastFrame);
		ctx.fillStyle = "#ccc";
		ctx.fillRect(0,0,100,20);
		ctx.globalAlpha = 1.0;
		ctx.font="16px Fixed";
		ctx.fillStyle = "#000";
		ctx.fillText(fps.toFixed(2) + " fps",5,15);
	}
	
	
};
