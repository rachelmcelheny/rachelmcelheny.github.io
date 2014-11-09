var gulp = require("gulp"),
	gutil = require("gulp-util"),
	plumber = require("gulp-plumber"),
	fileInclude = require("gulp-file-include"),
	uglify = require("gulp-uglify"),
	less = require("gulp-less"),
	minifyCss = require("gulp-minify-css"),
	watch = require("gulp-watch"),
	livereload = require("gulp-livereload"),
	connect = require("connect"),
	static = require("serve-static"),
	spawn = require("child_process").spawn;

gulp.task("default", ["partials", "uglify", "less"]);

gulp.task("watch", ["default"], function () {
	watch("partials/**/*.html", {
		name: "PARTIALS"
	}, function () {
		gulp.start("partials");
	});

	watch("app/**/*", {
		name: "UGLIFY"
	}, function () {
		gulp.start("uglify");
	});

	watch("less/**/*.less", {
		name: "LESS"
	}, function () {
		gulp.start("less");
	});

	gulp.start("livereload-spawn");
});

gulp.task("partials", function () {
	return gulp.src("partials/index.html")
		.pipe(plumber(errorHandler))
		.pipe(fileInclude())
		.pipe(gulp.dest("./"));
});
gulp.task("uglify", function () {
	return gulp.src("app/**/*.js")
		.pipe(plumber(errorHandler))
		.pipe(uglify())
		.pipe(gulp.dest("js/app"));
});
gulp.task("less", function () {
	return gulp.src("less/styles.less")
		.pipe(plumber(errorHandler))
		.pipe(less())
		// .pipe(minifyCss())
		.pipe(gulp.dest("css"));
});

gulp.task("server", function (next) {
	var server = connect();
	server.use(static(".")).listen(process.env.PORT || 80, next);
});

gulp.task("livereload", ["server"], function () {
	var server = livereload();
	server.changed();
	watch([
		"js/**/*",
		"css/**/*",
		"assets/**/*",
		"index.html"
	], {
		name: "LIVERELOAD"
	}, function (file) {
		server.changed(file.path);
	});
});

gulp.task("livereload-spawn", function () {
	var gulpCmd = (process.platform === "win32" ? "gulp.cmd" : "gulp");
	spawn(gulpCmd, ["livereload", "--notify"], {
		cwd: process.cwd(),
		stdio: "inherit"
	}).on("error", function () {
		gulp.start("live-reload-spawn");
	});
});

var errorHandler = function (e) {
	var plugin, message, log = [];

	if (!(e instanceof gutil.PluginError) && !e.plugin) {
		plugin = "JavaScript Error";
	} else {
		plugin = e.plugin || "Unknown Package";
	}
	message = e.message + (e.showStack !== false ? "\n" + e.stack : "");

	log.push("\n===");
	log.push(plugin + "\n" + message);
	log.push("===\n");

	// Notify the user
	gutil.beep();
	console.log(log.join("\n"));

	if (this.emit) {
		this.emit("end");
	}
	gulp.stop(message);
}