$(document).ready(function () {
	/**
	 * Handle scrolling
	 **/
	var splash = $(".splash"), bg = 0;
	splash.css("background-image", "url(assets/bg/bg" + bg + ".jpg)");

	var splashInner = $(".splash .splash-inner");

	$(window).on("resize", function () {
		$(window).trigger("scroll");
	});
	$(window).on("scroll", function (e) {
		window.requestAnimationFrame(function () {
			var viewHeight = $(window).height(),
				scroll = $(window).scrollTop();
			var opacity = 1 - Math.min(1, (scroll - viewHeight * .125) / viewHeight * 2);
			splash.css("opacity", opacity);
			if(opacity <= 0) {
				splash.css("display", "none");
			} else {
				splash.css("display", "block");

				splashInner.css("top", -scroll * .5);
			}
		});
	}).trigger("scroll");
});

// https://gist.github.com/timhall/4078614
(function () {
	var lastTime = 0,
		vendors = ['ms', 'moz', 'webkit', 'o'],
		// Feature check for performance (high-resolution timers)
		hasPerformance = !!(window.performance && window.performance.now);

	for (var x = 0, max = vendors.length; x < max && !window.requestAnimationFrame; x += 1) {
		window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
		window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
	}

	if (!window.requestAnimationFrame) {
		window.requestAnimationFrame = function (callback, element) {
			var currTime = new Date().getTime();
			var timeToCall = Math.max(0, 16 - (currTime - lastTime));
			var id = window.setTimeout(function () {
					callback(currTime + timeToCall);
				},
				timeToCall);
			lastTime = currTime + timeToCall;
			return id;
		};
	}

	if (!window.cancelAnimationFrame) {
		window.cancelAnimationFrame = function (id) {
			clearTimeout(id);
		};
	}

	// Add new wrapper for browsers that don't have performance
	if (!hasPerformance) {
		// Store reference to existing rAF and initial startTime
		var rAF = window.requestAnimationFrame,
			startTime = +new Date;

		// Override window rAF to include wrapped callback
		window.requestAnimationFrame = function (callback, element) {
			// Wrap the given callback to pass in performance timestamp
			var wrapped = function (timestamp) {
				// Get performance-style timestamp
				var performanceTimestamp = (timestamp < 1e12) ? timestamp : timestamp - startTime;

				return callback(performanceTimestamp);
			};

			// Call original rAF with wrapped callback
			rAF(wrapped, element);
		}
	}
})();