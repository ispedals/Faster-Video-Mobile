const Cc = Components.classes;
const Ci = Components.interfaces;
const Cu = Components.utils;

Cu.import("resource://gre/modules/Services.jsm");

function showToast(aWindow, message) { aWindow.NativeWindow.toast.show(message, "short"); }

var gNormalMenuId = null;
var gPlusOneMenuId = null;
var gPlusHalfMenuId = null;
var gMinusOneMenuId = null;
var gMinusHalfMenuId = null;


function loadIntoWindow(window) {
	if (!window)
		return;

	var aWindow = window;

	gNormalMenuId = window.NativeWindow.menu.add("1X", null, function() { 
		var document = aWindow.BrowserApp.selectedBrowser.contentWindow.document;		
		var iFrame=document.querySelector('iframe');
		var video =null;
		if(iFrame) {
		    video = iFrame.contentDocument.querySelector('video');
		}
		if(!video) {
		    video = document.querySelector('video');
		}
		if(video) {
		    video.playbackRate = 1.0;
			showToast(aWindow, video.playbackRate + "X");
		}
		else {
			showToast(aWindow, "No video element");
		}
	});
	gPlusOneMenuId = window.NativeWindow.menu.add("1+", null, function() { 
		var document = aWindow.BrowserApp.selectedBrowser.contentWindow.document;		
		var iFrame=document.querySelector('iframe');
		var video =null;
		if(iFrame) {
		    video = iFrame.contentDocument.querySelector('video');
		}
		if(!video) {
		    video = document.querySelector('video');
		}
		if(video) {
		    video.playbackRate += 1.0;
			showToast(aWindow, video.playbackRate + "X");
		}
		else {
			showToast(aWindow, "No video element");
		}
	});
	gPlusHalfMenuId = window.NativeWindow.menu.add("0.5+", null, function() { 
		var document = aWindow.BrowserApp.selectedBrowser.contentWindow.document;		
		var iFrame=document.querySelector('iframe');
		var video =null;
		if(iFrame) {
		    video = iFrame.contentDocument.querySelector('video');
		}
		if(!video) {
		    video = document.querySelector('video');
		}
		if(video) {
		    video.playbackRate += 0.5;
			showToast(aWindow, video.playbackRate + "X");
		}
		else {
			showToast(aWindow, "No video element");
		}
	});
	gMinusOneMenuId = window.NativeWindow.menu.add("1-", null, function() { 
		var document = aWindow.BrowserApp.selectedBrowser.contentWindow.document;		
		var iFrame=document.querySelector('iframe');
		var video =null;
		if(iFrame) {
		    video = iFrame.contentDocument.querySelector('video');
		}
		if(!video) {
		    video = document.querySelector('video');
		}
		if(video) {
		    video.playbackRate -= 1.0;
			showToast(aWindow, video.playbackRate + "X");
		}
		else {
			showToast(aWindow, "No video element");
		}
	});
	gMinusHalfMenuId = window.NativeWindow.menu.add("0.5-", null, function() { 
		var document = aWindow.BrowserApp.selectedBrowser.contentWindow.document;		
		var iFrame=document.querySelector('iframe');
		var video =null;
		if(iFrame) {
		    video = iFrame.contentDocument.querySelector('video');
		}
		if(!video) {
		    video = document.querySelector('video');
		}
		if(video) {
		    video.playbackRate -= 0.5;
			showToast(aWindow, video.playbackRate + "X");
		}
		else {
			showToast(aWindow, "No video element");
		}
	});
}

function unloadFromWindow(window) {
	if (!window)
		return;

	window.NativeWindow.menu.remove(gNormalMenuId);
	window.NativeWindow.menu.remove(gPlusHalfMenuId);
	window.NativeWindow.menu.remove(gMinusOneMenuId);
	window.NativeWindow.menu.remove(gMinusHalfMenuId);
}


/**
 * bootstrap.js API from developer.mozilla.org/en-US/docs/Extensions/Mobile/Initialization_and_Cleanup
 */
var windowListener = {
  onOpenWindow: function(aWindow) {
    // Wait for the window to finish loading
    let domWindow = aWindow.QueryInterface(Ci.nsIInterfaceRequestor).getInterface(Ci.nsIDOMWindowInternal || Ci.nsIDOMWindow);
    domWindow.addEventListener("load", function() {
      domWindow.removeEventListener("load", arguments.callee, false);
      loadIntoWindow(domWindow);
    }, false);
  },

  onCloseWindow: function(aWindow) {
  },

  onWindowTitleChange: function(aWindow, aTitle) {
  }
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

function install(aData, aReason) {
}

function uninstall(aData, aReason) {
}