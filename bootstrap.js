const Cc = Components.classes;
const Ci = Components.interfaces;
const Cu = Components.utils;

Cu.import("resource://gre/modules/Services.jsm");

function showToast(aWindow, message) {
	aWindow.NativeWindow.toast.show(message, "short");
}

var parentID = null;
var maxID = null;

function loadIntoWindow(window) {
	if (!window)
		return;

	var getPlayingVideos = function (document) {
		var videos = Array.prototype.slice.call(document.getElementsByTagName('video'));

		var iFrames = document.getElementsByTagName('iframe');
		if (iFrames.length > 0) {
			for (var i = 0; i < iFrames.length; i++) {
				videos.concat(Array.prototype.slice.call(iFrame.contentDocument.getElementsByTagName('video')));
			}
		}
		return videos.filter(function (video) {
			return !video.paused;
		});
	};


	var aWindow = window;

	parentID = window.NativeWindow.menu.add({
		name: "Video Speed",
		icon: null
	});

	window.NativeWindow.menu.add({
		name: "Max",
		icon: null,
		callback: function () {
			var document = aWindow.BrowserApp.selectedBrowser.contentWindow.document;
			var videos = getPlayingVideos(document);
			if (videos.length === 0) {
				showToast(aWindow, "No playing video");
				return;
			}
			if (videos.length > 1) {
				showToast(aWindow, "More than one playing video");
				return;
			}
			videos[0].playbackRate = 5.0; //seems to be max
			showToast(aWindow, videos[0].playbackRate + "X");
		},
		parent: parentID
	});

	window.NativeWindow.menu.add({
		name: "1+",
		icon: null,
		callback: function () {
			var document = aWindow.BrowserApp.selectedBrowser.contentWindow.document;
			var videos = getPlayingVideos(document);
			if (videos.length === 0) {
				showToast(aWindow, "No playing video");
				return;
			}
			if (videos.length > 1) {
				showToast(aWindow, "More than one playing video");
				return;
			}
			videos[0].playbackRate += 1.0;
			showToast(aWindow, videos[0].playbackRate + "X");
		},
		parent: parentID
	});

	window.NativeWindow.menu.add({
		name: "0.25+",
		icon: null,
		callback: function () {
			var document = aWindow.BrowserApp.selectedBrowser.contentWindow.document;
			var videos = getPlayingVideos(document);
			if (videos.length === 0) {
				showToast(aWindow, "No playing video");
				return;
			}
			if (videos.length > 1) {
				showToast(aWindow, "More than one playing video");
				return;
			}
			videos[0].playbackRate += 0.25;
			showToast(aWindow, videos[0].playbackRate + "X");
		},
		parent: parentID
	});

	window.NativeWindow.menu.add({
		name: "1X",
		icon: null,
		callback: function () {
			var document = aWindow.BrowserApp.selectedBrowser.contentWindow.document;
			var videos = getPlayingVideos(document);
			if (videos.length === 0) {
				showToast(aWindow, "No playing video");
				return;
			}
			if (videos.length > 1) {
				showToast(aWindow, "More than one playing video");
				return;
			}
			videos[0].playbackRate = 1.0;
			showToast(aWindow, videos[0].playbackRate + "X");
		},
		parent: parentID
	});

	window.NativeWindow.menu.add({
		name: "0.25-",
		icon: null,
		callback: function () {
			var document = aWindow.BrowserApp.selectedBrowser.contentWindow.document;
			var videos = getPlayingVideos(document);
			if (videos.length === 0) {
				showToast(aWindow, "No playing video");
				return;
			}
			if (videos.length > 1) {
				showToast(aWindow, "More than one playing video");
				return;
			}
			videos[0].playbackRate -= 0.25;
			showToast(aWindow, videos[0].playbackRate + "X");
		},
		parent: parentID
	});

	window.NativeWindow.menu.add({
		name: "1-",
		icon: null,
		callback: function () {
			var document = aWindow.BrowserApp.selectedBrowser.contentWindow.document;
			var videos = getPlayingVideos(document);
			if (videos.length === 0) {
				showToast(aWindow, "No playing video");
				return;
			}
			if (videos.length > 1) {
				showToast(aWindow, "More than one playing video");
				return;
			}
			videos[0].playbackRate -= 1.0;
			showToast(aWindow, videos[0].playbackRate + "X");
		},
		parent: parentID
	});

}

function unloadFromWindow(window) {
	if (!window)
		return;

	window.NativeWindow.menu.remove(parentID);
}


/**
 * bootstrap.js API from developer.mozilla.org/en-US/docs/Extensions/Mobile/Initialization_and_Cleanup
 */
var windowListener = {
	onOpenWindow: function (aWindow) {
		// Wait for the window to finish loading
		let domWindow = aWindow.QueryInterface(Ci.nsIInterfaceRequestor).getInterface(Ci.nsIDOMWindowInternal || Ci
			.nsIDOMWindow);
		domWindow.addEventListener("load", function () {
			domWindow.removeEventListener("load", arguments.callee, false);
			loadIntoWindow(domWindow);
		}, false);
	},

	onCloseWindow: function (aWindow) {},

	onWindowTitleChange: function (aWindow, aTitle) {}
};

function startup(aData, aReason) {
	// Load into any existing windows
	let windows = Services.wm.getEnumerator("navigator:browser");
	while (windows.hasMoreElements()) {
		let domWindow = windows.getNext().QueryInterface(Ci.nsIDOMWindow);
		loadIntoWindow(domWindow);
	}

	// Load into any new windows
	Services.wm.addListener(windowListener);
}

function shutdown(aData, aReason) {
	// Stop listening for new windows
	Services.wm.removeListener(windowListener);

	// Unload from any existing windows
	let windows = Services.wm.getEnumerator("navigator:browser");
	while (windows.hasMoreElements()) {
		let domWindow = windows.getNext().QueryInterface(Ci.nsIDOMWindow);
		unloadFromWindow(domWindow);
	}
}

function install(aData, aReason) {}

function uninstall(aData, aReason) {}
