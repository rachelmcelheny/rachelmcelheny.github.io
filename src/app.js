if (__ENV__ === "development") {
	require("./templates-reload");
}

require("file?name=favicon.ico!./favicon.ico");
require("./style.scss");
