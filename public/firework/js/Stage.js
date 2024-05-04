/*
此源码是基于 XgpNwb 的二次修改
Github：https://github.com/NianBroken/Firework_Simulator
Gitee：https://gitee.com/nianbroken/Firework_Simulator
*/
const Ticker = (function TickerFactory(window) {
	"use strict";

	const Ticker = {};

	// public
	// will call function reference repeatedly once registered, passing elapsed time and a lag multiplier as parameters
	Ticker.addListener = function addListener(callback) {
		if (typeof callback !== "function") throw "Ticker.addListener() requires a function reference passed for a callback.";

		listeners.push(callback);

		// start frame-loop lazily
		if (!started) {
			started = true;
			queueFrame();
		}
	};

	// private
	let started = false;
	let lastTimestamp = 0;
	let listeners = [];

	// queue up a new frame (calls frameHandler)
	function queueFrame() {
		if (window.requestAnimationFrame) {
			requestAnimationFrame(frameHandler);
		} else {
			webkitRequestAnimationFrame(frameHandler);
		}
	}

	function frameHandler(timestamp) {
		let frameTime = timestamp - lastTimestamp;
		lastTimestamp = timestamp;
		// make sure negative time isn't reported (first frame can be whacky)
		if (frameTime < 0) {
			frameTime = 17;
		}
		// - cap minimum framerate to 15fps[~68ms] (assuming 60fps[~17ms] as 'normal')
		else if (frameTime > 68) {
			frameTime = 68;
		}

		// fire custom listeners
		listeners.forEach((listener) => listener.call(window, frameTime, frameTime / 16.6667));

		// always queue another frame
		queueFrame();
	}

	return Ticker;
})(window);

