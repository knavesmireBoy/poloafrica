/*jslint browser: true*/
/*global window: false */
/*global poloAF: false */
if (!window.poloAF) {
	window.poloAF = {};
}
window.poloAF.SimpleXhrFactory = (function () {
    "use strict";
	// The three branches.
	var standard = {
			createXhrObject: function () {
				return new window.XMLHttpRequest();
			}
		},
		activeXNew = {
			createXhrObject: function () {
				return new window.ActiveXObject('Msxml2.XMLHTTP');
			}
		},
		activeXOld = {
			createXhrObject: function () {
				return new window.ActiveXObject('Microsoft.XMLHTTP');
			}
		},
		// To assign the branch, try each method; return whatever doesn't fail.
		testObject;
	try {
		testObject = standard.createXhrObject();
		return standard; // Return this if no error was thrown.
	} catch (e) {
		try {
			testObject = activeXNew.createXhrObject();
			return activeXNew; // Return this if no error was thrown.
		} catch (er) {
			try {
				testObject = activeXOld.createXhrObject();
				return activeXOld; // Return this if no error was thrown.
			} catch (err) {
				throw new Error('No XHR object found in this environment.');
			}
		}
	}
}());

window.poloAF.Hijax = function () {
    /*
    function closeKeepAlive() {
        if (/AppleWebKit|MSIE/.test(navigator.userAgent)) {
            var xhr = new XMLHttpRequest();
            xhr.open("GET", "/ping/close", false);
            xhr.send();
        }
    }
    */
    function dummy() {}
    function always(val) {
        return function () {
            return val;
        };
    }
    
	function fromPost(form) {
		var i,
			query = '';
		for (i = 0; i < form.elements.length; i += 1) {
			query += form.elements[i].name;
			query += "=";
			query += encodeURI(form.elements[i].value);
			query += "&";
		}
		return query;
	}

	function captureDataOnClick(flag) {
		//flag to override defaults
		if (!container) {
			return true;
		}
		var query = '';
		/* persisting with onclick for simplicites sake, setting click on inner element and subit on outer, the reverse prevents click from working*/
		if (container.nodeName.toLowerCase() === 'section' || flag) {
			container.onclick = function (e) {
				if (e.target.getAttribute("href") && ret.validate(e.target)) {
					query = e.target.getAttribute("href").split("?")[1];
					url += "?" + query;
					return !start();
				}
				return true;
			};
		} else if ((container.nodeName.toLowerCase() === 'form' || container.nodeName.toLowerCase() === 'main') && !flag) {
			container.onsubmit = function (e) {
				if (ret.validate(e.target)) {
					data = fromPost(e.target);
					return !start(); //needs to return false to cancel default action, so success will cancel
				}
				return true;
			};
		}
	}
	var container,
		url,
		canvas,
		data,
		loading = dummy,
		callback = dummy,
		request;

	function setContainer(value) {
		container = value;
	}

	function setUrl(value) {
		url = value;
	}

	function setCanvas(value) {
		canvas = value;
	}

	function setLoading(value) {
		loading = value;
	}

	function setCallback(value) {
		callback = value;
	}

	function start() {
		request = poloAF.SimpleXhrFactory.createXhrObject();
		if (!request || !url) {
			return false;
		} else {
			initiateRequest();
			return true;
		}
	}

	function completeRequest() {
		try {
			if (request.readyState == request.DONE /*4*/ ) {
				if (request.status == 200 || request.status == 304) {
					if (canvas) {
						if (request.responseText) {
							canvas.innerHTML = request.responseText;
						}
					}
					callback();
				}
			}
		} catch (e) {
			true;
		}
	}

	function initiateRequest() {
		loading();
		request.onreadystatechange = completeRequest;
		if (data) {
			request.open("POST", url, true);
			request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
			request.send(data);
		} else {
			request.open("GET", url, true);
			request.send(null);
		}
		//reset url
		url = url.split('?')[0];
	}
	var ret = {
		captureData: captureDataOnClick,
		validate: always(true), //override as required
		setContainer: setContainer,
		setUrl: setUrl,
		setCanvas: setCanvas,
		setLoading: setLoading,
		setCallback: setCallback
	};
	return ret;
};
/*https://stackoverflow.com/questions/19233415/how-to-make-type-number-to-positive-numbers-only for browsers that don't support the min attribute*/