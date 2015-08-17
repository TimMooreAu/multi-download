(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.multiDownload = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

function fallback(urls) {
	var i = 0;

	(function createIframe() {
		var frame = document.createElement('iframe');
		frame.style.display = 'none';
		frame.src = urls[i++];
		document.documentElement.appendChild(frame);

		// the download init has to be sequential otherwise IE only use the first
		var interval = setInterval(function () {
			if (frame.contentWindow.document.readyState === 'complete') {
				clearInterval(interval);

				// Safari needs a timeout
				setTimeout(function () {
					frame.parentNode.removeChild(frame);
				}, 1000);

				if (i < urls.length) {
					createIframe();
				}
			}
		}, 100);
	})();
}

function isFirefox() {
	// sad panda :(
	return /Firefox\//i.test(navigator.userAgent);
}

function isAndroidBrowser() {
	var ua = navigator.userAgent;
	return ((ua.indexOf('Mozilla/5.0') > -1 && ua.indexOf('Android ') > -1 && ua.indexOf('AppleWebKit') > -1) && (ua.indexOf('Version') > -1));
}

function sameDomain(url) {
	var a = document.createElement('a');
	a.href = url;

	return location.hostname === a.hostname && location.protocol === a.protocol;
}

function download(url) {
	var a = document.createElement('a');
	a.download = '';
	a.href = url;
	// firefox doesn't support `a.click()`...
	fullClickEvent(a);
}

// DOM 2 Events
var dispatchMouseEvent = function(target, var_args) {
	var e = document.createEvent("MouseEvents");
	// If you need clientX, clientY, etc., you can call
	// initMouseEvent instead of initEvent
	e.initEvent.apply(e, Array.prototype.slice.call(arguments, 1));
	target.dispatchEvent(e);
};

function fullClickEvent(element) {
	dispatchMouseEvent(element, 'mouseover', true, true);
	dispatchMouseEvent(element, 'mousedown', true, true);
	dispatchMouseEvent(element, 'click', true, true);
	dispatchMouseEvent(element, 'mouseup', true, true);
}

module.exports = function (urls) {
	if (!urls) {
		throw new Error('`urls` required');
	}

	if ((typeof document.createElement('a').download === 'undefined') && !isAndroidBrowser()){
		return fallback(urls);
	}

	var delay = 0;

	urls.forEach(function (url) {
		// the download init has to be sequential for firefox if the urls are not on the same domain,
		// or for the android browser
		if ((isFirefox() && !sameDomain(url)) || isAndroidBrowser()) {
			return setTimeout(download.bind(null, url), 100 * ++delay);
		}

		download(url);
	});
}

},{}]},{},[1])(1)
});