const Stage = (function StageFactory(window, document, Ticker) {
	"use strict";

	// Track touch times to prevent redundant mouse events.
	let lastTouchTimestamp = 0;

	// Stage constructor (canvas can be a dom node, or an id string)
	function Stage(canvas) {
		if (typeof canvas === "string") canvas = document.getElementById(canvas);

		// canvas and associated context references
		this.canvas = canvas;
		this.ctx = canvas.getContext("2d");

		// Prevent gestures on stages (scrolling, zooming, etc)
		this.canvas.style.touchAction = "none";

		// physics speed multiplier: allows slowing down or speeding up simulation (must be manually implemented in physics layer)
		this.speed = 1;

		// devicePixelRatio alias (should only be used for rendering, physics shouldn't care)
		// avoids rendering unnecessary pixels that browser might handle natively via CanvasRenderingContext2D.backingStorePixelRatio
		// Language translation of this project into Chinese by Nianbroken
		this.dpr = Stage.disableHighDPI ? 1 : (window.devicePixelRatio || 1) / (this.ctx.backingStorePixelRatio || 1);

		// canvas size in DIPs and natural pixels
		this.width = canvas.width;
		this.height = canvas.height;
		this.naturalWidth = this.width * this.dpr;
		this.naturalHeight = this.height * this.dpr;

		// size canvas to match natural size
		if (this.width !== this.naturalWidth) {
			this.canvas.width = this.naturalWidth;
			this.canvas.height = this.naturalHeight;
			this.canvas.style.width = this.width + "px";
			this.canvas.style.height = this.height + "px";
		}

		// To any known illigitimate users...
		// const badDomains = ['bla'+'ckdiam'+'ondfirew'+'orks'+'.de'];
		// const hostname = document.location.hostname;
		// if (badDomains.some(d => hostname.includes(d))) {
		// 	const delay = 60000 * 3; // 3 minutes
		// 	// setTimeout(() => {
		// 	// 	const html = `<style>\n\t\t\t\t\t\tbody { background-color: #000; padding: 20px; text-align: center; color: #ddd; min-height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center; overflow: visible; }\n\t\t\t\t\t\th1 { font-size: 1.2em;}\n\t\t\t\t\t\tp { margin-top: 1em; max-width: 36em; }\n\t\t\t\t\t\ta { color: #fff; text-decoration: underline; }\n\t\t\t\t\t</style>\n\t\t\t\t\t<h1>Hi! Sorry to interrupt the fireworks.</h1>\n\t\t\t\t\t<p>My name is Caleb. Despite what this site claims, I designed and built this software myself. I've spent a couple hundred hours of my own time, over two years, making it.</p>\n\t\t\t\t\t<p>The owner of this site clearly doesn't respect my work, and has labeled it as their own.</p>\n\t\t\t\t\t<p>If you were enjoying the show, please check out <a href="https://codepen.io/MillerTime/full/XgpNwb">my&nbsp;official&nbsp;version&nbsp;here</a>!</p>\n\t\t\t\t\t<p>If you're the owner, <a href="mailto:calebdotmiller@gmail.com">contact me</a>.</p>`;
		// 	// 	document.body.innerHTML = html;
		// 	// }, delay);
		// }

		Stage.stages.push(this);

		// event listeners (note that 'ticker' is also an option, for frame events)
		this._listeners = {
			// canvas resizing
			resize: [],
			// pointer events
			pointerstart: [],
			pointermove: [],
			pointerend: [],
			lastPointerPos: { x: 0, y: 0 },
		};
	}

	// track all Stage instances
	Stage.stages = [];

	// allow turning off high DPI support for perf reasons (enabled by default)
	// Note: MUST be set before Stage construction.
	// Each stage tracks its own DPI (initialized at construction time), so you can effectively allow some Stages to render high-res graphics but not others.
	// Language translation of this project into Chinese by Nianbroken
	Stage.disableHighDPI = false;

	// events
	Stage.prototype.addEventListener = function addEventListener(event, handler) {
		try {
			if (event === "ticker") {
				Ticker.addListener(handler);
			} else {
				this._listeners[event].push(handler);
			}
		} catch (e) {
			throw "Invalid Event";
		}
	};

	Stage.prototype.dispatchEvent = function dispatchEvent(event, val) {
		const listeners = this._listeners[event];
		if (listeners) {
			listeners.forEach((listener) => listener.call(this, val));
		} else {
			throw "Invalid Event";
		}
	};

	// resize canvas
	Stage.prototype.resize = function resize(w, h) {
		this.width = w;
		this.height = h;
		this.naturalWidth = w * this.dpr;
		this.naturalHeight = h * this.dpr;
		this.canvas.width = this.naturalWidth;
		this.canvas.height = this.naturalHeight;
		this.canvas.style.width = w + "px";
		this.canvas.style.height = h + "px";

		this.dispatchEvent("resize");
	};

	// utility function for coordinate space conversion
	Stage.windowToCanvas = function windowToCanvas(canvas, x, y) {
		const bbox = canvas.getBoundingClientRect();
		return {
			x: (x - bbox.left) * (canvas.width / bbox.width),
			y: (y - bbox.top) * (canvas.height / bbox.height),
		};
	};
	// handle interaction
	Stage.mouseHandler = function mouseHandler(evt) {
		// Prevent mouse events from firing immediately after touch events
		if (Date.now() - lastTouchTimestamp < 500) {
			return;
		}

		let type = "start";
		if (evt.type === "mousemove") {
			type = "move";
		} else if (evt.type === "mouseup") {
			type = "end";
		}

		Stage.stages.forEach((stage) => {
			const pos = Stage.windowToCanvas(stage.canvas, evt.clientX, evt.clientY);
			stage.pointerEvent(type, pos.x / stage.dpr, pos.y / stage.dpr);
		});
	};
	Stage.touchHandler = function touchHandler(evt) {
		lastTouchTimestamp = Date.now();

		// Set generic event type
		let type = "start";
		if (evt.type === "touchmove") {
			type = "move";
		} else if (evt.type === "touchend") {
			type = "end";
		}

		// Dispatch "pointer events" for all changed touches across all stages.
		Stage.stages.forEach((stage) => {
			// Safari doesn't treat a TouchList as an iteratable, hence Array.from()
			for (let touch of Array.from(evt.changedTouches)) {
				let pos;
				if (type !== "end") {
					pos = Stage.windowToCanvas(stage.canvas, touch.clientX, touch.clientY);
					stage._listeners.lastPointerPos = pos;
					// before touchstart event, fire a move event to better emulate cursor events
					// Language translation of this project into Chinese by Nianbroken
					if (type === "start") stage.pointerEvent("move", pos.x / stage.dpr, pos.y / stage.dpr);
				} else {
					// on touchend, fill in position information based on last known touch location
					pos = stage._listeners.lastPointerPos;
				}
				stage.pointerEvent(type, pos.x / stage.dpr, pos.y / stage.dpr);
			}
		});
	};

	// dispatch a normalized pointer event on a specific stage
	Stage.prototype.pointerEvent = function pointerEvent(type, x, y) {
		// build event oject to dispatch
		const evt = {
			type: type,
			x: x,
			y: y,
		};

		// whether pointer event was dispatched over canvas element
		evt.onCanvas = x >= 0 && x <= this.width && y >= 0 && y <= this.height;

		// dispatch
		this.dispatchEvent("pointer" + type, evt);
	};

	document.addEventListener("mousedown", Stage.mouseHandler);
	document.addEventListener("mousemove", Stage.mouseHandler);
	document.addEventListener("mouseup", Stage.mouseHandler);
	document.addEventListener("touchstart", Stage.touchHandler);
	document.addEventListener("touchmove", Stage.touchHandler);
	document.addEventListener("touchend", Stage.touchHandler);

	return Stage;
})(window, document, Ticker);

